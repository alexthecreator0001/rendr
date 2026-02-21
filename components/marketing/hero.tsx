import Link from "next/link";
import { ArrowRight, BookOpen, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

function HeroPipeline() {
  return (
    <div className="flex w-full flex-col gap-3">
      {/* Request card */}
      <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-zinc-900/80 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)] backdrop-blur-sm">
        {/* Titlebar */}
        <div className="flex items-center gap-3 border-b border-white/[0.05] bg-zinc-950/60 px-4 py-3">
          <div className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
            <span className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
            <span className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
          </div>
          <span className="font-mono text-[11px] text-zinc-500">
            POST /v1/convert
          </span>
          <span className="ml-auto flex items-center gap-1.5 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-2.5 py-0.5 font-mono text-[10px] text-emerald-400">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
            Live
          </span>
        </div>

        {/* Code body */}
        <div className="p-5 font-mono text-[12.5px] leading-[1.85]">
          <div>
            <span className="font-semibold text-blue-400">POST</span>
            <span className="text-zinc-600"> api.rendrpdf.com</span>
            <span className="text-white">/v1/convert</span>
          </div>
          <div className="mb-4 text-[11px] text-zinc-600">
            {"Authorization: Bearer "}
            <span className="text-zinc-500">rk_live_••••••••</span>
          </div>

          <div className="text-zinc-500">{"{"}</div>
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
                <span className="text-zinc-500">{": "}</span>
                <span className="text-emerald-400">&quot;Acme Corp&quot;</span>
                <span className="text-zinc-500">,</span>
              </div>
              <div>
                <span className="text-sky-200">&quot;amount&quot;</span>
                <span className="text-zinc-500">{": "}</span>
                <span className="text-amber-400">&quot;$4,200.00&quot;</span>
                <span className="text-zinc-500">,</span>
              </div>
              <div>
                <span className="text-sky-200">&quot;due&quot;</span>
                <span className="text-zinc-500">{"    : "}</span>
                <span className="text-emerald-400">&quot;Mar 15, 2026&quot;</span>
              </div>
            </div>
            <div>
              <span className="text-zinc-500">{"}"}</span>
            </div>
          </div>
          <div className="text-zinc-500">{"}"}</div>

          <div className="mt-3 flex items-center gap-1">
            <span className="text-zinc-600">▸</span>
            <span className="ml-1 inline-block h-[13px] w-0.5 animate-pulse bg-blue-400 align-middle" />
          </div>
        </div>
      </div>

      {/* Processing step */}
      <div className="flex items-center gap-3 px-1">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-zinc-700 to-transparent" />
        <div className="flex items-center gap-2 rounded-full border border-zinc-700/60 bg-zinc-900/80 px-3.5 py-1.5 backdrop-blur-sm">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-blue-400" />
          <span className="font-mono text-[11px] text-zinc-400">
            Rendering · 843ms
          </span>
        </div>
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-zinc-700 to-transparent" />
      </div>

      {/* PDF output card */}
      <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-[0_20px_60px_-15px_rgba(0,0,0,0.4)]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-100 bg-zinc-50 px-4 py-3">
          <div className="flex items-center gap-2">
            <FileText className="h-3.5 w-3.5 shrink-0 text-red-400" />
            <span className="font-mono text-[11px] text-zinc-500">
              invoice-acme-2026.pdf
            </span>
          </div>
          <div className="flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            <span className="text-[10px] font-semibold text-emerald-700">
              200 OK
            </span>
          </div>
        </div>

        {/* PDF content mockup */}
        <div className="p-4">
          <div className="mb-3 flex items-start justify-between">
            <div>
              <div className="mb-1.5 h-2 w-14 rounded-sm bg-zinc-800" />
              <div className="h-1.5 w-20 rounded-sm bg-zinc-200" />
            </div>
            <div className="text-right">
              <div className="mb-1.5 h-3 w-16 rounded bg-blue-600" />
              <div className="ml-auto h-1.5 w-12 rounded-sm bg-zinc-200" />
            </div>
          </div>
          <div className="mb-3 h-px w-full bg-zinc-100" />
          <div className="space-y-2">
            {[["w-24", "w-14"], ["w-20", "w-10"], ["w-28", "w-12"]].map(
              ([l, r], i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className={`h-1.5 rounded-sm bg-zinc-100 ${l}`} />
                  <div className={`h-1.5 rounded-sm bg-zinc-200 ${r}`} />
                </div>
              )
            )}
          </div>
          <div className="mb-3 mt-3 h-px w-full bg-zinc-200" />
          <div className="flex items-center justify-between">
            <div className="h-1.5 w-10 rounded-sm bg-zinc-300" />
            <div className="h-3 w-16 rounded bg-blue-600" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function Hero() {
  return (
    <section className="relative flex min-h-[100svh] flex-col overflow-hidden bg-zinc-950">
      {/* Atmospheric background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="animate-float animate-pulse-glow absolute -left-20 top-[-10%] h-[600px] w-[600px] rounded-full bg-blue-600/20 blur-[130px]" />
        <div className="animate-float-slow animate-pulse-glow delay-300 absolute right-0 top-[20%] h-[450px] w-[450px] rounded-full bg-violet-600/15 blur-[110px]" />
        <div className="absolute bottom-0 left-[30%] h-[300px] w-[700px] rounded-full bg-blue-950/30 blur-[120px]" />
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
        <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-16 px-6 py-28 lg:grid-cols-2 lg:gap-16 lg:px-16 lg:py-0">

          {/* Left — copy */}
          <div className="flex flex-col">
            {/* Eyebrow */}
            <div className="animate-fade-up mb-7 inline-flex self-start items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.04] px-4 py-1.5 text-xs font-medium text-white/50 backdrop-blur-sm">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
              Beta · 500 free renders/month
              <ArrowRight className="h-3 w-3" />
            </div>

            {/* Headline */}
            <h1 className="animate-fade-up delay-100 font-heading text-[3.25rem] font-extrabold leading-[0.92] tracking-[-0.045em] text-white sm:text-[4rem] lg:text-[4.5rem] xl:text-[5rem]">
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
            <p className="animate-fade-up delay-200 mt-7 max-w-[420px] text-base leading-[1.75] text-zinc-400 sm:text-[17px]">
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

          {/* Right — pipeline visual */}
          <div className="animate-fade-up delay-200 hidden lg:flex lg:items-center lg:justify-center">
            <div className="w-full max-w-[480px]">
              <HeroPipeline />
            </div>
          </div>

        </div>
      </div>

      {/* Bottom fade into page bg */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-44 bg-gradient-to-t from-zinc-100 to-transparent dark:from-zinc-950" />
    </section>
  );
}
