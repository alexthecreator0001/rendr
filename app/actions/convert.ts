"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { getQueue } from "@/lib/queue";
import { sendUsageWarningEmail, sendUsageLimitReachedEmail } from "@/lib/email";
import { getPlanRenderLimit } from "@/lib/plans";
import { z } from "zod";

async function checkUsageThresholds(userId: string): Promise<void> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { email: true, plan: true },
  });
  if (!user) return;

  const limit = getPlanRenderLimit(user.plan);
  if (!isFinite(limit)) return;

  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const used = await prisma.job.count({
    where: { userId, createdAt: { gte: startOfMonth } },
  });

  // Send at exactly 80% mark
  if (used === Math.floor(limit * 0.8)) {
    await sendUsageWarningEmail(user.email, used, limit);
  }
  // Send at exactly 100% mark
  else if (used === limit) {
    await sendUsageLimitReachedEmail(user.email, limit);
  }
}

const urlSchema = z.string().url("Please enter a valid URL (include https://)");
const htmlSchema = z.string().min(10, "HTML content is too short");

export type ConvertState =
  | { jobId: string; error?: never }
  | { error: string; jobId?: never }
  | null;

function parseBoolean(val: FormDataEntryValue | null, defaultVal: boolean): boolean {
  if (val === null) return defaultVal;
  return val === "true";
}

function parseNumber(val: FormDataEntryValue | null, defaultVal: number): number {
  if (!val) return defaultVal;
  const n = parseFloat(val as string);
  return isNaN(n) ? defaultVal : n;
}

export async function convertUrlAction(
  _prev: ConvertState,
  formData: FormData
): Promise<ConvertState> {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated." };

  // Block if user has hit their monthly render limit
  const userForLimit = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { plan: true },
  });
  const renderLimit = getPlanRenderLimit(userForLimit?.plan ?? "starter");
  if (isFinite(renderLimit)) {
    const monthStart = new Date();
    monthStart.setDate(1); monthStart.setHours(0, 0, 0, 0);
    const usedThisMonth = await prisma.job.count({
      where: { userId: session.user.id, createdAt: { gte: monthStart } },
    });
    if (usedThisMonth >= renderLimit) {
      return { error: `Monthly limit of ${renderLimit} renders reached. Upgrade your plan to continue.` };
    }
  }

  const mode = formData.get("mode") as string;

  // ── Layout options ──────────────────────────────────────
  const format = (formData.get("format") as string) || "A4";
  const customWidth = (formData.get("customWidth") as string)?.trim() || "";
  const customHeight = (formData.get("customHeight") as string)?.trim() || "";
  const scale = Math.min(Math.max(parseNumber(formData.get("scale"), 1), 0.1), 2);
  const pageRanges = (formData.get("pageRanges") as string)?.trim() || "";

  // ── Print production ────────────────────────────────────
  const landscape = parseBoolean(formData.get("landscape"), false);
  const printBackground = parseBoolean(formData.get("printBackground"), true);
  const preferCSSPageSize = parseBoolean(formData.get("preferCSSPageSize"), false);

  // ── Margins ─────────────────────────────────────────────
  const marginTop = (formData.get("marginTop") as string)?.trim() || "20mm";
  const marginRight = (formData.get("marginRight") as string)?.trim() || "15mm";
  const marginBottom = (formData.get("marginBottom") as string)?.trim() || "20mm";
  const marginLeft = (formData.get("marginLeft") as string)?.trim() || "15mm";
  const margin = { top: marginTop, right: marginRight, bottom: marginBottom, left: marginLeft };

  // ── Header & Footer ─────────────────────────────────────
  const displayHeaderFooter = parseBoolean(formData.get("displayHeaderFooter"), false);
  const headerTemplate = (formData.get("headerTemplate") as string) || "<span></span>";
  const footerTemplate = (formData.get("footerTemplate") as string) || "<span></span>";

  // ── Output & Accessibility ──────────────────────────────
  const tagged = parseBoolean(formData.get("tagged"), false);
  const outline = parseBoolean(formData.get("outline"), false);

  // ── Render delay ────────────────────────────────────────
  const waitFor = Math.min(Math.max(parseNumber(formData.get("waitFor"), 0), 0), 10);

  const pdfOptions = {
    // Paper size
    ...(customWidth || customHeight
      ? { width: customWidth || undefined, height: customHeight || undefined }
      : { format }),
    landscape,
    printBackground,
    preferCSSPageSize,
    scale,
    ...(pageRanges ? { pageRanges } : {}),
    displayHeaderFooter,
    ...(displayHeaderFooter ? { headerTemplate, footerTemplate } : {}),
    margin,
    tagged,
    outline,
    waitFor,
  };

  let jobData: Parameters<typeof prisma.job.create>[0]["data"];

  if (mode === "url") {
    const raw = (formData.get("input") as string) ?? "";
    const parsed = urlSchema.safeParse(raw.trim());
    if (!parsed.success) return { error: parsed.error.issues[0].message };
    jobData = {
      userId: session.user.id,
      inputType: "url",
      inputContent: parsed.data,
      optionsJson: pdfOptions,
    };
  } else if (mode === "html") {
    const raw = (formData.get("input") as string) ?? "";
    const parsed = htmlSchema.safeParse(raw);
    if (!parsed.success) return { error: parsed.error.issues[0].message };
    jobData = {
      userId: session.user.id,
      inputType: "html",
      inputContent: parsed.data,
      optionsJson: pdfOptions,
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
      optionsJson: { ...pdfOptions, variables },
    };
  } else {
    return { error: "Invalid mode." };
  }

  const job = await prisma.job.create({ data: jobData });

  try {
    const queue = await getQueue();
    await queue.send("pdf-conversion", { jobId: job.id });
  } catch {
    // worker will pick up via Prisma poll
  }

  // Fire-and-forget usage threshold check (sends warning/limit emails)
  checkUsageThresholds(session.user.id).catch(() => {});

  return { jobId: job.id };
}
