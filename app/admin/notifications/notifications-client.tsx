"use client";

import { useActionState, useState } from "react";
import {
  createNotificationAction,
  toggleNotificationAction,
  deleteNotificationAction,
} from "@/app/actions/feedback";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
  DialogTrigger, DialogFooter, DialogDescription,
} from "@/components/ui/dialog";
import { Plus, Trash2, Eye, EyeOff, AlertTriangle, Bell } from "lucide-react";
import { cn } from "@/lib/utils";

type Notification = {
  id: string;
  title: string;
  message: string;
  type: string;
  active: boolean;
  createdAt: Date;
};

const TYPE_STYLES: Record<string, string> = {
  info:    "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  warning: "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  success: "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
};

function CreateDialog() {
  const [open, setOpen] = useState(false);
  const [state, action, pending] = useActionState(createNotificationAction, null);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-1.5 rounded-lg">
          <Plus className="h-4 w-4" /> New notification
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle>Create notification</DialogTitle>
          <DialogDescription>This will appear as a banner on the user dashboard.</DialogDescription>
        </DialogHeader>
        <form action={action} className="space-y-4 pt-1">
          {state?.error && (
            <div className="flex items-center gap-2 rounded-xl border border-destructive/30 bg-destructive/5 px-3.5 py-2.5 text-sm text-destructive">
              <AlertTriangle className="h-4 w-4 shrink-0" />{state.error}
            </div>
          )}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Title</Label>
            <Input name="title" placeholder="Scheduled maintenance" required className="rounded-xl" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Message</Label>
            <textarea
              name="message"
              rows={3}
              className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm placeholder:text-muted-foreground/30 focus:outline-none focus:ring-2 focus:ring-ring resize-none"
              placeholder="We'll be performing maintenance on Feb 25 from 2–4am UTC."
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Type</Label>
            <select
              name="type"
              defaultValue="info"
              className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="info">Info (blue)</option>
              <option value="warning">Warning (amber)</option>
              <option value="success">Success (green)</option>
            </select>
          </div>
          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="rounded-lg">Cancel</Button>
            <Button type="submit" disabled={pending} className="rounded-lg">
              {pending ? "Creating…" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function ToggleButton({ notification }: { notification: Notification }) {
  const [, action, pending] = useActionState(toggleNotificationAction, null);
  return (
    <form action={action}>
      <input type="hidden" name="id" value={notification.id} />
      <button
        type="submit"
        disabled={pending}
        title={notification.active ? "Deactivate" : "Activate"}
        className={cn(
          "flex h-7 w-7 items-center justify-center rounded-lg border transition-colors",
          notification.active
            ? "border-green-200 bg-green-50 text-green-600 hover:bg-green-100 dark:border-green-800 dark:bg-green-900/20 dark:text-green-400"
            : "border-border bg-muted text-muted-foreground hover:text-foreground"
        )}
      >
        {notification.active ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
      </button>
    </form>
  );
}

function DeleteButton({ id }: { id: string }) {
  const [, action, pending] = useActionState(deleteNotificationAction, null);
  return (
    <form action={action}>
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        disabled={pending}
        title="Delete"
        className="flex h-7 w-7 items-center justify-center rounded-lg border border-border text-muted-foreground hover:text-destructive hover:border-destructive/30 transition-colors"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </button>
    </form>
  );
}

export function NotificationsClient({ notifications }: { notifications: Notification[] }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Notifications</h1>
          <p className="mt-1 text-sm text-muted-foreground">Banner announcements shown on the user dashboard.</p>
        </div>
        <CreateDialog />
      </div>

      {notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-muted/50">
            <Bell className="h-8 w-8 text-muted-foreground/25" />
          </div>
          <p className="font-semibold text-sm">No notifications yet</p>
          <p className="mt-1.5 max-w-[260px] text-xs text-muted-foreground">
            Create a notification to display an announcement on the user dashboard.
          </p>
        </div>
      ) : (
        <div className="rounded-2xl border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/40">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">Title</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden sm:table-cell">Type</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden md:table-cell">Created</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {notifications.map((n) => (
                <tr key={n.id} className={cn("transition-colors", !n.active && "opacity-50")}>
                  <td className="px-4 py-3">
                    <p className="font-medium text-sm">{n.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 max-w-xs truncate">{n.message}</p>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium capitalize ${TYPE_STYLES[n.type] ?? TYPE_STYLES.info}`}>
                      {n.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground hidden md:table-cell">
                    {new Date(n.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <span className={cn(
                      "text-xs font-medium",
                      n.active ? "text-green-600 dark:text-green-400" : "text-muted-foreground"
                    )}>
                      {n.active ? "Active" : "Hidden"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1.5">
                      <ToggleButton notification={n} />
                      <DeleteButton id={n.id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
