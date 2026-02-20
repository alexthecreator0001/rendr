import { NextRequest } from "next/server"
import { z } from "zod"
import crypto from "node:crypto"
import { requireApiKey } from "@/lib/require-api-key"
import { prisma } from "@/lib/db"
import { apiError, ApiError } from "@/lib/errors"

const VALID_EVENTS = ["job.completed", "job.failed"] as const

const createSchema = z.object({
  url: z.string().url(),
  events: z.array(z.enum(VALID_EVENTS)).min(1),
  enabled: z.boolean().optional().default(true),
})

export async function GET(req: NextRequest) {
  try {
    const { user } = await requireApiKey(req)
    const webhooks = await prisma.webhook.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      select: { id: true, url: true, events: true, enabled: true, createdAt: true },
    })
    return Response.json({ webhooks })
  } catch (e) {
    if (e instanceof ApiError) return apiError(e.status, e.message, e.code)
    return apiError(500, "Internal server error", "internal_error")
  }
}

export async function POST(req: NextRequest) {
  try {
    const { user } = await requireApiKey(req)
    const body = await req.json().catch(() => null)
    const parsed = createSchema.safeParse(body)
    if (!parsed.success) {
      return apiError(400, parsed.error.errors[0]?.message ?? "Invalid", "invalid_request")
    }

    const secret = `whsec_${crypto.randomBytes(32).toString("base64url")}`
    const webhook = await prisma.webhook.create({
      data: {
        userId: user.id,
        url: parsed.data.url,
        events: parsed.data.events,
        enabled: parsed.data.enabled,
        secret,
      },
    })

    // Return secret only at creation
    return Response.json(
      {
        webhook: {
          id: webhook.id,
          url: webhook.url,
          events: webhook.events,
          enabled: webhook.enabled,
          secret: webhook.secret,
          createdAt: webhook.createdAt,
        },
      },
      { status: 201 }
    )
  } catch (e) {
    if (e instanceof ApiError) return apiError(e.status, e.message, e.code)
    return apiError(500, "Internal server error", "internal_error")
  }
}
