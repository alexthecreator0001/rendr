import { prisma } from "@/lib/db";
import { Users, BriefcaseBusiness, CheckCircle, XCircle, TrendingUp, Clock, Mail, Globe } from "lucide-react";

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

// ─── Email Domain Helpers ─────────────────────────────────────────────────────
const KNOWN_PROVIDERS: Record<string, { label: string; dot: string }> = {
  "gmail.com": { label: "Gmail", dot: "bg-red-400" },
  "googlemail.com": { label: "Gmail", dot: "bg-red-400" },
  "outlook.com": { label: "Outlook", dot: "bg-blue-400" },
  "hotmail.com": { label: "Outlook", dot: "bg-blue-400" },
  "live.com": { label: "Outlook", dot: "bg-blue-400" },
  "yahoo.com": { label: "Yahoo", dot: "bg-purple-400" },
  "icloud.com": { label: "iCloud", dot: "bg-sky-400" },
  "protonmail.com": { label: "Proton", dot: "bg-violet-400" },
  "proton.me": { label: "Proton", dot: "bg-violet-400" },
};

function getProviderLabel(domain: string): string {
  return KNOWN_PROVIDERS[domain]?.label ?? domain;
}

function getProviderDot(label: string): string {
  const entry = Object.values(KNOWN_PROVIDERS).find((p) => p.label === label);
  return entry?.dot ?? "bg-emerald-400";
}

