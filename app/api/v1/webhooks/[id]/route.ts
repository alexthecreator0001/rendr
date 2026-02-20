import { NextRequest } from "next/server"
import { z } from "zod"
import { requireApiKey } from "@/lib/require-api-key"
import { prisma } from "@/lib/db"
import { apiError, ApiError } from "@/lib/errors"

const updateSchema = z.object({
  url: z.string().url().optional(),
  events: z.array(z.enum(["job.completed", "job.failed"])).min(1).optional(),
  enabled: z.boolean().optional(),
})

async function getOwned(userId: string, id: string) {
  const wh = await prisma.webhook.findUnique({ where: { id } })
  if (!wh || wh.userId !== userId) return null
  return wh
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user } = await requireApiKey(req)
    const { id } = await params
    const wh = await getOwned(user.id, id)
    if (!wh) return apiError(404, "Webhook not found", "not_found")
    const { secret: _, ...safe } = wh
    return Response.json({ webhook: safe })
  } catch (e) {
    if (e instanceof ApiError) return apiError(e.status, e.message, e.code)
    return apiError(500, "Internal server error", "internal_error")
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user } = await requireApiKey(req)
    const { id } = await params
    const wh = await getOwned(user.id, id)
    if (!wh) return apiError(404, "Webhook not found", "not_found")

    const body = await req.json().catch(() => null)
    const parsed = updateSchema.safeParse(body)
    if (!parsed.success) {
      return apiError(400, parsed.error.errors[0]?.message ?? "Invalid", "invalid_request")
    }

    const updated = await prisma.webhook.update({ where: { id }, data: parsed.data })
    const { secret: _, ...safe } = updated
    return Response.json({ webhook: safe })
  } catch (e) {
    if (e instanceof ApiError) return apiError(e.status, e.message, e.code)
    return apiError(500, "Internal server error", "internal_error")
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user } = await requireApiKey(req)
    const { id } = await params
    const wh = await getOwned(user.id, id)
    if (!wh) return apiError(404, "Webhook not found", "not_found")
    await prisma.webhook.delete({ where: { id } })
    return new Response(null, { status: 204 })
  } catch (e) {
    if (e instanceof ApiError) return apiError(e.status, e.message, e.code)
    return apiError(500, "Internal server error", "internal_error")
  }
}
