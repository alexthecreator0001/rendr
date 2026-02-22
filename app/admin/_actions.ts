"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  // Always verify from DB — never trust JWT alone for admin actions
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });
  if (user?.role !== "admin") redirect("/app");

  return session.user.id;
}

export async function promoteUserAction(
  _: unknown,
  formData: FormData
): Promise<{ error?: string }> {
  await requireAdmin();
  const userId = formData.get("userId") as string;
  const newRole = formData.get("role") as string;
  if (!userId || !["user", "admin"].includes(newRole)) return { error: "Invalid." };

  await prisma.user.update({ where: { id: userId }, data: { role: newRole } });
  revalidatePath("/admin/users");
  return {};
}

export async function changePlanAction(
  _: unknown,
  formData: FormData
): Promise<{ error?: string }> {
  await requireAdmin();
  const userId = formData.get("userId") as string;
  const plan = formData.get("plan") as string;
  const validPlans = ["starter", "growth", "pro"];
  if (!userId || !validPlans.includes(plan)) return { error: "Invalid plan." };

  await prisma.user.update({ where: { id: userId }, data: { plan } });
  revalidatePath("/admin/users");
  return {};
}

export async function deleteUserAction(
  _: unknown,
  formData: FormData
): Promise<{ error?: string }> {
  const adminId = await requireAdmin();
  const userId = formData.get("userId") as string;

  if (!userId) return { error: "Missing user ID." };
  if (userId === adminId) return { error: "You cannot delete your own account." };

  await prisma.user.delete({ where: { id: userId } });
  revalidatePath("/admin/users");
  return {};
}
