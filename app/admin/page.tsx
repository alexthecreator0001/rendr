import { prisma } from "@/lib/db";
import { Users, BriefcaseBusiness, CheckCircle, XCircle, TrendingUp, Clock } from "lucide-react";

export const dynamic = "force-dynamic";
export const metadata = { title: "Admin Overview" };

// ─── SVG Bar Chart ────────────────────────────────────────────────────────────
function BarChart({ data }: { data: { label: string; value: number }[] }) {
  const max = Math.max(...data.map((d) => d.value), 1);
  const W = 560;
  const barW = 24;
  const gap = 8;
  const chartW = data.length * barW + (data.length - 1) * gap;
  const offsetX = Math.max(0, (W - chartW) / 2);
  const chartH = 80;

  return (
    <svg viewBox={`0 0 ${W} ${chartH + 18}`} className="w-full" preserveAspectRatio="none">
      {data.map((d, i) => {
        const h = Math.max(3, (d.value / max) * chartH);
        const x = offsetX + i * (barW + gap);
        const y = chartH - h;
        const isToday = i === data.length - 1;
        return (
          <g key={d.label}>
            <rect
              x={x} y={y} width={barW} height={h} rx={4}
              fill={isToday ? "hsl(217 91% 60% / 0.9)" : "hsl(217 91% 60% / 0.45)"}
            />
            {i % 7 === 0 && (
              <text
                x={x + barW / 2} y={chartH + 14}
                textAnchor="middle" fontSize={9}
                fill="currentColor" opacity={0.35}
              >
                {d.label}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

// ─── SVG Donut Chart ──────────────────────────────────────────────────────────
function DonutChart({
  succeeded, failed, processing, queued,
}: {
  succeeded: number; failed: number; processing: number; queued: number;
}) {
  const total = succeeded + failed + processing + queued || 1;
  const R = 32;
  const C = 2 * Math.PI * R;

  const segments = [
    { value: succeeded, color: "#10b981" },
    { value: failed,    color: "#ef4444" },
    { value: processing, color: "#3b82f6" },
    { value: queued,    color: "#71717a" },
  ];

  let cumOffset = 0;
  return (
    <svg viewBox="0 0 80 80" className="h-28 w-28 shrink-0">
      <circle cx={40} cy={40} r={R} fill="none" stroke="currentColor" strokeWidth={12} opacity={0.08} />
      {segments.map((seg, i) => {
        const dash = (seg.value / total) * C;
        if (dash < 0.1) { cumOffset += dash; return null; }
        const el = (
          <circle
            key={i} cx={40} cy={40} r={R}
            fill="none"
            stroke={seg.color}
            strokeWidth={12}
            strokeDasharray={`${dash} ${C}`}
            strokeDashoffset={`${-cumOffset}`}
            transform="rotate(-90 40 40)"
          />
        );
        cumOffset += dash;
        return el;
      })}
      <text x={40} y={37} textAnchor="middle" fontSize={13} fontWeight="700" fill="currentColor">
        {total.toLocaleString()}
      </text>
      <text x={40} y={50} textAnchor="middle" fontSize={8} fill="currentColor" opacity={0.45}>
        total jobs
      </text>
    </svg>
  );
}

// ─── Plan Distribution Bars ───────────────────────────────────────────────────
function PlanBar({ label, count, total, color }: { label: string; count: number; total: number; color: string }) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div className="flex items-center gap-3">
      <span className="w-16 text-[12px] text-muted-foreground capitalize shrink-0">{label}</span>
      <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
        <div className={`h-full rounded-full ${color} transition-all`} style={{ width: `${pct}%` }} />
      </div>
      <span className="w-16 text-right text-[12px] text-muted-foreground shrink-0">
        {count.toLocaleString()} <span className="text-muted-foreground/40">({pct}%)</span>
      </span>
    </div>
  );
}

export default async function AdminOverviewPage() {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

  const [
    totalUsers,
    newUsersThisMonth,
    totalJobs,
    succeededJobs,
    failedJobs,
    processingJobs,
    queuedJobs,
    planCounts,
    jobsLast14,
    recentUsers,
    recentJobs,
    openTickets,
    pendingFeatures,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { createdAt: { gte: monthStart } } }),
    prisma.job.count(),
    prisma.job.count({ where: { status: "succeeded" } }),
    prisma.job.count({ where: { status: "failed" } }),
    prisma.job.count({ where: { status: "processing" } }),
    prisma.job.count({ where: { status: "queued" } }),
    prisma.user.groupBy({ by: ["plan"], _count: true }),
    prisma.job.findMany({
      where: { createdAt: { gte: twoWeeksAgo } },
      select: { createdAt: true },
    }),
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      take: 8,
      select: { id: true, email: true, plan: true, role: true, bannedAt: true, createdAt: true },
    }),
    prisma.job.findMany({
      orderBy: { createdAt: "desc" },
      take: 10,
      select: {
        id: true, status: true, inputType: true,
        createdAt: true, updatedAt: true,
        user: { select: { email: true } },
      },
    }),
    prisma.supportTicket.count({ where: { status: { in: ["open", "in_progress"] } } }),
    prisma.featureRequest.count({ where: { status: { in: ["submitted", "planned"] } } }),
  ]);

  // Build daily chart data (last 14 days)
  const dailyMap: Record<string, number> = {};
  for (let i = 0; i < 14; i++) {
    const d = new Date(twoWeeksAgo.getTime() + i * 24 * 60 * 60 * 1000);
    dailyMap[d.toISOString().slice(0, 10)] = 0;
  }
  for (const job of jobsLast14) {
    const key = job.createdAt.toISOString().slice(0, 10);
    if (key in dailyMap) dailyMap[key]++;
  }
  const chartData = Object.entries(dailyMap).map(([day, value]) => ({
    label: day.slice(5), // MM-DD
    value,
  }));

  // Plan distribution
  const planMap: Record<string, number> = { starter: 0, growth: 0, pro: 0 };
  for (const p of planCounts) planMap[p.plan] = (planMap[p.plan] ?? 0) + p._count;

  const successRate = totalJobs > 0 ? Math.round((succeededJobs / totalJobs) * 100) : 0;

  const statCards = [
    { label: "Total Users",     value: totalUsers,     sub: `+${newUsersThisMonth} this month`,     icon: Users,           color: "text-blue-400",    bg: "bg-blue-500/10" },
    { label: "Total Jobs",      value: totalJobs,       sub: `${processingJobs + queuedJobs} active`, icon: BriefcaseBusiness, color: "text-violet-400",  bg: "bg-violet-500/10" },
    { label: "Success Rate",    value: `${successRate}%`, sub: `${succeededJobs.toLocaleString()} succeeded`, icon: CheckCircle,  color: "text-emerald-400", bg: "bg-emerald-500/10" },
    { label: "Failed Jobs",     value: failedJobs,      sub: "all time",                              icon: XCircle,         color: "text-red-400",     bg: "bg-red-500/10" },
    { label: "Open Tickets",    value: openTickets,     sub: "support queue",                         icon: Clock,           color: "text-amber-400",   bg: "bg-amber-500/10" },
    { label: "Feature Requests", value: pendingFeatures, sub: "pending review",                       icon: TrendingUp,      color: "text-sky-400",     bg: "bg-sky-500/10" },
  ];

  return (
    <div className="px-6 py-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Overview</h1>
        <p className="text-sm text-muted-foreground mt-1">System-wide metrics at a glance.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
        {statCards.map((s) => (
          <div key={s.label} className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">{s.label}</p>
              <div className={`h-7 w-7 rounded-lg ${s.bg} flex items-center justify-center`}>
                <s.icon className={`h-3.5 w-3.5 ${s.color}`} />
              </div>
            </div>
            <p className="text-2xl font-bold tracking-tight">{typeof s.value === "number" ? s.value.toLocaleString() : s.value}</p>
            <p className="mt-1 text-[11px] text-muted-foreground/70">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Bar chart: jobs over 14 days */}
        <div className="lg:col-span-2 rounded-xl border border-border bg-card p-6">
          <div className="mb-4">
            <h2 className="text-sm font-semibold">Jobs — last 14 days</h2>
            <p className="text-[11px] text-muted-foreground mt-0.5">{jobsLast14.length} jobs total in this period</p>
          </div>
          <BarChart data={chartData} />
        </div>

        {/* Donut + legend */}
        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="text-sm font-semibold mb-4">Job Status</h2>
          <div className="flex items-center gap-4">
            <DonutChart
              succeeded={succeededJobs}
              failed={failedJobs}
              processing={processingJobs}
              queued={queuedJobs}
            />
            <div className="space-y-2.5 text-[12px]">
              {[
                { label: "Succeeded", value: succeededJobs, dot: "bg-emerald-500" },
                { label: "Failed",    value: failedJobs,    dot: "bg-red-500" },
                { label: "Processing", value: processingJobs, dot: "bg-blue-500" },
                { label: "Queued",    value: queuedJobs,    dot: "bg-zinc-500" },
              ].map((s) => (
                <div key={s.label} className="flex items-center gap-2">
                  <span className={`h-2 w-2 rounded-full ${s.dot} shrink-0`} />
                  <span className="text-muted-foreground">{s.label}</span>
                  <span className="ml-auto font-medium tabular-nums">{s.value.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Plan distribution */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h2 className="text-sm font-semibold mb-4">Plan Distribution</h2>
        <div className="space-y-3 max-w-xl">
          <PlanBar label="Starter" count={planMap.starter} total={totalUsers} color="bg-zinc-400" />
          <PlanBar label="Growth"  count={planMap.growth}  total={totalUsers} color="bg-violet-500" />
          <PlanBar label="Pro"     count={planMap.pro}     total={totalUsers} color="bg-blue-500" />
        </div>
      </div>

      {/* Recent activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent users */}
        <div className="rounded-xl border border-border bg-card">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <h2 className="text-sm font-semibold">Recent Users</h2>
            <a href="/admin/users" className="text-xs text-muted-foreground hover:text-foreground transition-colors">View all →</a>
          </div>
          <div className="divide-y divide-border">
            {recentUsers.map((u) => (
              <div key={u.id} className="flex items-center justify-between px-5 py-3">
                <div className="min-w-0">
                  <p className={`text-[13px] font-medium truncate ${u.bannedAt ? "line-through text-muted-foreground" : ""}`}>{u.email}</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    {u.createdAt.toLocaleDateString()} · {u.plan}
                  </p>
                </div>
                <div className="flex items-center gap-1.5 shrink-0 ml-2">
                  {u.bannedAt && (
                    <span className="rounded-full border border-orange-500/30 bg-orange-500/10 px-2 py-0.5 text-[10px] font-semibold text-orange-400">banned</span>
                  )}
                  {u.role === "admin" && (
                    <span className="rounded-full border border-red-500/30 bg-red-500/10 px-2 py-0.5 text-[10px] font-semibold text-red-400">admin</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent jobs */}
        <div className="rounded-xl border border-border bg-card">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <h2 className="text-sm font-semibold">Recent Jobs</h2>
            <a href="/admin/jobs" className="text-xs text-muted-foreground hover:text-foreground transition-colors">View all →</a>
          </div>
          <div className="divide-y divide-border">
            {recentJobs.map((j) => {
              const durationMs =
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
                <div key={j.id} className="flex items-center justify-between px-5 py-3">
                  <div className="min-w-0">
                    <p className="text-[12px] font-mono text-muted-foreground">{j.id.slice(0, 14)}…</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5 truncate">
                      {j.user.email} · {j.inputType}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 ml-2">
                    {durationMs !== null && (
                      <span className="text-[10px] text-muted-foreground/60">{durationMs}ms</span>
                    )}
                    <span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold ${statusColors[j.status] ?? ""}`}>
                      {j.status}
                    </span>
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
