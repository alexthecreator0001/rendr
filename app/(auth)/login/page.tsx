"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginAction } from "@/app/actions/auth";

export default function LoginPage() {
  const [state, action, pending] = useActionState(loginAction, null);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <Link href="/">
            <img src="/logo.svg" alt="Rendr" className="mx-auto h-6 w-auto dark:invert" />
          </Link>
          <h1 className="mt-6 text-2xl font-bold tracking-tight">Sign in to Rendr</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Welcome back — enter your credentials below.
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
              autoComplete="current-password"
              placeholder="••••••••"
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={pending}>
            {pending ? "Signing in…" : "Sign in"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="font-medium text-primary hover:underline">
            Get started free
          </Link>
        </p>
      </div>
    </div>
  );
}
