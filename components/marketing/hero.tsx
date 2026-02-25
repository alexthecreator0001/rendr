"use client";

import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SpiralBackground } from "@/components/marketing/spiral-background";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-background">
      {/* Background layers */}
      <div className="pointer-events-none absolute inset-0 z-0" />

      {/* Animated spiral ASCII art background */}
      <div className="pointer-events-none absolute inset-0 z-[1]">
        <SpiralBackground />
      </div>

      {/* Hero image — absolutely positioned on the RIGHT (desktop) */}
      <div className="pointer-events-none absolute inset-0 z-[2] hidden lg:block">
        <div className="absolute right-0 inset-y-0 w-[52%]">
          <img
            src="/hero.png"
            alt=""
            className="absolute right-0 bottom-0 w-full max-w-none h-auto select-none"
            draggable={false}
          />
          {/* Bottom fade only */}
          <div className="absolute inset-x-0 bottom-0 h-[55%] bg-gradient-to-t from-background via-background/80 via-40% to-transparent" />
        </div>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 py-24 lg:px-8 lg:py-32">
        <div className="max-w-xl">

          <h1 className="animate-fade-up delay-100 font-heading text-[3.25rem] font-extrabold leading-[0.92] tracking-[-0.045em] text-foreground sm:text-[4rem] lg:text-[4.5rem]">
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

          <p className="animate-fade-up delay-200 mt-6 max-w-lg text-base leading-[1.75] text-muted-foreground sm:text-lg">
            One API call. Pixel-perfect PDFs from URL or HTML. Async jobs, webhooks, signed download URLs — no headless browser to babysit.
          </p>

          <ul className="animate-fade-up delay-200 mt-7 space-y-2.5">
            {[
              "Set up in 5 minutes, scale to millions of renders",
              "Full CSS & web font support — exactly as designed",
              "Async job queue with webhook callbacks built-in",
            ].map((b) => (
              <li key={b} className="flex items-start gap-2.5 text-sm text-muted-foreground">
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
              className="h-11 rounded-xl bg-zinc-900 px-7 text-sm font-semibold text-white shadow-md hover:bg-zinc-800 hover:shadow-lg gap-2 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100"
            >
              <Link href="/register">
                Get started free
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          <p className="animate-fade-up delay-400 mt-6 text-[11px] tracking-[0.02em] text-muted-foreground/60">
            No credit card required · Free tier forever
          </p>
        </div>

        {/* Mobile: hero image anchored to bottom-right, 90% width, flush to section bottom */}
        <div className="animate-fade-up delay-200 relative -mx-6 -mb-24 mt-12 lg:hidden lg:-mb-32">
          <img
            src="/hero.png"
            alt="Rendr Dashboard"
            className="block w-[90%] h-auto ml-auto select-none"
            draggable={false}
          />
          {/* Bottom-to-top fade */}
          <div className="absolute inset-x-0 bottom-0 h-[45%] bg-gradient-to-t from-background via-background/60 via-30% to-transparent" />
        </div>
      </div>
    </section>
  );
}
