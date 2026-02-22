import type { Metadata } from "next";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { redirect, notFound } from "next/navigation";
import { TeamClient } from "./team-client";

export const metadata: Metadata = { title: "Team" };

export default async function TeamDetailPage({ params }: { params: Promise<{ teamId: string }> }) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  const userId = session.user.id;

  const { teamId } = await params;

  const team = await prisma.team.findUnique({
    where: { id: teamId },
    include: {
      members: {
        include: { user: { select: { id: true, email: true } } },
        orderBy: { joinedAt: "asc" },
      },
      templates: {
        orderBy: { updatedAt: "desc" },
        select: { id: true, name: true, createdAt: true, updatedAt: true },
      },
    },
  });

  if (!team) notFound();

  // Must be a member
  const isMember = team.members.some((m) => m.userId === userId);
  if (!isMember) redirect("/app/teams");

  const isOwner = team.ownerId === userId;

  return (
    <div className="px-4 py-6 sm:px-6 sm:py-8">
      <TeamClient team={team} userId={userId} isOwner={isOwner} />
    </div>
  );
}
