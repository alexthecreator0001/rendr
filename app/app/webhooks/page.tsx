"use client";

import { useState } from "react";
import { Plus, Webhook, AlertCircle } from "lucide-react";
import { mockWebhooks, type Webhook as WebhookType } from "@/lib/mock/webhooks";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EmptyState } from "@/components/dashboard/empty-state";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function WebhookRow({ webhook: initial }: { webhook: WebhookType }) {
  const [active, setActive] = useState(initial.active);

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border p-4 sm:flex-row sm:items-start sm:gap-4">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <code className="font-mono text-sm font-medium truncate">{initial.url}</code>
          {initial.failureCount > 0 && (
            <Badge variant="destructive" className="rounded-full text-[10px] shrink-0">
              {initial.failureCount} failures
            </Badge>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <span>Created {formatDate(initial.createdAt)}</span>
          {initial.lastDeliveredAt && (
            <>
              <span>·</span>
              <span>Last delivery {formatDate(initial.lastDeliveredAt)}</span>
            </>
          )}
        </div>
        <div className="mt-2 flex flex-wrap gap-1">
          {initial.events.map((ev) => (
            <Badge key={ev} variant="secondary" className="rounded-md font-mono text-[10px]">
              {ev}
            </Badge>
          ))}
        </div>
        <div className="mt-2">
          <code className="font-mono text-[10px] text-muted-foreground">{initial.secret}</code>
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <span className="text-xs text-muted-foreground">{active ? "Active" : "Paused"}</span>
        <Switch
          checked={active}
          onCheckedChange={setActive}
          aria-label={`${active ? "Pause" : "Activate"} webhook`}
        />
      </div>
    </div>
  );
}

export default function WebhooksPage() {
  const webhooks = mockWebhooks;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Webhooks</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Push job events to your server in real time.
          </p>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-1.5">
              <Plus className="h-4 w-4" />
              Add endpoint
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add webhook endpoint</DialogTitle>
              <DialogDescription>
                We&apos;ll POST a signed payload to this URL when jobs complete or fail.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-1.5">
                <Label htmlFor="wh-url">Endpoint URL</Label>
                <Input id="wh-url" type="url" placeholder="https://yourapp.com/webhooks/rendr" />
                <p className="text-xs text-muted-foreground">Must be publicly reachable over HTTPS.</p>
              </div>
              <div className="space-y-1.5">
                <Label>Events to receive</Label>
                <div className="flex flex-col gap-2">
                  {["job.completed", "job.failed"].map((ev) => (
                    <label key={ev} className="flex items-center gap-2.5 text-sm">
                      <input type="checkbox" defaultChecked className="rounded" />
                      <code className="font-mono text-xs">{ev}</code>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline">Cancel</Button>
              <Button>Add endpoint</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {webhooks.length === 0 ? (
        <EmptyState
          icon={Webhook}
          title="No webhooks yet"
          description="Add an endpoint to receive real-time push notifications when jobs complete."
          action={{ label: "Add endpoint" }}
        />
      ) : (
        <div className="space-y-3">
          {webhooks.map((wh) => (
            <WebhookRow key={wh.id} webhook={wh} />
          ))}
        </div>
      )}

      <div className="flex items-start gap-3 rounded-xl border border-dashed border-border p-4">
        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
        <p className="text-xs text-muted-foreground">
          Verify webhook authenticity using the{" "}
          <code className="rounded bg-muted px-1 font-mono">X-Rendr-Signature</code> header.
          See the{" "}
          <a href="/docs/api#webhooks" className="text-primary hover:underline">
            verification guide
          </a>.
        </p>
      </div>
    </div>
  );
}
