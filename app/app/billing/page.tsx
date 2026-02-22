import type { Metadata } from "next";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { Zap, Check, FileText, Clock, Webhook, Key, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export const metadata: Metadata = { title: "Billing" };

const PLAN_LIMITS: Record<string, number> = {
  starter: 100,
  growth: 2000,
  pro: 999999,
};

const PLAN_LABELS: Record<string, string> = {
  starter: "Starter — Free",
  growth: "Growth — $29/mo",
  pro: "Pro — $99/mo",
};

const PLAN_FEATURE_PILLS: Record<string, { icon: React.ElementType; label: string }[]> = {
  starter: [
    { icon: FileText, label: "100 renders / mo" },
    { icon: Key,      label: "REST API" },
    { icon: Clock,    label: "Async rendering" },
    { icon: Shield,   label: "Secure download links" },
  ],
  growth: [
    { icon: FileText, label: "2,000 renders / mo" },
    { icon: Key,      label: "REST API" },
    { icon: Webhook,  label: "Webhooks" },
    { icon: Shield,   label: "Priority queue" },
  ],
  pro: [
    { icon: FileText, label: "Unlimited renders" },
    { icon: Key,      label: "REST API" },
    { icon: Webhook,  label: "Webhooks" },
    { icon: Shield,   label: "Dedicated worker" },
  ],
};

const plans = [
  {
    id: "starter",
    name: "Starter",
    price: "Free",
    description: "For individuals and side projects",
    features: [
      "100 renders / month",
      "A4 & Letter formats",
      "URL, HTML & template input",
      "PDF download links",
      "REST API access",
      "Community support",
    ],
    cta: "Current plan",
    ctaHref: null as string | null,
  },
  {
    id: "growth",
    name: "Growth",
    price: "$29",
    period: "/mo",
    description: "For teams shipping real products",
    highlighted: true,
    features: [
      "2,000 renders / month",
      "All Starter features",
      "Webhooks",
      "Custom headers & footers",
      "Priority rendering queue",
      "Email support",
    ],
    cta: "Upgrade to Growth",
    ctaHref: "/pricing" as string | null,
  },
  {
    id: "pro",
    name: "Pro",
    price: "$99",
    period: "/mo",
    description: "For high-volume production workloads",
    features: [
      "Unlimited renders",
      "All Growth features",
      "Custom fonts & assets",
      "Dedicated worker",
      "SLA guarantee",
      "Slack support",
    ],
    cta: "Upgrade to Pro",
    ctaHref: "/pricing" as string | null,
  },
];

export default async function BillingPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const nextReset = new Date(now.getFullYear(), now.getMonth() + 1, 1);

  const [rendersThisMonth, user] = await Promise.all([
    prisma.job.count({
      where: {
        userId: session.user.id,
        status: "succeeded",
        createdAt: { gte: monthStart },
      },
    }),
    prisma.user.findUnique({
      where: { id: session.user.id },
      select: { plan: true },
    }),
  ]);

  const currentPlan = user?.plan ?? "starter";
  const planLimit = currentPlan === "pro" ? 999999 : (PLAN_LIMITS[currentPlan] ?? 100);
  const planLabel = PLAN_LABELS[currentPlan] ?? "Starter — Free";
  const featurePills = PLAN_FEATURE_PILLS[currentPlan] ?? PLAN_FEATURE_PILLS.starter;

  const usagePct = currentPlan === "pro"
    ? Math.min(Math.round((rendersThisMonth / 1000) * 100), 100) // relative for pro
    : Math.min(Math.round((rendersThisMonth / planLimit) * 100), 100);

  const resetDate = nextReset.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

  const barColor =
    usagePct >= 90 ? "bg-red-500" :
    usagePct >= 70 ? "bg-amber-500" :
    "bg-primary";

  const isOnPaidPlan = currentPlan !== "starter";

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Billing</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your plan, usage, and payment details.
        </p>
      </div>

      <div className="rounded-2xl border border-border overflow-hidden">
        <div className="divide-y divide-border">

          {/* ── Current Plan ─────────────────────────────────── */}
          <div className="p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2.5 mb-1">
                  <h2 className="text-base font-semibold">Current Plan</h2>
                  <Badge className="rounded-full bg-primary/10 text-primary border-0 text-[11px] font-semibold px-2">
                    {planLabel}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {currentPlan === "pro"
                    ? "Unlimited renders · dedicated worker · SLA guarantee"
                    : currentPlan === "growth"
                    ? "2,000 renders per month · priority queue"
                    : "100 renders per month · no credit card required"}
                </p>
              </div>
              {!isOnPaidPlan && (
                <Button asChild className="shrink-0">
                  <Link href="/pricing">
                    <Zap className="h-3.5 w-3.5 mr-1.5" />
                    Upgrade plan
                  </Link>
                </Button>
              )}
            </div>

            {/* Feature pills */}
            <div className="mt-5 flex flex-wrap gap-2">
              {featurePills.map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-1.5 rounded-full border border-border bg-muted/40 px-3 py-1 text-xs text-muted-foreground">
                  <Icon className="h-3 w-3" />
                  {label}
                </div>
              ))}
            </div>
          </div>

          {/* ── Usage This Month ─────────────────────────────── */}
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold">Usage this month</h2>
              <span className="text-sm font-mono text-muted-foreground">
                {rendersThisMonth}
                {currentPlan !== "pro" && ` / ${planLimit}`}
                {" renders"}
              </span>
            </div>

            {/* Big number */}
            <div className="flex items-end gap-3 mb-4">
              <span className="text-5xl font-black tracking-tight text-foreground">
                {rendersThisMonth}
              </span>
              {currentPlan !== "pro" && (
                <span className="text-lg text-muted-foreground mb-1.5 font-medium">
                  / {planLimit}
                </span>
              )}
              {currentPlan !== "pro" && (
                <span className={`ml-auto text-sm font-semibold mb-1.5 ${
                  usagePct >= 90 ? "text-red-500" : usagePct >= 70 ? "text-amber-500" : "text-green-500"
                }`}>
                  {usagePct}% used
                </span>
              )}
              {currentPlan === "pro" && (
                <span className="ml-auto text-sm font-semibold mb-1.5 text-green-500">
                  Unlimited
                </span>
              )}
            </div>

            {currentPlan !== "pro" && (
              <>
                {/* Progress bar */}
                <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${barColor}`}
                    style={{ width: `${usagePct}%` }}
                  />
                </div>
                <p className="mt-2.5 text-xs text-muted-foreground">
                  Resets on {resetDate}
                  {usagePct >= 80 && (
                    <span className="ml-2 text-amber-600 dark:text-amber-400 font-medium">
                      · Running low?{" "}
                      <Link href="/pricing" className="underline underline-offset-2">Upgrade for more.</Link>
                    </span>
                  )}
                </p>
              </>
            )}
            {currentPlan === "pro" && (
              <p className="text-xs text-muted-foreground">
                Resets on {resetDate} · unlimited renders on Pro
              </p>
            )}
          </div>

        </div>
      </div>

      {/* ── Plan Comparison ──────────────────────────────────── */}
      <div>
        <h2 className="text-base font-semibold mb-4">Compare plans</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {plans.map((plan) => {
            const isCurrent = plan.id === currentPlan;
            const ctaHref = isCurrent ? null : plan.ctaHref;
            return (
              <div
                key={plan.name}
                className={`relative rounded-2xl border p-5 flex flex-col ${
                  plan.highlighted
                    ? "border-primary bg-primary/[0.03] shadow-sm"
                    : "border-border bg-card"
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="rounded-full bg-primary text-primary-foreground text-[10px] px-2.5 py-0.5 font-semibold shadow-sm">
                      Most popular
                    </Badge>
                  </div>
                )}

                {/* Plan name + price */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-semibold">{plan.name}</span>
                    {isCurrent && (
                      <Badge variant="secondary" className="rounded-full text-[10px] px-2 py-0">
                        Active
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-baseline gap-0.5">
                    <span className="text-3xl font-black tracking-tight">{plan.price}</span>
                    {"period" in plan && plan.period && (
                      <span className="text-sm text-muted-foreground">{plan.period}</span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{plan.description}</p>
                </div>

                {/* Features */}
                <ul className="space-y-2 flex-1 mb-5">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-xs text-muted-foreground">
                      <Check className="h-3.5 w-3.5 shrink-0 text-primary mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                {ctaHref ? (
                  <Button
                    asChild
                    size="sm"
                    variant={plan.highlighted ? "default" : "outline"}
                    className="w-full"
                  >
                    <Link href={ctaHref}>
                      {plan.highlighted && <Zap className="h-3.5 w-3.5 mr-1.5" />}
                      {plan.cta}
                    </Link>
                  </Button>
                ) : (
                  <Button size="sm" variant="outline" className="w-full" disabled>
                    {isCurrent ? "Current plan" : plan.cta}
                  </Button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Invoice History ──────────────────────────────────── */}
      <div className="rounded-2xl border border-border overflow-hidden">
        <div className="px-6 py-4 border-b border-border">
          <h2 className="text-base font-semibold">Invoice history</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Billing receipts for paid plans.
          </p>
        </div>
        <div className="flex flex-col items-center justify-center py-14 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted/60 mb-4">
            <FileText className="h-6 w-6 text-muted-foreground/50" />
          </div>
          <p className="text-sm font-medium">No invoices yet</p>
          <p className="text-xs text-muted-foreground mt-1 max-w-xs">
            Invoices will appear here once you upgrade to a paid plan.
          </p>
          <Button asChild variant="outline" size="sm" className="mt-4">
            <Link href="/pricing">View pricing</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
