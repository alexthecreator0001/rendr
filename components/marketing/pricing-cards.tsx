"use client";

import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import Link from "next/link";

const plans = [
  {
    name: "Starter",
    price: "$0",
    period: "/month",
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
    cta: "Get started",
    href: "/register",
  },
  {
    name: "Growth",
    price: "$49",
    period: "/month",
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
      "Template library (up to 25)",
    ],
    cta: "Start free trial",
    href: "/register?plan=growth",
  },
  {
    name: "Business",
    price: "$199",
    period: "/month",
    description: "For high-volume and compliance-sensitive workloads.",
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
  },
];

export function PricingCards() {
  return (
    <div className="grid gap-6 lg:grid-cols-3 lg:gap-8">
      {plans.map((plan) => (
        <Card
          key={plan.name}
          className={cn(
            "relative flex flex-col border-border",
            plan.highlighted && "border-primary/50 shadow-lg ring-1 ring-primary/20"
          )}
        >
          {plan.badge && (
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <Badge className="rounded-full px-3 py-0.5 text-xs">
                {plan.badge}
              </Badge>
            </div>
          )}
          <CardHeader className="pb-2 pt-8">
            <p className="text-sm font-semibold text-muted-foreground">{plan.name}</p>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-4xl font-extrabold tracking-tight">{plan.price}</span>
              <span className="text-sm text-muted-foreground">{plan.period}</span>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">{plan.description}</p>
          </CardHeader>
          <CardContent className="flex-1 pb-6">
            <ul className="space-y-2.5">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2.5">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <span className="text-sm text-muted-foreground">{feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            <Button
              variant={plan.highlighted ? "default" : "outline"}
              className="w-full rounded-lg"
              asChild
            >
              <Link href={plan.href}>{plan.cta}</Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
