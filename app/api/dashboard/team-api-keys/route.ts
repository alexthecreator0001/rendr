import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const teamId = req.nextUrl.searchParams.get("teamId");
  if (!teamId) {
    return NextResponse.json({ error: "Missing teamId" }, { status: 400 });
  }

  // Verify membership
  const membership = await prisma.teamMember.findUnique({
    where: { teamId_userId: { teamId, userId: session.user.id } },
  });
  if (!membership) {
    return NextResponse.json({ error: "Not a member" }, { status: 403 });
  }

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [keys, jobCounts] = await Promise.all([
    prisma.apiKey.findMany({
      where: { teamId },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        keyPrefix: true,
        revokedAt: true,
        createdAt: true,
        lastUsedAt: true,
      },
    }),
    prisma.job.groupBy({
      by: ["apiKeyId"],
      where: {
        teamId,
        apiKeyId: { not: null },
        createdAt: { gte: startOfMonth },
      },
      _count: { _all: true },
    }),
  ]);

  const countMap = Object.fromEntries(
    jobCounts.map((g) => [g.apiKeyId!, g._count._all])
  );

  return NextResponse.json(
    keys.map((k) => ({ ...k, rendersThisMonth: countMap[k.id] ?? 0 }))
  );
}
