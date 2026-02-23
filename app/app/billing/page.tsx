import type { Metadata } from "next";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { prisma } from "@/lib/db";
import { Zap, FileText, Clock, Webhook, Key, Shield, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { CheckoutButton, PortalButton, CancelButton, BillingPlansSection, CancellationBanner } from "./billing-actions";
import { detectCurrency, PLAN_PRICES } from "@/lib/currency";
import { getStripe } from "@/lib/stripe";

export const metadata: Metadata = { title: "Billing" };

// ── Plan config (for current-plan display — pills, limit) ──────────────────

const PLANS = [
  {
    id: "starter",
    name: "Starter",
    price: "Free",
    description: "Side projects and exploration",
    limit: 100,
    pills: [
      { icon: FileText, label: "100 renders / mo" },
      { icon: Key,      label: "REST API" },
      { icon: Clock,    label: "Async rendering" },
      { icon: Shield,   label: "Secure download links" },
    ],
  },
  {
    id: "growth",
    name: "Growth",
    description: "Teams shipping PDFs in production",
    limit: 5000,
    highlighted: true,
    pills: [
      { icon: FileText, label: "5,000 renders / mo" },
      { icon: Key,      label: "Unlimited API keys" },
      { icon: Webhook,  label: "Webhooks" },
      { icon: Shield,   label: "Priority queue" },
    ],
  },
  {
    id: "business",
    name: "Business",
    description: "High-volume and compliance-sensitive",
    limit: 50000,
    pills: [
      { icon: FileText, label: "50,000 renders / mo" },
      { icon: Key,      label: "Unlimited keys" },
      { icon: Webhook,  label: "Unlimited webhooks" },
      { icon: Shield,   label: "SLA guarantee" },
    ],
  },
] as const;

// ── Page ──────────────────────────────────────────────────────────────────

export default async function BillingPage({
  searchParams,
}: {
  searchParams: Promise<{ upgraded?: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const { upgraded } = await searchParams;

  // Detect currency from Cloudflare / Vercel country header
  const headersList = await headers();
  const country = headersList.get("cf-ipcountry") ?? headersList.get("x-vercel-ip-country");
  const currency = detectCurrency(country);

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
      select: {
        plan: true,
        subscriptionStatus: true,
        stripeSubscriptionId: true,
        stripeCustomerId: true,
      },
    }),
  ]);

  // Fetch live subscription state from Stripe
  let cancelAtPeriodEnd = false;
  let periodEndDate: Date | null = null;
  if (user?.stripeSubscriptionId) {
    try {
      const sub = await getStripe().subscriptions.retrieve(user.stripeSubscriptionId);
      cancelAtPeriodEnd = sub.cancel_at_period_end;
      periodEndDate = new Date(sub.current_period_end * 1000);
    } catch {
      // Stripe unreachable or test data — ignore
    }
  }

  const currentPlanId = user?.plan ?? "starter";
  const currentPlan = PLANS.find((p) => p.id === currentPlanId) ?? PLANS[0];
  const planLimit = currentPlan.limit;
  const usagePct = Math.min(Math.round((rendersThisMonth / planLimit) * 100), 100);
  const resetDate = nextReset.toLocaleDateString("en-US", {
    month: "long", day: "numeric", year: "numeric",
  });
  const periodEndStr = periodEndDate?.toLocaleDateString("en-US", {
    month: "long", day: "numeric", year: "numeric",
  }) ?? "";
  const barColor =
    usagePct >= 90 ? "bg-red-500" :
    usagePct >= 70 ? "bg-amber-500" :
    "bg-primary";

  const isOnPaidPlan = currentPlanId !== "starter";
  const isPastDue = user?.subscriptionStatus === "past_due";

  // Current plan price display
  const currentPlanPriceDisplay = isOnPaidPlan
    ? `${PLAN_PRICES[currency][currentPlanId as "growth" | "business"].monthly}/mo`
    : null;

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8 space-y-8">

      {/* Success banner */}
      {upgraded === "true" && (
        <div className="rounded-xl border border-green-200 bg-green-50 dark:border-green-900/50 dark:bg-green-900/20 px-5 py-3.5 flex items-center gap-3">
          <span className="text-green-600 dark:text-green-400 text-base">✓</span>
          <p className="text-sm font-medium text-green-800 dark:text-green-300">
            You&apos;re now on the <strong>{currentPlan.name}</strong> plan. Thank you!
          </p>
        </div>
      )}

      {/* Cancellation banner */}
      {cancelAtPeriodEnd && periodEndDate && (
        <CancellationBanner planName={currentPlan.name} periodEnd={periodEndStr} />
      )}

      {/* Past-due warning */}
      {isPastDue && !cancelAtPeriodEnd && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 dark:border-amber-900/50 dark:bg-amber-900/20 px-5 py-3.5 flex items-center gap-3">
          <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0" />
          <p className="text-sm font-medium text-amber-800 dark:text-amber-300 flex-1">
            Your last payment failed. Update your payment method to keep your plan active.
          </p>
          <PortalButton className="shrink-0 text-xs h-8 px-3" />
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Billing</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your plan, usage, and payment details.
        </p>
      </div>

      <div className="rounded-2xl border border-border overflow-hidden">
        <div className="divide-y divide-border">

          {/* Current Plan */}
          <div className="p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2.5 mb-1">
                  <h2 className="text-base font-semibold">Current Plan</h2>
                  <Badge className="rounded-full bg-primary/10 text-primary border-0 text-[11px] font-semibold px-2">
                    {currentPlan.name}
                    {currentPlanPriceDisplay && ` — ${currentPlanPriceDisplay}`}
                  </Badge>
                  {isPastDue && (
                    <Badge variant="destructive" className="rounded-full text-[11px] font-semibold px-2">
                      Payment failed
                    </Badge>
                  )}
                  {cancelAtPeriodEnd && (
                    <Badge variant="secondary" className="rounded-full text-[11px] font-semibold px-2 text-amber-600 dark:text-amber-400">
                      Cancels {periodEndStr}
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{currentPlan.description}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {isOnPaidPlan ? (
                  cancelAtPeriodEnd ? null : (
                    <>
                      <CancelButton />
                      <PortalButton />
                    </>
                  )
                ) : (
                  <CheckoutButton plan="growth" interval="monthly" currency={currency}>
                    <Zap className="h-3.5 w-3.5" />
                    Upgrade plan
                  </CheckoutButton>
                )}
              </div>
            </div>

            {/* Feature pills */}
            <div className="mt-5 flex flex-wrap gap-2">
              {currentPlan.pills.map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-1.5 rounded-full border border-border bg-muted/40 px-3 py-1 text-xs text-muted-foreground">
                  <Icon className="h-3 w-3" />
                  {label}
                </div>
              ))}
            </div>
          </div>

          {/* Usage */}
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold">Usage this month</h2>
              <span className="text-sm font-mono text-muted-foreground">
                {rendersThisMonth.toLocaleString()} / {planLimit.toLocaleString()} renders
              </span>
            </div>

            <div className="flex items-end gap-3 mb-4">
              <span className="text-5xl font-black tracking-tight text-foreground">
                {rendersThisMonth.toLocaleString()}
              </span>
              <span className="text-lg text-muted-foreground mb-1.5 font-medium">
                / {planLimit.toLocaleString()}
              </span>
              <span className={`ml-auto text-sm font-semibold mb-1.5 ${
                usagePct >= 90 ? "text-red-500" : usagePct >= 70 ? "text-amber-500" : "text-green-500"
              }`}>
                {usagePct}% used
              </span>
            </div>

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
          </div>

        </div>
      </div>

      {/* Plan Comparison */}
      <BillingPlansSection currentPlanId={currentPlanId} currency={currency} />

      {/* Invoice History */}
      <div className="rounded-2xl border border-border overflow-hidden">
        <div className="px-6 py-4 border-b border-border">
          <h2 className="text-base font-semibold">Invoice history</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Billing receipts from Stripe.
          </p>
        </div>
        <div className="flex flex-col items-center justify-center py-14 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted/60 mb-4">
            <FileText className="h-6 w-6 text-muted-foreground/50" />
          </div>
          {isOnPaidPlan ? (
            <>
              <p className="text-sm font-medium">View invoices in Stripe</p>
              <p className="text-xs text-muted-foreground mt-1 max-w-xs">
                All billing history and invoice PDFs are available in the Stripe customer portal.
              </p>
              <PortalButton className="mt-4" />
            </>
          ) : (
            <>
              <p className="text-sm font-medium">No invoices yet</p>
              <p className="text-xs text-muted-foreground mt-1 max-w-xs">
                Invoices will appear here once you upgrade to a paid plan.
              </p>
              <Button asChild variant="outline" size="sm" className="mt-4">
                <Link href="/pricing">View pricing</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
