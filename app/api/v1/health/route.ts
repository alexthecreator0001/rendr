import { prisma } from "@/lib/db"

export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`
    return Response.json({ ok: true, db: true })
  } catch {
    return Response.json({ ok: false, db: false }, { status: 503 })
  }
}
