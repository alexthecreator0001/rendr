import { prisma } from "@/lib/db";
import Link from "next/link";

export const metadata = { title: "Subscriptions" };

const PLAN_CONFIG = {
  starter: { label: "Starter",  price: "Free",   color: "text-zinc-400",   bg: "bg-zinc-500/10",   border: "border-zinc-500/20",   bar: "bg-zinc-400" },
  growth:  { label: "Growth",   price: "$29/mo",  color: "text-violet-400", bg: "bg-violet-500/10", border: "border-violet-500/20", bar: "bg-violet-500" },
  pro:     { label: "Pro",      price: "$99/mo",  color: "text-blue-400",   bg: "bg-blue-500/10",   border: "border-blue-500/20",   bar: "bg-blue-500" },
} as const;

export default async function AdminSubscriptionsPage({
  searchParams,
}: {
  searchParams: Promise<{ plan?: string; page?: string }>;
}) {
  const { plan = "all", page = "1" } = await searchParams;
  const pageNum = Math.max(1, parseInt(page, 10));
  const pageSize = 30;

  const validPlan = ["starter", "growth", "pro"].includes(plan) ? plan : null;
  const where = validPlan ? { plan: validPlan } : {};

  const [
    totalUsers,
    starterCount,
    growthCount,
    proCount,
    users,
    total,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { plan: "starter" } }),
    prisma.user.count({ where: { plan: "growth" } }),
    prisma.user.count({ where: { plan: "pro" } }),
    prisma.user.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (pageNum - 1) * pageSize,
      take: pageSize,
      select: {
        id: true, email: true, plan: true, role: true, createdAt: true,
        _count: { select: { jobs: true } },
      },
    }),
    prisma.user.count({ where }),
  ]);

  const planCounts = { starter: starterCount, growth: growthCount, pro: proCount };
  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="px-4 py-6 sm:px-6 sm:py-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Subscriptions</h1>
        <p className="text-sm text-muted-foreground mt-1">Plan distribution across {totalUsers.toLocaleString()} users.</p>
      </div>

      {/* Plan summary cards */}
      <div className="grid gap-4 md:grid-cols-3">
        {(["starter", "growth", "pro"] as const).map((p) => {
          const cfg = PLAN_CONFIG[p];
          const count = planCounts[p];
          const pct = totalUsers > 0 ? Math.round((count / totalUsers) * 100) : 0;
          return (
            <a
              key={p}
              href={`/admin/subscriptions?plan=${p}`}
              className={`rounded-xl border ${cfg.border} ${plan === p ? cfg.bg : "bg-card"} p-6 block hover:opacity-90 transition-opacity`}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className={`text-xs font-semibold uppercase tracking-wider ${cfg.color}`}>{cfg.label}</p>
                  <p className="text-[12px] text-muted-foreground mt-0.5">{cfg.price}</p>
                </div>
                <span className={`text-2xl font-bold tabular-nums ${cfg.color}`}>{count}</span>
              </div>
              <div className="h-1.5 rounded-full bg-muted/50 overflow-hidden">
                <div className={`h-full rounded-full ${cfg.bar}`} style={{ width: `${pct}%` }} />
              </div>
              <p className="mt-1.5 text-[11px] text-muted-foreground/60">{pct}% of all users</p>
            </a>
          );
        })}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {(["all", "starter", "growth", "pro"] as const).map((p) => (
          <a
            key={p}
            href={`/admin/subscriptions?plan=${p}`}
            className={`rounded-lg px-3 py-1.5 text-[12px] font-medium capitalize transition-colors ${
              plan === p
                ? "bg-foreground text-background"
                : "border border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            {p === "all" ? "All plans" : p}
          </a>
        ))}
      </div>

      {/* Users table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">User</th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Plan</th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Jobs</th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Joined</th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Role</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-12 text-center text-sm text-muted-foreground">
                  No users on this plan.
                </td>
              </tr>
            ) : (
              users.map((u) => {
                const cfg = PLAN_CONFIG[u.plan as keyof typeof PLAN_CONFIG];
                return (
                  <tr key={u.id} className="border-b border-border hover:bg-muted/20 transition-colors">
                    <td className="px-4 py-3">
                      <p className="text-[13px] font-medium">{u.email}</p>
                      <p className="text-[11px] font-mono text-muted-foreground/50 mt-0.5">{u.id.slice(0, 12)}…</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold capitalize ${cfg?.color ?? ""} ${cfg?.border ?? ""} ${cfg?.bg ?? ""}`}>
                        {u.plan}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[12px] text-muted-foreground tabular-nums">{u._count.jobs}</td>
                    <td className="px-4 py-3 text-[12px] text-muted-foreground">{u.createdAt.toLocaleDateString()}</td>
                    <td className="px-4 py-3">
                      {u.role === "admin" ? (
                        <span className="rounded-full border border-red-500/30 bg-red-500/10 px-2 py-0.5 text-[10px] font-semibold text-red-400">admin</span>
                      ) : (
                        <span className="text-[12px] text-muted-foreground">user</span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">Page {pageNum} of {totalPages}</p>
          <div className="flex gap-2">
            {pageNum > 1 && (
              <Link href={`/admin/subscriptions?plan=${plan}&page=${pageNum - 1}`} className="rounded-lg border border-border px-3 py-1.5 text-sm hover:bg-accent transition-colors">← Prev</Link>
            )}
            {pageNum < totalPages && (
              <Link href={`/admin/subscriptions?plan=${plan}&page=${pageNum + 1}`} className="rounded-lg border border-border px-3 py-1.5 text-sm hover:bg-accent transition-colors">Next →</Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
