import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowRight, FileText, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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

export default async function AppOverviewPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  const userId = session.user.id;

  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const [totalToday, totalMonth, succeeded, failed, recentJobs] = await Promise.all([
    prisma.job.count({ where: { userId, createdAt: { gte: todayStart } } }),
    prisma.job.count({ where: { userId, createdAt: { gte: monthStart } } }),
    prisma.job.count({ where: { userId, status: "succeeded" } }),
    prisma.job.count({ where: { userId, status: "failed" } }),
    prisma.job.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: { id: true, status: true, inputType: true, createdAt: true },
    }),
  ]);

  const total = succeeded + failed;
  const successRate = total > 0 ? Math.round((succeeded / total) * 100) : 100;

  const cards = [
    { label: "Renders today", value: totalToday, icon: FileText, color: "text-blue-500" },
    { label: "Renders this month", value: totalMonth, icon: Clock, color: "text-violet-500" },
    { label: "Success rate", value: `${successRate}%`, icon: CheckCircle2, color: "text-green-500" },
    { label: "Failed", value: failed, icon: AlertCircle, color: "text-red-500" },
  ];

  return (
    <div className="p-6 lg:p-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Overview</h1>
        <p className="text-sm text-muted-foreground mt-1">Welcome back. Here&apos;s what&apos;s happening.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <Card key={c.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{c.label}</CardTitle>
              <c.icon className={`h-4 w-4 ${c.color}`} />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{c.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Recent jobs</h2>
          <Link href="/app/jobs" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
            View all <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {recentJobs.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border py-16 text-center">
            <p className="text-sm text-muted-foreground">No jobs yet. Send your first render via the API.</p>
            <Link href="/docs/quick-start" className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
              Quick start guide <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        ) : (
          <div className="rounded-xl border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted/40">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Job ID</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Type</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {recentJobs.map((job) => (
                  <tr key={job.id} className="hover:bg-muted/30 transition-colors">
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
