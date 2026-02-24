import type { Metadata } from "next";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { TeamTemplatesClient } from "./templates-client";

export const metadata: Metadata = { title: "Team Templates" };

export default async function TeamTemplatesPage({
  params,
}: {
  params: Promise<{ teamId: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const { teamId } = await params;

  const templates = await prisma.template.findMany({
    where: { teamId },
    orderBy: { updatedAt: "desc" },
    select: { id: true, name: true, html: true, coverImageUrl: true, createdAt: true, updatedAt: true },
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
      <TeamTemplatesClient templates={templates} teamId={teamId} />
    </div>
  );
}
