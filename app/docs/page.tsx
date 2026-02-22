import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Zap, BookOpen, Code2, Layers, Webhook, BarChart2, Key } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = { title: "Documentation — Rendr" };

const quickLinks = [
  {
    icon: Zap,
    title: "Quick start",
    description: "Make your first PDF render in under 5 minutes.",
    href: "/docs/quick-start",
    badge: "Start here",
  },
  {
    icon: Code2,
    title: "API reference",
    description: "All endpoints, request bodies, responses, and error codes.",
    href: "/docs/api",
  },
  {
    icon: Layers,
    title: "Templates",
    description: "Store reusable HTML layouts and render with variables.",
    href: "/docs/templates",
  },
  {
    icon: BookOpen,
    title: "Webhooks & async",
    description: "Receive job events and verify HMAC signatures.",
    href: "/docs/api#webhooks",
  },
];

const features = [
  {
    icon: Zap,
    title: "Sync & async rendering",
    body: "POST /api/v1/convert waits up to 8 seconds and returns a download URL immediately. For large documents, POST /api/v1/convert-async returns a job_id instantly — poll or use webhooks.",
  },
  {
    icon: Layers,
    title: "HTML templates with variables",
    body: "Store reusable HTML layouts via the Templates API or the dashboard. Use {{variable_name}} placeholders — values are injected at render time per job.",
  },
  {
    icon: Webhook,
    title: "Webhooks",
    body: "Register a webhook URL to receive job.completed and job.failed events. All payloads are signed with HMAC-SHA256 using your webhook secret.",
  },
  {
    icon: Key,
    title: "API key auth",
    body: "Pass your key in Authorization: Bearer rk_live_... Only a SHA-256 hash is stored — the plaintext key is shown exactly once at creation.",
  },
  {
    icon: BarChart2,
    title: "Usage tracking",
    body: "GET /api/v1/usage returns today, last_7_days, and last_30_days render counts for your key. Usage is also visible in the dashboard.",
  },
  {
    icon: Code2,
    title: "Full PDF control",
    body: "Control paper size (A4, Letter, custom), margins, landscape, background printing, headers/footers, accessibility tagging, and a waitFor delay for JS-rendered pages.",
  },
];

const endpoints = [
  { method: "POST", path: "/api/v1/convert", description: "Synchronous render — waits up to 8 s" },
  { method: "POST", path: "/api/v1/convert-async", description: "Async render — returns job_id immediately" },
  { method: "GET",  path: "/api/v1/jobs/:id", description: "Poll job status and get pdf_url" },
  { method: "GET",  path: "/api/v1/files/:token", description: "Download the rendered PDF (no auth)" },
  { method: "GET",  path: "/api/v1/templates", description: "List your templates" },
  { method: "POST", path: "/api/v1/templates", description: "Create a template (name + HTML)" },
  { method: "PUT",  path: "/api/v1/templates/:id", description: "Update template name or HTML" },
  { method: "DELETE", path: "/api/v1/templates/:id", description: "Delete a template" },
  { method: "GET",  path: "/api/v1/webhooks", description: "List registered webhooks" },
  { method: "POST", path: "/api/v1/webhooks", description: "Register a webhook endpoint" },
  { method: "GET",  path: "/api/v1/usage", description: "Render counts (today / 7d / 30d)" },
  { method: "GET",  path: "/api/v1/health", description: "Health check — no auth required" },
];

