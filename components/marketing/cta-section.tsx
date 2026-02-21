import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function CtaSection() {
  return (
    <section className="border-t border-white/[0.06] bg-zinc-950 py-24 sm:py-32">
      <div className="mx-auto max-w-3xl px-6 text-center lg:px-8">
        {/* Orbs */}
        <div className="pointer-events-none absolute left-1/2 -translate-x-1/2 h-[300px] w-[600px] rounded-full bg-blue-600/10 blur-[100px]" />

        <div className="relative z-10">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.15em] text-blue-400">
            Get started
          </p>
          <h2 className="font-heading text-4xl font-extrabold tracking-[-0.03em] text-white sm:text-5xl">
            Start with a free key.
            <br />
            <span className="text-zinc-500">No credit card.</span>
          </h2>
          <p className="mx-auto mt-5 max-w-md text-base text-zinc-400">
            500 renders/month on the free tier — enough to build something real
            and decide if Rendr belongs in your stack.
          </p>

          <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Button
              size="lg"
              asChild
              className="h-11 rounded-xl bg-white px-8 text-sm font-semibold text-zinc-900 shadow-md hover:bg-zinc-100 hover:shadow-lg gap-2"
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
              className="h-11 rounded-xl px-8 text-white/50 hover:text-white hover:bg-white/[0.06]"
            >
              <Link href="/docs/quick-start">View quick start</Link>
            </Button>
          </div>

          <p className="mt-7 text-[11px] tracking-[0.025em] text-zinc-700">
            Setup takes 5 minutes · Free tier forever · No credit card required
          </p>
        </div>
      </div>
    </section>
  );
}
