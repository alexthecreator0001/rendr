"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { convertUrlAction, type ConvertState } from "@/app/actions/convert";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Loader2, Download, CheckCircle2, XCircle, FileText, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

type Phase = "idle" | "submitting" | "polling" | "done" | "failed";

interface JobResult {
  status: string;
  downloadUrl: string | null;
  errorMessage: string | null;
}

type Format = "A4" | "Letter";
type Orientation = "portrait" | "landscape";
type Margin = "none" | "small" | "normal" | "large";

function SegmentGroup<T extends string>({
  label,
  options,
  value,
  onChange,
  disabled,
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
                : "border-border text-muted-foreground hover:text-foreground hover:border-border/80",
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

export function ConvertClient() {
  const [state, action, pending] = useActionState<ConvertState, FormData>(
    convertUrlAction,
    null
  );
  const [mode, setMode] = useState<"url" | "html">("url");
  const [phase, setPhase] = useState<Phase>("idle");
  const [jobResult, setJobResult] = useState<JobResult | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [slowWarning, setSlowWarning] = useState(false);

  // Render settings
  const [format, setFormat] = useState<Format>("A4");
  const [orientation, setOrientation] = useState<Orientation>("portrait");
  const [margin, setMargin] = useState<Margin>("normal");

  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startedAt = useRef<number>(0);

  // When action returns a jobId → start polling
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

  // When pending → set submitting phase
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
          onValueChange={(v) => { setMode(v as "url" | "html"); reset(); }}
        >
          <TabsList className="mb-5 h-8 gap-1 bg-muted/60 p-0.5">
            <TabsTrigger value="url" className="h-7 px-4 text-xs rounded-md">
              URL
            </TabsTrigger>
            <TabsTrigger value="html" className="h-7 px-4 text-xs rounded-md">
              HTML
            </TabsTrigger>
          </TabsList>

          <form action={action}>
            <input type="hidden" name="mode" value={mode} />
            <input type="hidden" name="format" value={format} />
            <input type="hidden" name="orientation" value={orientation} />
            <input type="hidden" name="margin" value={margin} />

            <TabsContent value="url" className="mt-0">
              <label className="mb-1.5 block text-sm font-medium text-foreground">
                Page URL
              </label>
              <input
                name="input"
                type="url"
                placeholder="https://example.com/invoice/123"
                disabled={isActive}
                className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1 disabled:opacity-50"
              />
              <p className="mt-2 text-xs text-muted-foreground">
                Rendr will load the URL in a full browser and capture it as a PDF.
              </p>
            </TabsContent>

            <TabsContent value="html" className="mt-0">
              <label className="mb-1.5 block text-sm font-medium text-foreground">
                HTML content
              </label>
              <textarea
                name="input"
                rows={10}
                placeholder={"<!DOCTYPE html>\n<html>\n  <body>\n    <h1>Hello, PDF</h1>\n  </body>\n</html>"}
                disabled={isActive}
                className="w-full rounded-xl border border-input bg-background px-4 py-2.5 font-mono text-xs placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1 disabled:opacity-50 resize-none"
              />
            </TabsContent>

            {/* Render settings */}
            <div className="mt-5 rounded-xl border border-border bg-muted/30 p-4 space-y-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground/60 mb-1">
                PDF options
              </p>
              <SegmentGroup<Format>
                label="Format"
                value={format}
                onChange={setFormat}
                disabled={isActive}
                options={[
                  { value: "A4", label: "A4" },
                  { value: "Letter", label: "Letter" },
                ]}
              />
              <SegmentGroup<Orientation>
                label="Orientation"
                value={orientation}
                onChange={setOrientation}
                disabled={isActive}
                options={[
                  { value: "portrait", label: "Portrait" },
                  { value: "landscape", label: "Landscape" },
                ]}
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
                disabled={isActive}
                className="rounded-xl px-6 gap-2"
              >
                {isActive && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                Convert to PDF
              </Button>
              {phase !== "idle" && !isActive && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={reset}
                  className="text-muted-foreground"
                >
                  Convert another
                </Button>
              )}
            </div>
          </form>
        </Tabs>
      </div>

      {/* Status card */}
      {phase !== "idle" && (
        <div
          className={cn(
            "rounded-2xl border p-6 transition-all space-y-3",
            phase === "done" && "border-emerald-500/30 bg-emerald-500/5",
            phase === "failed" && "border-destructive/30 bg-destructive/5",
            (phase === "polling" || phase === "submitting") &&
              "border-border bg-muted/30"
          )}
        >
          {/* Polling / submitting */}
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
                    {phase === "polling"
                      ? `${elapsed}s — usually under 10 seconds`
                      : "Submitting your request"}
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

          {/* Done */}
          {phase === "done" && jobResult?.downloadUrl && (
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-emerald-500/30 bg-emerald-500/10">
                  <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
                    PDF ready
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Rendered in {elapsed}s · {format} {orientation} · Signed link valid 24 h
                  </p>
                </div>
              </div>
              <Button
                asChild
                className="shrink-0 rounded-xl gap-2 bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                <a href={jobResult.downloadUrl} download target="_blank" rel="noreferrer">
                  <Download className="h-4 w-4" />
                  Download PDF
                </a>
              </Button>
            </div>
          )}

          {/* Failed */}
          {phase === "failed" && (
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-destructive/30 bg-destructive/10">
                <XCircle className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <p className="text-sm font-semibold text-destructive">
                  Conversion failed
                </p>
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

      {/* Hint */}
      {phase === "idle" && (
        <div className="flex items-start gap-3 rounded-xl border border-dashed border-border bg-muted/20 p-4">
          <FileText className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground/60" />
          <p className="text-xs text-muted-foreground">
            Completed conversions appear in{" "}
            <a href="/app/jobs" className="font-medium text-primary hover:underline">
              Jobs
            </a>
            . Download links are signed and valid for 24 hours.
          </p>
        </div>
      )}
    </div>
  );
}
