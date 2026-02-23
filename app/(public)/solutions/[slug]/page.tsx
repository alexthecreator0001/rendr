import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Check, X } from "lucide-react";
import {
  Receipt, ShoppingBag, UserCheck, BarChart2, Scale,
  Award, Building2, Activity, Layers, Zap, Webhook,
  Clock, Lock, Globe, FileText, Type,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SOLUTIONS, getSolution } from "@/lib/solutions-data";

// ── Icon maps ──────────────────────────────────────────────────────────────

const ICON_MAP: Record<string, React.ElementType> = {
  Receipt, ShoppingBag, UserCheck, BarChart2, Scale,
  Award, Building2, Activity, Layers, Zap, Webhook,
  Clock, Lock, Globe, FileText, Type, Check,
};

const COLOR_MAP: Record<string, {
  iconBg: string; iconText: string; label: string;
  tagBg: string; tagText: string; featureIcon: string;
}> = {
  blue:    { iconBg: "bg-blue-500/10",    iconText: "text-blue-400",    label: "text-blue-400",    tagBg: "bg-blue-500/10 ring-1 ring-blue-500/20",    tagText: "text-blue-300",    featureIcon: "text-blue-400"    },
  emerald: { iconBg: "bg-emerald-500/10", iconText: "text-emerald-400", label: "text-emerald-400", tagBg: "bg-emerald-500/10 ring-1 ring-emerald-500/20", tagText: "text-emerald-300", featureIcon: "text-emerald-400" },
  violet:  { iconBg: "bg-violet-500/10",  iconText: "text-violet-400",  label: "text-violet-400",  tagBg: "bg-violet-500/10 ring-1 ring-violet-500/20",  tagText: "text-violet-300",  featureIcon: "text-violet-400"  },
  amber:   { iconBg: "bg-amber-500/10",   iconText: "text-amber-400",   label: "text-amber-400",   tagBg: "bg-amber-500/10 ring-1 ring-amber-500/20",   tagText: "text-amber-300",   featureIcon: "text-amber-400"   },
  slate:   { iconBg: "bg-slate-500/10",   iconText: "text-slate-400",   label: "text-slate-400",   tagBg: "bg-slate-500/10 ring-1 ring-slate-500/20",   tagText: "text-slate-300",   featureIcon: "text-slate-400"   },
  rose:    { iconBg: "bg-rose-500/10",    iconText: "text-rose-400",    label: "text-rose-400",    tagBg: "bg-rose-500/10 ring-1 ring-rose-500/20",    tagText: "text-rose-300",    featureIcon: "text-rose-400"    },
  orange:  { iconBg: "bg-orange-500/10",  iconText: "text-orange-400",  label: "text-orange-400",  tagBg: "bg-orange-500/10 ring-1 ring-orange-500/20",  tagText: "text-orange-300",  featureIcon: "text-orange-400"  },
  sky:     { iconBg: "bg-sky-500/10",     iconText: "text-sky-400",     label: "text-sky-400",     tagBg: "bg-sky-500/10 ring-1 ring-sky-500/20",     tagText: "text-sky-300",     featureIcon: "text-sky-400"     },
};

// ── Static params ──────────────────────────────────────────────────────────

export async function generateStaticParams() {
  return SOLUTIONS.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const solution = getSolution(slug);
  if (!solution) return {};
  return {
    title: `${solution.title} — Rendr Solutions`,
    description: solution.description,
  };
}

// ── Page ──────────────────────────────────────────────────────────────────

