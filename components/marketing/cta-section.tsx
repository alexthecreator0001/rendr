import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function CtaSection() {
  return (
    <section className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-zinc-950 px-8 py-16 text-center sm:px-14 sm:py-24">
          {/* Orbs */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -top-20 left-[30%] h-64 w-64 rounded-full bg-blue-600/25 blur-[80px]" />
            <div className="absolute -bottom-10 right-[30%] h-64 w-64 rounded-full bg-violet-600/20 blur-[80px]" />
          </div>

          <div className="relative z-10">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.15em] text-blue-400">
              Get started
            </p>
            <h2 className="mx-auto max-w-2xl text-4xl font-extrabold tracking-[-0.03em] text-white sm:text-5xl">
              Start with a free key.
              <br />
              No credit card.
            </h2>
            <p className="mx-auto mt-5 max-w-md text-base text-zinc-400">
              500 renders/month on the free tier — enough to build something real and decide if Rendr belongs in your stack.
            </p>
            <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Button
                size="lg"
                asChild
                className="rounded-xl bg-white px-8 text-zinc-900 hover:bg-white/90 gap-2 shadow-lg"
              >
                <Link href="/register">
                  Create free account
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="ghost"
                asChild
                className="rounded-xl px-8 text-white/70 hover:text-white hover:bg-white/10"
              >
                <Link href="/docs/quick-start">View quick start</Link>
              </Button>
            </div>
            <p className="mt-6 text-xs text-zinc-600">
              Setup takes 5 minutes · Used by teams shipping millions of PDFs
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
