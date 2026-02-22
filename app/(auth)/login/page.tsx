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
    <div className="w-full max-w-sm">
      {/* Glass card */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-8 shadow-2xl backdrop-blur-2xl">
        {/* Logo + heading */}
        <div className="mb-8 text-center">
          <Link href="/">
            <img src="/logo-white.svg" alt="Rendr" className="mx-auto h-5 w-auto" />
          </Link>
          <h1 className="mt-6 text-[22px] font-bold tracking-tight text-white">
            Sign in to Rendr
          </h1>
          <p className="mt-1.5 text-sm text-zinc-400">
            Welcome back — enter your credentials below.
          </p>
        </div>

        <form action={action} className="space-y-4">
          {state?.error && (
            <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {state.error}
            </div>
          )}
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-[13px] text-zinc-300">
              Email
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@company.com"
              required
              className="border-white/10 bg-white/5 text-white placeholder:text-zinc-600 focus-visible:border-blue-500/60 focus-visible:ring-blue-500/20"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password" className="text-[13px] text-zinc-300">
              Password
            </Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              required
              className="border-white/10 bg-white/5 text-white placeholder:text-zinc-600 focus-visible:border-blue-500/60 focus-visible:ring-blue-500/20"
            />
          </div>
          <Button type="submit" className="w-full mt-2" disabled={pending}>
            {pending ? "Signing in…" : "Sign in"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-zinc-500">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="font-medium text-blue-400 hover:text-blue-300 transition-colors">
            Get started free
          </Link>
        </p>
      </div>
    </div>
  );
}
