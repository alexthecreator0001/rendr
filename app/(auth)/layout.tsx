import { SpiralBackground } from "@/components/marketing/spiral-background";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-zinc-950 px-4 py-12">
      {/* Animated spiral background */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.18]">
        <SpiralBackground />
      </div>

      {/* Soft radial vignette — keeps edges dark without hiding spiral */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: "radial-gradient(ellipse at center, transparent 50%, rgba(9,9,11,0.7) 100%)",
        }}
      />

      <div className="relative z-10 w-full">
        {children}
      </div>
    </div>
  );
}
