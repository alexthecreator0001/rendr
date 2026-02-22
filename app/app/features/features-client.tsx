"use client";

import { useActionState, useTransition, useEffect, useState } from "react";
import { submitFeatureRequestAction, toggleVoteAction } from "@/app/actions/feedback";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lightbulb, ChevronUp, AlertCircle, Plus, X } from "lucide-react";
import { useRouter } from "next/navigation";

type Feature = {
  id: string;
  title: string;
  description: string;
  status: string;
  votes: number;
  hasVoted: boolean;
  userEmail: string;
  createdAt: string;
};

const STATUS_CONFIG: Record<string, { label: string; cls: string }> = {
  submitted:   { label: "Submitted",   cls: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20" },
  planned:     { label: "Planned",     cls: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
  in_progress: { label: "In Progress", cls: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
  shipped:     { label: "Shipped",     cls: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
  declined:    { label: "Declined",    cls: "bg-red-500/10 text-red-400 border-red-500/20" },
};

function FeatureCard({ feature }: { feature: Feature }) {
  const router = useRouter();
  const [voting, startVote] = useTransition();
  const cfg = STATUS_CONFIG[feature.status] ?? STATUS_CONFIG.submitted;

  function vote() {
    startVote(async () => {
      await toggleVoteAction(feature.id);
      router.refresh();
    });
  }

  return (
    <div className="rounded-xl border border-border bg-card p-5 flex gap-4 hover:border-border/80 transition-colors">
      {/* Vote button */}
      <button
        onClick={vote}
        disabled={voting}
        className={`flex flex-col items-center justify-center gap-0.5 rounded-lg border px-3 py-2.5 text-center transition-all shrink-0 min-w-[52px] ${
          feature.hasVoted
            ? "border-primary bg-primary/10 text-primary"
            : "border-border text-muted-foreground hover:border-primary/60 hover:text-primary"
        }`}
      >
        <ChevronUp className={`h-4 w-4 transition-transform ${voting ? "scale-75 opacity-50" : ""}`} />
        <span className="text-[13px] font-bold tabular-nums leading-none">{feature.votes}</span>
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className="text-[14px] font-semibold leading-snug">{feature.title}</p>
          <span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold shrink-0 ${cfg.cls}`}>
            {cfg.label}
          </span>
        </div>
        <p className="text-[12px] text-muted-foreground mt-1.5 line-clamp-2 leading-relaxed">{feature.description}</p>
        <p className="text-[11px] text-muted-foreground/40 mt-2">
          {new Date(feature.createdAt).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}

export function FeaturesClient({ features }: { features: Feature[] }) {
  const [showForm, setShowForm] = useState(false);
  const [state, action, pending] = useActionState(submitFeatureRequestAction, null);
  const router = useRouter();

  useEffect(() => {
    if (state?.success) {
      setShowForm(false);
      router.refresh();
    }
  }, [state, router]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8 space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="h-10 w-10 rounded-xl bg-amber-500/10 flex items-center justify-center shrink-0">
            <Lightbulb className="h-5 w-5 text-amber-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Feature Requests</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Vote on features you'd like to see, or suggest new ones.
            </p>
          </div>
        </div>
        <Button
          size="sm"
          variant={showForm ? "outline" : "default"}
          onClick={() => setShowForm((v) => !v)}
          className="h-8 shrink-0"
        >
          {showForm ? (
            <><X className="h-3.5 w-3.5 mr-1.5" /> Cancel</>
          ) : (
            <><Plus className="h-3.5 w-3.5 mr-1.5" /> Request</>
          )}
        </Button>
      </div>

      {/* Submit form */}
      {showForm && (
        <div className="rounded-xl border border-border bg-card p-6 space-y-4">
          <h2 className="text-sm font-semibold">New Feature Request</h2>
          <form action={action} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="title" className="text-[13px]">Title</Label>
              <Input
                id="title"
                name="title"
                placeholder="Short, descriptive title"
                required
                className="h-9 text-[13px]"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="description" className="text-[13px]">Description</Label>
              <textarea
                id="description"
                name="description"
                rows={4}
                placeholder="Describe the feature and why it would be valuable…"
                required
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-[13px] resize-none focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground"
              />
            </div>

            {state?.error && (
              <p className="text-[13px] text-red-400 flex items-center gap-1.5">
                <AlertCircle className="h-3.5 w-3.5 shrink-0" /> {state.error}
              </p>
            )}

            <Button type="submit" disabled={pending} className="h-9">
              {pending ? "Submitting…" : "Submit Request"}
            </Button>
          </form>
        </div>
      )}

      {/* Feature list */}
      {features.length === 0 ? (
        <div className="rounded-xl border border-border bg-card p-12 text-center">
          <Lightbulb className="h-8 w-8 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">No feature requests yet.</p>
          <p className="text-[12px] text-muted-foreground/60 mt-1">Be the first to suggest something!</p>
          {!showForm && (
            <Button size="sm" onClick={() => setShowForm(true)} className="mt-4 h-8">
              <Plus className="h-3.5 w-3.5 mr-1.5" /> Make a Request
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {features.map((f) => <FeatureCard key={f.id} feature={f} />)}
        </div>
      )}
    </div>
  );
}
