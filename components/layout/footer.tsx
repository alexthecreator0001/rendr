import Link from "next/link";
import { FileText } from "lucide-react";
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
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 lg:grid-cols-4">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-1">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary">
                <FileText className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="tracking-tight">Rendr</span>
            </Link>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              HTML to PDF, done simply.<br />No browser to babysit.
            </p>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                {category}
              </p>
              <ul className="mt-3 space-y-2.5">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Rendr. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Status: <span className="text-emerald-500">All systems operational</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
