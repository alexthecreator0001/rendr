export type JobStatus = "queued" | "processing" | "done" | "failed";

export interface Job {
  id: string;
  name: string;
  templateId: string | null;
  status: JobStatus;
  pages: number | null;
  durationMs: number | null;
  createdAt: string;
  completedAt: string | null;
}

export const mockJobs: Job[] = [
  {
    id: "job_7f3k2m",
    name: "Invoice v2",
    templateId: "tmpl_invoice",
    status: "done",
    pages: 2,
    durationMs: 843,
    createdAt: "2026-02-19T14:22:11Z",
    completedAt: "2026-02-19T14:22:12Z",
  },
  {
    id: "job_9p1qr5",
    name: "Quarterly Report — Q4 2025",
    templateId: "tmpl_report",
    status: "done",
    pages: 14,
    durationMs: 2310,
    createdAt: "2026-02-19T11:05:40Z",
    completedAt: "2026-02-19T11:05:42Z",
  },
  {
    id: "job_2xmn8v",
    name: "Acme Internal Memo",
    templateId: null,
    status: "processing",
    pages: null,
    durationMs: null,
    createdAt: "2026-02-20T08:44:02Z",
    completedAt: null,
  },
  {
    id: "job_5bw0tz",
    name: "Statement of Work Q1",
    templateId: "tmpl_sow",
    status: "done",
    pages: 4,
    durationMs: 1102,
    createdAt: "2026-02-18T17:30:00Z",
    completedAt: "2026-02-18T17:30:01Z",
  },
  {
    id: "job_3df4hn",
    name: "NDA — Vendor Batch",
    templateId: "tmpl_nda",
    status: "failed",
    pages: null,
    durationMs: null,
    createdAt: "2026-02-17T09:12:55Z",
    completedAt: null,
  },
  {
    id: "job_8kz1pa",
    name: "Expense Report Feb",
    templateId: "tmpl_expense",
    status: "queued",
    pages: null,
    durationMs: null,
    createdAt: "2026-02-20T09:01:00Z",
    completedAt: null,
  },
];
