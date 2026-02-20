import type { Metadata } from "next";
import { CreditCard, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

export const metadata: Metadata = { title: "Billing" };

const invoices = [
  { id: "INV-0003", date: "Feb 1, 2026", amount: "$49.00", status: "Paid" },
  { id: "INV-0002", date: "Jan 1, 2026", amount: "$49.00", status: "Paid" },
  { id: "INV-0001", date: "Dec 1, 2025", amount: "$0.00", status: "Free trial" },
];

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
                <span className="font-semibold">Growth</span>
                <Badge variant="outline" className="rounded-full text-xs text-emerald-600 border-emerald-200 dark:border-emerald-800 dark:text-emerald-400">
                  Active
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-0.5">
                $49 / month · renews Mar 1, 2026
              </p>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/pricing">Change plan</Link>
            </Button>
          </div>
          <Separator />
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted">
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">Visa ending in 4242</p>
              <p className="text-xs text-muted-foreground">Expires 08 / 28</p>
            </div>
            <Button variant="ghost" size="sm">Update</Button>
          </div>
        </CardContent>
      </Card>

      {/* Invoices */}
      <div>
        <h2 className="text-base font-semibold mb-4">Invoice history</h2>
        <div className="overflow-hidden rounded-xl border border-border">
          {invoices.map((inv, i) => (
            <div
              key={inv.id}
              className={`flex items-center gap-4 px-4 py-3 ${i < invoices.length - 1 ? "border-b border-border" : ""}`}
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{inv.id}</p>
                <p className="text-xs text-muted-foreground">{inv.date}</p>
              </div>
              <span className="text-sm font-medium tabular-nums">{inv.amount}</span>
              <Badge variant="outline" className="rounded-full text-xs">{inv.status}</Badge>
              <Button variant="ghost" size="icon" className="h-7 w-7">
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Danger zone */}
      <div className="rounded-xl border border-destructive/30 p-5">
        <h2 className="text-base font-semibold text-destructive mb-2">Danger zone</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Cancel your subscription. Your workspace will revert to the free tier at the end of the current billing period. Existing data is preserved.
        </p>
        <Button variant="outline" size="sm" className="border-destructive/30 text-destructive hover:bg-destructive/5">
          Cancel subscription
        </Button>
      </div>
    </div>
  );
}
