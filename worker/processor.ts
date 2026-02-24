import { chromium } from "playwright"
import crypto from "node:crypto"
import { prisma } from "@/lib/db"
import { saveFile } from "@/lib/storage"
import { deliverWebhooks } from "@/lib/webhook"
import { assertSafeUrl } from "@/lib/ssrf-guard"
import { getPlanSizeLimit } from "@/lib/plans"

const TIMEOUT = parseInt(process.env.PLAYWRIGHT_TIMEOUT_MS ?? "30000", 10)
const BASE_URL = process.env.AUTH_URL ?? process.env.NEXTAUTH_URL ?? "http://localhost:3000"

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
      // SSRF guard: block private/internal URLs before passing to Playwright
      await assertSafeUrl(job.inputContent)
      await page.goto(job.inputContent, { waitUntil: "networkidle" })
    } else if (job.inputType === "template") {
      if (!job.template) throw new Error("Template not found")
      let html = job.template.html
      for (const [key, val] of Object.entries(variables)) {
        // Escape regex metacharacters in the key to prevent ReDoS
        const safeKey = key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
        html = html.replace(new RegExp(`\\{\\{\\s*${safeKey}\\s*\\}\\}`, "g"), val)
      }
      await page.setContent(html, { waitUntil: "networkidle" })
    } else {
      throw new Error(`Unknown input type: ${job.inputType}`)
    }

    // Optional render delay (wait for JS/animations to settle)
    const waitForMs =
      typeof opts.waitFor === "number"
        ? Math.min(Math.max(opts.waitFor, 0), 10) * 1000
        : 0
    if (waitForMs > 0) {
      await page.waitForTimeout(waitForMs)
    }

    // Build Playwright PDF options from stored optionsJson
    const hasCustomDimensions = !!(opts.width || opts.height)
    const scale = typeof opts.scale === "number" ? opts.scale : 1
    const clampedScale = Math.min(Math.max(scale, 0.1), 2)

    const pdfBuffer = await page.pdf({
      // Paper size — use format OR custom width/height (mutually exclusive)
      ...(hasCustomDimensions
        ? {
            width: (opts.width as string) || undefined,
            height: (opts.height as string) || undefined,
          }
        : {
            format: (opts.format as string) ?? "A4",
          }),

      landscape: (opts.landscape as boolean) ?? false,
      printBackground: (opts.printBackground as boolean) ?? true,
      preferCSSPageSize: (opts.preferCSSPageSize as boolean) ?? false,

      scale: clampedScale,
      pageRanges: (opts.pageRanges as string) || undefined,

      displayHeaderFooter: (opts.displayHeaderFooter as boolean) ?? false,
      headerTemplate: (opts.headerTemplate as string) || "<span></span>",
      footerTemplate: (opts.footerTemplate as string) || "<span></span>",

      tagged: (opts.tagged as boolean) ?? false,
      outline: (opts.outline as boolean) ?? false,

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

    // Enforce per-plan PDF size limit
    const userPlan = (await prisma.user.findUnique({
      where: { id: job.userId },
      select: { plan: true },
    }))?.plan ?? "starter"
    const sizeLimit = getPlanSizeLimit(userPlan)
    if (pdfBuffer.length > sizeLimit) {
      const sizeMb = (pdfBuffer.length / 1024 / 1024).toFixed(1)
      const limitMb = (sizeLimit / 1024 / 1024).toFixed(0)
      throw new Error(`PDF is ${sizeMb} MB — exceeds the ${limitMb} MB limit on the Free plan. Upgrade to remove this limit.`)
    }

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

    await prisma.usageEvent.create({
      data: {
        userId: job.userId,
        teamId: job.teamId,
        apiKeyId: job.apiKeyId,
        endpoint: "pdf-render",
        statusCode: 200,
      },
    })

    await deliverWebhooks(job.userId, "job.completed", {
      job_id: job.id,
      status: "succeeded",
      pdf_url: resultUrl,
    }, job.teamId)

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

    await deliverWebhooks(job.userId, "job.failed", {
      job_id: job.id,
      status: "failed",
      error: { code: "render_failed", message: errorMessage },
    }, job.teamId)

    throw err
  }
}
