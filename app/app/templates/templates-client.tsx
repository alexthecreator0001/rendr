"use client";

import { useActionState, useState } from "react";
import {
  createTemplateAction,
  updateTemplateAction,
  deleteTemplateAction,
} from "@/app/actions/templates";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Plus, FileCode, Pencil, Trash2, ArrowRight, Eye,
  AlertTriangle,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type Template = { id: string; name: string; html: string; coverImageUrl: string | null; createdAt: Date; updatedAt: Date };

// ── Sample data for filling {{variables}} in previews ────────────────────────
const SAMPLE: Record<string, string> = {
  company_name: "Acme Corp",
  company_address: "123 Business Ave, New York, NY 10001",
  company_email: "hello@acme.com",
  client_name: "Jane Smith",
  client_address: "456 Client Street, Chicago, IL",
  invoice_number: "INV-2024-001",
  invoice_date: "January 15, 2024",
  due_date: "February 15, 2024",
  item_description: "Web Design & Development",
  item_qty: "1",
  item_rate: "$2,400.00",
  item_amount: "$2,400.00",
  subtotal: "$2,400.00",
  tax_rate: "10",
  tax_amount: "$240.00",
  total: "$2,640.00",
  payment_instructions: "Bank transfer to First National Bank, Account #4821-9920",
  business_name: "The Daily Grind",
  business_address: "789 Main Street, Austin, TX 78701",
  amount: "$42.50",
  receipt_number: "REC-2024-0042",
  date: "January 15, 2024",
  customer_name: "John Doe",
  payment_method: "Visa •••• 4242",
  cashier: "Emma",
  item: "2× Flat White, 1× Croissant",
  sender_name: "Alexandra Johnson",
  sender_title: "Chief Executive Officer",
  sender_address: "123 Corporate Way, Suite 400, San Francisco, CA",
  sender_email: "alex@company.com",
  recipient_name: "Robert Chen",
  recipient_title: "Director of Partnerships",
  recipient_address: "456 Executive Blvd, New York, NY",
  subject: "Strategic Partnership Opportunity",
  body: "I hope this letter finds you well. I am writing to propose a strategic partnership between our organizations that I believe would be mutually beneficial. Our teams have identified several compelling synergies that we are eager to explore further.",
  closing: "Warm regards",
  organization_name: "TechAcademy Institute",
  course_name: "Advanced Full-Stack Development",
  completion_date: "December 15, 2024",
  issuer_name: "Dr. Sarah Williams",
  issuer_title: "Program Director",
  project_name: "E-Commerce Platform Redesign",
  prepared_by: "Alexandra Johnson",
  timeline: "Q1 2025 — Q2 2025",
  investment: "$24,000",
  overview: "A comprehensive redesign of the existing e-commerce platform to improve conversion rates, mobile experience, and checkout flow across all devices.",
  scope: "Full-stack development including responsive design, payment integration, and analytics dashboard.",
  deliverables: "Production-ready web application, mobile-optimized interfaces, technical documentation, and 30-day post-launch support.",
  candidate_name: "Michael Brown",
  candidate_address: "789 Residential Ave, Seattle, WA 98101",
  position_title: "Senior Software Engineer",
  reporting_to: "VP of Engineering",
  start_date: "February 1, 2024",
  salary: "$140,000 / year",
  employment_type: "Full-time",
  offer_details: "This position includes comprehensive health benefits, 401(k) with 4% match, flexible remote work policy, and annual professional development budget of $2,500.",
  deadline: "January 20, 2024",
  hiring_manager_name: "Sarah Lee",
  hiring_manager_title: "Head of Engineering",
  provider_name: "Digital Studio LLC",
  effective_date: "January 1, 2024",
  sow_number: "SOW-2024-007",
  end_date: "April 15, 2024",
  total_fee: "$36,000",
  payment_terms: "Net 30 — 50% upfront, 50% on delivery",
  report_title: "Q4 2024 Sales Report",
  report_period: "October — December 2024",
  summary: "This quarter we achieved record revenue of $2.4M, exceeding our target by 12%. Customer acquisition costs decreased by 8% while retention improved to 94%.",
  kpi1_label: "Revenue", kpi1_value: "$2.4M", kpi1_change: "↑ 12%",
  kpi2_label: "New Users", kpi2_value: "14,200", kpi2_change: "↑ 8%",
  kpi3_label: "Orders", kpi3_value: "3,840", kpi3_change: "↑ 15%",
  kpi4_label: "Churn Rate", kpi4_value: "2.1%", kpi4_change: "↓ 0.3%",
  hl1_label: "New Clients", hl1_value: "24",
  hl2_label: "Avg Deal Size", hl2_value: "$8.2K",
  hl3_label: "NPS Score", hl3_value: "72",
  challenges: "Supply chain delays impacted Q4 delivery timelines. We are diversifying suppliers for Q1. Feature requests from enterprise clients require additional engineering resources.",
  sow_status: "Active",
};

