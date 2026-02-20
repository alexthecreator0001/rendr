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
import { Plus, FileCode, Pencil, Trash2 } from "lucide-react";

type Template = { id: string; name: string; createdAt: Date; updatedAt: Date };

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
            Write your HTML template. Use {"{{variable}}"} for dynamic values.
          </DialogDescription>
        </DialogHeader>
        <form action={action} className="space-y-4 pt-2">
          {state?.error && <p className="text-sm text-destructive">{state.error}</p>}
          <div className="space-y-1.5">
            <Label htmlFor="name">Template name</Label>
            <Input id="name" name="name" placeholder="e.g. Invoice, Statement of Work" required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="html">HTML</Label>
            <textarea
              id="html"
              name="html"
              rows={10}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="<html><body><h1>{{title}}</h1></body></html>"
              required
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={pending}>
              {pending ? "Creating…" : "Create"}
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
        </DialogHeader>
        <form action={action} className="space-y-4 pt-2">
          {state?.error && <p className="text-sm text-destructive">{state.error}</p>}
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
              rows={10}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="<html>…</html>"
              required
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={pending}>
              {pending ? "Saving…" : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function DeleteButton({ id }: { id: string }) {
  const [state, action, pending] = useActionState(deleteTemplateAction, null);
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
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Templates</h1>
          <p className="text-sm text-muted-foreground mt-1">Reusable HTML templates for your PDFs.</p>
        </div>
        <CreateDialog />
      </div>

      {templates.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border py-16 text-center">
          <FileCode className="mx-auto h-8 w-8 text-muted-foreground/40 mb-3" />
          <p className="text-sm text-muted-foreground">No templates yet.</p>
          <p className="text-xs text-muted-foreground/60 mt-1">
            Create a template to reuse HTML across jobs.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {templates.map((t) => (
            <div
              key={t.id}
              className="group rounded-xl border border-border p-4 hover:border-primary/30 hover:shadow-sm transition-all"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <FileCode className="h-4 w-4 shrink-0 text-muted-foreground" />
                  <p className="font-medium truncate">{t.name}</p>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                  <EditDialog template={t} />
                  <DeleteButton id={t.id} />
                </div>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                Updated {new Date(t.updatedAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
