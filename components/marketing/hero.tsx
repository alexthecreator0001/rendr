import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative flex min-h-[100svh] flex-col overflow-hidden bg-zinc-950">
      {/* Gradient orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Primary blue orb */}
        <div className="animate-float absolute -top-40 left-[20%] h-[600px] w-[600px] rounded-full bg-blue-600/30 blur-[120px] animate-pulse-glow" />
        {/* Secondary violet orb */}
        <div className="animate-float-slow absolute top-[10%] right-[15%] h-[500px] w-[500px] rounded-full bg-violet-600/20 blur-[100px] animate-pulse-glow delay-300" />
        {/* Bottom accent */}
        <div className="absolute bottom-0 left-[40%] h-[400px] w-[800px] rounded-full bg-blue-900/30 blur-[140px]" />
        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(oklch(1 0 0 / 1) 1px, transparent 1px), linear-gradient(90deg, oklch(1 0 0 / 1) 1px, transparent 1px)`,
            backgroundSize: "64px 64px",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 pb-32 pt-28 text-center sm:px-6 lg:px-8">
        {/* Eyebrow */}
        <div className="animate-fade-up mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium text-white/60 backdrop-blur-sm">
          <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-pulse" />
          Now in beta — 500 free renders/month
          <ArrowRight className="h-3 w-3" />
        </div>

        {/* Wordmark */}
        <div className="animate-fade-up delay-100 mb-8">
          <img
            src="/logo-white.svg"
            alt="Rendr"
            className="mx-auto h-16 w-auto sm:h-20 lg:h-24"
          />
        </div>

        {/* Headline */}
        <h1 className="animate-fade-up delay-200 mx-auto max-w-4xl text-5xl font-extrabold tracking-[-0.04em] text-white sm:text-6xl lg:text-7xl xl:text-8xl">
          HTML to PDF.
          <br />
          <span className="text-blue-400">Without the mess.</span>
        </h1>

        {/* Subheadline */}
        <p className="animate-fade-up delay-300 mx-auto mt-6 max-w-xl text-base text-zinc-400 sm:text-lg leading-relaxed">
          One API call converts your templates into pixel-perfect PDFs.
          Async jobs, webhooks, signed URLs — all included.
          No headless browser. No infrastructure.
        </p>

        {/* CTAs */}
        <div className="animate-fade-up delay-400 mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Button
            size="lg"
            asChild
            className="rounded-xl bg-white px-8 text-zinc-900 shadow-lg hover:bg-white/90 hover:shadow-xl transition-all duration-200 gap-2"
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
            className="rounded-xl px-8 text-white/80 hover:text-white hover:bg-white/10 gap-2"
          >
            <Link href="/docs">
              <BookOpen className="h-4 w-4" />
              Read the docs
            </Link>
          </Button>
        </div>

        {/* Social proof */}
        <p className="animate-fade-up delay-500 mt-8 text-xs text-zinc-500">
          No credit card · Free tier forever · Setup in 5 minutes
        </p>
      </div>

      {/* Bottom fade into light */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-zinc-100 to-transparent dark:from-zinc-950" />

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="flex h-9 w-5 items-start justify-center rounded-full border border-white/20 p-1">
          <div className="h-2 w-1 rounded-full bg-white/40 animate-pulse" />
        </div>
      </div>
    </section>
  );
}
