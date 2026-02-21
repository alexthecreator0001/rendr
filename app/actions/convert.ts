"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { getQueue } from "@/lib/queue";
import { z } from "zod";

const urlSchema = z.string().url("Please enter a valid URL (include https://)");
const htmlSchema = z.string().min(10, "HTML content is too short");

const marginMap = {
  none:   { top: "0",    right: "0",    bottom: "0",    left: "0"    },
  small:  { top: "10mm", right: "10mm", bottom: "10mm", left: "10mm" },
  normal: { top: "20mm", right: "15mm", bottom: "20mm", left: "15mm" },
  large:  { top: "30mm", right: "25mm", bottom: "30mm", left: "25mm" },
} as const;

export type ConvertState =
  | { jobId: string; error?: never }
  | { error: string; jobId?: never }
  | null;

export async function convertUrlAction(
  _prev: ConvertState,
  formData: FormData
): Promise<ConvertState> {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated." };

  const mode = formData.get("mode") as string;
  const format = formData.get("format") === "Letter" ? "Letter" : "A4";
  const landscape = formData.get("orientation") === "landscape";
  const marginKey = (formData.get("margin") as string) || "normal";
  const margin = marginMap[marginKey as keyof typeof marginMap] ?? marginMap.normal;

  let jobData: Parameters<typeof prisma.job.create>[0]["data"];

  if (mode === "url") {
    const raw = (formData.get("input") as string) ?? "";
    const parsed = urlSchema.safeParse(raw.trim());
    if (!parsed.success) return { error: parsed.error.issues[0].message };
    jobData = {
      userId: session.user.id,
      inputType: "url",
      inputContent: parsed.data,
      optionsJson: { format, landscape, margin },
    };
  } else if (mode === "html") {
    const raw = (formData.get("input") as string) ?? "";
    const parsed = htmlSchema.safeParse(raw);
    if (!parsed.success) return { error: parsed.error.issues[0].message };
    jobData = {
      userId: session.user.id,
      inputType: "html",
      inputContent: parsed.data,
      optionsJson: { format, landscape, margin },
    };
  } else if (mode === "template") {
    const templateId = (formData.get("templateId") as string) ?? "";
    if (!templateId) return { error: "Please select a template." };

    const template = await prisma.template.findFirst({
      where: { id: templateId, userId: session.user.id },
      select: { id: true },
    });
    if (!template) return { error: "Template not found." };

    const variableKeys = ((formData.get("variableKeys") as string) ?? "")
      .split(",")
      .filter(Boolean);
    const variables: Record<string, string> = {};
    for (const key of variableKeys) {
      variables[key] = (formData.get(`var_${key}`) as string) ?? "";
    }

    jobData = {
      userId: session.user.id,
      inputType: "template",
      inputContent: "",
      templateId,
      optionsJson: { format, landscape, margin, variables },
    };
  } else {
    return { error: "Invalid mode." };
  }

  const job = await prisma.job.create({ data: jobData });

  // Best-effort pg-boss enqueue (worker also polls Prisma directly as fallback)
  try {
    const queue = await getQueue();
    await queue.send("pdf-conversion", { jobId: job.id });
  } catch {
    // worker will pick up via Prisma poll
  }

  return { jobId: job.id };
}
