"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { verifyEmailCodeAction, resendVerificationCodeAction } from "@/app/actions/auth";
import { trackConversion } from "@/components/cookie-banner";
import { Button } from "@/components/ui/button";
import { CheckCircle, Loader2, Mail, RefreshCw } from "lucide-react";

type State = { error?: string; success?: boolean } | null;

export function VerifyEmailClient({ email }: { email: string }) {
  const router = useRouter();
  const [state, action, pending] = useActionState<State, FormData>(verifyEmailCodeAction, null);
  const [resendStatus, setResendStatus] = useState<"idle" | "sending" | "sent">("idle");
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  // Fire Google Ads conversion on registration (this page = just registered)
  useEffect(() => { trackConversion(); }, []);

  if (state?.success) {
    setTimeout(() => router.push("/app"), 1500);
    return (
      <div className="text-center py-6">
        <CheckCircle className="h-14 w-14 text-emerald-400 mx-auto mb-4" />
        <p className="text-lg font-semibold text-white">Email verified!</p>
        <p className="text-zinc-400 text-sm mt-1">Redirecting to dashboard…</p>
      </div>
    );
  }

  function handleChange(i: number, e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value.replace(/\D/g, "").slice(0, 1);
    e.target.value = val;
    if (val && i < 5) inputs.current[i + 1]?.focus();
  }

  function handleKeyDown(i: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !e.currentTarget.value && i > 0) {
      inputs.current[i - 1]?.focus();
    }
  }

  function handlePaste(e: React.ClipboardEvent<HTMLInputElement>) {
    const digits = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!digits) return;
    e.preventDefault();
    digits.split("").forEach((ch, i) => {
      if (inputs.current[i]) inputs.current[i]!.value = ch;
    });
    inputs.current[Math.min(digits.length, 5)]?.focus();
  }

  async function handleResend() {
    setResendStatus("sending");
    await resendVerificationCodeAction();
    setResendStatus("sent");
    setTimeout(() => setResendStatus("idle"), 60000);
  }

  return (
    <div>
      <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-500/10 mx-auto">
        <Mail className="h-5 w-5 text-blue-400" />
      </div>
      <h1 className="text-[22px] font-bold text-white text-center tracking-tight mb-1">
        Check your email
      </h1>
      <p className="text-zinc-400 text-[13px] text-center mb-7 leading-relaxed">
        We sent a 6-digit code to{" "}
        <span className="text-zinc-200 font-medium">{email}</span>
      </p>

      <form action={action} className="space-y-5">
        {/* 6 digit boxes */}
        <div className="flex gap-2 justify-center">
          {Array.from({ length: 6 }).map((_, i) => (
            <input
              key={i}
              ref={(el) => {
                inputs.current[i] = el;
              }}
              name={`d${i}`}
              type="text"
              inputMode="numeric"
              maxLength={1}
              autoFocus={i === 0}
              autoComplete="one-time-code"
              className="h-13 w-11 rounded-xl border border-zinc-800 bg-zinc-900 text-center text-xl font-bold text-white caret-blue-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-colors"
              style={{ height: "52px" }}
              onChange={(e) => handleChange(i, e)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              onPaste={handlePaste}
            />
          ))}
        </div>

        {state?.error && (
          <p className="text-sm text-red-400 text-center">{state.error}</p>
        )}

        <Button
          type="submit"
          disabled={pending}
          className="w-full h-11 rounded-xl font-semibold"
        >
          {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Verify email"}
        </Button>
      </form>

      <div className="mt-5 text-center">
        <button
          type="button"
          onClick={handleResend}
          disabled={resendStatus !== "idle"}
          className="text-[13px] text-zinc-500 hover:text-zinc-300 transition-colors disabled:opacity-50 inline-flex items-center gap-1.5"
        >
          <RefreshCw
            className={`h-3.5 w-3.5 ${resendStatus === "sending" ? "animate-spin" : ""}`}
          />
          {resendStatus === "idle"
            ? "Resend code"
            : resendStatus === "sending"
            ? "Sending…"
            : "Code sent ✓"}
        </button>
      </div>

      <p className="mt-6 text-center text-[12px] text-zinc-600">
        Wrong account?{" "}
        <a href="/login" className="text-zinc-400 hover:text-zinc-200 transition-colors">
          Sign in with a different account
        </a>
      </p>
    </div>
  );
}
