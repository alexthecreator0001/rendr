"use client";
import { useState } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { PLAN_PRICES, type Currency } from "@/lib/currency";

const plans = [
  {
    id: "starter" as const,
    name: "Starter",
    description: "For side projects and early exploration.",
    highlighted: false,
    features: [
      "100 renders / month",
      "Max 2 MB per render",
      "2 API keys",
      "Community support",
      "7-day log retention",
    ],
    cta: "Start for free",
    href: "/register",
    ctaVariant: "outline" as const,
  },
  {
    id: "growth" as const,
    name: "Growth",
    description: "For teams shipping PDFs in production.",
    highlighted: true,
    badge: "Most popular",
    features: [
      "5,000 renders / month",
      "50,000 pages / month",
      "Unlimited API keys",
      "5 webhook endpoints",
      "Email support",
      "30-day log retention",
    ],
    cta: "Start free trial",
    href: "/register?plan=growth",
    ctaVariant: "default" as const,
  },
  {
    id: "business" as const,
    name: "Business",
    description: "High-volume and compliance-sensitive workloads.",
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
    cta: "Contact sales",
    href: "mailto:sales@rendrpdf.com",
    ctaVariant: "outline" as const,
  },
];

interface PricingCardsProps {
  currency?: Currency;
}

export function PricingCards({ currency = "eur" }: PricingCardsProps) {
  const [annual, setAnnual] = useState(false);
  const prices = PLAN_PRICES[currency];

  function getPrice(plan: typeof plans[number]) {
    if (plan.id === "starter") return "Free";
    const planPrices = prices[plan.id as "growth" | "business"];
    if (annual) return planPrices.yearlyPerMonth;
    return planPrices.monthly;
  }

  function getPeriod(plan: typeof plans[number]) {
    if (plan.id === "starter") return "forever";
    return annual ? "/ mo, billed annually" : "/ month";
  }

  return (
    <div className="space-y-8">
      {/* Toggle */}
      <div className="flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => setAnnual(false)}
          className={cn(
            "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
            !annual ? "bg-primary/10 text-foreground" : "text-muted-foreground hover:text-foreground"
          )}
        >
          Monthly
        </button>
        <button
          type="button"
          onClick={() => setAnnual(true)}
          className={cn(
            "rounded-full px-4 py-1.5 text-sm font-medium transition-colors flex items-center gap-2",
            annual ? "bg-primary/10 text-foreground" : "text-muted-foreground hover:text-foreground"
          )}
        >
          Annual
          <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 ring-1 ring-emerald-500/20">
            2 months free
          </span>
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3 lg:gap-8 lg:items-start">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={cn(
              "relative flex flex-col rounded-2xl p-8",
              plan.highlighted
                ? "bg-zinc-900 dark:bg-zinc-950 shadow-2xl shadow-black/20 ring-1 ring-zinc-800 dark:ring-white/10 lg:scale-[1.03]"
                : "border border-border bg-card shadow-sm"
            )}
          >
            {plan.badge && (
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                <span className="rounded-full bg-blue-500 px-3.5 py-1 text-xs font-semibold text-white">
                  {plan.badge}
                </span>
              </div>
            )}

            <div className="mb-6">
              <p className={cn("text-sm font-semibold", plan.highlighted ? "text-zinc-400" : "text-muted-foreground")}>
                {plan.name}
              </p>
              <div className="mt-3 flex items-baseline gap-1">
                <span className={cn("text-5xl font-extrabold tracking-tight", plan.highlighted ? "text-white" : "text-foreground")}>
                  {getPrice(plan)}
                </span>
                <span className={cn("text-sm", plan.highlighted ? "text-zinc-500" : "text-muted-foreground")}>
                  {getPeriod(plan)}
                </span>
              </div>
              {annual && plan.id !== "starter" && (
                <p className={cn("mt-1 text-xs", plan.highlighted ? "text-zinc-500" : "text-muted-foreground")}>
                  {prices[plan.id as "growth" | "business"].yearly} billed annually
                </p>
              )}
              <p className={cn("mt-2 text-sm", plan.highlighted ? "text-zinc-400" : "text-muted-foreground")}>
                {plan.description}
              </p>
            </div>

            <Button
              variant={plan.highlighted ? "default" : plan.ctaVariant}
              className={cn(
                "w-full rounded-xl mb-8",
                plan.highlighted && "bg-white text-zinc-900 hover:bg-white/90"
              )}
              asChild
            >
              <Link href={plan.href}>{plan.cta}</Link>
            </Button>

            <ul className="space-y-3 flex-1">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-start gap-3">
                  <Check className={cn("mt-0.5 h-4 w-4 shrink-0", plan.highlighted ? "text-blue-400" : "text-primary")} />
                  <span className={cn("text-sm", plan.highlighted ? "text-zinc-300" : "text-muted-foreground")}>
                    {feature}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Currency note */}
      <p className="text-center text-xs text-muted-foreground/60">
        Prices in {currency === "eur" ? "EUR" : "USD"} · detected from your location
      </p>
    </div>
  );
}
