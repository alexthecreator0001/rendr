"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Zap, Settings, Check, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { PLAN_PRICES, type Currency } from "@/lib/currency";

// ── Plan data (static, currency-agnostic) ─────────────────────────────────

const STARTER = {
  id: "starter",
  name: "Starter",
  description: "Side projects and exploration",
  features: [
    "100 renders / month",
    "Max 2 MB per render",
    "2 API keys",
    "Community support",
    "7-day log retention",
  ],
};

const PAID_PLANS = [
  {
    id: "growth" as const,
    name: "Growth",
    description: "Teams shipping PDFs in production",
    highlighted: true,
    features: [
      "5,000 renders / month",
      "50,000 pages / month",
      "Unlimited API keys",
      "5 webhook endpoints",
      "Email support",
      "30-day log retention",
    ],
  },
  {
    id: "business" as const,
    name: "Business",
    description: "High-volume and compliance-sensitive",
    highlighted: false,
    features: [
      "50,000 renders / month",
      "500,000 pages / month",
      "Unlimited API keys",
      "Unlimited webhooks",
      "Priority support + SLA",
      "90-day log retention",
      "Custom font uploads",
      "Unlimited templates",
    ],
  },
];

// ── CheckoutButton ─────────────────────────────────────────────────────────

export function CheckoutButton({
  plan,
  interval = "monthly",
  currency = "eur",
  children,
  variant = "default",
  className,
}: {
  plan: string;
  interval?: "monthly" | "yearly";
  currency?: Currency;
  children: React.ReactNode;
  variant?: "default" | "outline";
  className?: string;
}) {
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan, interval, currency }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      onClick={handleClick}
      disabled={loading}
      variant={variant}
      className={cn("gap-1.5", className)}
    >
      {!loading && <Zap className="h-3.5 w-3.5" />}
      {loading ? "Redirecting to Stripe…" : children}
    </Button>
  );
}

// ── PortalButton ───────────────────────────────────────────────────────────

export function PortalButton({ className }: { className?: string }) {
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      onClick={handleClick}
      disabled={loading}
      variant="outline"
      className={cn("gap-1.5", className)}
    >
      <Settings className="h-3.5 w-3.5" />
      {loading ? "Redirecting…" : "Manage billing"}
    </Button>
  );
}

// ── CancelButton ───────────────────────────────────────────────────────────

export function CancelButton({ className }: { className?: string }) {
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    try {
      await fetch("/api/stripe/cancel", { method: "POST" });
      window.location.href = "/app/billing";
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      onClick={handleClick}
      disabled={loading}
      variant="outline"
      className={cn("gap-1.5 text-muted-foreground hover:text-destructive hover:border-destructive/50", className)}
    >
      {loading ? "Cancelling…" : "Downgrade to Free"}
    </Button>
  );
}

// ── ResumeButton ───────────────────────────────────────────────────────────

export function ResumeButton({ className }: { className?: string }) {
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    try {
      await fetch("/api/stripe/resume", { method: "POST" });
      window.location.href = "/app/billing";
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      onClick={handleClick}
      disabled={loading}
      className={cn("gap-1.5", className)}
    >
      {loading ? "Resuming…" : "Keep subscription"}
    </Button>
  );
}

// ── BillingPlansSection ────────────────────────────────────────────────────

