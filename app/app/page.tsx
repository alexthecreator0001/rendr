import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  ArrowRight, FileOutput, Layers, Key, CheckCircle2,
  Clock, AlertCircle, FileText, TrendingUp,
} from "lucide-react";

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
  label: string; value: string | number; icon: any; color: string; sub?: string;
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
  href: string; icon: any; title: string; description: string; accent: string;
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

export default async function AppOverviewPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  const userId = session.user.id;

  const now = new Date();
  const todayStart  = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const monthStart  = new Date(now.getFullYear(), now.getMonth(), 1);

  const [totalToday, totalMonth, succeeded, failed, templateCount, recentJobs] = await Promise.all([
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
  ]);

  const total = succeeded + failed;
  const successRate = total > 0 ? Math.round((succeeded / total) * 100) : 100;

  // Time-aware greeting
  const hour = now.getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const name = session.user.email?.split("@")[0] ?? "there";

  return (
    <div className="space-y-8">
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
