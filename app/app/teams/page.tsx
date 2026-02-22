import type { Metadata } from "next";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { TeamsClient } from "./teams-client";

export const metadata: Metadata = { title: "Teams" };

export default async function TeamsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  const userId = session.user.id;

  const [ownedTeams, memberships] = await Promise.all([
    prisma.team.findMany({
      where: { ownerId: userId },
      include: { _count: { select: { members: true } } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.teamMember.findMany({
      where: { userId, role: "member" },
      include: {
        team: {
          include: { _count: { select: { members: true } } },
        },
      },
      orderBy: { joinedAt: "desc" },
    }),
  ]);

  const memberTeams = memberships.map((m) => m.team);

  return (
    <div className="px-4 py-6 sm:px-6 sm:py-8">
      <TeamsClient ownedTeams={ownedTeams} memberTeams={memberTeams} />
    </div>
  );
}
