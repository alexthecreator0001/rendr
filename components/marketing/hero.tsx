import Link from "next/link";
import { ArrowRight, BookOpen, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AsciiRain } from "./ascii-rain";

export function Hero() {
  return (
    <section className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden bg-black">
      {/* Animated ASCII rain canvas */}
      <AsciiRain />

      {/* Radial vignette — darkens center so text is readable */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 65% 75% at 50% 48%, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.55) 55%, rgba(0,0,0,0.1) 100%)",
        }}
      />

      {/* Bottom fade into next section */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-zinc-950 to-transparent" />

      {/* Hero content */}
      <div className="relative z-10 mx-auto w-full max-w-4xl px-6 text-center">
        {/* Badge */}
        <div className="animate-fade-up mb-9 inline-flex items-center gap-2 rounded-full border border-white/[0.1] bg-white/[0.04] px-4 py-1.5 text-xs font-medium text-white/50 backdrop-blur-sm">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
          Now in beta · 100 free renders/month
          <ArrowRight className="h-3 w-3" />
        </div>

        {/* Headline */}
        <h1 className="animate-fade-up delay-100 font-heading text-[3.2rem] font-extrabold leading-[0.9] tracking-[-0.05em] text-white sm:text-[4.5rem] lg:text-[6rem] xl:text-[7rem]">
          HTML to PDF,
          <br />
          <span
            style={{
              background: "linear-gradient(120deg, #60a5fa 0%, #22d3ee 80%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            without the mess.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="animate-fade-up delay-200 mx-auto mt-8 max-w-2xl text-base leading-relaxed text-zinc-500 sm:text-lg md:text-xl">
          One API call. Pixel-perfect PDFs from URL or HTML.{" "}
          <span className="text-zinc-400">
            Async jobs, webhooks, signed URLs — no headless browser to babysit.
          </span>
        </p>

        {/* CTAs */}
        <div className="animate-fade-up delay-300 mt-11 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Button
            size="lg"
            asChild
            className="h-12 w-full rounded-xl bg-white px-8 text-sm font-semibold text-black shadow-lg transition-all hover:bg-zinc-100 hover:shadow-xl sm:w-auto gap-2"
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
            className="h-12 w-full rounded-xl border border-white/[0.1] px-8 text-sm text-white/40 transition-all hover:border-white/20 hover:bg-white/[0.06] hover:text-white sm:w-auto gap-2"
          >
            <Link href="/docs">
              <BookOpen className="h-4 w-4" />
              Read the docs
            </Link>
          </Button>
        </div>

        {/* Install command */}
        <div className="animate-fade-up delay-400 mt-8 flex justify-center">
          <div className="flex items-center gap-2.5 rounded-xl border border-white/[0.07] bg-white/[0.03] px-4 py-2.5 backdrop-blur-sm">
            <Terminal className="h-3.5 w-3.5 shrink-0 text-zinc-600" />
            <span className="font-mono text-sm text-zinc-500">
              npm install{" "}
              <span className="text-zinc-300">@rendr/sdk</span>
            </span>
          </div>
        </div>

        <p className="animate-fade-up delay-500 mt-6 text-[11px] tracking-widest text-zinc-700 uppercase">
          No credit card · Free tier forever · 5 min setup
        </p>
      </div>
    </section>
  );
}
