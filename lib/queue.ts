import PgBoss from "pg-boss"

const globalForPgBoss = globalThis as unknown as {
  pgBoss: PgBoss | undefined
}

/**
 * Get the pg-boss singleton (starts it if not already running).
 * Uses a global to survive hot-reloading in development.
 *
 * NOTE: This is safe to call from API routes — pg-boss in "send-only"
 * mode does not consume jobs; only the worker process calls boss.work().
 */
export async function getQueue(): Promise<PgBoss> {
  if (!globalForPgBoss.pgBoss) {
    const boss = new PgBoss({
      connectionString: process.env.DATABASE_URL!,
      schema: "pgboss",
    })
    boss.on("error", (err) =>
      console.error("[pg-boss]", err)
    )
    await boss.start()
    globalForPgBoss.pgBoss = boss
  }
  return globalForPgBoss.pgBoss
}
