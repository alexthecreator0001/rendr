import { chromium } from "playwright"
import crypto from "node:crypto"
import { prisma } from "@/lib/db"
import { saveFile } from "@/lib/storage"
import { deliverWebhooks } from "@/lib/webhook"

const TIMEOUT = parseInt(process.env.PLAYWRIGHT_TIMEOUT_MS ?? "30000", 10)
const BASE_URL = process.env.NEXTAUTH_URL ?? "http://localhost:3000"

export async function processJob(jobId: string): Promise<void> {
  // Mark as processing
  let job
  try {
    job = await prisma.job.update({
      where: { id: jobId },
      data: { status: "processing" },
      include: { template: true },
    })
  } catch {
    console.error(`[worker] Job ${jobId} not found in DB — skipping`)
    return
  }

  let browser
  try {
    browser = await chromium.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"],
    })

    const context = await browser.newContext()
    const page = await context.newPage()
    page.setDefaultTimeout(TIMEOUT)

    const opts = (job.optionsJson as Record<string, unknown>) ?? {}
    const variables = (opts.variables as Record<string, string>) ?? {}

    if (job.inputType === "html") {
      if (!job.inputContent) throw new Error("inputContent is required for html jobs")
      await page.setContent(job.inputContent, { waitUntil: "networkidle" })
    } else if (job.inputType === "url") {
      if (!job.inputContent) throw new Error("inputContent is required for url jobs")
      await page.goto(job.inputContent, { waitUntil: "networkidle" })
    } else if (job.inputType === "template") {
      if (!job.template) throw new Error("Template not found")
      let html = job.template.html
      // Replace {{varName}} placeholders
      for (const [key, val] of Object.entries(variables)) {
        html = html.replace(new RegExp(`\\{\\{\\s*${key}\\s*\\}\\}`, "g"), val)
      }
      await page.setContent(html, { waitUntil: "networkidle" })
    } else {
      throw new Error(`Unknown input type: ${job.inputType}`)
    }

    const pdfBuffer = await page.pdf({
      format: (opts.format as "A4" | "Letter") ?? "A4",
      printBackground: true,
      margin: (opts.margin as {
        top?: string
        right?: string
        bottom?: string
        left?: string
      }) ?? { top: "20mm", right: "15mm", bottom: "20mm", left: "15mm" },
    })

    await context.close()
    await browser.close()
    browser = undefined

    const { path: resultPath } = await saveFile(job.id, Buffer.from(pdfBuffer))
    const downloadToken = crypto.randomBytes(32).toString("base64url")
    const resultUrl = `${BASE_URL}/api/v1/files/${downloadToken}`

    await prisma.job.update({
      where: { id: jobId },
      data: {
        status: "succeeded",
        resultPath,
        resultUrl,
        downloadToken,
      },
    })

    // Track usage
    await prisma.usageEvent.create({
      data: {
        userId: job.userId,
        apiKeyId: job.apiKeyId,
        endpoint: "pdf-render",
        statusCode: 200,
      },
    })

    // Deliver webhooks
    await deliverWebhooks(job.userId, "job.completed", {
      job_id: job.id,
      status: "succeeded",
      pdf_url: resultUrl,
    })

    console.log(`[worker] Job ${jobId} succeeded`)
  } catch (err) {
    if (browser) {
      try {
        await browser.close()
      } catch {
        // ignore
      }
    }

    const errorMessage =
      err instanceof Error ? err.message : "Unknown render error"

    console.error(`[worker] Job ${jobId} failed: ${errorMessage}`)

    await prisma.job.update({
      where: { id: jobId },
      data: {
        status: "failed",
        errorCode: "render_failed",
        errorMessage,
      },
    })

    // Deliver failure webhooks
    await deliverWebhooks(job.userId, "job.failed", {
      job_id: job.id,
      status: "failed",
      error: { code: "render_failed", message: errorMessage },
    })

    // Re-throw so pg-boss can mark the pg-boss job as failed
    throw err
  }
}
