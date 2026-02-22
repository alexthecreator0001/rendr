import { prisma } from "@/lib/db";
import { AdminSupportClient } from "./support-client";

export const metadata = { title: "Support" };

export default async function AdminSupportPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; page?: string }>;
}) {
  const { status = "all", page = "1" } = await searchParams;
  const pageNum = Math.max(1, parseInt(page, 10));
  const pageSize = 25;

  const validStatuses = ["open", "in_progress", "resolved", "closed"];
  const where = validStatuses.includes(status) ? { status } : {};

  const [tickets, total] = await Promise.all([
    prisma.supportTicket.findMany({
      where,
      orderBy: [
        { status: "asc" }, // open first
        { createdAt: "desc" },
      ],
      skip: (pageNum - 1) * pageSize,
      take: pageSize,
      select: {
        id: true, email: true, subject: true, message: true,
        status: true, priority: true, createdAt: true,
      },
    }),
    prisma.supportTicket.count({ where }),
  ]);

  return (
    <AdminSupportClient
      tickets={tickets.map((t) => ({
        ...t,
        createdAt: t.createdAt.toISOString(),
      }))}
      total={total}
      statusFilter={status}
    />
  );
}
