import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { JobStatus } from "@prisma/client";

function StatusPill({ status }: { status: string }) {
  const map: Record<string, string> = {
    queued: "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400",
    processing: "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    succeeded: "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    failed: "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  };
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${map[status] ?? map.queued}`}>
      {status}
    </span>
  );
}

const VALID_STATUSES = ["queued", "processing", "succeeded", "failed"] as const;

export default async function JobsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  const userId = session.user.id;

  const { status: rawStatus } = await searchParams;
  const statusFilter = VALID_STATUSES.find((s) => s === rawStatus);

  const jobs = await prisma.job.findMany({
    where: {
      userId,
      ...(statusFilter ? { status: statusFilter as JobStatus } : {}),
    },
    orderBy: { createdAt: "desc" },
    take: 100,
    select: {
      id: true,
      status: true,
      inputType: true,
      createdAt: true,
      downloadToken: true,
      errorMessage: true,
    },
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Jobs</h1>
          <p className="text-sm text-muted-foreground mt-1">All your PDF render jobs.</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {([undefined, "queued", "processing", "succeeded", "failed"] as const).map((s) => (
            <a
              key={s ?? "all"}
              href={s ? `/app/jobs?status=${s}` : "/app/jobs"}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                statusFilter === s
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              {s ?? "All"}
            </a>
          ))}
        </div>
      </div>

      {jobs.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border py-16 text-center">
          <p className="text-sm text-muted-foreground">
            No jobs found{statusFilter ? ` with status "${statusFilter}"` : ""}.
          </p>
        </div>
      ) : (
        <div className="rounded-xl border border-border overflow-hidden overflow-x-auto">
          <table className="w-full text-sm min-w-[500px]">
            <thead className="bg-muted/40">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Job ID</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Type</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground hidden sm:table-cell">Created</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">PDF</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {jobs.map((job) => (
                <tr key={job.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{job.id.slice(0, 8)}…</td>
                  <td className="px-4 py-3 capitalize">{job.inputType}</td>
                  <td className="px-4 py-3"><StatusPill status={job.status} /></td>
                  <td className="px-4 py-3 text-muted-foreground text-xs hidden sm:table-cell">
                    {new Date(job.createdAt).toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    {job.downloadToken ? (
                      <a
                        href={`/api/v1/files/${job.downloadToken}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-primary hover:underline"
                      >
                        Download
                      </a>
                    ) : job.status === "failed" ? (
                      <span className="text-xs text-destructive" title={job.errorMessage ?? undefined}>Failed</span>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
