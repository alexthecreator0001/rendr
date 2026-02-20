import { NextRequest } from "next/server"
import { requireApiKey } from "@/lib/require-api-key"
import { prisma } from "@/lib/db"
import { apiError, ApiError } from "@/lib/errors"

function startOf(daysAgo: number) {
  const d = new Date()
  d.setDate(d.getDate() - daysAgo)
  d.setHours(0, 0, 0, 0)
  return d
}

export async function GET(req: NextRequest) {
  try {
    const { user } = await requireApiKey(req)

    const [today, last7d, last30d] = await Promise.all([
      prisma.usageEvent.count({
        where: { userId: user.id, createdAt: { gte: startOf(0) } },
      }),
      prisma.usageEvent.count({
        where: { userId: user.id, createdAt: { gte: startOf(7) } },
      }),
      prisma.usageEvent.count({
        where: { userId: user.id, createdAt: { gte: startOf(30) } },
      }),
    ])

    return Response.json({ today, last_7_days: last7d, last_30_days: last30d })
  } catch (e) {
    if (e instanceof ApiError) return apiError(e.status, e.message, e.code)
    return apiError(500, "Internal server error", "internal_error")
  }
}
