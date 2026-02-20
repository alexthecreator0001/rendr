import Link from "next/link";
import { FileText } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Minimal header */}
      <header className="flex h-14 items-center border-b border-border px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold text-foreground">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary">
            <FileText className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="tracking-tight">Rendr</span>
        </Link>
      </header>

      {/* Centered content */}
      <main className="flex flex-1 items-center justify-center px-4 py-16">
        {children}
      </main>

      <footer className="border-t border-border py-4 text-center">
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} Rendr ·{" "}
          <Link href="/privacy" className="hover:underline">Privacy</Link>
          {" · "}
          <Link href="/terms" className="hover:underline">Terms</Link>
        </p>
      </footer>
    </div>
  );
}
