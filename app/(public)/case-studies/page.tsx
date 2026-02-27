import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CASE_STUDIES } from "@/lib/case-studies-data";

export const metadata: Metadata = {
  title: "Case Studies — Rendr",
  description: "See how companies use Rendr to automate PDF generation — from price quotations and order confirmations to investor reports and legal contracts.",
};

const COLOR_MAP: Record<string, { badge: string; border: string }> = {
  blue:    { badge: "bg-blue-500/10 text-blue-400 ring-1 ring-blue-500/20",       border: "hover:border-blue-500/30"    },
  emerald: { badge: "bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20", border: "hover:border-emerald-500/30" },
  violet:  { badge: "bg-violet-500/10 text-violet-400 ring-1 ring-violet-500/20",   border: "hover:border-violet-500/30"  },
  amber:   { badge: "bg-amber-500/10 text-amber-400 ring-1 ring-amber-500/20",     border: "hover:border-amber-500/30"   },
  rose:    { badge: "bg-rose-500/10 text-rose-400 ring-1 ring-rose-500/20",       border: "hover:border-rose-500/30"    },
  orange:  { badge: "bg-orange-500/10 text-orange-400 ring-1 ring-orange-500/20",   border: "hover:border-orange-500/30"  },
};

export default function CaseStudiesPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-zinc-950 py-24 sm:py-32">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/3 top-0 h-[500px] w-[600px] -translate-y-1/3 rounded-full bg-violet-600/10 blur-[120px]" />
          <div className="absolute right-1/4 bottom-0 h-[400px] w-[500px] translate-y-1/3 rounded-full bg-blue-600/8 blur-[100px]" />
          <div
            className="absolute inset-0 opacity-[0.015]"
            style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)`,
              backgroundSize: "48px 48px",
            }}
          />
        </div>

        <div className="relative z-10 mx-auto max-w-4xl px-6 text-center lg:px-8">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.15em] text-violet-400">
            Case Studies
          </p>
          <h1 className="font-heading text-4xl font-extrabold tracking-[-0.03em] text-white sm:text-5xl lg:text-6xl">
            Real teams,
            <br />
            <span className="text-zinc-500">real workflows.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-zinc-400 sm:text-lg">
            See how companies use Rendr to automate PDF generation — from no-code apps
            and SaaS dashboards to legal platforms and real estate CRMs.
          </p>
        </div>
      </section>

      {/* Case studies grid */}
      <section className="bg-background py-20 sm:py-28">
        <div className="mx-auto max-w-5xl px-6 lg:px-8">
          <div className="space-y-5">
            {CASE_STUDIES.map((cs) => {
              const colors = COLOR_MAP[cs.color] ?? COLOR_MAP.blue;
              return (
                <Link
                  key={cs.slug}
                  href={`/case-studies/${cs.slug}`}
                  className={`group block rounded-2xl border border-border bg-card p-6 sm:p-8 transition-all duration-200 hover:shadow-lg hover:shadow-black/10 hover:-translate-y-0.5 dark:hover:shadow-black/40 ${colors.border}`}
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-6">
                    <div className="flex-1 min-w-0">
                      {/* Industry badge */}
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${colors.badge}`}>
                        {cs.industry}
                      </span>

                      <h2 className="mt-3 text-lg font-bold leading-snug tracking-tight text-foreground sm:text-xl">
                        {cs.title}
                      </h2>

                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground line-clamp-2">
                        {cs.summary}
                      </p>

                      {/* Results preview */}
                      <div className="mt-4 flex flex-wrap gap-2">
                        {cs.results.slice(0, 2).map((r, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-muted/50 px-2.5 py-1 text-[11px] text-muted-foreground"
                          >
                            <span className="h-1 w-1 rounded-full bg-emerald-500" />
                            {r.length > 60 ? r.slice(0, 57) + "..." : r}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Arrow */}
                    <div className="hidden sm:flex items-center self-center shrink-0">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-muted/30 transition-colors group-hover:bg-primary/10 group-hover:border-primary/20">
                        <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden border-t border-white/[0.06] bg-zinc-950 py-24 sm:py-32">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-0 h-[400px] w-[700px] -translate-x-1/2 rounded-full bg-violet-600/10 blur-[120px]" />
        </div>
        <div className="relative z-10 mx-auto max-w-2xl px-6 text-center">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.15em] text-violet-400">
            Your turn
          </p>
          <h2 className="font-heading text-4xl font-extrabold tracking-[-0.03em] text-white sm:text-5xl">
            Ready to automate your PDFs?
          </h2>
          <p className="mx-auto mt-5 max-w-md text-base text-zinc-400">
            100 free renders/month. No credit card required. Start generating
            production-quality PDFs in minutes.
          </p>
          <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Button
              size="lg"
              asChild
              className="h-12 rounded-xl bg-white px-8 text-sm font-semibold text-zinc-900 hover:bg-zinc-100 gap-2"
            >
              <Link href="/register">
                Create free account <ArrowRight className="h-4 w-4" />
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
        </div>
      </section>
    </>
  );
}
