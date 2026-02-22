"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

async function requireSession() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  return session.user;
}

async function requireTeamOwner(teamId: string) {
  const user = await requireSession();
  const team = await prisma.team.findUnique({
    where: { id: teamId },
    select: { ownerId: true },
  });
  if (!team) return { error: "Team not found." };
  if (team.ownerId !== user.id) return { error: "Only the team owner can perform this action." };
  return { userId: user.id };
}

// ─── Create team ─────────────────────────────────────────────────────────────

export async function createTeamAction(
  _: unknown,
  formData: FormData
): Promise<{ error?: string }> {
  const user = await requireSession();
  const name = (formData.get("name") as string)?.trim();
  if (!name || name.length < 2) return { error: "Team name must be at least 2 characters." };

  const team = await prisma.team.create({
    data: {
      name,
      ownerId: user.id,
      members: {
        create: { userId: user.id, role: "owner" },
      },
    },
  });

  revalidatePath("/app/teams");
  redirect(`/app/teams/${team.id}`);
}

// ─── Generate invite ──────────────────────────────────────────────────────────

export async function generateInviteAction(teamId: string): Promise<{ error?: string; url?: string }> {
  const result = await requireTeamOwner(teamId);
  if ("error" in result) return { error: result.error };

  const invite = await prisma.teamInvite.create({
    data: {
      teamId,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    },
  });

  const baseUrl = process.env.NEXTAUTH_URL ?? "http://localhost:3000";
  return { url: `${baseUrl}/invite/${invite.token}` };
}

// ─── Accept invite ────────────────────────────────────────────────────────────

export async function acceptInviteAction(token: string): Promise<{ error?: string; teamId?: string }> {
  const user = await requireSession();

  const invite = await prisma.teamInvite.findUnique({
    where: { token },
    include: { team: { select: { id: true, name: true } } },
  });

  if (!invite) return { error: "Invite not found or expired." };
  if (invite.usedAt) return { error: "This invite has already been used." };
  if (invite.expiresAt < new Date()) return { error: "This invite has expired." };

  // Check if already a member
  const existing = await prisma.teamMember.findUnique({
    where: { teamId_userId: { teamId: invite.teamId, userId: user.id } },
  });
  if (existing) return { teamId: invite.teamId };

  await prisma.$transaction([
    prisma.teamInvite.update({ where: { id: invite.id }, data: { usedAt: new Date() } }),
    prisma.teamMember.create({ data: { teamId: invite.teamId, userId: user.id, role: "member" } }),
  ]);

  revalidatePath("/app/teams");
  return { teamId: invite.teamId };
}

// ─── Remove member ────────────────────────────────────────────────────────────

export async function removeMemberAction(
  _: unknown,
  formData: FormData
): Promise<{ error?: string }> {
  const teamId = formData.get("teamId") as string;
  const userId = formData.get("userId") as string;
  if (!teamId || !userId) return { error: "Missing fields." };

  const result = await requireTeamOwner(teamId);
  if ("error" in result) return { error: result.error };
  if (userId === result.userId) return { error: "Owner cannot remove themselves." };

  await prisma.teamMember.deleteMany({ where: { teamId, userId } });
  revalidatePath(`/app/teams/${teamId}`);
  return {};
}

// ─── Leave team ───────────────────────────────────────────────────────────────

export async function leaveTeamAction(
  _: unknown,
  formData: FormData
): Promise<{ error?: string }> {
  const user = await requireSession();
  const teamId = formData.get("teamId") as string;
  if (!teamId) return { error: "Missing team ID." };

  const team = await prisma.team.findUnique({ where: { id: teamId }, select: { ownerId: true } });
  if (!team) return { error: "Team not found." };
  if (team.ownerId === user.id) return { error: "Owner must delete the team, not leave it." };

  await prisma.teamMember.deleteMany({ where: { teamId, userId: user.id } });
  revalidatePath("/app/teams");
  redirect("/app/teams");
}

// ─── Delete team ──────────────────────────────────────────────────────────────

export async function deleteTeamAction(
  _: unknown,
  formData: FormData
): Promise<{ error?: string }> {
  const teamId = formData.get("teamId") as string;
  if (!teamId) return { error: "Missing team ID." };

  const result = await requireTeamOwner(teamId);
  if ("error" in result) return { error: result.error };

  await prisma.team.delete({ where: { id: teamId } });
  revalidatePath("/app/teams");
  redirect("/app/teams");
}
