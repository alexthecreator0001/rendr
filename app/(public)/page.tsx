import type { Metadata } from "next";
import { Hero } from "@/components/marketing/hero";
import { TrustRow } from "@/components/marketing/trust-row";
import { FeaturesGrid } from "@/components/marketing/features-grid";
import { HowItWorks } from "@/components/marketing/how-it-works";
import { CtaSection } from "@/components/marketing/cta-section";
import { ImagePlaceholder } from "@/components/media/image-placeholder";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Rendr — HTML to PDF API",
};

const templatePreviews = [
  { name: "Invoice", id: "invoice" },
  { name: "Quarterly Report", id: "report" },
  { name: "Statement of Work", id: "sow" },
];

export default function LandingPage() {
  return (
    <>
      {/* Hero */}
      <Hero />

      {/* Trust row */}
      <TrustRow />

      {/* Product screenshot */}
      <Section size="md">
        <Container>
          <div className="rounded-2xl border border-border overflow-hidden shadow-xl">
            {/* intended final asset: dashboard screenshot showing job list + usage chart */}
            {/* suggested export format: PNG */}
            {/* exact size: 1200×720, aspect: 16/9 */}
            <ImagePlaceholder
              label="Dashboard product screenshot — job list with status pills, summary cards, sidebar navigation (1200×720)"
              aspect="16/9"
              rounded="none"
              className="w-full"
            />
          </div>
          <p className="mt-4 text-center text-xs text-muted-foreground">
            The Rendr dashboard — monitor jobs, manage keys, track usage.
          </p>
        </Container>
      </Section>

      {/* Features grid */}
      <FeaturesGrid />

      {/* Templates preview */}
      <Section size="md" className="bg-muted/30">
        <Container>
          <div className="mb-10">
            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-primary">
              Templates
            </p>
            <div className="flex items-end justify-between">
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                Start from a template.
              </h2>
              <Link
                href="/docs/templates"
                className="hidden items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors sm:flex"
              >
                Browse all <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Pre-built HTML templates you can fork and customize in minutes.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {templatePreviews.map((tpl) => (
              <div key={tpl.id} className="group cursor-pointer">
                {/* intended final asset: PDF template thumbnail screenshot */}
                {/* suggested export format: PNG */}
                {/* exact size: 400×280, aspect: 10/7 */}
                <ImagePlaceholder
                  label={`${tpl.name} template thumbnail (400×280)`}
                  aspect="10/7"
                  rounded="xl"
                  className="w-full transition-all duration-200 group-hover:shadow-md group-hover:scale-[1.01]"
                />
                <p className="mt-2.5 text-sm font-medium">{tpl.name}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* How it works */}
      <HowItWorks />

      {/* CTA */}
      <CtaSection />
    </>
  );
}
