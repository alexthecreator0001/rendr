"use client";

import { useActionState } from "react";
import Link from "next/link";
import { ArrowRight, Check, Zap, Shield, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { registerAction } from "@/app/actions/auth";

export default function RegisterPage() {
  const [state, action, pending] = useActionState(registerAction, null);

  return (
    <div className="mx-auto w-full max-w-4xl">
      <div className="overflow-hidden rounded-3xl border border-white/[0.08] shadow-2xl shadow-black/60 lg:grid lg:grid-cols-[1fr_1.15fr]">

        {/* ── Left panel — branding (desktop only) ─────────────────── */}
        <div className="hidden lg:flex flex-col justify-between border-r border-white/[0.07] bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-950 p-10">
          <Link href="/">
            <img src="/logo.svg" alt="Rendr" className="h-5 w-auto" />
          </Link>

          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-blue-400 mb-3">
              Start for free
            </p>
            <h2 className="text-2xl font-bold leading-tight tracking-tight text-white">
              PDF generation that
              <br />
              <span
                style={{
                  background: "linear-gradient(115deg, #60a5fa, #22d3ee)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                developers love.
              </span>
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-zinc-400">
              One API call. Pixel-perfect PDFs. No headless browser to manage.
            </p>
          </div>

          <div className="space-y-4">
            {[
              { icon: Zap, label: "~800ms average render time" },
              { icon: Shield, label: "99.9% uptime SLA" },
              { icon: Clock, label: "Setup in under 5 minutes" },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/[0.04] border border-white/[0.07]">
                  <Icon className="h-3.5 w-3.5 text-blue-400" />
                </div>
                <span className="text-sm text-zinc-400">{label}</span>
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
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
              100 free renders / month
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Create your account
            </h1>
            <p className="mt-1.5 text-sm text-zinc-400">
              No credit card required. Start rendering in minutes.
            </p>
          </div>

          <form action={action} className="space-y-5">
            {state?.error && (
              <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                {state.error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="name" className="text-[13px] font-medium text-zinc-300">
                Name
              </Label>
              <Input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                placeholder="Joe"
                className="h-11 rounded-xl border-white/[0.08] bg-white/[0.04] text-white placeholder:text-zinc-600 focus-visible:border-blue-500/60 focus-visible:ring-blue-500/20"
              />
            </div>

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
              <Label htmlFor="password" className="text-[13px] font-medium text-zinc-300">
                Password
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                placeholder="Min. 8 characters"
                required
                minLength={8}
                className="h-11 rounded-xl border-white/[0.08] bg-white/[0.04] text-white placeholder:text-zinc-600 focus-visible:border-blue-500/60 focus-visible:ring-blue-500/20"
              />
            </div>

            <Button
              type="submit"
              disabled={pending}
              className="mt-2 h-11 w-full gap-2 rounded-xl bg-white font-semibold text-zinc-900 hover:bg-zinc-100"
            >
              {pending ? (
                "Creating account…"
              ) : (
                <>
                  Create free account
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 space-y-4">
            <p className="text-center text-sm text-zinc-500">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-medium text-blue-400 transition-colors hover:text-blue-300"
              >
                Sign in
              </Link>
            </p>

            <p className="text-center text-xs text-zinc-700">
              By signing up you agree to our{" "}
              <Link href="/terms" className="transition-colors hover:text-zinc-500">
                Terms
              </Link>
              {" and "}
              <Link href="/privacy" className="transition-colors hover:text-zinc-500">
                Privacy Policy
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
