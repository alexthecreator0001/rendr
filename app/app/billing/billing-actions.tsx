"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Zap, Settings, Check } from "lucide-react";
import { cn } from "@/lib/utils";

// ── Plan data (client-side comparison grid) ────────────────────────────────

const STARTER = {
  id: "starter",
  name: "Starter",
  description: "Side projects and exploration",
  features: [
    "500 renders / month",
    "5,000 pages / month",
    "2 API keys",
    "Community support",
    "7-day log retention",
  ],
};

const PAID_PLANS = [
  {
    id: "growth" as const,
    name: "Growth",
    monthlyPrice: "€9.90",
    yearlyPrice: "€99",
    yearlyPerMonth: "€8.25",
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
    monthlyPrice: "€49.90",
    yearlyPrice: "€499",
    yearlyPerMonth: "€41.58",
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
  children,
  variant = "default",
  className,
}: {
  plan: string;
  interval?: "monthly" | "yearly";
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
        body: JSON.stringify({ plan, interval }),
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
      {loading ? "Redirecting…" : "Manage subscription"}
    </Button>
  );
}

// ── BillingPlansSection ────────────────────────────────────────────────────

export function BillingPlansSection({ currentPlanId }: { currentPlanId: string }) {
  const [interval, setInterval] = useState<"monthly" | "yearly">("monthly");

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
          const price = interval === "monthly" ? plan.monthlyPrice : plan.yearlyPrice;
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
                    {plan.yearlyPerMonth}/mo billed annually
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
    </div>
  );
}
