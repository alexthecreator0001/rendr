"use client"

import { useState, useTransition } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Table2, Plus, Trash2, Play, ExternalLink, Unlink } from "lucide-react"
import { disconnectGoogleAction, deleteSheetSyncAction, runBatchAction } from "@/app/actions/sheets"

interface Connection {
  id: string
  email: string
  connectedAt: string
}

interface Sync {
  id: string
  spreadsheetName: string
  sheetName: string
  templateName: string
  googleEmail: string
  lastRunAt: string | null
  lastRunStatus: string | null
  lastRunJobCount: number | null
}

interface SheetsClientProps {
  connections: Connection[]
  syncs: Sync[]
  templates: { id: string; name: string }[]
  plan: string
}

const statusColors: Record<string, string> = {
  running:   "bg-blue-500/15 text-blue-400",
  succeeded: "bg-emerald-500/15 text-emerald-400",
  partial:   "bg-amber-500/15 text-amber-400",
  failed:    "bg-red-500/15 text-red-400",
}

export function SheetsClient({ connections, syncs, templates, plan }: SheetsClientProps) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  function handleDisconnect(connId: string) {
    if (!confirm("Disconnect this Google account? Existing syncs will stop working.")) return
    startTransition(async () => {
      await disconnectGoogleAction(connId)
      router.refresh()
    })
  }

  function handleDelete(syncId: string) {
    if (!confirm("Delete this sheet sync?")) return
    startTransition(async () => {
      await deleteSheetSyncAction(syncId)
      router.refresh()
    })
  }

  function handleRun(syncId: string) {
    setError(null)
    startTransition(async () => {
      const result = await runBatchAction(syncId)
      if (result.error) {
        setError(result.error)
      } else if (result.batchRunId) {
        router.push(`/app/sheets/${syncId}/runs/${result.batchRunId}`)
      }
    })
  }

  return (
    <>
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2.5">
            <Table2 className="h-6 w-6 text-emerald-400" />
            Google Sheets
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Connect a spreadsheet, map columns to template variables, render PDFs in batch.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {connections.length > 0 && templates.length > 0 && (
            <Link
              href="/app/sheets/new"
              className="inline-flex h-9 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              <Plus className="h-4 w-4" />
              New sync
            </Link>
          )}
        </div>
      </div>

      {plan === "starter" && (
        <div className="mb-6 rounded-lg border border-blue-500/20 bg-blue-500/10 px-4 py-3 text-sm text-blue-400 flex items-center justify-between gap-4">
          <span>Free plan: up to 10 rows per batch. Need more?</span>
          <Link href="/app/billing" className="shrink-0 rounded-lg bg-white/10 px-3 py-1 text-xs font-medium hover:bg-white/20 transition-colors">
            Upgrade
          </Link>
        </div>
      )}

      {error && (
        <div className="mb-6 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* Google Connections */}
      <section className="mb-10">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          Google Accounts
        </h2>
        <div className="space-y-2">
          {connections.map((conn) => (
            <div
              key={conn.id}
              className="flex items-center justify-between rounded-xl border border-border bg-card px-4 py-3"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/10">
                  <svg className="h-4 w-4 text-emerald-400" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium">{conn.email}</p>
                  <p className="text-xs text-muted-foreground">
                    Connected {new Date(conn.connectedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleDisconnect(conn.id)}
                disabled={pending}
                className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
              >
                <Unlink className="h-3.5 w-3.5" />
                Disconnect
              </button>
            </div>
          ))}
          <a
            href="/api/google/connect"
            className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-border px-4 py-3 text-sm text-muted-foreground hover:text-foreground hover:border-border/80 hover:bg-accent/30 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Connect Google Account
          </a>
        </div>
      </section>

      {/* Sheet Syncs */}
      {connections.length > 0 && (
        <section>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Sheet Syncs
          </h2>
          {syncs.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border p-8 text-center">
              <p className="text-sm text-muted-foreground mb-3">
                No syncs yet. Create one to start generating PDFs from your spreadsheet data.
              </p>
              {templates.length > 0 ? (
                <Link
                  href="/app/sheets/new"
                  className="inline-flex h-9 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  Create first sync
                </Link>
              ) : (
                <p className="text-xs text-muted-foreground">
                  You need at least one <Link href="/app/templates" className="text-primary hover:underline">template</Link> first.
                </p>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              {syncs.map((sync) => (
                <div
                  key={sync.id}
                  className="rounded-xl border border-border bg-card p-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-semibold truncate">{sync.spreadsheetName}</p>
                        <span className="text-xs text-muted-foreground">/ {sync.sheetName}</span>
                      </div>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                        <span>Template: <span className="text-foreground">{sync.templateName}</span></span>
                        <span>Account: {sync.googleEmail}</span>
                        {sync.lastRunAt && (
                          <span>Last run: {new Date(sync.lastRunAt).toLocaleString()}</span>
                        )}
                        {sync.lastRunStatus && (
                          <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${statusColors[sync.lastRunStatus] ?? ""}`}>
                            {sync.lastRunStatus}{sync.lastRunJobCount ? ` (${sync.lastRunJobCount})` : ""}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => handleRun(sync.id)}
                        disabled={pending}
                        className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-emerald-500/15 px-3 text-xs font-medium text-emerald-400 hover:bg-emerald-500/25 transition-colors disabled:opacity-50"
                      >
                        <Play className="h-3.5 w-3.5" />
                        {pending ? "Running..." : "Run"}
                      </button>
                      <button
                        onClick={() => handleDelete(sync.id)}
                        disabled={pending}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}
    </>
  )
}
