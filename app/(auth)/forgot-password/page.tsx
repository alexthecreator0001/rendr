"use client";

import { useActionState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { forgotPasswordAction } from "@/app/actions/auth";

export default function ForgotPasswordPage() {
  const [state, action, pending] = useActionState(forgotPasswordAction, null);

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="rounded-3xl border border-white/[0.08] bg-zinc-950 p-8 shadow-2xl shadow-black/60 sm:p-10">
        <Link
          href="/login"
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-zinc-500 transition-colors hover:text-zinc-300"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to sign in
        </Link>

        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Reset your password
          </h1>
          <p className="mt-1.5 text-sm text-zinc-400">
            Enter your email and we&apos;ll send you a reset link.
          </p>
        </div>

        {state?.success ? (
          <div className="space-y-4">
            <div className="flex items-start gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3.5">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
              <div>
                <p className="text-sm font-medium text-emerald-400">Check your email</p>
                <p className="mt-0.5 text-xs text-emerald-400/70">
                  If an account exists with that email, we&apos;ve sent a password reset link. It expires in 1 hour.
                </p>
              </div>
            </div>
            <p className="text-center text-xs text-zinc-600">
              Didn&apos;t receive it? Check your spam folder or{" "}
              <button
                onClick={() => window.location.reload()}
                className="text-blue-400 hover:text-blue-300"
              >
                try again
              </button>
            </p>
          </div>
        ) : (
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

            <Button
              type="submit"
              disabled={pending}
              className="h-11 w-full gap-2 rounded-xl bg-white font-semibold text-zinc-900 hover:bg-zinc-100"
            >
              {pending ? (
                "Sending…"
              ) : (
                <>
                  Send reset link
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
