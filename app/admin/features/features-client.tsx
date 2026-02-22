"use client";

import { useRouter, useTransition } from "next/navigation";
import { updateFeatureStatusAction } from "@/app/actions/feedback";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";

type Feature = {
  id: string;
  title: string;
  description: string;
  status: string;
  createdAt: string;
  votes: number;
  userEmail: string;
};

const STATUS_CONFIG: Record<string, { label: string; cls: string }> = {
  submitted:   { label: "Submitted",   cls: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20" },
  planned:     { label: "Planned",     cls: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
  in_progress: { label: "In Progress", cls: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
  shipped:     { label: "Shipped",     cls: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
  declined:    { label: "Declined",    cls: "bg-red-500/10 text-red-400 border-red-500/20" },
};

function FeatureRow({ feature }: { feature: Feature }) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const cfg = STATUS_CONFIG[feature.status] ?? STATUS_CONFIG.submitted;

  function setStatus(newStatus: string) {
    startTransition(async () => {
      const fd = new FormData();
      fd.set("featureId", feature.id);
      fd.set("status", newStatus);
      await updateFeatureStatusAction(null, fd);
      router.refresh();
    });
  }

  return (
    <tr className="border-b border-border hover:bg-muted/20 transition-colors">
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-0.5 text-muted-foreground/60 shrink-0">
            <ChevronUp className="h-3.5 w-3.5" />
            <span className="text-[12px] font-medium tabular-nums">{feature.votes}</span>
          </div>
        </div>
      </td>
      <td className="px-4 py-3">
        <p className="text-[13px] font-medium">{feature.title}</p>
        <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-2">{feature.description}</p>
      </td>
      <td className="px-4 py-3 text-[12px] text-muted-foreground truncate max-w-[140px]">{feature.userEmail}</td>
      <td className="px-4 py-3">
        <span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold ${cfg.cls}`}>
          {cfg.label}
        </span>
      </td>
      <td className="px-4 py-3 text-[12px] text-muted-foreground">
        {new Date(feature.createdAt).toLocaleDateString()}
      </td>
      <td className="px-4 py-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-7 gap-1 text-[11px] px-2">
              Update <ChevronDown className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-36">
            {Object.entries(STATUS_CONFIG).map(([key, val]) => (
              <DropdownMenuItem
                key={key}
                onSelect={() => setStatus(key)}
                disabled={feature.status === key}
                className="text-[12px]"
              >
                {val.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </td>
    </tr>
  );
}

export function AdminFeaturesClient({
  features, total, statusFilter,
}: {
  features: Feature[];
  total: number;
  statusFilter: string;
}) {
  const STATUSES = ["all", "submitted", "planned", "in_progress", "shipped", "declined"];

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Feature Requests</h1>
        <p className="text-sm text-muted-foreground mt-1">{total.toLocaleString()} requests</p>
      </div>

      {/* Filter */}
      <div className="flex gap-2 flex-wrap">
        {STATUSES.map((s) => {
          const label = s === "all" ? "All" : (STATUS_CONFIG[s]?.label ?? s);
          return (
            <a
              key={s}
              href={`/admin/features?status=${s}`}
              className={`rounded-lg px-3 py-1.5 text-[12px] font-medium transition-colors ${
                statusFilter === s
                  ? "bg-foreground text-background"
                  : "border border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {label}
            </a>
          );
        })}
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground w-16">Votes</th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Request</th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">From</th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Status</th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Date</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {features.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-sm text-muted-foreground">
                  No feature requests found.
                </td>
              </tr>
            ) : (
              features.map((f) => <FeatureRow key={f.id} feature={f} />)
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
