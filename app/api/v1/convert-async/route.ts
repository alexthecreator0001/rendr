import { NextRequest } from "next/server"
import { z } from "zod"
import { requireApiKey } from "@/lib/require-api-key"
import { checkRateLimit } from "@/lib/rate-limit"
import { prisma } from "@/lib/db"
import { getQueue } from "@/lib/queue"
import { apiError, ApiError } from "@/lib/errors"

const HTML_MAX_BYTES = 5 * 1024 * 1024 // 5 MB

const pdfOptionsSchema = z
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
  })
  .optional()

const convertSchema = z.object({
  input: z.object({
    type: z.enum(["html", "url", "template"]),
    content: z.string().optional(),
    template_id: z.string().optional(),
  }),
  options: pdfOptionsSchema,
  variables: z.record(z.string()).optional(),
})

const BASE_URL = () => process.env.AUTH_URL ?? process.env.NEXTAUTH_URL ?? "http://localhost:3000"

export async function POST(req: NextRequest) {
  try {
    const { user, apiKey, teamId } = await requireApiKey(req)

    const rateLimit = checkRateLimit(apiKey.id)
    if (!rateLimit.ok) {
      return apiError(429, "Rate limit exceeded.", "rate_limit_exceeded")
    }

    const body = await req.json().catch(() => null)
    if (!body) return apiError(400, "Invalid JSON body", "invalid_request")

    const parsed = convertSchema.safeParse(body)
    if (!parsed.success) {
      return apiError(400, parsed.error.errors[0]?.message ?? "Invalid request", "invalid_request")
    }

    const { input, options, variables } = parsed.data

    // Enforce HTML payload size limit
    if (input.type === "html" && input.content && input.content.length > HTML_MAX_BYTES) {
      return apiError(413, "HTML content exceeds the 5 MB limit", "payload_too_large")
    }

    const idempotencyKey = req.headers.get("idempotency-key")

    if (idempotencyKey) {
      const existing = await prisma.job.findFirst({
        where: { userId: user.id, idempotencyKey },
      })
      if (existing) {
        return Response.json(
          {
            job_id: existing.id,
            status: existing.status,
            status_url: `${BASE_URL()}/api/v1/jobs/${existing.id}`,
          },
          { status: 202 }
        )
      }
    }

    if (input.type === "template") {
      if (!input.template_id)
        return apiError(400, "template_id required", "invalid_request")
      const tmpl = await prisma.template.findFirst({
        where: { id: input.template_id, ...(teamId ? { teamId } : { userId: user.id }) },
      })
      if (!tmpl) return apiError(404, "Template not found", "template_not_found")
    }

    const job = await prisma.job.create({
      data: {
        userId: user.id,
        teamId,
        apiKeyId: apiKey.id,
        inputType: input.type,
        inputContent: input.type !== "template" ? input.content : null,
        templateId: input.type === "template" ? input.template_id : null,
        optionsJson: { ...options, variables: variables ?? {} },
        idempotencyKey,
      },
    })

    await prisma.usageEvent.create({
      data: {
        userId: user.id,
        teamId,
        apiKeyId: apiKey.id,
        endpoint: "/api/v1/convert-async",
        statusCode: 202,
      },
    })

    const queue = await getQueue()
    await queue.send("pdf-conversion", { jobId: job.id })

    return Response.json(
      {
        job_id: job.id,
        status: "queued",
        status_url: `${BASE_URL()}/api/v1/jobs/${job.id}`,
      },
      { status: 202 }
    )
  } catch (e) {
    if (e instanceof ApiError) return apiError(e.status, e.message, e.code)
    console.error("[convert-async]", e)
    return apiError(500, "Internal server error", "internal_error")
  }
}
