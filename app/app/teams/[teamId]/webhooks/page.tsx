"use client";

import { useActionState, useState } from "react";
import { useParams } from "next/navigation";
import {
  createTeamWebhookAction,
  deleteTeamWebhookAction,
  toggleTeamWebhookAction,
} from "@/app/actions/webhooks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Plus, Trash2, Webhook } from "lucide-react";

const AVAILABLE_EVENTS = ["job.completed", "job.failed"];

type WebhookRow = {
  id: string;
  url: string;
  enabled: boolean;
  events: string[];
  createdAt: string;
};

export default function TeamWebhooksPage() {
  const { teamId } = useParams<{ teamId: string }>();
  const [webhooks, setWebhooks] = useState<WebhookRow[]>([]);
  const [loaded, setLoaded] = useState(false);

  // Fetch webhooks on mount
  if (!loaded) {
    fetch(`/api/dashboard/team-webhooks?teamId=${teamId}`, { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => {
        setWebhooks(data);
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Team Webhooks</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Get notified when team jobs complete or fail.
          </p>
        </div>
        <CreateDialog teamId={teamId} />
      </div>

      {webhooks.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border py-16 text-center">
          <Webhook className="mx-auto h-8 w-8 text-muted-foreground/40 mb-3" />
          <p className="text-sm text-muted-foreground">No team webhooks configured.</p>
          <p className="text-xs text-muted-foreground/60 mt-1">
            Add a webhook to receive real-time notifications for team jobs.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {webhooks.map((wh) => (
            <div key={wh.id} className="rounded-xl border border-border p-4 flex items-center gap-4">
              <ToggleForm webhook={wh} teamId={teamId} />
              <div className="flex-1 min-w-0">
                <p className="font-mono text-sm truncate">{wh.url}</p>
                <div className="flex gap-1.5 mt-1.5 flex-wrap">
                  {wh.events.map((e) => (
                    <Badge key={e} variant="secondary" className="text-[10px] font-mono px-1.5 py-0">
                      {e}
                    </Badge>
                  ))}
                </div>
              </div>
              <DeleteButton id={wh.id} teamId={teamId} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function CreateDialog({ teamId }: { teamId: string }) {
  const [open, setOpen] = useState(false);
  const [state, action, pending] = useActionState(createTeamWebhookAction, null);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-1.5">
          <Plus className="h-4 w-4" /> Add webhook
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add team webhook</DialogTitle>
          <DialogDescription>We&apos;ll POST signed events to this URL for team jobs.</DialogDescription>
        </DialogHeader>
        <form action={action} className="space-y-4 pt-2">
          <input type="hidden" name="teamId" value={teamId} />
          {state?.error && <p className="text-sm text-destructive">{state.error}</p>}
          <div className="space-y-1.5">
            <Label htmlFor="url">Endpoint URL</Label>
            <Input id="url" name="url" type="url" placeholder="https://api.example.com/webhooks/rendr" required />
          </div>
          <div className="space-y-2">
            <Label>Events</Label>
            {AVAILABLE_EVENTS.map((event) => (
              <label key={event} className="flex items-center gap-2.5 cursor-pointer">
                <input type="checkbox" name="events" value={event} defaultChecked className="rounded border-border" />
                <span className="text-sm font-mono">{event}</span>
              </label>
            ))}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={pending}>{pending ? "Adding\u2026" : "Add webhook"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function ToggleForm({ webhook, teamId }: { webhook: WebhookRow; teamId: string }) {
  const [enabled, setEnabled] = useState(webhook.enabled);
  const [, action] = useActionState(toggleTeamWebhookAction, null);

  return (
    <form action={action} id={`toggle-form-${webhook.id}`}>
      <input type="hidden" name="id" value={webhook.id} />
      <input type="hidden" name="teamId" value={teamId} />
      <input type="hidden" name="enabled" value={(!enabled).toString()} />
      <Switch
        checked={enabled}
        onCheckedChange={(val) => {
          setEnabled(val);
          const btn = document.createElement("button");
          btn.type = "submit";
          btn.style.display = "none";
          const form = document.getElementById(`toggle-form-${webhook.id}`);
          form?.appendChild(btn);
          btn.click();
          form?.removeChild(btn);
        }}
      />
    </form>
  );
}

function DeleteButton({ id, teamId }: { id: string; teamId: string }) {
  const [, action, pending] = useActionState(deleteTeamWebhookAction, null);
  return (
    <form action={action}>
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="teamId" value={teamId} />
      <Button type="submit" size="sm" variant="ghost" className="h-7 w-7 p-0 text-destructive hover:text-destructive" disabled={pending}>
        <Trash2 className="h-3.5 w-3.5" />
      </Button>
    </form>
  );
}
