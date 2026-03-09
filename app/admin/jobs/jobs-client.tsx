"use client";

import { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  Clock,
  AlertTriangle,
  CheckCircle,
  Loader2,
  Layers,
  ExternalLink,
  Copy,
  Check,
} from "lucide-react";

type Job = {
  id: string;
  status: "queued" | "processing" | "succeeded" | "failed";
  inputType: "html" | "url" | "template";
  inputContent: string | null;
  optionsJson: unknown;
  errorCode: string | null;
  errorMessage: string | null;
  resultUrl: string | null;
  downloadToken: string | null;
  templateId: string | null;
  createdAt: string;
  updatedAt: string;
  user: { email: string };
  template: { name: string } | null;
};

const statusConfig: Record<
  string,
  { color: string; bg: string; icon: React.ElementType }
> = {
  succeeded: { color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20", icon: CheckCircle },
  failed: { color: "text-red-400", bg: "bg-red-500/10 border-red-500/20", icon: AlertTriangle },
  processing: { color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20", icon: Loader2 },
  queued: { color: "text-zinc-400", bg: "bg-zinc-500/10 border-zinc-500/20", icon: Clock },
};

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
      className="ml-2 inline-flex items-center text-zinc-500 hover:text-zinc-300 transition-colors"
      title="Copy"
    >
      {copied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
    </button>
  );
}

function getDuration(job: Job) {
  if (job.status !== "succeeded" && job.status !== "failed") return null;
  return new Date(job.updatedAt).getTime() - new Date(job.createdAt).getTime();
}

function formatDuration(ms: number) {
  return ms >= 1000 ? `${(ms / 1000).toFixed(1)}s` : `${ms}ms`;
}

function DetailCell({ label, value, mono, copyable }: { label: string; value: string; mono?: boolean; copyable?: boolean }) {
  return (
    <div className="px-4 py-2.5">
      <p className="text-[10px] font-medium uppercase tracking-wide text-zinc-600 mb-0.5">{label}</p>
      <p className={`text-[12px] text-zinc-300 truncate ${mono ? "font-mono" : ""}`} title={value}>
        {value}
        {copyable && <CopyButton text={value} />}
      </p>
    </div>
  );
}

// ─── Expanded detail (shared between table & card) ────────────────────────────
function JobDetails({ job }: { job: Job }) {
  const duration = getDuration(job);
  const options = job.optionsJson && typeof job.optionsJson === "object" ? job.optionsJson : null;
  const hasOptions = options && Object.keys(options as Record<string, unknown>).length > 0;

  return (
    <div className="bg-zinc-900/50 border-l-2 border-blue-500/30 rounded-lg overflow-hidden">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-white/[0.02]">
        <DetailCell label="Job ID" value={job.id} mono copyable />
        <DetailCell label="User" value={job.user.email} copyable />
        <DetailCell label="Input Type" value={job.inputType} />
        <DetailCell label="Duration" value={duration !== null ? formatDuration(duration) : "N/A"} />
        <DetailCell label="Created" value={new Date(job.createdAt).toLocaleString()} />
        <DetailCell label="Updated" value={new Date(job.updatedAt).toLocaleString()} />
        {job.template && <DetailCell label="Template" value={job.template.name} />}
        {job.templateId && <DetailCell label="Template ID" value={job.templateId} mono copyable />}
        {job.downloadToken && <DetailCell label="Download Token" value={job.downloadToken} mono copyable />}
      </div>

      {job.status === "failed" && (job.errorCode || job.errorMessage) && (
        <div className="border-t border-white/[0.04] p-4">
          <h4 className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-red-400 mb-2">
            <AlertTriangle className="h-3 w-3" /> Error
          </h4>
          {job.errorCode && <p className="text-[12px] text-red-300 font-mono mb-1">Code: {job.errorCode}</p>}
          {job.errorMessage && (
            <pre className="text-[12px] text-red-300/90 bg-red-500/5 border border-red-500/10 rounded-lg p-3 whitespace-pre-wrap break-all max-h-60 overflow-auto font-mono">
              {job.errorMessage}
            </pre>
          )}
        </div>
      )}

      {job.inputContent && (
        <div className="border-t border-white/[0.04] p-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-[11px] font-semibold uppercase tracking-wide text-zinc-400">
              Input Content {job.inputType === "url" ? " (URL)" : job.inputType === "html" ? " (HTML)" : " (Template Data)"}
            </h4>
            <CopyButton text={job.inputContent} />
          </div>
          {job.inputType === "url" ? (
            <a href={job.inputContent} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-blue-400 hover:text-blue-300 underline underline-offset-2 font-mono break-all"
              onClick={(e) => e.stopPropagation()}>
              {job.inputContent} <ExternalLink className="h-3 w-3 shrink-0" />
            </a>
          ) : (
            <pre className="text-[12px] text-zinc-300 bg-zinc-800/50 border border-white/[0.04] rounded-lg p-3 whitespace-pre-wrap break-all max-h-80 overflow-auto font-mono">
              {job.inputContent.length > 5000 ? job.inputContent.slice(0, 5000) + "\n\n… (truncated)" : job.inputContent}
            </pre>
          )}
        </div>
      )}

      {hasOptions && (
        <div className="border-t border-white/[0.04] p-4">
          <h4 className="text-[11px] font-semibold uppercase tracking-wide text-zinc-400 mb-2">PDF Options</h4>
          <pre className="text-[12px] text-zinc-300 bg-zinc-800/50 border border-white/[0.04] rounded-lg p-3 whitespace-pre-wrap break-all max-h-40 overflow-auto font-mono">
            {JSON.stringify(options, null, 2)}
          </pre>
        </div>
      )}

      {job.resultUrl && (
        <div className="border-t border-white/[0.04] p-4">
          <h4 className="text-[11px] font-semibold uppercase tracking-wide text-zinc-400 mb-2">Result</h4>
          <a href={job.resultUrl} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-blue-400 hover:text-blue-300 underline underline-offset-2 font-mono break-all"
            onClick={(e) => e.stopPropagation()}>
            {job.resultUrl} <ExternalLink className="h-3 w-3 shrink-0" />
          </a>
        </div>
      )}
    </div>
  );
}

// ─── Desktop table row ────────────────────────────────────────────────────────
function JobRow({ job }: { job: Job }) {
  const [expanded, setExpanded] = useState(false);
  const cfg = statusConfig[job.status];
  const StatusIcon = cfg.icon;
  const duration = getDuration(job);

  return (
    <>
      <tr onClick={() => setExpanded(!expanded)}
        className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors cursor-pointer group">
        <td className="w-8 pl-4 py-3">
          {expanded
            ? <ChevronDown className="h-3.5 w-3.5 text-zinc-500" />
            : <ChevronRight className="h-3.5 w-3.5 text-zinc-600 group-hover:text-zinc-400 transition-colors" />}
        </td>
        <td className="px-3 py-3 font-mono text-[12px] text-zinc-500">{job.id.slice(0, 8)}</td>
        <td className="px-3 py-3 text-[13px] text-zinc-300 truncate max-w-[180px]">{job.user.email}</td>
        <td className="px-3 py-3">
          <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-semibold ${cfg.bg} ${cfg.color}`}>
            <StatusIcon className={`h-3 w-3 ${job.status === "processing" ? "animate-spin" : ""}`} />
            {job.status}
          </span>
        </td>
        <td className="px-3 py-3 hidden sm:table-cell">
          <span className="inline-flex items-center gap-1 text-[12px] text-zinc-400 capitalize">
            <Layers className="h-3 w-3 text-zinc-600" /> {job.inputType}
          </span>
        </td>
        <td className="px-3 py-3 text-[12px] text-zinc-500 tabular-nums hidden sm:table-cell">
          {duration !== null ? formatDuration(duration) : "—"}
        </td>
        <td className="px-3 py-3 text-[12px] text-zinc-500 tabular-nums hidden md:table-cell">
          {new Date(job.createdAt).toLocaleString()}
        </td>
        <td className="px-3 pr-4 py-3 text-right">
          {job.status === "failed" && (
            <span className="text-[10px] text-red-400/70 truncate max-w-[120px] inline-block">{job.errorCode || "error"}</span>
          )}
        </td>
      </tr>
      {expanded && (
        <tr className="border-b border-white/[0.04]">
          <td colSpan={8} className="px-4 py-3"><JobDetails job={job} /></td>
        </tr>
      )}
    </>
  );
}

// ─── Mobile card ──────────────────────────────────────────────────────────────
function JobCard({ job }: { job: Job }) {
  const [expanded, setExpanded] = useState(false);
  const cfg = statusConfig[job.status];
  const StatusIcon = cfg.icon;
  const duration = getDuration(job);

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <button onClick={() => setExpanded(!expanded)} className="w-full p-4 text-left hover:bg-white/[0.02] transition-colors">
        <div className="flex items-center justify-between mb-2">
          <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-semibold ${cfg.bg} ${cfg.color}`}>
            <StatusIcon className={`h-3 w-3 ${job.status === "processing" ? "animate-spin" : ""}`} />
            {job.status}
          </span>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 text-[11px] text-zinc-400 capitalize">
              <Layers className="h-3 w-3 text-zinc-600" /> {job.inputType}
            </span>
            {expanded ? <ChevronDown className="h-3.5 w-3.5 text-zinc-500" /> : <ChevronRight className="h-3.5 w-3.5 text-zinc-600" />}
          </div>
        </div>
        <p className="text-[13px] text-zinc-300 truncate">{job.user.email}</p>
        <div className="flex items-center gap-3 mt-1.5 text-[11px] text-zinc-500">
          <span className="font-mono">{job.id.slice(0, 8)}</span>
          {duration !== null && <span>{formatDuration(duration)}</span>}
          <span className="ml-auto">{new Date(job.createdAt).toLocaleDateString()}</span>
        </div>
        {job.status === "failed" && job.errorCode && (
          <p className="mt-1.5 text-[10px] text-red-400/70 truncate">{job.errorCode}</p>
        )}
      </button>
      {expanded && (
        <div className="px-4 pb-4"><JobDetails job={job} /></div>
      )}
    </div>
  );
}

