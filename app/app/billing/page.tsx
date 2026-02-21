import type { Metadata } from "next";
import { Zap, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export const metadata: Metadata = { title: "Billing" };

export default function BillingPage() {
  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Billing</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your plan and payment details.
        </p>
      </div>

      {/* Current plan */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-base">Current plan</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold">Starter</span>
                <Badge variant="outline" className="rounded-full text-xs">
                  Free
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-0.5">
                100 pages / month · no credit card required
              </p>
            </div>
            <Button size="sm" asChild>
              <Link href="/pricing">
                <Zap className="h-3.5 w-3.5 mr-1.5" />
                Upgrade
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Usage summary */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-base">This month</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-end justify-between mb-2">
            <span className="text-sm text-muted-foreground">Pages rendered</span>
            <span className="text-sm font-medium tabular-nums">— / 100</span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
            <div className="h-full w-0 rounded-full bg-primary" />
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Usage resets on the 1st of each month.
          </p>
        </CardContent>
      </Card>

      {/* Invoice history */}
      <div>
        <h2 className="text-base font-semibold mb-4">Invoice history</h2>
        <div className="flex flex-col items-center justify-center rounded-xl border border-border py-12 text-center">
          <ArrowRight className="h-8 w-8 text-muted-foreground/30 mb-3 rotate-[-90deg]" />
          <p className="text-sm font-medium">No invoices yet</p>
          <p className="text-xs text-muted-foreground mt-1">
            Invoices will appear here once you upgrade to a paid plan.
          </p>
        </div>
      </div>
    </div>
  );
}
