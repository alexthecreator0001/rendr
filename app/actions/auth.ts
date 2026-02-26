"use server";

import { signIn, signOut } from "@/auth";
import { prisma } from "@/lib/db";
import { hashPassword, verifyPassword } from "@/lib/auth-utils";
import { seedStarterTemplates } from "@/lib/starter-templates";
import { sendWelcomeEmail, sendVerificationEmail, sendPasswordResetEmail } from "@/lib/email";
import { z } from "zod";
import crypto, { randomInt } from "node:crypto";
import { AuthError } from "next-auth";
import { auth } from "@/auth";

// ─── Simple IP-based rate limiter for auth endpoints ─────────────────────────
const AUTH_RATE_STORE = new Map<string, { count: number; resetAt: number }>();
const AUTH_RATE_LIMIT = 10; // max attempts per window
const AUTH_RATE_WINDOW = 15 * 60 * 1000; // 15 minutes

function checkAuthRateLimit(key: string): boolean {
  const now = Date.now();
  const entry = AUTH_RATE_STORE.get(key);
  if (!entry || entry.resetAt < now) {
    AUTH_RATE_STORE.set(key, { count: 1, resetAt: now + AUTH_RATE_WINDOW });
    return true;
  }
  if (entry.count >= AUTH_RATE_LIMIT) return false;
  entry.count++;
  return true;
}

// Clean up expired entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of AUTH_RATE_STORE.entries()) {
    if (entry.resetAt < now) AUTH_RATE_STORE.delete(key);
  }
}, 5 * 60_000);

// Verification code attempt tracking (max 5 failed attempts per user)
const VERIFY_ATTEMPTS = new Map<string, { count: number; resetAt: number }>();
const VERIFY_MAX_ATTEMPTS = 5;
const VERIFY_WINDOW = 15 * 60 * 1000; // 15 minutes

function checkVerifyRateLimit(userId: string): boolean {
  const now = Date.now();
  const entry = VERIFY_ATTEMPTS.get(userId);
  if (!entry || entry.resetAt < now) {
    VERIFY_ATTEMPTS.set(userId, { count: 1, resetAt: now + VERIFY_WINDOW });
    return true;
  }
  if (entry.count >= VERIFY_MAX_ATTEMPTS) return false;
  entry.count++;
  return true;
}

function clearVerifyAttempts(userId: string) {
  VERIFY_ATTEMPTS.delete(userId);
}

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const registerSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  email: z.string().email(),
  password: z.string().min(8),
});

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Generate a unique 6-digit verification code and store it. Retries on collision. */
async function createVerificationCode(userId: string): Promise<string> {
  // Clear any existing tokens for this user
  await prisma.verificationToken.deleteMany({ where: { userId } });

  for (let attempt = 0; attempt < 5; attempt++) {
    const code = String(randomInt(100000, 1000000));
    try {
      await prisma.verificationToken.create({
        data: {
          userId,
          token: code,
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24h
        },
      });
      return code;
    } catch {
      // Unique constraint violation — retry with a different code
    }
  }
  throw new Error("Failed to generate verification code. Please try again.");
}

// ─── Login ───────────────────────────────────────────────────────────────────

export async function loginAction(
  _prevState: { error?: string } | null,
  formData: FormData
): Promise<{ error?: string }> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: "Invalid email or password." };
  }

  // Rate limit login attempts by email
  if (!checkAuthRateLimit(`login:${parsed.data.email}`)) {
    return { error: "Too many login attempts. Please try again later." };
  }

  try {
    await signIn("credentials", {
      email: parsed.data.email,
      password: parsed.data.password,
      redirectTo: "/app",
    });
  } catch (err) {
    if (err instanceof AuthError) {
      return { error: "Invalid email or password." };
    }
    throw err;
  }

  return {};
}

// ─── Register ────────────────────────────────────────────────────────────────

