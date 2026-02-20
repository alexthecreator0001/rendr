import { ImagePlaceholder } from "@/components/media/image-placeholder";

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
    <section className="border-y border-border py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="mb-8 text-center text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Used by teams at
        </p>
        <div className="flex flex-wrap items-center justify-center gap-8">
          {logos.map((name) => (
            <div key={name} className="flex flex-col items-center gap-1.5">
              {/* intended final asset: company logo (SVG, 80×32) */}
              {/* suggested export format: SVG */}
              {/* exact size: 80×32, aspect: 5/2 */}
              <ImagePlaceholder
                label={`${name} logo`}
                width={80}
                height={32}
                rounded="md"
                className="opacity-60 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-200"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
