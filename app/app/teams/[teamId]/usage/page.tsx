import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";

export const metadata = { title: "Team Usage" };

export default async function TeamUsagePage({
  params,
}: {
  params: Promise<{ teamId: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const { teamId } = await params;

  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const [today, week, month, totalSucceeded, totalFailed] = await Promise.all([
    prisma.job.count({ where: { teamId, status: "succeeded", createdAt: { gte: todayStart } } }),
    prisma.job.count({ where: { teamId, status: "succeeded", createdAt: { gte: weekStart } } }),
    prisma.job.count({ where: { teamId, status: "succeeded", createdAt: { gte: monthStart } } }),
    prisma.job.count({ where: { teamId, status: "succeeded" } }),
    prisma.job.count({ where: { teamId, status: "failed" } }),
  ]);

  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const rawJobs = await prisma.job.findMany({
    where: { teamId, status: "succeeded", createdAt: { gte: thirtyDaysAgo } },
    select: { createdAt: true },
  });

  const dailyMap = new Map<string, number>();
  for (const job of rawJobs) {
    const day = job.createdAt.toISOString().slice(0, 10);
    dailyMap.set(day, (dailyMap.get(day) ?? 0) + 1);
  }

  const daily: { date: string; count: number }[] = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    const key = d.toISOString().slice(0, 10);
    daily.push({ date: key, count: dailyMap.get(key) ?? 0 });
  }

  const maxDay = Math.max(...daily.map((d) => d.count), 1);

  const successRate =
    totalSucceeded + totalFailed > 0
      ? Math.round((totalSucceeded / (totalSucceeded + totalFailed)) * 100)
      : 100;

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Team Usage</h1>
        <p className="text-sm text-muted-foreground mt-1">
          PDF renders across the team. Billing limits apply per-user, not per-team.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Today", value: today, sub: "renders" },
          { label: "Last 7 days", value: week, sub: "renders" },
          { label: "This month", value: month, sub: "renders" },
          { label: "Success rate", value: `${successRate}%`, sub: `${totalSucceeded} succeeded, ${totalFailed} failed` },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-border p-5">
            <p className="text-sm text-muted-foreground">{s.label}</p>
            <p className="mt-2 text-3xl font-bold tabular-nums">{s.value}</p>
            <p className="mt-1 text-xs text-muted-foreground/70">{s.sub}</p>
          </div>
        ))}
      </div>

      <div>
        <h2 className="text-base font-semibold mb-4">Daily renders \u2014 last 30 days</h2>
        <div className="rounded-xl border border-border p-5">
          <div className="flex items-end gap-0.5 h-28">
            {daily.map((d) => {
              const pct = (d.count / maxDay) * 100;
              return (
                <div
                  key={d.date}
                  className="flex-1 group relative cursor-default"
                  title={`${d.date}: ${d.count} render${d.count !== 1 ? "s" : ""}`}
                >
                  <div
                    className="w-full rounded-sm bg-primary/25 group-hover:bg-primary/60 transition-colors"
                    style={{ height: `${Math.max(2, pct)}%` }}
                  />
                </div>
              );
            })}
          </div>
          <div className="flex justify-between mt-2">
            <p className="text-xs text-muted-foreground">{daily[0]?.date}</p>
            <p className="text-xs text-muted-foreground">{daily[daily.length - 1]?.date}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
