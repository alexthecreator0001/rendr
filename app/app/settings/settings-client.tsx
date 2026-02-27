"use client";

import { useActionState } from "react";
import { changePasswordAction } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Key, Webhook, ShieldCheck, User, AlertTriangle, ExternalLink,
} from "lucide-react";
import Link from "next/link";

const PLAN_LABELS: Record<string, string> = {
  starter: "Starter",
  growth: "Growth",
  business: "Business",
};

interface SettingsClientProps {
  email: string;
  createdAt: Date;
  plan: string;
}

function Section({
  title,
  description,
  icon: Icon,
  children,
  danger,
}: {
  title: string;
  description: string;
  icon: React.ElementType;
  children: React.ReactNode;
  danger?: boolean;
}) {
  return (
    <div className={`grid grid-cols-1 gap-8 py-8 lg:grid-cols-[260px_1fr] ${danger ? "border-t border-destructive/20 bg-destructive/[0.02]" : "border-t border-border"} px-0`}>
      <div className="flex gap-3 lg:flex-col lg:gap-1.5">
        <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${danger ? "bg-destructive/10 text-destructive" : "bg-primary/10 text-primary"}`}>
          <Icon className="h-4 w-4" />
        </div>
        <div>
          <h2 className={`text-sm font-semibold ${danger ? "text-destructive" : ""}`}>{title}</h2>
          <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{description}</p>
        </div>
      </div>
      <div>{children}</div>
    </div>
  );
}

export function SettingsClient({ email, createdAt, plan }: SettingsClientProps) {
  const [state, action, pending] = useActionState(changePasswordAction, null);

  const initials = email.slice(0, 2).toUpperCase();
  const joined = createdAt.toLocaleDateString("en-US", {
    month: "long", day: "numeric", year: "numeric",
  });

  return (
    <div className="max-w-3xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your account preferences and security.
        </p>
      </div>

      <div className="rounded-2xl border border-border overflow-hidden">
        <div className="divide-y divide-border">

          {/* ── Profile ──────────────────────────────────────── */}
          <div className="grid grid-cols-1 gap-8 p-6 lg:grid-cols-[260px_1fr]">
            <div className="flex gap-3 lg:flex-col lg:gap-1.5">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <User className="h-4 w-4" />
              </div>
              <div>
                <h2 className="text-sm font-semibold">Profile</h2>
                <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                  Your account identity and membership info.
                </p>
              </div>
            </div>
            <div className="space-y-5">
              {/* Avatar row */}
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-violet-600 text-xl font-bold text-white select-none">
                  {initials}
                </div>
                <div>
                  <p className="font-semibold text-sm">{email}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="secondary" className="rounded-full px-2 py-0 text-[10px] h-5">
                      {PLAN_LABELS[plan] ?? plan}
                    </Badge>
                    <span className="text-xs text-muted-foreground">Member since {joined}</span>
                  </div>
                </div>
              </div>
              {/* Email field */}
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">
                  Email address
                </Label>
                <div className="flex items-center gap-2">
                  <Input
                    value={email}
                    disabled
                    className="bg-muted/40 text-muted-foreground font-mono text-sm"
                  />
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Email address cannot be changed at this time.
                </p>
              </div>
            </div>
          </div>

          {/* ── Security / Password ──────────────────────────── */}
          <div className="grid grid-cols-1 gap-8 p-6 lg:grid-cols-[260px_1fr]">
            <div className="flex gap-3 lg:flex-col lg:gap-1.5">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <div>
                <h2 className="text-sm font-semibold">Security</h2>
                <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                  Update your password. Must include uppercase, lowercase, number, and special character.
                </p>
              </div>
            </div>
            <div>
              <form action={action} className="space-y-4">
                {state?.error && (
                  <div className="flex items-start gap-2.5 rounded-lg border border-destructive/30 bg-destructive/5 px-3.5 py-3 text-sm text-destructive">
                    <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
                    {state.error}
                  </div>
                )}
                {state?.success && (
                  <div className="flex items-center gap-2.5 rounded-lg border border-green-500/30 bg-green-500/5 px-3.5 py-3 text-sm text-green-600 dark:text-green-400">
                    <ShieldCheck className="h-4 w-4 shrink-0" />
                    Password updated successfully.
                  </div>
                )}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5 sm:col-span-2">
                    <Label htmlFor="current" className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">
                      Current password
                    </Label>
                    <Input
                      id="current"
                      name="current"
                      type="password"
                      autoComplete="current-password"
                      required
                      placeholder="Enter current password"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="new" className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">
                      New password
                    </Label>
                    <Input
                      id="new"
                      name="new"
                      type="password"
                      autoComplete="new-password"
                      required
                      placeholder="At least 8 characters"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="confirm" className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">
                      Confirm new password
                    </Label>
                    <Input
                      id="confirm"
                      name="confirm"
                      type="password"
                      autoComplete="new-password"
                      required
                      placeholder="Repeat new password"
                    />
                  </div>
                </div>
                <div className="flex justify-end pt-1">
                  <Button type="submit" disabled={pending} size="sm">
                    {pending ? "Updating…" : "Update password"}
                  </Button>
                </div>
              </form>
            </div>
          </div>

          {/* ── API & Integrations ───────────────────────────── */}
          <div className="grid grid-cols-1 gap-8 p-6 lg:grid-cols-[260px_1fr]">
            <div className="flex gap-3 lg:flex-col lg:gap-1.5">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Key className="h-4 w-4" />
              </div>
              <div>
                <h2 className="text-sm font-semibold">API & Integrations</h2>
                <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                  Programmatic access and webhook configuration.
                </p>
              </div>
            </div>
            <div className="space-y-3">
              <Link
                href="/app/api-keys"
                className="flex items-center justify-between rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/40 hover:bg-accent/30 group"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
                    <Key className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">API Keys</p>
                    <p className="text-xs text-muted-foreground">Manage keys for programmatic access</p>
                  </div>
                </div>
                <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
              </Link>
              <Link
                href="/app/webhooks"
                className="flex items-center justify-between rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/40 hover:bg-accent/30 group"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500/10 text-violet-600 dark:text-violet-400">
                    <Webhook className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Webhooks</p>
                    <p className="text-xs text-muted-foreground">Configure delivery endpoints for job events</p>
                  </div>
                </div>
                <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
              </Link>
            </div>
          </div>

          {/* ── Danger Zone ──────────────────────────────────── */}
          <div className="grid grid-cols-1 gap-8 p-6 lg:grid-cols-[260px_1fr] bg-destructive/[0.015]">
            <div className="flex gap-3 lg:flex-col lg:gap-1.5">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-destructive/10 text-destructive">
                <AlertTriangle className="h-4 w-4" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-destructive">Danger Zone</h2>
                <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                  Irreversible and destructive actions.
                </p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-xl border border-destructive/30 bg-card p-4">
                <div>
                  <p className="text-sm font-medium">Delete account</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Permanently remove your account and all associated data.
                  </p>
                </div>
                <Button variant="destructive" size="sm" disabled>
                  Delete account
                </Button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
