import {
  Zap, Webhook, Layers, FileText, Lock,
  Globe, Merge, Stamp, BarChart2,
} from "lucide-react";

/* ── Mini demos inside each card (kept dark for code readability) ── */

function AsyncDemo() {
  return (
    <div className="dark mt-4 rounded-xl border border-white/[0.06] bg-zinc-950 p-4 font-mono text-[11.5px] leading-[1.8]">
      <div className="flex items-center justify-between">
        <span className="text-zinc-600">mode</span>
        <span className="text-zinc-300">async</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-zinc-600">status</span>
        <span className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-blue-400" />
          <span className="text-blue-400">processing</span>
        </span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-zinc-600">job_id</span>
        <span className="text-zinc-400">job_7f3k2m</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-zinc-600">duration</span>
        <span className="text-zinc-400">843ms</span>
      </div>
    </div>
  );
}

function WebhookDemo() {
  return (
    <div className="dark mt-4 rounded-xl border border-white/[0.06] bg-zinc-950 p-4 font-mono text-[11px] leading-[1.8]">
      <div className="mb-2 text-zinc-600">
        POST <span className="text-zinc-400">your-server.com/webhook</span>
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
    <div className="dark mt-4 space-y-2">
      {tpls.map((t) => (
        <div
          key={t.id}
          className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-zinc-950 px-4 py-2.5"
        >
          <span className="font-mono text-[11.5px] text-zinc-400">{t.id}</span>
          <span className={`rounded-full border px-2 py-0.5 text-[10px] font-medium ${tagColors[t.tag]}`}>
            {t.tag}
          </span>
        </div>
      ))}
    </div>
  );
}

function HtmlUrlDemo() {
  return (
    <div className="dark mt-4 rounded-xl border border-white/[0.06] bg-zinc-950 p-4 font-mono text-[11px] leading-[1.8]">
      <div className="flex items-center justify-between">
        <span className="text-zinc-600">input.type</span>
        <span className="text-blue-400">&quot;html&quot;</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-zinc-600">format</span>
        <span className="text-zinc-300">A4</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-zinc-600">pages</span>
        <span className="text-zinc-300">2</span>
      </div>
      <div className="mt-2 border-t border-white/[0.04] pt-2">
        <div className="flex items-center justify-between">
          <span className="text-zinc-600">input.type</span>
          <span className="text-violet-400">&quot;url&quot;</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-zinc-600">url</span>
          <span className="text-zinc-400 truncate ml-4">https://app.example.com/report</span>
        </div>
      </div>
    </div>
  );
}

