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
import { Plus, Pencil, Trash2, Layers, ChevronLeft, ChevronRight, AlertTriangle } from "lucide-react";
import Link from "next/link";

type Template = {
  id: string;
  name: string;
  html: string;
  createdAt: Date;
  user: { email: string };
  team: { name: string } | null;
  _count: { jobs: number };
};

type User = { id: string; email: string };

function extractVarCount(html: string): number {
  return new Set([...html.matchAll(/\{\{\s*(\w+)\s*\}\}/g)].map((m) => m[1])).size;
}

function CreateDialog({ users }: { users: User[] }) {
  const [open, setOpen] = useState(false);
  const [state, action, pending] = useActionState(createAdminTemplateAction, null);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-1.5 rounded-lg">
          <Plus className="h-4 w-4" /> New template
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl rounded-2xl">
        <DialogHeader>
          <DialogTitle>Create template</DialogTitle>
          <DialogDescription>Assign a new template to any user.</DialogDescription>
        </DialogHeader>
        <form action={action} className="space-y-4 pt-1">
          {state?.error && (
            <div className="flex items-center gap-2 rounded-xl border border-destructive/30 bg-destructive/5 px-3.5 py-2.5 text-sm text-destructive">
              <AlertTriangle className="h-4 w-4 shrink-0" />{state.error}
            </div>
          )}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">User</Label>
            <select
              name="userId"
              required
              className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">Select a user…</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>{u.email}</option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Name</Label>
            <Input name="name" placeholder="Invoice, Certificate…" required className="rounded-xl" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">HTML</Label>
            <textarea
              name="html"
              rows={12}
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
        <button
          title="Edit"
          className="flex h-7 w-7 items-center justify-center rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        >
          <Pencil className="h-3.5 w-3.5" />
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl rounded-2xl">
        <DialogHeader>
          <DialogTitle>Edit template</DialogTitle>
          <DialogDescription>Owner: {template.user.email}</DialogDescription>
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
              rows={12}
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
      <button
        type="submit"
        disabled={pending}
        title="Delete"
        className="flex h-7 w-7 items-center justify-center rounded-lg border border-border text-muted-foreground hover:text-destructive hover:border-destructive/30 transition-colors"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </button>
    </form>
  );
}

export function AdminTemplatesClient({
  templates,
  users,
  page,
  totalPages,
  total,
}: {
  templates: Template[];
  users: User[];
  page: number;
  totalPages: number;
  total: number;
}) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Templates</h1>
          <p className="mt-1 text-sm text-muted-foreground">{total} total templates across all users.</p>
        </div>
        <CreateDialog users={users} />
      </div>

      {templates.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-muted/50">
            <Layers className="h-8 w-8 text-muted-foreground/25" />
          </div>
          <p className="font-semibold text-sm">No templates found</p>
        </div>
      ) : (
        <div className="rounded-2xl border border-border overflow-hidden overflow-x-auto">
          <table className="w-full text-sm min-w-[600px]">
            <thead className="bg-muted/40">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">Name</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">User</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden md:table-cell">Team</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden sm:table-cell">Vars</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden sm:table-cell">Jobs</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden lg:table-cell">Created</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {templates.map((t) => (
                <tr key={t.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 font-medium max-w-[200px] truncate">{t.name}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground max-w-[160px] truncate">{t.user.email}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground hidden md:table-cell">
                    {t.team ? t.team.name : <span className="text-muted-foreground/40">—</span>}
                  </td>
                  <td className="px-4 py-3 text-xs hidden sm:table-cell">{extractVarCount(t.html)}</td>
                  <td className="px-4 py-3 text-xs hidden sm:table-cell">{t._count.jobs}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground hidden lg:table-cell">
                    {new Date(t.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1.5">
                      <EditDialog template={t} />
                      <DeleteButton id={t.id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">Page {page} of {totalPages}</p>
          <div className="flex gap-1.5">
            {page > 1 && (
              <Link
                href={`/admin/templates?page=${page - 1}`}
                className="flex h-7 w-7 items-center justify-center rounded-lg border border-border text-muted-foreground hover:text-foreground transition-colors"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
              </Link>
            )}
            {page < totalPages && (
              <Link
                href={`/admin/templates?page=${page + 1}`}
                className="flex h-7 w-7 items-center justify-center rounded-lg border border-border text-muted-foreground hover:text-foreground transition-colors"
              >
                <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
