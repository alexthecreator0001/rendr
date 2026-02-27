import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SOLUTIONS } from "@/lib/solutions-data";
import {
  Receipt, ShoppingBag, UserCheck, BarChart2, Scale,
  Award, Building2, Activity,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Solutions — Rendr",
  description: "See how teams use Rendr to automate PDF generation for invoicing, e-commerce, HR, legal, healthcare, and more.",
};

const ICON_MAP: Record<string, React.ElementType> = {
  Receipt, ShoppingBag, UserCheck, BarChart2, Scale, Award, Building2, Activity,
};

const COLOR_MAP: Record<string, { icon: string; label: string; card: string }> = {
  blue:    { icon: "text-blue-400",    label: "text-blue-400",    card: "bg-blue-500/10 ring-1 ring-blue-500/20"    },
  emerald: { icon: "text-emerald-400", label: "text-emerald-400", card: "bg-emerald-500/10 ring-1 ring-emerald-500/20" },
  violet:  { icon: "text-violet-400",  label: "text-violet-400",  card: "bg-violet-500/10 ring-1 ring-violet-500/20"  },
  amber:   { icon: "text-amber-400",   label: "text-amber-400",   card: "bg-amber-500/10 ring-1 ring-amber-500/20"   },
  slate:   { icon: "text-slate-400",   label: "text-slate-400",   card: "bg-slate-500/10 ring-1 ring-slate-500/20"   },
  rose:    { icon: "text-rose-400",    label: "text-rose-400",    card: "bg-rose-500/10 ring-1 ring-rose-500/20"     },
  orange:  { icon: "text-orange-400",  label: "text-orange-400",  card: "bg-orange-500/10 ring-1 ring-orange-500/20" },
  sky:     { icon: "text-sky-400",     label: "text-sky-400",     card: "bg-sky-500/10 ring-1 ring-sky-500/20"      },
};

export default function SolutionsPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-zinc-950 py-24 sm:py-32">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/4 top-0 h-[500px] w-[600px] -translate-y-1/3 rounded-full bg-blue-600/10 blur-[120px]" />
          <div className="absolute right-1/4 bottom-0 h-[400px] w-[500px] translate-y-1/3 rounded-full bg-violet-600/8 blur-[100px]" />
          <div
            className="absolute inset-0 opacity-[0.015]"
            style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)`,
              backgroundSize: "48px 48px",
            }}
          />
        </div>

        <div className="relative z-10 mx-auto max-w-4xl px-6 text-center lg:px-8">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.15em] text-blue-400">
            Solutions
          </p>
          <h1 className="font-heading text-4xl font-extrabold tracking-[-0.03em] text-white sm:text-5xl lg:text-6xl">
            Every document workflow,
            <br />
            <span className="text-zinc-500">covered.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-zinc-400 sm:text-lg">
            Rendr powers PDF generation across industries — from invoicing and legal contracts to
            healthcare documents and EdTech certificates. One API, every use case.
          </p>
          <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Button
              size="lg"
              asChild
              className="h-11 rounded-xl bg-white px-7 text-sm font-semibold text-zinc-900 shadow-md hover:bg-zinc-100 gap-2"
            >
              <Link href="/register">
                Get started free <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="ghost"
              asChild
              className="h-11 rounded-xl px-7 text-sm text-white/50 hover:text-white hover:bg-white/[0.06]"
            >
              <Link href="/docs/quick-start">Read the docs →</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Solutions grid */}
      <section className="bg-background py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {SOLUTIONS.map((solution) => {
              const Icon = ICON_MAP[solution.icon] ?? Receipt;
              const colors = COLOR_MAP[solution.color] ?? COLOR_MAP.blue;

              return (
                <Link
                  key={solution.slug}
                  href={`/solutions/${solution.slug}`}
                  className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-sm transition-all duration-200 hover:shadow-lg hover:shadow-black/10 hover:-translate-y-0.5 dark:hover:shadow-black/40"
                >
                  {/* Icon */}
                  <div className={`mb-5 flex h-11 w-11 items-center justify-center rounded-xl ${colors.card}`}>
                    <Icon className={`h-5 w-5 ${colors.icon}`} />
                  </div>

                  {/* Label */}
                  <p className={`mb-1.5 text-[10px] font-semibold uppercase tracking-widest ${colors.label}`}>
                    {solution.label}
                  </p>

                  {/* Title */}
                  <h3 className="mb-2.5 text-[15px] font-bold leading-snug tracking-tight">
                    {solution.title}
                  </h3>

                  {/* Description */}
                  <p className="flex-1 text-[13px] leading-relaxed text-muted-foreground">
                    {solution.tagline}
                  </p>

                  {/* CTA */}
                  <div className="mt-5 flex items-center gap-1 text-[12px] font-semibold text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                    See how it works <ArrowRight className="h-3.5 w-3.5" />
                  </div>

                  {/* Bottom arrow always visible */}
                  <div className="mt-1 flex items-center gap-1 text-[12px] text-muted-foreground/40 group-hover:hidden transition-opacity duration-150">
                    Learn more →
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Case studies callout */}
      <section className="border-t border-border bg-muted/20 py-12">
        <div className="mx-auto max-w-4xl px-6 lg:px-8 text-center">
          <p className="text-sm text-muted-foreground">
            Want to see real examples?{" "}
            <Link href="/case-studies" className="text-primary font-medium hover:underline underline-offset-2">
              Read our case studies →
            </Link>
          </p>
        </div>
      </section>

      {/* Shared features callout */}
      <section className="border-t border-border bg-muted/30 py-16">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <p className="mb-8 text-center text-sm font-semibold uppercase tracking-widest text-muted-foreground">
            Every solution includes
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              "Sync & async rendering modes",
              "Webhook delivery callbacks",
              "Reusable HTML templates",
              "Variable substitution",
              "Signed download URLs",
              "Idempotency keys",
              "A4, Letter, Legal, and custom formats",
              "Full CSS & Google Fonts support",
              "99.9% uptime SLA",
            ].map((feature) => (
              <div key={feature} className="flex items-center gap-2.5 text-sm text-muted-foreground">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <Check className="h-3 w-3 text-primary" />
                </span>
                {feature}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden border-t border-white/[0.06] bg-zinc-950 py-24 sm:py-32">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-0 h-[400px] w-[700px] -translate-x-1/2 rounded-full bg-blue-600/10 blur-[120px]" />
        </div>
        <div className="relative z-10 mx-auto max-w-2xl px-6 text-center">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.15em] text-blue-400">
            Get started
          </p>
          <h2 className="font-heading text-4xl font-extrabold tracking-[-0.03em] text-white sm:text-5xl">
            Start rendering in minutes.
          </h2>
          <p className="mx-auto mt-5 max-w-md text-base text-zinc-400">
            100 free renders/month. No credit card. Production-ready API that
            scales with your business.
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
