"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { registerAction } from "@/app/actions/auth";

export default function RegisterPage() {
  const [state, action, pending] = useActionState(registerAction, null);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <Link href="/">
            <img src="/logo.svg" alt="Rendr" className="mx-auto h-6 w-auto dark:invert" />
          </Link>
          <h1 className="mt-6 text-2xl font-bold tracking-tight">Create your account</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            500 free renders/month. No credit card required.
          </p>
        </div>

        <form action={action} className="space-y-4">
          {state?.error && (
            <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
              {state.error}
            </div>
          )}
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@company.com"
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              placeholder="Min. 8 characters"
              required
              minLength={8}
            />
          </div>
          <Button type="submit" className="w-full" disabled={pending}>
            {pending ? "Creating account…" : "Create account"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-primary hover:underline">
            Sign in
          </Link>
        </p>

        <p className="mt-4 text-center text-xs text-muted-foreground/60">
          By creating an account you agree to our{" "}
          <Link href="/terms" className="hover:underline">Terms</Link> and{" "}
          <Link href="/privacy" className="hover:underline">Privacy Policy</Link>.
        </p>
      </div>
    </div>
  );
}
