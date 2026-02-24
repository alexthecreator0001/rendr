"use client";

import { useActionState, useState } from "react";
import {
  createTeamTemplateAction,
  updateTeamTemplateAction,
  deleteTeamTemplateAction,
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

function extractVariables(html: string): string[] {
  const matches = [...html.matchAll(/\{\{\s*(\w+)\s*\}\}/g)];
  return [...new Set(matches.map((m) => m[1]))];
}

function fillPreview(html: string): string {
  return html.replace(/\{\{\s*(\w+)\s*\}\}/g, (_, key: string) => {
    return key.replace(/_/g, " ");
  });
}

function TemplateThumbnail({ html, name }: { html: string; name: string }) {
  const filled = fillPreview(html);
  return (
    <div className="relative overflow-hidden bg-white" style={{ height: 200 }}>
      <iframe
        srcDoc={filled}
        sandbox=""
        title={`Preview — ${name}`}
        className="absolute top-0 left-0 border-0 pointer-events-none select-none"
        style={{ width: 900, height: 1200, transform: "scale(0.356)", transformOrigin: "top left" }}
      />
      <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-white/95 to-transparent" />
    </div>
  );
}

function PreviewDialog({ template }: { template: Template }) {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="flex h-7 w-7 items-center justify-center rounded-lg bg-black/60 backdrop-blur-sm transition-all hover:bg-black/80 border border-white/10" title="Preview">
          <Eye className="h-3.5 w-3.5 text-white" />
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl h-[88vh] flex flex-col p-0 gap-0 overflow-hidden rounded-2xl">
        <DialogHeader className="px-6 py-4 border-b border-border shrink-0">
          <DialogTitle className="text-base">{template.name}</DialogTitle>
          <DialogDescription className="text-xs">Preview with sample data</DialogDescription>
        </DialogHeader>
        <div className="flex-1 overflow-hidden bg-white">
          <iframe srcDoc={fillPreview(template.html)} sandbox="" title={`Full preview — ${template.name}`} className="w-full h-full border-0" />
        </div>
      </DialogContent>
    </Dialog>
  );
}

