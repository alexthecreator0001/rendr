"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/db"
import {
  getSpreadsheetTabs,
  getSpreadsheetTitle,
  getSheetHeaders,
  getSheetPreview,
  getSheetRows,
  parseSpreadsheetUrl,
} from "@/lib/google-sheets"
import { getQueue } from "@/lib/queue"
import { isSheetsEnabled, getPlanBatchLimit, getPlanRenderLimit } from "@/lib/plans"
import { revalidatePath } from "next/cache"

// ─── Helpers ─────────────────────────────────────────────────────────────────

async function requireUser() {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Not authenticated")
  return session.user.id
}

async function requireSheetsAccess(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { plan: true },
  })
  if (!user || !isSheetsEnabled(user.plan)) {
    throw new Error("Sheets integration requires Growth or Business plan")
  }
  return user
}

// ─── Disconnect Google ──────────────────────────────────────────────────────

export async function disconnectGoogleAction(connectionId: string) {
  const userId = await requireUser()
  await prisma.googleConnection.updateMany({
    where: { id: connectionId, userId },
    data: { revokedAt: new Date() },
  })
  revalidatePath("/app/sheets")
}

// ─── Fetch spreadsheet info ─────────────────────────────────────────────────

export async function fetchSpreadsheetInfoAction(
  connectionId: string,
  spreadsheetUrl: string
): Promise<{
  error?: string
  spreadsheetId?: string
  title?: string
  tabs?: { title: string; sheetId: number }[]
}> {
  const userId = await requireUser()
  await requireSheetsAccess(userId)

  // Verify connection belongs to user
  const conn = await prisma.googleConnection.findFirst({
    where: { id: connectionId, userId, revokedAt: null },
  })
  if (!conn) return { error: "Google connection not found" }

  const spreadsheetId = parseSpreadsheetUrl(spreadsheetUrl)
  if (!spreadsheetId) return { error: "Invalid Google Sheets URL" }

  try {
    const [title, tabs] = await Promise.all([
      getSpreadsheetTitle(connectionId, spreadsheetId),
      getSpreadsheetTabs(connectionId, spreadsheetId),
    ])
    return { spreadsheetId, title, tabs }
  } catch {
    return { error: "Could not access the spreadsheet. Make sure the Google account has access." }
  }
}

// ─── Fetch sheet preview ────────────────────────────────────────────────────

export async function fetchSheetPreviewAction(
  connectionId: string,
  spreadsheetId: string,
  sheetName: string
): Promise<{
  error?: string
  headers?: string[]
  rows?: string[][]
}> {
  const userId = await requireUser()
  await requireSheetsAccess(userId)

  const conn = await prisma.googleConnection.findFirst({
    where: { id: connectionId, userId, revokedAt: null },
  })
  if (!conn) return { error: "Google connection not found" }

  try {
    const preview = await getSheetPreview(connectionId, spreadsheetId, sheetName)
    return preview
  } catch {
    return { error: "Could not read the sheet data" }
  }
}

// ─── Get template variables ─────────────────────────────────────────────────

export async function getTemplateVariablesAction(
  templateId: string
): Promise<string[]> {
  const userId = await requireUser()
  const template = await prisma.template.findFirst({
    where: { id: templateId, userId },
    select: { html: true },
  })
  if (!template) return []

  // Extract {{variable}} patterns from HTML
  const matches = template.html.matchAll(/\{\{\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*\}\}/g)
  const vars = new Set<string>()
  for (const m of matches) {
    vars.add(m[1])
  }
  return [...vars]
}

// ─── Create sheet sync ──────────────────────────────────────────────────────

