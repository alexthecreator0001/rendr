import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";

export default async function UsagePage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  const userId = session.user.id;

  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const [today, week, month] = await Promise.all([
    prisma.usageEvent.count({ where: { userId, createdAt: { gte: todayStart } } }),
    prisma.usageEvent.count({ where: { userId, createdAt: { gte: weekStart } } }),
    prisma.usageEvent.count({ where: { userId, createdAt: { gte: monthStart } } }),
  ]);

  // Daily breakdown for the last 30 days
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const rawEvents = await prisma.usageEvent.findMany({
    where: { userId, createdAt: { gte: thirtyDaysAgo } },
    select: { createdAt: true },
  });

  const dailyMap = new Map<string, number>();
  for (const event of rawEvents) {
    const day = event.createdAt.toISOString().slice(0, 10);
    dailyMap.set(day, (dailyMap.get(day) ?? 0) + 1);
  }

  const daily: { date: string; count: number }[] = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    const key = d.toISOString().slice(0, 10);
    daily.push({ date: key, count: dailyMap.get(key) ?? 0 });
  }

  const FREE_TIER = 500;
  const periods = [
    { label: "Today", value: today },
    { label: "Last 7 days", value: week },
    { label: "This month", value: month },
  ];

  const maxDay = Math.max(...daily.map((d) => d.count), 1);

  return (
    <div className="p-6 lg:p-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Usage</h1>
        <p className="text-sm text-muted-foreground mt-1">API usage across all your keys.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {periods.map((p) => (
          <div key={p.label} className="rounded-xl border border-border p-5">
            <p className="text-sm text-muted-foreground">{p.label}</p>
            <p className="mt-2 text-3xl font-bold">{p.value.toLocaleString()}</p>
            <div className="mt-3 h-1.5 w-full rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{ width: `${Math.min(100, (p.value / FREE_TIER) * 100)}%` }}
              />
            </div>
            <p className="mt-1.5 text-xs text-muted-foreground">
              {p.value} / {FREE_TIER} free tier
            </p>
          </div>
        ))}
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-4">Daily activity — last 30 days</h2>
        <div className="rounded-xl border border-border p-5">
          <div className="flex items-end gap-0.5 h-24">
            {daily.map((d) => {
              const pct = (d.count / maxDay) * 100;
              return (
                <div
                  key={d.date}
                  className="flex-1 group relative"
                  title={`${d.date}: ${d.count} requests`}
                >
                  <div
                    className="w-full rounded-sm bg-primary/20 group-hover:bg-primary/40 transition-colors"
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
