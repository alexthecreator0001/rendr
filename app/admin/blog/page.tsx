import type { Metadata } from "next";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { AdminBlogClient } from "./blog-client";

export const metadata: Metadata = { title: "Blog — Admin" };

export default async function AdminBlogPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });
  if (user?.role !== "admin") redirect("/app");

  const posts = await prisma.blogPost.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="px-4 py-6 sm:px-6 sm:py-8">
      <AdminBlogClient posts={posts} />
    </div>
  );
}
