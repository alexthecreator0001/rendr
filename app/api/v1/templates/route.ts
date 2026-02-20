import { NextRequest } from "next/server"
import { z } from "zod"
import { requireApiKey } from "@/lib/require-api-key"
import { checkRateLimit } from "@/lib/rate-limit"
import { prisma } from "@/lib/db"
import { apiError, ApiError } from "@/lib/errors"

const createSchema = z.object({
  name: z.string().min(1).max(255),
  html: z.string().min(1),
})

export async function GET(req: NextRequest) {
  try {
    const { user } = await requireApiKey(req)

    const templates = await prisma.template.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      select: { id: true, name: true, createdAt: true, updatedAt: true },
    })

    return Response.json({ templates })
  } catch (e) {
    if (e instanceof ApiError) return apiError(e.status, e.message, e.code)
    return apiError(500, "Internal server error", "internal_error")
  }
}

export async function POST(req: NextRequest) {
  try {
    const { user, apiKey } = await requireApiKey(req)

    const rl = checkRateLimit(apiKey.id)
    if (!rl.ok) return apiError(429, "Rate limit exceeded", "rate_limit_exceeded")

    const body = await req.json().catch(() => null)
    const parsed = createSchema.safeParse(body)
    if (!parsed.success) {
      return apiError(400, parsed.error.errors[0]?.message ?? "Invalid request", "invalid_request")
    }

    const template = await prisma.template.create({
      data: { userId: user.id, ...parsed.data },
    })

    return Response.json({ template }, { status: 201 })
  } catch (e) {
    if (e instanceof ApiError) return apiError(e.status, e.message, e.code)
    return apiError(500, "Internal server error", "internal_error")
  }
}
