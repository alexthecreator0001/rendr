import crypto from "node:crypto"

/**
 * Generate a new API key.
 * Returns the plaintext key (shown once), its SHA-256 hash (stored in DB),
 * and the prefix (first 16 chars, shown in UI for identification).
 */
export function generateApiKey(): {
  key: string
  keyHash: string
  keyPrefix: string
} {
  const raw = crypto.randomBytes(32).toString("base64url")
  const key = `rk_live_${raw}`
  const keyHash = hashApiKey(key)
  const keyPrefix = key.slice(0, 16)
  return { key, keyHash, keyPrefix }
}

/**
 * Hash an API key using SHA-256 for storage/lookup.
 */
export function hashApiKey(key: string): string {
  return crypto.createHash("sha256").update(key).digest("hex")
}
