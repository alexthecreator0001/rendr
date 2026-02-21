import PgBoss from "pg-boss"
import { prisma } from "@/lib/db"
import { processJob } from "./processor"

// Atomically claim one queued job from Prisma (FOR UPDATE SKIP LOCKED)
async function pollAndProcess() {
  try {
    const jobs = await prisma.$queryRaw<{ id: string }[]>`
      UPDATE "Job"
      SET status = 'processing'
      WHERE id = (
        SELECT id FROM "Job"
        WHERE status = 'queued'
        ORDER BY "createdAt" ASC
        LIMIT 1
        FOR UPDATE SKIP LOCKED
      )
      RETURNING id
    `
    if (jobs.length > 0) {
      const jobId = jobs[0].id
      console.log(`[worker] Claimed queued job ${jobId}`)
      processJob(jobId).catch((err) =>
        console.error(`[worker] processJob error for ${jobId}:`, err)
      )
    }
  } catch {
    // DB hiccup — will retry next tick
  }
}

async function main() {
  console.log("[worker] Starting Rendr PDF worker...")

  if (!process.env.DATABASE_URL) {
    console.error("[worker] DATABASE_URL is required")
    process.exit(1)
  }

  // pg-boss: still used by the public API routes (/api/v1/convert*)
  const boss = new PgBoss({
    connectionString: process.env.DATABASE_URL,
    schema: "pgboss",
  })
  boss.on("error", (err) => console.error("[worker] pg-boss error:", err))
  await boss.start()
  console.log("[worker] pg-boss connected and started")

  await boss.work<{ jobId: string }>(
    "pdf-conversion",
    { batchSize: 2, pollingIntervalSeconds: 2 },
    async (jobs) => {
      console.log(`[worker] Received ${jobs.length} job(s) via pg-boss`)
      await Promise.all(
        jobs.map(async (job) => {
          console.log(`[worker] Processing job ${job.data.jobId} (pg-boss)`)
          await processJob(job.data.jobId)
        })
      )
    }
  )

  // Prisma-based polling — catches all queued jobs regardless of how they were enqueued
  const pollInterval = setInterval(pollAndProcess, 2000)
  console.log("[worker] Listening for PDF conversion jobs (pg-boss + Prisma poll)...")

  async function shutdown(signal: string) {
    console.log(`[worker] ${signal} received — shutting down gracefully...`)
    clearInterval(pollInterval)
    try {
      await boss.stop()
    } catch {
      // ignore
    }
    await prisma.$disconnect()
    process.exit(0)
  }

  process.on("SIGTERM", () => shutdown("SIGTERM"))
  process.on("SIGINT", () => shutdown("SIGINT"))

  process.stdin.resume()
}

main().catch((err) => {
  console.error("[worker] Fatal error:", err)
  process.exit(1)
})