const methodColors: Record<string, string> = {
  GET: "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  POST: "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  PUT: "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  DELETE: "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

export default function DocsPage() {
  return (
    <div className="space-y-14">
      {/* Header */}
      <div>
        <Badge variant="outline" className="mb-4 rounded-full text-xs">Documentation</Badge>
        <h1 className="text-3xl font-extrabold tracking-[-0.03em]">Rendr API Docs</h1>
        <p className="mt-3 max-w-2xl text-sm text-muted-foreground leading-relaxed">
          Rendr converts HTML to pixel-perfect PDFs via a REST API. Send raw HTML, a public URL, or
          a stored template — get a signed download link back. Works sync or async, with optional
          webhooks and variable substitution.
        </p>
        <p className="mt-2 text-xs text-muted-foreground">
          Base URL: <code className="rounded bg-muted px-1.5 py-0.5 font-mono">https://rendrpdf.com/api/v1</code>
          &nbsp;·&nbsp; API version: v1 &nbsp;·&nbsp; Updated: Feb 2026
        </p>
      </div>

      {/* Quick links */}
      <div>
        <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Get started</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {quickLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              <Card className="group h-full border-border transition-all hover:border-primary/30 hover:shadow-sm">
                <CardContent className="flex items-start gap-3 p-4">
                  <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <link.icon className="h-4 w-4 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold">{link.title}</p>
                      {link.badge && (
                        <Badge variant="secondary" className="rounded-full text-[10px] px-2">{link.badge}</Badge>
                      )}
                    </div>
                    <p className="mt-0.5 text-xs text-muted-foreground">{link.description}</p>
                  </div>
                  <ArrowRight className="ml-auto mt-0.5 h-4 w-4 shrink-0 text-muted-foreground/50 transition-transform group-hover:translate-x-1 group-hover:text-primary" />
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* How it works */}
      <div>
        <h2 className="mb-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground">How it works</h2>
        <p className="mb-5 text-xs text-muted-foreground">A render request goes through four stages:</p>
        <div className="flex flex-wrap items-center gap-2 text-sm">
          {["API request", "Job queued", "Chromium renders HTML", "PDF stored + webhook fired"].map((step, i, arr) => (
            <div key={step} className="flex items-center gap-2">
              <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/40 px-3 py-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">{i + 1}</span>
                <span className="text-xs font-medium">{step}</span>
              </div>
              {i < arr.length - 1 && <ArrowRight className="h-3.5 w-3.5 text-muted-foreground/40 shrink-0" />}
            </div>
          ))}
        </div>
        <p className="mt-4 text-xs text-muted-foreground leading-relaxed">
          The sync endpoint (<code className="rounded bg-muted px-1 py-0.5 font-mono text-[11px]">POST /convert</code>) polls internally for up to 8 seconds and returns the PDF URL directly.
          The async endpoint (<code className="rounded bg-muted px-1 py-0.5 font-mono text-[11px]">POST /convert-async</code>) returns a <code className="rounded bg-muted px-1 py-0.5 font-mono text-[11px]">job_id</code> immediately —
          you poll <code className="rounded bg-muted px-1 py-0.5 font-mono text-[11px]">GET /jobs/:id</code> or configure a webhook.
        </p>
      </div>

      {/* Features */}
      <div>
        <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">What&apos;s included</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div key={f.title} className="rounded-xl border border-border p-4">
              <div className="mb-2 flex h-7 w-7 items-center justify-center rounded-lg bg-muted">
                <f.icon className="h-3.5 w-3.5 text-muted-foreground" />
              </div>
              <p className="text-sm font-semibold">{f.title}</p>
              <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{f.body}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Endpoint index */}
      <div>
        <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">All endpoints</h2>
        <div className="overflow-hidden rounded-xl border border-border">
          {endpoints.map((ep, i) => (
            <Link key={ep.path} href="/docs/api">
              <div className={`flex items-center gap-3 px-4 py-2.5 hover:bg-muted/50 transition-colors ${i < endpoints.length - 1 ? "border-b border-border" : ""}`}>
                <span className={`shrink-0 rounded px-1.5 py-0.5 font-mono text-[10px] font-semibold ${methodColors[ep.method]}`}>
                  {ep.method}
                </span>
                <code className="font-mono text-xs text-foreground">{ep.path}</code>
                <span className="ml-auto text-xs text-muted-foreground hidden sm:block">{ep.description}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
