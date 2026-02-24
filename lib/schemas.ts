import { z } from "zod"

export const HTML_MAX_BYTES = 5 * 1024 * 1024 // 5 MB

// ── Dangerous headers that must not be forwarded ─────────────────────────────
const BLOCKED_HEADERS = new Set([
  "host",
  "content-length",
  "content-encoding",
  "transfer-encoding",
  "connection",
  "upgrade",
  "proxy-authorization",
  "proxy-connection",
  "te",
  "trailer",
  "keep-alive",
])

export const pdfOptionsSchema = z
  .object({
    format: z.enum(["A4", "Letter", "Legal", "Tabloid", "A3", "A5", "A6"]).optional(),
    width: z.string().optional(),
    height: z.string().optional(),
    landscape: z.boolean().optional(),
    printBackground: z.boolean().optional(),
    preferCSSPageSize: z.boolean().optional(),
    scale: z.number().min(0.1).max(2).optional(),
    pageRanges: z.string().optional(),
    margin: z
      .object({
        top: z.string().optional(),
        right: z.string().optional(),
        bottom: z.string().optional(),
        left: z.string().optional(),
      })
      .optional(),
    displayHeaderFooter: z.boolean().optional(),
    headerTemplate: z.string().optional(),
    footerTemplate: z.string().optional(),
    tagged: z.boolean().optional(),
    outline: z.boolean().optional(),
    waitFor: z.number().min(0).max(10).optional(),

    // F1: waitForSelector — CSS selector to wait for before capture
    waitForSelector: z.string().max(500).optional(),

    // F4: PDF metadata
    metadata: z
      .object({
        title: z.string().max(500).optional(),
        author: z.string().max(500).optional(),
        subject: z.string().max(500).optional(),
        keywords: z.string().max(1000).optional(),
      })
      .optional(),

    // F5: watermark
    watermark: z
      .object({
        text: z.string().min(1).max(200),
        color: z.string().max(50).optional(),
        opacity: z.number().min(0).max(1).optional(),
        fontSize: z.number().min(8).max(200).optional(),
        rotation: z.number().min(-360).max(360).optional(),
      })
      .optional(),
  })
  .optional()

export const convertSchema = z.object({
  input: z.object({
    type: z.enum(["html", "url", "template"]),
    content: z.string().optional(),
    template_id: z.string().optional(),

    // F3: custom headers for URL renders
    headers: z
      .record(z.string())
      .optional()
      .refine(
        (h) => {
          if (!h) return true
          const keys = Object.keys(h)
          if (keys.length > 20) return false
          return keys.every((k) => !BLOCKED_HEADERS.has(k.toLowerCase()))
        },
        {
          message:
            "headers: max 20 entries, blocked headers (Host, Content-Length, etc.) not allowed",
        }
      ),
  }),
  options: pdfOptionsSchema,
  variables: z.record(z.string()).optional(),

  // F2: custom download filename
  filename: z
    .string()
    .max(255)
    .regex(/^[a-zA-Z0-9._-]+$/, "filename must contain only letters, numbers, dots, hyphens, and underscores")
    .optional(),

  // F6: per-job webhook URL
  webhook_url: z.string().url().optional(),
})

// ── PDF Merge ────────────────────────────────────────────────────────────────

export const mergeSchema = z.object({
  // Array of file tokens from previously rendered PDFs
  sources: z
    .array(z.string().min(1))
    .min(2, "At least 2 PDFs are required to merge")
    .max(50, "Maximum 50 PDFs per merge"),

  // Optional metadata for the merged PDF
  metadata: z
    .object({
      title: z.string().max(500).optional(),
      author: z.string().max(500).optional(),
      subject: z.string().max(500).optional(),
      keywords: z.string().max(1000).optional(),
    })
    .optional(),

  // Custom download filename
  filename: z
    .string()
    .max(255)
    .regex(
      /^[a-zA-Z0-9._-]+$/,
      "filename must contain only letters, numbers, dots, hyphens, and underscores"
    )
    .optional(),
})
