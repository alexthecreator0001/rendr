import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  ArrowRight, FileOutput, Layers, Key, CheckCircle2,
  Clock, AlertCircle, FileText, TrendingUp, Info,
  TriangleAlert, CircleCheck,
} from "lucide-react";

export const dynamic = "force-dynamic";

function StatusPill({ status }: { status: string }) {
  const styles: Record<string, string> = {
    queued:     "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400",
    processing: "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    succeeded:  "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    failed:     "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  };
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${styles[status] ?? styles.queued}`}>
      {status}
    </span>
  );
}

function StatCard({
  label, value, icon: Icon, color, sub,
}: {
  label: string; value: string | number; icon: React.ElementType; color: string; sub?: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm text-muted-foreground">{label}</p>
        <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${color}`}>
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <p className="text-3xl font-bold tracking-tight">{value}</p>
      {sub && <p className="mt-1 text-xs text-muted-foreground">{sub}</p>}
    </div>
  );
}

function QuickAction({
  href, icon: Icon, title, description, accent,
}: {
  href: string; icon: React.ElementType; title: string; description: string; accent: string;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-4 rounded-2xl border border-border bg-card p-5 transition-all hover:border-primary/40 hover:shadow-sm"
    >
      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${accent}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-semibold text-sm">{title}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
      </div>
      <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
    </Link>
  );
}

function NotificationBanner({ n }: { n: { id: string; title: string; message: string; type: string } }) {
  const styles: Record<string, { bg: string; border: string; text: string; icon: React.ElementType }> = {
    info:    { bg: "bg-blue-50 dark:bg-blue-900/20",   border: "border-blue-200 dark:border-blue-800",   text: "text-blue-800 dark:text-blue-200",   icon: Info },
    warning: { bg: "bg-amber-50 dark:bg-amber-900/20", border: "border-amber-200 dark:border-amber-800", text: "text-amber-800 dark:text-amber-200", icon: TriangleAlert },
    success: { bg: "bg-emerald-50 dark:bg-emerald-900/20", border: "border-emerald-200 dark:border-emerald-800", text: "text-emerald-800 dark:text-emerald-200", icon: CircleCheck },
  };
  const s = styles[n.type] ?? styles.info;
  const Icon = s.icon;
  return (
    <div className={`flex items-start gap-3 rounded-2xl border px-4 py-3.5 ${s.bg} ${s.border}`}>
      <Icon className={`h-4 w-4 shrink-0 mt-0.5 ${s.text}`} />
      <div className="min-w-0">
        <p className={`text-sm font-semibold ${s.text}`}>{n.title}</p>
        <p className={`text-xs mt-0.5 ${s.text} opacity-80`}>{n.message}</p>
      </div>
    </div>
  );
}

