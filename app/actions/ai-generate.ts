"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { getPlanAiLimit } from "@/lib/plans";
import { generateTemplate, type AiMessage } from "@/lib/openai";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";

async function getSession() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  return session;
}

export interface GenerateResult {
  html?: string;
  sampleData?: Record<string, string>;
  assistantContent?: string;
  creditsUsed?: number;
  creditsLimit?: number;
  error?: string;
}

interface ChatInput {
  messages: AiMessage[];
  newMessage: string;
  documentType?: string;
  style?: string;
  hasLogo?: boolean;
}

export async function chatGenerateAction(
  input: ChatInput
): Promise<GenerateResult> {
  const session = await getSession();

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { plan: true },
  });
  const plan = user?.plan ?? "starter";
  const limit = getPlanAiLimit(plan);

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

  if (!input.newMessage.trim()) {
    return { error: "Please describe what you want." };
  }

  // Build the user message content
  let userContent = input.newMessage;

  // First message: include document type and style context
  if (input.messages.length === 0) {
    const docType = input.documentType || "Document";
    const style = input.style || "Professional";
    userContent = `Document type: ${docType}\nDesign style: ${style}\n\n${input.newMessage}`;
  }

  // Add logo instruction if user uploaded one
  if (input.hasLogo) {
    userContent += "\n\nNote: The user has uploaded a logo image. Use {{ logo_url }} as the src attribute of an <img> tag where the logo should appear.";
  }

  const allMessages: AiMessage[] = [
    ...input.messages,
    { role: "user", content: userContent },
  ];

  const result = await generateTemplate(allMessages);

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
    sampleData: result.sampleData,
    assistantContent: result.rawContent,
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
