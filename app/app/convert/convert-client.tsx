"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { convertUrlAction, type ConvertState } from "@/app/actions/convert";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Loader2, Download, CheckCircle2, XCircle, FileText,
  AlertTriangle, FileCode, Braces, Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

type Phase = "idle" | "submitting" | "polling" | "done" | "failed";
type Format = "A4" | "Letter";
type Orientation = "portrait" | "landscape";
type Margin = "none" | "small" | "normal" | "large";
type ConvertTemplate = { id: string; name: string; html: string };

interface JobResult {
  status: string;
  downloadUrl: string | null;
  errorMessage: string | null;
}

function extractVariables(html: string): string[] {
  const matches = [...html.matchAll(/\{\{\s*(\w+)\s*\}\}/g)];
  return [...new Set(matches.map((m) => m[1]))];
}

function SegmentGroup<T extends string>({
  label, options, value, onChange, disabled,
}: {
  label: string;
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-24 shrink-0 text-xs text-muted-foreground">{label}</span>
      <div className="flex gap-1">
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            disabled={disabled}
            onClick={() => onChange(opt.value)}
            className={cn(
              "rounded-lg border px-3 py-1 text-xs transition-all",
              value === opt.value
                ? "border-primary bg-primary/10 text-primary font-medium"
                : "border-border text-muted-foreground hover:text-foreground",
              disabled && "pointer-events-none opacity-50"
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

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

  // Template tab state
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("");
  const selectedTemplate = templates.find((t) => t.id === selectedTemplateId) ?? null;
  const templateVars = selectedTemplate ? extractVariables(selectedTemplate.html) : [];

  // Render settings
  const [format, setFormat] = useState<Format>("A4");
  const [orientation, setOrientation] = useState<Orientation>("portrait");
  const [margin, setMargin] = useState<Margin>("normal");

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

  const isActive = phase === "submitting" || phase === "polling";

  return (
    <div className="space-y-4">
      {/* Input card */}
      <div className="rounded-2xl border border-border bg-card p-6">
        <Tabs
          value={mode}
          onValueChange={(v) => { setMode(v as typeof mode); reset(); }}
        >
          <TabsList className="mb-5 h-8 gap-1 bg-muted/60 p-0.5">
            <TabsTrigger value="url" className="h-7 px-4 text-xs rounded-md">URL</TabsTrigger>
            <TabsTrigger value="html" className="h-7 px-4 text-xs rounded-md">HTML</TabsTrigger>
            <TabsTrigger value="template" className="h-7 px-4 text-xs rounded-md">
              Template
              {templates.length > 0 && (
                <Badge variant="secondary" className="ml-1.5 rounded-full px-1.5 py-0 text-[10px] h-4">
                  {templates.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <form action={action}>
            <input type="hidden" name="mode" value={mode} />
            <input type="hidden" name="format" value={format} />
            <input type="hidden" name="orientation" value={orientation} />
            <input type="hidden" name="margin" value={margin} />

            {/* URL tab */}
            <TabsContent value="url" className="mt-0">
              <label className="mb-1.5 block text-sm font-medium">Page URL</label>
              <input
                name="input"
                type="url"
                placeholder="https://example.com/invoice/123"
                disabled={isActive}
                className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
              />
              <p className="mt-2 text-xs text-muted-foreground">
                Rendr will load the URL in a full browser and capture it as a PDF.
              </p>
            </TabsContent>

            {/* HTML tab */}
            <TabsContent value="html" className="mt-0">
              <label className="mb-1.5 block text-sm font-medium">HTML content</label>
              <textarea
                name="input"
                rows={10}
                placeholder={"<!DOCTYPE html>\n<html>\n  <body>\n    <h1>Hello, PDF</h1>\n  </body>\n</html>"}
                disabled={isActive}
                className="w-full rounded-xl border border-input bg-background px-4 py-2.5 font-mono text-xs placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50 resize-none"
              />
            </TabsContent>

            {/* Template tab */}
            <TabsContent value="template" className="mt-0">
              {templates.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-10 text-center">
                  <FileCode className="h-8 w-8 text-muted-foreground/30 mb-3" />
                  <p className="text-sm font-medium">No templates yet</p>
                  <p className="text-xs text-muted-foreground mt-1 mb-4">
                    Create a template first, then render it here.
                  </p>
                  <Button asChild size="sm" variant="outline" className="gap-1.5">
                    <Link href="/app/templates">
                      <Plus className="h-3.5 w-3.5" /> Create template
                    </Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Template picker */}
                  <div className="space-y-2">
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
                                {vars.length} variable{vars.length !== 1 ? "s" : ""}
                              </span>
                            )}
                          </div>
                          {isSelected && vars.length > 0 && (
                            <div className="mt-1 flex flex-wrap gap-1">
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

                  {/* Variable inputs for selected template */}
                  {selectedTemplate && templateVars.length > 0 && (
                    <div className="rounded-xl border border-border bg-muted/20 p-4 space-y-3">
                      <input type="hidden" name="templateId" value={selectedTemplateId} />
                      <input type="hidden" name="variableKeys" value={templateVars.join(",")} />
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground/60">
                        Variables
                      </p>
                      {templateVars.map((v) => (
                        <div key={v} className="flex items-center gap-3">
                          <label className="w-28 shrink-0 font-mono text-xs text-muted-foreground truncate">
                            {v}
                          </label>
                          <input
                            name={`var_${v}`}
                            type="text"
                            placeholder={`Value for ${v}`}
                            disabled={isActive}
                            className="flex-1 rounded-lg border border-input bg-background px-3 py-1.5 text-xs placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  {selectedTemplate && templateVars.length === 0 && (
                    <div className="rounded-xl border border-border bg-muted/20 px-4 py-3">
                      <input type="hidden" name="templateId" value={selectedTemplateId} />
                      <input type="hidden" name="variableKeys" value="" />
                      <p className="text-xs text-muted-foreground">
                        This template has no variables — it will render as-is.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </TabsContent>

            {/* PDF options */}
            <div className="mt-5 rounded-xl border border-border bg-muted/30 p-4 space-y-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground/60 mb-1">
                PDF options
              </p>
              <SegmentGroup<Format>
                label="Format"
                value={format}
                onChange={setFormat}
                disabled={isActive}
                options={[{ value: "A4", label: "A4" }, { value: "Letter", label: "Letter" }]}
              />
              <SegmentGroup<Orientation>
                label="Orientation"
                value={orientation}
                onChange={setOrientation}
                disabled={isActive}
                options={[{ value: "portrait", label: "Portrait" }, { value: "landscape", label: "Landscape" }]}
              />
              <SegmentGroup<Margin>
                label="Margins"
                value={margin}
                onChange={setMargin}
                disabled={isActive}
                options={[
                  { value: "none", label: "None" },
                  { value: "small", label: "Small" },
                  { value: "normal", label: "Normal" },
                  { value: "large", label: "Large" },
                ]}
              />
            </div>

            <div className="mt-5 flex items-center gap-3">
              <Button
                type="submit"
                disabled={isActive || (mode === "template" && !selectedTemplateId)}
                className="rounded-xl px-6 gap-2"
              >
                {isActive && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                Convert to PDF
              </Button>
              {phase !== "idle" && !isActive && (
                <Button type="button" variant="ghost" size="sm" onClick={reset} className="text-muted-foreground">
                  Convert another
                </Button>
              )}
            </div>
          </form>
        </Tabs>
      </div>

      {/* Status card */}
      {phase !== "idle" && (
        <div className={cn(
          "rounded-2xl border p-6 transition-all space-y-3",
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
                    {phase === "submitting" ? "Queuing job…" : "Rendering…"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {phase === "polling" ? `${elapsed}s — usually under 10 seconds` : "Submitting your request"}
                  </p>
                </div>
              </div>
              {slowWarning && (
                <div className="flex items-start gap-2.5 rounded-lg border border-amber-500/30 bg-amber-500/5 px-3.5 py-2.5">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                  <p className="text-xs text-amber-700 dark:text-amber-400">
                    Still waiting after {elapsed}s. The PDF worker may be offline.
                    Check that <code className="font-mono">rendr-worker</code> is running:{" "}
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
                    Rendered in {elapsed}s · {format} {orientation} · Link valid 24 h
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
                <p className="text-sm font-semibold text-destructive">Conversion failed</p>
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
        <div className="flex items-start gap-3 rounded-xl border border-dashed border-border bg-muted/20 p-4">
          <FileText className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground/60" />
          <p className="text-xs text-muted-foreground">
            Completed conversions appear in{" "}
            <a href="/app/jobs" className="font-medium text-primary hover:underline">Jobs</a>.
            Download links are signed and valid for 24 hours.
          </p>
        </div>
      )}
    </div>
  );
}
