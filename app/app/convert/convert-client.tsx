"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { convertUrlAction, type ConvertState } from "@/app/actions/convert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Loader2, Download, CheckCircle2, XCircle, FileText,
  AlertTriangle, FileCode, Braces, Plus, BookOpen,
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
  "A4", "Letter", "Legal", "Tabloid",
  "A0", "A1", "A2", "A3", "A5", "A6",
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

// ── Small reusable option row ────────────────────────────────────────────────
function OptionRow({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-3 min-h-[32px]">
      <div className="min-w-0 flex-1">
        <span className="text-sm text-foreground">{label}</span>
        {hint && (
          <span className="ml-1.5 text-xs text-muted-foreground/60">
            — <a href="/docs" target="_blank" className="hover:underline underline-offset-2">docs</a>
          </span>
        )}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

// ── Section header inside options panel ─────────────────────────────────────
function OptionsSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground/50">
        {title}
      </p>
      {children}
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

  // Template state
  const [selectedTemplateId, setSelectedTemplateId] = useState("");
  const selectedTemplate = templates.find((t) => t.id === selectedTemplateId) ?? null;
  const templateVars = selectedTemplate ? extractVariables(selectedTemplate.html) : [];

  // ── PDF options state ──────────────────────────────────────────────────────
  // Layout
  const [format, setFormat] = useState("A4");
  const [customWidth, setCustomWidth] = useState("");
  const [customHeight, setCustomHeight] = useState("");
  const [scale, setScale] = useState("1");
  const [pageRanges, setPageRanges] = useState("");

  // Print production
  const [landscape, setLandscape] = useState(false);
  const [printBackground, setPrintBackground] = useState(true);
  const [preferCSSPageSize, setPreferCSSPageSize] = useState(false);

  // Margins
  const [marginTop, setMarginTop] = useState("20mm");
  const [marginRight, setMarginRight] = useState("15mm");
  const [marginBottom, setMarginBottom] = useState("20mm");
  const [marginLeft, setMarginLeft] = useState("15mm");

  // Header & Footer
  const [displayHeaderFooter, setDisplayHeaderFooter] = useState(false);
  const [headerTemplate, setHeaderTemplate] = useState(
    '<div style="font-size:10px;padding:0 12mm;width:100%;color:#666"><span class="title"></span></div>'
  );
  const [footerTemplate, setFooterTemplate] = useState(
    '<div style="font-size:10px;padding:0 12mm;width:100%;color:#666;text-align:center"><span class="pageNumber"></span> / <span class="totalPages"></span></div>'
  );

  // Output & Accessibility
  const [tagged, setTagged] = useState(false);
  const [outline, setOutline] = useState(false);

  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startedAt = useRef<number>(0);

  useEffect(() => {
    if (!state) return;
    if ("error" in state && state.error) {
      setPhase("failed");
      return;
    }
    if ("jobId" in state && state.jobId) {
      startedAt.current = Date.now();
      setPhase("polling");
      setElapsed(0);
      setSlowWarning(false);

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
            clearInterval(pollRef.current!);
            clearInterval(timerRef.current!);
            setJobResult(data);
            setPhase("done");
          } else if (data.status === "failed") {
            clearInterval(pollRef.current!);
            clearInterval(timerRef.current!);
            setJobResult(data);
            setPhase("failed");
          }
        } catch {
          // network blip — keep polling
        }
      }, 1500);
    }
    return () => {
      clearInterval(pollRef.current!);
      clearInterval(timerRef.current!);
    };
  }, [state]);

  useEffect(() => {
    if (pending) setPhase("submitting");
  }, [pending]);

  function reset() {
    clearInterval(pollRef.current!);
    clearInterval(timerRef.current!);
    setPhase("idle");
    setJobResult(null);
    setElapsed(0);
    setSlowWarning(false);
  }

  function applyMarginPreset(key: keyof typeof MARGIN_PRESETS) {
    const m = MARGIN_PRESETS[key];
    setMarginTop(m.top);
    setMarginRight(m.right);
    setMarginBottom(m.bottom);
    setMarginLeft(m.left);
  }

  const isActive = phase === "submitting" || phase === "polling";
  const useCustomDimensions = !!(customWidth || customHeight);

  return (
    <form action={action}>
      {/* Hidden option inputs */}
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

      {/* Two-column layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">

        {/* ── Left: Source + Status ──────────────────────────────── */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-border bg-card overflow-hidden">
            {/* Section header */}
            <div className="px-5 py-3.5 border-b border-border bg-muted/30">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground/60">
                Source Configuration
              </p>
            </div>

            <div className="p-5">
              <Tabs
                value={mode}
                onValueChange={(v) => { setMode(v as typeof mode); reset(); }}
              >
                <TabsList className="mb-5 h-8 gap-0.5 bg-muted/60 p-0.5 rounded-lg">
                  <TabsTrigger value="template" className="h-7 px-3.5 text-xs rounded-md">
                    Template
                    {templates.length > 0 && (
                      <Badge variant="secondary" className="ml-1.5 rounded-full px-1.5 py-0 text-[10px] h-4">
                        {templates.length}
                      </Badge>
                    )}
                  </TabsTrigger>
                  <TabsTrigger value="html" className="h-7 px-3.5 text-xs rounded-md">HTML</TabsTrigger>
                  <TabsTrigger value="url" className="h-7 px-3.5 text-xs rounded-md">URL</TabsTrigger>
                </TabsList>

                {/* URL tab */}
                <TabsContent value="url" className="mt-0 space-y-2">
                  <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Page URL
                  </Label>
                  <Input
                    name="input"
                    type="url"
                    placeholder="https://example.com/invoice/123"
                    disabled={isActive}
                    className="font-mono text-sm"
                  />
                  <p className="text-xs text-muted-foreground">
                    Rendr loads the URL in a full Chromium browser and renders it to PDF.
                  </p>
                </TabsContent>

                {/* HTML tab */}
                <TabsContent value="html" className="mt-0 space-y-2">
                  <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    HTML content
                  </Label>
                  <textarea
                    name="input"
                    rows={12}
                    placeholder={"<!DOCTYPE html>\n<html>\n  <body>\n    <h1>Hello, PDF</h1>\n  </body>\n</html>"}
                    disabled={isActive}
                    className="w-full rounded-lg border border-input bg-background px-3.5 py-2.5 font-mono text-xs placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50 resize-none"
                  />
                </TabsContent>

                {/* Template tab */}
                <TabsContent value="template" className="mt-0">
                  {templates.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-12 text-center">
                      <FileCode className="h-8 w-8 text-muted-foreground/30 mb-3" />
                      <p className="text-sm font-medium">No templates yet</p>
                      <p className="text-xs text-muted-foreground mt-1 mb-4">
                        Create your first template to get started with PDF generation.
                      </p>
                      <Button asChild size="sm" variant="outline" className="gap-1.5">
                        <Link href="/app/templates">
                          <Plus className="h-3.5 w-3.5" /> Create template
                        </Link>
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="space-y-1.5">
                        {templates.map((t) => {
                          const vars = extractVariables(t.html);
                          const isSelected = selectedTemplateId === t.id;
                          return (
                            <button
                              key={t.id}
                              type="button"
                              disabled={isActive}
                              onClick={() => setSelectedTemplateId(isSelected ? "" : t.id)}
                              className={cn(
                                "w-full text-left rounded-xl border px-4 py-3 transition-all",
                                isSelected
                                  ? "border-primary bg-primary/5"
                                  : "border-border hover:border-border/80 hover:bg-muted/30",
                                isActive && "pointer-events-none opacity-50"
                              )}
                            >
                              <div className="flex items-center justify-between gap-2">
                                <div className="flex items-center gap-2.5 min-w-0">
                                  <FileCode className={cn("h-4 w-4 shrink-0", isSelected ? "text-primary" : "text-muted-foreground")} />
                                  <span className="font-medium text-sm truncate">{t.name}</span>
                                </div>
                                {vars.length > 0 && (
                                  <span className="shrink-0 text-[11px] text-muted-foreground">
                                    {vars.length} var{vars.length !== 1 ? "s" : ""}
                                  </span>
                                )}
                              </div>
                              {isSelected && vars.length > 0 && (
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

                      {selectedTemplate && templateVars.length > 0 && (
                        <div className="rounded-xl border border-border bg-muted/20 p-4 space-y-3">
                          <input type="hidden" name="templateId" value={selectedTemplateId} />
                          <input type="hidden" name="variableKeys" value={templateVars.join(",")} />
                          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground/50">Variables</p>
                          {templateVars.map((v) => (
                            <div key={v} className="flex items-center gap-3">
                              <label className="w-28 shrink-0 font-mono text-xs text-muted-foreground truncate">{v}</label>
                              <Input
                                name={`var_${v}`}
                                type="text"
                                placeholder={`Value for ${v}`}
                                disabled={isActive}
                                className="text-xs h-8"
                              />
                            </div>
                          ))}
                        </div>
                      )}

                      {selectedTemplate && templateVars.length === 0 && (
                        <div className="rounded-xl border border-border bg-muted/20 px-4 py-3">
                          <input type="hidden" name="templateId" value={selectedTemplateId} />
                          <input type="hidden" name="variableKeys" value="" />
                          <p className="text-xs text-muted-foreground">This template has no variables — it will render as-is.</p>
                        </div>
                      )}
                    </div>
                  )}
                </TabsContent>
              </Tabs>

              {/* Generate button */}
              <div className="mt-5 flex items-center gap-3">
                <Button
                  type="submit"
                  disabled={isActive || (mode === "template" && !selectedTemplateId)}
                  className="gap-2 rounded-xl"
                >
                  {isActive && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                  Generate PDF
                </Button>
                {phase !== "idle" && !isActive && (
                  <Button type="button" variant="ghost" size="sm" onClick={reset} className="text-muted-foreground">
                    Generate another
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Status card */}
          {phase !== "idle" && (
            <div className={cn(
              "rounded-2xl border p-5 space-y-3",
              phase === "done" && "border-emerald-500/30 bg-emerald-500/5",
              phase === "failed" && "border-destructive/30 bg-destructive/5",
              (phase === "polling" || phase === "submitting") && "border-border bg-muted/30"
            )}>
              {(phase === "polling" || phase === "submitting") && (
                <>
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border bg-background">
                      <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">
                        {phase === "submitting" ? "Queuing job…" : "Rendering PDF…"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {phase === "polling" ? `${elapsed}s elapsed · usually under 10s` : "Submitting your request"}
                      </p>
                    </div>
                  </div>
                  {slowWarning && (
                    <div className="flex items-start gap-2.5 rounded-lg border border-amber-500/30 bg-amber-500/5 px-3.5 py-2.5">
                      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                      <p className="text-xs text-amber-700 dark:text-amber-400">
                        Still waiting after {elapsed}s. Check that <code className="font-mono">rendr-worker</code> is running:{" "}
                        <code className="font-mono">pm2 list</code>
                      </p>
                    </div>
                  )}
                </>
              )}

              {phase === "done" && jobResult?.downloadUrl && (
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-emerald-500/30 bg-emerald-500/10">
                      <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">PDF ready</p>
                      <p className="text-xs text-muted-foreground">
                        Rendered in {elapsed}s · {useCustomDimensions ? `${customWidth}×${customHeight}` : format} · Link valid 24 h
                      </p>
                    </div>
                  </div>
                  <Button asChild className="shrink-0 rounded-xl gap-2 bg-emerald-600 hover:bg-emerald-700 text-white">
                    <a href={jobResult.downloadUrl} download target="_blank" rel="noreferrer">
                      <Download className="h-4 w-4" /> Download PDF
                    </a>
                  </Button>
                </div>
              )}

              {phase === "failed" && (
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-destructive/30 bg-destructive/10">
                    <XCircle className="h-5 w-5 text-destructive" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-destructive">Generation failed</p>
                    <p className="text-xs text-muted-foreground">
                      {(state && "error" in state && state.error) ||
                        jobResult?.errorMessage ||
                        "An unexpected error occurred."}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {phase === "idle" && (
            <div className="flex items-start gap-3 rounded-xl border border-dashed border-border bg-muted/20 px-4 py-3">
              <FileText className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground/60" />
              <p className="text-xs text-muted-foreground">
                Completed renders appear in{" "}
                <Link href="/app/jobs" className="font-medium text-primary hover:underline">Jobs</Link>.
                Download links are signed and valid for 24 hours.
              </p>
            </div>
          )}
        </div>

        {/* ── Right: PDF Options panel ───────────────────────────── */}
        <div className="rounded-2xl border border-border bg-card overflow-hidden">
          <div className="px-5 py-3.5 border-b border-border bg-muted/30">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground/60">
              PDF Options
            </p>
          </div>

          <div className="divide-y divide-border">

            {/* Layout */}
            <div className="p-5 space-y-3.5">
              <OptionsSection title="Layout">
                <OptionRow label="Format" hint="docs">
                  <Select
                    value={format}
                    onValueChange={setFormat}
                    disabled={isActive || useCustomDimensions}
                  >
                    <SelectTrigger className="h-8 w-28 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PDF_FORMATS.map((f) => (
                        <SelectItem key={f} value={f} className="text-xs">{f}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </OptionRow>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <Label className="text-[10px] text-muted-foreground uppercase tracking-wide">
                      Width
                    </Label>
                    <Input
                      value={customWidth}
                      onChange={(e) => setCustomWidth(e.target.value)}
                      placeholder="e.g. 15cm"
                      disabled={isActive}
                      className="h-8 text-xs font-mono"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[10px] text-muted-foreground uppercase tracking-wide">
                      Height
                    </Label>
                    <Input
                      value={customHeight}
                      onChange={(e) => setCustomHeight(e.target.value)}
                      placeholder="e.g. 20cm"
                      disabled={isActive}
                      className="h-8 text-xs font-mono"
                    />
                  </div>
                </div>
                {useCustomDimensions && (
                  <p className="text-[10px] text-amber-600 dark:text-amber-400">
                    Custom dimensions override Format.
                  </p>
                )}

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <Label className="text-[10px] text-muted-foreground uppercase tracking-wide">
                      Scale
                    </Label>
                    <Input
                      value={scale}
                      onChange={(e) => setScale(e.target.value)}
                      placeholder="1"
                      disabled={isActive}
                      className="h-8 text-xs font-mono"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[10px] text-muted-foreground uppercase tracking-wide">
                      Page Ranges
                    </Label>
                    <Input
                      value={pageRanges}
                      onChange={(e) => setPageRanges(e.target.value)}
                      placeholder="1-3, 5"
                      disabled={isActive}
                      className="h-8 text-xs font-mono"
                    />
                  </div>
                </div>
              </OptionsSection>
            </div>

            {/* Print Production */}
            <div className="p-5 space-y-3.5">
              <OptionsSection title="Print Production">
                <OptionRow label="Landscape" hint="docs">
                  <Switch
                    checked={landscape}
                    onCheckedChange={setLandscape}
                    disabled={isActive}
                  />
                </OptionRow>
                <OptionRow label="Print Background" hint="docs">
                  <Switch
                    checked={printBackground}
                    onCheckedChange={setPrintBackground}
                    disabled={isActive}
                  />
                </OptionRow>
                <OptionRow label="Prefer CSS Page Size" hint="docs">
                  <Switch
                    checked={preferCSSPageSize}
                    onCheckedChange={setPreferCSSPageSize}
                    disabled={isActive}
                  />
                </OptionRow>
              </OptionsSection>
            </div>

            {/* Margins */}
            <div className="p-5 space-y-3.5">
              <OptionsSection title="Margins">
                {/* Quick presets */}
                <div className="flex gap-1.5">
                  {(Object.keys(MARGIN_PRESETS) as Array<keyof typeof MARGIN_PRESETS>).map((key) => {
                    const isActive2 =
                      marginTop === MARGIN_PRESETS[key].top &&
                      marginRight === MARGIN_PRESETS[key].right &&
                      marginBottom === MARGIN_PRESETS[key].bottom &&
                      marginLeft === MARGIN_PRESETS[key].left;
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => applyMarginPreset(key)}
                        disabled={isActive}
                        className={cn(
                          "flex-1 rounded-lg border px-2 py-1 text-[11px] capitalize transition-all",
                          isActive2
                            ? "border-primary bg-primary/10 text-primary font-medium"
                            : "border-border text-muted-foreground hover:text-foreground hover:border-border/60",
                          isActive && "opacity-50 pointer-events-none"
                        )}
                      >
                        {key}
                      </button>
                    );
                  })}
                </div>

                {/* Custom margin inputs */}
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: "Top", value: marginTop, setter: setMarginTop },
                    { label: "Right", value: marginRight, setter: setMarginRight },
                    { label: "Bottom", value: marginBottom, setter: setMarginBottom },
                    { label: "Left", value: marginLeft, setter: setMarginLeft },
                  ].map(({ label, value, setter }) => (
                    <div key={label} className="space-y-1">
                      <Label className="text-[10px] text-muted-foreground uppercase tracking-wide">
                        {label}
                      </Label>
                      <Input
                        value={value}
                        onChange={(e) => setter(e.target.value)}
                        placeholder="20mm"
                        disabled={isActive}
                        className="h-8 text-xs font-mono"
                      />
                    </div>
                  ))}
                </div>
              </OptionsSection>
            </div>

            {/* Header & Footer */}
            <div className="p-5 space-y-3.5">
              <OptionsSection title="Header &amp; Footer">
                <OptionRow label="Display header &amp; footer" hint="docs">
                  <Switch
                    checked={displayHeaderFooter}
                    onCheckedChange={setDisplayHeaderFooter}
                    disabled={isActive}
                  />
                </OptionRow>

                {displayHeaderFooter && (
                  <div className="space-y-3 pt-1">
                    <div className="space-y-1.5">
                      <Label className="text-[10px] text-muted-foreground uppercase tracking-wide">
                        Header HTML
                      </Label>
                      <textarea
                        value={headerTemplate}
                        onChange={(e) => setHeaderTemplate(e.target.value)}
                        rows={3}
                        disabled={isActive}
                        className="w-full rounded-lg border border-input bg-background px-3 py-2 font-mono text-[11px] placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50 resize-none"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[10px] text-muted-foreground uppercase tracking-wide">
                        Footer HTML
                      </Label>
                      <textarea
                        value={footerTemplate}
                        onChange={(e) => setFooterTemplate(e.target.value)}
                        rows={3}
                        disabled={isActive}
                        className="w-full rounded-lg border border-input bg-background px-3 py-2 font-mono text-[11px] placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50 resize-none"
                      />
                    </div>
                    <p className="text-[10px] text-muted-foreground leading-relaxed">
                      Use <code className="font-mono bg-muted px-1 rounded">.title</code>,{" "}
                      <code className="font-mono bg-muted px-1 rounded">.pageNumber</code>,{" "}
                      <code className="font-mono bg-muted px-1 rounded">.totalPages</code> class spans.
                    </p>
                  </div>
                )}
              </OptionsSection>
            </div>

            {/* Output & Accessibility */}
            <div className="p-5 space-y-3.5">
              <OptionsSection title="Output &amp; Accessibility">
                <OptionRow label="Tagged PDF" hint="docs">
                  <Switch
                    checked={tagged}
                    onCheckedChange={setTagged}
                    disabled={isActive}
                  />
                </OptionRow>
                <OptionRow label="Embed outline" hint="docs">
                  <Switch
                    checked={outline}
                    onCheckedChange={setOutline}
                    disabled={isActive}
                  />
                </OptionRow>
                {/* Compression — Pro feature */}
                <div className="flex items-center justify-between gap-3 min-h-[32px] opacity-50">
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <span className="text-sm text-foreground">Compression</span>
                    <Badge variant="secondary" className="text-[9px] rounded-full px-1.5 h-4">Pro</Badge>
                  </div>
                  <Switch disabled />
                </div>
              </OptionsSection>

              <div className="flex items-center gap-1.5 pt-1">
                <BookOpen className="h-3 w-3 text-muted-foreground/50" />
                <a
                  href="/docs"
                  target="_blank"
                  className="text-[11px] text-muted-foreground/60 hover:text-muted-foreground underline underline-offset-2 transition-colors"
                >
                  View full PDF options reference →
                </a>
              </div>
            </div>

          </div>
        </div>
      </div>
    </form>
  );
}
