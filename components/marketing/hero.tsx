"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, BookOpen, Check, Terminal, Zap, Clock, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

type Lang = "node" | "curl" | "python";

function NodeCode() {
  return (
    <pre className="overflow-x-auto p-5 font-mono text-[12.5px] leading-[1.9]">
      <code>
        <span className="text-zinc-600">{"// npm install @rendr/sdk\n"}</span>
        <span className="text-blue-400">import</span>
        {" "}
        <span className="text-zinc-200">{"{ Rendr }"}</span>
        {" "}
        <span className="text-blue-400">from</span>
        {" "}
        <span className="text-amber-300">{"\"@rendr/sdk\"\n\n"}</span>
        <span className="text-blue-400">const</span>
        <span className="text-zinc-300">{" client = "}</span>
        <span className="text-blue-400">new</span>
        {" "}
        <span className="text-emerald-400">Rendr</span>
        <span className="text-zinc-500">(</span>
        <span className="text-amber-300">{"\"rk_live_••••••••\""}</span>
        <span className="text-zinc-500">{")\n\n"}</span>
        <span className="text-blue-400">const</span>
        <span className="text-zinc-300">{" pdf = "}</span>
        <span className="text-blue-400">await</span>
        <span className="text-zinc-300">{" client."}</span>
        <span className="text-emerald-400">render</span>
        <span className="text-zinc-500">{"({\n"}</span>
        {"  "}
        <span className="text-blue-300">url</span>
        <span className="text-zinc-500">{": "}</span>
        <span className="text-amber-300">{"\"https://acme.com/invoice/042\""}</span>
        <span className="text-zinc-500">{",\n"}</span>
        {"  "}
        <span className="text-blue-300">format</span>
        <span className="text-zinc-500">{": "}</span>
        <span className="text-amber-300">{"\"A4\""}</span>
        <span className="text-zinc-500">{",\n"}</span>
        <span className="text-zinc-500">{"});\n\n"}</span>
        <span className="text-zinc-600">{"// ✓ Ready in 843ms\n"}</span>
        <span className="text-blue-300">{"console"}</span>
        <span className="text-zinc-500">{"."}</span>
        <span className="text-emerald-400">log</span>
        <span className="text-zinc-500">(</span>
        <span className="text-zinc-300">pdf.url</span>
        <span className="text-zinc-500">)</span>
      </code>
    </pre>
  );
}

function CurlCode() {
  return (
    <pre className="overflow-x-auto p-5 font-mono text-[12.5px] leading-[1.9]">
      <code>
        <span className="text-emerald-400">curl</span>
        <span className="text-zinc-300">{" -X POST \\\n"}</span>
        {"  "}
        <span className="text-amber-300">{"https://api.rendrpdf.com/v1/convert"}</span>
        <span className="text-zinc-300">{" \\\n"}</span>
        {"  "}
        <span className="text-blue-400">{"-H"}</span>
        {" "}
        <span className="text-amber-300">{"\"Authorization: Bearer rk_live_••••\""}</span>
        <span className="text-zinc-300">{" \\\n"}</span>
        {"  "}
        <span className="text-blue-400">{"-H"}</span>
        {" "}
        <span className="text-amber-300">{"\"Content-Type: application/json\""}</span>
        <span className="text-zinc-300">{" \\\n"}</span>
        {"  "}
        <span className="text-blue-400">{"-d"}</span>
        <span className="text-zinc-500">{" '{\n"}</span>
        {"    "}
        <span className="text-blue-300">{"\"url\""}</span>
        <span className="text-zinc-500">{": "}</span>
        <span className="text-amber-300">{"\"https://acme.com/invoice/042\""}</span>
        <span className="text-zinc-500">{",\n"}</span>
        {"    "}
        <span className="text-blue-300">{"\"format\""}</span>
        <span className="text-zinc-500">{": "}</span>
        <span className="text-amber-300">{"\"A4\""}</span>
        <span className="text-zinc-500">{"\n  }'"}</span>
      </code>
    </pre>
  );
}

function PythonCode() {
  return (
    <pre className="overflow-x-auto p-5 font-mono text-[12.5px] leading-[1.9]">
      <code>
        <span className="text-zinc-600">{"# pip install rendr\n"}</span>
        <span className="text-blue-400">from</span>
        {" "}
        <span className="text-amber-300">rendr</span>
        {" "}
        <span className="text-blue-400">import</span>
        <span className="text-zinc-300">{" Rendr\n\n"}</span>
        <span className="text-zinc-300">{"client = "}</span>
        <span className="text-emerald-400">Rendr</span>
        <span className="text-zinc-500">(</span>
        <span className="text-amber-300">{"\"rk_live_••••••••\""}</span>
        <span className="text-zinc-500">{")\n\n"}</span>
        <span className="text-zinc-300">{"pdf = client."}</span>
        <span className="text-emerald-400">render</span>
        <span className="text-zinc-500">{"(\n"}</span>
        {"    "}
        <span className="text-blue-300">url</span>
        <span className="text-zinc-500">{"="}</span>
        <span className="text-amber-300">{"\"https://acme.com/invoice/042\""}</span>
        <span className="text-zinc-500">{",\n"}</span>
        {"    "}
        <span className="text-blue-300">format</span>
        <span className="text-zinc-500">{"="}</span>
        <span className="text-amber-300">{"\"A4\""}</span>
        <span className="text-zinc-500">{",\n"}</span>
        <span className="text-zinc-500">{")\n\n"}</span>
        <span className="text-zinc-600">{"# ✓ pdf.url → cdn.rendrpdf.com/files/…"}</span>
      </code>
    </pre>
  );
}

export function Hero() {
  const [lang, setLang] = useState<Lang>("node");

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

          {/* Right: Terminal */}
          <div className="animate-fade-up delay-200 min-w-0">
            <div className="overflow-hidden rounded-2xl border border-white/[0.08] shadow-2xl shadow-black/50">
              {/* Window chrome */}
              <div className="flex items-center gap-2 border-b border-white/[0.06] bg-[#1c1c1e] px-4 py-3">
                <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
                <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
                <span className="h-3 w-3 rounded-full bg-[#28c840]" />
                <div className="ml-3 flex items-center gap-0.5">
                  {(["node", "curl", "python"] as const).map((l) => (
                    <button
                      key={l}
                      onClick={() => setLang(l)}
                      className={`rounded-md px-3 py-1.5 font-mono text-[11px] transition-colors duration-150 ${
                        lang === l
                          ? "bg-white/[0.1] text-white"
                          : "text-zinc-600 hover:text-zinc-400"
                      }`}
                    >
                      {l === "node" ? "Node.js" : l === "curl" ? "cURL" : "Python"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Code */}
              <div className="bg-[#111113] text-zinc-300">
                {lang === "node" && <NodeCode />}
                {lang === "curl" && <CurlCode />}
                {lang === "python" && <PythonCode />}
              </div>

              {/* Response strip */}
              <div className="border-t border-white/[0.06] bg-[#1c1c1e] px-5 py-3.5">
                <div className="flex items-center gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 ring-1 ring-emerald-500/25">
                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                  </span>
                  <div className="min-w-0">
                    <p className="font-mono text-[11px] text-emerald-400">job.completed · 843ms</p>
                    <p className="mt-0.5 truncate font-mono text-[10.5px] text-zinc-600">
                      cdn.rendrpdf.com/files/job_7f3k2m?token=rk_dl_••••
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Mini stats */}
            <div className="mt-5 grid grid-cols-3 gap-3">
              {[
                { icon: Zap, value: "~800ms", label: "avg render" },
                { icon: Shield, value: "99.9%", label: "uptime SLA" },
                { icon: Clock, value: "< 5 min", label: "to first PDF" },
              ].map(({ icon: Icon, value, label }) => (
                <div
                  key={label}
                  className="rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 py-3.5 text-center"
                >
                  <Icon className="mx-auto mb-2 h-3.5 w-3.5 text-zinc-600" />
                  <p className="font-heading text-sm font-bold text-white">{value}</p>
                  <p className="mt-0.5 text-[10px] text-zinc-600">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-zinc-950 to-transparent" />
    </section>
  );
}
