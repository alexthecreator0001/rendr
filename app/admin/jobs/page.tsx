import { prisma } from "@/lib/db";
import { AdminJobsClient } from "./jobs-client";

export const metadata = { title: "Jobs" };

const STATUS_FILTER = ["all", "queued", "processing", "succeeded", "failed"] as const;

export default async function AdminJobsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; page?: string }>;
}) {
  const { status = "all", page = "1" } = await searchParams;
  const pageNum = Math.max(1, parseInt(page, 10));
  const pageSize = 30;

  const where =
    status !== "all"
      ? { status: status as "queued" | "processing" | "succeeded" | "failed" }
      : {};

  const [jobs, total] = await Promise.all([
    prisma.job.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (pageNum - 1) * pageSize,
      take: pageSize,
      select: {
        id: true,
        status: true,
        inputType: true,
        inputContent: true,
        optionsJson: true,
        errorCode: true,
        errorMessage: true,
        resultUrl: true,
        downloadToken: true,
        templateId: true,
        createdAt: true,
        updatedAt: true,
        user: { select: { email: true } },
        template: { select: { name: true } },
      },
    }),
    prisma.job.count({ where }),
  ]);

  const totalPages = Math.ceil(total / pageSize);

  // Serialize dates for client component
  const serializedJobs = jobs.map((j) => ({
    ...j,
    createdAt: j.createdAt.toISOString(),
    updatedAt: j.updatedAt.toISOString(),
  }));

  return (
    <AdminJobsClient
      jobs={serializedJobs}
      total={total}
      totalPages={totalPages}
      pageNum={pageNum}
      status={status}
      statusFilters={STATUS_FILTER as unknown as string[]}
    />
  );
}
