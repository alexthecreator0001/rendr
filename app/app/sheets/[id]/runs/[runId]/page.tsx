import type { Metadata } from "next"
import { auth } from "@/auth"
import { prisma } from "@/lib/db"
import { redirect, notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Download, CheckCircle2, XCircle, Loader2 } from "lucide-react"
import { BatchRunAutoRefresh } from "./auto-refresh"

export const dynamic = "force-dynamic"
export const metadata: Metadata = { title: "Batch Run" }

const BASE_URL = () => process.env.AUTH_URL ?? process.env.NEXTAUTH_URL ?? "http://localhost:3000"

const statusConfig: Record<string, { label: string; color: string; icon: typeof CheckCircle2 }> = {
  running:   { label: "Running",   color: "text-blue-400 bg-blue-500/15",    icon: Loader2 },
  succeeded: { label: "Completed", color: "text-emerald-400 bg-emerald-500/15", icon: CheckCircle2 },
  partial:   { label: "Partial",   color: "text-amber-400 bg-amber-500/15",  icon: CheckCircle2 },
  failed:    { label: "Failed",    color: "text-red-400 bg-red-500/15",      icon: XCircle },
}

export default async function BatchRunPage({
  params,
}: {
  params: Promise<{ id: string; runId: string }>
}) {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const { id: syncId, runId } = await params

  const batchRun = await prisma.batchRun.findFirst({
    where: { id: runId, userId: session.user.id },
    include: {
      sheetSync: { select: { spreadsheetName: true, sheetName: true } },
      jobs: {
        select: {
          id: true,
          status: true,
          downloadToken: true,
          errorMessage: true,
          optionsJson: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: { createdAt: "asc" },
      },
    },
  })

  if (!batchRun) notFound()

  const cfg = statusConfig[batchRun.status] ?? statusConfig.running
  const StatusIcon = cfg.icon
  const baseUrl = BASE_URL()
  const isRunning = batchRun.status === "running"

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8">
      {/* Auto-refresh while running */}
      {isRunning && <BatchRunAutoRefresh intervalMs={3000} />}

      <Link
        href="/app/sheets"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Sheets
      </Link>

      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Batch Run</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {batchRun.sheetSync?.spreadsheetName ?? "Sheet"} / {batchRun.sheetSync?.sheetName ?? ""}
            {" — "}{batchRun.totalJobs} PDFs
          </p>
        </div>
        <div className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium ${cfg.color}`}>
          <StatusIcon className={`h-3.5 w-3.5 ${isRunning ? "animate-spin" : ""}`} />
          {cfg.label}
          <span className="text-[10px] opacity-70">
            {batchRun.succeededJobs}/{batchRun.totalJobs} done
            {batchRun.failedJobs > 0 && `, ${batchRun.failedJobs} failed`}
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-8">
        <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-emerald-500 transition-all duration-500"
            style={{
              width: `${Math.round(
                ((batchRun.succeededJobs + batchRun.failedJobs) / batchRun.totalJobs) * 100
              )}%`,
            }}
          />
        </div>
      </div>

      {/* Processing indicator */}
      {isRunning && (
        <div className="mb-6 flex items-center gap-3 rounded-lg border border-blue-500/20 bg-blue-500/10 px-4 py-3 text-sm text-blue-400">
          <Loader2 className="h-4 w-4 animate-spin shrink-0" />
          Processing... This page auto-refreshes every 3 seconds.
        </div>
      )}

      {/* Jobs table */}
      <div className="overflow-hidden rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead className="bg-muted/40">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">#</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground hidden sm:table-cell">Variables</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">PDF</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {batchRun.jobs.map((job, i) => {
              const vars = (job.optionsJson as Record<string, unknown>)?.variables as Record<string, string> | undefined
              const varSummary = vars
                ? Object.entries(vars).slice(0, 3).map(([k, v]) => `${k}: ${v}`).join(", ")
                : ""
              return (
                <tr key={job.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-2.5 text-xs text-muted-foreground tabular-nums">{i + 1}</td>
                  <td className="px-4 py-2.5">
                    {job.status === "succeeded" && (
                      <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-medium text-emerald-400">
                        Done
                      </span>
                    )}
                    {job.status === "failed" && (
                      <span className="rounded-full bg-red-500/15 px-2 py-0.5 text-[10px] font-medium text-red-400" title={job.errorMessage ?? ""}>
                        Failed
                      </span>
                    )}
                    {(job.status === "queued" || job.status === "processing") && (
                      <span className="rounded-full bg-blue-500/15 px-2 py-0.5 text-[10px] font-medium text-blue-400">
                        {job.status === "processing" ? "Rendering" : "Queued"}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-2.5 text-xs text-muted-foreground truncate max-w-[300px] hidden sm:table-cell">
                    {varSummary}
                  </td>
                  <td className="px-4 py-2.5">
                    {job.downloadToken ? (
                      <a
                        href={`${baseUrl}/api/v1/files/${job.downloadToken}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                      >
                        <Download className="h-3 w-3" />
                        Download
                      </a>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
