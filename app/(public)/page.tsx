import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Hero } from "@/components/marketing/hero";
import { TrustRow } from "@/components/marketing/trust-row";
import { FeaturesGrid } from "@/components/marketing/features-grid";
import { HowItWorks } from "@/components/marketing/how-it-works";
import { CtaSection } from "@/components/marketing/cta-section";
import { ImagePlaceholder } from "@/components/media/image-placeholder";

export const metadata: Metadata = {
  title: "Rendr — HTML to PDF API",
};

const templatePreviews = [
  {
    name: "Invoice",
    tag: "Finance",
    description: "Line items, taxes, payment terms — fully customizable.",
  },
  {
    name: "Statement of Work",
    tag: "Legal",
    description: "Scope, timeline, and deliverables in one clean document.",
  },
  {
    name: "Quarterly Report",
    tag: "Internal",
    description: "Executive summary with chart and table sections.",
  },
];

export default function LandingPage() {
  return (
    <>
      <Hero />
      <TrustRow />

      {/* Product screenshot — tight section */}
      <section className="bg-background py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-2xl border border-border shadow-2xl shadow-black/8 dark:shadow-black/30 ring-1 ring-border/50">
            {/* intended final asset: Rendr dashboard — job list, status pills, usage chart, sidebar nav */}
            {/* suggested export format: PNG retina @2x */}
            {/* exact size: 1200×720, aspect: 16/9 */}
            <ImagePlaceholder
              label="Rendr dashboard screenshot — jobs table with status pills, summary cards, sidebar nav (1200×720 @2x)"
              aspect="16/9"
              rounded="none"
              className="w-full"
            />
          </div>
          <div className="mt-5 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              The Rendr dashboard — one place to manage keys, jobs, templates, and usage.
            </p>
            <Link
              href="/app"
              className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
            >
              Preview dashboard <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </section>

      <FeaturesGrid />

      {/* Templates section — asymmetric */}
      <section className="bg-zinc-50 dark:bg-zinc-900/50 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-14 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.15em] text-primary">
                Templates
              </p>
              <h2 className="text-4xl font-extrabold tracking-[-0.03em] sm:text-5xl">
                Start from a template.
              </h2>
              <p className="mt-4 max-w-md text-base text-muted-foreground">
                Pre-built HTML layouts ready to fork. Customize variables, swap fonts, ship in minutes.
              </p>
            </div>
            <Link
              href="/docs/templates"
              className="flex shrink-0 items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Browse all templates <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-6 sm:grid-cols-3">
            {templatePreviews.map((tpl) => (
              <div key={tpl.name} className="group cursor-pointer">
                {/* intended final asset: PDF template rendered preview screenshot */}
                {/* suggested export format: PNG retina @2x */}
                {/* exact size: 480×340, aspect: 24/17 */}
                <div className="overflow-hidden rounded-2xl border border-border transition-all duration-300 group-hover:border-primary/30 group-hover:shadow-xl group-hover:shadow-primary/5">
                  <ImagePlaceholder
                    label={`${tpl.name} template preview (480×340)`}
                    aspect="24/17"
                    rounded="none"
                    className="w-full"
                  />
                </div>
                <div className="mt-3.5 flex items-start justify-between">
                  <div>
                    <p className="font-semibold">{tpl.name}</p>
                    <p className="mt-0.5 text-sm text-muted-foreground">{tpl.description}</p>
                  </div>
                  <span className="mt-0.5 shrink-0 rounded-full border border-border px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                    {tpl.tag}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <HowItWorks />
      <CtaSection />
    </>
  );
}