function fillPreview(html: string): string {
  return html.replace(/\{\{\s*(\w+)\s*\}\}/g, (_, key: string) => {
    const val = SAMPLE[key.toLowerCase()];
    if (val) return val;
    // Smart fallback based on key hints
    if (/name$/.test(key)) return "John Smith";
    if (/email$/.test(key)) return "john@example.com";
    if (/date$/.test(key)) return "Jan 15, 2024";
    if (/address$/.test(key)) return "123 Main Street";
    if (/number|num$/.test(key)) return "001";
    if (/amount|total|fee|price$/.test(key)) return "$1,200.00";
    if (/title$/.test(key)) return "Manager";
    return key.replace(/_/g, " ");
  });
}

function extractVariables(html: string): string[] {
  const matches = [...html.matchAll(/\{\{\s*(\w+)\s*\}\}/g)];
  return [...new Set(matches.map((m) => m[1]))];
}

// ── Thumbnail ────────────────────────────────────────────────────────────────
function TemplateThumbnail({ html, name }: { html: string; name: string }) {
  const filled = fillPreview(html);
  return (
    <div className="relative overflow-hidden bg-white" style={{ height: 200 }}>
      <iframe
        srcDoc={filled}
        sandbox=""
        title={`Preview — ${name}`}
        className="absolute top-0 left-0 border-0 pointer-events-none select-none"
        style={{
          width: 900,
          height: 1200,
          transform: "scale(0.356)",
          transformOrigin: "top left",
        }}
      />
      {/* Bottom gradient fade */}
      <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-white/95 to-transparent" />
    </div>
  );
}

