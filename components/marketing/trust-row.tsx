const logos = [
  "Acme Corp",
  "Stellar Inc",
  "NovaTech",
  "Meridian",
  "Crestline",
  "Orbis Co",
];

export function TrustRow() {
  return (
    <section className="border-y border-white/[0.06] bg-zinc-950 py-12">
      <div className="mx-auto max-w-5xl px-6 lg:px-8">
        <p className="mb-8 text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-600">
          Trusted by engineering teams at
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
          {logos.map((name) => (
            <span
              key={name}
              className="font-heading text-sm font-bold tracking-tight text-zinc-600 transition-colors duration-200 hover:text-zinc-400"
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
