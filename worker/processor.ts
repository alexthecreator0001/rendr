import { chromium } from "playwright"
import crypto from "node:crypto"
import { PDFDocument } from "pdf-lib"
import { prisma } from "@/lib/db"
import { saveFile } from "@/lib/storage"
import { deliverWebhooks, deliverJobWebhook } from "@/lib/webhook"
import { assertSafeUrl, buildHostResolverRules } from "@/lib/ssrf-guard"
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
    // Determine extra Chromium args for DNS pinning (prevents DNS rebinding)
    const launchArgs = ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"]

    let resolvedUrlIp: string | null = null
    if (job.inputType === "url" && job.inputContent) {
      const { resolvedIp } = await assertSafeUrl(job.inputContent)
      resolvedUrlIp = resolvedIp
      if (resolvedIp) {
        const hostname = new URL(job.inputContent).hostname
        launchArgs.push(`--host-resolver-rules=${buildHostResolverRules(hostname, resolvedIp)}`)
      }
    }

    browser = await chromium.launch({ args: launchArgs })

    const context = await browser.newContext()
    const page = await context.newPage()
    page.setDefaultTimeout(TIMEOUT)

    const opts = (job.optionsJson as Record<string, unknown>) ?? {}
    const variables = (opts.variables as Record<string, string>) ?? {}

    // F3: custom headers for URL renders
    const customHeaders = (opts.headers as Record<string, string>) ?? null
    if (customHeaders && job.inputType === "url") {
      await page.setExtraHTTPHeaders(customHeaders)
    }

    if (job.inputType === "html") {
      if (!job.inputContent) throw new Error("inputContent is required for html jobs")
      await page.setContent(job.inputContent, { waitUntil: "networkidle" })
    } else if (job.inputType === "url") {
      if (!job.inputContent) throw new Error("inputContent is required for url jobs")
      // DNS is pinned via --host-resolver-rules above, preventing rebinding
      await page.goto(job.inputContent, { waitUntil: "networkidle" })
    } else if (job.inputType === "template") {
      if (!job.template) throw new Error("Template not found")
      let html = job.template.html
      for (const [key, val] of Object.entries(variables)) {
        // Escape regex metacharacters in the key to prevent ReDoS
        const safeKey = key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
        // HTML-escape variable values to prevent script injection
        const safeVal = val
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
          .replace(/"/g, "&quot;")
          .replace(/'/g, "&#39;")
        html = html.replace(new RegExp(`\\{\\{\\s*${safeKey}\\s*\\}\\}`, "g"), safeVal)
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

    // F1: waitForSelector — wait for a CSS selector to appear before capture
    const waitForSelector = typeof opts.waitForSelector === "string" ? opts.waitForSelector : null
    if (waitForSelector) {
      await page.waitForSelector(waitForSelector, { timeout: 10_000 })
    }

    // F5: watermark — inject fixed-position overlay before capture
    const watermark = opts.watermark as {
      text?: string; color?: string; opacity?: number; fontSize?: number; rotation?: number
    } | null
    if (watermark?.text) {
      await page.evaluate((wm) => {
        const el = document.createElement("div")
        // HTML-escape the watermark text
        const safe = wm.text
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
          .replace(/"/g, "&quot;")
        const color = (wm.color || "gray").replace(/[^a-zA-Z0-9#,.()\s%-]/g, "")
        const opacity = wm.opacity ?? 0.15
        const fontSize = wm.fontSize ?? 72
        const rotation = wm.rotation ?? -45
        el.innerHTML = safe
        el.style.cssText = [
          "position: fixed",
          "top: 0",
          "left: 0",
          "width: 100vw",
          "height: 100vh",
          "display: flex",
          "align-items: center",
          "justify-content: center",
          `font-size: ${fontSize}px`,
          "font-family: sans-serif",
          "font-weight: bold",
          `color: ${color}`,
          `opacity: ${opacity}`,
          `transform: rotate(${rotation}deg)`,
          "pointer-events: none",
          "z-index: 2147483647",
          "user-select: none",
        ].join("; ")
        document.body.appendChild(el)
      }, {
        text: watermark.text,
        color: watermark.color,
        opacity: watermark.opacity,
        fontSize: watermark.fontSize,
        rotation: watermark.rotation,
      })
    }

    // Compression: reduce image quality for medium/high
    const compression = typeof opts.compression === "string" ? opts.compression : "off"
    if (compression === "medium" || compression === "high") {
      const quality = compression === "high" ? 0.5 : 0.75
      await page.evaluate((q) => {
        const imgs = document.querySelectorAll("img")
        imgs.forEach((img) => {
          try {
            // Skip tiny images, SVGs, and unloaded images
            if (img.naturalWidth < 50 || img.naturalHeight < 50) return
            if (img.src.endsWith(".svg") || img.src.startsWith("data:image/svg")) return

            const canvas = document.createElement("canvas")
            canvas.width = img.naturalWidth
            canvas.height = img.naturalHeight
            const ctx = canvas.getContext("2d")
            if (!ctx) return
            ctx.drawImage(img, 0, 0)
            const dataUrl = canvas.toDataURL("image/jpeg", q)
            img.src = dataUrl
          } catch {
            // CORS-tainted or other errors — skip
          }
        })
      }, quality)
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

    // F4: PDF metadata + compression via pdf-lib
    let finalPdf: Buffer | Uint8Array = pdfBuffer
    const metadata = opts.metadata as {
      title?: string; author?: string; subject?: string; keywords?: string
    } | null
    const hasMetadata = metadata && (metadata.title || metadata.author || metadata.subject || metadata.keywords)
    const needsCompression = compression !== "off"
    if (hasMetadata || needsCompression) {
      const pdfDoc = await PDFDocument.load(pdfBuffer)
      if (metadata?.title) pdfDoc.setTitle(metadata.title)
      if (metadata?.author) pdfDoc.setAuthor(metadata.author)
      if (metadata?.subject) pdfDoc.setSubject(metadata.subject)
      if (metadata?.keywords) pdfDoc.setKeywords([metadata.keywords])
      if (hasMetadata) pdfDoc.setProducer("Rendr PDF")
      finalPdf = await pdfDoc.save(needsCompression ? { useObjectStreams: true } : {})
    }

    await context.close()
    await browser.close()
    browser = undefined

    // Enforce per-plan PDF size limit
    const userPlan = (await prisma.user.findUnique({
      where: { id: job.userId },
      select: { plan: true },
    }))?.plan ?? "starter"
    const sizeLimit = getPlanSizeLimit(userPlan)
    if (finalPdf.length > sizeLimit) {
      const sizeMb = (finalPdf.length / 1024 / 1024).toFixed(1)
      const limitMb = (sizeLimit / 1024 / 1024).toFixed(0)
      throw new Error(`PDF is ${sizeMb} MB — exceeds the ${limitMb} MB limit on the Free plan. Upgrade to remove this limit.`)
    }

    const { path: resultPath } = await saveFile(job.id, Buffer.from(finalPdf))
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

    // F6: per-job webhook
    const jobWebhookUrl = typeof opts.webhook_url === "string" ? opts.webhook_url : null
    if (jobWebhookUrl) {
      await deliverJobWebhook(jobWebhookUrl, "job.completed", {
        job_id: job.id,
        status: "succeeded",
        pdf_url: resultUrl,
      }).catch((err) => console.error(`[worker] Per-job webhook failed: ${err}`))
    }

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

    // F6: per-job webhook on failure
    const failOpts = (job?.optionsJson as Record<string, unknown>) ?? {}
    const failWebhookUrl = typeof failOpts.webhook_url === "string" ? failOpts.webhook_url : null
    if (failWebhookUrl) {
      await deliverJobWebhook(failWebhookUrl, "job.failed", {
        job_id: job.id,
        status: "failed",
        error: { code: "render_failed", message: errorMessage },
      }).catch((err) => console.error(`[worker] Per-job webhook failed: ${err}`))
    }

    throw err
  }
}
