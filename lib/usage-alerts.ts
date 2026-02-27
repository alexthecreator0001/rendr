import { prisma } from "@/lib/db"
import { getPlanRenderLimit } from "@/lib/plans"
import { sendUsageWarningEmail, sendUsageLimitReachedEmail } from "@/lib/email"

export async function checkUsageThresholds(userId: string): Promise<void> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { email: true, plan: true },
  })
  if (!user) return

  const limit = getPlanRenderLimit(user.plan)
  if (!isFinite(limit)) return

  const startOfMonth = new Date()
  startOfMonth.setDate(1)
  startOfMonth.setHours(0, 0, 0, 0)

  const used = await prisma.job.count({
    where: { userId, createdAt: { gte: startOfMonth } },
  })

  // Send at exactly 80% mark
  if (used === Math.floor(limit * 0.8)) {
    await sendUsageWarningEmail(user.email, used, limit)
  }
  // Send at exactly 100% mark
  else if (used === limit) {
    await sendUsageLimitReachedEmail(user.email, limit)
  }
}
