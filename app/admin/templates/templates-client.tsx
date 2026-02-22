"use client";

import { useActionState, useState } from "react";
import {
  createAdminTemplateAction,
  updateAdminTemplateAction,
  deleteAdminTemplateAction,
} from "@/app/admin/_actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
  DialogTrigger, DialogFooter, DialogDescription,
} from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, Layers, AlertTriangle } from "lucide-react";

type Template = {
  id: string;
  name: string;
  html: string;
  createdAt: Date;
  updatedAt: Date;
};

function extractVarCount(html: string): number {
  return new Set([...html.matchAll(/\{\{\s*(\w+)\s*\}\}/g)].map((m) => m[1])).size;
}

function CreateDialog({ adminUserId }: { adminUserId: string }) {
  const [open, setOpen] = useState(false);
  const [state, action, pending] = useActionState(createAdminTemplateAction, null);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-1.5 rounded-lg">
          <Plus className="h-4 w-4" /> New default template
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl rounded-2xl">
        <DialogHeader>
          <DialogTitle>Create default template</DialogTitle>
          <DialogDescription>This template will be added to your admin account and can be seeded to new users.</DialogDescription>
        </DialogHeader>
        <form action={action} className="space-y-4 pt-1">
          {state?.error && (
            <div className="flex items-center gap-2 rounded-xl border border-destructive/30 bg-destructive/5 px-3.5 py-2.5 text-sm text-destructive">
              <AlertTriangle className="h-4 w-4 shrink-0" />{state.error}
            </div>
          )}
          {/* Hidden: assign to the admin's own account */}
          <input type="hidden" name="userId" value={adminUserId} />
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Name</Label>
            <Input name="name" placeholder="Invoice, Certificate…" required className="rounded-xl" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">HTML</Label>
            <textarea
              name="html"
              rows={14}
              className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 font-mono text-xs leading-relaxed placeholder:text-muted-foreground/30 focus:outline-none focus:ring-2 focus:ring-ring resize-none"
              placeholder={"<!DOCTYPE html>\n<html>\n  <body>\n    <h1>{{title}}</h1>\n  </body>\n</html>"}
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

function EditDialog({ template }: { template: Template }) {
  const [open, setOpen] = useState(false);
  const [state, action, pending] = useActionState(updateAdminTemplateAction, null);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1.5 rounded-lg h-8">
          <Pencil className="h-3.5 w-3.5" /> Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl rounded-2xl">
        <DialogHeader>
          <DialogTitle>Edit — {template.name}</DialogTitle>
          <DialogDescription>Changes affect this template only. Existing user copies are not updated.</DialogDescription>
        </DialogHeader>
        <form action={action} className="space-y-4 pt-1">
          {state?.error && (
            <div className="flex items-center gap-2 rounded-xl border border-destructive/30 bg-destructive/5 px-3.5 py-2.5 text-sm text-destructive">
              <AlertTriangle className="h-4 w-4 shrink-0" />{state.error}
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
              rows={18}
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

function DeleteButton({ id }: { id: string }) {
  const [, action, pending] = useActionState(deleteAdminTemplateAction, null);
  return (
    <form action={action}>
      <input type="hidden" name="id" value={id} />
      <Button
        type="submit"
        variant="ghost"
        size="sm"
        disabled={pending}
        className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
        title="Delete template"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </Button>
    </form>
  );
}

export function AdminTemplatesClient({
  templates,
  adminUserId,
}: {
  templates: Template[];
  adminUserId: string;
}) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Default Templates</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your canonical templates. These are the templates shown in the admin account and used as the basis for new user onboarding.
          </p>
        </div>
        <CreateDialog adminUserId={adminUserId} />
      </div>

      {templates.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-muted/50">
            <Layers className="h-8 w-8 text-muted-foreground/25" />
          </div>
          <p className="font-semibold text-sm">No templates yet</p>
          <p className="mt-1.5 max-w-[280px] text-xs text-muted-foreground">
            Create default templates here — they live in your admin account and serve as your canonical library.
          </p>
          <div className="mt-6">
            <CreateDialog adminUserId={adminUserId} />
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-border bg-card overflow-hidden">
          <div className="px-5 py-3 border-b border-border bg-muted/30">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{templates.length} template{templates.length !== 1 ? "s" : ""}</p>
          </div>
          <div className="divide-y divide-border">
            {templates.map((t) => (
              <div key={t.id} className="flex items-center gap-4 px-5 py-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-500/10 text-violet-600 dark:text-violet-400">
                  <Layers className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-sm">{t.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {extractVarCount(t.html)} variable{extractVarCount(t.html) !== 1 ? "s" : ""}
                    {" · "}
                    Updated {new Date(t.updatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <EditDialog template={t} />
                  <DeleteButton id={t.id} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
