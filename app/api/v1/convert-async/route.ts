import { NextRequest } from "next/server"
import { requireApiKey } from "@/lib/require-api-key"
import { checkRateLimit } from "@/lib/rate-limit"
import { prisma } from "@/lib/db"
import { getQueue } from "@/lib/queue"
import { apiError, ApiError } from "@/lib/errors"
import { assertSafeUrl } from "@/lib/ssrf-guard"
import { getPlanRenderLimit } from "@/lib/plans"
import { convertSchema, HTML_MAX_BYTES } from "@/lib/schemas"
import { checkUsageThresholds } from "@/lib/usage-alerts"

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

    const { input, options, variables, webhook_url, filename } = parsed.data

    // F3: headers only allowed with type: "url"
    if (input.headers && input.type !== "url") {
      return apiError(400, "headers are only allowed when input.type is \"url\"", "invalid_request")
    }

    // SSRF guard on webhook_url
    if (webhook_url) {
      try {
        await assertSafeUrl(webhook_url)
      } catch (e) {
        return apiError(400, e instanceof Error ? e.message : "Invalid webhook URL", "invalid_request")
      }
    }

    // Enforce monthly plan render limit
    const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1)
    const monthlyUsage = await prisma.job.count({
      where: { userId: user.id, createdAt: { gte: monthStart } },
    })
    const renderLimit = getPlanRenderLimit(user.plan)
    if (monthlyUsage >= renderLimit) {
      return apiError(
        429,
        `Monthly render limit reached (${renderLimit} on ${user.plan} plan). Upgrade for more.`,
        "plan_limit_exceeded"
      )
    }

    // Enforce HTML payload size limit
    if (input.type === "html" && input.content && input.content.length > HTML_MAX_BYTES) {
      return apiError(413, "HTML content exceeds the 5 MB limit", "payload_too_large")
    }

    // SSRF guard on URL input
    if (input.type === "url" && input.content) {
      try {
        await assertSafeUrl(input.content)
      } catch (e) {
        return apiError(400, e instanceof Error ? e.message : "Invalid URL", "invalid_request")
      }
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
        optionsJson: {
          ...options,
          variables: variables ?? {},
          ...(filename ? { filename } : {}),
          ...(webhook_url ? { webhook_url } : {}),
          ...(input.headers ? { headers: input.headers } : {}),
        },
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

    // Fire-and-forget usage threshold check (sends warning/limit emails)
    checkUsageThresholds(user.id).catch(() => {})

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
