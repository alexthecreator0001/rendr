"use server";

import { signIn } from "@/auth";
import { prisma } from "@/lib/db";
import { hashPassword } from "@/lib/auth-utils";
import { seedStarterTemplates } from "@/lib/starter-templates";
import { z } from "zod";
import { AuthError } from "next-auth";

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
