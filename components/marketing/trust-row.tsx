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
    <section className="bg-background py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="mb-10 text-center text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground/50">
          Trusted by engineering teams at
        </p>
        <div className="flex flex-wrap items-center justify-center gap-10 sm:gap-14">
          {logos.map((name) => (
            <div key={name} className="flex items-center opacity-40 grayscale transition-all duration-200 hover:opacity-80 hover:grayscale-0">
              {/* intended final asset: company logo (SVG, 100×32) */}
              {/* suggested export format: SVG */}
              {/* exact size: 100×32, aspect: 25/8 */}
              <ImagePlaceholder
                label={`${name} logo`}
                width={100}
                height={28}
                rounded="sm"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
