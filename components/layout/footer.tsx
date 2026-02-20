import Link from "next/link";
import { Separator } from "@/components/ui/separator";

const footerLinks = {
  Product: [
    { href: "/features", label: "Features" },
    { href: "/pricing", label: "Pricing" },
    { href: "/blog", label: "Blog" },
    { href: "/changelog", label: "Changelog" },
  ],
  Developers: [
    { href: "/docs", label: "Documentation" },
    { href: "/docs/quick-start", label: "Quick start" },
    { href: "/docs/api", label: "API reference" },
    { href: "/docs/templates", label: "Templates" },
  ],
  Company: [
    { href: "/about", label: "About" },
    { href: "/privacy", label: "Privacy" },
    { href: "/terms", label: "Terms" },
    { href: "mailto:hello@rendrpdf.com", label: "Contact" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-4">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-1">
            <Link href="/" className="inline-flex items-center">
              <img src="/logo.svg" alt="Rendr" className="h-5 w-auto dark:invert" />
            </Link>
            <p className="mt-4 text-sm text-muted-foreground leading-relaxed max-w-[180px]">
              HTML to PDF, done right.
              No browser to babysit.
            </p>
            <div className="mt-4 flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              <span className="text-xs text-muted-foreground">All systems operational</span>
            </div>
          </div>

          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground/60">
                {category}
              </p>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors duration-150 hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Separator className="my-10" />

        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Rendr. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Made for developers who ship fast.
          </p>
        </div>
      </div>
    </footer>
  );
}
