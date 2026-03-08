import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { exchangeCode } from "@/lib/google-sheets"
import { encrypt } from "@/lib/encryption"
import { google } from "googleapis"
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

    // Get the Google account email
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    )
    oauth2Client.setCredentials(tokens)
    const oauth2 = google.oauth2({ version: "v2", auth: oauth2Client })
    const userInfo = await oauth2.userinfo.get()
    const email = userInfo.data.email ?? "unknown"

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
