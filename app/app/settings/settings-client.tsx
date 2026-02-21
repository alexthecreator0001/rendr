"use client";

import { useActionState } from "react";
import { changePasswordAction } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function SettingsClient({ email }: { email: string }) {
  const [state, action, pending] = useActionState(changePasswordAction, null);

  return (
    <div className="max-w-xl space-y-10">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">Manage your account.</p>
      </div>

      {/* Profile */}
      <section className="space-y-4">
        <div>
          <h2 className="text-base font-semibold">Profile</h2>
          <p className="text-sm text-muted-foreground">Your account details.</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-5 space-y-4">
          <div className="space-y-1.5">
            <Label>Email address</Label>
            <Input value={email} disabled className="text-muted-foreground" />
            <p className="text-[11px] text-muted-foreground">Email cannot be changed at this time.</p>
          </div>
        </div>
      </section>

      {/* Change password */}
      <section className="space-y-4">
        <div>
          <h2 className="text-base font-semibold">Change password</h2>
          <p className="text-sm text-muted-foreground">Use a strong password of at least 8 characters.</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-5">
          <form action={action} className="space-y-4">
            {state?.error && (
              <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {state.error}
              </p>
            )}
            {state?.success && (
              <p className="rounded-lg bg-green-500/10 px-3 py-2 text-sm text-green-600 dark:text-green-400">
                Password updated successfully.
              </p>
            )}
            <div className="space-y-1.5">
              <Label htmlFor="current">Current password</Label>
              <Input id="current" name="current" type="password" autoComplete="current-password" required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="new">New password</Label>
              <Input id="new" name="new" type="password" autoComplete="new-password" required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="confirm">Confirm new password</Label>
              <Input id="confirm" name="confirm" type="password" autoComplete="new-password" required />
            </div>
            <Button type="submit" disabled={pending}>
              {pending ? "Updating…" : "Update password"}
            </Button>
          </form>
        </div>
      </section>
    </div>
  );
}
