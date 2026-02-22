const steps = [
  {
    number: "01",
    title: "Send your template",
    description:
      "POST your HTML string or a stored template ID to /v1/convert. Pass variables as JSON.",
    code: `POST /v1/convert
Authorization: Bearer rk_live_••••••••

{
  "template": "invoice-pro",
  "variables": {
    "client": "Acme Corp",
    "amount": "$4,200.00"
  }
}`,
    badge: { label: "202 Accepted", color: "text-blue-400 border-blue-500/30 bg-blue-500/10" },
  },
  {
    number: "02",
    title: "We render it",
    description:
      "Your job queues, gets picked up by an isolated Chromium worker, and is processed with your fonts and CSS — exactly as designed.",
    code: `{
  "id":           "job_7f3k2m",
  "status":       "processing",
  "queued_at":    "2026-03-15T14:23:01Z",
  "estimated_ms": 900
}`,
    badge: { label: "processing", color: "text-amber-400 border-amber-500/30 bg-amber-500/10" },
  },
  {
    number: "03",
    title: "Get your PDF",
    description:
      "A signed download URL arrives in your webhook payload within seconds. Or poll /v1/jobs/:id.",
    code: `{
  "event":        "job.completed",
  "job_id":       "job_7f3k2m",
  "download_url": "https://cdn.rendrpdf.com/…",
  "pages":        2,
  "duration_ms":  843
}`,
    badge: { label: "job.completed", color: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10" },
  },
];

export function HowItWorks() {
  return (
    <section className="relative overflow-hidden border-t border-white/[0.06] bg-zinc-950 py-24 sm:py-32">
      {/* Background orb */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[600px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-900/10 blur-[140px]" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <div className="mb-16 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.15em] text-blue-400">
            How it works
          </p>
          <h2 className="font-heading text-4xl font-extrabold tracking-[-0.03em] text-white sm:text-5xl">
            Three steps. That&apos;s it.
          </h2>
          <p className="mx-auto mt-4 max-w-md text-base text-zinc-400">
            From zero to production PDF in less time than it takes to set up
            Puppeteer.
          </p>
        </div>

        {/* Steps */}
        <div className="relative grid gap-4 lg:grid-cols-3">
          {/* Connecting line (desktop) */}
          <div className="pointer-events-none absolute left-[16.67%] right-[16.67%] top-[38px] hidden h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent lg:block" />

          {steps.map((step) => (
            <div
              key={step.number}
              className="relative rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6"
            >
              {/* Step number + badge */}
              <div className="mb-5 flex items-start justify-between gap-3">
                <span className="font-heading text-3xl font-extrabold text-white/10">
                  {step.number}
                </span>
                <span
                  className={`shrink-0 rounded-full border px-2.5 py-1 text-[10px] font-semibold ${step.badge.color}`}
                >
                  {step.badge.label}
                </span>
              </div>

              <h3 className="mb-2 text-sm font-semibold text-white">
                {step.title}
              </h3>
              <p className="mb-5 text-sm leading-relaxed text-zinc-500">
                {step.description}
              </p>

              <div className="overflow-hidden rounded-xl border border-white/[0.05] bg-black/40">
                <pre className="overflow-x-auto p-4 font-mono text-[11.5px] leading-[1.8] text-zinc-300">
                  <code>{step.code}</code>
                </pre>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
