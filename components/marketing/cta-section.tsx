import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check } from "lucide-react";

export function CtaSection() {
  return (
    <section className="relative overflow-hidden border-t border-white/[0.06] bg-zinc-950 py-24 sm:py-32">
      {/* Orbs */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[400px] w-[700px] -translate-x-1/2 rounded-full bg-blue-600/10 blur-[120px]" />
        <div className="absolute left-1/2 bottom-0 h-[300px] w-[500px] -translate-x-1/2 rounded-full bg-violet-600/8 blur-[100px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-3xl px-6 text-center lg:px-8">
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.15em] text-blue-400">
          Get started
        </p>
        <h2 className="font-heading text-4xl font-extrabold tracking-[-0.03em] text-white sm:text-5xl lg:text-6xl">
          Start with a free key.
          <br />
          <span className="text-zinc-500">No credit card.</span>
        </h2>
        <p className="mx-auto mt-5 max-w-md text-base text-zinc-400">
          100 renders/month on the free tier — enough to build something real
          and decide if Rendr belongs in your stack.
        </p>

        <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Button
            size="lg"
            asChild
            className="h-12 rounded-xl bg-white px-8 text-sm font-semibold text-zinc-900 shadow-md hover:bg-zinc-100 hover:shadow-lg gap-2"
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
            className="h-12 rounded-xl px-8 text-white/50 hover:text-white hover:bg-white/[0.06]"
          >
            <Link href="/docs/quick-start">View quick start →</Link>
          </Button>
        </div>

        <ul className="mt-10 flex flex-col items-center gap-2 sm:flex-row sm:justify-center sm:gap-6">
          {[
            "Setup takes 5 minutes",
            "Free tier forever",
            "No credit card required",
          ].map((item) => (
            <li key={item} className="flex items-center gap-2 text-xs text-zinc-600">
              <Check className="h-3 w-3 text-emerald-500/60" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
