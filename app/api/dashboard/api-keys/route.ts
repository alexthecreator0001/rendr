import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [keys, jobCounts] = await Promise.all([
    prisma.apiKey.findMany({
      where: { userId: session.user.id },
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
        userId: session.user.id,
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