export function BillingPlansSection({
  currentPlanId,
  currency,
}: {
  currentPlanId: string;
  currency: Currency;
}) {
  const [interval, setInterval] = useState<"monthly" | "yearly">("monthly");
  const prices = PLAN_PRICES[currency];

  return (
    <div>
      {/* Header + toggle */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold">Compare plans</h2>
        <div className="flex items-center gap-0.5 rounded-full border border-border bg-muted/40 p-0.5">
          <button
            onClick={() => setInterval("monthly")}
            className={cn(
              "rounded-full px-3 py-1 text-xs font-medium transition-colors",
              interval === "monthly"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Monthly
          </button>
          <button
            onClick={() => setInterval("yearly")}
            className={cn(
              "rounded-full px-3 py-1 text-xs font-medium transition-colors flex items-center gap-1.5",
              interval === "yearly"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Yearly
            <span className="rounded-full bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 text-[10px] font-semibold px-1.5 py-0.5 leading-none">
              2 months free
            </span>
          </button>
        </div>
      </div>

      {/* Plan cards */}
      <div className="grid gap-4 sm:grid-cols-3">

        {/* Starter */}
        <div className="relative rounded-2xl border border-border bg-card p-5 flex flex-col">
          <div className="mb-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-semibold">{STARTER.name}</span>
              {currentPlanId === "starter" && (
                <Badge variant="secondary" className="rounded-full text-[10px] px-2 py-0">
                  Active
                </Badge>
              )}
            </div>
            <div className="flex items-baseline">
              <span className="text-3xl font-black tracking-tight">Free</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">{STARTER.description}</p>
          </div>
          <ul className="space-y-2 flex-1 mb-5">
            {STARTER.features.map((f) => (
              <li key={f} className="flex items-start gap-2 text-xs text-muted-foreground">
                <Check className="h-3.5 w-3.5 shrink-0 text-primary mt-0.5" />
                {f}
              </li>
            ))}
          </ul>
          <Button size="sm" variant="outline" className="w-full" disabled>
            {currentPlanId === "starter" ? "Current plan" : "Free forever"}
          </Button>
        </div>

        {/* Growth + Business */}
        {PAID_PLANS.map((plan) => {
          const isCurrent = plan.id === currentPlanId;
          const planPrices = prices[plan.id];
          const price = interval === "monthly" ? planPrices.monthly : planPrices.yearly;
          const period = interval === "monthly" ? "/mo" : "/yr";

          return (
            <div
              key={plan.id}
              className={cn(
                "relative rounded-2xl border p-5 flex flex-col",
                plan.highlighted
                  ? "border-primary bg-primary/[0.03] shadow-sm"
                  : "border-border bg-card"
              )}
            >
              {plan.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="rounded-full bg-primary text-primary-foreground text-[10px] px-2.5 py-0.5 font-semibold shadow-sm">
                    Most popular
                  </Badge>
                </div>
              )}

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
                  <span className="text-3xl font-black tracking-tight">{price}</span>
                  <span className="text-sm text-muted-foreground">{period}</span>
                </div>
                {interval === "yearly" && (
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {planPrices.yearlyPerMonth}/mo billed annually
                  </p>
                )}
                <p className="text-xs text-muted-foreground mt-1">{plan.description}</p>
              </div>

              <ul className="space-y-2 flex-1 mb-5">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-xs text-muted-foreground">
                    <Check className="h-3.5 w-3.5 shrink-0 text-primary mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>

              {isCurrent ? (
                <Button size="sm" variant="outline" className="w-full" disabled>
                  Current plan
                </Button>
              ) : (
                <CheckoutButton
                  plan={plan.id}
                  interval={interval}
                  currency={currency}
                  variant={plan.highlighted ? "default" : "outline"}
                  className="w-full text-sm"
                >
                  {plan.highlighted && <Zap className="h-3.5 w-3.5 mr-1" />}
                  Upgrade to {plan.name}
                </CheckoutButton>
              )}
            </div>
          );
        })}
      </div>

      {/* Currency note */}
      <p className="mt-3 text-xs text-muted-foreground/60 text-right">
        Prices in {currency === "eur" ? "EUR (€)" : "USD ($)"}
        {" · "}
        <span className="italic">detected from your location</span>
      </p>
    </div>
  );
}

// ── DowngradeSection — shown when subscription is set to cancel ────────────

export function CancellationBanner({
  planName,
  periodEnd,
}: {
  planName: string;
  periodEnd: string;
}) {
  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50 dark:border-amber-900/50 dark:bg-amber-900/20 px-5 py-4 flex items-start gap-3">
      <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-amber-800 dark:text-amber-300">
          Your {planName} plan will end on {periodEnd}
        </p>
        <p className="text-xs text-amber-700/70 dark:text-amber-400/70 mt-0.5">
          After that, you&apos;ll be moved to the Free plan (100 renders/month).
        </p>
      </div>
      <ResumeButton className="shrink-0 text-xs h-8 px-3" />
    </div>
  );
}
