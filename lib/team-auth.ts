import { prisma } from "./db";

/**
 * Verify that a user is a member of a team.
 * Returns the team and ownership flag, or an error string.
 */
export async function requireTeamMember(
  teamId: string,
  userId: string
): Promise<
  | { team: { id: string; name: string; ownerId: string }; isOwner: boolean; error?: never }
  | { error: string; team?: never; isOwner?: never }
> {
  const team = await prisma.team.findUnique({
    where: { id: teamId },
    select: { id: true, name: true, ownerId: true },
  });

  if (!team) return { error: "Team not found." };

  const membership = await prisma.teamMember.findUnique({
    where: { teamId_userId: { teamId, userId } },
  });

  if (!membership) return { error: "You are not a member of this team." };

  return { team, isOwner: team.ownerId === userId };
}
