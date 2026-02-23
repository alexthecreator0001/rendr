"use server";

import { signIn, signOut } from "@/auth";
import { prisma } from "@/lib/db";
import { hashPassword, verifyPassword } from "@/lib/auth-utils";
import { seedStarterTemplates } from "@/lib/starter-templates";
import { sendWelcomeEmail, sendVerificationEmail } from "@/lib/email";
import { z } from "zod";
import { AuthError } from "next-auth";
import { auth } from "@/auth";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Generate a unique 6-digit verification code and store it. Retries on collision. */
async function createVerificationCode(userId: string): Promise<string> {
  // Clear any existing tokens for this user
  await prisma.verificationToken.deleteMany({ where: { userId } });

  for (let attempt = 0; attempt < 5; attempt++) {
    const code = String(Math.floor(100000 + Math.random() * 900000));
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
  const parsed = registerSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    const issues = parsed.error.issues.map((i) => i.message).join(", ");
    return { error: issues };
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
