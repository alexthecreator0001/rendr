export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-zinc-950 px-4 py-12">
      {/* Background orbs */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-[20%] -left-[10%] h-[600px] w-[600px] rounded-full bg-blue-600/20 blur-[140px] animate-pulse-glow" />
        <div
          className="absolute -bottom-[20%] -right-[10%] h-[600px] w-[600px] rounded-full bg-violet-600/20 blur-[140px] animate-pulse-glow"
          style={{ animationDelay: "1.5s" }}
        />
      </div>

      {/* Subtle grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 w-full">
        {children}
      </div>
    </div>
  );
}