function SignedUrlDemo() {
  return (
    <div className="dark mt-4 rounded-xl border border-white/[0.06] bg-zinc-950 p-4">
      <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-zinc-600">
        Signed download URL
      </p>
      <p className="break-all font-mono text-[10.5px] leading-[1.7] text-zinc-400">
        <span className="text-zinc-600">https://cdn.rendrpdf.com</span>
        <span className="text-white">/files/job_7f3k2m</span>
        <span className="text-zinc-600">?token=</span>
        <span className="text-blue-400">rk_dl_••••••••</span>
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

function MergeDemo() {
  return (
    <div className="dark mt-4 rounded-xl border border-white/[0.06] bg-zinc-950 p-4 font-mono text-[11px] leading-[1.8]">
      <div className="mb-2 text-zinc-600">
        POST <span className="text-zinc-400">/api/v1/merge</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-zinc-600">files</span>
        <span className="text-zinc-300">3 PDFs</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-zinc-600">pages</span>
        <span className="text-emerald-400">12 total</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-zinc-600">status</span>
        <span className="text-emerald-400">merged</span>
      </div>
    </div>
  );
}

function WatermarkDemo() {
  return (
    <div className="dark mt-4 rounded-xl border border-white/[0.06] bg-zinc-950 p-4 relative overflow-hidden">
      {/* Simulated watermark text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <span className="text-white/[0.06] text-3xl font-bold -rotate-45 select-none tracking-widest">
          DRAFT
        </span>
      </div>
      <div className="relative font-mono text-[11px] leading-[1.8]">
        <div className="flex items-center justify-between">
          <span className="text-zinc-600">text</span>
          <span className="text-zinc-300">&quot;DRAFT&quot;</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-zinc-600">opacity</span>
          <span className="text-zinc-400">0.15</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-zinc-600">rotation</span>
          <span className="text-zinc-400">-45°</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-zinc-600">fontSize</span>
          <span className="text-zinc-400">72px</span>
        </div>
      </div>
    </div>
  );
}

function AnalyticsDemo() {
  return (
    <div className="dark mt-4 rounded-xl border border-white/[0.06] bg-zinc-950 p-4 space-y-3">
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

function MetadataDemo() {
  return (
    <div className="dark mt-4 rounded-xl border border-white/[0.06] bg-zinc-950 p-4 font-mono text-[11px] leading-[1.8]">
      <div className="flex items-center justify-between">
        <span className="text-zinc-600">title</span>
        <span className="text-zinc-300">&quot;Invoice #1042&quot;</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-zinc-600">author</span>
        <span className="text-zinc-400">&quot;Acme Corp&quot;</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-zinc-600">filename</span>
        <span className="text-blue-400">invoice-1042.pdf</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-zinc-600">keywords</span>
        <span className="text-zinc-400">&quot;invoice, billing&quot;</span>
      </div>
    </div>
  );
}

const features = [
  {
    icon: FileText,
    title: "HTML & URL to PDF",
    description:
      "Send raw HTML or point us at any URL. Full Chromium rendering — CSS grid, flexbox, web fonts, JavaScript. Pixel-perfect.",
    demo: <HtmlUrlDemo />,
  },
  {
    icon: Zap,
    title: "Sync & async modes",
    description:
      "Sync returns the PDF in one call. Async fires a webhook when it's ready. Built-in queue, retries, and status polling.",
    demo: <AsyncDemo />,
  },
  {
    icon: Webhook,
    title: "Webhook delivery",
    description:
      "HMAC-signed payloads pushed to your server on completion or failure. Exponential backoff retries. Per-job overrides.",
    demo: <WebhookDemo />,
  },
  {
    icon: Layers,
    title: "Template library",
    description:
      "Store HTML templates with {{variables}}. Render them with different data per call. Manage via API or dashboard.",
    demo: <TemplatesDemo />,
  },
  {
    icon: Lock,
    title: "Signed download URLs",
    description:
      "Time-limited, credential-free download links. Share directly — no proxy layer or auth middleware needed.",
    demo: <SignedUrlDemo />,
  },
  {
    icon: Merge,
    title: "PDF merge",
    description:
      "Combine 2–50 PDFs into one document in a single API call. Preserves page order. Add metadata to the result.",
    demo: <MergeDemo />,
  },
  {
    icon: Stamp,
    title: "Watermarks",
    description:
      "Overlay text on every page. Customize color, opacity, font size, and rotation. Perfect for DRAFT or CONFIDENTIAL stamps.",
    demo: <WatermarkDemo />,
  },
  {
    icon: Globe,
    title: "Metadata & filenames",
    description:
      "Set PDF title, author, subject, keywords, and download filename. No more random hashes — name it invoice-42.pdf.",
    demo: <MetadataDemo />,
  },
  {
    icon: BarChart2,
    title: "Usage analytics",
    description:
      "Track render volume, latency, and success rates per API key. Usage alerts at 80% of your plan limit.",
    demo: <AnalyticsDemo />,
  },
];

export function FeaturesGrid() {
  return (
    <section className="bg-background py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <div className="mb-16 max-w-xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.15em] text-primary">
            Features
          </p>
          <h2 className="font-heading text-4xl font-extrabold leading-[1.05] tracking-[-0.03em] text-foreground sm:text-5xl">
            Everything you need.
            <br />
            <span className="text-muted-foreground">Nothing you don&apos;t.</span>
          </h2>
          <p className="mt-5 text-base text-muted-foreground">
            Built for developers who want to ship PDFs fast — not spend a sprint
            configuring a rendering pipeline.
          </p>
        </div>

        {/* 3×3 Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="group rounded-2xl border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:border-border hover:bg-muted/50"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-blue-500/20 bg-blue-500/10">
                  <Icon className="h-4 w-4 text-blue-400" />
                </div>
                <h3 className="mt-4 text-sm font-semibold text-foreground">
                  {feature.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
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
