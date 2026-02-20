"use client";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";

const plans = [
  {
    name: "Starter",
    price: "$0",
    period: "forever",
    description: "For side projects and early exploration.",
    highlighted: false,
    features: [
      "500 renders / month",
      "5,000 pages / month",
      "2 API keys",
      "1 webhook endpoint",
      "Community support",
      "7-day log retention",
    ],
    cta: "Start for free",
    href: "/register",
    ctaVariant: "outline" as const,
  },
  {
    name: "Growth",
    price: "$49",
    period: "per month",
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
      "Signed delivery URLs",
      "Template library (25 templates)",
    ],
    cta: "Start free trial",
    href: "/register?plan=growth",
    ctaVariant: "default" as const,
  },
  {
    name: "Business",
    price: "$199",
    period: "per month",
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
      "Audit log",
    ],
    cta: "Contact sales",
    href: "mailto:sales@rendrpdf.com",
    ctaVariant: "outline" as const,
  },
];

export function PricingCards() {
  return (
    <div className="grid gap-6 lg:grid-cols-3 lg:gap-8 lg:items-start">
      {plans.map((plan) => (
        <div
          key={plan.name}
          className={cn(
            "relative flex flex-col rounded-2xl p-8",
            plan.highlighted
              ? "bg-zinc-950 shadow-2xl shadow-black/20 ring-1 ring-white/10 lg:scale-[1.03]"
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
                {plan.price}
              </span>
              <span className={cn("text-sm", plan.highlighted ? "text-zinc-500" : "text-muted-foreground")}>
                /{plan.period}
              </span>
            </div>
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
  );
}
