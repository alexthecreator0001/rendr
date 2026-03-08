import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { getGoogleAuthUrl } from "@/lib/google-sheets"
import crypto from "node:crypto"

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.redirect(new URL("/login", process.env.NEXTAUTH_URL))
  }

  // State = signed userId to prevent CSRF
  const secret = process.env.NEXTAUTH_SECRET ?? process.env.AUTH_SECRET ?? ""
  const state = `${session.user.id}:${crypto
    .createHmac("sha256", secret)
    .update(session.user.id)
    .digest("hex")
    .slice(0, 16)}`

  const url = getGoogleAuthUrl(state)
  return NextResponse.redirect(url)
}
