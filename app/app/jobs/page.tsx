"use client";

import { useState } from "react";
import { mockJobs, type JobStatus } from "@/lib/mock/jobs";
import { StatusPill } from "@/components/dashboard/status-pill";
import { EmptyState } from "@/components/dashboard/empty-state";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BriefcaseBusiness } from "lucide-react";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function JobsPage() {
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filtered = statusFilter === "all"
    ? mockJobs
    : mockJobs.filter((j) => j.status === statusFilter);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Jobs</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {mockJobs.length} total jobs this workspace.
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-36 h-8 text-xs">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="done">Done</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="queued">Queued</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={BriefcaseBusiness}
          title="No jobs match this filter"
          description="Try changing the status filter or check back after your next render."
          action={{
            label: "Clear filter",
            onClick: () => setStatusFilter("all"),
          }}
        />
      ) : (
        <div className="rounded-xl border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Job</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden sm:table-cell">Template</TableHead>
                <TableHead className="hidden md:table-cell">Pages</TableHead>
                <TableHead className="hidden lg:table-cell">Duration</TableHead>
                <TableHead className="hidden md:table-cell">Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((job) => (
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
                  <TableCell className="hidden sm:table-cell text-xs font-mono text-muted-foreground">
                    {job.templateId ?? <span className="text-muted-foreground/60">inline</span>}
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                    {job.pages ?? "—"}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                    {job.durationMs ? `${job.durationMs}ms` : "—"}
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                    {formatDate(job.createdAt)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
