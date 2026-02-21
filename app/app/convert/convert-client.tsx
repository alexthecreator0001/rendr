"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { convertUrlAction, type ConvertState } from "@/app/actions/convert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Loader2, Download, CheckCircle2, XCircle, FileText,
  AlertTriangle, FileCode, Braces, Plus, ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

type Phase = "idle" | "submitting" | "polling" | "done" | "failed";
type ConvertTemplate = { id: string; name: string; html: string };

interface JobResult {
  status: string;
  downloadUrl: string | null;
  errorMessage: string | null;
}

const PDF_FORMATS = [
  "A4", "Letter", "Legal", "Tabloid", "A3", "A5", "A6",
] as const;

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

// ── Inspector primitives ─────────────────────────────────────────────────────

function InspectorSection({ title }: { title: string }) {
  return (
    <div className="px-4 pb-1.5 pt-3.5">
      <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-muted-foreground/50">
        {title}
      </p>
    </div>
  );
}

function InspectorRow({
  label, children,
}: {
  label: string; children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-3 px-4 py-[5px]">
      <span className="min-w-0 flex-1 text-[13px] text-foreground/75 leading-none">{label}</span>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

// ── Main component ───────────────────────────────────────────────────────────
export function ConvertClient({ templates }: { templates: ConvertTemplate[] }) {
  const [state, action, pending] = useActionState<ConvertState, FormData>(
    convertUrlAction,
    null
  );
  const [mode, setMode] = useState<"url" | "html" | "template">("url");
  const [phase, setPhase] = useState<Phase>("idle");
  const [jobResult, setJobResult] = useState<JobResult | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [slowWarning, setSlowWarning] = useState(false);
  const [showHFHtml, setShowHFHtml] = useState(false);

  // Template state
  const [selectedTemplateId, setSelectedTemplateId] = useState("");
  const selectedTemplate = templates.find((t) => t.id === selectedTemplateId) ?? null;
  const templateVars = selectedTemplate ? extractVariables(selectedTemplate.html) : [];

  // ── PDF options ────────────────────────────────────────────────────────────
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

  const tinyInput = cn(
    "h-6 w-[72px] rounded-md border border-border/50 bg-muted/40 px-2",
    "text-[11px] font-mono text-right tabular-nums",
    "focus:outline-none focus:ring-1 focus:ring-ring disabled:opacity-50"
  );

  return (
    <form action={action}>
      {/* Hidden inputs */}
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

      {/* ── Unified panel ───────────────────────────────────────────── */}
      <div className="overflow-hidden rounded-2xl border border-border/70 bg-card shadow-[0_1px_4px_rgba(0,0,0,0.06)] dark:shadow-[0_1px_4px_rgba(0,0,0,0.3)]">

        <Tabs value={mode} onValueChange={(v) => { setMode(v as typeof mode); reset(); }}>

          {/* Toolbar ─────────────────────────────────────────────────── */}
          <div className="flex h-11 items-center justify-between border-b border-border/60 bg-muted/20 px-4">
            <TabsList className="h-7 bg-background/80 border border-border/50 rounded-lg p-0.5 gap-px shadow-[inset_0_1px_2px_rgba(0,0,0,0.04)]">
              <TabsTrigger
                value="template"
                className="h-6 rounded-md px-3 text-[12px] data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-foreground data-[state=inactive]:text-muted-foreground"
              >
                Template
                {templates.length > 0 && (
                  <Badge variant="secondary" className="ml-1.5 h-[14px] rounded-full px-1 text-[9px] font-medium">
                    {templates.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger
                value="html"
                className="h-6 rounded-md px-3 text-[12px] data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-foreground data-[state=inactive]:text-muted-foreground"
              >
                HTML
              </TabsTrigger>
              <TabsTrigger
                value="url"
                className="h-6 rounded-md px-3 text-[12px] data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-foreground data-[state=inactive]:text-muted-foreground"
              >
                URL
              </TabsTrigger>
            </TabsList>

            {/* Status indicator in toolbar */}
            {isActive && (
              <div className="flex items-center gap-2 text-[12px] text-muted-foreground">
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                {phase === "submitting" ? "Queuing…" : `Rendering ${elapsed}s`}
              </div>
            )}
            {phase === "done" && (
              <div className="flex items-center gap-1.5 text-[12px] text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Ready in {elapsed}s
              </div>
            )}
            {phase === "failed" && (
              <div className="flex items-center gap-1.5 text-[12px] text-destructive">
                <XCircle className="h-3.5 w-3.5" />
                Failed
              </div>
            )}
          </div>

          {/* Body: left + divider + inspector ────────────────────────── */}
          <div className="flex min-h-[480px]">

            {/* ── Left: input ──────────────────────────────────────── */}
            <div className="flex flex-1 flex-col min-w-0">
              <div className="flex-1 p-5">

                {/* URL */}
                <TabsContent value="url" className="mt-0 h-full flex flex-col">
                  <p className="mb-1.5 text-[11px] font-medium uppercase tracking-wide text-muted-foreground/60">
                    Page URL
                  </p>
                  <input
                    name="input"
                    type="url"
                    placeholder="https://example.com/invoice/123"
                    disabled={isActive}
                    className="w-full rounded-xl border border-border/60 bg-background px-3.5 py-2.5 text-sm font-mono placeholder:text-muted-foreground/30 focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
                  />
                  <p className="mt-2 text-[12px] text-muted-foreground/70">
                    Rendr opens this URL in a headless Chromium browser and renders it to PDF.
                  </p>
                </TabsContent>

                {/* HTML */}
                <TabsContent value="html" className="mt-0 h-full flex flex-col">
                  <p className="mb-1.5 text-[11px] font-medium uppercase tracking-wide text-muted-foreground/60">
                    HTML Source
                  </p>
                  <textarea
                    name="input"
                    rows={14}
                    placeholder={"<!DOCTYPE html>\n<html>\n  <body>\n    <h1>Hello, PDF</h1>\n  </body>\n</html>"}
                    disabled={isActive}
                    className="flex-1 w-full rounded-xl border border-border/60 bg-background px-3.5 py-2.5 font-mono text-xs leading-relaxed placeholder:text-muted-foreground/30 focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50 resize-none"
                  />
                </TabsContent>

                {/* Template */}
                <TabsContent value="template" className="mt-0">
                  {templates.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-muted/60">
                        <FileCode className="h-7 w-7 text-muted-foreground/30" />
                      </div>
                      <p className="text-sm font-semibold">No templates yet</p>
                      <p className="mt-1 text-[12px] text-muted-foreground">
                        Create your first template to get started.
                      </p>
                      <Button asChild size="sm" variant="outline" className="mt-4 gap-1.5 rounded-lg">
                        <Link href="/app/templates">
                          <Plus className="h-3.5 w-3.5" /> Create template
                        </Link>
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground/60">
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
                                "w-full rounded-xl border px-4 py-3 text-left transition-all",
                                isSel
                                  ? "border-primary/40 bg-primary/5 shadow-[0_0_0_1px_var(--tw-shadow-color)] shadow-primary/20"
                                  : "border-border/60 hover:border-border hover:bg-muted/30",
                                isActive && "pointer-events-none opacity-50"
                              )}
                            >
                              <div className="flex items-center justify-between gap-2">
                                <div className="flex items-center gap-2.5 min-w-0">
                                  <FileCode className={cn("h-4 w-4 shrink-0", isSel ? "text-primary" : "text-muted-foreground")} />
                                  <span className="text-sm font-medium truncate">{t.name}</span>
                                </div>
                                {vars.length > 0 && (
                                  <span className="text-[11px] text-muted-foreground shrink-0">
                                    {vars.length} var{vars.length !== 1 ? "s" : ""}
                                  </span>
                                )}
                              </div>
                              {isSel && vars.length > 0 && (
                                <div className="mt-1.5 flex flex-wrap gap-1">
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
                        <div className="rounded-xl border border-border/60 bg-muted/20 px-4 py-3.5">
                          <input type="hidden" name="templateId" value={selectedTemplateId} />
                          <input type="hidden" name="variableKeys" value={templateVars.join(",")} />
                          {templateVars.length > 0 ? (
                            <div className="space-y-2.5">
                              <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground/50">
                                Variables
                              </p>
                              {templateVars.map((v) => (
                                <div key={v} className="flex items-center gap-3">
                                  <label className="w-24 shrink-0 font-mono text-[11px] text-muted-foreground truncate">{v}</label>
                                  <Input name={`var_${v}`} placeholder={`Value for ${v}`} disabled={isActive} className="h-8 text-xs" />
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-[12px] text-muted-foreground">This template has no variables — renders as-is.</p>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </TabsContent>
              </div>

              {/* Generate button row */}
              <div className="flex items-center justify-between border-t border-border/60 px-5 py-3.5 bg-muted/10">
                {phase === "done" && jobResult?.downloadUrl ? (
                  <Button asChild size="sm" className="gap-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white">
                    <a href={jobResult.downloadUrl} download target="_blank" rel="noreferrer">
                      <Download className="h-3.5 w-3.5" /> Download PDF
                    </a>
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    size="sm"
                    disabled={isActive || (mode === "template" && !selectedTemplateId)}
                    className="gap-2 rounded-lg"
                  >
                    {isActive && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                    Generate PDF
                  </Button>
                )}

                <div className="flex items-center gap-3">
                  {phase !== "idle" && !isActive && (
                    <button type="button" onClick={reset} className="text-[12px] text-muted-foreground hover:text-foreground transition-colors">
                      Reset
                    </button>
                  )}
                  {phase === "idle" && (
                    <p className="text-[11px] text-muted-foreground/60">
                      Results in{" "}
                      <Link href="/app/jobs" className="hover:text-primary transition-colors">Jobs</Link>
                      {" "}· links valid 24 h
                    </p>
                  )}
                  {slowWarning && (
                    <div className="flex items-center gap-1.5">
                      <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
                      <span className="text-[11px] text-amber-600 dark:text-amber-400">
                        Worker may be offline — check <code className="font-mono">pm2 list</code>
                      </span>
                    </div>
                  )}
                  {phase === "failed" && (
                    <p className="text-[12px] text-destructive">
                      {(state && "error" in state && state.error) || jobResult?.errorMessage || "Render failed"}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* ── Divider ───────────────────────────────────────── */}
            <div className="hidden lg:block w-px bg-border/50 shrink-0" />

            {/* ── Right: Inspector ──────────────────────────────── */}
            <div className="hidden lg:flex lg:w-[268px] shrink-0 flex-col overflow-y-auto bg-muted/[0.08] divide-y divide-border/50">

              {/* Layout */}
              <div className="pb-2">
                <InspectorSection title="Layout" />
                <InspectorRow label="Format">
                  <Select value={format} onValueChange={setFormat} disabled={isActive || useCustomDimensions}>
                    <SelectTrigger className="h-7 w-[90px] rounded-lg border-border/50 bg-background text-xs shadow-none">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PDF_FORMATS.map((f) => (
                        <SelectItem key={f} value={f} className="text-xs">{f}</SelectItem>
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
                    className={tinyInput}
                  />
                </InspectorRow>
                <InspectorRow label="Height">
                  <input
                    value={customHeight}
                    onChange={(e) => setCustomHeight(e.target.value)}
                    placeholder="e.g. 20cm"
                    disabled={isActive}
                    className={tinyInput}
                  />
                </InspectorRow>
                {useCustomDimensions && (
                  <p className="px-4 pb-1 text-[10px] text-amber-600 dark:text-amber-400">
                    Custom size overrides Format
                  </p>
                )}
                <InspectorRow label="Scale">
                  <input
                    value={scale}
                    onChange={(e) => setScale(e.target.value)}
                    placeholder="1"
                    disabled={isActive}
                    className={tinyInput}
                  />
                </InspectorRow>
                <InspectorRow label="Page Ranges">
                  <input
                    value={pageRanges}
                    onChange={(e) => setPageRanges(e.target.value)}
                    placeholder="1-3, 5"
                    disabled={isActive}
                    className={tinyInput}
                  />
                </InspectorRow>
              </div>

              {/* Print Production */}
              <div className="pb-2">
                <InspectorSection title="Print Production" />
                <InspectorRow label="Landscape">
                  <Switch checked={landscape} onCheckedChange={setLandscape} disabled={isActive} className="scale-[0.85]" />
                </InspectorRow>
                <InspectorRow label="Print Background">
                  <Switch checked={printBackground} onCheckedChange={setPrintBackground} disabled={isActive} className="scale-[0.85]" />
                </InspectorRow>
                <InspectorRow label="Prefer CSS Page Size">
                  <Switch checked={preferCSSPageSize} onCheckedChange={setPreferCSSPageSize} disabled={isActive} className="scale-[0.85]" />
                </InspectorRow>
              </div>

              {/* Margins */}
              <div className="pb-3">
                <InspectorSection title="Margins" />
                {/* Presets */}
                <div className="flex gap-1 px-4 pb-2.5">
                  {(Object.keys(MARGIN_PRESETS) as Array<keyof typeof MARGIN_PRESETS>).map((key) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => applyMarginPreset(key)}
                      disabled={isActive}
                      className={cn(
                        "flex-1 rounded-md border py-[3px] text-[10px] capitalize transition-all",
                        activePreset === key
                          ? "border-primary/50 bg-primary/10 text-primary font-medium"
                          : "border-border/50 text-muted-foreground hover:border-border hover:text-foreground",
                        isActive && "opacity-40 pointer-events-none"
                      )}
                    >
                      {key === "normal" ? "Md" : key.charAt(0).toUpperCase() + key.slice(1)}
                    </button>
                  ))}
                </div>
                {/* Custom T/R/B/L */}
                <div className="grid grid-cols-[20px_1fr_20px_1fr] items-center gap-x-1.5 gap-y-1.5 px-4">
                  {[
                    { l: "T", v: marginTop, s: setMarginTop },
                    { l: "R", v: marginRight, s: setMarginRight },
                    { l: "B", v: marginBottom, s: setMarginBottom },
                    { l: "L", v: marginLeft, s: setMarginLeft },
                  ].map(({ l, v, s }) => (
                    <>
                      <span key={`${l}-label`} className="text-[10px] text-muted-foreground/60 text-center">{l}</span>
                      <input
                        key={`${l}-input`}
                        value={v}
                        onChange={(e) => s(e.target.value)}
                        disabled={isActive}
                        className="h-6 rounded-md border border-border/50 bg-muted/40 px-1.5 text-[10px] font-mono text-center focus:outline-none focus:ring-1 focus:ring-ring disabled:opacity-50 w-full"
                      />
                    </>
                  ))}
                </div>
              </div>

              {/* Header & Footer */}
              <div className="pb-2">
                <InspectorSection title="Header &amp; Footer" />
                <InspectorRow label="Show header &amp; footer">
                  <Switch
                    checked={displayHeaderFooter}
                    onCheckedChange={(v) => { setDisplayHeaderFooter(v); setShowHFHtml(v); }}
                    disabled={isActive}
                    className="scale-[0.85]"
                  />
                </InspectorRow>
                {displayHeaderFooter && (
                  <div className="px-4 pt-1 pb-2 space-y-2">
                    <button
                      type="button"
                      onClick={() => setShowHFHtml((p) => !p)}
                      className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <ChevronDown className={cn("h-3 w-3 transition-transform", showHFHtml && "rotate-180")} />
                      {showHFHtml ? "Hide" : "Edit"} HTML templates
                    </button>
                    {showHFHtml && (
                      <div className="space-y-2">
                        <div className="space-y-1">
                          <p className="text-[9px] uppercase tracking-wide text-muted-foreground/50 font-semibold">Header</p>
                          <textarea
                            value={headerTemplate}
                            onChange={(e) => setHeaderTemplate(e.target.value)}
                            rows={2}
                            disabled={isActive}
                            className="w-full rounded-lg border border-border/50 bg-background px-2.5 py-1.5 font-mono text-[10px] leading-relaxed focus:outline-none focus:ring-1 focus:ring-ring disabled:opacity-50 resize-none"
                          />
                        </div>
                        <div className="space-y-1">
                          <p className="text-[9px] uppercase tracking-wide text-muted-foreground/50 font-semibold">Footer</p>
                          <textarea
                            value={footerTemplate}
                            onChange={(e) => setFooterTemplate(e.target.value)}
                            rows={2}
                            disabled={isActive}
                            className="w-full rounded-lg border border-border/50 bg-background px-2.5 py-1.5 font-mono text-[10px] leading-relaxed focus:outline-none focus:ring-1 focus:ring-ring disabled:opacity-50 resize-none"
                          />
                        </div>
                        <p className="text-[9px] text-muted-foreground/50 leading-relaxed">
                          Use <code className="font-mono bg-muted rounded px-0.5">.title</code>{" "}
                          <code className="font-mono bg-muted rounded px-0.5">.pageNumber</code>{" "}
                          <code className="font-mono bg-muted rounded px-0.5">.totalPages</code>
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Output & Accessibility */}
              <div className="pb-2">
                <InspectorSection title="Output" />
                <InspectorRow label="Tagged PDF">
                  <Switch checked={tagged} onCheckedChange={setTagged} disabled={isActive} className="scale-[0.85]" />
                </InspectorRow>
                <InspectorRow label="Embed Outline">
                  <Switch checked={outline} onCheckedChange={setOutline} disabled={isActive} className="scale-[0.85]" />
                </InspectorRow>
                <InspectorRow label="Compression">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-[9px] rounded-full px-1.5 h-4 font-medium">Pro</Badge>
                    <Switch disabled className="scale-[0.85] opacity-40" />
                  </div>
                </InspectorRow>
              </div>

            </div>
          </div>
        </Tabs>
      </div>
    </form>
  );
}