export async function registerAction(
  _prevState: { error?: string } | null,
  formData: FormData
): Promise<{ error?: string }> {
  const rawName = (formData.get("name") as string)?.trim();
  const parsed = registerSchema.safeParse({
    name: rawName || undefined,
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    const issues = parsed.error.issues.map((i) => i.message).join(", ");
    return { error: issues };
  }

  // Rate limit registration attempts by email
  if (!checkAuthRateLimit(`register:${parsed.data.email}`)) {
    return { error: "Too many attempts. Please try again later." };
  }

  const existing = await prisma.user.findUnique({
    where: { email: parsed.data.email },
  });

  if (existing) {
    // Generic message to prevent email enumeration
    return { error: "Unable to create account. Please try a different email or sign in." };
  }

  const passwordHash = await hashPassword(parsed.data.password);

  const emailEnabled = !!process.env.RESEND_API_KEY;

  const newUser = await prisma.user.create({
    data: {
      name: parsed.data.name ?? null,
      email: parsed.data.email,
      passwordHash,
      // Auto-verify immediately if no email service configured
      ...(!emailEnabled ? { emailVerified: new Date() } : {}),
    },
  });

  // Seed starter templates in the background
  seedStarterTemplates(newUser.id, prisma).catch(() => {});

  // Send welcome email in the background
  sendWelcomeEmail(newUser.email).catch(() => {});

  // If email is configured, create a verification code and redirect to verify page
  if (emailEnabled) {
    try {
      const code = await createVerificationCode(newUser.id);
      sendVerificationEmail(newUser.email, code).catch(() => {});
    } catch {
      // Non-fatal — user can request resend
    }
  }

  const redirectTo = emailEnabled ? "/verify-email" : "/app";

  try {
    await signIn("credentials", {
      email: parsed.data.email,
      password: parsed.data.password,
      redirectTo,
    });
  } catch (err) {
    if (err instanceof AuthError) {
      return { error: "Account created. Please sign in." };
    }
    throw err;
  }

  return {};
}

// ─── Sign out ────────────────────────────────────────────────────────────────

export async function signOutAction() {
  await signOut({ redirectTo: "/login" });
}

// ─── Email verification ──────────────────────────────────────────────────────

export async function verifyEmailCodeAction(
  _prev: { error?: string; success?: boolean } | null,
  formData: FormData
): Promise<{ error?: string; success?: boolean }> {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated." };

  // Collect 6 separate digit inputs (d0–d5)
  const code = [0, 1, 2, 3, 4, 5]
    .map((i) => ((formData.get(`d${i}`) as string) ?? "").trim())
    .join("");

  if (!/^\d{6}$/.test(code)) {
    return { error: "Please enter the complete 6-digit code." };
  }

  // Rate limit verification attempts per user
  if (!checkVerifyRateLimit(session.user.id)) {
    return { error: "Too many attempts. Please request a new code." };
  }

  const record = await prisma.verificationToken.findFirst({
    where: {
      userId: session.user.id,
      token: code,
      expiresAt: { gt: new Date() },
    },
  });

  if (!record) {
    return { error: "Invalid or expired code. Request a new one below." };
  }

  clearVerifyAttempts(session.user.id);

  await Promise.all([
    prisma.user.update({
      where: { id: session.user.id },
      data: { emailVerified: new Date() },
    }),
    prisma.verificationToken.delete({ where: { id: record.id } }),
  ]);

  return { success: true };
}

export async function resendVerificationCodeAction(): Promise<{
  error?: string;
  success?: boolean;
}> {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated." };

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { email: true },
  });
  if (!user) return { error: "User not found." };

  try {
    const code = await createVerificationCode(session.user.id);
    sendVerificationEmail(user.email, code).catch(() => {});
    return { success: true };
  } catch {
    return { error: "Failed to generate code. Please try again." };
  }
}

// ─── Change password ─────────────────────────────────────────────────────────

export async function changePasswordAction(
  _prevState: { error?: string; success?: boolean } | null,
  formData: FormData
): Promise<{ error?: string; success?: boolean }> {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated." };

  const current = (formData.get("current") as string) ?? "";
  const next = (formData.get("new") as string) ?? "";
  const confirm = (formData.get("confirm") as string) ?? "";

  if (next.length < 8) return { error: "New password must be at least 8 characters." };
  if (next !== confirm) return { error: "Passwords don't match." };

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) return { error: "User not found." };

  const valid = await verifyPassword(current, user.passwordHash);
  if (!valid) return { error: "Current password is incorrect." };

  const hash = await hashPassword(next);
  await prisma.user.update({ where: { id: session.user.id }, data: { passwordHash: hash } });

  return { success: true };
}

// ─── Forgot password (request reset) ────────────────────────────────────────

export async function forgotPasswordAction(
  _prevState: { error?: string; success?: boolean } | null,
  formData: FormData
): Promise<{ error?: string; success?: boolean }> {
  const email = (formData.get("email") as string)?.trim().toLowerCase();

  if (!email || !z.string().email().safeParse(email).success) {
    return { error: "Please enter a valid email address." };
  }

  if (!checkAuthRateLimit(`reset:${email}`)) {
    return { error: "Too many attempts. Please try again later." };
  }

  // Always return success to prevent email enumeration
  const user = await prisma.user.findUnique({ where: { email }, select: { id: true } });

  if (user) {
    // Delete any existing tokens for this email
    await prisma.passwordResetToken.deleteMany({ where: { email } });

    const rawToken = crypto.randomBytes(32).toString("base64url");
    const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");
    await prisma.passwordResetToken.create({
      data: {
        email,
        token: tokenHash,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
      },
    });

    // Email the raw token; only the hash is stored
    sendPasswordResetEmail(email, rawToken).catch(() => {});
  }

  return { success: true };
}

// ─── Reset password (with token) ────────────────────────────────────────────

export async function resetPasswordAction(
  _prevState: { error?: string; success?: boolean } | null,
  formData: FormData
): Promise<{ error?: string; success?: boolean }> {
  const rawToken = (formData.get("token") as string)?.trim();
  const password = (formData.get("password") as string) ?? "";
  const confirm = (formData.get("confirm") as string) ?? "";

  if (!rawToken) return { error: "Invalid reset link." };
  if (password.length < 8) return { error: "Password must be at least 8 characters." };
  if (password !== confirm) return { error: "Passwords don't match." };

  // Hash the submitted token to match the stored hash
  const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");
  const record = await prisma.passwordResetToken.findUnique({ where: { token: tokenHash } });

  if (!record || record.expiresAt < new Date()) {
    // Clean up expired token
    if (record) await prisma.passwordResetToken.delete({ where: { id: record.id } });
    return { error: "This reset link has expired. Please request a new one." };
  }

  const passwordHash = await hashPassword(password);

  await Promise.all([
    prisma.user.update({
      where: { email: record.email },
      data: { passwordHash },
    }),
    prisma.passwordResetToken.delete({ where: { id: record.id } }),
  ]);

  return { success: true };
}
