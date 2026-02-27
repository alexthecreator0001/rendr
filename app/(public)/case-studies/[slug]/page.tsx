import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ArrowLeft, CheckCircle, Quote, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CASE_STUDIES } from "@/lib/case-studies-data";

export function generateStaticParams() {
  return CASE_STUDIES.map((cs) => ({ slug: cs.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const cs = CASE_STUDIES.find((c) => c.slug === slug);
  if (!cs) return {};
  return {
    title: `${cs.title} — Rendr Case Study`,
    description: cs.summary,
  };
}

const COLOR_MAP: Record<string, { badge: string; accent: string; stepBg: string; stepBorder: string }> = {
  blue:    { badge: "bg-blue-500/10 text-blue-400 ring-1 ring-blue-500/20",       accent: "text-blue-400",    stepBg: "bg-blue-500/10",    stepBorder: "border-blue-500/20"    },
  emerald: { badge: "bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20", accent: "text-emerald-400", stepBg: "bg-emerald-500/10", stepBorder: "border-emerald-500/20" },
  violet:  { badge: "bg-violet-500/10 text-violet-400 ring-1 ring-violet-500/20",   accent: "text-violet-400",  stepBg: "bg-violet-500/10",  stepBorder: "border-violet-500/20"  },
  amber:   { badge: "bg-amber-500/10 text-amber-400 ring-1 ring-amber-500/20",     accent: "text-amber-400",   stepBg: "bg-amber-500/10",   stepBorder: "border-amber-500/20"   },
  rose:    { badge: "bg-rose-500/10 text-rose-400 ring-1 ring-rose-500/20",       accent: "text-rose-400",    stepBg: "bg-rose-500/10",    stepBorder: "border-rose-500/20"    },
  orange:  { badge: "bg-orange-500/10 text-orange-400 ring-1 ring-orange-500/20",   accent: "text-orange-400",  stepBg: "bg-orange-500/10",  stepBorder: "border-orange-500/20"  },
};

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const cs = CASE_STUDIES.find((c) => c.slug === slug);
  if (!cs) notFound();

  const colors = COLOR_MAP[cs.color] ?? COLOR_MAP.blue;

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-zinc-950 py-20 sm:py-28">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/4 top-0 h-[500px] w-[500px] -translate-y-1/3 rounded-full bg-violet-600/8 blur-[120px]" />
          <div
            className="absolute inset-0 opacity-[0.015]"
            style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)`,
              backgroundSize: "48px 48px",
            }}
          />
        </div>

        <div className="relative z-10 mx-auto max-w-3xl px-6 lg:px-8">
          <Link
            href="/case-studies"
            className="mb-8 inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            All case studies
          </Link>

          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${colors.badge}`}>
            {cs.industry}
          </span>

          <h1 className="mt-4 font-heading text-3xl font-extrabold tracking-[-0.03em] text-white sm:text-4xl lg:text-[2.75rem] lg:leading-[1.15]">
            {cs.title}
          </h1>

          <p className="mt-5 text-base leading-relaxed text-zinc-400 sm:text-lg">
            {cs.subtitle}
          </p>

          {/* Tech stack pills */}
          <div className="mt-8 flex flex-wrap gap-2">
            {cs.stack.map((tech) => (
              <span
                key={tech}
                className="inline-flex items-center gap-1.5 rounded-lg border border-white/[0.06] bg-white/[0.03] px-3 py-1.5 text-[11px] font-medium text-zinc-400"
              >
                <Layers className="h-3 w-3 text-zinc-600" />
                {tech}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="bg-background py-16 sm:py-24">
        <div className="mx-auto max-w-3xl px-6 lg:px-8 space-y-16">

          {/* Summary */}
          <div>
            <p className="text-base leading-relaxed text-muted-foreground">
              {cs.summary}
            </p>
          </div>

          {/* Challenge */}
          <div>
            <h2 className="text-xl font-bold tracking-tight">The challenge</h2>
            <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
              {cs.challenge}
            </p>
          </div>

          {/* Solution */}
          <div>
            <h2 className="text-xl font-bold tracking-tight">The solution</h2>
            <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
              {cs.solution}
            </p>
          </div>

          {/* How it works */}
          <div>
            <h2 className="text-xl font-bold tracking-tight mb-6">How it works</h2>
            <div className="space-y-4">
              {cs.howItWorks.map((step, i) => (
                <div
                  key={i}
                  className={`rounded-xl border ${colors.stepBorder} ${colors.stepBg} p-5`}
                >
                  <div className="flex items-start gap-3">
                    <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-background text-[11px] font-bold ${colors.accent}`}>
                      {i + 1}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        {step.step}
                      </p>
                      <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
                        {step.detail}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Results */}
          <div>
            <h2 className="text-xl font-bold tracking-tight mb-6">Results</h2>
            <div className="space-y-3">
              {cs.results.map((result, i) => (
                <div key={i} className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 shrink-0 text-emerald-400 mt-0.5" />
                  <p className="text-[15px] text-muted-foreground">{result}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Quote */}
          {cs.quote && (
            <div className="relative rounded-2xl border border-white/[0.06] bg-zinc-900/50 p-8">
              <Quote className="absolute top-6 left-6 h-8 w-8 text-zinc-800" />
              <blockquote className="relative z-10 pl-6">
                <p className="text-base italic leading-relaxed text-zinc-300">
                  &ldquo;{cs.quote.text}&rdquo;
                </p>
                <footer className="mt-4 text-sm text-zinc-500">
                  — {cs.quote.role}
                </footer>
              </blockquote>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden border-t border-white/[0.06] bg-zinc-950 py-20 sm:py-28">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-0 h-[400px] w-[600px] -translate-x-1/2 rounded-full bg-violet-600/8 blur-[120px]" />
        </div>
        <div className="relative z-10 mx-auto max-w-2xl px-6 text-center">
          <h2 className="font-heading text-3xl font-extrabold tracking-[-0.03em] text-white sm:text-4xl">
            Have a similar workflow?
          </h2>
          <p className="mx-auto mt-4 max-w-md text-base text-zinc-400">
            Start generating PDFs in minutes. 100 free renders/month, no credit card required.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Button
              size="lg"
              asChild
              className="h-11 rounded-xl bg-white px-7 text-sm font-semibold text-zinc-900 hover:bg-zinc-100 gap-2"
            >
              <Link href="/register">
                Get started free <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="ghost"
              asChild
              className="h-11 rounded-xl px-7 text-white/50 hover:text-white hover:bg-white/[0.06]"
            >
              <Link href="/case-studies">More case studies →</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
