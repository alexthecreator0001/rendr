import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Zap, BookOpen, Code2, Layers } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { ImagePlaceholder } from "@/components/media/image-placeholder";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Documentation",
};

const quickLinks = [
  {
    icon: Zap,
    title: "Quick start",
    description: "Make your first render in 5 minutes.",
    href: "/docs/quick-start",
    badge: "Start here",
  },
  {
    icon: Code2,
    title: "API reference",
    description: "Full endpoint docs, request/response schemas, and error codes.",
    href: "/docs/api",
  },
  {
    icon: Layers,
    title: "Templates",
    description: "Store, version, and render HTML templates.",
    href: "/docs/templates",
  },
  {
    icon: BookOpen,
    title: "Guides",
    description: "Custom fonts, async jobs, webhook verification.",
    href: "/docs/api#guides",
  },
];

const popularEndpoints = [
  { method: "POST", path: "/v1/render", description: "Create a render job" },
  { method: "GET", path: "/v1/jobs/:id", description: "Get job status" },
  { method: "GET", path: "/v1/jobs/:id/download", description: "Download the PDF" },
  { method: "POST", path: "/v1/templates", description: "Upload a template" },
  { method: "GET", path: "/v1/templates", description: "List templates" },
];

const methodColors: Record<string, string> = {
  GET: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  POST: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
  DELETE: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  PATCH: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
};

export default function DocsPage() {
  return (
    <div className="space-y-12">
      {/* Header */}
      <div>
        <Badge variant="outline" className="mb-4 rounded-full text-xs">Documentation</Badge>
        <h1 className="text-3xl font-extrabold tracking-[-0.03em]">Rendr API Docs</h1>
        <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
          Everything you need to integrate Rendr into your stack. The API is REST-based,
          returns JSON, and authenticates with Bearer tokens.
        </p>
        <p className="mt-1.5 text-xs text-muted-foreground">
          Last updated: Feb 15, 2026 · API version: v1
        </p>
      </div>

      {/* Quick links */}
      <div>
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-muted-foreground">
          Get started
        </h2>
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
                      <p className="text-sm font-medium">{link.title}</p>
                      {link.badge && (
                        <Badge variant="secondary" className="rounded-full text-[10px] px-2">
                          {link.badge}
                        </Badge>
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

      {/* Architecture diagram */}
      <div>
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-muted-foreground">
          How it fits together
        </h2>
        {/* intended final asset: architecture diagram showing request → job queue → renderer → storage → webhook */}
        {/* suggested export format: SVG or PNG */}
        {/* exact size: 680×320, aspect: ~2/1 */}
        <ImagePlaceholder
          label="Architecture diagram: POST /render → Job queue → Renderer → Cloud storage → Webhook delivery (680×320)"
          aspect="2/1"
          rounded="xl"
          className="w-full"
        />
        <p className="mt-2 text-xs text-muted-foreground">
          Render requests are processed asynchronously. Jobs are queued, rendered in isolated workers, then stored. Results are pushed via webhook.
        </p>
      </div>

      {/* Popular endpoints */}
      <div>
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-muted-foreground">
          Popular endpoints
        </h2>
        <div className="overflow-hidden rounded-xl border border-border">
          {popularEndpoints.map((ep, i) => (
            <Link key={ep.path} href="/docs/api">
              <div
                className={`flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-colors ${i < popularEndpoints.length - 1 ? "border-b border-border" : ""}`}
              >
                <span className={`rounded px-1.5 py-0.5 font-mono text-[10px] font-semibold ${methodColors[ep.method]}`}>
                  {ep.method}
                </span>
                <code className="font-mono text-xs text-foreground">{ep.path}</code>
                <span className="ml-auto text-xs text-muted-foreground">{ep.description}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