function CreateDialog({ teamId, children }: { teamId: string; children?: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [state, action, pending] = useActionState(createTeamTemplateAction, null);

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
          <DialogTitle>New team template</DialogTitle>
          <DialogDescription>
            Use <code className="font-mono text-[11px] bg-muted px-1 rounded">{"{{variable}}"}</code> placeholders for dynamic values.
          </DialogDescription>
        </DialogHeader>
        <form action={action} className="space-y-4 pt-1">
          <input type="hidden" name="teamId" value={teamId} />
          {state?.error && (
            <div className="flex items-center gap-2 rounded-xl border border-destructive/30 bg-destructive/5 px-3.5 py-2.5 text-sm text-destructive">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              {state.error}
            </div>
          )}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Name</Label>
            <Input name="name" placeholder="Invoice, Statement of Work\u2026" required className="rounded-xl" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">HTML</Label>
            <textarea
              name="html"
              rows={13}
              className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 font-mono text-xs leading-relaxed placeholder:text-muted-foreground/30 focus:outline-none focus:ring-2 focus:ring-ring resize-none"
              placeholder={"<!DOCTYPE html>\n<html>\n  <body>\n    <h1>{{title}}</h1>\n  </body>\n</html>"}
              required
            />
          </div>
          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="rounded-lg">Cancel</Button>
            <Button type="submit" disabled={pending} className="rounded-lg">
              {pending ? "Creating\u2026" : "Create template"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function EditDialog({ template, teamId }: { template: Template; teamId: string }) {
  const [open, setOpen] = useState(false);
  const [state, action, pending] = useActionState(updateTeamTemplateAction, null);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="flex h-7 w-7 items-center justify-center rounded-lg bg-black/60 backdrop-blur-sm transition-all hover:bg-black/80 border border-white/10" title="Edit">
          <Pencil className="h-3.5 w-3.5 text-white" />
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl rounded-2xl">
        <DialogHeader>
          <DialogTitle>Edit template</DialogTitle>
          <DialogDescription>Changes apply to future renders only.</DialogDescription>
        </DialogHeader>
        <form action={action} className="space-y-4 pt-1">
          <input type="hidden" name="id" value={template.id} />
          <input type="hidden" name="teamId" value={teamId} />
          {state?.error && (
            <div className="flex items-center gap-2 rounded-xl border border-destructive/30 bg-destructive/5 px-3.5 py-2.5 text-sm text-destructive">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              {state.error}
            </div>
          )}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Name</Label>
            <Input name="name" defaultValue={template.name} required className="rounded-xl" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">HTML</Label>
            <textarea name="html" rows={13} defaultValue={template.html} className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 font-mono text-xs leading-relaxed focus:outline-none focus:ring-2 focus:ring-ring resize-none" required />
          </div>
          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="rounded-lg">Cancel</Button>
            <Button type="submit" disabled={pending} className="rounded-lg">{pending ? "Saving\u2026" : "Save changes"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function DeleteButton({ id, teamId }: { id: string; teamId: string }) {
  const [, action, pending] = useActionState(deleteTeamTemplateAction, null);
  return (
    <form action={action}>
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="teamId" value={teamId} />
      <button type="submit" disabled={pending} title="Delete" className="flex h-7 w-7 items-center justify-center rounded-lg bg-black/60 backdrop-blur-sm transition-all hover:bg-red-600/80 border border-white/10">
        <Trash2 className={cn("h-3.5 w-3.5", pending ? "text-white/40" : "text-white")} />
      </button>
    </form>
  );
}

function TemplateCard({ t, teamId }: { t: Template; teamId: string }) {
  const vars = extractVariables(t.html);
  const updatedAt = new Date(t.updatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" });

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-border/50 bg-card shadow-sm transition-all duration-200 hover:shadow-lg hover:shadow-black/20 hover:-translate-y-px dark:hover:shadow-black/50">
      <div className="relative overflow-hidden border-b border-border/30">
        {t.coverImageUrl ? (
          <img src={t.coverImageUrl} alt={t.name} className="w-full object-cover" style={{ height: 200 }} />
        ) : (
          <TemplateThumbnail html={t.html} name={t.name} />
        )}
        <div className="absolute right-2.5 top-2.5 flex items-center gap-1.5 opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-150 ease-out">
          <PreviewDialog template={t} />
          <EditDialog template={t} teamId={teamId} />
          <DeleteButton id={t.id} teamId={teamId} />
        </div>
        <Link
          href={`/app/teams/${teamId}/convert?template=${t.id}`}
          className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-1.5 bg-gradient-to-t from-black/70 via-black/30 to-transparent py-3 text-[12px] font-semibold text-white opacity-0 group-hover:opacity-100 transition-all duration-150"
        >
          Open in Studio <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
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

export function TeamTemplatesClient({ templates, teamId }: { templates: Template[]; teamId: string }) {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-semibold tracking-tight">Team Templates</h1>
          <p className="mt-0.5 text-[13px] text-muted-foreground">
            {templates.length > 0
              ? `${templates.length} template${templates.length !== 1 ? "s" : ""} shared across the team`
              : "Reusable HTML layouts shared across the team"}
          </p>
        </div>
        {templates.length > 0 && (
          <CreateDialog teamId={teamId}>
            <Button size="sm" className="gap-1.5 rounded-lg shrink-0">
              <Plus className="h-4 w-4" /> New template
            </Button>
          </CreateDialog>
        )}
      </div>

      {templates.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-28 text-center">
          <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-muted/50">
            <FileCode className="h-8 w-8 text-muted-foreground/25" />
          </div>
          <p className="text-[15px] font-semibold tracking-tight">No team templates yet</p>
          <p className="mt-1.5 max-w-[280px] text-[13px] text-muted-foreground leading-relaxed">
            Create templates that all team members can use for rendering.
          </p>
          <div className="mt-6">
            <CreateDialog teamId={teamId}>
              <Button size="sm" className="gap-1.5 rounded-xl px-5 h-9">
                <Plus className="h-4 w-4" /> Create first template
              </Button>
            </CreateDialog>
          </div>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {templates.map((t) => (
            <TemplateCard key={t.id} t={t} teamId={teamId} />
          ))}
        </div>
      )}
    </div>
  );
}
