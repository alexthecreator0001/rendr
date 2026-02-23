"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import crypto from "node:crypto";
import { assertSafeUrl } from "@/lib/ssrf-guard";

async function getSession() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  return session;
}

const createSchema = z.object({
  url: z.string().url(),
  events: z.array(z.string()).min(1),
});

export async function createWebhookAction(
  _prevState: { error?: string } | null,
  formData: FormData
): Promise<{ error?: string }> {
  const session = await getSession();

  const rawEvents = formData.getAll("events") as string[];
  const parsed = createSchema.safeParse({ url: formData.get("url"), events: rawEvents });
  if (!parsed.success) return { error: "Valid URL and at least one event are required." };

  // SSRF guard: block private/internal URLs
  try {
    await assertSafeUrl(parsed.data.url);
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Invalid webhook URL." };
  }

  const secret = "whsec_" + crypto.randomBytes(32).toString("base64url");

  await prisma.webhook.create({
    data: {
      userId: session.user.id,
      url: parsed.data.url,
      events: parsed.data.events,
      secret,
    },
  });

  revalidatePath("/app/webhooks");
  return {};
}

export async function updateWebhookAction(
  _prevState: { error?: string } | null,
  formData: FormData
): Promise<{ error?: string }> {
  const session = await getSession();
  const id = formData.get("id") as string;

  const existing = await prisma.webhook.findFirst({
    where: { id, userId: session.user.id },
  });
  if (!existing) return { error: "Not found." };

  const rawEvents = formData.getAll("events") as string[];
  const url = formData.get("url") as string;

  await prisma.webhook.update({
    where: { id },
    data: {
      ...(url ? { url } : {}),
      ...(rawEvents.length ? { events: rawEvents } : {}),
    },
  });

  revalidatePath("/app/webhooks");
  return {};
}

export async function deleteWebhookAction(
  _prevState: unknown,
  formData: FormData
): Promise<{ error?: string }> {
  const session = await getSession();
  const id = formData.get("id") as string;

  const existing = await prisma.webhook.findFirst({
    where: { id, userId: session.user.id },
  });
  if (!existing) return { error: "Not found." };

  await prisma.webhook.delete({ where: { id } });
  revalidatePath("/app/webhooks");
  return {};
}

export async function toggleWebhookAction(
  _prevState: unknown,
  formData: FormData
): Promise<{ error?: string }> {
  const session = await getSession();
  const id = formData.get("id") as string;
  const enabled = formData.get("enabled") === "true";

  const existing = await prisma.webhook.findFirst({
    where: { id, userId: session.user.id },
  });
  if (!existing) return { error: "Not found." };

  await prisma.webhook.update({ where: { id }, data: { enabled } });
  revalidatePath("/app/webhooks");
  return {};
}
