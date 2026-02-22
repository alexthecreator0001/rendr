import type { Metadata } from "next";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { AdminTemplatesClient } from "./templates-client";

export const metadata: Metadata = { title: "Templates — Admin" };

export default async function AdminTemplatesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });
  if (user?.role !== "admin") redirect("/app");

  const { page: rawPage } = await searchParams;
  const page = Math.max(1, parseInt(rawPage ?? "1", 10) || 1);
  const pageSize = 25;

  const [templates, total, users] = await Promise.all([
    prisma.template.findMany({
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: {
        user: { select: { email: true } },
        team: { select: { name: true } },
        _count: { select: { jobs: true } },
      },
    }),
    prisma.template.count(),
    prisma.user.findMany({
      select: { id: true, email: true },
      orderBy: { email: "asc" },
      take: 200,
    }),
  ]);

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
      <AdminTemplatesClient
        templates={templates}
        users={users}
        page={page}
        totalPages={totalPages}
        total={total}
      />
    </div>
  );
}
