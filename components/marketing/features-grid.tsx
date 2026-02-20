import { Zap, Webhook, Layers, Type, Lock, BarChart2 } from "lucide-react";
import { cn } from "@/lib/utils";

const features = [
  {
    icon: Zap,
    title: "Async render jobs",
    description: "Fire and forget. Submit a job, get an ID back immediately. We process it and push the result — no waiting on HTTP.",
    size: "large", // spans 2 cols on desktop
    accent: "blue",
  },
  {
    icon: Webhook,
    title: "Webhook delivery",
    description: "Signed HMAC payloads pushed to your server the moment a job finishes. Or fails.",
    size: "small",
    accent: "violet",
  },
  {
    icon: Layers,
    title: "Template library",
    description: "Store and version your HTML templates. Render any of them with a single call.",
    size: "small",
    accent: "indigo",
  },
  {
    icon: Type,
    title: "Custom fonts",
    description: "Upload TTF or WOFF2. We embed and subset them in every PDF you render.",
    size: "small",
    accent: "blue",
  },
  {
    icon: Lock,
    title: "Signed URLs",
    description: "Time-limited, direct download links. No proxy layer, no auth middleware.",
    size: "small",
    accent: "violet",
  },
  {
    icon: BarChart2,
    title: "Usage analytics",
    description: "Track render volume, latency, and error rates per key in the dashboard.",
    size: "small",
    accent: "indigo",
  },
];

const accentMap = {
  blue: {
    icon: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    glow: "after:bg-blue-500/5",
  },
  violet: {
    icon: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
    glow: "after:bg-violet-500/5",
  },
  indigo: {
    icon: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400",
    glow: "after:bg-indigo-500/5",
  },
};

interface FeatureCardProps {
  feature: typeof features[number];
  className?: string;
}

function FeatureCard({ feature, className }: FeatureCardProps) {
  const accent = accentMap[feature.accent as keyof typeof accentMap];
  const Icon = feature.icon;

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:border-border/80 hover:shadow-lg hover:shadow-black/5 dark:hover:shadow-black/20",
        className
      )}
    >
      {/* Hover glow */}
      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 bg-gradient-to-br from-blue-500/5 via-transparent to-violet-500/5" />

      <div className={cn("mb-4 flex h-10 w-10 items-center justify-center rounded-xl", accent.icon)}>
        <Icon className="h-5 w-5" />
      </div>

      <h3 className="mb-2 font-semibold tracking-tight">{feature.title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
    </div>
  );
}

export function FeaturesGrid() {
  const [large, ...small] = features;

  return (
    <section className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-16 max-w-2xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.15em] text-primary">
            Features
          </p>
          <h2 className="text-4xl font-extrabold tracking-[-0.03em] sm:text-5xl">
            Everything you need.
            <br className="hidden sm:block" />
            <span className="text-muted-foreground/60">Nothing you don&apos;t.</span>
          </h2>
          <p className="mt-5 text-base text-muted-foreground max-w-lg">
            Built for developers who want to ship PDFs fast — not spend a sprint configuring a rendering pipeline.
          </p>
        </div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* Large hero card */}
          <FeatureCard
            feature={large}
            className="sm:col-span-2 lg:col-span-2 lg:row-span-1 min-h-[180px]"
          />
          {/* Small cards */}
          {small.map((feature) => (
            <FeatureCard key={feature.title} feature={feature} />
          ))}
        </div>
      </div>
    </section>
  );
}
