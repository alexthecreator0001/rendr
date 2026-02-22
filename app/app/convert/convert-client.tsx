"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { convertUrlAction, type ConvertState } from "@/app/actions/convert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Loader2, Download, CheckCircle2, XCircle,
  AlertTriangle, FileCode, Braces, Plus, ChevronDown,
  Zap, Globe, PanelRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

type Phase = "idle" | "submitting" | "polling" | "done" | "failed";
type Mode = "url" | "html" | "template";
type ConvertTemplate = { id: string; name: string; html: string };

interface JobResult {
  status: string;
  downloadUrl: string | null;
  errorMessage: string | null;
}

const PDF_FORMATS = ["A4", "Letter", "Legal", "Tabloid", "A3", "A5", "A6"] as const;

const MARGIN_PRESETS = {
  none:   { top: "0",    right: "0",    bottom: "0",    left: "0"    },
  small:  { top: "10mm", right: "10mm", bottom: "10mm", left: "10mm" },
  normal: { top: "20mm", right: "15mm", bottom: "20mm", left: "15mm" },
  large:  { top: "30mm", right: "25mm", bottom: "30mm", left: "25mm" },
} as const;

function extractVariables(html: string): string[] {
  const matches = [...html.matchAll(/\{\{\s*(\w+)\s*\}\}/g)];
  return [...new Set(matches.map((m) => m[1]))];
}

// ── Inspector primitives ──────────────────────────────────────────────────────

function InspectorSection({ title }: { title: string }) {
  return (
    <div className="px-3 pt-4 pb-1">
      <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-muted-foreground/40">
        {title}
      </p>
    </div>
  );
}

function InspectorRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between px-3 h-[28px]">
      <span className="text-[12px] text-foreground/55 leading-none">{label}</span>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export function ConvertClient({ templates }: { templates: ConvertTemplate[] }) {
  const [state, action, pending] = useActionState<ConvertState, FormData>(
    convertUrlAction, null
  );
  const [mode, setMode] = useState<Mode>("url");
  const [phase, setPhase] = useState<Phase>("idle");
  const [jobResult, setJobResult] = useState<JobResult | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [slowWarning, setSlowWarning] = useState(false);
  const [showHFHtml, setShowHFHtml] = useState(false);
  const [inspectorOpen, setInspectorOpen] = useState(false);

  // Template state
  const [selectedTemplateId, setSelectedTemplateId] = useState("");
  const selectedTemplate = templates.find((t) => t.id === selectedTemplateId) ?? null;
  const templateVars = selectedTemplate ? extractVariables(selectedTemplate.html) : [];

  // PDF options
  const [format, setFormat] = useState("A4");
  const [customWidth, setCustomWidth] = useState("");
  const [customHeight, setCustomHeight] = useState("");
  const [scale, setScale] = useState("1");
  const [pageRanges, setPageRanges] = useState("");
  const [landscape, setLandscape] = useState(false);
  const [printBackground, setPrintBackground] = useState(true);
  const [preferCSSPageSize, setPreferCSSPageSize] = useState(false);
  const [marginTop, setMarginTop] = useState("20mm");
  const [marginRight, setMarginRight] = useState("15mm");
  const [marginBottom, setMarginBottom] = useState("20mm");
  const [marginLeft, setMarginLeft] = useState("15mm");
  const [displayHeaderFooter, setDisplayHeaderFooter] = useState(false);
  const [headerTemplate, setHeaderTemplate] = useState(
    '<div style="font-size:10px;padding:0 12mm;width:100%;color:#777"><span class="title"></span></div>'
  );
  const [footerTemplate, setFooterTemplate] = useState(
    '<div style="font-size:10px;padding:0 12mm;width:100%;color:#777;text-align:center"><span class="pageNumber"></span> / <span class="totalPages"></span></div>'
  );
  const [tagged, setTagged] = useState(false);
  const [outline, setOutline] = useState(false);
  const [waitFor, setWaitFor] = useState(0);

  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startedAt = useRef<number>(0);

  useEffect(() => {
    if (!state) return;
    if ("error" in state && state.error) { setPhase("failed"); return; }
    if ("jobId" in state && state.jobId) {
      startedAt.current = Date.now();
      setPhase("polling"); setElapsed(0); setSlowWarning(false);
      timerRef.current = setInterval(() => {
        const s = Math.round((Date.now() - startedAt.current) / 1000);
        setElapsed(s);
        if (s >= 30) setSlowWarning(true);
      }, 1000);
      pollRef.current = setInterval(async () => {
        try {
          const res = await fetch(`/api/dashboard/jobs/${state.jobId}`);
          const data: JobResult = await res.json();
          if (data.status === "succeeded") {
            clearInterval(pollRef.current!); clearInterval(timerRef.current!);
            setJobResult(data); setPhase("done");
          } else if (data.status === "failed") {
            clearInterval(pollRef.current!); clearInterval(timerRef.current!);
            setJobResult(data); setPhase("failed");
          }
        } catch { /* blip */ }
      }, 1500);
    }
    return () => { clearInterval(pollRef.current!); clearInterval(timerRef.current!); };
  }, [state]);

  useEffect(() => { if (pending) setPhase("submitting"); }, [pending]);

  // Open inspector by default on desktop
  useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth >= 768) {
      setInspectorOpen(true);
    }
  }, []);

  function reset() {
    clearInterval(pollRef.current!); clearInterval(timerRef.current!);
    setPhase("idle"); setJobResult(null); setElapsed(0); setSlowWarning(false);
  }

  function applyMarginPreset(key: keyof typeof MARGIN_PRESETS) {
    const m = MARGIN_PRESETS[key];
    setMarginTop(m.top); setMarginRight(m.right);
    setMarginBottom(m.bottom); setMarginLeft(m.left);
  }

  function getActivePreset(): string | null {
    for (const [key, m] of Object.entries(MARGIN_PRESETS)) {
      if (marginTop === m.top && marginRight === m.right &&
          marginBottom === m.bottom && marginLeft === m.left) return key;
    }
    return null;
  }

  const isActive = phase === "submitting" || phase === "polling";
  const useCustomDimensions = !!(customWidth || customHeight);
  const activePreset = getActivePreset();

  const ctrl = cn(
    "h-6 w-[72px] rounded border border-border/60 bg-muted/50 px-2",
    "text-[11px] text-right tabular-nums",
    "focus:outline-none focus:ring-1 focus:ring-ring disabled:opacity-40"
  );

  const MODES: { id: Mode; label: string }[] = [
    { id: "template", label: "Template" },
    { id: "html", label: "HTML" },
    { id: "url", label: "URL" },
  ];

  const errorText =
    (state && "error" in state && state.error) ||
    jobResult?.errorMessage ||
    "Render failed";

  return (
    <form action={action} className="h-full flex flex-col">

      {/* Hidden PDF option inputs */}
      <input type="hidden" name="mode" value={mode} />
      <input type="hidden" name="format" value={format} />
      <input type="hidden" name="customWidth" value={customWidth} />
      <input type="hidden" name="customHeight" value={customHeight} />
      <input type="hidden" name="scale" value={scale} />
      <input type="hidden" name="pageRanges" value={pageRanges} />
      <input type="hidden" name="landscape" value={String(landscape)} />
      <input type="hidden" name="printBackground" value={String(printBackground)} />
      <input type="hidden" name="preferCSSPageSize" value={String(preferCSSPageSize)} />
      <input type="hidden" name="marginTop" value={marginTop} />
      <input type="hidden" name="marginRight" value={marginRight} />
      <input type="hidden" name="marginBottom" value={marginBottom} />
      <input type="hidden" name="marginLeft" value={marginLeft} />
      <input type="hidden" name="displayHeaderFooter" value={String(displayHeaderFooter)} />
      <input type="hidden" name="headerTemplate" value={headerTemplate} />
      <input type="hidden" name="footerTemplate" value={footerTemplate} />
      <input type="hidden" name="tagged" value={String(tagged)} />
      <input type="hidden" name="outline" value={String(outline)} />
      <input type="hidden" name="waitFor" value={String(waitFor)} />

      {/* ── Studio shell ─────────────────────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">

        {/* ── Left panel (toolbar + canvas) ─────────────────────────────────── */}
        <div className="flex flex-col flex-1 min-w-0 overflow-hidden bg-background">

          {/* ── Toolbar ──────────────────────────────────────────────────────── */}
          <div className="flex h-10 items-stretch border-b border-border shrink-0 bg-background">

            {/* Mode tabs */}
            <div className="flex items-stretch border-r border-border">
              {MODES.map(({ id, label }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => { setMode(id); reset(); }}
                  className={cn(
                    "relative flex items-center gap-1.5 px-4 text-[12px] font-medium transition-colors select-none",
                    mode === id
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {label}
                  {id === "template" && templates.length > 0 && (
                    <span className="text-[10px] text-muted-foreground/50 font-normal tabular-nums">
                      {templates.length}
                    </span>
                  )}
                  {mode === id && (
                    <span className="absolute bottom-0 inset-x-0 h-[2px] bg-foreground rounded-t-sm" />
                  )}
                </button>
              ))}
            </div>

            {/* Status — center */}
            <div className="flex-1 flex items-center justify-center px-4 min-w-0">
              {isActive && (
                <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                  <Loader2 className="h-3 w-3 animate-spin shrink-0" />
                  {phase === "submitting" ? "Queuing…" : `Rendering · ${elapsed}s`}
                </span>
              )}
              {phase === "done" && (
                <span className="flex items-center gap-1.5 text-[11px] text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="h-3 w-3 shrink-0" />
                  Rendered in {elapsed}s
                </span>
              )}
              {phase === "failed" && (
                <span className="flex items-center gap-1.5 text-[11px] text-destructive min-w-0">
                  <XCircle className="h-3 w-3 shrink-0" />
                  <span className="truncate">{errorText}</span>
                </span>
              )}
            </div>

            {/* Right actions */}
            <div className="flex items-center gap-2 px-3 border-l border-border shrink-0">
              {phase !== "idle" && !isActive && (
                <button
                  type="button"
                  onClick={reset}
                  className="text-[11px] text-muted-foreground hover:text-foreground transition-colors"
                >
                  New render
                </button>
              )}
              {phase === "done" && jobResult?.downloadUrl ? (
                <Button
                  asChild
                  size="sm"
                  variant="secondary"
                  className="h-7 gap-1.5 rounded-md text-[12px] px-3"
                >
                  <a href={jobResult.downloadUrl} download target="_blank" rel="noreferrer">
                    <Download className="h-3 w-3" />
                    Download
                  </a>
                </Button>
              ) : (
                <Button
                  type="submit"
                  size="sm"
                  disabled={isActive || (mode === "template" && !selectedTemplateId)}
                  className="h-7 gap-1.5 rounded-md text-[12px] px-3"
                >
                  {isActive
                    ? <Loader2 className="h-3 w-3 animate-spin" />
                    : <Zap className="h-3 w-3" />
                  }
                  Generate
                </Button>
              )}

              {/* Inspector toggle */}
              <button
                type="button"
                onClick={() => setInspectorOpen((p) => !p)}
                title={inspectorOpen ? "Hide inspector" : "Show inspector"}
                className={cn(
                  "flex h-6 w-6 items-center justify-center rounded transition-colors",
                  inspectorOpen
                    ? "bg-accent text-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/60"
                )}
              >
                <PanelRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Slow warning */}
          {slowWarning && (
            <div className="flex items-center gap-2 px-4 py-1.5 bg-amber-50 dark:bg-amber-950/20 border-b border-amber-200 dark:border-amber-900/50 text-[11px] text-amber-700 dark:text-amber-400 shrink-0">
              <AlertTriangle className="h-3 w-3 shrink-0" />
              Worker may be offline — check <code className="font-mono">pm2 list</code>
            </div>
          )}

          {/* ── Canvas ───────────────────────────────────────────────────────── */}
          <div className={cn(
            "flex flex-1 min-h-0 overflow-hidden",
            // HTML mode: dark editor bg
            mode === "html" && phase !== "done" ? "bg-[#1a1a1a]" : "bg-[#f0f0f0] dark:bg-[#161616]"
          )}>

            {phase === "done" && jobResult?.downloadUrl ? (
              /* ── PDF Preview ── */
              <div className="flex flex-col flex-1 min-h-0">
                <div className="flex items-center justify-between px-4 py-2 border-b border-border/60 bg-background/80 backdrop-blur-sm shrink-0">
                  <span className="text-[11px] font-medium text-muted-foreground tracking-wide">
                    PDF Preview
                  </span>
                  <a
                    href={jobResult.downloadUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] text-primary hover:underline underline-offset-2"
                  >
                    Open in new tab ↗
                  </a>
                </div>
                <iframe
                  src={jobResult.downloadUrl}
                  className="flex-1 w-full border-0"
                  title="PDF Preview"
                />
              </div>
            ) : (
              <>
                {/* ── URL mode: centered ── */}
                {mode === "url" && (
                  <div className="flex flex-1 items-center justify-center p-8">
                    <div className="w-full max-w-xl space-y-5">
                      <div className="text-center space-y-2">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-border bg-background shadow-sm">
                          <Globe className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div>
                          <h3 className="text-sm font-semibold text-foreground">Convert URL to PDF</h3>
                          <p className="mt-0.5 text-xs text-muted-foreground">
                            Rendr loads this URL in headless Chromium and renders it to PDF
                          </p>
                        </div>
                      </div>
                      <div className="relative">
                        <input
                          name="input"
                          type="url"
                          placeholder="https://example.com/invoice/123"
                          disabled={isActive}
                          autoFocus
                          className={cn(
                            "w-full h-12 rounded-xl border border-border bg-background",
                            "px-4 text-sm placeholder:text-muted-foreground/40",
                            "shadow-sm focus:outline-none focus:ring-2 focus:ring-ring",
                            "disabled:opacity-50 transition-shadow"
                          )}
                        />
                      </div>
                      <p className="text-center text-[11px] text-muted-foreground/50">
                        Configure format, margins, and other options in the inspector →
                      </p>
                    </div>
                  </div>
                )}

                {/* ── HTML mode: full code editor ── */}
                {mode === "html" && (
                  <div className="flex flex-col flex-1 min-h-0">
                    {/* Editor title bar */}
                    <div className="flex items-center gap-3 px-4 h-9 border-b border-white/5 bg-[#1a1a1a] shrink-0">
                      <div className="flex gap-1.5">
                        <span className="block h-3 w-3 rounded-full bg-red-500/60" />
                        <span className="block h-3 w-3 rounded-full bg-amber-500/60" />
                        <span className="block h-3 w-3 rounded-full bg-green-500/60" />
                      </div>
                      <span className="font-mono text-[11px] text-white/25">document.html</span>
                    </div>
                    <textarea
                      name="input"
                      placeholder={"<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n  <meta charset=\"UTF-8\">\n  <style>\n    body { font-family: sans-serif; padding: 40px; }\n    h1 { color: #111; }\n  </style>\n</head>\n<body>\n  <h1>Hello, PDF</h1>\n  <p>This is your document.</p>\n</body>\n</html>"}
                      disabled={isActive}
                      className="flex-1 w-full bg-[#1a1a1a] text-[#d4d4d4] font-mono text-[12.5px] leading-[1.65] px-6 py-5 focus:outline-none disabled:opacity-50 resize-none placeholder:text-[#444]"
                    />
                  </div>
                )}

                {/* ── Template mode ── */}
                {mode === "template" && (
                  <div className="flex flex-1 overflow-y-auto p-6">
                    <div className="w-full max-w-xl mx-auto">
                      {templates.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full min-h-[300px] text-center">
                          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-background/80 border border-border">
                            <FileCode className="h-5 w-5 text-muted-foreground/40" />
                          </div>
                          <p className="text-sm font-semibold text-foreground">No templates yet</p>
                          <p className="mt-1 text-xs text-muted-foreground/70">
                            Create one on the Templates page.
                          </p>
                          <Button asChild size="sm" variant="outline" className="mt-4 gap-1.5 rounded-lg bg-background">
                            <Link href="/app/templates">
                              <Plus className="h-3.5 w-3.5" /> New template
                            </Link>
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-muted-foreground/50">
                            Select template
                          </p>
                          <div className="space-y-1.5">
                            {templates.map((t) => {
                              const vars = extractVariables(t.html);
                              const isSel = selectedTemplateId === t.id;
                              return (
                                <button
                                  key={t.id}
                                  type="button"
                                  disabled={isActive}
                                  onClick={() => setSelectedTemplateId(isSel ? "" : t.id)}
                                  className={cn(
                                    "w-full rounded-xl border px-4 py-3 text-left transition-all bg-background",
                                    isSel
                                      ? "border-primary/40 bg-primary/5"
                                      : "border-border/70 hover:border-border",
                                    isActive && "pointer-events-none opacity-50"
                                  )}
                                >
                                  <div className="flex items-center justify-between gap-2">
                                    <div className="flex items-center gap-2 min-w-0">
                                      <FileCode className={cn("h-3.5 w-3.5 shrink-0", isSel ? "text-primary" : "text-muted-foreground")} />
                                      <span className="text-[13px] font-medium truncate">{t.name}</span>
                                    </div>
                                    {vars.length > 0 && (
                                      <span className="text-[11px] text-muted-foreground/60 shrink-0">
                                        {vars.length} var{vars.length !== 1 ? "s" : ""}
                                      </span>
                                    )}
                                  </div>
                                  {isSel && vars.length > 0 && (
                                    <div className="mt-2 flex flex-wrap gap-1">
                                      {vars.map((v) => (
                                        <span key={v} className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 font-mono text-[10px] text-primary">
                                          <Braces className="h-2.5 w-2.5" />{v}
                                        </span>
                                      ))}
                                    </div>
                                  )}
                                </button>
                              );
                            })}
                          </div>

                          {selectedTemplate && (
                            <div className="rounded-xl border border-border bg-background px-4 py-3.5">
                              <input type="hidden" name="templateId" value={selectedTemplateId} />
                              <input type="hidden" name="variableKeys" value={templateVars.join(",")} />
                              {templateVars.length > 0 ? (
                                <div className="space-y-3">
                                  <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-muted-foreground/50">
                                    Variables
                                  </p>
                                  {templateVars.map((v) => (
                                    <div key={v} className="flex items-center gap-3">
                                      <label className="w-24 shrink-0 font-mono text-[11px] text-muted-foreground/70 truncate">
                                        {v}
                                      </label>
                                      <Input
                                        name={`var_${v}`}
                                        placeholder={`Value for ${v}`}
                                        disabled={isActive}
                                        className="h-7 text-[12px]"
                                      />
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-[12px] text-muted-foreground/60">
                                  Static template — renders as-is.
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* ── Inspector ──────────────────────────────────────────────────────── */}
        {inspectorOpen && (
          <>
          {/* Mobile backdrop */}
          <div
            className="fixed inset-0 z-40 bg-black/50 md:hidden"
            onClick={() => setInspectorOpen(false)}
          />
          <div className="flex w-[256px] shrink-0 flex-col overflow-y-auto bg-background border-l border-border fixed inset-y-0 right-0 z-50 shadow-2xl md:relative md:inset-auto md:z-auto md:shadow-none">

            {/* Layout */}
            <div>
              <InspectorSection title="Layout" />
              <InspectorRow label="Format">
                <Select
                  value={format}
                  onValueChange={setFormat}
                  disabled={isActive || useCustomDimensions}
                >
                  <SelectTrigger className="h-6 w-[72px] rounded border-border/60 bg-muted/50 text-[11px] shadow-none px-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PDF_FORMATS.map((f) => (
                      <SelectItem key={f} value={f} className="text-[11px]">{f}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </InspectorRow>
              <InspectorRow label="Width">
                <input
                  value={customWidth}
                  onChange={(e) => setCustomWidth(e.target.value)}
                  placeholder="e.g. 15cm"
                  disabled={isActive}
                  className={ctrl}
                />
              </InspectorRow>
              <InspectorRow label="Height">
                <input
                  value={customHeight}
                  onChange={(e) => setCustomHeight(e.target.value)}
                  placeholder="e.g. 20cm"
                  disabled={isActive}
                  className={ctrl}
                />
              </InspectorRow>
              {useCustomDimensions && (
                <p className="px-3 pb-1 text-[10px] text-amber-600 dark:text-amber-400">
                  Custom size overrides format
                </p>
              )}
              <InspectorRow label="Scale">
                <input
                  value={scale}
                  onChange={(e) => setScale(e.target.value)}
                  placeholder="1"
                  disabled={isActive}
                  className={ctrl}
                />
              </InspectorRow>
              <InspectorRow label="Pages">
                <input
                  value={pageRanges}
                  onChange={(e) => setPageRanges(e.target.value)}
                  placeholder="1-3, 5"
                  disabled={isActive}
                  className={ctrl}
                />
              </InspectorRow>
              <InspectorRow label="Render delay">
                <div className="flex items-center gap-1">
                  <input
                    value={waitFor}
                    onChange={(e) => {
                      const n = parseInt(e.target.value, 10);
                      setWaitFor(isNaN(n) ? 0 : Math.min(10, Math.max(0, n)));
                    }}
                    type="number"
                    min={0}
                    max={10}
                    step={1}
                    disabled={isActive}
                    className={cn(ctrl, "w-[52px]")}
                  />
                  <span className="text-[10px] text-muted-foreground/40">s</span>
                </div>
              </InspectorRow>
            </div>

            <div className="border-t border-border/70" />

            {/* Print */}
            <div>
              <InspectorSection title="Print" />
              <InspectorRow label="Landscape">
                <Switch
                  checked={landscape}
                  onCheckedChange={setLandscape}
                  disabled={isActive}
                  className="scale-[0.75]"
                />
              </InspectorRow>
              <InspectorRow label="Print background">
                <Switch
                  checked={printBackground}
                  onCheckedChange={setPrintBackground}
                  disabled={isActive}
                  className="scale-[0.75]"
                />
              </InspectorRow>
              <InspectorRow label="CSS page size">
                <Switch
                  checked={preferCSSPageSize}
                  onCheckedChange={setPreferCSSPageSize}
                  disabled={isActive}
                  className="scale-[0.75]"
                />
              </InspectorRow>
            </div>

            <div className="border-t border-border/70" />

            {/* Margins */}
            <div>
              <InspectorSection title="Margins" />
              <div className="flex gap-1 px-3 pb-2">
                {(Object.keys(MARGIN_PRESETS) as Array<keyof typeof MARGIN_PRESETS>).map((key) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => applyMarginPreset(key)}
                    disabled={isActive}
                    className={cn(
                      "flex-1 rounded border py-[3px] text-[9px] capitalize transition-all",
                      activePreset === key
                        ? "border-primary/50 bg-primary/10 text-primary font-semibold"
                        : "border-border/50 text-muted-foreground/50 hover:border-border hover:text-foreground",
                      isActive && "opacity-40 pointer-events-none"
                    )}
                  >
                    {key === "normal" ? "Md" : key.charAt(0).toUpperCase() + key.slice(1)}
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-[14px_1fr_14px_1fr] items-center gap-x-1 gap-y-1.5 px-3 pb-3">
                {[
                  { l: "T", v: marginTop, s: setMarginTop },
                  { l: "R", v: marginRight, s: setMarginRight },
                  { l: "B", v: marginBottom, s: setMarginBottom },
                  { l: "L", v: marginLeft, s: setMarginLeft },
                ].map(({ l, v, s }) => (
                  <>
                    <span key={`${l}-l`} className="text-[9px] text-muted-foreground/40 text-center">{l}</span>
                    <input
                      key={`${l}-i`}
                      value={v}
                      onChange={(e) => s(e.target.value)}
                      disabled={isActive}
                      className="h-6 rounded border border-border/60 bg-muted/50 px-1.5 text-[10px] text-center focus:outline-none focus:ring-1 focus:ring-ring disabled:opacity-40 w-full"
                    />
                  </>
                ))}
              </div>
            </div>

            <div className="border-t border-border/70" />

            {/* Header & Footer */}
            <div>
              <InspectorSection title="Header & Footer" />
              <InspectorRow label="Enable">
                <Switch
                  checked={displayHeaderFooter}
                  onCheckedChange={(v) => { setDisplayHeaderFooter(v); setShowHFHtml(v); }}
                  disabled={isActive}
                  className="scale-[0.75]"
                />
              </InspectorRow>
              {displayHeaderFooter && (
                <div className="px-3 pb-2 space-y-2">
                  <button
                    type="button"
                    onClick={() => setShowHFHtml((p) => !p)}
                    className="flex items-center gap-1 text-[10px] text-muted-foreground/60 hover:text-foreground transition-colors"
                  >
                    <ChevronDown className={cn("h-3 w-3 transition-transform", showHFHtml && "rotate-180")} />
                    {showHFHtml ? "Hide" : "Edit"} HTML
                  </button>
                  {showHFHtml && (
                    <div className="space-y-2">
                      {[
                        { label: "Header", value: headerTemplate, set: setHeaderTemplate },
                        { label: "Footer", value: footerTemplate, set: setFooterTemplate },
                      ].map(({ label, value, set }) => (
                        <div key={label} className="space-y-1">
                          <p className="text-[9px] uppercase tracking-wide text-muted-foreground/40 font-semibold">
                            {label}
                          </p>
                          <textarea
                            value={value}
                            onChange={(e) => set(e.target.value)}
                            rows={2}
                            disabled={isActive}
                            className="w-full rounded border border-border/60 bg-background px-2 py-1.5 font-mono text-[10px] leading-relaxed focus:outline-none focus:ring-1 focus:ring-ring disabled:opacity-40 resize-none"
                          />
                        </div>
                      ))}
                      <p className="text-[9px] text-muted-foreground/40 leading-relaxed">
                        Use{" "}
                        <code className="font-mono bg-muted rounded px-0.5">.title</code>{" "}
                        <code className="font-mono bg-muted rounded px-0.5">.pageNumber</code>{" "}
                        <code className="font-mono bg-muted rounded px-0.5">.totalPages</code>
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="border-t border-border/70" />

            {/* Output */}
            <div>
              <InspectorSection title="Output" />
              <InspectorRow label="Tagged PDF">
                <Switch
                  checked={tagged}
                  onCheckedChange={setTagged}
                  disabled={isActive}
                  className="scale-[0.75]"
                />
              </InspectorRow>
              <InspectorRow label="Embed outline">
                <Switch
                  checked={outline}
                  onCheckedChange={setOutline}
                  disabled={isActive}
                  className="scale-[0.75]"
                />
              </InspectorRow>
              <InspectorRow label="Compression">
                <div className="flex items-center gap-1.5">
                  <Badge variant="secondary" className="text-[9px] rounded-full px-1.5 h-[14px] font-medium">
                    Pro
                  </Badge>
                  <Switch disabled className="scale-[0.75] opacity-25" />
                </div>
              </InspectorRow>
            </div>

            {/* Footer */}
            <div className="flex-1" />
            <div className="border-t border-border/70 px-3 py-2.5">
              <p className="text-[10px] text-muted-foreground/35 leading-relaxed">
                Completed jobs →{" "}
                <Link
                  href="/app/jobs"
                  className="hover:text-muted-foreground/70 transition-colors underline underline-offset-2"
                >
                  Jobs
                </Link>
                {" "}· links valid 24 h
              </p>
            </div>

          </div>
          </>
        )}
      </div>
    </form>
  );
}
