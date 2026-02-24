import { NextRequest } from "next/server"
import { z } from "zod"
import { requireApiKey } from "@/lib/require-api-key"
import { prisma } from "@/lib/db"
import { apiError, ApiError } from "@/lib/errors"
import { assertSafeUrl } from "@/lib/ssrf-guard"

const updateSchema = z.object({
  url: z.string().url().optional(),
  events: z.array(z.enum(["job.completed", "job.failed"])).min(1).optional(),
  enabled: z.boolean().optional(),
})

async function getOwned(userId: string, id: string, teamId: string | null) {
  const wh = await prisma.webhook.findUnique({ where: { id } })
  if (!wh) return null
  // Allow access if user owns it directly OR it belongs to their team
  if (teamId && wh.teamId === teamId) return wh
  if (wh.userId === userId && !wh.teamId) return wh
  return null
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user, teamId } = await requireApiKey(req)
    const { id } = await params
    const wh = await getOwned(user.id, id, teamId)
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
    const { user, teamId } = await requireApiKey(req)
    const { id } = await params
    const wh = await getOwned(user.id, id, teamId)
    if (!wh) return apiError(404, "Webhook not found", "not_found")

    const body = await req.json().catch(() => null)
    const parsed = updateSchema.safeParse(body)
    if (!parsed.success) {
      return apiError(400, parsed.error.errors[0]?.message ?? "Invalid", "invalid_request")
    }

    // SSRF guard on updated URL
    if (parsed.data.url) {
      try {
        await assertSafeUrl(parsed.data.url)
      } catch (e) {
        return apiError(400, e instanceof Error ? e.message : "Invalid webhook URL", "invalid_request")
      }
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
    const { user, teamId } = await requireApiKey(req)
    const { id } = await params
    const wh = await getOwned(user.id, id, teamId)
    if (!wh) return apiError(404, "Webhook not found", "not_found")
    await prisma.webhook.delete({ where: { id } })
    return new Response(null, { status: 204 })
  } catch (e) {
    if (e instanceof ApiError) return apiError(e.status, e.message, e.code)
    return apiError(500, "Internal server error", "internal_error")
  }
}
