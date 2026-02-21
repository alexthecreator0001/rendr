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
import { Badge } from "@/components/ui/badge";
import { Plus, FileCode, Pencil, Trash2, Braces, ArrowRight, Eye } from "lucide-react";
import Link from "next/link";

type Template = { id: string; name: string; html: string; createdAt: Date; updatedAt: Date };

function extractVariables(html: string): string[] {
  const matches = [...html.matchAll(/\{\{\s*(\w+)\s*\}\}/g)];
  return [...new Set(matches.map((m) => m[1]))];
}

/** Sandboxed iframe thumbnail — shows the top portion of the rendered HTML */
function TemplateThumbnail({ html, name }: { html: string; name: string }) {
  return (
    <div className="relative overflow-hidden rounded-t-xl bg-muted/30 border-b border-border" style={{ height: 168 }}>
      <iframe
        srcDoc={html}
        sandbox=""
        title={`Preview of ${name}`}
        className="absolute top-0 left-0 border-0 pointer-events-none select-none"
        style={{
          width: 860,
          height: 1100,
          transform: "scale(0.345)",
          transformOrigin: "top left",
        }}
      />
      {/* Fade overlay at the bottom so the cut-off isn't jarring */}
      <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-background/60 to-transparent" />
    </div>
  );
}

/** Full-size preview modal */
function PreviewDialog({ template }: { template: Template }) {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="ghost" className="h-7 w-7 p-0">
          <Eye className="h-3.5 w-3.5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl h-[85vh] flex flex-col p-0 gap-0">
        <DialogHeader className="px-6 py-4 border-b border-border shrink-0">
          <DialogTitle>{template.name}</DialogTitle>
          <DialogDescription>Read-only HTML preview (no scripts run)</DialogDescription>
        </DialogHeader>
        <div className="flex-1 overflow-hidden">
          <iframe
            srcDoc={template.html}
            sandbox=""
            title={`Full preview of ${template.name}`}
            className="w-full h-full border-0"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}

function CreateDialog() {
  const [open, setOpen] = useState(false);
  const [state, action, pending] = useActionState(createTemplateAction, null);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-1.5">
          <Plus className="h-4 w-4" /> New template
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create template</DialogTitle>
          <DialogDescription>
            Write your HTML template. Use <code className="font-mono text-xs">{"{{variable}}"}</code> for dynamic values.
          </DialogDescription>
        </DialogHeader>
        <form action={action} className="space-y-4 pt-2">
          {state?.error && (
            <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {state.error}
            </p>
          )}
          <div className="space-y-1.5">
            <Label htmlFor="create-name">Template name</Label>
            <Input
              id="create-name"
              name="name"
              placeholder="e.g. Invoice, Statement of Work"
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="create-html">HTML</Label>
            <textarea
              id="create-html"
              name="html"
              rows={12}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 font-mono text-xs placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-ring resize-none"
              placeholder={"<!DOCTYPE html>\n<html>\n  <body>\n    <h1>{{title}}</h1>\n    <p>Dear {{name}},</p>\n  </body>\n</html>"}
              required
            />
            <p className="text-[11px] text-muted-foreground">
              Variables in <code className="font-mono">{"{{curly braces}}"}</code> are filled in at render time.
            </p>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={pending}>
              {pending ? "Creating…" : "Create template"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function EditDialog({ template }: { template: Template }) {
  const [open, setOpen] = useState(false);
  const [state, action, pending] = useActionState(updateTemplateAction, null);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="ghost" className="h-7 w-7 p-0">
          <Pencil className="h-3.5 w-3.5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit template</DialogTitle>
          <DialogDescription>
            Changes apply to future jobs only — existing PDFs are unaffected.
          </DialogDescription>
        </DialogHeader>
        <form action={action} className="space-y-4 pt-2">
          {state?.error && (
            <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {state.error}
            </p>
          )}
          <input type="hidden" name="id" value={template.id} />
          <div className="space-y-1.5">
            <Label htmlFor={`name-${template.id}`}>Name</Label>
            <Input
              id={`name-${template.id}`}
              name="name"
              defaultValue={template.name}
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor={`html-${template.id}`}>HTML</Label>
            <textarea
              id={`html-${template.id}`}
              name="html"
              rows={12}
              defaultValue={template.html}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 font-mono text-xs placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-ring resize-none"
              required
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={pending}>
              {pending ? "Saving…" : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function DeleteButton({ id }: { id: string }) {
  const [, action, pending] = useActionState(deleteTemplateAction, null);
  return (
    <form action={action}>
      <input type="hidden" name="id" value={id} />
      <Button
        type="submit"
        size="sm"
        variant="ghost"
        className="h-7 w-7 p-0 text-destructive hover:text-destructive"
        disabled={pending}
      >
        <Trash2 className="h-3.5 w-3.5" />
      </Button>
    </form>
  );
}

export function TemplatesClient({ templates }: { templates: Template[] }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Templates</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Reusable HTML layouts with <code className="font-mono text-xs">{"{{variable}}"}</code> substitution.
          </p>
        </div>
        <CreateDialog />
      </div>

      {templates.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border py-20 text-center">
          <FileCode className="mx-auto h-9 w-9 text-muted-foreground/30 mb-3" />
          <p className="text-sm font-medium">No templates yet</p>
          <p className="text-xs text-muted-foreground mt-1 mb-5">
            Create a template to reuse HTML across convert jobs.
          </p>
          <CreateDialog />
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {templates.map((t) => {
            const vars = extractVariables(t.html);
            return (
              <div
                key={t.id}
                className="group relative rounded-2xl border border-border bg-card overflow-hidden hover:border-primary/40 hover:shadow-sm transition-all"
              >
                {/* Thumbnail preview */}
                <TemplateThumbnail html={t.html} name={t.name} />

                {/* Actions — shown on hover, positioned over the thumbnail */}
                <div className="absolute right-3 top-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                  <PreviewDialog template={t} />
                  <EditDialog template={t} />
                  <DeleteButton id={t.id} />
                </div>

                {/* Card body */}
                <div className="p-4">
                  {/* Name */}
                  <p className="font-semibold text-sm truncate">{t.name}</p>

                  {/* Variables */}
                  <div className="mt-2 flex flex-wrap gap-1.5 min-h-[20px]">
                    {vars.length > 0 ? (
                      vars.map((v) => (
                        <Badge
                          key={v}
                          variant="secondary"
                          className="rounded-full px-2 py-0 text-[10px] font-mono gap-1"
                        >
                          <Braces className="h-2.5 w-2.5" />
                          {v}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-[11px] text-muted-foreground/60">No variables</span>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="mt-3 flex items-center justify-between">
                    <p className="text-[11px] text-muted-foreground">
                      Updated {new Date(t.updatedAt).toLocaleDateString()}
                    </p>
                    <Link
                      href={`/app/convert?template=${t.id}`}
                      className="flex items-center gap-1 text-[11px] text-primary opacity-0 group-hover:opacity-100 transition-opacity hover:underline"
                    >
                      Use <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