export default async function SolutionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const solution = getSolution(slug);
  if (!solution) notFound();

  const SolutionIcon = ICON_MAP[solution.icon] ?? Receipt;
  const colors = COLOR_MAP[solution.color] ?? COLOR_MAP.blue;
  const related = SOLUTIONS.filter((s) => solution.relatedSlugs.includes(s.slug)).slice(0, 3);

  return (
    <>
      {/* ── Hero ────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-zinc-950 py-24 sm:py-32">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-0 top-0 h-[600px] w-[600px] -translate-x-1/3 -translate-y-1/4 rounded-full bg-blue-600/10 blur-[130px]" />
          <div className="absolute right-0 bottom-0 h-[400px] w-[500px] translate-x-1/3 translate-y-1/4 rounded-full bg-violet-600/8 blur-[100px]" />
          <div
            className="absolute inset-0 opacity-[0.015]"
            style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)`,
              backgroundSize: "48px 48px",
            }}
          />
        </div>

        <div className="relative z-10 mx-auto max-w-5xl px-6 lg:px-8">
          {/* Back + label breadcrumb */}
          <div className="mb-8 flex items-center gap-2 text-xs text-zinc-600">
            <Link href="/solutions" className="hover:text-zinc-400 transition-colors">Solutions</Link>
            <span>/</span>
            <span className={colors.label}>{solution.label}</span>
          </div>

          <div className="grid gap-12 lg:grid-cols-[1fr_auto] lg:items-start">
            <div>
              {/* Icon + label */}
              <div className="mb-6 flex items-center gap-3">
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${colors.iconBg}`}>
                  <SolutionIcon className={`h-6 w-6 ${colors.iconText}`} />
                </div>
                <p className={`text-sm font-semibold uppercase tracking-widest ${colors.label}`}>
                  {solution.label}
                </p>
              </div>

              <h1 className="font-heading text-4xl font-extrabold tracking-[-0.03em] text-white sm:text-5xl lg:text-[3.25rem] leading-[1.05]">
                {solution.title}
              </h1>
              <p className="mt-4 text-xl font-medium text-zinc-400">
                {solution.tagline}
              </p>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-zinc-500">
                {solution.description}
              </p>

              {/* For-who tags */}
              <div className="mt-6 flex flex-wrap gap-2">
                {solution.forWho.map((w) => (
                  <span key={w} className={`rounded-full px-3 py-1 text-xs font-medium ${colors.tagBg} ${colors.tagText}`}>
                    {w}
                  </span>
                ))}
              </div>

              {/* CTAs */}
              <div className="mt-10 flex flex-wrap items-center gap-3">
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
                  variant="outline"
                  asChild
                  className="h-11 rounded-xl px-6 text-sm font-medium border-white/10 text-zinc-300 hover:bg-white/[0.07] hover:text-white bg-transparent"
                >
                  <Link href={`/register?template=${solution.slug}`}>Try template free</Link>
                </Button>
                <Button
                  size="lg"
                  variant="ghost"
                  asChild
                  className="h-11 rounded-xl px-6 text-sm text-white/40 hover:text-white hover:bg-white/[0.06]"
                >
                  <Link href="/docs/quick-start">Docs →</Link>
                </Button>
              </div>
            </div>

            {/* Stat card */}
            <div className="hidden lg:block">
              <div className="rounded-2xl border border-white/[0.07] bg-white/[0.03] p-6 backdrop-blur-sm w-56">
                {[
                  { label: "Avg render time", value: "~800ms" },
                  { label: "Free renders/mo", value: "100" },
                  { label: "Formats supported", value: "7" },
                  { label: "Uptime SLA", value: "99.9%" },
                ].map(({ label, value }) => (
                  <div key={label} className="border-b border-white/[0.06] py-3 last:border-0">
                    <p className="text-[10px] uppercase tracking-widest text-zinc-600">{label}</p>
                    <p className="mt-0.5 text-xl font-bold text-white">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Challenge ───────────────────────────────────────────────────── */}
      <section className="bg-background py-20 sm:py-28">
        <div className="mx-auto max-w-5xl px-6 lg:px-8">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-muted-foreground">
            The challenge
          </p>
          <h2 className="mb-12 text-3xl font-extrabold tracking-[-0.03em] sm:text-4xl">
            {solution.challenge.headline}
          </h2>
          <div className="grid gap-5 sm:grid-cols-3">
            {solution.challenge.points.map((point, i) => (
              <div key={i} className="rounded-2xl border border-border bg-card p-6">
                <div className="mb-4 flex h-8 w-8 items-center justify-center rounded-lg bg-destructive/10">
                  <X className="h-4 w-4 text-destructive" />
                </div>
                <p className="text-[13.5px] leading-relaxed text-muted-foreground">{point}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How Rendr helps ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-y border-white/[0.06] bg-zinc-950 py-20 sm:py-28">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-1/2 h-[600px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-600/6 blur-[120px]" />
        </div>
        <div className="relative z-10 mx-auto max-w-5xl px-6 lg:px-8">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-blue-400">
            The solution
          </p>
          <h2 className="mb-12 text-3xl font-extrabold tracking-[-0.03em] text-white sm:text-4xl">
            How Rendr helps
          </h2>
          <div className="grid gap-6 sm:grid-cols-3">
            {solution.features.map((feature) => {
              const FIcon = ICON_MAP[feature.icon] ?? Check;
              return (
                <div key={feature.title} className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6">
                  <div className={`mb-4 flex h-10 w-10 items-center justify-center rounded-xl ${colors.iconBg}`}>
                    <FIcon className={`h-5 w-5 ${colors.featureIcon}`} />
                  </div>
                  <h3 className="mb-2 text-[15px] font-semibold text-white">{feature.title}</h3>
                  <p className="text-[13px] leading-relaxed text-zinc-500">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Code example ────────────────────────────────────────────────── */}
      <section className="bg-background py-20 sm:py-28">
        <div className="mx-auto max-w-5xl px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[1fr_2fr] lg:items-start">
            <div>
              <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-muted-foreground">
                Integration
              </p>
              <h2 className="mb-4 text-3xl font-extrabold tracking-[-0.03em]">
                Add it to your stack in minutes
              </h2>
              <p className="text-[14px] leading-relaxed text-muted-foreground">
                Rendr is a plain HTTP API. No SDK required. Works from any language or framework — copy the code and you're rendering in under 5 minutes.
              </p>
              <div className="mt-8 space-y-3">
                {[
                  "No infrastructure to manage",
                  "Works from any language",
                  "Idempotent — safe to retry",
                  "Async or sync — your choice",
                ].map((point) => (
                  <div key={point} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10">
                      <Check className="h-3 w-3 text-primary" />
                    </span>
                    {point}
                  </div>
                ))}
              </div>
              <div className="mt-8">
                <Button asChild size="sm" className="rounded-lg gap-1.5">
                  <Link href="/docs/quick-start">
                    View full docs <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </Button>
              </div>
            </div>

            {/* Terminal */}
            <div className="overflow-hidden rounded-2xl border border-white/[0.08] shadow-2xl shadow-black/30">
              {/* Chrome */}
              <div className="flex items-center gap-2 border-b border-white/[0.06] bg-[#1c1c1e] px-4 py-3">
                <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
                <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
                <span className="h-3 w-3 rounded-full bg-[#28c840]" />
                <span className="ml-3 font-mono text-[11px] text-zinc-600">
                  {solution.slug}.js
                </span>
              </div>
              {/* Code */}
              <pre className="overflow-x-auto bg-[#111113] p-5 font-mono text-[12px] leading-[1.8] text-zinc-300 whitespace-pre">
                <code>{solution.codeExample}</code>
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* ── Related solutions ────────────────────────────────────────────── */}
      {related.length > 0 && (
        <section className="border-t border-border bg-muted/30 py-16 sm:py-20">
          <div className="mx-auto max-w-5xl px-6 lg:px-8">
            <h2 className="mb-8 text-xl font-bold tracking-tight">More solutions</h2>
            <div className="grid gap-4 sm:grid-cols-3">
              {related.map((rel) => {
                const RelIcon = ICON_MAP[rel.icon] ?? Receipt;
                const relColors = COLOR_MAP[rel.color] ?? COLOR_MAP.blue;
                return (
                  <Link
                    key={rel.slug}
                    href={`/solutions/${rel.slug}`}
                    className="group flex items-start gap-4 rounded-2xl border border-border bg-card p-5 transition-all duration-150 hover:shadow-md hover:-translate-y-0.5"
                  >
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${relColors.iconBg}`}>
                      <RelIcon className={`h-5 w-5 ${relColors.iconText}`} />
                    </div>
                    <div className="min-w-0">
                      <p className={`mb-0.5 text-[10px] font-semibold uppercase tracking-widest ${relColors.label}`}>
                        {rel.label}
                      </p>
                      <p className="text-[13.5px] font-semibold leading-snug">{rel.title}</p>
                      <p className="mt-1 flex items-center gap-1 text-[11px] text-muted-foreground group-hover:text-primary transition-colors">
                        See how <ArrowRight className="h-3 w-3" />
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA ─────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-t border-white/[0.06] bg-zinc-950 py-24 sm:py-32">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-0 h-[400px] w-[700px] -translate-x-1/2 rounded-full bg-blue-600/10 blur-[120px]" />
        </div>
        <div className="relative z-10 mx-auto max-w-2xl px-6 text-center">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.15em] text-blue-400">
            Get started
          </p>
          <h2 className="font-heading text-4xl font-extrabold tracking-[-0.03em] text-white sm:text-5xl">
            Start with a free key.
            <br />
            <span className="text-zinc-500">No credit card.</span>
          </h2>
          <p className="mx-auto mt-5 max-w-md text-base text-zinc-400">
            100 renders/month on the free tier — enough to build and validate your
            integration before committing to a plan.
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
              <Link href="/solutions">View all solutions →</Link>
            </Button>
          </div>
          <ul className="mt-10 flex flex-col items-center gap-2 sm:flex-row sm:justify-center sm:gap-6">
            {["Setup takes 5 minutes", "Free tier forever", "No credit card required"].map((item) => (
              <li key={item} className="flex items-center gap-2 text-xs text-zinc-600">
                <Check className="h-3 w-3 text-emerald-500/60" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
