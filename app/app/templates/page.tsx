import type { Metadata } from "next";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { seedStarterTemplates } from "@/lib/starter-templates";
import { TemplatesClient } from "./templates-client";

export const metadata: Metadata = { title: "Templates" };

export default async function TemplatesPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  let templates = await prisma.template.findMany({
    where: { userId: session.user.id },
    orderBy: { updatedAt: "desc" },
    select: { id: true, name: true, html: true, createdAt: true, updatedAt: true },
  });

  // Auto-seed starter templates for users who have none (e.g. registered before seeding was added)
  if (templates.length === 0) {
    await seedStarterTemplates(session.user.id, prisma);
    templates = await prisma.template.findMany({
      where: { userId: session.user.id },
      orderBy: { updatedAt: "desc" },
      select: { id: true, name: true, html: true, createdAt: true, updatedAt: true },
    });
  }

  return (
    <div className="px-4 py-6 sm:px-6 sm:py-8">
      <TemplatesClient templates={templates} />
    </div>
  );
}
