import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { ImagePlaceholder } from "@/components/media/image-placeholder";
import { FeaturesGrid } from "@/components/marketing/features-grid";
import {
  Zap,
  Webhook,
  Layers,
  Type,
  Lock,
  BarChart2,
  Timer,
  Globe,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Features",
  description: "Everything Rendr can do — in plain language.",
};

const deepFeatures = [
  {
    icon: Zap,
    title: "Async rendering pipeline",
    description:
      "Every render is queued and processed by a dedicated worker pool. No timeouts, no request threading. You get a job ID back immediately and a webhook fires when it's done.",
    note: "Typical render time: 300ms–2s depending on page count.",
  },
  {
    icon: Webhook,
    title: "Reliable webhook delivery",
    description:
      "We retry failed deliveries up to 5 times with exponential backoff. Each payload is signed with HMAC-SHA256 — verify it in three lines of code.",
    note: "Failure alerts after 3 consecutive failed deliveries.",
  },
  {
    icon: Layers,
    title: "Versioned templates",
    description:
      "Store templates with semantic names. Update them without breaking existing render calls — previous versions are retained for 30 days.",
    note: "25 templates included on Growth plan.",
  },
  {
    icon: Type,
    title: "Custom font embedding",
    description:
      "Upload TTF or WOFF2 files via the API. We subset and embed them in every PDF you render — consistent across all viewers.",
    note: "Up to 10 custom fonts on Growth plan.",
  },
];

export default function FeaturesPage() {
  return (
    <>
      {/* Header */}
      <Section size="md">
        <Container>
          <div className="max-w-2xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary">
              Features
            </p>
            <h1 className="text-4xl font-extrabold tracking-[-0.03em] sm:text-5xl">
              What Rendr actually does.
            </h1>
            <p className="mt-5 text-lg text-muted-foreground leading-relaxed">
              No marketing fluff. Here&apos;s a plain walkthrough of what you
              get when you integrate Rendr.
            </p>
          </div>
        </Container>
      </Section>

      {/* Feature overview grid */}
      <FeaturesGrid />

      {/* Deep dives - 2-col alternating */}
      <Section size="md">
        <Container>
          <h2 className="mb-10 text-2xl font-bold tracking-tight">A closer look</h2>
          <div className="space-y-16">
            {deepFeatures.map((feature, i) => (
              <div
                key={feature.title}
                className={`flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-14 ${i % 2 === 1 ? "lg:flex-row-reverse" : ""}`}
              >
                <div className="flex-1">
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <feature.icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="mb-3 text-xl font-semibold">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                  <p className="mt-3 inline-flex rounded-md bg-muted px-3 py-1.5 text-xs text-muted-foreground">
                    {feature.note}
                  </p>
                </div>
                <div className="flex-1">
                  {/* intended final asset: feature illustration or screenshot */}
                  {/* suggested export format: PNG or SVG */}
                  {/* exact size: 560×360, aspect: 14/9 */}
                  <ImagePlaceholder
                    label={`${feature.title} — feature illustration (560×360)`}
                    aspect="14/9"
                    rounded="xl"
                    className="w-full"
                  />
                </div>
              </div>
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}
