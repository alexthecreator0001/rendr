import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { ArrowRight, Check } from "lucide-react";
import { VideoPlayer } from "./video-player";

export const metadata: Metadata = {
  title: "Google Sheets to PDF — Rendr",
  description:
    "Turn any Google Spreadsheet into pixel-perfect PDFs. Map columns to template variables, batch-render hundreds of documents in one click.",
};

export default function SheetsPage() {
  return (
    <>
      {/* ── Hero + live demo ─────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-zinc-950 pt-24 pb-16 sm:pt-32 sm:pb-24">
        <div className="pointer-events-none absolute top-0 left-1/3 -translate-y-1/3 h-[500px] w-[500px] rounded-full bg-emerald-500/[0.05] blur-[120px]" />

        <Container className="relative">
          {/* Logo connection */}
          <div className="mx-auto mb-10 flex items-center justify-center gap-4 sm:gap-5">
            <div className="flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.04]">
              <img src="/google-sheets-logo.png" alt="Google Sheets" className="h-8 w-8 sm:h-10 sm:w-10 object-contain" />
            </div>
            <div className="flex items-center gap-1">
              <div className="h-[2px] w-5 sm:w-8 bg-gradient-to-r from-emerald-500/50 to-emerald-500/10" />
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <div className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-pulse delay-200" />
              <div className="h-[2px] w-5 sm:w-8 bg-gradient-to-r from-blue-500/10 to-blue-500/50" />
            </div>
            <div className="flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.04] p-3">
              <img src="/logo.svg" alt="Rendr" className="h-auto w-full object-contain" />
            </div>
          </div>

          <div className="text-center">
            <h1 className="mx-auto max-w-3xl text-3xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Spreadsheet in,{" "}
              <span
                style={{
                  background: "linear-gradient(115deg, #34d399, #22d3ee)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                PDFs out
              </span>
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-zinc-400">
              Connect a Google Sheet. Map columns like{" "}
              <code className="rounded bg-white/[0.06] px-1 py-0.5 text-xs text-emerald-400">{"{{name}}"}</code>{" "}
              and{" "}
              <code className="rounded bg-white/[0.06] px-1 py-0.5 text-xs text-emerald-400">{"{{amount}}"}</code>{" "}
              to an HTML template. Every row becomes a PDF.
            </p>

            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Link
                href="/register"
                className="inline-flex h-11 items-center gap-2 rounded-xl bg-white px-5 text-sm font-semibold text-zinc-900 shadow-lg shadow-white/10 transition-transform hover:scale-[1.02] hover:bg-zinc-100"
              >
                Try it free
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/docs"
                className="inline-flex h-11 items-center gap-2 rounded-xl border border-white/[0.1] bg-white/[0.04] px-5 text-sm font-medium text-zinc-300 transition-colors hover:bg-white/[0.08]"
              >
                Docs
              </Link>
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-1 text-xs text-zinc-500">
              <span className="flex items-center gap-1.5">
                <Check className="h-3 w-3 text-emerald-500" />
                10 free rows per batch
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="h-3 w-3 text-emerald-500" />
                No credit card
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="h-3 w-3 text-emerald-500" />
                Read-only access
              </span>
            </div>
          </div>

          {/* ── Hero video ────────────────────────────────────────────── */}
          <VideoPlayer />
        </Container>
      </section>

      {/* ── How it works ───────────────────────────────────────────────── */}
      <section className="border-t border-white/[0.06] bg-zinc-950 py-16 sm:py-24">
        <Container>
          <h2 className="text-center text-2xl font-bold tracking-tight text-white sm:text-3xl">
            How it works
          </h2>

          <div className="mx-auto mt-10 grid max-w-3xl gap-0">
            {[
              {
                n: "1",
                title: "Connect Google Sheets",
                desc: "One-click OAuth. Read-only access. Tokens encrypted.",
              },
              {
                n: "2",
                title: "Map columns to template",
                desc: "Pick a sheet tab, choose a template, map {{variables}} visually.",
              },
              {
                n: "3",
                title: "Render",
                desc: "Every row becomes a PDF. Progress updates live. Download when done.",
              },
            ].map((step, i) => (
              <div key={step.n} className="flex gap-4 py-5 border-b border-white/[0.05] last:border-0">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-xs font-bold text-emerald-400">
                  {step.n}
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">{step.title}</h3>
                  <p className="mt-0.5 text-sm text-zinc-500">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── Use cases (inline, not cards) ─────────────────────────────── */}
      <section className="border-t border-white/[0.06] bg-zinc-900/40 py-16 sm:py-24">
        <Container>
          <h2 className="text-center text-2xl font-bold tracking-tight text-white sm:text-3xl">
            What people build with this
          </h2>

          <div className="mx-auto mt-10 max-w-2xl columns-1 sm:columns-2 gap-6 space-y-4">
            {[
              "Monthly invoices from a client spreadsheet",
              "Course completion certificates",
              "Employee payslips and offer letters",
              "Event badges for 500 attendees",
              "Client performance reports",
              "Contracts and NDAs with mail-merge",
              "Shipping labels and packing slips",
              "Real estate listing sheets",
            ].map((item) => (
              <div key={item} className="flex items-start gap-2.5">
                <Check className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                <span className="text-sm text-zinc-300">{item}</span>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── Pricing (compact) ────────────────────────────────────────── */}
      <section className="border-t border-white/[0.06] bg-zinc-950 py-16 sm:py-24">
        <Container>
          <h2 className="text-center text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Start free, upgrade when you need more
          </h2>

          <div className="mx-auto mt-10 max-w-2xl overflow-hidden rounded-2xl border border-white/[0.08]">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/[0.06] bg-white/[0.02]">
                  <th className="px-5 py-3 text-left font-medium text-zinc-400">Plan</th>
                  <th className="px-5 py-3 text-left font-medium text-zinc-400">Rows/batch</th>
                  <th className="px-5 py-3 text-left font-medium text-zinc-400">Renders/mo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.05]">
                <tr>
                  <td className="px-5 py-3">
                    <span className="text-white font-medium">Free</span>
                    <span className="ml-2 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-semibold text-emerald-400">$0</span>
                  </td>
                  <td className="px-5 py-3 text-zinc-300">10</td>
                  <td className="px-5 py-3 text-zinc-300">100</td>
                </tr>
                <tr>
                  <td className="px-5 py-3 text-white font-medium">Growth</td>
                  <td className="px-5 py-3 text-zinc-300">100</td>
                  <td className="px-5 py-3 text-zinc-300">5,000</td>
                </tr>
                <tr>
                  <td className="px-5 py-3 text-white font-medium">Business</td>
                  <td className="px-5 py-3 text-zinc-300">500</td>
                  <td className="px-5 py-3 text-zinc-300">50,000</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Container>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────── */}
      <section className="border-t border-white/[0.06] bg-zinc-900/40 py-16 sm:py-24">
        <Container className="text-center">
          <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Stop copy-pasting into templates
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-zinc-400">
            Your data is already in a spreadsheet. Your design is already in HTML. Just connect them.
          </p>
          <Link
            href="/register"
            className="mt-6 inline-flex h-11 items-center gap-2 rounded-xl bg-white px-5 text-sm font-semibold text-zinc-900 shadow-lg shadow-white/10 transition-transform hover:scale-[1.02] hover:bg-zinc-100"
          >
            Get started free
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Container>
      </section>
    </>
  );
}
