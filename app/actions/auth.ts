"use server";

import { signIn } from "@/auth";
import { prisma } from "@/lib/db";
import { hashPassword } from "@/lib/auth-utils";
import { z } from "zod";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";

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
    await signIn("credentials", {
      email: parsed.data.email,
      password: parsed.data.password,
      redirect: false,
    });
  } catch (err) {
    if (err instanceof AuthError) {
      return { error: "Invalid email or password." };
    }
    throw err;
  }

  redirect("/app");
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

  await prisma.user.create({
    data: {
      email: parsed.data.email,
      passwordHash,
    },
  });

  try {
    await signIn("credentials", {
      email: parsed.data.email,
      password: parsed.data.password,
      redirect: false,
    });
  } catch {
    redirect("/login");
  }

  redirect("/app");
}
