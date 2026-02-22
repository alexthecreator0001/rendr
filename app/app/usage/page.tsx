import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";

export const metadata = { title: "Usage" };

export default async function UsagePage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  const userId = session.user.id;

  const now = new Date();
  const todayStart  = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekStart   = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const monthStart  = new Date(now.getFullYear(), now.getMonth(), 1);

  // Count succeeded renders (same source as sidebar widget)
  const [today, week, month, totalSucceeded, totalFailed] = await Promise.all([
    prisma.job.count({ where: { userId, status: "succeeded", createdAt: { gte: todayStart } } }),
    prisma.job.count({ where: { userId, status: "succeeded", createdAt: { gte: weekStart } } }),
    prisma.job.count({ where: { userId, status: "succeeded", createdAt: { gte: monthStart } } }),
    prisma.job.count({ where: { userId, status: "succeeded" } }),
    prisma.job.count({ where: { userId, status: "failed" } }),
  ]);

  // Daily breakdown for last 30 days (succeeded renders)
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const rawJobs = await prisma.job.findMany({
    where: { userId, status: "succeeded", createdAt: { gte: thirtyDaysAgo } },
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

  const MONTHLY_LIMIT = 100;
  const usagePct = Math.min(Math.round((month / MONTHLY_LIMIT) * 100), 100);
  const barColor =
    usagePct >= 90 ? "bg-red-500" :
    usagePct >= 70 ? "bg-amber-500" :
    "bg-primary";

  const maxDay = Math.max(...daily.map((d) => d.count), 1);

  const successRate =
    totalSucceeded + totalFailed > 0
      ? Math.round((totalSucceeded / (totalSucceeded + totalFailed)) * 100)
      : 100;

  return (
    <div className="px-4 py-6 sm:px-6 sm:py-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Usage</h1>
        <p className="text-sm text-muted-foreground mt-1">
          PDF renders across your account and API keys.
        </p>
      </div>

      {/* Monthly quota */}
      <div className="rounded-2xl border border-border p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold">Monthly renders</p>
            <p className="text-xs text-muted-foreground mt-0.5">Resets on the 1st of each month</p>
          </div>
          <span className="text-2xl font-bold tabular-nums">
            {month}
            <span className="text-base font-normal text-muted-foreground">/{MONTHLY_LIMIT}</span>
          </span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
          <div
            className={`h-full rounded-full transition-all duration-500 ${barColor}`}
            style={{ width: `${usagePct}%` }}
          />
        </div>
        <p className="text-xs text-muted-foreground">{usagePct}% of monthly quota used</p>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Today",         value: today,          sub: "renders" },
          { label: "Last 7 days",   value: week,           sub: "renders" },
          { label: "This month",    value: month,          sub: "renders" },
          { label: "Success rate",  value: `${successRate}%`, sub: `${totalSucceeded} succeeded, ${totalFailed} failed` },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-border p-5">
            <p className="text-sm text-muted-foreground">{s.label}</p>
            <p className="mt-2 text-3xl font-bold tabular-nums">{s.value}</p>
            <p className="mt-1 text-xs text-muted-foreground/70">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Daily bar chart */}
      <div>
        <h2 className="text-base font-semibold mb-4">Daily renders — last 30 days</h2>
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
