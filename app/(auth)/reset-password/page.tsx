"use client";

import { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { resetPasswordAction } from "@/app/actions/auth";
import { Suspense } from "react";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const [state, action, pending] = useActionState(resetPasswordAction, null);

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="rounded-3xl border border-white/[0.08] bg-zinc-950 p-8 shadow-2xl shadow-black/60 sm:p-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Set a new password
          </h1>
          <p className="mt-1.5 text-sm text-zinc-400">
            Choose a strong password for your account.
          </p>
        </div>

        {state?.success ? (
          <div className="space-y-5">
            <div className="flex items-start gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3.5">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
              <div>
                <p className="text-sm font-medium text-emerald-400">Password updated</p>
                <p className="mt-0.5 text-xs text-emerald-400/70">
                  Your password has been reset. You can now sign in.
                </p>
              </div>
            </div>
            <Button asChild className="h-11 w-full gap-2 rounded-xl bg-white font-semibold text-zinc-900 hover:bg-zinc-100">
              <Link href="/login">
                Sign in
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        ) : (
          <form action={action} className="space-y-5">
            <input type="hidden" name="token" value={token} />

            {state?.error && (
              <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                {state.error}
              </div>
            )}

            {!token && (
              <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-400">
                Invalid reset link. Please{" "}
                <Link href="/forgot-password" className="underline">
                  request a new one
                </Link>.
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="password" className="text-[13px] font-medium text-zinc-300">
                New password
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

            <div className="space-y-2">
              <Label htmlFor="confirm" className="text-[13px] font-medium text-zinc-300">
                Confirm password
              </Label>
              <Input
                id="confirm"
                name="confirm"
                type="password"
                autoComplete="new-password"
                placeholder="Repeat password"
                required
                minLength={8}
                className="h-11 rounded-xl border-white/[0.08] bg-white/[0.04] text-white placeholder:text-zinc-600 focus-visible:border-blue-500/60 focus-visible:ring-blue-500/20"
              />
            </div>

            <Button
              type="submit"
              disabled={pending || !token}
              className="h-11 w-full gap-2 rounded-xl bg-white font-semibold text-zinc-900 hover:bg-zinc-100"
            >
              {pending ? (
                "Resetting…"
              ) : (
                <>
                  Reset password
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>

            <p className="text-center text-xs text-zinc-600">
              Remember your password?{" "}
              <Link href="/login" className="text-blue-400 hover:text-blue-300">
                Sign in
              </Link>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordForm />
    </Suspense>
  );
}
