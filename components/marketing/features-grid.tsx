import {
  Zap,
  Webhook,
  Layers,
  Type,
  Lock,
  BarChart2,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: Zap,
    title: "Async jobs",
    description:
      "Submit a render job and get notified when it's ready. No polling required.",
  },
  {
    icon: Webhook,
    title: "Webhook delivery",
    description:
      "Push job results to your server the moment a PDF is ready — or if something goes wrong.",
  },
  {
    icon: Layers,
    title: "Template library",
    description:
      "Store and version your HTML templates. Render any of them with a single API call.",
  },
  {
    icon: Type,
    title: "Custom fonts",
    description:
      "Upload any TTF or WOFF2 font. We embed it in every PDF exactly as you'd expect.",
  },
  {
    icon: Lock,
    title: "Signed URLs",
    description:
      "Get time-limited signed URLs for secure, direct PDF delivery — no proxy needed.",
  },
  {
    icon: BarChart2,
    title: "Usage analytics",
    description:
      "Track render volume, page counts, and failure rates per key in the dashboard.",
  },
];

export function FeaturesGrid() {
  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-14 max-w-xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary">
            Features
          </p>
          <h2 className="text-3xl font-bold tracking-[-0.02em] sm:text-4xl">
            Everything the API needs.
            <br />
            Nothing it doesn&apos;t.
          </h2>
          <p className="mt-4 text-base text-muted-foreground">
            Built for developers who want predictable behavior, not another SaaS with a hundred toggles.
          </p>
        </div>

        {/* Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <Card
              key={feature.title}
              className="group border-border bg-card transition-shadow hover:shadow-md"
            >
              <CardContent className="p-6">
                <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                  <feature.icon className="h-4 w-4 text-primary" />
                </div>
                <h3 className="mb-1.5 font-semibold">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
