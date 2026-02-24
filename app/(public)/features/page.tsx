import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import Link from "next/link";
import {
  Zap,
  Webhook,
  Layers,
  Type,
  FileText,
  Globe,
  Lock,
  Timer,
  MousePointerClick,
  Merge,
  Stamp,
  FileSignature,
  Network,
  BarChart2,
  Key,
  Repeat,
  Shield,
  MonitorSmartphone,
  Palette,
  Users,
  CreditCard,
  CheckCircle2,
  ArrowRight,
  Code2,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Features",
  description: "Everything Rendr can do — in plain language.",
};

/* ── Highlight stats shown below hero ── */
const stats = [
  { value: "< 1s", label: "Avg render time" },
  { value: "99.9%", label: "Uptime SLA" },
  { value: "24+", label: "API features" },
  { value: "3", label: "Lines to integrate" },
];

export default function FeaturesPage() {
  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-zinc-950 pt-24 pb-20 sm:pt-32 sm:pb-28">
        {/* Subtle gradient orb */}
        <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/3 h-[600px] w-[800px] rounded-full bg-blue-500/[0.07] blur-[120px]" />

        <Container className="relative">
          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-5 text-sm font-semibold uppercase tracking-[0.15em] text-blue-400">
              Features
            </p>
            <h1 className="text-4xl font-extrabold tracking-[-0.03em] text-white sm:text-5xl lg:text-6xl">
              One API for every PDF workflow
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-lg text-zinc-400 leading-relaxed">
              HTML to PDF, URL to PDF, merge, watermark, metadata — all via a
              simple REST call. No headless browser to manage, no infrastructure
              to maintain.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/register"
                className="inline-flex h-11 items-center gap-2 rounded-full bg-white px-6 text-sm font-medium text-zinc-900 shadow-sm transition-colors hover:bg-zinc-100"
              >
                Get started free
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/docs"
                target="_blank"
                className="inline-flex h-11 items-center gap-2 rounded-full border border-white/10 px-6 text-sm font-medium text-zinc-300 transition-colors hover:border-white/20 hover:text-white"
              >
                <Code2 className="h-4 w-4" />
                Read the docs
              </Link>
            </div>
          </div>

          {/* Stats bar */}
          <div className="mx-auto mt-16 grid max-w-2xl grid-cols-2 gap-px rounded-2xl border border-white/[0.06] bg-white/[0.03] sm:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="px-6 py-5 text-center">
                <p className="text-2xl font-bold tracking-tight text-white">{s.value}</p>
                <p className="mt-1 text-xs text-zinc-500">{s.label}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── How it works ─────────────────────────────────────────────── */}
      <section className="border-b border-white/[0.06] bg-zinc-950 py-20 sm:py-24">
        <Container>
          <div className="mx-auto max-w-5xl">
            <div className="mb-16 max-w-xl">
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.15em] text-emerald-400">
                How it works
              </p>
              <h2 className="text-3xl font-extrabold tracking-[-0.03em] text-white sm:text-4xl">
                From HTML to PDF in one call
              </h2>
              <p className="mt-4 text-base text-zinc-400 leading-relaxed">
                No setup, no infrastructure. Send a request, get a PDF.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-16 lg:items-start">
              {/* Left — steps */}
              <div className="relative space-y-0">
                {[
                  {
                    step: "1",
                    title: "Send your content",
                    desc: "POST raw HTML, a live URL, or a stored template name to the /convert endpoint. Pass any PDF options — format, margins, watermarks, metadata.",
                    accent: "border-blue-500/40 bg-blue-500/10 text-blue-400",
                    line: "from-blue-500/40 to-violet-500/40",
                  },
                  {
                    step: "2",
                    title: "Chromium renders it",
                    desc: "Headless Chromium loads your content with full CSS, JS, and web font support. We handle the queue, timeouts, and retries.",
                    accent: "border-violet-500/40 bg-violet-500/10 text-violet-400",
                    line: "from-violet-500/40 to-emerald-500/40",
                  },
                  {
                    step: "3",
                    title: "Get the PDF back",
                    desc: "Download inline (sync), poll the status URL, or receive a webhook the moment it's ready. Your choice.",
                    accent: "border-emerald-500/40 bg-emerald-500/10 text-emerald-400",
                    line: "",
                  },
                ].map((s, i) => (
                  <div key={s.step} className="relative flex gap-5 pb-10 last:pb-0">
                    {/* Vertical connector line */}
                    <div className="flex flex-col items-center">
                      <span className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border text-sm font-bold ${s.accent}`}>
                        {s.step}
                      </span>
                      {i < 2 && (
                        <div className={`mt-1 h-full w-px bg-gradient-to-b ${s.line}`} />
                      )}
                    </div>
                    {/* Text */}
                    <div className="pt-1.5">
                      <h3 className="text-base font-semibold text-white">{s.title}</h3>
                      <p className="mt-1.5 text-[13px] leading-relaxed text-zinc-500">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Right — code example */}
              <div className="rounded-2xl border border-white/[0.06] bg-zinc-900/60 overflow-hidden">
                {/* Tab bar */}
                <div className="flex items-center gap-1 border-b border-white/[0.06] px-4 py-2.5">
                  <span className="rounded-md bg-white/[0.08] px-2.5 py-1 text-[11px] font-medium text-white">cURL</span>
                  <span className="rounded-md px-2.5 py-1 text-[11px] font-medium text-zinc-600">Node.js</span>
                  <span className="rounded-md px-2.5 py-1 text-[11px] font-medium text-zinc-600">Python</span>
                </div>
                {/* Code */}
                <div className="p-5 font-mono text-[12px] leading-[1.7]">
                  <pre className="overflow-x-auto"><code><span className="text-emerald-400">curl</span>{" "}<span className="text-zinc-500">-X POST</span>{" "}<span className="text-blue-400">https://rendrpdf.com/api/v1/convert</span>{" \\\n  "}<span className="text-zinc-500">-H</span>{" "}<span className="text-amber-300">{'"Authorization: Bearer rk_live_..."'}</span>{" \\\n  "}<span className="text-zinc-500">-H</span>{" "}<span className="text-amber-300">{'"Content-Type: application/json"'}</span>{" \\\n  "}<span className="text-zinc-500">-d</span>{" "}<span className="text-amber-300">{"'"}</span>
<span className="text-zinc-400">{"{"}</span>
<span className="text-zinc-400">{"  "}</span><span className="text-emerald-400">{'"input"'}</span><span className="text-zinc-400">:</span>{" "}{"{"}{" "}<span className="text-emerald-400">{'"type"'}</span><span className="text-zinc-400">:</span>{" "}<span className="text-amber-300">{'"html"'}</span><span className="text-zinc-400">,</span>{" "}<span className="text-emerald-400">{'"html"'}</span><span className="text-zinc-400">:</span>{" "}<span className="text-amber-300">{'"<h1>Invoice #42</h1>"'}</span>{" "},
<span className="text-zinc-400">{"  "}</span><span className="text-emerald-400">{'"options"'}</span><span className="text-zinc-400">:</span>{" "}{"{"}{" "}<span className="text-emerald-400">{'"format"'}</span><span className="text-zinc-400">:</span>{" "}<span className="text-amber-300">{'"A4"'}</span><span className="text-zinc-400">,</span>{" "}<span className="text-emerald-400">{'"margin"'}</span><span className="text-zinc-400">:</span>{" "}<span className="text-amber-300">{'"20mm"'}</span>{" }{"}"}
<span className="text-zinc-400">{"}"}</span><span className="text-amber-300">{"'"}</span></code></pre>
                </div>
                {/* Response preview */}
                <div className="border-t border-white/[0.06] px-5 py-3.5 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-5 items-center rounded-full bg-emerald-500/15 px-2 text-[10px] font-semibold text-emerald-400">200</span>
                    <span className="text-[11px] text-zinc-500">application/json · 340ms</span>
                  </div>
                  <span className="font-mono text-[11px] text-zinc-600">{"{ pdf_url, job_id, pages }"}</span>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ── All capabilities ───────────────────────────────────────────── */}
      <section className="bg-zinc-950 py-24 sm:py-32">
        <Container>
          <div className="mb-14 max-w-xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.15em] text-blue-400">
              Capabilities
            </p>
            <h2 className="text-3xl font-extrabold tracking-[-0.03em] text-white sm:text-4xl">
              Everything in one API
            </h2>
            <p className="mt-4 text-base text-zinc-400 leading-relaxed">
              Every feature a production PDF service needs — from rendering to
              post-processing to delivery. All available via a single REST API.
            </p>
          </div>

          {/* Category grid */}
          <div className="space-y-16">

            {/* ── Rendering ── */}
            <div>
              <h3 className="mb-6 text-xs font-semibold uppercase tracking-[0.15em] text-zinc-500">
                Rendering
              </h3>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {([
                  { icon: FileText,            title: "HTML to PDF",          desc: "Send raw HTML, get a pixel-perfect PDF back. Full CSS support, web fonts, flexbox, grid." },
                  { icon: Globe,               title: "URL to PDF",           desc: "Point us at any URL. We load it in headless Chromium and capture the fully rendered page." },
                  { icon: Layers,              title: "Template rendering",   desc: "Store HTML templates with {{variables}}. Render them with different data each time." },
                  { icon: Timer,               title: "Render delay",         desc: "Wait 0–10 seconds for JavaScript to execute before capturing. For SPAs and dynamic charts." },
                  { icon: MousePointerClick,   title: "waitForSelector",      desc: "Wait for a specific CSS selector to appear in the DOM before capture. More precise than a fixed delay." },
                  { icon: Network,             title: "Custom HTTP headers",  desc: "Pass Authorization, Cookie, or any custom headers when rendering URLs behind authentication." },
                ] as const).map((f) => (
                  <div key={f.title} className="group flex gap-4 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 transition-colors hover:border-white/[0.1] hover:bg-white/[0.04]">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-blue-500/20 bg-blue-500/10">
                      <f.icon className="h-4 w-4 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{f.title}</p>
                      <p className="mt-1 text-[13px] leading-relaxed text-zinc-500">{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Post-processing ── */}
            <div>
              <h3 className="mb-6 text-xs font-semibold uppercase tracking-[0.15em] text-zinc-500">
                Post-processing
              </h3>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {([
                  { icon: Merge,          title: "PDF merge",         desc: "Combine 2–50 existing PDFs into a single document in one API call. Preserves page order." },
                  { icon: Stamp,          title: "Watermark",         desc: "Overlay text on every page. Customize color, opacity, font size, and rotation. Great for DRAFT or CONFIDENTIAL stamps." },
                  { icon: FileSignature,  title: "PDF metadata",      desc: "Set title, author, subject, and keywords. Shows up in File > Properties in every PDF viewer." },
                  { icon: FileText,       title: "Custom filename",   desc: "Control the download filename. No more rendr-cm7abc123.pdf — name it invoice-42.pdf instead." },
                  { icon: Palette,        title: "Full PDF options",  desc: "Format, margins, orientation, scale, page ranges, headers/footers, tagged PDF, outline — everything Chromium supports." },
                  { icon: Type,           title: "Custom fonts",      desc: "Use any Google Font or self-hosted TTF/WOFF2. Chromium renders them natively — consistent across all viewers." },
                ] as const).map((f) => (
                  <div key={f.title} className="group flex gap-4 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 transition-colors hover:border-white/[0.1] hover:bg-white/[0.04]">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-violet-500/20 bg-violet-500/10">
                      <f.icon className="h-4 w-4 text-violet-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{f.title}</p>
                      <p className="mt-1 text-[13px] leading-relaxed text-zinc-500">{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Delivery & Integration ── */}
            <div>
              <h3 className="mb-6 text-xs font-semibold uppercase tracking-[0.15em] text-zinc-500">
                Delivery & integration
              </h3>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {([
                  { icon: Zap,       title: "Sync & async modes",   desc: "POST /convert waits up to 8s for a result. POST /convert-async returns immediately — poll or use webhooks." },
                  { icon: Webhook,   title: "Webhook delivery",     desc: "HMAC-signed payloads pushed to your server on job.completed and job.failed. Retries with exponential backoff." },
                  { icon: Webhook,   title: "Per-job webhooks",     desc: "Pass a webhook_url on any render for a one-off notification. No permanent endpoint setup required." },
                  { icon: Lock,      title: "Signed download URLs", desc: "Credential-free download links. Share them directly — no auth middleware needed to download the PDF." },
                  { icon: Repeat,    title: "Idempotency",          desc: "Pass an idempotency key to prevent duplicate renders. Safe retries for invoices and critical documents." },
                  { icon: BarChart2, title: "Usage analytics",      desc: "Track render volume, latency, and success rates per API key. Usage warnings at 80% and 100% of your plan." },
                ] as const).map((f) => (
                  <div key={f.title} className="group flex gap-4 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 transition-colors hover:border-white/[0.1] hover:bg-white/[0.04]">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-emerald-500/20 bg-emerald-500/10">
                      <f.icon className="h-4 w-4 text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{f.title}</p>
                      <p className="mt-1 text-[13px] leading-relaxed text-zinc-500">{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Platform ── */}
            <div>
              <h3 className="mb-6 text-xs font-semibold uppercase tracking-[0.15em] text-zinc-500">
                Platform
              </h3>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {([
                  { icon: Key,                 title: "API key management",  desc: "Create, rotate, and revoke keys from the dashboard. SHA-256 hashed — we never store the plaintext." },
                  { icon: Shield,              title: "Security built-in",   desc: "SSRF protection, DNS pinning, input validation, rate limiting, HTML escaping — all on by default." },
                  { icon: Users,               title: "Teams",               desc: "Invite collaborators, share templates and API keys. Team-scoped billing and usage tracking." },
                  { icon: MonitorSmartphone,    title: "Studio UI",           desc: "Visual PDF playground in the dashboard. Test URL, HTML, and template renders with a live inspector." },
                  { icon: CreditCard,          title: "Usage-based billing",  desc: "Free tier with 100 renders/month. Growth and Business plans for higher volumes. No per-page fees." },
                  { icon: CheckCircle2,        title: "99.9% uptime",        desc: "Deployed on dedicated infrastructure with PM2 process management, health checks, and auto-restart." },
                ] as const).map((f) => (
                  <div key={f.title} className="group flex gap-4 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 transition-colors hover:border-white/[0.1] hover:bg-white/[0.04]">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-amber-500/20 bg-amber-500/10">
                      <f.icon className="h-4 w-4 text-amber-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{f.title}</p>
                      <p className="mt-1 text-[13px] leading-relaxed text-zinc-500">{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </Container>
      </section>

      {/* ── CTA ────────────────────────────────────────────────────────── */}
      <section className="bg-zinc-950 py-20 sm:py-24">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-extrabold tracking-[-0.03em] text-white sm:text-4xl">
              Ready to start rendering?
            </h2>
            <p className="mt-4 text-base text-zinc-400 leading-relaxed">
              Free tier includes 100 renders/month. No credit card required.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/register"
                className="inline-flex h-11 items-center gap-2 rounded-full bg-white px-6 text-sm font-medium text-zinc-900 shadow-sm transition-colors hover:bg-zinc-100"
              >
                Create free account
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/pricing"
                className="inline-flex h-11 items-center gap-2 rounded-full border border-white/10 px-6 text-sm font-medium text-zinc-300 transition-colors hover:border-white/20 hover:text-white"
              >
                View pricing
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
