"use client";

import { useState, useActionState, useEffect, useCallback } from "react";
import { createApiKeyAction, revokeApiKeyAction } from "@/app/actions/api-keys";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Plus, Copy, Check, Key } from "lucide-react";

type ApiKeyRow = {
  id: string;
  name: string;
  keyPrefix: string;
  revokedAt: string | null;
  createdAt: string;
  lastUsedAt: string | null;
};

async function fetchApiKeys(): Promise<ApiKeyRow[]> {
  const res = await fetch("/api/dashboard/api-keys", { cache: "no-store" });
  if (!res.ok) return [];
  return res.json();
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={() => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }}
      className="ml-2 inline-flex h-6 w-6 items-center justify-center rounded text-muted-foreground hover:text-foreground transition-colors"
    >
      {copied ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
    </button>
  );
}

export default function ApiKeysPage() {
  const [keys, setKeys] = useState<ApiKeyRow[]>([]);
  const [open, setOpen] = useState(false);
  const [newKey, setNewKey] = useState<string | null>(null);
  const [createState, createAction, createPending] = useActionState(createApiKeyAction, null);
  const [revokeState, revokeAction, revokePending] = useActionState(revokeApiKeyAction, null);

  const load = useCallback(() => {
    fetchApiKeys().then(setKeys);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (createState?.key) {
      setNewKey(createState.key);
      setOpen(false);
      load();
    }
  }, [createState, load]);

  useEffect(() => {
    if (revokeState && !("error" in revokeState && revokeState.error)) {
      load();
    }
  }, [revokeState, load]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">API Keys</h1>
          <p className="text-sm text-muted-foreground mt-1">Keys are shown in full only at creation time.</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-1.5">
              <Plus className="h-4 w-4" /> New key
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create API key</DialogTitle>
              <DialogDescription>Give your key a name to remember where it&apos;s used.</DialogDescription>
            </DialogHeader>
            <form action={createAction} className="space-y-4 pt-2">
              {createState?.error && (
                <p className="text-sm text-destructive">{createState.error}</p>
              )}
              <div className="space-y-1.5">
                <Label htmlFor="name">Key name</Label>
                <Input id="name" name="name" placeholder="e.g. Production, CI Bot" required />
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={createPending}>
                  {createPending ? "Creating…" : "Create key"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {newKey && (
        <div className="rounded-xl border border-green-200 bg-green-50 dark:border-green-900/50 dark:bg-green-900/20 p-4">
          <p className="text-sm font-medium text-green-800 dark:text-green-300 mb-2">
            Your new API key — copy it now. It won&apos;t be shown again.
          </p>
          <div className="flex items-center gap-2 rounded-lg border border-green-200 dark:border-green-900 bg-white dark:bg-zinc-900 px-3 py-2 font-mono text-sm">
            <span className="flex-1 truncate">{newKey}</span>
            <CopyButton text={newKey} />
          </div>
          <Button size="sm" variant="ghost" className="mt-2 text-green-700 dark:text-green-400" onClick={() => setNewKey(null)}>
            Dismiss
          </Button>
        </div>
      )}

      {keys.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border py-16 text-center">
          <Key className="mx-auto h-8 w-8 text-muted-foreground/40 mb-3" />
          <p className="text-sm text-muted-foreground">No API keys yet. Create one to start rendering PDFs.</p>
        </div>
      ) : (
        <div className="rounded-xl border border-border overflow-hidden overflow-x-auto">
          <table className="w-full text-sm min-w-[560px]">
            <thead className="bg-muted/40">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Name</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Key</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground hidden sm:table-cell">Last used</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground hidden md:table-cell">Created</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {keys.map((k) => (
                <tr key={k.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 font-medium">{k.name}</td>
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{k.keyPrefix}…</td>
                  <td className="px-4 py-3">
                    {k.revokedAt ? (
                      <Badge variant="destructive" className="text-xs">Revoked</Badge>
                    ) : (
                      <Badge variant="secondary" className="text-xs bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-0">Active</Badge>
                    )}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground text-xs hidden sm:table-cell">
                    {k.lastUsedAt ? new Date(k.lastUsedAt).toLocaleDateString() : "Never"}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground text-xs hidden md:table-cell">
                    {new Date(k.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {!k.revokedAt && (
                      <form action={revokeAction}>
                        <input type="hidden" name="id" value={k.id} />
                        <Button type="submit" size="sm" variant="ghost" className="text-destructive hover:text-destructive" disabled={revokePending}>
                          Revoke
                        </Button>
                      </form>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