function ActivityChart({ data }: { data: { label: string; count: number }[] }) {
  const max = Math.max(...data.map((d) => d.count), 1);
  return (
    <div>
      <h2 className="mb-4 text-lg font-semibold">Activity — last 7 days</h2>
      <div className="rounded-2xl border border-border bg-card p-5">
        <div className="flex items-end gap-2 h-24">
          {data.map((d) => (
            <div key={d.label} className="flex-1 flex flex-col items-center gap-1.5">
              <div
                className="w-full rounded-t-sm bg-primary/80 transition-all duration-500 min-h-[2px]"
                style={{ height: `${Math.max((d.count / max) * 88, d.count > 0 ? 4 : 2)}px` }}
                title={`${d.count} job${d.count !== 1 ? "s" : ""}`}
              />
              <span className="text-[10px] text-muted-foreground tabular-nums">{d.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default async function AppOverviewPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  const userId = session.user.id;

  const now = new Date();
  const todayStart  = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const monthStart  = new Date(now.getFullYear(), now.getMonth(), 1);
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const [totalToday, totalMonth, succeeded, failed, templateCount, recentJobs, notifications, last7Jobs] = await Promise.all([
    prisma.job.count({ where: { userId, createdAt: { gte: todayStart } } }),
    prisma.job.count({ where: { userId, createdAt: { gte: monthStart } } }),
    prisma.job.count({ where: { userId, status: "succeeded" } }),
    prisma.job.count({ where: { userId, status: "failed" } }),
    prisma.template.count({ where: { userId } }),
    prisma.job.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 6,
      select: { id: true, status: true, inputType: true, createdAt: true },
    }),
    prisma.notification.findMany({
      where: { active: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.job.findMany({
      where: { userId, createdAt: { gte: sevenDaysAgo } },
      select: { createdAt: true },
    }),
  ]);

  const total = succeeded + failed;
  const successRate = total > 0 ? Math.round((succeeded / total) * 100) : 100;

  // Build 7-day chart data
  const dayMap = new Map<string, number>();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    const key = `${d.getMonth() + 1}/${d.getDate()}`;
    dayMap.set(key, 0);
  }
  for (const job of last7Jobs) {
    const d = new Date(job.createdAt);
    const key = `${d.getMonth() + 1}/${d.getDate()}`;
    if (dayMap.has(key)) dayMap.set(key, (dayMap.get(key) ?? 0) + 1);
  }
  const chartData = Array.from(dayMap.entries()).map(([label, count]) => ({ label, count }));

  // Time-aware greeting
  const hour = now.getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const name = session.user.name || session.user.email?.split("@")[0] || "there";

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8 space-y-8">

      {/* Admin notifications */}
      {notifications.length > 0 && (
        <div className="space-y-2">
          {notifications.map((n) => <NotificationBanner key={n.id} n={n} />)}
        </div>
      )}

      {/* Greeting */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          {greeting}, {name} 👋
        </h1>
        <p className="mt-1.5 text-muted-foreground">
          {totalMonth === 0
            ? "Welcome to Rendr — render your first PDF below."
            : `You've rendered ${totalMonth} PDF${totalMonth !== 1 ? "s" : ""} this month.`}
        </p>
      </div>

      {/* Quick actions */}
      <div>
        <h2 className="mb-3 text-sm font-semibold text-muted-foreground uppercase tracking-wide">Quick actions</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          <QuickAction
            href="/app/convert"
            icon={FileOutput}
            title="Convert to PDF"
            description="From URL, HTML, or a template"
            accent="bg-blue-500/10 text-blue-600 dark:text-blue-400"
          />
          <QuickAction
            href="/app/templates"
            icon={Layers}
            title="Templates"
            description={`${templateCount} template${templateCount !== 1 ? "s" : ""} ready to use`}
            accent="bg-violet-500/10 text-violet-600 dark:text-violet-400"
          />
          <QuickAction
            href="/app/api-keys"
            icon={Key}
            title="API Keys"
            description="Integrate Rendr into your app"
            accent="bg-amber-500/10 text-amber-600 dark:text-amber-400"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Today"        value={totalToday}     icon={FileText}     color="bg-blue-500/10 text-blue-600 dark:text-blue-400"   />
        <StatCard label="This month"   value={totalMonth}     icon={Clock}        color="bg-violet-500/10 text-violet-600 dark:text-violet-400" />
        <StatCard label="Success rate" value={`${successRate}%`} icon={TrendingUp} color="bg-green-500/10 text-green-600 dark:text-green-400" sub={`${succeeded} succeeded`} />
        <StatCard label="Failed"       value={failed}         icon={AlertCircle}  color="bg-red-500/10 text-red-600 dark:text-red-400"      sub={failed === 0 ? "Looking good!" : undefined} />
      </div>

      {/* Activity chart */}
      <ActivityChart data={chartData} />

      {/* Recent jobs */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Recent jobs</h2>
          <Link href="/app/jobs" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
            View all <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {recentJobs.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border py-16 text-center">
            <CheckCircle2 className="mx-auto mb-3 h-9 w-9 text-muted-foreground/30" />
            <p className="text-sm font-medium">No jobs yet</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Use the Convert page or send a request via the API.
            </p>
            <Link
              href="/app/convert"
              className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
            >
              Convert your first PDF <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        ) : (
          <div className="overflow-hidden overflow-x-auto rounded-2xl border border-border">
            <table className="w-full text-sm min-w-[480px]">
              <thead className="bg-muted/40">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">Job ID</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">Type</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {recentJobs.map((job) => (
                  <tr key={job.id} className="transition-colors hover:bg-muted/30">
                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{job.id.slice(0, 8)}…</td>
                    <td className="px-4 py-3 capitalize">{job.inputType}</td>
                    <td className="px-4 py-3"><StatusPill status={job.status} /></td>
                    <td className="px-4 py-3 text-muted-foreground">{new Date(job.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
