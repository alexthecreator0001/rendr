import type { Metadata } from "next";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { TemplatesClient } from "./templates-client";

export const metadata: Metadata = { title: "Templates" };

export default async function TemplatesPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const templates = await prisma.template.findMany({
    where: { userId: session.user.id },
    orderBy: { updatedAt: "desc" },
    select: { id: true, name: true, html: true, createdAt: true, updatedAt: true },
  });

  return <TemplatesClient templates={templates} />;
}
