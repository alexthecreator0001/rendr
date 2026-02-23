import dns from "node:dns/promises"
import net from "node:url"
import { URL } from "node:url"

/**
 * Block of private / reserved IPv4 and IPv6 ranges.
 * Used to prevent SSRF attacks where user-supplied URLs resolve to internal services.
 */
const PRIVATE_PATTERNS = [
  // IPv4 loopback
  /^127\./,
  // IPv4 private
  /^10\./,
  /^172\.(1[6-9]|2\d|3[01])\./,
  /^192\.168\./,
  // Link-local (AWS metadata service, Azure IMDS, etc.)
  /^169\.254\./,
  // CGNAT
  /^100\.(6[4-9]|[7-9]\d|1([01]\d|2[0-7]))\./,
  // "This network"
  /^0\./,
  // IPv6 loopback
  /^::1$/,
  // IPv6 unique-local (fc00::/7)
  /^f[cd]/i,
  // IPv6 link-local (fe80::/10)
  /^fe[89ab]/i,
]

function isPrivateIp(ip: string): boolean {
  const normalized = ip.toLowerCase().replace(/^\[|\]$/g, "")
  return PRIVATE_PATTERNS.some((re) => re.test(normalized))
}

/**
 * Throws if the URL is unsafe to fetch (non-http/https, or resolves to a
 * private / loopback / link-local address). Call this before any user-supplied
 * URL is fetched server-side (webhooks, URL-to-PDF, etc.).
 */
export async function assertSafeUrl(rawUrl: string): Promise<void> {
  let parsed: URL
  try {
    parsed = new URL(rawUrl)
  } catch {
    throw new Error("Invalid URL")
  }

  if (!["http:", "https:"].includes(parsed.protocol)) {
    throw new Error("Only http and https URLs are allowed")
  }

  const hostname = parsed.hostname

  // Block obviously internal hostnames without a DNS lookup
  if (
    hostname === "localhost" ||
    hostname.endsWith(".local") ||
    hostname.endsWith(".internal") ||
    hostname.endsWith(".localhost")
  ) {
    throw new Error("URL points to a private or reserved address")
  }

  // If the hostname is already an IP literal, check it directly
  if (/^[\d.]+$/.test(hostname) || /^\[?[0-9a-f:]+\]?$/i.test(hostname)) {
    const bare = hostname.replace(/^\[|\]$/g, "")
    if (isPrivateIp(bare)) {
      throw new Error("URL points to a private or reserved IP address")
    }
    return
  }

  // Resolve hostname → IPs and check each one
  let addresses: dns.LookupAddress[]
  try {
    addresses = await dns.lookup(hostname, { all: true })
  } catch {
    throw new Error("URL hostname could not be resolved")
  }

  for (const { address } of addresses) {
    if (isPrivateIp(address)) {
      throw new Error("URL resolves to a private or reserved IP address")
    }
  }
}
