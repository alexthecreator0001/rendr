import { NextRequest } from "next/server"
import crypto from "node:crypto"
import fs from "node:fs/promises"
import path from "node:path"
import { PDFDocument } from "pdf-lib"
import { requireApiKey } from "@/lib/require-api-key"
import { checkRateLimit } from "@/lib/rate-limit"
import { prisma } from "@/lib/db"
import { apiError, ApiError } from "@/lib/errors"
import { saveFile } from "@/lib/storage"
import { getPlanSizeLimit } from "@/lib/plans"
import { mergeSchema } from "@/lib/schemas"

const BASE_DIR = process.env.STORAGE_LOCAL_DIR ?? "/data"
const PDF_DIR = path.resolve(path.join(BASE_DIR, "pdfs"))
const BASE_URL = () =>
  process.env.AUTH_URL ?? process.env.NEXTAUTH_URL ?? "http://localhost:3000"

export async function POST(req: NextRequest) {
  try {
    const { user, apiKey, teamId } = await requireApiKey(req)

    const rateLimit = checkRateLimit(apiKey.id)
    if (!rateLimit.ok) {
      return apiError(
        429,
        "Rate limit exceeded. Try again in 60 seconds.",
        "rate_limit_exceeded"
      )
    }

    const body = await req.json().catch(() => null)
    if (!body) return apiError(400, "Invalid JSON body", "invalid_request")

    const parsed = mergeSchema.safeParse(body)
    if (!parsed.success) {
      return apiError(
        400,
        parsed.error.errors[0]?.message ?? "Invalid request",
        "invalid_request"
      )
    }

    const { sources, metadata, filename } = parsed.data

    // Resolve download tokens to jobs and verify ownership
    const jobs = await prisma.job.findMany({
      where: {
        downloadToken: { in: sources },
        userId: user.id,
        status: "succeeded",
      },
      select: {
        id: true,
        downloadToken: true,
        resultPath: true,
      },
    })

    // Build a map for ordering
    const jobByToken = new Map(jobs.map((j) => [j.downloadToken, j]))

    // Check all tokens are valid
    for (const token of sources) {
      if (!jobByToken.has(token)) {
        return apiError(
          404,
          `PDF not found for token: ${token.slice(0, 8)}...`,
          "not_found"
        )
      }
    }

    // Load and merge PDFs in the order specified
    const merged = await PDFDocument.create()

    for (const token of sources) {
      const job = jobByToken.get(token)!
      if (!job.resultPath) {
        return apiError(404, "PDF file path missing", "not_found")
      }

      // Path traversal guard
      const resolvedPath = path.resolve(job.resultPath)
      if (
        !resolvedPath.startsWith(PDF_DIR + path.sep) &&
        resolvedPath !== PDF_DIR
      ) {
        return apiError(404, "PDF file not accessible", "not_found")
      }

      let pdfBytes: Buffer
      try {
        pdfBytes = await fs.readFile(resolvedPath)
      } catch {
        return apiError(404, "PDF file not found on disk", "not_found")
      }

      const srcDoc = await PDFDocument.load(pdfBytes)
      const pages = await merged.copyPages(srcDoc, srcDoc.getPageIndices())
      for (const page of pages) {
        merged.addPage(page)
      }
    }

    // Set metadata if provided
    if (metadata) {
      if (metadata.title) merged.setTitle(metadata.title)
      if (metadata.author) merged.setAuthor(metadata.author)
      if (metadata.subject) merged.setSubject(metadata.subject)
      if (metadata.keywords) merged.setKeywords([metadata.keywords])
    }
    merged.setProducer("Rendr PDF")

    const mergedBytes = await merged.save()

    // Enforce per-plan PDF size limit
    const userPlan = user.plan ?? "starter"
    const sizeLimit = getPlanSizeLimit(userPlan)
    if (mergedBytes.length > sizeLimit) {
      const sizeMb = (mergedBytes.length / 1024 / 1024).toFixed(1)
      const limitMb = (sizeLimit / 1024 / 1024).toFixed(0)
      return apiError(
        413,
        `Merged PDF is ${sizeMb} MB — exceeds the ${limitMb} MB limit on the ${userPlan} plan. Upgrade for more.`,
        "payload_too_large"
      )
    }

    // Create a job record for the merge
    const job = await prisma.job.create({
      data: {
        userId: user.id,
        teamId,
        apiKeyId: apiKey.id,
        inputType: "merge",
        inputContent: null,
        optionsJson: {
          sources,
          ...(metadata ? { metadata } : {}),
          ...(filename ? { filename } : {}),
        },
        status: "succeeded",
      },
    })

    const { path: resultPath } = await saveFile(
      job.id,
      Buffer.from(mergedBytes)
    )
    const downloadToken = crypto.randomBytes(32).toString("base64url")
    const resultUrl = `${BASE_URL()}/api/v1/files/${downloadToken}`

    await prisma.job.update({
      where: { id: job.id },
      data: {
        resultPath,
        resultUrl,
        downloadToken,
      },
    })

    // Track usage
    await prisma.usageEvent.create({
      data: {
        userId: user.id,
        teamId,
        apiKeyId: apiKey.id,
        endpoint: "/api/v1/merge",
        statusCode: 200,
      },
    })

    return Response.json({
      job_id: job.id,
      status: "succeeded",
      pdf_url: resultUrl,
      pages: merged.getPageCount(),
      size_bytes: mergedBytes.length,
    })
  } catch (e) {
    if (e instanceof ApiError) return apiError(e.status, e.message, e.code)
    console.error("[merge]", e)
    return apiError(500, "Internal server error", "internal_error")
  }
}
