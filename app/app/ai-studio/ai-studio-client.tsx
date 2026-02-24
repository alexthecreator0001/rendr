"use client";

import { useActionState, useState, useRef } from "react";
import {
  generateTemplateAction,
  saveAiTemplateAction,
  type GenerateState,
} from "@/app/actions/ai-generate";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sparkles,
  Loader2,
  Copy,
  Check,
  Save,
  CreditCard,
  Zap,
  AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

const DOCUMENT_TYPES = [
  "Invoice",
  "Receipt",
  "Report",
  "Certificate",
  "Letter",
  "Resume",
  "Contract",
  "Other",
] as const;

const STYLES = [
  "Minimal",
  "Professional",
  "Modern",
  "Classic",
  "Bold",
] as const;

interface Props {
  plan: string;
  creditsUsed: number;
  creditsLimit: number;
}

export function AiStudioClient({ plan, creditsUsed: initialUsed, creditsLimit }: Props) {
  const [genState, genAction, genPending] = useActionState<GenerateState | null, FormData>(
    generateTemplateAction,
    null
  );
  const [saveState, saveAction, savePending] = useActionState<
    { error?: string; success?: boolean } | null,
    FormData
  >(saveAiTemplateAction, null);

  const [documentType, setDocumentType] = useState("Invoice");
  const [style, setStyle] = useState("Professional");
  const [description, setDescription] = useState("");
  const [templateName, setTemplateName] = useState("");
  const [copied, setCopied] = useState(false);

  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Track credits — update from server response when available
  const creditsUsed = genState?.creditsUsed ?? initialUsed;
  const creditsLeft = creditsLimit - creditsUsed;
  const noCredits = creditsLeft <= 0;

  const generatedHtml = genState?.html ?? null;
  const genError = genState?.error ?? null;

  async function handleCopy() {
    if (!generatedHtml) return;
    await navigator.clipboard.writeText(generatedHtml);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const saved = saveState?.success;

  return (
    <div className="h-full flex flex-col">
      {/* Toolbar */}
      <div className="flex h-10 items-center justify-between border-b border-border shrink-0 bg-background px-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          <span className="text-[13px] font-semibold">AI Studio</span>
        </div>

        <div className="flex items-center gap-3">
          {/* Credits counter */}
          <span className="text-[11px] text-muted-foreground">
            <span className="tabular-nums font-semibold text-foreground">{creditsUsed}</span>
            {" / "}
            {creditsLimit} credits used
          </span>
          {noCredits && plan === "starter" && (
            <Link
              href="/app/billing"
              className="text-[11px] text-primary hover:underline underline-offset-2"
            >
              Upgrade →
            </Link>
          )}
        </div>
      </div>

      {/* Free plan notice */}
      {plan === "starter" && (
        <div className="flex items-center gap-2 px-4 py-1.5 bg-muted/50 border-b border-border text-[11px] text-muted-foreground shrink-0">
          <CreditCard className="h-3 w-3 shrink-0 text-amber-500" />
          <span>
            <span className="font-medium text-foreground">Free plan:</span> 1 AI generation/month
          </span>
          <Link
            href="/app/billing"
            className="ml-auto text-primary hover:underline underline-offset-2 shrink-0"
          >
            Upgrade →
          </Link>
        </div>
      )}

      {/* Main content */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Left panel — Prompt form */}
        <div className="w-[340px] shrink-0 border-r border-border bg-background overflow-y-auto">
          <form action={genAction} className="p-4 space-y-4">
            <input type="hidden" name="documentType" value={documentType} />
            <input type="hidden" name="style" value={style} />

            {/* Document type */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">
                Document type
              </label>
              <Select value={documentType} onValueChange={setDocumentType}>
                <SelectTrigger className="h-9 text-[13px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DOCUMENT_TYPES.map((t) => (
                    <SelectItem key={t} value={t} className="text-[13px]">
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Style */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">
                Style
              </label>
              <Select value={style} onValueChange={setStyle}>
                <SelectTrigger className="h-9 text-[13px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STYLES.map((s) => (
                    <SelectItem key={s} value={s} className="text-[13px]">
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">
                Description
              </label>
              <textarea
                name="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the template you want... e.g. 'A modern invoice for a SaaS company with a line items table, subtotal, tax, and total. Include company logo placeholder, bill-to section, and payment terms.'"
                rows={6}
                disabled={genPending}
                className={cn(
                  "w-full rounded-lg border border-border bg-background px-3 py-2",
                  "text-[13px] leading-relaxed placeholder:text-muted-foreground/40",
                  "focus:outline-none focus:ring-2 focus:ring-ring",
                  "disabled:opacity-50 resize-none"
                )}
              />
            </div>

            {/* Generate button */}
            <Button
              type="submit"
              disabled={genPending || noCredits || !description.trim()}
              className="w-full h-9 gap-2"
            >
              {genPending ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Sparkles className="h-3.5 w-3.5" />
              )}
              {genPending ? "Generating…" : "Generate Template"}
            </Button>

            {noCredits && (
              <div className="flex items-center gap-2 rounded-lg border border-amber-500/30 bg-amber-500/5 px-3 py-2 text-[11px] text-amber-500">
                <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                <span>
                  No credits remaining.{" "}
                  <Link href="/app/billing" className="underline underline-offset-2 font-medium">
                    Upgrade your plan
                  </Link>
                </span>
              </div>
            )}

            {genError && (
              <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-[11px] text-destructive">
                {genError}
              </div>
            )}

            {/* Credits remaining */}
            <div className="pt-2 border-t border-border/50">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-muted-foreground">Credits remaining</span>
                <span className={cn(
                  "tabular-nums font-semibold",
                  noCredits ? "text-red-500" : creditsLeft <= 3 ? "text-amber-500" : "text-foreground"
                )}>
                  {creditsLeft} / {creditsLimit}
                </span>
              </div>
              <div className="mt-1.5 h-[3px] w-full overflow-hidden rounded-full bg-muted">
                <div
                  className={cn(
                    "h-full rounded-full transition-all duration-500",
                    noCredits ? "bg-red-500" : creditsLeft <= 3 ? "bg-amber-500" : "bg-primary"
                  )}
                  style={{ width: `${Math.min(100, (creditsUsed / creditsLimit) * 100)}%` }}
                />
              </div>
            </div>
          </form>
        </div>

        {/* Right panel — Preview */}
        <div className="flex flex-col flex-1 min-w-0 bg-[#f0f0f0] dark:bg-[#161616]">
          {generatedHtml ? (
            <>
              {/* Preview toolbar */}
              <div className="flex items-center justify-between px-4 py-2 border-b border-border/60 bg-background/80 backdrop-blur-sm shrink-0">
                <span className="text-[11px] font-medium text-muted-foreground tracking-wide">
                  Preview
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 text-[11px] text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {copied ? (
                      <Check className="h-3 w-3 text-emerald-500" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                    {copied ? "Copied" : "Copy HTML"}
                  </button>
                </div>
              </div>

              {/* iframe preview */}
              <div className="flex-1 min-h-0 p-4">
                <div className="h-full rounded-lg overflow-hidden border border-border/60 bg-white shadow-sm">
                  <iframe
                    ref={iframeRef}
                    srcDoc={generatedHtml}
                    className="w-full h-full border-0"
                    title="Template Preview"
                    sandbox="allow-same-origin"
                  />
                </div>
              </div>

              {/* Save bar */}
              <div className="border-t border-border bg-background px-4 py-3 shrink-0">
                {saved ? (
                  <div className="flex items-center gap-2 text-[12px] text-emerald-500">
                    <Check className="h-3.5 w-3.5" />
                    Template saved! View it on the{" "}
                    <Link
                      href="/app/templates"
                      className="underline underline-offset-2 font-medium"
                    >
                      Templates page
                    </Link>
                  </div>
                ) : (
                  <form action={saveAction} className="flex items-center gap-2">
                    <input type="hidden" name="html" value={generatedHtml} />
                    <Input
                      name="name"
                      value={templateName}
                      onChange={(e) => setTemplateName(e.target.value)}
                      placeholder="Template name…"
                      className="h-8 flex-1 text-[12px]"
                    />
                    <Button
                      type="submit"
                      size="sm"
                      variant="secondary"
                      disabled={savePending || !templateName.trim()}
                      className="h-8 gap-1.5 text-[12px] px-3"
                    >
                      {savePending ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        <Save className="h-3 w-3" />
                      )}
                      Save as Template
                    </Button>
                  </form>
                )}
                {saveState?.error && (
                  <p className="mt-1.5 text-[11px] text-destructive">{saveState.error}</p>
                )}
              </div>
            </>
          ) : (
            /* Empty state */
            <div className="flex flex-1 items-center justify-center p-8">
              <div className="text-center space-y-3 max-w-xs">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-border bg-background shadow-sm">
                  <Sparkles className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground">AI Template Generator</h3>
                  <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                    Describe the document you need and AI will generate a ready-to-use HTML template with placeholders.
                  </p>
                </div>
                <div className="flex flex-wrap justify-center gap-1.5 pt-1">
                  {["Invoice", "Report", "Certificate", "Resume"].map((t) => (
                    <span
                      key={t}
                      className="rounded-full bg-muted px-2.5 py-0.5 text-[10px] text-muted-foreground"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
