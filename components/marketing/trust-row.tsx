const stats = [
  { value: "500+", label: "engineering teams" },
  { value: "2M+", label: "PDFs rendered" },
  { value: "99.9%", label: "uptime" },
  { value: "< 1s", label: "avg render time" },
];

const logos = ["Acme Corp", "Stellar Inc", "NovaTech", "Meridian", "Crestline", "Orbis Co"];

export function TrustRow() {
  return (
    <section className="border-y border-white/[0.06] bg-zinc-950 py-14">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-4 mb-12">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <p className="font-heading text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                {s.value}
              </p>
              <p className="mt-1 text-xs text-zinc-500">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="border-t border-white/[0.04] pt-10">
          <p className="mb-6 text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-700">
            Trusted by engineering teams at
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-5">
            {logos.map((name) => (
              <span
                key={name}
                className="font-heading text-sm font-bold tracking-tight text-zinc-700 transition-colors duration-200 hover:text-zinc-400"
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
