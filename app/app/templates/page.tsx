import type { Metadata } from "next";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { seedStarterTemplates } from "@/lib/starter-templates";
import { TemplatesClient } from "./templates-client";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Templates" };

export default async function TemplatesPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  // Auto-seed any missing starter templates (adds new ones without touching existing)
  await seedStarterTemplates(session.user.id, prisma);

  const templates = await prisma.template.findMany({
    where: { userId: session.user.id },
    orderBy: { updatedAt: "desc" },
    select: { id: true, name: true, html: true, coverImageUrl: true, createdAt: true, updatedAt: true },
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
      <TemplatesClient templates={templates} />
    </div>
  );
}
