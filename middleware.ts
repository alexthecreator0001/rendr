import { auth } from "@/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const pathname = req.nextUrl.pathname
  const role = (req.auth?.user as { role?: string })?.role

  // Admin routes: must be logged in AND have admin role
  if (pathname.startsWith("/admin")) {
    if (!isLoggedIn) {
      const url = new URL("/login", req.url)
      url.searchParams.set("callbackUrl", pathname)
      return NextResponse.redirect(url)
    }
    if (role !== "admin") {
      // Logged-in non-admins are silently redirected to the dashboard
      return NextResponse.redirect(new URL("/app", req.url))
    }
  }

  // App routes: must be logged in
  if (pathname.startsWith("/app") && !isLoggedIn) {
    const loginUrl = new URL("/login", req.url)
    loginUrl.searchParams.set("callbackUrl", pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/app/:path*", "/admin/:path*"],
}
