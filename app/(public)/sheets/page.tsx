import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import {
  ArrowRight,
  Check,
  Zap,
  Table2,
  RefreshCw,
  Lock,
  BarChart2,
  FileText,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Google Sheets to PDF — Rendr",
  description:
    "Turn any Google Spreadsheet into pixel-perfect PDFs. Map columns to template variables, batch-render hundreds of documents in one click.",
};

const steps = [
  {
    num: "01",
    title: "Connect Google Sheets",
    desc: "One-click OAuth — we only request read access to your spreadsheets. No passwords stored.",
  },
  {
    num: "02",
    title: "Pick a template",
    desc: "Choose any Rendr HTML template. Map spreadsheet columns to template variables with a visual mapper.",
  },
  {
    num: "03",
    title: "Batch render",
    desc: "Hit render — every row becomes a pixel-perfect PDF. Download individually or as a ZIP.",
  },
];

const features = [
  {
    icon: Table2,
    title: "Column → Variable mapping",
    desc: "Visually map each spreadsheet column to a template variable. Preview before rendering.",
  },
  {
    icon: Zap,
    title: "Batch processing",
    desc: "Render hundreds of PDFs in a single click. Progress tracked in real-time.",
  },
  {
    icon: RefreshCw,
    title: "Re-run anytime",
    desc: "Data changed? Re-run a sync to regenerate all PDFs with the latest spreadsheet data.",
  },
  {
    icon: Lock,
    title: "Secure by default",
    desc: "OAuth tokens are encrypted at rest with AES-256-GCM. We never store your Google password.",
  },
  {
    icon: BarChart2,
    title: "Run history",
    desc: "Track every batch run — see succeeded, failed, and in-progress counts at a glance.",
  },
  {
    icon: FileText,
    title: "Any document type",
    desc: "Invoices, certificates, reports, letters — if it fits in an HTML template, Sheets can fill it.",
  },
];

const useCases = [
  {
    title: "Invoices & receipts",
    desc: "Pull client data from a spreadsheet and generate branded invoices in bulk every month.",
  },
  {
    title: "Certificates",
    desc: "Course completions, event attendance, awards — personalized for every recipient.",
  },
  {
    title: "Reports & proposals",
    desc: "Fill in KPIs, client names, and dates from your spreadsheet into a polished PDF template.",
  },
  {
    title: "Letters & contracts",
    desc: "Mail-merge style document generation with full HTML/CSS control over the output.",
  },
];

export default function SheetsPage() {
  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-zinc-950 pt-24 pb-20 sm:pt-32 sm:pb-28">
        <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/3 h-[600px] w-[800px] rounded-full bg-emerald-500/[0.06] blur-[120px]" />

        <Container className="relative text-center">
          {/* Google Sheets logo */}
          <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.04] shadow-lg shadow-black/40">
            <img
              src="/google-sheets-logo.png"
              alt="Google Sheets"
              className="h-12 w-12 object-contain"
            />
          </div>

          <p className="mx-auto mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-semibold text-emerald-400">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
            New feature
          </p>

          <h1 className="mx-auto max-w-3xl text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Google Sheets to{" "}
            <span
              style={{
                background: "linear-gradient(115deg, #34d399, #22d3ee)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              pixel-perfect PDFs
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-zinc-400">
            Connect your spreadsheet, map columns to template variables, and
            batch-render hundreds of documents — invoices, certificates,
            reports — in one click.
          </p>

          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/register"
              className="inline-flex h-12 items-center gap-2 rounded-xl bg-white px-6 text-sm font-semibold text-zinc-900 shadow-lg shadow-white/10 transition-transform hover:scale-[1.02] hover:bg-zinc-100"
            >
              Get started free
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/docs/google-sheets"
              className="inline-flex h-12 items-center gap-2 rounded-xl border border-white/[0.1] bg-white/[0.04] px-6 text-sm font-medium text-zinc-300 transition-colors hover:bg-white/[0.08]"
            >
              Read the docs
            </Link>
          </div>
        </Container>
      </section>

      {/* ── How it works ─────────────────────────────────────────────── */}
      <section className="border-t border-white/[0.06] bg-zinc-950 py-20 sm:py-28">
        <Container>
          <div className="text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-400">
              How it works
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Three steps. Hundreds of PDFs.
            </h2>
          </div>

          <div className="mx-auto mt-14 grid max-w-4xl gap-8 sm:grid-cols-3">
            {steps.map((s) => (
              <div
                key={s.num}
                className="relative rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6"
              >
                <span className="text-[11px] font-bold uppercase tracking-widest text-emerald-400/60">
                  Step {s.num}
                </span>
                <h3 className="mt-3 text-lg font-semibold text-white">
                  {s.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── Features grid ────────────────────────────────────────────── */}
      <section className="border-t border-white/[0.06] bg-zinc-900/50 py-20 sm:py-28">
        <Container>
          <div className="text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-blue-400">
              Features
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Everything you need for document automation
            </h2>
          </div>

          <div className="mx-auto mt-14 grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <div
                  key={f.title}
                  className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 border border-blue-500/20">
                    <Icon className="h-5 w-5 text-blue-400" />
                  </div>
                  <h3 className="mt-4 text-base font-semibold text-white">
                    {f.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                    {f.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* ── Use cases ────────────────────────────────────────────────── */}
      <section className="border-t border-white/[0.06] bg-zinc-950 py-20 sm:py-28">
        <Container>
          <div className="text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-400">
              Use cases
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              What will you automate?
            </h2>
          </div>

          <div className="mx-auto mt-14 grid max-w-3xl gap-5 sm:grid-cols-2">
            {useCases.map((u) => (
              <div
                key={u.title}
                className="flex gap-4 rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5"
              >
                <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 ring-1 ring-emerald-500/25">
                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">
                    {u.title}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-zinc-400">
                    {u.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────── */}
      <section className="border-t border-white/[0.06] bg-zinc-900/50 py-20 sm:py-28">
        <Container className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Ready to turn spreadsheets into PDFs?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-zinc-400">
            Free plan includes 100 renders per month. No credit card required.
          </p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/register"
              className="inline-flex h-12 items-center gap-2 rounded-xl bg-white px-6 text-sm font-semibold text-zinc-900 shadow-lg shadow-white/10 transition-transform hover:scale-[1.02] hover:bg-zinc-100"
            >
              Get started free
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/pricing"
              className="inline-flex h-12 items-center gap-2 rounded-xl border border-white/[0.1] bg-white/[0.04] px-6 text-sm font-medium text-zinc-300 transition-colors hover:bg-white/[0.08]"
            >
              View pricing
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
}
