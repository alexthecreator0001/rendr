import { prisma } from "@/lib/db";
import { Users, BriefcaseBusiness, CheckCircle, XCircle, Clock } from "lucide-react";

export const metadata = { title: "Admin Overview" };

export default async function AdminOverviewPage() {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const [
    totalUsers,
    newUsersThisMonth,
    totalJobs,
    succeededJobs,
    failedJobs,
    processingJobs,
    recentUsers,
    recentJobs,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { createdAt: { gte: monthStart } } }),
    prisma.job.count(),
    prisma.job.count({ where: { status: "succeeded" } }),
    prisma.job.count({ where: { status: "failed" } }),
    prisma.job.count({ where: { status: { in: ["queued", "processing"] } } }),
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      take: 8,
      select: { id: true, email: true, plan: true, role: true, createdAt: true },
    }),
    prisma.job.findMany({
      orderBy: { createdAt: "desc" },
      take: 10,
      select: {
        id: true,
        status: true,
        inputType: true,
        createdAt: true,
        updatedAt: true,
        user: { select: { email: true } },
      },
    }),
  ]);

  const stats = [
    { label: "Total users", value: totalUsers, sub: `+${newUsersThisMonth} this month`, icon: Users, color: "text-blue-400" },
    { label: "Total jobs", value: totalJobs, sub: `${processingJobs} active`, icon: BriefcaseBusiness, color: "text-violet-400" },
    { label: "Succeeded", value: succeededJobs, sub: `${totalJobs ? Math.round((succeededJobs / totalJobs) * 100) : 0}% success rate`, icon: CheckCircle, color: "text-emerald-400" },
    { label: "Failed", value: failedJobs, sub: "all time", icon: XCircle, color: "text-red-400" },
  ];

  return (
    <div className="mx-auto max-w-6xl px-6 py-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Overview</h1>
        <p className="text-sm text-muted-foreground mt-1">System-wide stats at a glance.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">{s.label}</p>
              <s.icon className={`h-4 w-4 ${s.color}`} />
            </div>
            <p className="text-3xl font-bold tracking-tight">{s.value.toLocaleString()}</p>
            <p className="mt-1 text-xs text-muted-foreground">{s.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent users */}
        <div className="rounded-xl border border-border bg-card">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <h2 className="text-sm font-semibold">Recent users</h2>
            <a href="/admin/users" className="text-xs text-muted-foreground hover:text-foreground transition-colors">View all →</a>
          </div>
          <div className="divide-y divide-border">
            {recentUsers.map((u) => (
              <div key={u.id} className="flex items-center justify-between px-5 py-3">
                <div>
                  <p className="text-[13px] font-medium truncate max-w-[200px]">{u.email}</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    {u.createdAt.toLocaleDateString()} · {u.plan}
                  </p>
                </div>
                {u.role === "admin" && (
                  <span className="rounded-full border border-red-500/30 bg-red-500/10 px-2 py-0.5 text-[10px] font-semibold text-red-400">
                    admin
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Recent jobs */}
        <div className="rounded-xl border border-border bg-card">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <h2 className="text-sm font-semibold">Recent jobs</h2>
            <a href="/admin/jobs" className="text-xs text-muted-foreground hover:text-foreground transition-colors">View all →</a>
          </div>
          <div className="divide-y divide-border">
            {recentJobs.map((j) => {
              const durationMs =
                j.status === "succeeded" || j.status === "failed"
                  ? j.updatedAt.getTime() - j.createdAt.getTime()
                  : null;
              return (
                <div key={j.id} className="flex items-center justify-between px-5 py-3">
                  <div>
                    <p className="text-[12px] font-mono text-muted-foreground">{j.id.slice(0, 14)}…</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5 truncate max-w-[180px]">
                      {j.user.email} · {j.inputType}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {durationMs !== null && (
                      <span className="text-[10px] text-muted-foreground/60">{durationMs}ms</span>
                    )}
                    <StatusBadge status={j.status} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    succeeded: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    failed: "bg-red-500/10 text-red-400 border-red-500/20",
    processing: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    queued: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
  };
  return (
    <span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold ${map[status] ?? ""}`}>
      {status}
    </span>
  );
}
