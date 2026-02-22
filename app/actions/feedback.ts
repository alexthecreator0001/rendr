"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

async function requireSession() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  return session.user;
}

async function requireAdmin() {
  const user = await requireSession();
  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { role: true },
  });
  if (dbUser?.role !== "admin") redirect("/app");
  return user.id;
}

// ─── User-facing: Support ────────────────────────────────────────────────────

export async function submitSupportTicketAction(
  _: unknown,
  formData: FormData
): Promise<{ error?: string; success?: boolean }> {
  const user = await requireSession();
  const subject = (formData.get("subject") as string)?.trim();
  const message = (formData.get("message") as string)?.trim();
  const priority = (formData.get("priority") as string) || "normal";

  if (!subject || subject.length < 5) return { error: "Subject too short." };
  if (!message || message.length < 10) return { error: "Message too short." };
  if (!["low", "normal", "high", "urgent"].includes(priority)) return { error: "Invalid priority." };

  await prisma.supportTicket.create({
    data: {
      userId: user.id,
      email: user.email ?? "",
      subject,
      message,
      priority,
    },
  });

  revalidatePath("/app/support");
  return { success: true };
}

// ─── User-facing: Features ───────────────────────────────────────────────────

export async function submitFeatureRequestAction(
  _: unknown,
  formData: FormData
): Promise<{ error?: string; success?: boolean }> {
  const user = await requireSession();
  const title = (formData.get("title") as string)?.trim();
  const description = (formData.get("description") as string)?.trim();

  if (!title || title.length < 5) return { error: "Title too short." };
  if (!description || description.length < 10) return { error: "Description too short." };

  await prisma.featureRequest.create({
    data: { userId: user.id, title, description },
  });

  revalidatePath("/app/features");
  return { success: true };
}

export async function toggleVoteAction(featureRequestId: string): Promise<{ error?: string }> {
  const user = await requireSession();

  const existing = await prisma.featureVote.findUnique({
    where: { userId_featureRequestId: { userId: user.id, featureRequestId } },
  });

  if (existing) {
    await prisma.featureVote.delete({ where: { id: existing.id } });
  } else {
    await prisma.featureVote.create({ data: { userId: user.id, featureRequestId } });
  }

  revalidatePath("/app/features");
  return {};
}

// ─── Admin: Support tickets ──────────────────────────────────────────────────

export async function updateTicketStatusAction(
  _: unknown,
  formData: FormData
): Promise<{ error?: string }> {
  await requireAdmin();
  const ticketId = formData.get("ticketId") as string;
  const status = formData.get("status") as string;
  const valid = ["open", "in_progress", "resolved", "closed"];

  if (!ticketId || !valid.includes(status)) return { error: "Invalid." };

  await prisma.supportTicket.update({ where: { id: ticketId }, data: { status } });
  revalidatePath("/admin/support");
  return {};
}

// ─── Admin: Feature requests ─────────────────────────────────────────────────

export async function updateFeatureStatusAction(
  _: unknown,
  formData: FormData
): Promise<{ error?: string }> {
  await requireAdmin();
  const featureId = formData.get("featureId") as string;
  const status = formData.get("status") as string;
  const valid = ["submitted", "planned", "in_progress", "shipped", "declined"];

  if (!featureId || !valid.includes(status)) return { error: "Invalid." };

  await prisma.featureRequest.update({ where: { id: featureId }, data: { status } });
  revalidatePath("/admin/features");
  return {};
}
