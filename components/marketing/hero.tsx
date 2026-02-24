"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, BookOpen, Check, Terminal, LayoutDashboard, BriefcaseBusiness, BarChart2, Key, FileText, Clock, TrendingUp, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const MOCK_STATS = [
  { label: "Today", value: "3", icon: FileText, color: "bg-blue-500/10 text-blue-400" },
  { label: "This month", value: "47", icon: Clock, color: "bg-violet-500/10 text-violet-400" },
  { label: "Success rate", value: "98%", icon: TrendingUp, color: "bg-green-500/10 text-green-400" },
  { label: "Failed", value: "1", icon: AlertCircle, color: "bg-red-500/10 text-red-400" },
];

const MOCK_CHART = [20, 35, 60, 45, 80, 55, 90];
const MOCK_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const MOCK_JOBS = [
  { id: "a3f8b2c1", type: "url", status: "succeeded" as const, time: "2s ago" },
  { id: "7d2e9f45", type: "html", status: "processing" as const, time: "5s ago" },
  { id: "b8c1d3e6", type: "template", status: "succeeded" as const, time: "12s ago" },
  { id: "e4a9c7d2", type: "url", status: "succeeded" as const, time: "34s ago" },
];

const STATUS_STYLES = {
  succeeded: "bg-green-900/30 text-green-400",
  processing: "bg-blue-900/30 text-blue-400 animate-pulse",
  queued: "bg-zinc-800 text-zinc-400",
  failed: "bg-red-900/30 text-red-400",
};

const NAV_ITEMS = [
  { icon: LayoutDashboard, active: true },
  { icon: BriefcaseBusiness, active: false },
  { icon: BarChart2, active: false },
  { icon: Key, active: false },
];

