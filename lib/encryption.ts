import crypto from "node:crypto"

const ALGORITHM = "aes-256-gcm"
const KEY_ENV = "ENCRYPTION_KEY"

function getKey(): Buffer {
  const raw = process.env[KEY_ENV]
  if (!raw) throw new Error(`${KEY_ENV} environment variable is required`)
  // Accept hex (64 chars) or base64 (44 chars) encoded 32-byte key
  if (raw.length === 64) return Buffer.from(raw, "hex")
  return Buffer.from(raw, "base64")
}

export function encrypt(plaintext: string): string {
  const key = getKey()
  const iv = crypto.randomBytes(12)
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv)
  const encrypted = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()])
  const tag = cipher.getAuthTag()
  // Format: iv:tag:ciphertext (all hex)
  return `${iv.toString("hex")}:${tag.toString("hex")}:${encrypted.toString("hex")}`
}

export function decrypt(packed: string): string {
  const key = getKey()
  const [ivHex, tagHex, dataHex] = packed.split(":")
  if (!ivHex || !tagHex || !dataHex) throw new Error("Invalid encrypted data format")
  const iv = Buffer.from(ivHex, "hex")
  const tag = Buffer.from(tagHex, "hex")
  const data = Buffer.from(dataHex, "hex")
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv)
  decipher.setAuthTag(tag)
  return Buffer.concat([decipher.update(data), decipher.final()]).toString("utf8")
}
