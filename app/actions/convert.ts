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
  const raw = (formData.get("input") as string) ?? "";

  let inputType: "url" | "html";
  let inputContent: string;

  if (mode === "url") {
    const parsed = urlSchema.safeParse(raw.trim());
    if (!parsed.success) return { error: parsed.error.issues[0].message };
    inputType = "url";
    inputContent = parsed.data;
  } else {
    const parsed = htmlSchema.safeParse(raw);
    if (!parsed.success) return { error: parsed.error.issues[0].message };
    inputType = "html";
    inputContent = parsed.data;
  }

  const format = formData.get("format") === "Letter" ? "Letter" : "A4";
  const landscape = formData.get("orientation") === "landscape";
  const marginKey = (formData.get("margin") as string) || "normal";
  const margin = marginMap[marginKey as keyof typeof marginMap] ?? marginMap.normal;

  const job = await prisma.job.create({
    data: {
      userId: session.user.id,
      inputType,
      inputContent,
      optionsJson: { format, landscape, margin },
    },
  });

  const queue = await getQueue();
  await queue.send("pdf-conversion", { jobId: job.id });

  return { jobId: job.id };
}
