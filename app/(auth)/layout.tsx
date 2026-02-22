import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-zinc-950">
      {/* Animated gradient orbs */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-[20%] -left-[10%] h-[600px] w-[600px] rounded-full bg-blue-600/25 blur-[130px] animate-pulse-glow" />
        <div
          className="absolute -bottom-[20%] -right-[10%] h-[600px] w-[600px] rounded-full bg-violet-600/25 blur-[130px] animate-pulse-glow"
          style={{ animationDelay: "1.5s" }}
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[400px] w-[400px] rounded-full bg-blue-400/10 blur-[100px] animate-float-slow" />
      </div>

      {/* Subtle grid overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Header */}
      <header className="relative z-10 flex h-14 items-center px-6">
        <Link href="/">
          <img src="/logo-white.svg" alt="Rendr" className="h-[18px] w-auto" />
        </Link>
      </header>

      {/* Content */}
      <main className="relative z-10 flex flex-1 items-center justify-center px-4 py-12">
        {children}
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-5 text-center">
        <p className="text-xs text-zinc-600">
          © {new Date().getFullYear()} Rendr ·{" "}
          <Link href="/privacy" className="hover:text-zinc-400 transition-colors">
            Privacy
          </Link>
          {" · "}
          <Link href="/terms" className="hover:text-zinc-400 transition-colors">
            Terms
          </Link>
        </p>
      </footer>
    </div>
  );
}
