"use client";

import Link from "next/link";
import { ArrowRight, BookOpen, Check, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SpiralBackground } from "@/components/marketing/spiral-background";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-zinc-950">
      {/* Background layers */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute left-0 top-0 h-[700px] w-[700px] -translate-x-1/3 -translate-y-1/4 rounded-full bg-blue-600/10 blur-[140px]" />
        <div className="absolute right-0 top-1/2 h-[500px] w-[500px] translate-x-1/3 rounded-full bg-violet-600/8 blur-[120px]" />
      </div>

      {/* Animated spiral ASCII art background */}
      <div className="pointer-events-none absolute inset-0 z-[1]">
        <SpiralBackground />
      </div>

      {/* Hero image — absolutely positioned on the RIGHT */}
      <div className="pointer-events-none absolute inset-0 z-[2] hidden lg:block">
        <div className="absolute inset-0">
          <img
            src="/hero.png"
            alt=""
            className="absolute right-0 top-1/2 -translate-y-1/2 w-[50%] max-w-none h-auto select-none"
            draggable={false}
          />
          {/* Left fade into background */}
          <div className="absolute inset-y-0 left-0 w-[58%] bg-gradient-to-r from-zinc-950 via-zinc-950/90 via-45% to-transparent" />
          {/* Bottom fade */}
          <div className="absolute inset-x-0 bottom-0 h-[45%] bg-gradient-to-t from-zinc-950 via-zinc-950/80 to-transparent" />
          {/* Top fade */}
          <div className="absolute inset-x-0 top-0 h-[20%] bg-gradient-to-b from-zinc-950/80 to-transparent" />
          {/* Right edge fade */}
          <div className="absolute inset-y-0 right-0 w-[5%] bg-gradient-to-r from-transparent to-zinc-950/50" />
        </div>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 py-24 lg:px-8 lg:py-32">
        <div className="max-w-xl">

          <h1 className="animate-fade-up delay-100 font-heading text-[3.25rem] font-extrabold leading-[0.92] tracking-[-0.045em] text-white sm:text-[4rem] lg:text-[4.5rem]">
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

          <p className="animate-fade-up delay-200 mt-6 max-w-lg text-base leading-[1.75] text-zinc-400 sm:text-lg">
            One API call. Pixel-perfect PDFs from URL or HTML. Async jobs, webhooks, signed download URLs — no headless browser to babysit.
          </p>

          <ul className="animate-fade-up delay-200 mt-7 space-y-2.5">
            {[
              "Set up in 5 minutes, scale to millions of renders",
              "Full CSS & web font support — exactly as designed",
              "Async job queue with webhook callbacks built-in",
            ].map((b) => (
              <li key={b} className="flex items-start gap-2.5 text-sm text-zinc-400">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 ring-1 ring-emerald-500/25">
                  <Check className="h-3 w-3 text-emerald-400" />
                </span>
                {b}
              </li>
            ))}
          </ul>

          <div className="animate-fade-up delay-300 mt-10 flex flex-wrap items-center gap-3">
            <Button
              size="lg"
              asChild
              className="h-11 rounded-xl bg-white px-7 text-sm font-semibold text-zinc-900 shadow-md hover:bg-zinc-100 hover:shadow-lg gap-2"
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
              className="h-11 rounded-xl px-6 text-sm text-white/50 hover:bg-white/[0.06] hover:text-white gap-2"
            >
              <Link href="/docs">
                <BookOpen className="h-4 w-4" />
                Read the docs
              </Link>
            </Button>
          </div>

          <div className="animate-fade-up delay-400 mt-6">
            <div className="inline-flex items-center gap-2.5 rounded-xl border border-white/[0.07] bg-zinc-900/60 px-4 py-2.5 backdrop-blur-sm">
              <Terminal className="h-3.5 w-3.5 shrink-0 text-zinc-500" />
              <span className="font-mono text-sm text-zinc-400">
                npm install{" "}
                <span className="text-white">@rendr/sdk</span>
              </span>
            </div>
          </div>

          <p className="animate-fade-up delay-500 mt-5 text-[11px] tracking-[0.02em] text-zinc-700">
            No credit card required · Free tier forever
          </p>
        </div>

        {/* Mobile: show hero image below text */}
        <div className="animate-fade-up delay-200 relative mt-12 lg:hidden">
          <img
            src="/hero.png"
            alt="Rendr Dashboard"
            className="w-full h-auto block select-none"
            draggable={false}
          />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[40%] bg-gradient-to-t from-zinc-950 via-zinc-950/70 to-transparent" />
        </div>
      </div>

      {/* Bottom fade */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-zinc-950 to-transparent" />
    </section>
  );
}
