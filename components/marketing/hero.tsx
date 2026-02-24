"use client";

import Link from "next/link";
import { ArrowRight, BookOpen, Check, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-zinc-950">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-0 top-0 h-[700px] w-[700px] -translate-x-1/3 -translate-y-1/4 rounded-full bg-blue-600/10 blur-[140px]" />
        <div className="absolute right-0 top-1/2 h-[500px] w-[500px] translate-x-1/3 rounded-full bg-violet-600/8 blur-[120px]" />
        <div
          className="absolute inset-0 opacity-[0.018]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)`,
            backgroundSize: "48px 48px",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 pt-24 lg:px-8 lg:pt-32">
        {/* Text content — centered */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="animate-fade-up mb-8 inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.04] px-4 py-1.5 text-xs font-medium text-white/50 backdrop-blur-sm">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
            Now in beta · 100 free renders/month
            <ArrowRight className="h-3 w-3" />
          </div>

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

          <p className="animate-fade-up delay-200 mx-auto mt-6 max-w-xl text-base leading-[1.75] text-zinc-400 sm:text-lg">
            One API call. Pixel-perfect PDFs from URL or HTML. Async jobs, webhooks, signed download URLs — no headless browser to babysit.
          </p>

          <ul className="animate-fade-up delay-200 mt-7 inline-flex flex-wrap justify-center gap-x-6 gap-y-2">
            {[
              "Set up in 5 minutes",
              "Full CSS & web font support",
              "Async queue + webhooks",
            ].map((b) => (
              <li key={b} className="flex items-center gap-2 text-sm text-zinc-400">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 ring-1 ring-emerald-500/25">
                  <Check className="h-3 w-3 text-emerald-400" />
                </span>
                {b}
              </li>
            ))}
          </ul>

          <div className="animate-fade-up delay-300 mt-10 flex flex-wrap items-center justify-center gap-3">
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

        {/* Hero image with perspective + bottom fade */}
        <div className="animate-fade-up delay-300 relative mx-auto mt-16 max-w-6xl">
          {/* Glow behind the image */}
          <div className="absolute -inset-x-8 -top-8 bottom-0 rounded-3xl bg-gradient-to-b from-blue-500/[0.07] via-violet-500/[0.05] to-transparent blur-2xl" />

          {/* Image container with perspective */}
          <div
            className="relative"
            style={{ perspective: "2000px" }}
          >
            <div
              className="relative overflow-hidden rounded-t-2xl border border-white/[0.08] border-b-0 shadow-2xl shadow-black/60"
              style={{
                transform: "rotateX(2deg)",
                transformOrigin: "bottom center",
              }}
            >
              <img
                src="/hero.png"
                alt="Rendr Dashboard"
                className="w-full h-auto block"
                draggable={false}
              />

              {/* Bottom fade overlay */}
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[40%] bg-gradient-to-t from-zinc-950 via-zinc-950/80 to-transparent" />
            </div>
          </div>
        </div>
      </div>

      {/* Section bottom fade */}
      <div className="pointer-events-none relative z-10 h-16 bg-gradient-to-t from-zinc-950 to-transparent -mt-16" />
    </section>
  );
}
