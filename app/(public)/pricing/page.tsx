import type { Metadata } from "next";
import { PricingCards } from "@/components/marketing/pricing-cards";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const metadata: Metadata = {
  title: "Pricing",
};

const faqs = [
  {
    q: "What counts as a 'render'?",
    a: "One render = one POST to /render. A 10-page invoice and a 1-page receipt are the same — one render each. Pages affect storage, not billing.",
  },
  {
    q: "Can I upgrade or downgrade mid-month?",
    a: "Yes. Upgrades apply immediately and are prorated. Downgrades take effect at the start of the next billing cycle.",
  },
  {
    q: "What happens if I exceed my limit?",
    a: "We email you at 80% usage. Above the limit, renders are queued and rate-limited. You won't be auto-charged — we'll ask first.",
  },
  {
    q: "Is there a free trial for paid plans?",
    a: "Growth includes a 14-day trial, no card required. Business plans can be evaluated on request — email us.",
  },
  {
    q: "Do you offer nonprofit or open-source discounts?",
    a: "Yes. Email hello@rendrpdf.com with a brief description of your project.",
  },
  {
    q: "Where are PDFs stored?",
    a: "Temporarily in managed cloud storage, served via signed URLs. Retention: 7 days (Starter), 30 days (Growth), 90 days (Business).",
  },
];

export default function PricingPage() {
  return (
    <div className="bg-background">
      {/* Header */}
      <section className="pt-20 pb-16 sm:pt-28 sm:pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.15em] text-primary">
              Pricing
            </p>
            <h1 className="text-5xl font-extrabold tracking-[-0.04em] sm:text-6xl">
              Straightforward plans.
            </h1>
            <p className="mt-5 text-lg text-muted-foreground">
              Pay for renders, not seats. No contracts. Cancel any time.
            </p>
          </div>
        </div>
      </section>

      {/* Cards */}
      <section className="pb-24 sm:pb-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <PricingCards />
        </div>
      </section>

      {/* Enterprise callout */}
      <section className="border-y border-border bg-muted/30 py-14">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <h2 className="text-2xl font-bold tracking-tight">Need more volume?</h2>
          <p className="mt-3 text-muted-foreground">
            If you&apos;re rendering more than 50,000 PDFs per month, we offer custom volume pricing, dedicated infrastructure, and an SLA. Let&apos;s talk.
          </p>
          <a
            href="mailto:sales@rendrpdf.com"
            className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
          >
            Contact sales →
          </a>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-10 text-3xl font-bold tracking-tight">Common questions</h2>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`faq-${i}`}>
                <AccordionTrigger className="text-left text-base font-medium">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>
    </div>
  );
}
