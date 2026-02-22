import { prisma } from "@/lib/db";
import { AdminFeaturesClient } from "./features-client";

export const metadata = { title: "Feature Requests" };

export default async function AdminFeaturesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status = "all" } = await searchParams;

  const validStatuses = ["submitted", "planned", "in_progress", "shipped", "declined"];
  const where = validStatuses.includes(status) ? { status } : {};

  const [features, total] = await Promise.all([
    prisma.featureRequest.findMany({
      where,
      orderBy: { createdAt: "desc" },
      select: {
        id: true, title: true, description: true, status: true, createdAt: true,
        user: { select: { email: true } },
        _count: { select: { votes: true } },
      },
    }),
    prisma.featureRequest.count({ where }),
  ]);

  // Sort by votes desc
  const sorted = features.sort((a, b) => b._count.votes - a._count.votes);

  return (
    <AdminFeaturesClient
      features={sorted.map((f) => ({
        id: f.id,
        title: f.title,
        description: f.description,
        status: f.status,
        createdAt: f.createdAt.toISOString(),
        votes: f._count.votes,
        userEmail: f.user.email,
      }))}
      total={total}
      statusFilter={status}
    />
  );
}
