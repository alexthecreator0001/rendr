"use client";

import { useRouter, useTransition } from "react";
import { updateTicketStatusAction } from "@/app/actions/feedback";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

type Ticket = {
  id: string;
  email: string;
  subject: string;
  message: string;
  status: string;
  priority: string;
  createdAt: string;
};

const STATUS_LABELS: Record<string, { label: string; cls: string }> = {
  open:        { label: "Open",        cls: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
  in_progress: { label: "In Progress", cls: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
  resolved:    { label: "Resolved",    cls: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
  closed:      { label: "Closed",      cls: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20" },
};

const PRIORITY_LABELS: Record<string, { label: string; cls: string }> = {
  low:    { label: "Low",    cls: "text-zinc-400" },
  normal: { label: "Normal", cls: "text-muted-foreground" },
  high:   { label: "High",   cls: "text-amber-400" },
  urgent: { label: "Urgent", cls: "text-red-400 font-semibold" },
};

function TicketRow({ ticket }: { ticket: Ticket }) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const status = STATUS_LABELS[ticket.status] ?? STATUS_LABELS.open;
  const priority = PRIORITY_LABELS[ticket.priority] ?? PRIORITY_LABELS.normal;

  function setStatus(newStatus: string) {
    startTransition(async () => {
      const fd = new FormData();
      fd.set("ticketId", ticket.id);
      fd.set("status", newStatus);
      await updateTicketStatusAction(null, fd);
      router.refresh();
    });
  }

  return (
    <tr className="border-b border-border hover:bg-muted/20 transition-colors">
      <td className="px-4 py-3">
        <p className="text-[13px] font-medium">{ticket.subject}</p>
        <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-1">{ticket.message}</p>
      </td>
      <td className="px-4 py-3 text-[13px] text-muted-foreground truncate max-w-[160px]">{ticket.email}</td>
      <td className="px-4 py-3">
        <span className={`text-[12px] ${priority.cls}`}>{priority.label}</span>
      </td>
      <td className="px-4 py-3">
        <span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold ${status.cls}`}>
          {status.label}
        </span>
      </td>
      <td className="px-4 py-3 text-[12px] text-muted-foreground">
        {new Date(ticket.createdAt).toLocaleDateString()}
      </td>
      <td className="px-4 py-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-7 gap-1 text-[11px] px-2">
              Update <ChevronDown className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-36">
            {Object.entries(STATUS_LABELS).map(([key, val]) => (
              <DropdownMenuItem
                key={key}
                onSelect={() => setStatus(key)}
                disabled={ticket.status === key}
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

export function AdminSupportClient({
  tickets, total, statusFilter,
}: {
  tickets: Ticket[];
  total: number;
  statusFilter: string;
}) {
  const STATUSES = ["all", "open", "in_progress", "resolved", "closed"];

  return (
    <div className="px-6 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Support</h1>
        <p className="text-sm text-muted-foreground mt-1">{total.toLocaleString()} tickets</p>
      </div>

      {/* Filter */}
      <div className="flex gap-2 flex-wrap">
        {STATUSES.map((s) => (
          <a
            key={s}
            href={`/admin/support?status=${s}`}
            className={`rounded-lg px-3 py-1.5 text-[12px] font-medium capitalize transition-colors ${
              statusFilter === s
                ? "bg-foreground text-background"
                : "border border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            {s === "in_progress" ? "In Progress" : s === "all" ? "All" : s.charAt(0).toUpperCase() + s.slice(1)}
          </a>
        ))}
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Subject</th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">From</th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Priority</th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Status</th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Date</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {tickets.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-sm text-muted-foreground">
                  No tickets found.
                </td>
              </tr>
            ) : (
              tickets.map((t) => <TicketRow key={t.id} ticket={t} />)
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
