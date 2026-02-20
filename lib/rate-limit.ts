/**
 * Simple in-memory rate limiter per API key per minute.
 *
 * NOTE: This is per-process only. For multi-instance deployments,
 * replace this with a Redis-backed implementation (e.g. using ioredis
 * with INCR + EXPIRE commands or the sliding window algorithm).
 */

const LIMIT = parseInt(process.env.API_RATE_LIMIT_PER_MINUTE ?? "60", 10)

interface Entry {
  count: number
  resetAt: number
}

const store = new Map<string, Entry>()

export function checkRateLimit(apiKeyId: string): {
  ok: boolean
  remaining: number
  limit: number
} {
  const now = Date.now()
  const entry = store.get(apiKeyId)

  if (!entry || entry.resetAt < now) {
    store.set(apiKeyId, { count: 1, resetAt: now + 60_000 })
    return { ok: true, remaining: LIMIT - 1, limit: LIMIT }
  }

  if (entry.count >= LIMIT) {
    return { ok: false, remaining: 0, limit: LIMIT }
  }

  entry.count++
  return { ok: true, remaining: LIMIT - entry.count, limit: LIMIT }
}

// Periodically clean up expired entries to prevent memory leaks
setInterval(() => {
  const now = Date.now()
  for (const [key, entry] of store.entries()) {
    if (entry.resetAt < now) store.delete(key)
  }
}, 5 * 60_000) // every 5 minutes
