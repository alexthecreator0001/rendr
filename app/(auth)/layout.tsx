import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="flex h-14 items-center justify-between border-b border-border px-6">
        <Link href="/">
          <img src="/logo.svg" alt="Rendr" className="h-4 w-auto dark:invert" />
        </Link>
        <ThemeToggle />
      </header>

      <main className="flex flex-1 items-center justify-center px-4 py-16">
        {children}
      </main>

      <footer className="border-t border-border py-5 text-center">
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} Rendr ·{" "}
          <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
          {" · "}
          <Link href="/terms" className="hover:text-foreground transition-colors">Terms</Link>
        </p>
      </footer>
    </div>
  );
}
