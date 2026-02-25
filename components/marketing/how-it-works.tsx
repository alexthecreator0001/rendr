const steps = [
  {
    number: "01",
    title: "Send a request",
    description:
      "POST raw HTML, a URL, or a template name with variables. Add any options — format, margins, watermark, metadata.",
    accent: "text-blue-400 border-blue-500/30 bg-blue-500/10",
  },
  {
    number: "02",
    title: "We render it",
    description:
      "Your job hits our queue and gets picked up by an isolated Chromium worker. Full CSS, JS, and font support — pixel-perfect.",
    accent: "text-amber-400 border-amber-500/30 bg-amber-500/10",
  },
  {
    number: "03",
    title: "Get your PDF",
    description:
      "Download it inline, poll the status URL, or let a webhook push the signed download link to your server.",
    accent: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
  },
];

export function HowItWorks() {
  return (
    <section className="relative overflow-hidden border-t border-white/[0.06] bg-zinc-950 py-24 sm:py-32">
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

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-16 lg:items-center">
          {/* Left — Steps */}
          <div className="relative space-y-0">
            {steps.map((step, i) => (
              <div key={step.number} className="relative flex gap-5 pb-10 last:pb-0">
                {/* Vertical connector */}
                <div className="flex flex-col items-center">
                  <span
                    className={`relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border text-sm font-bold ${step.accent}`}
                  >
                    {step.number}
                  </span>
                  {i < steps.length - 1 && (
                    <div className="mt-1 h-full w-px bg-gradient-to-b from-white/[0.08] to-transparent" />
                  )}
                </div>
                {/* Text */}
                <div className="pt-1.5">
                  <h3 className="text-base font-semibold text-white">{step.title}</h3>
                  <p className="mt-1.5 text-[13.5px] leading-relaxed text-zinc-500">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Right — Code example */}
          <div className="rounded-2xl border border-white/[0.06] bg-zinc-900/60 overflow-hidden">
            {/* Tab bar */}
            <div className="flex items-center gap-1 border-b border-white/[0.06] px-4 py-2.5">
              <span className="rounded-md bg-white/[0.08] px-2.5 py-1 text-[11px] font-medium text-white">
                cURL
              </span>
              <span className="rounded-md px-2.5 py-1 text-[11px] font-medium text-zinc-600">
                Node.js
              </span>
              <span className="rounded-md px-2.5 py-1 text-[11px] font-medium text-zinc-600">
                Python
              </span>
            </div>
            {/* Code */}
            <div className="p-5 font-mono text-[12px] leading-[1.7]">
              <pre className="overflow-x-auto text-zinc-400">
                <code>{`curl -X POST https://rendrpdf.com/api/v1/convert \\
  -H "Authorization: Bearer rk_live_..." \\
  -H "Content-Type: application/json" \\
  -d '{
  "input": {
    "type": "template",
    "template": "invoice-pro",
    "variables": {
      "client": "Acme Corp",
      "amount": "$4,200.00"
    }
  },
  "options": {
    "format": "A4",
    "margin": { "top": "20mm", "bottom": "20mm" }
  }
}'`}</code>
              </pre>
            </div>
            {/* Response preview */}
            <div className="border-t border-white/[0.06] px-5 py-3.5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-5 items-center rounded-full bg-emerald-500/15 px-2 text-[10px] font-semibold text-emerald-400">
                    200
                  </span>
                  <span className="text-[11px] text-zinc-500">
                    application/json · 843ms
                  </span>
                </div>
              </div>
              <pre className="font-mono text-[11.5px] leading-[1.7] text-zinc-400">
                <code>{`{
  "job_id":       "job_7f3k2m",
  "status":       "succeeded",
  "pdf_url":      "https://cdn.rendrpdf.com/files/...",
  "pages":        2,
  "duration_ms":  843
}`}</code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
