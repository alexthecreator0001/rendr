import PgBoss from "pg-boss"
import { processJob } from "./processor"

async function main() {
  console.log("[worker] Starting Rendr PDF worker...")

  if (!process.env.DATABASE_URL) {
    console.error("[worker] DATABASE_URL is required")
    process.exit(1)
  }

  const boss = new PgBoss({
    connectionString: process.env.DATABASE_URL,
    schema: "pgboss",
  })

  boss.on("error", (err) => {
    console.error("[worker] pg-boss error:", err)
  })

  await boss.start()
  console.log("[worker] pg-boss connected and started")

  await boss.work<{ jobId: string }>(
    "pdf-conversion",
    { batchSize: 2, pollingIntervalSeconds: 2 },
    async (jobs) => {
      console.log(`[worker] Received ${jobs.length} job(s)`)
      await Promise.all(
        jobs.map(async (job) => {
          const { jobId } = job.data
          console.log(`[worker] Processing job ${jobId}`)
          await processJob(jobId)
        })
      )
    }
  )

  console.log("[worker] Listening for PDF conversion jobs...")

  // Graceful shutdown
  async function shutdown(signal: string) {
    console.log(`[worker] ${signal} received — shutting down gracefully...`)
    try {
      await boss.stop()
    } catch (err) {
      console.error("[worker] Error stopping pg-boss:", err)
    }
    process.exit(0)
  }

  process.on("SIGTERM", () => shutdown("SIGTERM"))
  process.on("SIGINT", () => shutdown("SIGINT"))

  // Keep process alive
  process.stdin.resume()
}

main().catch((err) => {
  console.error("[worker] Fatal error:", err)
  process.exit(1)
})
