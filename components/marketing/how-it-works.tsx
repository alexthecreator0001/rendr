export function HowItWorks() {
  const steps = [
    {
      number: "01",
      title: "Send your template",
      description: "POST your HTML string or a stored template ID to /v1/render. Pass variables as a JSON object. That's it.",
      code: `POST /v1/render
{
  "template_id": "tmpl_invoice",
  "variables": { "client": "Acme" }
}`,
    },
    {
      number: "02",
      title: "We render it",
      description: "Your job queues, gets picked up by an isolated worker, and is processed with your fonts, CSS, and layout exactly as designed.",
      code: `{
  "id": "job_7f3k2m",
  "status": "processing",
  "estimated_ms": 900
}`,
    },
    {
      number: "03",
      title: "Get your PDF",
      description: "A signed download URL lands in your webhook payload within seconds. Or poll /v1/jobs/:id if you prefer.",
      code: `{
  "event": "job.completed",
  "download_url": "https://...",
  "pages": 2,
  "duration_ms": 843
}`,
    },
  ];

  return (
    <section className="relative overflow-hidden bg-zinc-950 py-24 sm:py-32">
      {/* Background orb */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[800px] rounded-full bg-blue-900/20 blur-[120px]" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.15em] text-blue-400">
            How it works
          </p>
          <h2 className="text-4xl font-extrabold tracking-[-0.03em] text-white sm:text-5xl">
            Three steps. That&apos;s it.
          </h2>
          <p className="mt-4 text-base text-zinc-400 max-w-md mx-auto">
            From zero to production PDF in less time than it takes to set up Puppeteer.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {steps.map((step, i) => (
            <div
              key={step.number}
              className="relative rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm"
            >
              {/* Step number */}
              <div className="mb-5 flex items-center gap-3">
                <span className="font-mono text-3xl font-bold text-white/20">{step.number}</span>
                {i < steps.length - 1 && (
                  <div className="hidden h-px flex-1 bg-white/10 lg:block" />
                )}
              </div>

              <h3 className="mb-2 text-lg font-semibold text-white">{step.title}</h3>
              <p className="mb-5 text-sm text-zinc-400 leading-relaxed">{step.description}</p>

              {/* Code snippet */}
              <div className="rounded-xl bg-black/40 border border-white/5 p-4">
                <pre className="font-mono text-xs text-zinc-300 leading-relaxed overflow-x-auto">
                  {step.code}
                </pre>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
