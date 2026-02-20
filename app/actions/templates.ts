"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";

async function getSession() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  return session;
}

const upsertSchema = z.object({
  name: z.string().min(1).max(255),
  html: z.string().min(1),
});

export async function createTemplateAction(
  _prevState: { error?: string } | null,
  formData: FormData
): Promise<{ error?: string }> {
  const session = await getSession();

  const parsed = upsertSchema.safeParse({
    name: formData.get("name"),
    html: formData.get("html"),
  });
  if (!parsed.success) return { error: "Name and HTML are required." };

  await prisma.template.create({
    data: { userId: session.user.id, ...parsed.data },
  });

  revalidatePath("/app/templates");
  return {};
}

export async function updateTemplateAction(
  _prevState: { error?: string } | null,
  formData: FormData
): Promise<{ error?: string }> {
  const session = await getSession();
  const id = formData.get("id") as string;

  const parsed = upsertSchema.safeParse({
    name: formData.get("name"),
    html: formData.get("html"),
  });
  if (!parsed.success) return { error: "Name and HTML are required." };

  const existing = await prisma.template.findFirst({
    where: { id, userId: session.user.id },
  });
  if (!existing) return { error: "Not found." };

  await prisma.template.update({ where: { id }, data: parsed.data });
  revalidatePath("/app/templates");
  return {};
}

export async function deleteTemplateAction(
  _prevState: unknown,
  formData: FormData
): Promise<{ error?: string }> {
  const session = await getSession();
  const id = formData.get("id") as string;

  const existing = await prisma.template.findFirst({
    where: { id, userId: session.user.id },
  });
  if (!existing) return { error: "Not found." };

  await prisma.template.delete({ where: { id } });
  revalidatePath("/app/templates");
  return {};
}