export function AdminJobsClient({
  jobs, total, totalPages, pageNum, status, statusFilters,
}: {
  jobs: Job[];
  total: number;
  totalPages: number;
  pageNum: number;
  status: string;
  statusFilters: string[];
}) {
  const counts = { failed: jobs.filter((j) => j.status === "failed").length };

  return (
    <div className="px-4 py-6 sm:px-6 sm:py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Jobs</h1>
          <p className="text-sm text-zinc-500 mt-1">
            {total.toLocaleString()} total
            {status === "all" && counts.failed > 0 && (
              <span className="text-red-400 ml-2">({counts.failed} failed on this page)</span>
            )}
          </p>
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        {statusFilters.map((s) => (
          <a key={s} href={`/admin/jobs?status=${s}`}
            className={`rounded-lg px-3 py-1.5 text-[12px] font-medium capitalize transition-colors ${
              status === s ? "bg-foreground text-background" : "border border-border text-muted-foreground hover:text-foreground"
            }`}>
            {s}
          </a>
        ))}
      </div>

      {/* Desktop table */}
      <div className="hidden md:block rounded-xl border border-white/[0.06] bg-zinc-950/50 overflow-x-auto">
        <table className="w-full text-sm min-w-[700px]">
          <thead>
            <tr className="border-b border-white/[0.06] bg-zinc-900/30">
              <th className="w-8" />
              <th className="px-3 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-zinc-600">ID</th>
              <th className="px-3 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-zinc-600">User</th>
              <th className="px-3 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-zinc-600">Status</th>
              <th className="px-3 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-zinc-600 hidden sm:table-cell">Type</th>
              <th className="px-3 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-zinc-600 hidden sm:table-cell">Duration</th>
              <th className="px-3 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-zinc-600 hidden md:table-cell">Created</th>
              <th className="px-3 py-3" />
            </tr>
          </thead>
          <tbody>
            {jobs.length === 0 ? (
              <tr><td colSpan={8} className="px-4 py-16 text-center text-sm text-zinc-600">No jobs found.</td></tr>
            ) : (
              jobs.map((j) => <JobRow key={j.id} job={j} />)
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {jobs.length === 0 ? (
          <div className="text-center py-16 text-sm text-zinc-600">No jobs found.</div>
        ) : (
          jobs.map((j) => <JobCard key={j.id} job={j} />)
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-zinc-500">Page {pageNum} of {totalPages}</p>
          <div className="flex gap-2">
            {pageNum > 1 && (
              <a href={`/admin/jobs?status=${status}&page=${pageNum - 1}`}
                className="rounded-lg border border-border px-3 py-1.5 text-sm hover:bg-accent transition-colors">← Prev</a>
            )}
            {pageNum < totalPages && (
              <a href={`/admin/jobs?status=${status}&page=${pageNum + 1}`}
                className="rounded-lg border border-border px-3 py-1.5 text-sm hover:bg-accent transition-colors">Next →</a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
