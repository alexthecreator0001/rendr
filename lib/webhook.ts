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
 * Find all enabled webhooks for a user (and optionally a team) that subscribe
 * to this event, and deliver the payload to each one with retries.
 */
export async function deliverWebhooks(
  userId: string,
  event: string,
  payload: Record<string, unknown>,
  teamId?: string | null
): Promise<void> {
  // Fetch personal webhooks + team webhooks (if teamId is set)
  const webhooks = await prisma.webhook.findMany({
    where: teamId
      ? {
          OR: [
            { userId, teamId: null, enabled: true, events: { has: event } },
            { teamId, enabled: true, events: { has: event } },
          ],
        }
      : { userId, enabled: true, events: { has: event } },
  })

  // Fire deliveries in parallel, don't fail if one fails
  await Promise.allSettled(
    webhooks.map((wh) =>
      deliverSingle(wh.url, wh.secret, event, payload)
    )
  )
}

/**
 * Derive a dedicated webhook signing key from NEXTAUTH_SECRET.
 * This prevents the JWT signing secret from being exposed via webhook signatures.
 */
function getJobWebhookSecret(): string {
  const appSecret = process.env.NEXTAUTH_SECRET ?? process.env.AUTH_SECRET ?? ""
  if (!appSecret) return ""
  return crypto.createHmac("sha256", appSecret).update("rendr:webhook:signing").digest("hex")
}

/**
 * Deliver a per-job webhook to a user-supplied URL.
 * Signed with a key derived from NEXTAUTH_SECRET (not the secret itself).
 */
export async function deliverJobWebhook(
  url: string,
  event: string,
  payload: Record<string, unknown>
): Promise<void> {
  const secret = getJobWebhookSecret()
  if (!secret) return
  await deliverSingle(url, secret, event, payload)
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
