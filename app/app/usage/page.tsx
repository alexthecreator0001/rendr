import type { Metadata } from "next";
import { mockUsage } from "@/lib/mock/usage";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ImagePlaceholder } from "@/components/media/image-placeholder";

export const metadata: Metadata = { title: "Usage" };

export default function UsagePage() {
  const {
    currentPeriodJobs,
    currentPeriodPages,
    includedJobs,
    includedPages,
    planName,
    periodStart,
    periodEnd,
  } = mockUsage;

  const jobPct = Math.round((currentPeriodJobs / includedJobs) * 100);
  const pagePct = Math.round((currentPeriodPages / includedPages) * 100);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Usage</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {planName} plan · {periodStart} – {periodEnd}
        </p>
      </div>

      {/* Progress stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Card className="border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Renders this period
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold tabular-nums">
              {currentPeriodJobs.toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              of {includedJobs.toLocaleString()} included ({jobPct}%)
            </p>
            <div className="mt-3 h-1.5 w-full rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{ width: `${Math.min(jobPct, 100)}%` }}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pages rendered
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold tabular-nums">
              {currentPeriodPages.toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              of {includedPages.toLocaleString()} included ({pagePct}%)
            </p>
            <div className="mt-3 h-1.5 w-full rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{ width: `${Math.min(pagePct, 100)}%` }}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chart placeholder */}
      <div>
        <h2 className="text-base font-semibold mb-3">Daily renders — last 20 days</h2>
        {/* intended final asset: recharts LineChart using mockUsage.daily data */}
        {/* suggested export format: n/a (replace with recharts component) */}
        {/* exact size: responsive, aspect: ~5/1 max-height: 220px */}
        <ImagePlaceholder
          label="Daily render volume — LineChart (recharts). Data: mockUsage.daily[]. Replace this placeholder with a recharts ResponsiveContainer."
          aspect="5/1"
          rounded="xl"
          className="w-full"
        />
        <p className="text-xs text-muted-foreground mt-2">
          Replace with a recharts <code className="font-mono">LineChart</code> using{" "}
          <code className="font-mono">mockUsage.daily</code> as data source.
        </p>
      </div>
    </div>
  );
}
