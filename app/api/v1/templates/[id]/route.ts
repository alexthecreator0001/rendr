import { NextRequest } from "next/server"
import { z } from "zod"
import { requireApiKey } from "@/lib/require-api-key"
import { prisma } from "@/lib/db"
import { apiError, ApiError } from "@/lib/errors"

const updateSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  html: z.string().min(1).optional(),
})

async function getOwned(userId: string, id: string) {
  const tmpl = await prisma.template.findUnique({ where: { id } })
  if (!tmpl || tmpl.userId !== userId) return null
  return tmpl
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user } = await requireApiKey(req)
    const { id } = await params
    const tmpl = await getOwned(user.id, id)
    if (!tmpl) return apiError(404, "Template not found", "not_found")
    return Response.json({ template: tmpl })
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
    const tmpl = await getOwned(user.id, id)
    if (!tmpl) return apiError(404, "Template not found", "not_found")

    const body = await req.json().catch(() => null)
    const parsed = updateSchema.safeParse(body)
    if (!parsed.success) {
      return apiError(400, parsed.error.errors[0]?.message ?? "Invalid", "invalid_request")
    }

    const updated = await prisma.template.update({
      where: { id },
      data: parsed.data,
    })

    return Response.json({ template: updated })
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
    const tmpl = await getOwned(user.id, id)
    if (!tmpl) return apiError(404, "Template not found", "not_found")
    await prisma.template.delete({ where: { id } })
    return new Response(null, { status: 204 })
  } catch (e) {
    if (e instanceof ApiError) return apiError(e.status, e.message, e.code)
    return apiError(500, "Internal server error", "internal_error")
  }
}
