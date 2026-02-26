import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { z } from "zod"
import { prisma } from "@/lib/db"
import { verifyPassword } from "@/lib/auth-utils"

export const { handlers, auth, signIn, signOut } = NextAuth({
  // NextAuth v5 renamed NEXTAUTH_SECRET → AUTH_SECRET. Support both.
  secret: process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET,
  // Required when running behind a reverse proxy (nginx, Cloudflare, etc.)
  trustHost: true,
  // Cloudflare Flexible SSL sends HTTP to origin, so NextAuth would normally
  // drop the Secure flag and switch to unprefixed cookie names — causing every
  // request to create a *new* unreadable cookie and effectively signing the
  // user out immediately. Force the production cookie names explicitly so they
  // are stable regardless of the transport between Cloudflare and the origin.
  cookies:
    process.env.NODE_ENV === "production"
      ? {
          sessionToken: {
            name: "next-auth.session-token",
            options: {
              httpOnly: true,
              sameSite: "lax" as const,
              path: "/",
              secure: true,
            },
          },
          callbackUrl: {
            name: "next-auth.callback-url",
            options: { sameSite: "lax" as const, path: "/", secure: true },
          },
          csrfToken: {
            name: "next-auth.csrf-token",
            options: { httpOnly: true, sameSite: "lax" as const, path: "/", secure: true },
          },
        }
      : undefined,
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsed = z
          .object({
            email: z.string().email(),
            password: z.string().min(1),
          })
          .safeParse(credentials)

        if (!parsed.success) return null

        const user = await prisma.user.findUnique({
          where: { email: parsed.data.email },
          select: { id: true, name: true, email: true, passwordHash: true, role: true, emailVerified: true, bannedAt: true, passwordChangedAt: true },
        })

        if (!user) return null

        // Block banned users from logging in
        if (user.bannedAt) return null

        const valid = await verifyPassword(parsed.data.password, user.passwordHash)
        if (!valid) return null

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          emailVerified: user.emailVerified,
          passwordChangedAt: user.passwordChangedAt,
        }
      },
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) {
      if (user?.id) token.id = user.id
      if (user?.name) token.name = user.name
      if ((user as { role?: string })?.role) token.role = (user as { role?: string }).role
      if ("emailVerified" in (user ?? {})) token.emailVerified = (user as { emailVerified?: Date | null }).emailVerified
      if ((user as { passwordChangedAt?: Date })?.passwordChangedAt) {
        token.passwordChangedAt = (user as { passwordChangedAt: Date }).passwordChangedAt.getTime()
      }

      // On subsequent requests (not initial login), verify password hasn't changed.
      // Throttle to once every 5 minutes to avoid a DB hit on every request.
      const CHECK_INTERVAL = 5 * 60 * 1000
      const lastCheck = (token.lastSecurityCheck as number) ?? 0
      if (!user && token.id && token.passwordChangedAt && Date.now() - lastCheck > CHECK_INTERVAL) {
        token.lastSecurityCheck = Date.now()
        const dbUser = await prisma.user.findUnique({
          where: { id: token.id as string },
          select: { passwordChangedAt: true, bannedAt: true },
        })
        // Invalidate session if password was changed after this token was issued, or user was banned
        if (!dbUser || dbUser.bannedAt || dbUser.passwordChangedAt.getTime() > (token.passwordChangedAt as number)) {
          return { ...token, invalidated: true }
        }
      }

      return token
    },
    session({ session, token }) {
      // Block invalidated sessions
      if (token.invalidated) {
        return { ...session, user: { ...session.user, id: "" } }
      }
      if (token.id) session.user.id = token.id as string
      if (token.name) session.user.name = token.name as string
      if (token.role) session.user.role = token.role as string
      session.user.emailVerified = (token.emailVerified as Date | null) ?? null
      return session
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
})
