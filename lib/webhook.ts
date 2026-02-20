import crypto from "node:crypto"
import { prisma } from "./db"

const RETRY_ATTEMPTS = parseInt(
  process.env.WEBHOOK_RETRY_ATTEMPTS ?? "3",
  10
)
const RETRY_DELAY_MS = parseInt(
  process.env.WEBHOOK_RETRY_DELAY_MS ?? "1000",
  10
)

/**
 * Sign a payload with HMAC-SHA256.
 * Returns the hex signature (without the "sha256=" prefix).
 */
export function signPayload(secret: string, body: string): string {
  return crypto
    .createHmac("sha256", secret)
    .update(body)
    .digest("hex")
}

/**
 * Find all enabled webhooks for a user that subscribe to this event,
 * and deliver the payload to each one with retries.
 */
export async function deliverWebhooks(
  userId: string,
  event: string,
  payload: Record<string, unknown>
): Promise<void> {
  const webhooks = await prisma.webhook.findMany({
    where: {
      userId,
      enabled: true,
      events: { has: event },
    },
  })

  // Fire deliveries in parallel, don't fail if one fails
  await Promise.allSettled(
    webhooks.map((wh) =>
      deliverSingle(wh.url, wh.secret, event, payload)
    )
  )
}

async function deliverSingle(
  url: string,
  secret: string,
  event: string,
  payload: Record<string, unknown>
): Promise<void> {
  const body = JSON.stringify({
    event,
    ...payload,
    timestamp: new Date().toISOString(),
  })
  const signature = signPayload(secret, body)

  for (let attempt = 0; attempt < RETRY_ATTEMPTS; attempt++) {
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Rendr-Signature": `sha256=${signature}`,
          "X-Rendr-Event": event,
        },
        body,
        signal: AbortSignal.timeout(10_000),
      })
      if (res.ok) return
    } catch {
      // Network error or timeout — retry
    }

    if (attempt < RETRY_ATTEMPTS - 1) {
      const delay = RETRY_DELAY_MS * Math.pow(2, attempt)
      await new Promise((r) => setTimeout(r, delay))
    }
  }
}
