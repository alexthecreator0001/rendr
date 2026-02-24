"use client";

import {
  useActionState,
  useState,
  useRef,
  useEffect,
  useTransition,
  useMemo,
} from "react";
import {
  chatGenerateAction,
  saveAiTemplateAction,
  type GenerateResult,
} from "@/app/actions/ai-generate";
import type { AiMessage } from "@/lib/openai";
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
  AlertTriangle,
  Send,
  ImagePlus,
  X,
  RotateCcw,
  Bot,
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

const MAX_LOGO_SIZE = 512 * 1024; // 512 KB

interface ChatEntry {
  role: "user" | "assistant";
  text: string;
}

interface Props {
  plan: string;
  creditsUsed: number;
  creditsLimit: number;
}

export function AiStudioClient({ plan, creditsUsed: initialUsed, creditsLimit }: Props) {
  const [saveState, saveAction, savePending] = useActionState<
    { error?: string; success?: boolean } | null,
    FormData
  >(saveAiTemplateAction, null);

  // Chat state
  const [messages, setMessages] = useState<AiMessage[]>([]);
  const [chatEntries, setChatEntries] = useState<ChatEntry[]>([]);
  const [html, setHtml] = useState<string | null>(null);
  const [sampleData, setSampleData] = useState<Record<string, string>>({});
  const [creditsUsed, setCreditsUsed] = useState(initialUsed);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  // Form state
  const [documentType, setDocumentType] = useState("Invoice");
  const [style, setStyle] = useState("Professional");
  const [input, setInput] = useState("");
  const [templateName, setTemplateName] = useState("");
  const [copied, setCopied] = useState(false);

  // Logo state
  const [logoDataUri, setLogoDataUri] = useState<string | null>(null);
  const [logoName, setLogoName] = useState<string | null>(null);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const creditsLeft = creditsLimit - creditsUsed;
  const noCredits = creditsLeft <= 0;
  const hasGenerated = html !== null;

  // Scroll chat to bottom on new entries
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatEntries, pending]);

  // Build preview HTML — replace {{ variables }} with sample data
  const previewHtml = useMemo(() => {
    if (!html) return null;
    let result = html;
    const data = { ...sampleData };
    if (logoDataUri) data.logo_url = logoDataUri;
    for (const [key, value] of Object.entries(data)) {
      result = result.replace(
        new RegExp(`\\{\\{\\s*${key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*\\}\\}`, "g"),
        value
      );
    }
    return result;
  }, [html, sampleData, logoDataUri]);

  function handleSend() {
    if (!input.trim() || pending || noCredits) return;
    const msg = input.trim();
    setInput("");
    setError(null);

    // Immediately add user message to chat for instant feedback
    setChatEntries((prev) => [...prev, { role: "user", text: msg }]);

    startTransition(async () => {
      const result: GenerateResult = await chatGenerateAction({
        messages,
        newMessage: msg,
        documentType: !hasGenerated ? documentType : undefined,
        style: !hasGenerated ? style : undefined,
        hasLogo: !!logoDataUri,
      });

      if (result.error) {
        setError(result.error);
        return;
      }

      let userContent = msg;
      if (!hasGenerated) {
        userContent = `Document type: ${documentType}\nDesign style: ${style}\n\n${msg}`;
      }
      if (logoDataUri) {
        userContent += "\n\nNote: The user has uploaded a logo image. Use {{ logo_url }} as the src attribute of an <img> tag where the logo should appear.";
      }

      setMessages((prev) => [
        ...prev,
        { role: "user", content: userContent },
        { role: "assistant", content: result.assistantContent ?? "" },
      ]);
      setChatEntries((prev) => [
        ...prev,
        {
          role: "assistant",
          text: prev.filter((e) => e.role === "assistant").length === 0
            ? "Template generated — see preview on the right"
            : "Template updated — preview refreshed",
        },
      ]);
      setHtml(result.html ?? null);
      setSampleData(result.sampleData ?? {});
      if (result.creditsUsed != null) setCreditsUsed(result.creditsUsed);
    });
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  function handleLogoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_LOGO_SIZE) {
      setError("Logo must be under 512 KB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setLogoDataUri(reader.result as string);
      setLogoName(file.name);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  }

  function removeLogo() {
    setLogoDataUri(null);
    setLogoName(null);
  }

  function startOver() {
    setMessages([]);
    setChatEntries([]);
    setHtml(null);
    setSampleData({});
    setError(null);
    setInput("");
    setTemplateName("");
  }

  async function handleCopy() {
    if (!html) return;
    await navigator.clipboard.writeText(html);
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
          {hasGenerated && (
            <button
              type="button"
              onClick={startOver}
              className="flex items-center gap-1 ml-2 text-[11px] text-muted-foreground hover:text-foreground transition-colors"
            >
              <RotateCcw className="h-3 w-3" />
              New
            </button>
          )}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[11px] text-muted-foreground">
            <span className="tabular-nums font-semibold text-foreground">{creditsUsed}</span>
            {" / "}
            {creditsLimit} credits
          </span>
          {noCredits && (
            <Link
              href="/app/billing"
              className="text-[11px] text-primary hover:underline underline-offset-2"
            >
              Upgrade →
            </Link>
          )}
        </div>
      </div>

      {/* Free plan banner */}
      {plan === "starter" && (
        <div className="flex items-center gap-2 px-4 py-1.5 bg-muted/50 border-b border-border text-[11px] text-muted-foreground shrink-0">
          <CreditCard className="h-3 w-3 shrink-0 text-amber-500" />
          <span>
            <span className="font-medium text-foreground">Free plan:</span> 1 AI credit/month
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

        {/* ── Left panel — Chat ──────────────────────────────────────────── */}
        <div className="w-[380px] shrink-0 border-r border-border bg-background flex flex-col">

          {/* Config bar — always visible, compact when generated */}
          <div className="px-3 py-2.5 border-b border-border shrink-0">
            <div className="flex items-center gap-2">
              {/* Type & Style — side by side */}
              <div className="flex gap-1.5 flex-1 min-w-0">
                <Select value={documentType} onValueChange={setDocumentType} disabled={hasGenerated}>
                  <SelectTrigger className="h-7 text-[11px] flex-1 min-w-0">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {DOCUMENT_TYPES.map((t) => (
                      <SelectItem key={t} value={t} className="text-[12px]">{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={style} onValueChange={setStyle} disabled={hasGenerated}>
                  <SelectTrigger className="h-7 text-[11px] flex-1 min-w-0">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STYLES.map((s) => (
                      <SelectItem key={s} value={s} className="text-[12px]">{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Logo button — always visible */}
              <input
                ref={logoInputRef}
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="hidden"
              />
              {logoDataUri ? (
                <div className="flex items-center gap-1.5 rounded-md border border-border bg-muted/40 px-2 py-1 shrink-0">
                  <img
                    src={logoDataUri}
                    alt="Logo"
                    className="h-5 w-auto max-w-[48px] object-contain"
                  />
                  <button
                    type="button"
                    onClick={removeLogo}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => logoInputRef.current?.click()}
                  title="Upload logo"
                  className="flex h-7 w-7 items-center justify-center rounded-md border border-dashed border-border text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors shrink-0"
                >
                  <ImagePlus className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* ── Chat area ──────────────────────────────────────────────────── */}
          <div className="flex-1 overflow-y-auto min-h-0 bg-muted/20">
            {chatEntries.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full px-6 text-center">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 mb-3">
                  <Sparkles className="h-5 w-5 text-primary" />
                </div>
                <p className="text-[13px] font-medium text-foreground mb-1">
                  What template do you need?
                </p>
                <p className="text-[11px] text-muted-foreground leading-relaxed max-w-[260px]">
                  Describe your document below. After generating, you can keep chatting to refine colors, layout, sections, and more.
                </p>
                <div className="flex flex-wrap justify-center gap-1.5 mt-4">
                  {[
                    "SaaS invoice with line items",
                    "Minimalist receipt",
                    "Modern resume",
                    "Professional certificate",
                  ].map((suggestion) => (
                    <button
                      key={suggestion}
                      type="button"
                      onClick={() => setInput(suggestion)}
                      className="rounded-full border border-border bg-background px-3 py-1 text-[10px] text-muted-foreground hover:text-foreground hover:border-foreground/20 transition-colors"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="px-4 py-4 space-y-4">
                {chatEntries.map((entry, i) => (
                  <div key={i}>
                    {entry.role === "user" ? (
                      /* ── User message ── */
                      <div className="flex justify-end">
                        <div className="max-w-[85%] rounded-2xl rounded-br-md bg-primary px-4 py-2.5">
                          <p className="text-[13px] leading-relaxed text-primary-foreground whitespace-pre-wrap">
                            {entry.text}
                          </p>
                        </div>
                      </div>
                    ) : (
                      /* ── AI message ── */
                      <div className="flex gap-2.5">
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-violet-600 mt-0.5">
                          <Bot className="h-3.5 w-3.5 text-white" />
                        </div>
                        <div className="max-w-[85%] rounded-2xl rounded-bl-md bg-muted px-4 py-2.5">
                          <p className="text-[13px] leading-relaxed text-foreground flex items-center gap-2">
                            <Check className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                            {entry.text}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                {/* Typing indicator */}
                {pending && (
                  <div className="flex gap-2.5">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-violet-600">
                      <Bot className="h-3.5 w-3.5 text-white" />
                    </div>
                    <div className="rounded-2xl rounded-bl-md bg-muted px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <span className="block h-2 w-2 rounded-full bg-foreground/30 animate-pulse" />
                        <span className="block h-2 w-2 rounded-full bg-foreground/30 animate-pulse [animation-delay:150ms]" />
                        <span className="block h-2 w-2 rounded-full bg-foreground/30 animate-pulse [animation-delay:300ms]" />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>
            )}
          </div>

          {/* Error */}
          {error && (
            <div className="mx-3 mb-0 mt-2 rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-[11px] text-destructive shrink-0">
              {error}
            </div>
          )}

          {/* No credits warning */}
          {noCredits && (
            <div className="mx-3 mt-2 flex items-center gap-2 rounded-lg border border-amber-500/30 bg-amber-500/5 px-3 py-2 text-[11px] text-amber-500 shrink-0">
              <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
              <span>
                No credits left.{" "}
                <Link href="/app/billing" className="underline underline-offset-2 font-medium">
                  Upgrade
                </Link>
              </span>
            </div>
          )}

          {/* ── Input area ─────────────────────────────────────────────────── */}
          <div className="p-3 border-t border-border shrink-0 bg-background">
            <div className="flex gap-2 items-end rounded-xl border border-border bg-muted/30 p-1.5 focus-within:ring-2 focus-within:ring-ring focus-within:border-transparent transition-all">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={
                  hasGenerated
                    ? "Tell AI what to change..."
                    : "Describe your template..."
                }
                rows={2}
                disabled={pending || noCredits}
                className={cn(
                  "flex-1 bg-transparent px-2.5 py-1.5",
                  "text-[13px] leading-relaxed placeholder:text-muted-foreground/40",
                  "focus:outline-none",
                  "disabled:opacity-50 resize-none"
                )}
              />
              <Button
                type="button"
                size="sm"
                onClick={handleSend}
                disabled={pending || noCredits || !input.trim()}
                className="h-8 w-8 p-0 shrink-0 rounded-lg"
              >
                {pending ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Send className="h-3.5 w-3.5" />
                )}
              </Button>
            </div>
            <div className="flex items-center justify-between mt-1.5 px-1">
              <p className="text-[10px] text-muted-foreground/40">
                Enter to send · Shift+Enter for new line
              </p>
              <span
                className={cn(
                  "text-[10px] tabular-nums font-medium",
                  noCredits
                    ? "text-red-500"
                    : creditsLeft <= 3
                      ? "text-amber-500"
                      : "text-muted-foreground/40"
                )}
              >
                {creditsLeft} credit{creditsLeft !== 1 ? "s" : ""} left
              </span>
            </div>
          </div>
        </div>

        {/* ── Right panel — A4 Preview ────────────────────────────────────── */}
        <div className="flex flex-col flex-1 min-w-0 bg-[#f0f0f0] dark:bg-[#161616]">
          {previewHtml ? (
            <>
              {/* Preview toolbar */}
              <div className="flex items-center justify-between px-4 py-2 border-b border-border/60 bg-background/80 backdrop-blur-sm shrink-0">
                <span className="text-[11px] font-medium text-muted-foreground tracking-wide">
                  Preview
                  <span className="ml-2 text-muted-foreground/40">(sample data filled in)</span>
                </span>
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

              {/* A4 paper */}
              <div className="flex-1 min-h-0 overflow-auto py-6 px-4">
                <div className="mx-auto" style={{ width: "210mm", maxWidth: "100%" }}>
                  <div
                    className="bg-white shadow-xl border border-black/10 mx-auto overflow-hidden"
                    style={{ width: "210mm", minHeight: "297mm", maxWidth: "100%" }}
                  >
                    <iframe
                      ref={iframeRef}
                      srcDoc={previewHtml}
                      className="w-full border-0"
                      style={{ minHeight: "297mm" }}
                      title="Template Preview"
                      sandbox="allow-same-origin"
                    />
                  </div>
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
                    <input type="hidden" name="html" value={html!} />
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
                  <h3 className="text-sm font-semibold text-foreground">
                    AI Template Generator
                  </h3>
                  <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                    Describe your document, chat with AI to refine it, then save as a reusable
                    template with {"{{ variables }}"}.
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