function DashboardMockup() {
  return (
    <div className="animate-float-slow overflow-hidden rounded-2xl border border-white/[0.08] shadow-2xl shadow-black/50">
      {/* Window chrome */}
      <div className="flex items-center gap-2 border-b border-white/[0.06] bg-[#1c1c1e] px-4 py-3">
        <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
        <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
        <span className="h-3 w-3 rounded-full bg-[#28c840]" />
        <span className="ml-3 text-[11px] text-zinc-500">Rendr Dashboard</span>
      </div>

      {/* Dashboard body */}
      <div className="flex bg-[#0a0a0c]">
        {/* Mini sidebar */}
        <div className="flex w-[52px] shrink-0 flex-col items-center border-r border-white/[0.06] bg-[#0f0f12] py-3">
          {/* Logo */}
          <div className="mb-4 flex h-7 w-7 items-center justify-center">
            <Image src="/logo.svg" alt="Rendr" width={18} height={18} />
          </div>

          {/* Nav icons */}
          <div className="flex flex-col gap-1">
            {NAV_ITEMS.map(({ icon: Icon, active }, i) => (
              <div
                key={i}
                className={`relative flex h-8 w-8 items-center justify-center rounded-lg ${
                  active ? "bg-white/[0.08]" : ""
                }`}
              >
                {active && (
                  <span className="absolute left-0 top-1/2 h-4 w-[2.5px] -translate-y-1/2 rounded-r-full bg-blue-500" />
                )}
                <Icon className={`h-3.5 w-3.5 ${active ? "text-white" : "text-zinc-600"}`} />
              </div>
            ))}
          </div>

          {/* Spacer + usage */}
          <div className="mt-auto flex flex-col items-center gap-1.5 px-2 pt-3">
            <div className="h-[3px] w-full overflow-hidden rounded-full bg-white/[0.06]">
              <div className="h-full w-[47%] rounded-full bg-blue-500" />
            </div>
            <span className="text-[8px] text-zinc-600">47/100</span>
          </div>
        </div>

        {/* Main content */}
        <div className="min-w-0 flex-1 p-3.5">
          {/* Greeting */}
          <div className="mb-3">
            <p className="text-[11px] font-semibold text-white">Good morning, demo</p>
            <p className="text-[9px] text-zinc-500">47 renders this month</p>
          </div>

          {/* Stat cards */}
          <div className="mb-3 grid grid-cols-4 gap-2">
            {MOCK_STATS.map(({ label, value, icon: Icon, color }) => {
              const [bg, text] = color.split(" ");
              return (
                <div
                  key={label}
                  className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-2"
                >
                  <div className="mb-1.5 flex items-center justify-between">
                    <span className="text-[8px] text-zinc-500">{label}</span>
                    <span className={`flex h-4 w-4 items-center justify-center rounded ${bg}`}>
                      <Icon className={`h-2.5 w-2.5 ${text}`} />
                    </span>
                  </div>
                  <p className="text-sm font-bold leading-none text-white">{value}</p>
                </div>
              );
            })}
          </div>

          {/* Activity chart */}
          <div className="mb-3 rounded-lg border border-white/[0.06] bg-white/[0.02] p-2.5">
            <p className="mb-2 text-[8px] font-medium text-zinc-500">Last 7 days</p>
            <div className="flex h-12 items-end gap-1.5">
              {MOCK_CHART.map((h, i) => (
                <div key={i} className="flex flex-1 flex-col items-center gap-1">
                  <div
                    className="w-full rounded-t-sm bg-blue-500/80"
                    style={{ height: `${h}%` }}
                  />
                  <span className="text-[7px] tabular-nums text-zinc-600">{MOCK_DAYS[i]}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Jobs table */}
          <div className="overflow-hidden rounded-lg border border-white/[0.06]">
            <div className="flex items-center justify-between bg-white/[0.03] px-2.5 py-1.5">
              <span className="text-[9px] font-semibold text-white">Recent jobs</span>
              <span className="text-[8px] text-blue-400">View all</span>
            </div>
            <table className="w-full">
              <thead>
                <tr className="border-t border-white/[0.04] bg-white/[0.02]">
                  {["Job ID", "Type", "Status", "Time"].map((h) => (
                    <th
                      key={h}
                      className="px-2.5 py-1.5 text-left text-[7px] font-semibold uppercase tracking-wider text-zinc-600"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {MOCK_JOBS.map((job) => (
                  <tr key={job.id} className="border-t border-white/[0.04]">
                    <td className="px-2.5 py-1.5 font-mono text-[9px] text-zinc-500">
                      {job.id}
                    </td>
                    <td className="px-2.5 py-1.5 text-[9px] capitalize text-zinc-400">
                      {job.type}
                    </td>
                    <td className="px-2.5 py-1.5">
                      <span
                        className={`inline-block rounded-full px-1.5 py-0.5 text-[8px] font-medium ${STATUS_STYLES[job.status]}`}
                      >
                        {job.status}
                      </span>
                    </td>
                    <td className="px-2.5 py-1.5 text-[9px] text-zinc-600">{job.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-zinc-950">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-0 top-0 h-[700px] w-[700px] -translate-x-1/3 -translate-y-1/4 rounded-full bg-blue-600/10 blur-[140px]" />
        <div className="absolute right-0 top-1/2 h-[500px] w-[500px] translate-x-1/3 rounded-full bg-violet-600/8 blur-[120px]" />
        <div
          className="absolute inset-0 opacity-[0.018]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)`,
            backgroundSize: "48px 48px",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 py-24 lg:px-8 lg:py-32">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">

          {/* Left: Text */}
          <div>
            <div className="animate-fade-up mb-8 inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.04] px-4 py-1.5 text-xs font-medium text-white/50 backdrop-blur-sm">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
              Now in beta · 100 free renders/month
              <ArrowRight className="h-3 w-3" />
            </div>

            <h1 className="animate-fade-up delay-100 font-heading text-[3.25rem] font-extrabold leading-[0.92] tracking-[-0.045em] text-white sm:text-[4rem] lg:text-[4.5rem]">
              HTML to PDF,
              <br />
              <span
                style={{
                  background: "linear-gradient(115deg, #60a5fa 5%, #22d3ee 75%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                without the mess.
              </span>
            </h1>

            <p className="animate-fade-up delay-200 mt-6 max-w-lg text-base leading-[1.75] text-zinc-400 sm:text-lg">
              One API call. Pixel-perfect PDFs from URL or HTML. Async jobs, webhooks, signed download URLs — no headless browser to babysit.
            </p>

            <ul className="animate-fade-up delay-200 mt-7 space-y-2.5">
              {[
                "Set up in 5 minutes, scale to millions of renders",
                "Full CSS & web font support — exactly as designed",
                "Async job queue with webhook callbacks built-in",
              ].map((b) => (
                <li key={b} className="flex items-start gap-2.5 text-sm text-zinc-400">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 ring-1 ring-emerald-500/25">
                    <Check className="h-3 w-3 text-emerald-400" />
                  </span>
                  {b}
                </li>
              ))}
            </ul>

            <div className="animate-fade-up delay-300 mt-10 flex flex-wrap items-center gap-3">
              <Button
                size="lg"
                asChild
                className="h-11 rounded-xl bg-white px-7 text-sm font-semibold text-zinc-900 shadow-md hover:bg-zinc-100 hover:shadow-lg gap-2"
              >
                <Link href="/register">
                  Get started free
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="ghost"
                asChild
                className="h-11 rounded-xl px-6 text-sm text-white/50 hover:bg-white/[0.06] hover:text-white gap-2"
              >
                <Link href="/docs">
                  <BookOpen className="h-4 w-4" />
                  Read the docs
                </Link>
              </Button>
            </div>

            <div className="animate-fade-up delay-400 mt-6">
              <div className="inline-flex items-center gap-2.5 rounded-xl border border-white/[0.07] bg-zinc-900/60 px-4 py-2.5 backdrop-blur-sm">
                <Terminal className="h-3.5 w-3.5 shrink-0 text-zinc-500" />
                <span className="font-mono text-sm text-zinc-400">
                  npm install{" "}
                  <span className="text-white">@rendr/sdk</span>
                </span>
              </div>
            </div>

            <p className="animate-fade-up delay-500 mt-5 text-[11px] tracking-[0.02em] text-zinc-700">
              No credit card required · Free tier forever
            </p>
          </div>

          {/* Right: Dashboard Mockup */}
          <div className="animate-fade-up delay-200 min-w-0">
            <DashboardMockup />
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-zinc-950 to-transparent" />
    </section>
  );
}