export async function createSheetSyncAction(data: {
  connectionId: string
  templateId: string
  spreadsheetId: string
  spreadsheetName: string
  sheetName: string
  columnMapping: Record<string, string> // { templateVar: columnHeader }
}): Promise<{ error?: string; syncId?: string }> {
  const userId = await requireUser()
  await requireSheetsAccess(userId)

  // Verify connection
  const conn = await prisma.googleConnection.findFirst({
    where: { id: data.connectionId, userId, revokedAt: null },
  })
  if (!conn) return { error: "Google connection not found" }

  // Verify template
  const template = await prisma.template.findFirst({
    where: { id: data.templateId, userId },
  })
  if (!template) return { error: "Template not found" }

  const sync = await prisma.sheetSync.create({
    data: {
      userId,
      connectionId: data.connectionId,
      templateId: data.templateId,
      spreadsheetId: data.spreadsheetId,
      spreadsheetName: data.spreadsheetName,
      sheetName: data.sheetName,
      columnMapping: data.columnMapping,
    },
  })

  revalidatePath("/app/sheets")
  return { syncId: sync.id }
}

// ─── Delete sheet sync ──────────────────────────────────────────────────────

export async function deleteSheetSyncAction(syncId: string) {
  const userId = await requireUser()
  await prisma.sheetSync.deleteMany({ where: { id: syncId, userId } })
  revalidatePath("/app/sheets")
}

// ─── Run batch ──────────────────────────────────────────────────────────────

export async function runBatchAction(
  syncId: string
): Promise<{ error?: string; batchRunId?: string }> {
  const userId = await requireUser()
  const user = await requireSheetsAccess(userId)

  const sync = await prisma.sheetSync.findFirst({
    where: { id: syncId, userId },
    include: { connection: true, template: true },
  })
  if (!sync) return { error: "Sheet sync not found" }
  if (sync.connection.revokedAt) return { error: "Google connection was disconnected" }

  const batchLimit = getPlanBatchLimit(user.plan)
  const renderLimit = getPlanRenderLimit(user.plan)

  // Check remaining monthly quota
  const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1)
  const monthlyUsage = await prisma.job.count({
    where: { userId, createdAt: { gte: monthStart } },
  })

  try {
    const { headers, rows } = await getSheetRows(
      sync.connectionId,
      sync.spreadsheetId,
      sync.sheetName
    )

    // Filter out empty rows
    const dataRows = rows.filter((row) => row.some((cell) => cell?.trim()))

    if (dataRows.length === 0) return { error: "No data rows found in the sheet" }
    if (dataRows.length > batchLimit) {
      return { error: `Sheet has ${dataRows.length} rows, but your ${user.plan} plan allows max ${batchLimit} rows per batch` }
    }
    if (monthlyUsage + dataRows.length > renderLimit) {
      return { error: `Not enough monthly renders remaining. Need ${dataRows.length}, have ${renderLimit - monthlyUsage} left.` }
    }

    const columnMapping = sync.columnMapping as Record<string, string>

    // Create the batch run
    const batchRun = await prisma.batchRun.create({
      data: {
        userId,
        sheetSyncId: sync.id,
        totalJobs: dataRows.length,
      },
    })

    // Create jobs for each row
    const queue = await getQueue()
    for (const row of dataRows) {
      // Build variables from column mapping
      const variables: Record<string, string> = {}
      for (const [templateVar, columnHeader] of Object.entries(columnMapping)) {
        const colIndex = headers.indexOf(columnHeader)
        if (colIndex >= 0) {
          variables[templateVar] = row[colIndex] ?? ""
        }
      }

      const job = await prisma.job.create({
        data: {
          userId,
          inputType: "template",
          templateId: sync.templateId,
          optionsJson: { variables },
          batchRunId: batchRun.id,
        },
      })

      await queue.send("pdf-conversion", { jobId: job.id })
    }

    // Update sync with last run info
    await prisma.sheetSync.update({
      where: { id: sync.id },
      data: { lastRunAt: new Date(), lastRunStatus: "running", lastRunJobCount: dataRows.length },
    })

    revalidatePath("/app/sheets")
    return { batchRunId: batchRun.id }
  } catch (err) {
    console.error("[sheets batch]", err)
    return { error: "Failed to read sheet data. Check your Google connection." }
  }
}
