"use client";

import { useActionState } from "react";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginAction } from "@/app/actions/auth";

export default function LoginPage() {
  const [state, action, pending] = useActionState(loginAction, null);

  return (
    <div className="mx-auto w-full max-w-4xl">
      <div className="overflow-hidden rounded-3xl border border-white/[0.08] shadow-2xl shadow-black/60 lg:grid lg:grid-cols-[1fr_1.15fr]">

        {/* ── Left panel — branding (desktop only) ─────────────────── */}
        <div className="hidden lg:flex flex-col justify-between border-r border-white/[0.07] bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-950 p-10">
          <Link href="/">
            <img src="/logo.svg" alt="Rendr" className="h-5 w-auto" />
          </Link>

          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-blue-400 mb-4">
              Trusted by developers
            </p>
            <blockquote className="text-[17px] font-medium leading-relaxed text-white">
              &ldquo;Rendr replaced our entire Puppeteer setup in a weekend.
              PDF generation that just&nbsp;works.&rdquo;
            </blockquote>
            <div className="mt-5 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 text-xs font-bold text-white">
                JD
              </div>
              <div>
                <p className="text-sm font-semibold text-white">James D.</p>
                <p className="text-xs text-zinc-500">Lead Engineer, Acme Corp</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {[
              "100 free renders / month",
              "No credit card required",
              "Setup in under 5 minutes",
            ].map((f) => (
              <div key={f} className="flex items-center gap-2.5 text-sm text-zinc-400">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 ring-1 ring-emerald-500/25">
                  <Check className="h-3 w-3 text-emerald-400" />
                </span>
                {f}
              </div>
            ))}
          </div>
        </div>

        {/* ── Right panel — form ────────────────────────────────────── */}
        <div className="bg-zinc-950 p-8 sm:p-10 lg:p-12">
          {/* Mobile logo */}
          <Link href="/" className="mb-8 block lg:hidden">
            <img src="/logo.svg" alt="Rendr" className="h-5 w-auto" />
          </Link>

          <div className="mb-8">
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Welcome back
            </h1>
            <p className="mt-1.5 text-sm text-zinc-400">
              Sign in to your Rendr account to continue.
            </p>
          </div>

          <form action={action} className="space-y-5">
            {state?.error && (
              <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                {state.error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-[13px] font-medium text-zinc-300">
                Email address
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@company.com"
                required
                className="h-11 rounded-xl border-white/[0.08] bg-white/[0.04] text-white placeholder:text-zinc-600 focus-visible:border-blue-500/60 focus-visible:ring-blue-500/20"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-[13px] font-medium text-zinc-300">
                  Password
                </Label>
                <Link
                  href="/forgot-password"
                  className="text-[12px] text-zinc-500 transition-colors hover:text-blue-400"
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                required
                className="h-11 rounded-xl border-white/[0.08] bg-white/[0.04] text-white placeholder:text-zinc-600 focus-visible:border-blue-500/60 focus-visible:ring-blue-500/20"
              />
            </div>

            <Button
              type="submit"
              disabled={pending}
              className="mt-2 h-11 w-full gap-2 rounded-xl bg-white font-semibold text-zinc-900 hover:bg-zinc-100"
            >
              {pending ? (
                "Signing in…"
              ) : (
                <>
                  Sign in
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 space-y-4">
            <p className="text-center text-sm text-zinc-500">
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                className="font-medium text-blue-400 transition-colors hover:text-blue-300"
              >
                Get started free
              </Link>
            </p>

            <p className="text-center text-xs text-zinc-700">
              © {new Date().getFullYear()} Rendr ·{" "}
              <Link href="/privacy" className="transition-colors hover:text-zinc-500">
                Privacy
              </Link>
              {" · "}
              <Link href="/terms" className="transition-colors hover:text-zinc-500">
                Terms
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
