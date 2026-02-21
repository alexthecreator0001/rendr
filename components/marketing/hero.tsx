import Link from "next/link";
import { ArrowRight, BookOpen, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

function CodePreview() {
  return (
    <div className="relative select-none">
      {/* Ambient glow */}
      <div className="absolute -inset-6 rounded-3xl bg-blue-500/[0.07] blur-3xl" />

      {/* Terminal / request card */}
      <div className="relative z-10 overflow-hidden rounded-2xl border border-white/[0.06] bg-zinc-900 shadow-[0_0_0_1px_rgba(255,255,255,0.04),0_40px_80px_-20px_rgba(0,0,0,0.9)]">
        {/* Titlebar */}
        <div className="flex items-center gap-3 border-b border-white/[0.05] bg-zinc-950/70 px-4 py-3.5">
          <div className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
            <span className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
            <span className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
          </div>
          <span className="flex-1 text-center font-mono text-[11px] tracking-tight text-zinc-500">
            POST /v1/convert
          </span>
          <span className="flex items-center gap-1 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-2.5 py-0.5 font-mono text-[10px] text-emerald-400">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
            Live
          </span>
        </div>

        {/* Code body */}
        <div className="p-5 font-mono text-[12.5px] leading-[1.85]">
          <div>
            <span className="font-semibold text-blue-400">POST</span>
            <span className="text-zinc-500"> https://api.rendrpdf.com</span>
            <span className="text-white">/v1/convert</span>
          </div>
          <div className="text-[11px] text-zinc-600">
            {"Authorization: Bearer "}
            <span className="text-zinc-500">rk_live_••••••••</span>
          </div>

          <div className="mt-4 text-zinc-500">{"{"}</div>
          <div className="pl-5">
            <div>
              <span className="text-sky-300">&quot;template&quot;</span>
              <span className="text-zinc-500">{": "}</span>
              <span className="text-emerald-400">&quot;invoice-pro&quot;</span>
              <span className="text-zinc-500">,</span>
            </div>
            <div>
              <span className="text-sky-300">&quot;variables&quot;</span>
              <span className="text-zinc-500">{": {"}</span>
            </div>
            <div className="pl-5">
              <div>
                <span className="text-sky-200">&quot;client&quot;</span>
                <span className="text-zinc-500">{":  "}</span>
                <span className="text-emerald-400">&quot;Acme Corp&quot;</span>
                <span className="text-zinc-500">,</span>
              </div>
              <div>
                <span className="text-sky-200">&quot;amount&quot;</span>
                <span className="text-zinc-500">{":  "}</span>
                <span className="text-amber-400">&quot;$4,200.00&quot;</span>
                <span className="text-zinc-500">,</span>
              </div>
              <div>
                <span className="text-sky-200">&quot;due&quot;</span>
                <span className="text-zinc-500">{"    :  "}</span>
                <span className="text-emerald-400">&quot;Mar 15, 2026&quot;</span>
              </div>
            </div>
            <div><span className="text-zinc-500">{"}"}</span></div>
          </div>
          <div className="text-zinc-500">{"}"}</div>

          <div className="mt-3 flex items-center gap-1">
            <span className="text-zinc-600">▸</span>
            <span className="ml-1 inline-block h-[13px] w-0.5 animate-pulse bg-blue-400 align-middle" />
          </div>
        </div>
      </div>

      {/* PDF response card — floating */}
      <div
        className="absolute -bottom-10 -right-8 z-20 w-52 overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-[0_24px_56px_-8px_rgba(0,0,0,0.55)]"
        style={{ transform: "rotate(-2.5deg)" }}
      >
        <div className="flex items-center gap-2 border-b border-zinc-100 bg-zinc-50 px-3 py-2.5">
          <FileText className="h-3.5 w-3.5 shrink-0 text-red-400" />
          <span className="truncate font-mono text-[10px] text-zinc-500">
            invoice-acme-2026.pdf
          </span>
        </div>
        <div className="space-y-2 p-3">
          <div className="h-2 w-20 rounded-sm bg-zinc-800" />
          <div className="h-1.5 w-full rounded-sm bg-zinc-100" />
          <div className="h-1.5 w-4/5 rounded-sm bg-zinc-100" />
          <div className="my-2 h-px w-full bg-zinc-100" />
          <div className="flex items-center justify-between">
            <div className="h-1.5 w-16 rounded-sm bg-zinc-100" />
            <div className="h-1.5 w-10 rounded-sm bg-zinc-300" />
          </div>
          <div className="flex items-center justify-between">
            <div className="h-1.5 w-12 rounded-sm bg-zinc-100" />
            <div className="h-1.5 w-8 rounded-sm bg-zinc-200" />
          </div>
          <div className="my-2 h-px w-full bg-zinc-200" />
          <div className="flex justify-end">
            <div className="h-3 w-16 rounded bg-blue-600" />
          </div>
        </div>
        <div className="flex items-center gap-1.5 border-t border-zinc-100 bg-emerald-50 px-3 py-2">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
          <span className="text-[10px] font-semibold text-emerald-700">
            Rendered in 1.2s
          </span>
        </div>
      </div>

      {/* HTTP 200 badge */}
      <div className="absolute -right-2 -top-3 z-30 flex items-center gap-1.5 rounded-full border border-white/10 bg-zinc-900/95 px-3 py-1.5 shadow-lg backdrop-blur-sm">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
        <span className="font-mono text-[11px] font-medium text-emerald-400">
          200 OK
        </span>
      </div>
    </div>
  );
}

export function Hero() {
  return (
    <section className="relative flex min-h-[100svh] flex-col overflow-hidden bg-zinc-950">
      {/* Atmospheric background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="animate-float animate-pulse-glow absolute -left-20 -top-32 h-[600px] w-[600px] rounded-full bg-blue-600/20 blur-[130px]" />
        <div className="animate-float-slow animate-pulse-glow delay-300 absolute right-0 top-[15%] h-[450px] w-[450px] rounded-full bg-violet-600/15 blur-[110px]" />
        <div className="absolute -bottom-16 left-[25%] h-[350px] w-[750px] rounded-full bg-blue-950/35 blur-[140px]" />
        {/* Fine dot grid */}
        <div
          className="absolute inset-0 opacity-[0.022]"
          style={{
            backgroundImage: `linear-gradient(oklch(1 0 0 / 1) 1px, transparent 1px), linear-gradient(90deg, oklch(1 0 0 / 1) 1px, transparent 1px)`,
            backgroundSize: "52px 52px",
          }}
        />
      </div>

      {/* Hero body */}
      <div className="relative z-10 flex flex-1 items-center">
        <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-12 px-6 py-24 pt-36 lg:grid-cols-2 lg:gap-20 lg:px-8 lg:py-32 lg:pt-40">

          {/* Left — copy */}
          <div className="flex flex-col">
            {/* Eyebrow */}
            <div className="animate-fade-up mb-7 inline-flex self-start items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.04] px-4 py-1.5 text-xs font-medium text-white/50 backdrop-blur-sm">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
              Beta · 500 free renders/month
              <ArrowRight className="h-3 w-3" />
            </div>

            {/* Headline — Syne display font */}
            <h1 className="animate-fade-up delay-100 font-heading text-[3.15rem] font-extrabold leading-[0.92] tracking-[-0.045em] text-white sm:text-[3.75rem] lg:text-[4.25rem] xl:text-[4.85rem]">
              HTML to PDF,
              <br />
              <span
                style={{
                  background: "linear-gradient(115deg, #60a5fa 5%, #22d3ee 75%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                without the mess.
              </span>
            </h1>

            {/* Body */}
            <p className="animate-fade-up delay-200 mt-6 max-w-[430px] text-base leading-[1.75] text-zinc-400 sm:text-[17px]">
              One API call converts your HTML templates into pixel-perfect PDFs.
              Async jobs, webhooks, and signed download URLs built in —
              no headless browser to manage.
            </p>

            {/* CTAs */}
            <div className="animate-fade-up delay-300 mt-9 flex flex-wrap items-center gap-3">
              <Button
                size="lg"
                asChild
                className="h-11 rounded-xl bg-white px-7 text-sm font-semibold text-zinc-900 shadow-md transition-all duration-200 hover:bg-zinc-50 hover:shadow-lg gap-2"
              >
                <Link href="/register">
                  Get started free
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="ghost"
                asChild
                className="h-11 rounded-xl px-6 text-sm text-white/50 transition-all duration-200 hover:bg-white/[0.06] hover:text-white gap-2"
              >
                <Link href="/docs">
                  <BookOpen className="h-4 w-4" />
                  Read the docs
                </Link>
              </Button>
            </div>

            {/* Microcopy */}
            <p className="animate-fade-up delay-400 mt-7 text-[11px] tracking-[0.025em] text-zinc-500/60">
              No credit card required · Free tier forever · Set up in 5 minutes
            </p>
          </div>

          {/* Right — product visual */}
          <div className="animate-fade-up delay-200 relative hidden lg:block">
            <div className="pb-16 pr-12">
              <CodePreview />
            </div>
          </div>

        </div>
      </div>

      {/* Bottom fade into page bg */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-44 bg-gradient-to-t from-zinc-100 to-transparent dark:from-zinc-950" />
    </section>
  );
}
