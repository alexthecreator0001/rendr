import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { FeaturesGrid } from "@/components/marketing/features-grid";
import {
  Zap,
  Webhook,
  Layers,
  Type,
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

/* ── Code-based illustrations for each deep-dive feature ── */

function AsyncPipelineIllustration() {
  return (
    <div className="w-full rounded-xl border border-zinc-800 bg-zinc-900/80 p-5 font-mono text-xs" style={{ aspectRatio: "14/9" }}>
      <div className="mb-3 flex items-center gap-2 text-zinc-500">
        <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
        <span>render pipeline</span>
      </div>
      <div className="space-y-2.5">
        {/* Step 1 */}
        <div className="flex items-center gap-3">
          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-blue-500/20 text-[10px] text-blue-400">1</span>
          <div className="flex-1 rounded bg-zinc-800/80 px-3 py-2">
            <span className="text-blue-400">POST</span> <span className="text-zinc-300">/v1/convert-async</span>
          </div>
          <span className="text-emerald-400">202</span>
        </div>
        {/* Step 2 */}
        <div className="flex items-center gap-3">
          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-blue-500/20 text-[10px] text-blue-400">2</span>
          <div className="flex-1 rounded bg-zinc-800/80 px-3 py-2">
            <span className="text-yellow-400">queued</span> <span className="text-zinc-500">→</span> <span className="text-blue-400">processing</span> <span className="text-zinc-500">→</span> <span className="text-emerald-400">done</span>
          </div>
          <span className="inline-block h-3 w-3 animate-spin-slow rounded-full border border-blue-400/50 border-t-blue-400" />
        </div>
        {/* Step 3 */}
        <div className="flex items-center gap-3">
          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-blue-500/20 text-[10px] text-blue-400">3</span>
          <div className="flex-1 rounded bg-zinc-800/80 px-3 py-2">
            <span className="text-zinc-500">{"{"}</span> <span className="text-emerald-400">&quot;status&quot;</span><span className="text-zinc-500">:</span> <span className="text-emerald-400">&quot;done&quot;</span><span className="text-zinc-500">,</span> <span className="text-emerald-400">&quot;download_url&quot;</span><span className="text-zinc-500">:</span> <span className="text-zinc-400">&quot;...&quot;</span> <span className="text-zinc-500">{"}"}</span>
          </div>
          <span className="text-emerald-400">PDF</span>
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between border-t border-zinc-800 pt-3">
        <span className="text-zinc-600">avg latency</span>
        <span className="text-zinc-400">~800ms</span>
      </div>
    </div>
  );
}

function WebhookIllustration() {
  return (
    <div className="w-full rounded-xl border border-zinc-800 bg-zinc-900/80 p-5 font-mono text-xs" style={{ aspectRatio: "14/9" }}>
      <div className="mb-3 flex items-center gap-2 text-zinc-500">
        <span className="h-2.5 w-2.5 rounded-full bg-violet-500/80" />
        <span>webhook delivery</span>
      </div>
      {/* Payload */}
      <div className="rounded bg-zinc-800/80 px-3 py-2.5 leading-relaxed">
        <div className="text-zinc-500">POST <span className="text-zinc-300">https://your-app.com/hook</span></div>
        <div className="mt-2 border-t border-zinc-700/50 pt-2">
          <div><span className="text-violet-400">X-Rendr-Signature</span><span className="text-zinc-500">:</span> <span className="text-zinc-400">sha256=a1b2c3...</span></div>
          <div><span className="text-violet-400">Content-Type</span><span className="text-zinc-500">:</span> <span className="text-zinc-400">application/json</span></div>
        </div>
        <div className="mt-2 border-t border-zinc-700/50 pt-2 text-zinc-400">
          {"{"} <span className="text-emerald-400">&quot;event&quot;</span>: <span className="text-amber-400">&quot;job.completed&quot;</span>,<br />
          {"  "}<span className="text-emerald-400">&quot;job_id&quot;</span>: <span className="text-zinc-300">&quot;j_9x2k...&quot;</span>,<br />
          {"  "}<span className="text-emerald-400">&quot;download_url&quot;</span>: <span className="text-zinc-300">&quot;...&quot;</span> {"}"}
        </div>
      </div>
      {/* Retry timeline */}
      <div className="mt-3 flex items-center gap-1.5">
        <span className="rounded bg-red-500/20 px-1.5 py-0.5 text-[10px] text-red-400">fail</span>
        <span className="text-zinc-700">→</span>
        <span className="rounded bg-red-500/20 px-1.5 py-0.5 text-[10px] text-red-400">retry 2s</span>
        <span className="text-zinc-700">→</span>
        <span className="rounded bg-amber-500/20 px-1.5 py-0.5 text-[10px] text-amber-400">retry 8s</span>
        <span className="text-zinc-700">→</span>
        <span className="rounded bg-emerald-500/20 px-1.5 py-0.5 text-[10px] text-emerald-400">delivered</span>
      </div>
    </div>
  );
}

function TemplatesIllustration() {
  return (
    <div className="w-full rounded-xl border border-zinc-800 bg-zinc-900/80 p-5 font-mono text-xs" style={{ aspectRatio: "14/9" }}>
      <div className="mb-3 flex items-center gap-2 text-zinc-500">
        <span className="h-2.5 w-2.5 rounded-full bg-amber-500/80" />
        <span>template versions</span>
      </div>
      <div className="space-y-2">
        {[
          { version: "v3", date: "today", status: "active", color: "emerald" },
          { version: "v2", date: "2d ago", status: "retained", color: "zinc" },
          { version: "v1", date: "5d ago", status: "retained", color: "zinc" },
        ].map((v) => (
          <div key={v.version} className="flex items-center gap-3 rounded bg-zinc-800/80 px-3 py-2.5">
            <span className={`rounded px-1.5 py-0.5 text-[10px] font-semibold ${v.color === "emerald" ? "bg-emerald-500/20 text-emerald-400" : "bg-zinc-700 text-zinc-400"}`}>{v.version}</span>
            <span className="flex-1 text-zinc-300">invoice-template</span>
            <span className="text-zinc-600">{v.date}</span>
            <span className={`text-[10px] ${v.color === "emerald" ? "text-emerald-400" : "text-zinc-500"}`}>{v.status}</span>
          </div>
        ))}
      </div>
      <div className="mt-3 rounded bg-zinc-800/60 px-3 py-2 text-zinc-500">
        <span className="text-blue-400">POST</span> /v1/convert {"{"} <span className="text-emerald-400">&quot;template&quot;</span>: <span className="text-amber-400">&quot;invoice-template&quot;</span>, <span className="text-emerald-400">&quot;data&quot;</span>: {"{"}<span className="text-zinc-400">...</span>{"}"} {"}"}
      </div>
      <div className="mt-2 flex items-center gap-2 text-[10px] text-zinc-600">
        <Layers className="h-3 w-3" />
        <span>Previous versions retained 30 days</span>
      </div>
    </div>
  );
}

function FontsIllustration() {
  return (
    <div className="w-full rounded-xl border border-zinc-800 bg-zinc-900/80 p-5" style={{ aspectRatio: "14/9" }}>
      <div className="mb-3 flex items-center gap-2 font-mono text-xs text-zinc-500">
        <span className="h-2.5 w-2.5 rounded-full bg-cyan-500/80" />
        <span>font embedding</span>
      </div>
      {/* Font samples */}
      <div className="space-y-3">
        <div className="rounded bg-zinc-800/80 px-4 py-3">
          <div className="mb-1 font-mono text-[10px] text-zinc-600">Inter-Bold.woff2</div>
          <div className="text-lg font-bold tracking-tight text-white">The quick brown fox jumps</div>
        </div>
        <div className="rounded bg-zinc-800/80 px-4 py-3">
          <div className="mb-1 font-mono text-[10px] text-zinc-600">Playfair-Regular.ttf</div>
          <div className="text-lg italic tracking-tight text-white" style={{ fontFamily: "Georgia, serif" }}>over the lazy dog.</div>
        </div>
      </div>
      {/* Upload flow */}
      <div className="mt-3 flex items-center gap-2 font-mono text-xs">
        <span className="rounded bg-cyan-500/20 px-2 py-1 text-cyan-400">upload .ttf/.woff2</span>
        <span className="text-zinc-700">→</span>
        <span className="rounded bg-zinc-800 px-2 py-1 text-zinc-400">subset</span>
        <span className="text-zinc-700">→</span>
        <span className="rounded bg-zinc-800 px-2 py-1 text-zinc-400">embed in PDF</span>
      </div>
      <div className="mt-2 flex items-center gap-2 font-mono text-[10px] text-zinc-600">
        <Type className="h-3 w-3" />
        <span>Consistent rendering across all PDF viewers</span>
      </div>
    </div>
  );
}

const featureIllustrations = [
  <AsyncPipelineIllustration key="async" />,
  <WebhookIllustration key="webhook" />,
  <TemplatesIllustration key="templates" />,
  <FontsIllustration key="fonts" />,
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
                  {featureIllustrations[i]}
                </div>
              </div>
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}
