"use client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "What exactly is Rendr?",
    a: "Rendr is an HTML-to-PDF rendering API. You send us an HTML template and a set of variables; we return a pixel-perfect PDF via a signed download URL. No Chromium to manage, no job queue to build, no retry logic to write.",
  },
  {
    q: "How is Rendr different from running Puppeteer myself?",
    a: "Puppeteer is a library — you still own the infrastructure: server provisioning, Chromium updates, memory management, crash recovery, and async job queuing. Rendr gives you all of that as a managed API with a predictable per-render pricing model.",
  },
  {
    q: "What HTML and CSS features are supported?",
    a: "Rendr renders with a full Chromium instance, so virtually all modern HTML5 and CSS3 is supported — flexbox, grid, custom properties, SVG, @page rules, and print media queries. If it works in Chrome, it works in Rendr.",
  },
  {
    q: "How long does a render take?",
    a: "Most renders complete in under a second. Average across all plans is ~843ms. Complex documents with many pages or heavy external resources can take 2–3s. The timeout ceiling is 30s.",
  },
  {
    q: "Can I use custom fonts?",
    a: "Yes. Upload any TTF or WOFF2 file via the dashboard or API. Rendr automatically embeds and subsets the fonts into every PDF that references them — no extra config needed.",
  },
  {
    q: "How do webhooks work?",
    a: "After every job completes or fails, Rendr fires a POST request to your configured endpoint with a signed HMAC-SHA256 payload. Failed deliveries are retried up to 3 times with exponential backoff. You verify the signature using your webhook secret.",
  },
  {
    q: "Is there a free tier? What are the limits?",
    a: "Yes — the Starter plan is free forever. You get 500 renders and 5,000 pages per month, 2 API keys, and 1 webhook endpoint. No credit card required to start.",
  },
  {
    q: "Which programming languages does Rendr support?",
    a: "Any language that can make HTTP requests works with the REST API. Official SDKs are available for Node.js, Python, PHP, Ruby, Go, Java, and C#. Community SDKs are listed in the docs.",
  },
];

export function FaqSection() {
  return (
    <section className="border-t border-white/[0.06] bg-zinc-950 py-24 sm:py-32">
      <div className="mx-auto max-w-3xl px-6 lg:px-8">
        {/* Header */}
        <div className="mb-14 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.15em] text-blue-400">
            FAQ
          </p>
          <h2 className="font-heading text-4xl font-extrabold tracking-[-0.03em] text-white sm:text-5xl">
            Common questions.
          </h2>
        </div>

        <Accordion type="single" collapsible className="space-y-2">
          {faqs.map((faq, i) => (
            <AccordionItem
              key={i}
              value={`faq-${i}`}
              className="rounded-2xl border border-white/[0.07] bg-white/[0.02] px-6 data-[state=open]:border-white/[0.12] data-[state=open]:bg-white/[0.04]"
            >
              <AccordionTrigger className="py-5 text-sm font-semibold text-white hover:no-underline [&[data-state=open]]:text-blue-400">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="pb-5 text-sm leading-relaxed text-zinc-400">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
