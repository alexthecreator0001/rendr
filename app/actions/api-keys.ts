"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { generateApiKey } from "@/lib/api-key";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { sendApiKeyCreatedEmail } from "@/lib/email";

async function getSession() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  return session;
}

const createSchema = z.object({
  name: z.string().min(1).max(100),
});

export async function createApiKeyAction(
  _prevState: { error?: string; key?: string; id?: string } | null,
  formData: FormData
): Promise<{ error?: string; key?: string; id?: string }> {
  const session = await getSession();

  const parsed = createSchema.safeParse({ name: formData.get("name") });
  if (!parsed.success) {
    return { error: "Name is required." };
  }

  const { key, keyHash, keyPrefix } = generateApiKey();

  const apiKey = await prisma.apiKey.create({
    data: {
      userId: session.user.id,
      name: parsed.data.name,
      keyHash,
      keyPrefix,
    },
  });

  // Send notification email in background
  const user = await prisma.user.findUnique({ where: { id: session.user.id }, select: { email: true } });
  if (user) sendApiKeyCreatedEmail(user.email, parsed.data.name, keyPrefix).catch(() => {});

  revalidatePath("/app/api-keys");
  return { key, id: apiKey.id };
}

export async function revokeApiKeyAction(
  _prevState: unknown,
  formData: FormData
): Promise<{ error?: string }> {
  const session = await getSession();
  const id = formData.get("id") as string;

  if (!id) return { error: "Missing key ID." };

  const existing = await prisma.apiKey.findFirst({
    where: { id, userId: session.user.id },
  });

  if (!existing) return { error: "Not found." };
  if (existing.revokedAt) return { error: "Already revoked." };

  await prisma.apiKey.update({
    where: { id },
    data: { revokedAt: new Date() },
  });

  revalidatePath("/app/api-keys");
  return {};
}
