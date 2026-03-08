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
  Layers,
  Calendar,
  Users,
  Receipt,
  GraduationCap,
  FileBarChart,
  Mail,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Google Sheets to PDF — Rendr",
  description:
    "Turn any Google Spreadsheet into pixel-perfect PDFs. Map columns to template variables, batch-render hundreds of documents in one click.",
};

const steps = [
  {
    num: "01",
    title: "Connect your Google account",
    desc: "One-click OAuth sign-in. We only request read-only access to your spreadsheets — nothing else. Your credentials are encrypted with AES-256.",
  },
  {
    num: "02",
    title: "Map columns to template variables",
    desc: "Paste your Sheet URL, pick a tab, and visually map each column (e.g. {{name}}, {{amount}}, {{date}}) to your HTML template variables.",
  },
  {
    num: "03",
    title: "Batch render & download",
    desc: "One click renders every row into a separate pixel-perfect PDF. Track progress in real-time, then download each file individually.",
  },
];

const possibilities = [
  {
    icon: Receipt,
    title: "Monthly invoices",
    desc: "Keep your client list in a spreadsheet. Every month, batch-render 100+ branded invoices with names, amounts, dates, and line items — in seconds.",
  },
  {
    icon: GraduationCap,
    title: "Certificates & diplomas",
    desc: "Course completions, event attendance, employee awards. One template, hundreds of personalized certificates generated from a single sheet.",
  },
  {
    icon: FileBarChart,
    title: "Client reports & proposals",
    desc: "Fill KPIs, project names, budgets, and metrics from your spreadsheet into a polished PDF template. Impress every client with custom reports.",
  },
  {
    icon: Mail,
    title: "Letters & contracts",
    desc: "Mail-merge on steroids. Generate personalized contracts, offer letters, or NDAs with full HTML/CSS control over every detail.",
  },
  {
    icon: Users,
    title: "Employee documents",
    desc: "Payslips, onboarding packets, ID badges. Keep employee data in Sheets, generate all HR documents in bulk with one click.",
  },
  {
    icon: Calendar,
    title: "Event badges & tickets",
    desc: "Attendee name, QR code, table assignment — pull it all from your registration spreadsheet. Render hundreds of badges before your event.",
  },
];

const features = [
  {
    icon: Table2,
    title: "Visual column mapping",
    desc: "Drag-and-drop style mapping. See your spreadsheet headers alongside template variables. Preview data before rendering.",
  },
  {
    icon: Zap,
    title: "Batch processing",
    desc: "Render up to 500 PDFs per batch (Business plan). Every row becomes a separate, downloadable PDF document.",
  },
  {
    icon: RefreshCw,
    title: "Re-run anytime",
    desc: "Spreadsheet data changed? Hit re-run — all PDFs regenerate with the latest data. No need to reconfigure anything.",
  },
  {
    icon: Layers,
    title: "Multiple sheets & tabs",
    desc: "Connect multiple Google accounts. Use different spreadsheets and tabs for different templates. Organize by project or client.",
  },
  {
    icon: Lock,
    title: "Enterprise-grade security",
    desc: "OAuth tokens encrypted with AES-256-GCM at rest. Read-only access. We never store your Google password. Revoke access anytime.",
  },
  {
    icon: BarChart2,
    title: "Run history & tracking",
    desc: "Full audit trail of every batch run — total PDFs, succeeded, failed, timestamps. Auto-refreshing progress while rendering.",
  },
];

