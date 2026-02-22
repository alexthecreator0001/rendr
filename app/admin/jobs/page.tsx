import { prisma } from "@/lib/db";

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
        createdAt: true,
        updatedAt: true,
        errorMessage: true,
        user: { select: { email: true } },
      },
    }),
    prisma.job.count({ where }),
  ]);

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="mx-auto max-w-6xl px-6 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Jobs</h1>
        <p className="text-sm text-muted-foreground mt-1">{total.toLocaleString()} jobs</p>
      </div>

      {/* Status filter */}
      <div className="flex gap-2 flex-wrap">
        {STATUS_FILTER.map((s) => (
          <a
            key={s}
            href={`/admin/jobs?status=${s}`}
            className={`rounded-lg px-3 py-1.5 text-[12px] font-medium capitalize transition-colors ${
              status === s
                ? "bg-foreground text-background"
                : "border border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            {s}
          </a>
        ))}
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Job ID</th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">User</th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Status</th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Type</th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Duration</th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Created</th>
            </tr>
          </thead>
          <tbody>
            {jobs.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-sm text-muted-foreground">
                  No jobs found.
                </td>
              </tr>
            ) : (
              jobs.map((j) => {
                const duration =
                  j.status === "succeeded" || j.status === "failed"
                    ? j.updatedAt.getTime() - j.createdAt.getTime()
                    : null;
                const statusColors: Record<string, string> = {
                  succeeded: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
                  failed: "bg-red-500/10 text-red-400 border-red-500/20",
                  processing: "bg-blue-500/10 text-blue-400 border-blue-500/20",
                  queued: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
                };
                return (
                  <tr key={j.id} className="border-b border-border hover:bg-muted/20 transition-colors">
                    <td className="px-4 py-3 font-mono text-[12px] text-muted-foreground">
                      {j.id.slice(0, 14)}…
                    </td>
                    <td className="px-4 py-3 text-[13px] truncate max-w-[160px]">{j.user.email}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold ${statusColors[j.status]}`}>
                        {j.status}
                      </span>
                      {j.errorMessage && (
                        <p className="mt-0.5 text-[10px] text-red-400/70 truncate max-w-[120px]">{j.errorMessage}</p>
                      )}
                    </td>
                    <td className="px-4 py-3 text-[12px] text-muted-foreground capitalize">{j.inputType}</td>
                    <td className="px-4 py-3 text-[12px] text-muted-foreground">
                      {duration !== null ? `${duration}ms` : "—"}
                    </td>
                    <td className="px-4 py-3 text-[12px] text-muted-foreground">
                      {j.createdAt.toLocaleString()}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">Page {pageNum} of {totalPages}</p>
          <div className="flex gap-2">
            {pageNum > 1 && (
              <a href={`/admin/jobs?status=${status}&page=${pageNum - 1}`} className="rounded-lg border border-border px-3 py-1.5 text-sm hover:bg-accent transition-colors">← Prev</a>
            )}
            {pageNum < totalPages && (
              <a href={`/admin/jobs?status=${status}&page=${pageNum + 1}`} className="rounded-lg border border-border px-3 py-1.5 text-sm hover:bg-accent transition-colors">Next →</a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
