import { prisma } from "@/lib/db";
import { AdminUsersClient } from "./users-client";

export const metadata = { title: "Users" };

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const { q = "", page = "1" } = await searchParams;
  const pageNum = Math.max(1, parseInt(page, 10));
  const pageSize = 25;

  const where = q
    ? { email: { contains: q, mode: "insensitive" as const } }
    : {};

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (pageNum - 1) * pageSize,
      take: pageSize,
      select: {
        id: true,
        email: true,
        plan: true,
        role: true,
        emailVerified: true,
        createdAt: true,
        _count: { select: { jobs: true, apiKeys: true } },
      },
    }),
    prisma.user.count({ where }),
  ]);

  return (
    <AdminUsersClient
      users={users.map((u) => ({
        ...u,
        emailVerified: u.emailVerified?.toISOString() ?? null,
        createdAt: u.createdAt.toISOString(),
      }))}
      total={total}
      page={pageNum}
      pageSize={pageSize}
      query={q}
    />
  );
}
