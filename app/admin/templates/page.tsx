import type { Metadata } from "next";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { AdminTemplatesClient } from "./templates-client";

export const metadata: Metadata = { title: "Default Templates — Admin" };

export default async function AdminTemplatesPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });
  if (user?.role !== "admin") redirect("/app");

  // Show only the admin's own templates — these serve as the canonical defaults
  const templates = await prisma.template.findMany({
    where: { userId: session.user.id },
    orderBy: { updatedAt: "desc" },
    select: { id: true, name: true, html: true, coverImageUrl: true, createdAt: true, updatedAt: true },
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
      <AdminTemplatesClient
        templates={templates.map((t) => ({
          ...t,
          createdAt: t.createdAt.toISOString(),
          updatedAt: t.updatedAt.toISOString(),
        }))}
        adminUserId={session.user.id}
      />
    </div>
  );
}
