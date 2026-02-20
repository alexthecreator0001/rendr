import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { PricingCards } from "@/components/marketing/pricing-cards";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Simple, transparent pricing. No per-seat fees.",
};

const faqs = [
  {
    q: "What counts as a 'render'?",
    a: "One render = one POST to /render, regardless of page count. A 10-page invoice counts the same as a 1-page receipt.",
  },
  {
    q: "Can I upgrade or downgrade mid-month?",
    a: "Yes. Upgrades apply immediately and are prorated. Downgrades take effect at the start of the next billing cycle.",
  },
  {
    q: "What happens if I go over my monthly limit?",
    a: "We'll send an email warning at 80% usage. Above the limit, renders are queued but rate-limited. You won't be auto-charged — we'll ask first.",
  },
  {
    q: "Is there a free trial for paid plans?",
    a: "Growth includes a 14-day trial with no card required. Business plans can be evaluated on request.",
  },
  {
    q: "Do you offer discounts for nonprofits or open-source projects?",
    a: "Yes. Email us at hello@rendrpdf.com with a brief description of your project.",
  },
  {
    q: "Where are PDFs stored?",
    a: "Renders are stored temporarily in our managed storage and served via signed URLs. Retention varies by plan: 7 days (Starter), 30 days (Growth), 90 days (Business).",
  },
];

export default function PricingPage() {
  return (
    <>
      {/* Header */}
      <Section size="md">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary">
              Pricing
            </p>
            <h1 className="text-4xl font-extrabold tracking-[-0.03em] sm:text-5xl">
              Straightforward plans.
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Pay for renders, not seats. No contracts. Cancel any time.
            </p>
          </div>
        </Container>
      </Section>

      {/* Pricing cards */}
      <Section size="sm">
        <Container>
          <PricingCards />
        </Container>
      </Section>

      {/* FAQ */}
      <Section size="md">
        <Container size="md">
          <h2 className="mb-8 text-2xl font-bold tracking-tight">
            Common questions
          </h2>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`faq-${i}`}>
                <AccordionTrigger className="text-left font-medium">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Container>
      </Section>
    </>
  );
}
