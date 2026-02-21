"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { getQueue } from "@/lib/queue";
import { z } from "zod";

const urlSchema = z.string().url("Please enter a valid URL (include https://)");
const htmlSchema = z.string().min(10, "HTML content is too short");

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

  const job = await prisma.job.create({
    data: {
      userId: session.user.id,
      inputType,
      inputContent,
      optionsJson: {},
    },
  });

  const queue = await getQueue();
  await queue.send("pdf-conversion", { jobId: job.id });

  return { jobId: job.id };
}
