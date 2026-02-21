import { Zap, Webhook, Layers, Type, Lock, BarChart2 } from "lucide-react";

function AsyncJobsDemo() {
  return (
    <div className="mt-4 rounded-xl border border-white/[0.06] bg-black/40 p-4 font-mono text-[11.5px] leading-[1.8]">
      <div className="flex items-center justify-between">
        <span className="text-zinc-600">job_id</span>
        <span className="text-zinc-300">job_7f3k2m</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-zinc-600">status</span>
        <span className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-blue-400" />
          <span className="text-blue-400">processing</span>
        </span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-zinc-600">queued_at</span>
        <span className="text-zinc-400">14:23:01.042</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-zinc-600">estimated_ms</span>
        <span className="text-zinc-400">900</span>
      </div>
    </div>
  );
}

function WebhookDemo() {
  return (
    <div className="mt-4 rounded-xl border border-white/[0.06] bg-black/40 p-4 font-mono text-[11px] leading-[1.8]">
      <div className="mb-2 text-zinc-600">
        POST{" "}
        <span className="text-zinc-400">your-server.com/webhook</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-zinc-600">event</span>
        <span className="text-emerald-400">job.completed</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-zinc-600">job_id</span>
        <span className="text-zinc-400">job_7f3k2m</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-zinc-600">signature</span>
        <span className="text-amber-400">sha256=3f9a…</span>
      </div>
    </div>
  );
}

function TemplatesDemo() {
  const tpls = [
    { id: "tmpl_invoice", tag: "Finance" },
    { id: "tmpl_sow", tag: "Legal" },
    { id: "tmpl_report", tag: "Internal" },
  ];
  const tagColors: Record<string, string> = {
    Finance: "text-blue-400 border-blue-500/30 bg-blue-500/10",
    Legal: "text-violet-400 border-violet-500/30 bg-violet-500/10",
    Internal: "text-amber-400 border-amber-500/30 bg-amber-500/10",
  };
  return (
    <div className="mt-4 space-y-2">
      {tpls.map((t) => (
        <div
          key={t.id}
          className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-black/30 px-4 py-2.5"
        >
          <span className="font-mono text-[11.5px] text-zinc-400">{t.id}</span>
          <span
            className={`rounded-full border px-2 py-0.5 text-[10px] font-medium ${tagColors[t.tag]}`}
          >
            {t.tag}
          </span>
        </div>
      ))}
    </div>
  );
}

function SignedUrlDemo() {
  return (
    <div className="mt-4 rounded-xl border border-white/[0.06] bg-black/40 p-4">
      <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-zinc-600">
        Signed download URL
      </p>
      <p className="break-all font-mono text-[10.5px] leading-[1.7] text-zinc-400">
        <span className="text-zinc-600">https://cdn.rendrpdf.com</span>
        <span className="text-white">/files/job_7f3k2m</span>
        <span className="text-zinc-600">?token=</span>
        <span className="text-blue-400">rk_dl_••••••••</span>
        <span className="text-zinc-600">&expires=</span>
        <span className="text-zinc-400">1735689600</span>
      </p>
      <div className="mt-3 flex items-center gap-2">
        <span className="rounded-full border border-emerald-500/25 bg-emerald-500/10 px-2 py-0.5 text-[10px] text-emerald-400">
          Time-limited
        </span>
        <span className="rounded-full border border-blue-500/25 bg-blue-500/10 px-2 py-0.5 text-[10px] text-blue-400">
          No auth required
        </span>
      </div>
    </div>
  );
}

function FontsDemo() {
  const fonts = [
    { name: "Inter.woff2", size: "18kb", status: "Embedded" },
    { name: "Montserrat.ttf", size: "23kb", status: "Subset" },
    { name: "JetBrainsMono.woff2", size: "31kb", status: "Embedded" },
  ];
  return (
    <div className="mt-4 space-y-2">
      {fonts.map((f) => (
        <div
          key={f.name}
          className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-black/30 px-4 py-2.5"
        >
          <div>
            <p className="font-mono text-[11.5px] text-zinc-300">{f.name}</p>
            <p className="text-[10px] text-zinc-600">{f.size}</p>
          </div>
          <span className="flex items-center gap-1.5 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-2 py-0.5 text-[10px] text-emerald-400">
            <span className="h-1 w-1 rounded-full bg-emerald-400" />
            {f.status}
          </span>
        </div>
      ))}
    </div>
  );
}

function AnalyticsDemo() {
  return (
    <div className="mt-4 rounded-xl border border-white/[0.06] bg-black/40 p-4 space-y-3">
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-600">
          This month
        </p>
        <p className="font-heading text-2xl font-extrabold text-white">
          2,847
          <span className="ml-2 text-sm font-normal text-emerald-400">↑ 23%</span>
        </p>
        <p className="text-[11px] text-zinc-600">renders</p>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-lg border border-white/[0.05] bg-white/[0.02] p-2.5">
          <p className="text-xs font-semibold text-white">843ms</p>
          <p className="text-[10px] text-zinc-600">avg render</p>
        </div>
        <div className="rounded-lg border border-white/[0.05] bg-white/[0.02] p-2.5">
          <p className="text-xs font-semibold text-emerald-400">99.2%</p>
          <p className="text-[10px] text-zinc-600">success rate</p>
        </div>
      </div>
    </div>
  );
}

const features = [
  {
    icon: Zap,
    title: "Async render jobs",
    description:
      "Fire and forget. Submit a job, get an ID back immediately. We process it and push the result — no blocking HTTP.",
    demo: <AsyncJobsDemo />,
    span: "lg:col-span-2",
  },
  {
    icon: Webhook,
    title: "Webhook delivery",
    description:
      "Signed HMAC payloads pushed to your server the moment a job finishes. Or fails.",
    demo: <WebhookDemo />,
  },
  {
    icon: Layers,
    title: "Template library",
    description:
      "Store, version, and call your HTML templates by ID. One API call per render.",
    demo: <TemplatesDemo />,
  },
  {
    icon: Lock,
    title: "Signed download URLs",
    description:
      "Time-limited, credential-free download links. No proxy layer, no auth middleware.",
    demo: <SignedUrlDemo />,
    span: "lg:col-span-2",
  },
  {
    icon: Type,
    title: "Custom fonts",
    description:
      "Upload TTF or WOFF2. We embed and subset them in every render — zero config.",
    demo: <FontsDemo />,
  },
  {
    icon: BarChart2,
    title: "Usage analytics",
    description:
      "Track render volume, latency, and error rates per API key from the dashboard.",
    demo: <AnalyticsDemo />,
  },
];

export function FeaturesGrid() {
  return (
    <section className="bg-zinc-950 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <div className="mb-16 max-w-xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.15em] text-blue-400">
            Features
          </p>
          <h2 className="font-heading text-4xl font-extrabold leading-[1.05] tracking-[-0.03em] text-white sm:text-5xl">
            Everything you need.
            <br />
            <span className="text-zinc-500">Nothing you don&apos;t.</span>
          </h2>
          <p className="mt-5 text-base text-zinc-400">
            Built for developers who want to ship PDFs fast — not spend a sprint
            configuring a rendering pipeline.
          </p>
        </div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className={`group rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6 transition-all duration-300 hover:border-white/[0.12] hover:bg-white/[0.04] ${feature.span ?? ""}`}
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-blue-500/20 bg-blue-500/10">
                  <Icon className="h-4 w-4 text-blue-400" />
                </div>
                <h3 className="mt-4 text-sm font-semibold text-white">
                  {feature.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-zinc-500">
                  {feature.description}
                </p>
                {feature.demo}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
