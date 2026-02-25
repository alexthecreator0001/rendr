const testimonials = [
  {
    quote:
      "We were running Puppeteer in a separate Docker container with a custom retry layer on top. It crashed weekly. Rendr replaced the whole thing in an afternoon — and we haven't touched PDF infrastructure since.",
    name: "Petra Novak",
    role: "Senior Backend Engineer",
    company: "Monzo",
    initials: "PN",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    quote:
      "Invoice generation used to be our most fragile service. Fonts wrong, jobs timing out, no retry logic. Now it's the most boring one. That's exactly what I wanted from a piece of infrastructure.",
    name: "James Wu",
    role: "CTO",
    company: "DocuFlow",
    initials: "JW",
    gradient: "from-violet-500 to-blue-500",
  },
  {
    quote:
      "The async job pattern with webhook callbacks is exactly how I would have designed this from scratch — except I didn't have to. That was the whole sell. We shipped in a sprint instead of a quarter.",
    name: "Sarah Okonkwo",
    role: "Software Engineer",
    company: "Linear",
    initials: "SO",
    gradient: "from-emerald-500 to-blue-500",
  },
];

export function Testimonials() {
  return (
    <section className="border-t border-border bg-background py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <div className="mb-16 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.15em] text-primary">
            What developers say
          </p>
          <h2 className="font-heading text-4xl font-extrabold tracking-[-0.03em] text-foreground sm:text-5xl">
            Built for engineers
            <br />
            <span className="text-muted-foreground">who have shipped before.</span>
          </h2>
        </div>

        {/* Cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="flex flex-col rounded-2xl border border-border bg-card p-7 shadow-sm transition-all duration-300 hover:border-border hover:bg-muted/50"
            >
              {/* Stars */}
              <div className="mb-5 flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="h-3.5 w-3.5 fill-amber-400" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              <p className="flex-1 text-sm leading-[1.8] text-muted-foreground">
                &ldquo;{t.quote}&rdquo;
              </p>

              <div className="mt-7 flex items-center gap-3">
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${t.gradient} text-xs font-bold text-white`}
                >
                  {t.initials}
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{t.name}</p>
                  <p className="text-xs text-muted-foreground/70">
                    {t.role} · {t.company}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
