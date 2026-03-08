import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { exchangeCode } from "@/lib/google-sheets"
import { encrypt } from "@/lib/encryption"
import crypto from "node:crypto"

export async function GET(req: NextRequest) {
  const baseUrl = process.env.NEXTAUTH_URL ?? "http://localhost:3000"

  const code = req.nextUrl.searchParams.get("code")
  const state = req.nextUrl.searchParams.get("state")
  const error = req.nextUrl.searchParams.get("error")

  if (error || !code || !state) {
    return NextResponse.redirect(
      `${baseUrl}/app/sheets?error=google_auth_failed`
    )
  }

  // Verify state signature
  const [userId, sig] = state.split(":")
  if (!userId || !sig) {
    return NextResponse.redirect(`${baseUrl}/app/sheets?error=invalid_state`)
  }

  const secret = process.env.NEXTAUTH_SECRET ?? process.env.AUTH_SECRET ?? ""
  const expectedSig = crypto
    .createHmac("sha256", secret)
    .update(userId)
    .digest("hex")
    .slice(0, 16)

  if (sig !== expectedSig) {
    return NextResponse.redirect(`${baseUrl}/app/sheets?error=invalid_state`)
  }

  try {
    const tokens = await exchangeCode(code)

    if (!tokens.refresh_token) {
      return NextResponse.redirect(
        `${baseUrl}/app/sheets?error=no_refresh_token`
      )
    }

    // Extract email from id_token JWT (no extra API call needed)
    let email = "unknown"
    if (tokens.id_token) {
      const payload = JSON.parse(
        Buffer.from(tokens.id_token.split(".")[1], "base64url").toString()
      )
      email = payload.email ?? "unknown"
    }

    // Encrypt refresh token before storage
    const encryptedToken = encrypt(tokens.refresh_token)

    // Upsert connection (one per Google account per user)
    await prisma.googleConnection.upsert({
      where: { userId_email: { userId, email } },
      create: {
        userId,
        email,
        refreshToken: encryptedToken,
        scopes: ["spreadsheets.readonly"],
      },
      update: {
        refreshToken: encryptedToken,
        revokedAt: null,
        scopes: ["spreadsheets.readonly"],
      },
    })

    return NextResponse.redirect(`${baseUrl}/app/sheets?connected=true`)
  } catch (err) {
    console.error("[google callback]", err)
    return NextResponse.redirect(
      `${baseUrl}/app/sheets?error=google_auth_failed`
    )
  }
}
