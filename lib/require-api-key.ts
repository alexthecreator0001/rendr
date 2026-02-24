import type { ApiKey, User } from "@prisma/client"
import { prisma } from "./db"
import { hashApiKey } from "./api-key"
import { ApiError } from "./errors"

export async function requireApiKey(
  req: Request
): Promise<{ user: User; apiKey: ApiKey; teamId: string | null }> {
  const authHeader = req.headers.get("authorization")

  if (!authHeader?.startsWith("Bearer ")) {
    throw new ApiError(
      401,
      "Missing Authorization header. Expected: Authorization: Bearer <api_key>",
      "missing_auth"
    )
  }

  const key = authHeader.slice(7).trim()
  if (!key) {
    throw new ApiError(401, "Empty API key", "missing_auth")
  }

  const keyHash = hashApiKey(key)

  const apiKey = await prisma.apiKey.findUnique({
    where: { keyHash },
    include: { user: true },
  })

  if (!apiKey) {
    throw new ApiError(401, "Invalid API key", "invalid_api_key")
  }

  if (apiKey.revokedAt) {
    throw new ApiError(
      401,
      "This API key has been revoked",
      "revoked_api_key"
    )
  }

  // Update lastUsedAt in the background — don't block the request
  prisma.apiKey
    .update({
      where: { id: apiKey.id },
      data: { lastUsedAt: new Date() },
    })
    .catch(() => {
      // Ignore errors — this is best-effort
    })

  const { user, ...keyWithoutUser } = apiKey as ApiKey & { user: User }
  return { user, apiKey: keyWithoutUser, teamId: keyWithoutUser.teamId ?? null }
}
