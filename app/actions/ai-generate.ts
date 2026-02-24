"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { getPlanAiLimit } from "@/lib/plans";
import { generateTemplate } from "@/lib/openai";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";

async function getSession() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  return session;
}

export interface GenerateState {
  html?: string;
  creditsUsed?: number;
  creditsLimit?: number;
  error?: string;
}

export async function generateTemplateAction(
  _prevState: GenerateState | null,
  formData: FormData
): Promise<GenerateState> {
  const session = await getSession();

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { plan: true },
  });
  const plan = user?.plan ?? "starter";
  const limit = getPlanAiLimit(plan);

  // Count this month's AI generations
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const used = await prisma.usageEvent.count({
    where: {
      userId: session.user.id,
      endpoint: "ai-generate",
      createdAt: { gte: monthStart },
    },
  });

  if (used >= limit) {
    return {
      error: `AI credit limit reached (${limit}/month on ${plan} plan). Upgrade for more credits.`,
      creditsUsed: used,
      creditsLimit: limit,
    };
  }

  const documentType = (formData.get("documentType") as string) || "Document";
  const style = (formData.get("style") as string) || "Professional";
  const description = (formData.get("description") as string) || "";

  if (!description.trim()) {
    return { error: "Please describe the template you want to generate." };
  }

  const prompt = `Document type: ${documentType}\nDesign style: ${style}\n\nUser request: ${description}\n\nGenerate a complete, professional ${documentType.toLowerCase()} with realistic sample data filled in. The design style should be "${style.toLowerCase()}".`;

  const result = await generateTemplate(prompt);

  if ("error" in result) {
    return { error: result.error };
  }

  // Log usage event
  await prisma.usageEvent.create({
    data: {
      userId: session.user.id,
      endpoint: "ai-generate",
      statusCode: 200,
    },
  });

  return {
    html: result.html,
    creditsUsed: used + 1,
    creditsLimit: limit,
  };
}

const saveSchema = z.object({
  name: z.string().min(1).max(255),
  html: z.string().min(1),
});

export async function saveAiTemplateAction(
  _prevState: { error?: string; success?: boolean } | null,
  formData: FormData
): Promise<{ error?: string; success?: boolean }> {
  const session = await getSession();

  const parsed = saveSchema.safeParse({
    name: formData.get("name"),
    html: formData.get("html"),
  });
  if (!parsed.success) return { error: "Name and HTML are required." };

  await prisma.template.create({
    data: { userId: session.user.id, ...parsed.data },
  });

  revalidatePath("/app/templates");
  revalidatePath("/app/ai-studio");
  return { success: true };
}
