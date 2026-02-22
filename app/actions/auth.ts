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
    // redirectTo is the NextAuth v5 server-action API.
    // On success: throws NEXT_REDIRECT → Next.js handles the redirect.
    // On failure: throws CredentialsSignin (AuthError subclass) → caught below.
    await signIn("credentials", {
      email: parsed.data.email,
      password: parsed.data.password,
      redirectTo: "/app",
    });
  } catch (err) {
    if (err instanceof AuthError) {
      return { error: "Invalid email or password." };
    }
    // Re-throw redirect errors so Next.js can handle them
    throw err;
  }

  // Unreachable — signIn always redirects on success — but satisfies TypeScript
  return {};
}

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
    return { error: "An account with this email already exists." };
  }

  const passwordHash = await hashPassword(parsed.data.password);

  const newUser = await prisma.user.create({
    data: {
      email: parsed.data.email,
      passwordHash,
    },
  });

  // Seed starter templates in the background — don't block registration
  seedStarterTemplates(newUser.id, prisma).catch(() => {});

  // Send welcome + verification emails in the background
  const verificationToken = await prisma.verificationToken.create({
    data: {
      userId: newUser.id,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24h
    },
  });
  sendWelcomeEmail(newUser.email).catch(() => {});
  sendVerificationEmail(newUser.email, verificationToken.token).catch(() => {});

  // Sign the new user in immediately and redirect to the dashboard.
  // redirectTo is the NextAuth v5 server-action API.
  try {
    await signIn("credentials", {
      email: parsed.data.email,
      password: parsed.data.password,
      redirectTo: "/app",
    });
  } catch (err) {
    if (err instanceof AuthError) {
      // Account was created but auto-login failed — send to login page
      return { error: "Account created. Please sign in." };
    }
    throw err;
  }

  return {};
}

export async function signOutAction() {
  await signOut({ redirectTo: "/login" });
}

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