function EmailProviderBadge({ email }: { email: string }) {
  const domain = email.split("@")[1]?.toLowerCase() ?? "";
  const known = KNOWN_PROVIDERS[domain];
  if (known) {
    return (
      <span className={`inline-flex items-center gap-1 text-[10px] font-medium ${known.dot === "bg-red-400" ? "text-red-400" : known.dot === "bg-blue-400" ? "text-blue-400" : known.dot === "bg-purple-400" ? "text-purple-400" : known.dot === "bg-sky-400" ? "text-sky-400" : "text-violet-400"}`}>
        <Mail className="h-2.5 w-2.5" />
        {known.label}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-400">
      <Globe className="h-2.5 w-2.5" />
      {domain}
    </span>
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
    allEmails,
    googleAuthCount,
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
      select: { id: true, email: true, plan: true, role: true, bannedAt: true, createdAt: true, googleId: true },
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
    prisma.user.findMany({ select: { email: true } }),
    prisma.user.count({ where: { googleId: { not: null } } }),
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

  // Email domain distribution
  const domainMap: Record<string, number> = {};
  for (const u of allEmails) {
    const domain = u.email.split("@")[1]?.toLowerCase() ?? "unknown";
    const label = getProviderLabel(domain);
    domainMap[label] = (domainMap[label] ?? 0) + 1;
  }
  const sortedDomains = Object.entries(domainMap).sort((a, b) => b[1] - a[1]);
  const topProviders: { label: string; count: number }[] = [];
  let otherCount = 0;
  for (const [label, count] of sortedDomains) {
    if (topProviders.length < 6) {
      topProviders.push({ label, count });
    } else {
      otherCount += count;
    }
  }
  if (otherCount > 0) topProviders.push({ label: "Other", count: otherCount });

  const successRate = totalJobs > 0 ? Math.round((succeededJobs / totalJobs) * 100) : 0;
  const emailAuthCount = totalUsers - googleAuthCount;

  const statCards = [
    { label: "Total Users",     value: totalUsers,     sub: `+${newUsersThisMonth} this month`,     icon: Users,           color: "text-blue-400",    bg: "bg-blue-500/10" },
    { label: "Total Jobs",      value: totalJobs,       sub: `${processingJobs + queuedJobs} active`, icon: BriefcaseBusiness, color: "text-violet-400",  bg: "bg-violet-500/10" },
    { label: "Success Rate",    value: `${successRate}%`, sub: `${succeededJobs.toLocaleString()} succeeded`, icon: CheckCircle,  color: "text-emerald-400", bg: "bg-emerald-500/10" },
    { label: "Failed Jobs",     value: failedJobs,      sub: "all time",                              icon: XCircle,         color: "text-red-400",     bg: "bg-red-500/10" },
    { label: "Open Tickets",    value: openTickets,     sub: "support queue",                         icon: Clock,           color: "text-amber-400",   bg: "bg-amber-500/10" },
    { label: "Feature Requests", value: pendingFeatures, sub: "pending review",                       icon: TrendingUp,      color: "text-sky-400",     bg: "bg-sky-500/10" },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Overview</h1>
        <p className="text-sm text-muted-foreground mt-1">System-wide metrics at a glance.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-6">
        {statCards.map((s) => (
          <div key={s.label} className="rounded-xl border border-border bg-card p-4 sm:p-5">
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">{s.label}</p>
              <div className={`h-7 w-7 rounded-lg ${s.bg} flex items-center justify-center`}>
                <s.icon className={`h-3.5 w-3.5 ${s.color}`} />
              </div>
            </div>
            <p className="text-xl sm:text-2xl font-bold tracking-tight">{typeof s.value === "number" ? s.value.toLocaleString() : s.value}</p>
            <p className="mt-1 text-[11px] text-muted-foreground/70">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-xl border border-border bg-card p-4 sm:p-6">
          <div className="mb-4">
            <h2 className="text-sm font-semibold">Jobs — last 14 days</h2>
            <p className="text-[11px] text-muted-foreground mt-0.5">{jobsLast14.length} jobs total in this period</p>
          </div>
          <BarChart data={chartData} />
        </div>

        <div className="rounded-xl border border-border bg-card p-4 sm:p-6">
          <h2 className="text-sm font-semibold mb-4">Job Status</h2>
          <div className="flex flex-col items-center gap-4 sm:flex-row">
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

      {/* Plan + Email + Auth distribution */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-4 sm:p-6">
          <h2 className="text-sm font-semibold mb-4">Plan Distribution</h2>
          <div className="space-y-3">
            <PlanBar label="Starter" count={planMap.starter} total={totalUsers} color="bg-zinc-400" />
            <PlanBar label="Growth"  count={planMap.growth}  total={totalUsers} color="bg-violet-500" />
            <PlanBar label="Pro"     count={planMap.pro}     total={totalUsers} color="bg-blue-500" />
          </div>
        </div>

        {/* Auth method distribution */}
        <div className="rounded-xl border border-border bg-card p-4 sm:p-6">
          <h2 className="text-sm font-semibold mb-4">Auth Method</h2>
          <div className="space-y-3">
            <PlanBar label="Google" count={googleAuthCount} total={totalUsers} color="bg-blue-500" />
            <PlanBar label="Email"  count={emailAuthCount}  total={totalUsers} color="bg-zinc-400" />
          </div>
        </div>

        {/* Email provider distribution */}
        <div className="rounded-xl border border-border bg-card p-4 sm:p-6">
          <h2 className="text-sm font-semibold mb-4">Email Providers</h2>
          <div className="space-y-2.5">
            {topProviders.map((p) => {
              const pct = totalUsers > 0 ? Math.round((p.count / totalUsers) * 100) : 0;
              const dot = getProviderDot(p.label);
              return (
                <div key={p.label} className="flex items-center gap-3">
                  <span className={`h-2 w-2 rounded-full ${dot} shrink-0`} />
                  <span className="w-16 text-[12px] text-muted-foreground truncate shrink-0">{p.label}</span>
                  <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                    <div className={`h-full rounded-full ${dot} transition-all`} style={{ width: `${pct}%` }} />
                  </div>
                  <span className="w-14 text-right text-[12px] text-muted-foreground shrink-0">
                    {p.count} <span className="text-muted-foreground/40">({pct}%)</span>
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent activity */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-border bg-card">
          <div className="flex items-center justify-between px-4 sm:px-5 py-4 border-b border-border">
            <h2 className="text-sm font-semibold">Recent Users</h2>
            <a href="/admin/users" className="text-xs text-muted-foreground hover:text-foreground transition-colors">View all →</a>
          </div>
          <div className="divide-y divide-border">
            {recentUsers.map((u) => (
              <div key={u.id} className="flex items-center justify-between px-4 sm:px-5 py-3">
                <div className="min-w-0">
                  <p className={`text-[13px] font-medium truncate ${u.bannedAt ? "line-through text-muted-foreground" : ""}`}>{u.email}</p>
                  <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                    <span className="text-[11px] text-muted-foreground">{u.createdAt.toLocaleDateString()} · {u.plan}</span>
                    <EmailProviderBadge email={u.email} />
                    {u.googleId && (
                      <span className="inline-flex items-center gap-0.5 text-[10px] font-medium text-blue-400">
                        <svg className="h-2.5 w-2.5" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        Google
                      </span>
                    )}
                  </div>
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

        <div className="rounded-xl border border-border bg-card">
          <div className="flex items-center justify-between px-4 sm:px-5 py-4 border-b border-border">
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
                <div key={j.id} className="flex items-center justify-between px-4 sm:px-5 py-3">
                  <div className="min-w-0">
                    <p className="text-[12px] font-mono text-muted-foreground truncate">{j.id.slice(0, 14)}…</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5 truncate">
                      {j.user.email} · {j.inputType}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 ml-2">
                    {durationMs !== null && (
                      <span className="text-[10px] text-muted-foreground/60 hidden sm:inline">{durationMs}ms</span>
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
