import type { Metadata } from "next"
import { auth } from "@/auth"
import { prisma } from "@/lib/db"
import { redirect } from "next/navigation"
import { isSheetsEnabled } from "@/lib/plans"
import { SheetsClient } from "./sheets-client"

export const dynamic = "force-dynamic"
export const metadata: Metadata = { title: "Google Sheets" }

export default async function SheetsPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { plan: true },
  })

  if (!user || !isSheetsEnabled(user.plan)) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-blue-500/20 bg-blue-500/10">
          <svg className="h-7 w-7 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 0 0-1.883 2.542l.857 6a2.25 2.25 0 0 0 2.227 1.932H19.05a2.25 2.25 0 0 0 2.227-1.932l.857-6a2.25 2.25 0 0 0-1.883-2.542m-16.5 0V6A2.25 2.25 0 0 1 6 3.75h3.879a1.5 1.5 0 0 1 1.06.44l2.122 2.12a1.5 1.5 0 0 0 1.06.44H18A2.25 2.25 0 0 1 20.25 9v.776" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold">Google Sheets to PDF</h1>
        <p className="mt-3 text-sm text-muted-foreground max-w-md mx-auto">
          Connect a Google Sheet, map columns to template variables, and batch-render
          PDFs — one per row. Perfect for invoices, certificates, and reports.
        </p>
        <a
          href="/app/billing"
          className="mt-6 inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          Upgrade to Growth
        </a>
        <p className="mt-3 text-xs text-muted-foreground">Available on Growth and Business plans</p>
      </div>
    )
  }

  const connections = await prisma.googleConnection.findMany({
    where: { userId: session.user.id, revokedAt: null },
    select: { id: true, email: true, connectedAt: true },
    orderBy: { connectedAt: "desc" },
  })

  const syncs = await prisma.sheetSync.findMany({
    where: { userId: session.user.id },
    include: {
      template: { select: { id: true, name: true } },
      connection: { select: { email: true } },
    },
    orderBy: { updatedAt: "desc" },
  })

  const templates = await prisma.template.findMany({
    where: { userId: session.user.id },
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  })

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8">
      <SheetsClient
        connections={connections.map((c) => ({ ...c, connectedAt: c.connectedAt.toISOString() }))}
        syncs={syncs.map((s) => ({
          id: s.id,
          spreadsheetName: s.spreadsheetName,
          sheetName: s.sheetName,
          templateName: s.template.name,
          googleEmail: s.connection.email,
          lastRunAt: s.lastRunAt?.toISOString() ?? null,
          lastRunStatus: s.lastRunStatus,
          lastRunJobCount: s.lastRunJobCount,
        }))}
        templates={templates}
        plan={user.plan}
      />
    </div>
  )
}
