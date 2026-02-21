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
  Plus, FileCode, Pencil, Trash2, Braces, ArrowRight, Eye,
  AlertTriangle,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type Template = { id: string; name: string; html: string; createdAt: Date; updatedAt: Date };

function extractVariables(html: string): string[] {
  const matches = [...html.matchAll(/\{\{\s*(\w+)\s*\}\}/g)];
  return [...new Set(matches.map((m) => m[1]))];
}

// ── Thumbnail ────────────────────────────────────────────────────────────────
function TemplateThumbnail({ html, name }: { html: string; name: string }) {
  return (
    <div
      className="relative overflow-hidden bg-white dark:bg-zinc-50"
      style={{ height: 180 }}
    >
      <iframe
        srcDoc={html}
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
      <div className="absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-white dark:from-zinc-50 to-transparent" />
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
          className="flex h-7 w-7 items-center justify-center rounded-lg bg-background/90 shadow-sm backdrop-blur-sm transition-all hover:bg-background"
          title="Preview"
        >
          <Eye className="h-3.5 w-3.5 text-foreground/70" />
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl h-[88vh] flex flex-col p-0 gap-0 overflow-hidden rounded-2xl">
        <DialogHeader className="px-6 py-4 border-b border-border shrink-0">
          <DialogTitle className="text-base">{template.name}</DialogTitle>
          <DialogDescription className="text-xs">Read-only preview · no scripts run</DialogDescription>
        </DialogHeader>
        <div className="flex-1 overflow-hidden bg-white dark:bg-zinc-50">
          <iframe
            srcDoc={template.html}
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
          className="flex h-7 w-7 items-center justify-center rounded-lg bg-background/90 shadow-sm backdrop-blur-sm transition-all hover:bg-background"
          title="Edit"
        >
          <Pencil className="h-3.5 w-3.5 text-foreground/70" />
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
        className="flex h-7 w-7 items-center justify-center rounded-lg bg-background/90 shadow-sm backdrop-blur-sm transition-all hover:bg-background"
      >
        <Trash2 className={cn("h-3.5 w-3.5", pending ? "text-muted-foreground/50" : "text-destructive/70")} />
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
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-border/50 bg-card shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-all duration-200 hover:border-border/80 hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)] dark:hover:shadow-[0_4px_16px_rgba(0,0,0,0.4)]">

      {/* Thumbnail */}
      <div className="relative overflow-hidden border-b border-border/40">
        <TemplateThumbnail html={t.html} name={t.name} />

        {/* Hover action buttons */}
        <div className="absolute right-2.5 top-2.5 flex items-center gap-1.5 opacity-0 translate-y-[-2px] group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-150 ease-out">
          <PreviewDialog template={t} />
          <EditDialog template={t} />
          <DeleteButton id={t.id} />
        </div>

        {/* "Use in Studio" link — slides up from bottom on hover */}
        <Link
          href={`/app/convert?template=${t.id}`}
          className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-1.5 bg-gradient-to-t from-black/50 via-black/20 to-transparent py-2.5 text-[11px] font-medium text-white opacity-0 group-hover:opacity-100 transition-opacity duration-150"
        >
          Open in Studio <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      {/* Card body */}
      <div className="flex flex-1 flex-col px-4 py-3.5">
        <div className="flex items-center justify-between gap-2 mb-2">
          <p className="font-semibold text-[13px] leading-tight truncate">{t.name}</p>
          <span className="shrink-0 text-[10px] text-muted-foreground/50">{updatedAt}</span>
        </div>

        {vars.length > 0 ? (
          <div className="flex flex-wrap gap-1">
            {vars.slice(0, 5).map((v) => (
              <span
                key={v}
                className="inline-flex items-center gap-[3px] rounded-full bg-muted px-2 py-[2px] font-mono text-[10px] text-muted-foreground"
              >
                <Braces className="h-2.5 w-2.5 opacity-50" />
                {v}
              </span>
            ))}
            {vars.length > 5 && (
              <span className="rounded-full bg-muted px-2 py-[2px] text-[10px] text-muted-foreground/60">
                +{vars.length - 5}
              </span>
            )}
          </div>
        ) : (
          <p className="text-[11px] text-muted-foreground/40">Static · no variables</p>
        )}
      </div>
    </div>
  );
}

// ── Empty state ──────────────────────────────────────────────────────────────
function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
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
    </div>
  );
}
