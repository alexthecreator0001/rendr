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
    <section className="bg-background py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <div className="mb-16 max-w-xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.15em] text-primary">
            The problem
          </p>
          <h2 className="font-heading text-4xl font-extrabold leading-[1.05] tracking-[-0.03em] text-foreground sm:text-5xl">
            The old way
            <br />
            <span className="text-muted-foreground">is a mess.</span>
          </h2>
          <p className="mt-5 text-base text-muted-foreground">
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
                className="group rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:border-border hover:bg-muted/50 shadow-sm"
              >
                <div className="mb-4 flex items-start justify-between gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-red-500/20 bg-red-500/10">
                    <Icon className="h-4 w-4 text-red-400" />
                  </div>
                  <span className="rounded-full border border-border bg-muted/50 px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                    {pain.label}
                  </span>
                </div>
                <h3 className="mb-2.5 text-sm font-semibold text-foreground">
                  {pain.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
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
