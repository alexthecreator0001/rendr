"use client";

import { useState } from "react";
import { Check } from "lucide-react";

type Lang = "node" | "curl" | "python";

function NodeCode() {
  return (
    <pre className="overflow-x-auto p-6 font-mono text-[13px] leading-[1.9]">
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
        <span className="text-zinc-600">{"// ✓ Returns in ~800ms\n"}</span>
        <span className="text-blue-300">{"console"}</span>
        <span className="text-zinc-500">{"."}</span>
        <span className="text-emerald-400">log</span>
        <span className="text-zinc-500">(</span>
        <span className="text-zinc-300">pdf.url</span>
        <span className="text-zinc-500">)</span>
        <span className="text-zinc-700">{"\n// → https://cdn.rendrpdf.com/files/job_7f3k2m…"}</span>
      </code>
    </pre>
  );
}

function CurlCode() {
  return (
    <pre className="overflow-x-auto p-6 font-mono text-[13px] leading-[1.9]">
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
    <pre className="overflow-x-auto p-6 font-mono text-[13px] leading-[1.9]">
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

const TABS: { id: Lang; label: string }[] = [
  { id: "node", label: "Node.js" },
  { id: "curl", label: "cURL" },
  { id: "python", label: "Python" },
];

export function CodeShowcase() {
  const [lang, setLang] = useState<Lang>("node");

  return (
    <section className="border-t border-white/[0.05] bg-zinc-950 py-20 sm:py-28">
      <div className="mx-auto max-w-4xl px-6 lg:px-8">
        {/* label */}
        <p className="mb-3 text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-600">
          Integrate in minutes
        </p>
        <h2 className="mb-12 text-center font-heading text-2xl font-extrabold tracking-[-0.03em] text-white sm:text-3xl">
          Three lines to your first PDF.
        </h2>

        {/* Terminal window */}
        <div className="overflow-hidden rounded-2xl border border-white/[0.07] shadow-2xl shadow-black/60">
          {/* Chrome bar */}
          <div className="flex items-center gap-2 border-b border-white/[0.06] bg-[#1c1c1e] px-4 py-3">
            <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
            <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
            <span className="h-3 w-3 rounded-full bg-[#28c840]" />
            <div className="ml-4 flex gap-0.5">
              {TABS.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setLang(t.id)}
                  className={`rounded-md px-3.5 py-1.5 font-mono text-[11px] transition-colors duration-150 ${
                    lang === t.id
                      ? "bg-white/[0.1] text-white"
                      : "text-zinc-600 hover:text-zinc-400"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Code body */}
          <div className="bg-[#0e0e10] text-zinc-300">
            {lang === "node" && <NodeCode />}
            {lang === "curl" && <CurlCode />}
            {lang === "python" && <PythonCode />}
          </div>

          {/* Result strip */}
          <div className="flex items-center gap-3 border-t border-white/[0.06] bg-[#1c1c1e] px-6 py-4">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 ring-1 ring-emerald-500/25">
              <Check className="h-3.5 w-3.5 text-emerald-400" />
            </span>
            <div className="min-w-0">
              <p className="font-mono text-[11.5px] text-emerald-400">
                job.completed · 843ms · 2 pages
              </p>
              <p className="mt-0.5 truncate font-mono text-[10.5px] text-zinc-700">
                https://cdn.rendrpdf.com/files/job_7f3k2m?token=rk_dl_••••••••
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
