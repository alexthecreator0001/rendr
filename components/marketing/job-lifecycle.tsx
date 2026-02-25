const states = [
  {
    key: "queued",
    label: "Queued",
    ts: "14:23:01.042",
    color: "text-zinc-500 dark:text-zinc-400 border-zinc-400/30 bg-zinc-400/10",
    dot: "bg-zinc-500",
    fields: {
      id: "job_7f3k2m",
      status: "queued",
      template: "invoice-pro",
      queued_at: "14:23:01.042",
    },
  },
  {
    key: "processing",
    label: "Processing",
    ts: "14:23:01.198",
    color: "text-blue-500 dark:text-blue-400 border-blue-500/30 bg-blue-500/10",
    dot: "bg-blue-400 animate-pulse",
    fields: {
      id: "job_7f3k2m",
      status: "processing",
      worker: "worker-03",
      started_at: "14:23:01.198",
    },
  },
  {
    key: "rendered",
    label: "Rendered",
    ts: "14:23:01.941",
    color: "text-violet-500 dark:text-violet-400 border-violet-500/30 bg-violet-500/10",
    dot: "bg-violet-400",
    fields: {
      id: "job_7f3k2m",
      status: "rendered",
      pages: "2",
      size_kb: "148",
    },
  },
  {
    key: "delivered",
    label: "Delivered",
    ts: "14:23:01.997",
    color: "text-emerald-500 dark:text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
    dot: "bg-emerald-400",
    fields: {
      id: "job_7f3k2m",
      status: "completed",
      duration_ms: "955",
      download_url: "https://cdn.…",
    },
  },
];

export function JobLifecycle() {
  return (
    <section className="border-t border-border bg-background py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <div className="mb-16 max-w-xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.15em] text-primary">
            Job lifecycle
          </p>
          <h2 className="font-heading text-4xl font-extrabold leading-[1.05] tracking-[-0.03em] text-foreground sm:text-5xl">
            Full visibility,
            <br />
            <span className="text-muted-foreground">every step.</span>
          </h2>
          <p className="mt-5 text-base text-muted-foreground">
            Every render job moves through four observable states. Poll, stream,
            or let webhooks do the work.
          </p>
        </div>

        {/* Timeline */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {states.map((state, i) => (
            <div key={state.key} className="relative">
              {/* Connector line */}
              {i < states.length - 1 && (
                <div className="absolute right-0 top-[22px] z-10 hidden h-px w-4 -translate-y-1/2 bg-border lg:block" />
              )}

              <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                {/* Status badge */}
                <div className="mb-4 flex items-center justify-between">
                  <span
                    className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold ${state.color}`}
                  >
                    <span className={`h-1.5 w-1.5 rounded-full ${state.dot}`} />
                    {state.label}
                  </span>
                  <span className="font-mono text-[10px] text-muted-foreground/50">
                    {state.ts}
                  </span>
                </div>

                {/* Fields */}
                <div className="space-y-1.5 rounded-xl border border-border/50 bg-muted/50 p-3.5 font-mono text-[11px] leading-[1.7]">
                  {Object.entries(state.fields).map(([k, v]) => (
                    <div key={k} className="flex items-baseline justify-between gap-2">
                      <span className="shrink-0 text-muted-foreground/60">{k}</span>
                      <span
                        className={`truncate text-right ${
                          k === "status" ? state.color.split(" ")[0] : "text-muted-foreground"
                        }`}
                      >
                        {v}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom note */}
        <p className="mt-8 text-center text-[11px] text-muted-foreground/50">
          Webhook fired on{" "}
          <span className="font-mono text-muted-foreground">job.completed</span> and{" "}
          <span className="font-mono text-muted-foreground">job.failed</span> · Logs retained
          30 days on Growth plan
        </p>
      </div>
    </section>
  );
}
