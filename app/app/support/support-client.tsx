"use client";

import { useActionState, useEffect } from "react";
import { submitSupportTicketAction } from "@/app/actions/feedback";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Headphones, TicketCheck, AlertCircle, Clock,
  CheckCircle2, XCircle, MessageSquareDashed,
} from "lucide-react";
import { useRouter } from "next/navigation";

type Ticket = {
  id: string;
  subject: string;
  message: string;
  status: string;
  priority: string;
  createdAt: string;
};

const PRIORITIES = [
  { value: "low",    label: "Low",    desc: "General questions" },
  { value: "normal", label: "Normal", desc: "Regular support" },
  { value: "high",   label: "High",   desc: "Affecting my work" },
  { value: "urgent", label: "Urgent", desc: "Production down" },
];

const STATUS_CONFIG: Record<string, { icon: React.ElementType; cls: string; label: string; border: string }> = {
  open:        { icon: Clock,        cls: "text-blue-400",    label: "Open",        border: "border-blue-500/20 bg-blue-500/5" },
  in_progress: { icon: AlertCircle,  cls: "text-amber-400",   label: "In Progress", border: "border-amber-500/20 bg-amber-500/5" },
  resolved:    { icon: CheckCircle2, cls: "text-emerald-400", label: "Resolved",    border: "border-emerald-500/20 bg-emerald-500/5" },
  closed:      { icon: XCircle,      cls: "text-zinc-400",    label: "Closed",      border: "border-zinc-500/20 bg-zinc-500/5" },
};

const PRIORITY_CLS: Record<string, string> = {
  low: "text-zinc-400", normal: "text-muted-foreground",
  high: "text-amber-400", urgent: "text-red-400 font-semibold",
};

export function SupportClient({ tickets }: { tickets: Ticket[] }) {
  const [state, action, pending] = useActionState(submitSupportTicketAction, null);
  const router = useRouter();

  useEffect(() => {
    if (state?.success) {
      const t = setTimeout(() => router.refresh(), 800);
      return () => clearTimeout(t);
    }
  }, [state, router]);

  return (
    <div className="px-6 py-8 max-w-3xl space-y-8">
      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0">
          <Headphones className="h-5 w-5 text-blue-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Support</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Submit a ticket and we'll get back to you as soon as possible.
          </p>
        </div>
      </div>

      {/* Ticket form */}
      <div className="rounded-xl border border-border bg-card p-6 space-y-5">
        <h2 className="text-sm font-semibold">New Ticket</h2>

        <form action={action} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="subject" className="text-[13px]">Subject</Label>
            <Input
              id="subject"
              name="subject"
              placeholder="Briefly describe your issue"
              required
              className="h-9 text-[13px]"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-[13px]">Priority</Label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {PRIORITIES.map((p) => (
                <label key={p.value} className="relative cursor-pointer">
                  <input type="radio" name="priority" value={p.value} defaultChecked={p.value === "normal"} className="sr-only peer" />
                  <div className="rounded-lg border border-border bg-background px-3 py-2 text-center peer-checked:border-primary peer-checked:bg-primary/5 transition-all">
                    <p className="text-[12px] font-medium">{p.label}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{p.desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="message" className="text-[13px]">Message</Label>
            <textarea
              id="message"
              name="message"
              rows={5}
              placeholder="Describe your issue in detail…"
              required
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-[13px] resize-none focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground"
            />
          </div>

          {state?.error && (
            <p className="text-[13px] text-red-400 flex items-center gap-1.5">
              <AlertCircle className="h-3.5 w-3.5 shrink-0" /> {state.error}
            </p>
          )}

          {state?.success && (
            <p className="text-[13px] text-emerald-400 flex items-center gap-1.5">
              <TicketCheck className="h-3.5 w-3.5 shrink-0" /> Ticket submitted! We'll be in touch soon.
            </p>
          )}

          <Button type="submit" disabled={pending} className="h-9">
            {pending ? "Submitting…" : "Submit Ticket"}
          </Button>
        </form>
      </div>

      {/* Ticket history */}
      {tickets.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold mb-4">Your Tickets</h2>
          <div className="space-y-3">
            {tickets.map((t) => {
              const cfg = STATUS_CONFIG[t.status] ?? STATUS_CONFIG.open;
              const StatusIcon = cfg.icon;
              return (
                <div key={t.id} className={`rounded-xl border ${cfg.border} p-4`}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-[13px] font-medium">{t.subject}</p>
                      <p className="text-[12px] text-muted-foreground mt-1 line-clamp-2">{t.message}</p>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <StatusIcon className={`h-3.5 w-3.5 ${cfg.cls}`} />
                      <span className={`text-[11px] font-medium ${cfg.cls}`}>{cfg.label}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 mt-3">
                    <span className={`text-[11px] ${PRIORITY_CLS[t.priority] ?? ""}`}>
                      {t.priority.charAt(0).toUpperCase() + t.priority.slice(1)} priority
                    </span>
                    <span className="text-[11px] text-muted-foreground/50">·</span>
                    <span className="text-[11px] text-muted-foreground/50">
                      {new Date(t.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {tickets.length === 0 && (
        <div className="rounded-xl border border-border bg-card p-10 text-center">
          <MessageSquareDashed className="h-8 w-8 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">No tickets yet.</p>
          <p className="text-[12px] text-muted-foreground/60 mt-1">Submit a ticket above and we'll respond shortly.</p>
        </div>
      )}
    </div>
  );
}
