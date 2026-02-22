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
  revalidatePath("/admin/subscriptions");
  return {};
}

export async function banUserAction(
  _: unknown,
  formData: FormData
): Promise<{ error?: string }> {
  const adminId = await requireAdmin();
  const userId = formData.get("userId") as string;

  if (!userId) return { error: "Missing user ID." };
  if (userId === adminId) return { error: "You cannot ban yourself." };

  await prisma.user.update({
    where: { id: userId },
    data: { bannedAt: new Date() },
  });
  revalidatePath("/admin/users");
  return {};
}

export async function unbanUserAction(
  _: unknown,
  formData: FormData
): Promise<{ error?: string }> {
  await requireAdmin();
  const userId = formData.get("userId") as string;
  if (!userId) return { error: "Missing user ID." };

  await prisma.user.update({
    where: { id: userId },
    data: { bannedAt: null },
  });
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

// ─── Admin: Template management ───────────────────────────────────────────────

export async function createAdminTemplateAction(
  _: unknown,
  formData: FormData
): Promise<{ error?: string }> {
  await requireAdmin();
  const userId = formData.get("userId") as string;
  const name = (formData.get("name") as string)?.trim();
  const html = (formData.get("html") as string)?.trim();
  const coverImageUrl = (formData.get("coverImageUrl") as string)?.trim() || null;

  if (!userId) return { error: "Select a user." };
  if (!name || name.length < 2) return { error: "Name too short." };
  if (!html) return { error: "HTML is required." };

  await prisma.template.create({ data: { userId, name, html, coverImageUrl } });
  revalidatePath("/admin/templates");
  return {};
}

export async function updateAdminTemplateAction(
  _: unknown,
  formData: FormData
): Promise<{ error?: string }> {
  await requireAdmin();
  const id = formData.get("id") as string;
  const name = (formData.get("name") as string)?.trim();
  const html = (formData.get("html") as string)?.trim();
  const coverImageUrl = (formData.get("coverImageUrl") as string)?.trim() || null;

  if (!id) return { error: "Missing template ID." };
  if (!name || name.length < 2) return { error: "Name too short." };
  if (!html) return { error: "HTML is required." };

  await prisma.template.update({ where: { id }, data: { name, html, coverImageUrl } });
  revalidatePath("/admin/templates");
  revalidatePath("/app/templates");
  return {};
}

export async function deleteAdminTemplateAction(
  _: unknown,
  formData: FormData
): Promise<{ error?: string }> {
  await requireAdmin();
  const id = formData.get("id") as string;
  if (!id) return { error: "Missing template ID." };

  await prisma.template.delete({ where: { id } });
  revalidatePath("/admin/templates");
  revalidatePath("/app/templates");
  return {};
}

// ─── Admin: Blog management ───────────────────────────────────────────────────

function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

export async function createBlogPostAction(
  _: unknown,
  formData: FormData
): Promise<{ error?: string }> {
  await requireAdmin();
  const title = (formData.get("title") as string)?.trim();
  const excerpt = (formData.get("excerpt") as string)?.trim();
  const content = (formData.get("content") as string)?.trim();
  const tag = (formData.get("tag") as string)?.trim() || "Engineering";
  const published = formData.get("published") === "true";

  if (!title || title.length < 3) return { error: "Title too short." };
  if (!excerpt) return { error: "Excerpt is required." };
  if (!content) return { error: "Content is required." };

  const baseSlug = slugify(title);
  let slug = baseSlug;
  let counter = 1;
  while (await prisma.blogPost.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${counter++}`;
  }

  await prisma.blogPost.create({
    data: {
      slug,
      title,
      excerpt,
      content,
      tag,
      published,
      publishedAt: published ? new Date() : null,
    },
  });

  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  return {};
}

export async function updateBlogPostAction(
  _: unknown,
  formData: FormData
): Promise<{ error?: string }> {
  await requireAdmin();
  const id = formData.get("id") as string;
  const title = (formData.get("title") as string)?.trim();
  const excerpt = (formData.get("excerpt") as string)?.trim();
  const content = (formData.get("content") as string)?.trim();
  const tag = (formData.get("tag") as string)?.trim() || "Engineering";
  const published = formData.get("published") === "true";

  if (!id) return { error: "Missing post ID." };
  if (!title || title.length < 3) return { error: "Title too short." };
  if (!excerpt) return { error: "Excerpt is required." };
  if (!content) return { error: "Content is required." };

  const existing = await prisma.blogPost.findUnique({ where: { id }, select: { published: true, publishedAt: true } });
  if (!existing) return { error: "Post not found." };

  await prisma.blogPost.update({
    where: { id },
    data: {
      title,
      excerpt,
      content,
      tag,
      published,
      publishedAt: published && !existing.publishedAt ? new Date() : existing.publishedAt,
    },
  });

  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  return {};
}

export async function deleteBlogPostAction(
  _: unknown,
  formData: FormData
): Promise<{ error?: string }> {
  await requireAdmin();
  const id = formData.get("id") as string;
  if (!id) return { error: "Missing post ID." };

  await prisma.blogPost.delete({ where: { id } });
  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  return {};
}

export async function toggleBlogPublishedAction(
  _: unknown,
  formData: FormData
): Promise<{ error?: string }> {
  await requireAdmin();
  const id = formData.get("id") as string;
  if (!id) return { error: "Missing post ID." };

  const post = await prisma.blogPost.findUnique({ where: { id }, select: { published: true, publishedAt: true } });
  if (!post) return { error: "Post not found." };

  await prisma.blogPost.update({
    where: { id },
    data: {
      published: !post.published,
      publishedAt: !post.published && !post.publishedAt ? new Date() : post.publishedAt,
    },
  });

  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  return {};
}
