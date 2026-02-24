import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/auth";
import { detectCurrency } from "@/lib/currency";
import { Hero } from "@/components/marketing/hero";
import { TrustRow } from "@/components/marketing/trust-row";
import { PainPoints } from "@/components/marketing/pain-points";
import { FeaturesGrid } from "@/components/marketing/features-grid";
import { HowItWorks } from "@/components/marketing/how-it-works";
import { JobLifecycle } from "@/components/marketing/job-lifecycle";
import { Testimonials } from "@/components/marketing/testimonials";
import { ComparisonTable } from "@/components/marketing/comparison-table";
import { PricingCards } from "@/components/marketing/pricing-cards";
import { FaqSection } from "@/components/marketing/faq-section";
import { CtaSection } from "@/components/marketing/cta-section";

export const metadata: Metadata = {
  title: "Rendr — HTML to PDF API",
};

export default async function LandingPage() {
  const session = await auth();
  if (session?.user) redirect("/app");

  const headersList = await headers();
  const country = headersList.get("cf-ipcountry") ?? headersList.get("x-vercel-ip-country");
  const currency = detectCurrency(country);

  return (
    <>
      <Hero />
      <TrustRow />
      <PainPoints />
      <FeaturesGrid />
      <HowItWorks />
      <JobLifecycle />
      <Testimonials />
      <ComparisonTable />

      {/* Pricing */}
      <section className="border-t border-white/[0.06] bg-zinc-950 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mb-16 text-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.15em] text-blue-400">
              Pricing
            </p>
            <h2 className="font-heading text-4xl font-extrabold tracking-[-0.03em] text-white sm:text-5xl">
              Simple, predictable pricing.
            </h2>
            <p className="mx-auto mt-4 max-w-md text-base text-zinc-400">
              Start free. Scale when you need to. No surprises.
            </p>
          </div>
          <PricingCards currency={currency} />
        </div>
      </section>

      <FaqSection />
      <CtaSection />
    </>
  );
}