export default function SheetsPage() {
  return (
    <>
      {/* ── Hero with logo connection ────────────────────────────────── */}
      <section className="relative overflow-hidden bg-zinc-950 pt-24 pb-20 sm:pt-32 sm:pb-28">
        {/* Background orbs */}
        <div className="pointer-events-none absolute top-0 left-1/3 -translate-y-1/3 h-[500px] w-[500px] rounded-full bg-emerald-500/[0.07] blur-[120px]" />
        <div className="pointer-events-none absolute top-0 right-1/3 -translate-y-1/3 h-[500px] w-[500px] rounded-full bg-blue-500/[0.05] blur-[120px]" />

        <Container className="relative">
          {/* Logo connection visual */}
          <div className="mx-auto mb-12 flex items-center justify-center gap-4 sm:gap-6">
            {/* Google Sheets logo */}
            <div className="flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.04] shadow-lg shadow-black/40">
              <img
                src="/google-sheets-logo.png"
                alt="Google Sheets"
                className="h-10 w-10 sm:h-12 sm:w-12 object-contain"
              />
            </div>

            {/* Connection line with animated dots */}
            <div className="flex items-center gap-1.5">
              <div className="h-[2px] w-6 sm:w-10 bg-gradient-to-r from-emerald-500/60 to-emerald-500/20" />
              <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <div className="h-2 w-2 rounded-full bg-emerald-400/60 animate-pulse delay-100" />
              <div className="h-2 w-2 rounded-full bg-blue-400/60 animate-pulse delay-200" />
              <div className="h-2 w-2 rounded-full bg-blue-400 animate-pulse delay-300" />
              <div className="h-[2px] w-6 sm:w-10 bg-gradient-to-r from-blue-500/20 to-blue-500/60" />
            </div>

            {/* Rendr logo */}
            <div className="flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.04] shadow-lg shadow-black/40">
              <img
                src="/logo.svg"
                alt="Rendr"
                className="h-5 sm:h-6 w-auto"
              />
            </div>
          </div>

          <div className="text-center">
            <p className="mx-auto mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-semibold text-emerald-400">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
              Google Sheets Integration
            </p>

            <h1 className="mx-auto max-w-4xl text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Your spreadsheet data,{" "}
              <span
                style={{
                  background: "linear-gradient(115deg, #34d399, #22d3ee)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                turned into PDFs
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-zinc-400">
              Connect any Google Spreadsheet to an HTML template. Map columns like
              {" "}<code className="rounded bg-white/[0.06] px-1.5 py-0.5 text-sm text-emerald-400">{"{{name}}"}</code>,
              {" "}<code className="rounded bg-white/[0.06] px-1.5 py-0.5 text-sm text-emerald-400">{"{{amount}}"}</code>,
              {" "}<code className="rounded bg-white/[0.06] px-1.5 py-0.5 text-sm text-emerald-400">{"{{date}}"}</code>
              {" "}to template variables — then batch-render every row into a separate, pixel-perfect PDF.
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
                href="/docs"
                className="inline-flex h-12 items-center gap-2 rounded-xl border border-white/[0.1] bg-white/[0.04] px-6 text-sm font-medium text-zinc-300 transition-colors hover:bg-white/[0.08]"
              >
                Read the docs
              </Link>
            </div>

            {/* Trust signals */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-zinc-500">
              <span className="flex items-center gap-1.5">
                <Check className="h-3.5 w-3.5 text-emerald-500" />
                100 free renders/month
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="h-3.5 w-3.5 text-emerald-500" />
                No credit card required
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="h-3.5 w-3.5 text-emerald-500" />
                Read-only access to Sheets
              </span>
            </div>
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
            <p className="mx-auto mt-4 max-w-xl text-zinc-400">
              No code, no API calls, no configuration files. Just connect, map, and render.
            </p>
          </div>

          <div className="mx-auto mt-14 grid max-w-4xl gap-8 sm:grid-cols-3">
            {steps.map((s, i) => (
              <div
                key={s.num}
                className="relative rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/15 border border-emerald-500/20 text-sm font-bold text-emerald-400">
                  {i + 1}
                </div>
                <h3 className="mt-4 text-lg font-semibold text-white">
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

      {/* ── What you can generate ─────────────────────────────────────── */}
      <section className="border-t border-white/[0.06] bg-zinc-900/50 py-20 sm:py-28">
        <Container>
          <div className="text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-blue-400">
              Possibilities
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              What can you generate?
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-zinc-400">
              If your data lives in a spreadsheet and your design lives in HTML — Rendr connects the two.
              Here&apos;s what teams are building:
            </p>
          </div>

          <div className="mx-auto mt-14 grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {possibilities.map((p) => {
              const Icon = p.icon;
              return (
                <div
                  key={p.title}
                  className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 border border-blue-500/20">
                    <Icon className="h-5 w-5 text-blue-400" />
                  </div>
                  <h3 className="mt-4 text-base font-semibold text-white">
                    {p.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                    {p.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* ── Features grid ────────────────────────────────────────────── */}
      <section className="border-t border-white/[0.06] bg-zinc-950 py-20 sm:py-28">
        <Container>
          <div className="text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-400">
              Features
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Built for scale and security
            </h2>
          </div>

          <div className="mx-auto mt-14 grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <div
                  key={f.title}
                  className="flex gap-4 rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5"
                >
                  <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                    <Icon className="h-4 w-4 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">
                      {f.title}
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-zinc-400">
                      {f.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* ── Pricing hint ─────────────────────────────────────────────── */}
      <section className="border-t border-white/[0.06] bg-zinc-900/50 py-20 sm:py-28">
        <Container>
          <div className="mx-auto max-w-3xl">
            <div className="text-center mb-10">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-blue-400">
                Plans
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Sheets integration on every paid plan
              </h2>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6">
                <h3 className="text-lg font-semibold text-white">Growth</h3>
                <p className="mt-1 text-sm text-zinc-400">Up to 100 rows per batch</p>
                <ul className="mt-4 space-y-2">
                  {["Google Sheets integration", "Visual column mapper", "Run history", "Re-run anytime"].map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-zinc-300">
                      <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-2xl border border-blue-500/20 bg-blue-500/[0.03] p-6 ring-1 ring-blue-500/10">
                <h3 className="text-lg font-semibold text-white">Business</h3>
                <p className="mt-1 text-sm text-zinc-400">Up to 500 rows per batch</p>
                <ul className="mt-4 space-y-2">
                  {["Everything in Growth", "5x batch size (500 rows)", "Multiple Google accounts", "Priority rendering"].map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-zinc-300">
                      <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────── */}
      <section className="border-t border-white/[0.06] bg-zinc-950 py-20 sm:py-28">
        <Container className="text-center">
          {/* Mini logo connection */}
          <div className="mx-auto mb-8 flex items-center justify-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.04]">
              <img src="/google-sheets-logo.png" alt="Google Sheets" className="h-7 w-7 object-contain" />
            </div>
            <ArrowRight className="h-5 w-5 text-zinc-600" />
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.04]">
              <img src="/logo.svg" alt="Rendr" className="h-4 w-auto" />
            </div>
            <ArrowRight className="h-5 w-5 text-zinc-600" />
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.04]">
              <FileText className="h-5 w-5 text-red-400" />
            </div>
          </div>

          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Spreadsheet in, PDFs out.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-zinc-400">
            Stop copy-pasting data into documents. Let your spreadsheet do the work.
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
