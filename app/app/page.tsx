import type { Metadata } from "next";
import { BriefcaseBusiness, CheckCircle2, FileText, Timer } from "lucide-react";
import { SummaryCards } from "@/components/dashboard/summary-cards";
import { StatusPill } from "@/components/dashboard/status-pill";
import { mockJobs } from "@/lib/mock/jobs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = { title: "Dashboard" };

const summaryCardData = [
  {
    title: "Jobs this month",
    value: "1,843",
    change: "+12% from last month",
    changeType: "up" as const,
    icon: BriefcaseBusiness,
  },
  {
    title: "Completed",
    value: "1,821",
    change: "98.8% success rate",
    changeType: "neutral" as const,
    icon: CheckCircle2,
  },
  {
    title: "Pages rendered",
    value: "7,211",
    change: "+8% from last month",
    changeType: "up" as const,
    icon: FileText,
  },
  {
    title: "Avg render time",
    value: "910ms",
    change: "-40ms from last month",
    changeType: "up" as const,
    icon: Timer,
  },
];

const recentJobs = mockJobs.slice(0, 5);

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AppOverviewPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Acme Internal · Feb 2026
        </p>
      </div>

      {/* Summary cards */}
      <SummaryCards cards={summaryCardData} />

      {/* Recent jobs */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold">Recent jobs</h2>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/app/jobs" className="gap-1">
              View all <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>
        <div className="rounded-xl border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden sm:table-cell">Pages</TableHead>
                <TableHead className="hidden md:table-cell">Created</TableHead>
                <TableHead className="hidden lg:table-cell">Duration</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentJobs.map((job) => (
                <TableRow key={job.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium text-sm">{job.name}</p>
                      <p className="font-mono text-xs text-muted-foreground">{job.id}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <StatusPill status={job.status} />
                  </TableCell>
                  <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">
                    {job.pages ?? "—"}
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                    {formatDate(job.createdAt)}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                    {job.durationMs ? `${job.durationMs}ms` : "—"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