// ── Preview dialog ───────────────────────────────────────────────────────────
function PreviewDialog({ template }: { template: Template }) {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          className="flex h-7 w-7 items-center justify-center rounded-lg bg-black/60 backdrop-blur-sm transition-all hover:bg-black/80 border border-white/10"
          title="Preview"
        >
          <Eye className="h-3.5 w-3.5 text-white" />
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl h-[88vh] flex flex-col p-0 gap-0 overflow-hidden rounded-2xl">
        <DialogHeader className="px-6 py-4 border-b border-border shrink-0">
          <DialogTitle className="text-base">{template.name}</DialogTitle>
          <DialogDescription className="text-xs">Preview with sample data · no scripts run</DialogDescription>
        </DialogHeader>
        <div className="flex-1 overflow-hidden bg-white">
          <iframe
            srcDoc={fillPreview(template.html)}
            sandbox=""
            title={`Full preview — ${template.name}`}
            className="w-full h-full border-0"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ── Create dialog ────────────────────────────────────────────────────────────
function CreateDialog({ children }: { children?: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [state, action, pending] = useActionState(createTemplateAction, null);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children ?? (
          <Button size="sm" className="gap-1.5 rounded-lg">
            <Plus className="h-4 w-4" /> New template
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl rounded-2xl">
        <DialogHeader>
          <DialogTitle>New template</DialogTitle>
          <DialogDescription>
            Use{" "}
            <code className="font-mono text-[11px] bg-muted px-1 rounded">{"{{variable}}"}</code>{" "}
            placeholders for dynamic values.
          </DialogDescription>
        </DialogHeader>
        <form action={action} className="space-y-4 pt-1">
          {state?.error && (
            <div className="flex items-center gap-2 rounded-xl border border-destructive/30 bg-destructive/5 px-3.5 py-2.5 text-sm text-destructive">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              {state.error}
            </div>
          )}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Name</Label>
            <Input name="name" placeholder="Invoice, Statement of Work…" required className="rounded-xl" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">HTML</Label>
            <textarea
              name="html"
              rows={13}
              className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 font-mono text-xs leading-relaxed placeholder:text-muted-foreground/30 focus:outline-none focus:ring-2 focus:ring-ring resize-none"
              placeholder={"<!DOCTYPE html>\n<html>\n  <body>\n    <h1>{{title}}</h1>\n    <p>Dear {{name}},</p>\n  </body>\n</html>"}
              required
            />
          </div>
          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="rounded-lg">Cancel</Button>
            <Button type="submit" disabled={pending} className="rounded-lg">
              {pending ? "Creating…" : "Create template"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ── Edit dialog ──────────────────────────────────────────────────────────────
function EditDialog({ template }: { template: Template }) {
  const [open, setOpen] = useState(false);
  const [state, action, pending] = useActionState(updateTemplateAction, null);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          className="flex h-7 w-7 items-center justify-center rounded-lg bg-black/60 backdrop-blur-sm transition-all hover:bg-black/80 border border-white/10"
          title="Edit"
        >
          <Pencil className="h-3.5 w-3.5 text-white" />
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl rounded-2xl">
        <DialogHeader>
          <DialogTitle>Edit template</DialogTitle>
          <DialogDescription>Changes apply to future renders only.</DialogDescription>
        </DialogHeader>
        <form action={action} className="space-y-4 pt-1">
          {state?.error && (
            <div className="flex items-center gap-2 rounded-xl border border-destructive/30 bg-destructive/5 px-3.5 py-2.5 text-sm text-destructive">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              {state.error}
            </div>
          )}
          <input type="hidden" name="id" value={template.id} />
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Name</Label>
            <Input name="name" defaultValue={template.name} required className="rounded-xl" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">HTML</Label>
            <textarea
              name="html"
              rows={13}
              defaultValue={template.html}
              className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 font-mono text-xs leading-relaxed focus:outline-none focus:ring-2 focus:ring-ring resize-none"
              required
            />
          </div>
          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="rounded-lg">Cancel</Button>
            <Button type="submit" disabled={pending} className="rounded-lg">
              {pending ? "Saving…" : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ── Delete button ────────────────────────────────────────────────────────────
function DeleteButton({ id }: { id: string }) {
  const [, action, pending] = useActionState(deleteTemplateAction, null);
  return (
    <form action={action}>
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        disabled={pending}
        title="Delete"
        className="flex h-7 w-7 items-center justify-center rounded-lg bg-black/60 backdrop-blur-sm transition-all hover:bg-red-600/80 border border-white/10"
      >
        <Trash2 className={cn("h-3.5 w-3.5", pending ? "text-white/40" : "text-white")} />
      </button>
    </form>
  );
}

// ── Template card ────────────────────────────────────────────────────────────
function TemplateCard({ t }: { t: Template }) {
  const vars = extractVariables(t.html);
  const updatedAt = new Date(t.updatedAt).toLocaleDateString("en-US", {
    month: "short", day: "numeric",
  });

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-border/50 bg-card shadow-sm transition-all duration-200 hover:shadow-lg hover:shadow-black/20 hover:-translate-y-px dark:hover:shadow-black/50">

      {/* Thumbnail area */}
      <div className="relative overflow-hidden border-b border-border/30">
        {t.coverImageUrl ? (
          <img
            src={t.coverImageUrl}
            alt={t.name}
            className="w-full object-cover"
            style={{ height: 200 }}
          />
        ) : (
          <TemplateThumbnail html={t.html} name={t.name} />
        )}

        {/* Hover overlay buttons — top right */}
        <div className="absolute right-2.5 top-2.5 flex items-center gap-1.5 opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-150 ease-out">
          <PreviewDialog template={t} />
          <EditDialog template={t} />
          <DeleteButton id={t.id} />
        </div>

        {/* Open in Studio CTA — slides up from bottom */}
        <Link
          href={`/app/convert?template=${t.id}`}
          className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-1.5 bg-gradient-to-t from-black/70 via-black/30 to-transparent py-3 text-[12px] font-semibold text-white opacity-0 group-hover:opacity-100 transition-all duration-150"
        >
          Open in Studio <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* Card body */}
      <div className="flex items-center justify-between px-4 py-3 gap-3">
        <div className="min-w-0">
          <p className="font-semibold text-[13px] leading-tight truncate">{t.name}</p>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            {vars.length > 0 ? `${vars.length} variable${vars.length !== 1 ? "s" : ""}` : "Static"}
          </p>
        </div>
        <span className="shrink-0 text-[11px] text-muted-foreground/50 tabular-nums">{updatedAt}</span>
      </div>
    </div>
  );
}

// ── Empty state ──────────────────────────────────────────────────────────────
function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-28 text-center">
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-muted/50">
        <FileCode className="h-8 w-8 text-muted-foreground/25" />
      </div>
      <p className="text-[15px] font-semibold tracking-tight">No templates yet</p>
      <p className="mt-1.5 max-w-[280px] text-[13px] text-muted-foreground leading-relaxed">
        Templates let you reuse HTML layouts with{" "}
        <code className="font-mono text-[11px] bg-muted px-1 rounded">{"{{variable}}"}</code>{" "}
        substitution across all your renders.
      </p>
      <div className="mt-6">
        <CreateDialog>
          <Button size="sm" className="gap-1.5 rounded-xl px-5 h-9">
            <Plus className="h-4 w-4" /> Create your first template
          </Button>
        </CreateDialog>
      </div>
    </div>
  );
}

// ── Main export ──────────────────────────────────────────────────────────────
export function TemplatesClient({ templates }: { templates: Template[] }) {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-semibold tracking-tight">Templates</h1>
          <p className="mt-0.5 text-[13px] text-muted-foreground">
            {templates.length > 0
              ? `${templates.length} template${templates.length !== 1 ? "s" : ""}`
              : "Reusable HTML layouts with variable substitution"}
          </p>
        </div>
        {templates.length > 0 && (
          <CreateDialog>
            <Button size="sm" className="gap-1.5 rounded-lg shrink-0">
              <Plus className="h-4 w-4" /> New template
            </Button>
          </CreateDialog>
        )}
      </div>

      {templates.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {templates.map((t) => (
            <TemplateCard key={t.id} t={t} />
          ))}
        </div>
      )}

      {/* AI templates blog banner */}
      <div className="mt-8 rounded-2xl bg-gradient-to-br from-violet-600 to-blue-600 p-6 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <p className="font-semibold text-white">New to templates?</p>
          <p className="text-sm text-white/70 mt-0.5">
            Learn how to build templates with AI — includes a ready-made ChatGPT prompt.
          </p>
        </div>
        <a
          href="/blog/how-to-create-templates"
          className="shrink-0 rounded-lg bg-white/15 hover:bg-white/25 px-4 py-2 text-sm font-medium text-white transition-colors"
        >
          Read the guide →
        </a>
      </div>
    </div>
  );
}
