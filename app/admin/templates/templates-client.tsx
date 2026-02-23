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
import { Plus, Pencil, Trash2, Layers, AlertTriangle, ImageIcon, Upload, RefreshCw } from "lucide-react";
import { syncTemplateCoversAction } from "@/app/admin/_actions";

type Template = {
  id: string;
  name: string;
  html: string;
  coverImageUrl: string | null;
  createdAt: string;
  updatedAt: string;
};

function extractVarCount(html: string): number {
  return new Set([...html.matchAll(/\{\{\s*(\w+)\s*\}\}/g)].map((m) => m[1])).size;
}

function CoverImageField({ defaultValue }: { defaultValue?: string | null }) {
  const [preview, setPreview] = useState(defaultValue ?? "");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadError(null);
    const fd = new FormData();
    fd.append("file", file);
    try {
      const res = await fetch("/api/uploads", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Upload failed");
      setPreview(data.url);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
        Cover Image <span className="normal-case text-muted-foreground/50">(optional)</span>
      </Label>
      <input type="hidden" name="coverImageUrl" value={preview} />
      <div className="flex gap-2">
        <Input
          value={preview}
          onChange={(e) => setPreview(e.target.value)}
          placeholder="https://… or upload an image →"
          className="rounded-xl"
        />
        <label className="shrink-0">
          <input type="file" accept="image/*" className="hidden" onChange={handleFile} disabled={uploading} />
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-9 rounded-xl gap-1.5 cursor-pointer"
            disabled={uploading}
            asChild
          >
            <span>
              <Upload className="h-3.5 w-3.5" />
              {uploading ? "Uploading…" : "Upload"}
            </span>
          </Button>
        </label>
      </div>
      {uploadError && (
        <p className="text-xs text-destructive">{uploadError}</p>
      )}
      {preview && (
        <div className="mt-2 overflow-hidden rounded-xl border border-border bg-muted/30" style={{ height: 120 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={preview}
            alt="Cover preview"
            className="h-full w-full object-cover"
            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
          />
        </div>
      )}
    </div>
  );
}

function CreateDialog({ adminUserId }: { adminUserId: string }) {
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
          <DialogTitle>Create default template</DialogTitle>
          <DialogDescription>Added to your admin account as a canonical template.</DialogDescription>
        </DialogHeader>
        <form action={action} className="space-y-4 pt-1">
          {state?.error && (
            <div className="flex items-center gap-2 rounded-xl border border-destructive/30 bg-destructive/5 px-3.5 py-2.5 text-sm text-destructive">
              <AlertTriangle className="h-4 w-4 shrink-0" />{state.error}
            </div>
          )}
          <input type="hidden" name="userId" value={adminUserId} />
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Name</Label>
            <Input name="name" placeholder="Invoice, Certificate…" required className="rounded-xl" />
          </div>
          <CoverImageField />
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
        <Button variant="outline" size="sm" className="gap-1.5 rounded-lg h-8">
          <Pencil className="h-3.5 w-3.5" /> Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl rounded-2xl">
        <DialogHeader>
          <DialogTitle>Edit — {template.name}</DialogTitle>
          <DialogDescription>Changes affect this template only.</DialogDescription>
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
          <CoverImageField defaultValue={template.coverImageUrl} />
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">HTML</Label>
            <textarea
              name="html"
              rows={16}
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
        title="Delete"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </Button>
    </form>
  );
}

function SyncCoversButton() {
  const [pending, setPending] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  async function handleSync() {
    setPending(true);
    setResult(null);
    try {
      const res = await syncTemplateCoversAction();
      if (res.error) setResult(`Error: ${res.error}`);
      else setResult(`Synced cover images to ${res.synced} user templates`);
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={handleSync}
        disabled={pending}
        className="rounded-lg gap-1.5 text-xs"
      >
        <RefreshCw className={`h-3.5 w-3.5 ${pending ? "animate-spin" : ""}`} />
        {pending ? "Syncing…" : "Sync covers to all users"}
      </Button>
      {result && (
        <span className="text-xs text-muted-foreground">{result}</span>
      )}
    </div>
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
            Canonical templates stored in your admin account. Set a cover image so they look great on the templates page.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <SyncCoversButton />
          <CreateDialog adminUserId={adminUserId} />
        </div>
      </div>

      {templates.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-muted/50">
            <Layers className="h-8 w-8 text-muted-foreground/25" />
          </div>
          <p className="font-semibold text-sm">No templates yet</p>
          <p className="mt-1.5 max-w-[280px] text-xs text-muted-foreground">
            Create your canonical templates here — they appear on the user-facing templates page.
          </p>
          <div className="mt-6">
            <CreateDialog adminUserId={adminUserId} />
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-border bg-card overflow-hidden">
          <div className="px-5 py-3 border-b border-border bg-muted/30">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              {templates.length} template{templates.length !== 1 ? "s" : ""}
            </p>
          </div>
          <div className="divide-y divide-border">
            {templates.map((t) => (
              <div key={t.id} className="flex items-center gap-4 px-5 py-4">
                {/* Cover image or icon */}
                <div className="shrink-0 h-12 w-16 overflow-hidden rounded-lg border border-border bg-muted/30 flex items-center justify-center">
                  {t.coverImageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={t.coverImageUrl}
                      alt={t.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <ImageIcon className="h-5 w-5 text-muted-foreground/30" />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-sm">{t.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {extractVarCount(t.html)} variable{extractVarCount(t.html) !== 1 ? "s" : ""}
                    {" · "}
                    Updated {new Date(t.updatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    {!t.coverImageUrl && (
                      <span className="ml-2 text-amber-500/80">· No cover image</span>
                    )}
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
