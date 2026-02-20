"use client";

import { useState } from "react";
import { Plus, Eye, EyeOff, Trash2, Key } from "lucide-react";
import { mockApiKeys, type ApiKey } from "@/lib/mock/api-keys";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function KeyRow({ apiKey }: { apiKey: ApiKey }) {
  const [revealed, setRevealed] = useState(false);

  return (
    <TableRow>
      <TableCell>
        <div>
          <p className="font-medium text-sm">{apiKey.name}</p>
          <Badge
            variant={apiKey.environment === "live" ? "default" : "secondary"}
            className="mt-0.5 rounded-full text-[10px]"
          >
            {apiKey.environment}
          </Badge>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <code className="font-mono text-xs text-muted-foreground">
            {revealed ? "rk_live_a1b2c3d4e5f6a8f2" : apiKey.maskedKey}
          </code>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={() => setRevealed(!revealed)}
            aria-label={revealed ? "Hide key" : "Reveal key"}
          >
            {revealed ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
          </Button>
        </div>
      </TableCell>
      <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">
        {formatDate(apiKey.createdAt)}
      </TableCell>
      <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
        {apiKey.lastUsedAt ? formatDate(apiKey.lastUsedAt) : "Never"}
      </TableCell>
      <TableCell>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10"
          aria-label="Revoke key"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </TableCell>
    </TableRow>
  );
}

function CreateKeyDialog() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [env, setEnv] = useState<"live" | "test">("live");
  const [created, setCreated] = useState(false);

  const handleCreate = () => {
    setCreated(true);
  };

  const handleClose = () => {
    setOpen(false);
    setTimeout(() => {
      setCreated(false);
      setName("");
      setEnv("live");
    }, 300);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-1.5">
          <Plus className="h-4 w-4" />
          New key
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        {!created ? (
          <>
            <DialogHeader>
              <DialogTitle>Create API key</DialogTitle>
              <DialogDescription>
                Give this key a name so you can identify it later. You&apos;ll only see the full key once.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-1.5">
                <Label htmlFor="key-name">Key name</Label>
                <Input
                  id="key-name"
                  placeholder="e.g. Production, CI Bot, Staging"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Visible only to workspace members.
                </p>
              </div>
              <div className="space-y-1.5">
                <Label>Environment</Label>
                <div className="flex gap-2">
                  {(["live", "test"] as const).map((e) => (
                    <button
                      key={e}
                      onClick={() => setEnv(e)}
                      className={`flex-1 rounded-lg border py-2 text-sm transition-colors ${
                        env === e
                          ? "border-primary bg-primary/5 text-primary font-medium"
                          : "border-border text-muted-foreground hover:border-muted-foreground"
                      }`}
                    >
                      {e === "live" ? "Live" : "Test"}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">
                  Test keys won&apos;t count against your render quota.
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={handleClose}>Cancel</Button>
              <Button onClick={handleCreate} disabled={!name.trim()}>
                Create key
              </Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Key created</DialogTitle>
              <DialogDescription>
                Copy it now — you won&apos;t see this again.
              </DialogDescription>
            </DialogHeader>
            <div className="my-2 rounded-lg border border-border bg-muted p-3">
              <code className="break-all font-mono text-xs text-foreground">
                rk_{env}_d4e5f6g7h8i9j0k1l2m3n4o5
              </code>
            </div>
            <p className="text-xs text-muted-foreground">
              Store this in your environment variables, not in source code.
            </p>
            <DialogFooter className="mt-2">
              <Button onClick={handleClose}>Done</Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default function ApiKeysPage() {
  const keys = mockApiKeys;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">API Keys</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {keys.length} key{keys.length !== 1 ? "s" : ""} in this workspace.
          </p>
        </div>
        <CreateKeyDialog />
      </div>

      <div className="rounded-xl border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Key</TableHead>
              <TableHead className="hidden sm:table-cell">Created</TableHead>
              <TableHead className="hidden md:table-cell">Last used</TableHead>
              <TableHead className="w-12" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {keys.map((key) => (
              <KeyRow key={key.id} apiKey={key} />
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="rounded-xl border border-dashed border-border p-5">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted">
            <Key className="h-4 w-4 text-muted-foreground" />
          </div>
          <div>
            <p className="text-sm font-medium">Keep keys safe</p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              API keys grant full access to your workspace. Use environment variables,
              never commit them to source control. If a key is compromised, revoke it here immediately.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
