import { AlertTriangle, Cpu, RefreshCw, Puzzle } from "lucide-react";

const pains = [
  {
    icon: Cpu,
    title: "Puppeteer in production",
    body: "Headless Chromium crashes, leaks memory, and times out. Managing it yourself is a full-time job — not a side task.",
    label: "Infrastructure overhead",
  },
  {
    icon: AlertTriangle,
    title: "Fonts look different in the PDF",
    body: "Web fonts, system fonts, subset glyphs — what renders in the browser rarely matches what lands in the PDF file.",
    label: "Rendering fidelity",
  },
  {
    icon: RefreshCw,
    title: "No async, no retries, no queue",
    body: "Every render blocks an HTTP request. There's no job queue, no retry logic, no webhook on completion — you build it all.",
    label: "Missing primitives",
  },
  {
    icon: Puzzle,
    title: "One integration per use case",
    body: "Invoice library here. Report builder there. Contract PDF somewhere else. No unified API, no shared templates, no single dashboard.",
    label: "Fragmented toolchain",
  },
];

export function PainPoints() {
  return (
    <section className="bg-zinc-950 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <div className="mb-16 max-w-xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.15em] text-blue-400">
            The problem
          </p>
          <h2 className="font-heading text-4xl font-extrabold leading-[1.05] tracking-[-0.03em] text-white sm:text-5xl">
            The old way
            <br />
            <span className="text-zinc-500">is a mess.</span>
          </h2>
          <p className="mt-5 text-base text-zinc-400">
            Rolling your own PDF stack means fighting infrastructure instead of
            shipping product.
          </p>
        </div>

        {/* 4-card grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {pains.map((pain) => {
            const Icon = pain.icon;
            return (
              <div
                key={pain.title}
                className="group rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6 transition-all duration-300 hover:border-white/[0.12] hover:bg-white/[0.04]"
              >
                <div className="mb-4 flex items-start justify-between gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-red-500/20 bg-red-500/10">
                    <Icon className="h-4 w-4 text-red-400" />
                  </div>
                  <span className="rounded-full border border-white/[0.06] bg-white/[0.03] px-2 py-0.5 text-[10px] font-medium text-zinc-600">
                    {pain.label}
                  </span>
                </div>
                <h3 className="mb-2.5 text-sm font-semibold text-white">
                  {pain.title}
                </h3>
                <p className="text-sm leading-relaxed text-zinc-500">
                  {pain.body}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
