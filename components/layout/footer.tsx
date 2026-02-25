import Link from "next/link";
import { FooterAsciiArt } from "@/components/marketing/footer-ascii-art";

const footerLinks = {
  Product: [
    { href: "/features", label: "Features" },
    { href: "/solutions", label: "Solutions" },
    { href: "/pricing", label: "Pricing" },
    { href: "/blog", label: "Blog" },
  ],
  Solutions: [
    { href: "/solutions/invoicing", label: "Invoicing" },
    { href: "/solutions/ecommerce-receipts", label: "E-commerce" },
    { href: "/solutions/hr-documents", label: "HR Documents" },
    { href: "/solutions/legal-contracts", label: "Legal & Contracts" },
    { href: "/solutions/reporting", label: "Reporting" },
    { href: "/solutions/certificates", label: "Certificates" },
    { href: "/solutions/real-estate", label: "Real Estate" },
    { href: "/solutions/healthcare", label: "Healthcare" },
  ],
  Developers: [
    { href: "/docs", label: "Documentation" },
    { href: "/docs/quick-start", label: "Quick start" },
    { href: "/docs/api", label: "API reference" },
    { href: "/docs/templates", label: "Templates" },
  ],
  Company: [
    { href: "/privacy", label: "Privacy" },
    { href: "/terms", label: "Terms" },
    { href: "mailto:hello@rendrpdf.com", label: "Contact" },
  ],
};

export function Footer() {
  return (
    <footer className="dark overflow-hidden bg-zinc-950" style={{ colorScheme: "dark" }}>
      <div className="mx-auto max-w-7xl px-6 pt-16 pb-12 sm:px-8 lg:px-10">
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:grid-cols-6">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-3 lg:col-span-2">
            <Link href="/" className="inline-flex items-center">
              <img src="/logo.svg" alt="Rendr" className="h-[18px] w-auto" />
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-zinc-500 max-w-[180px]">
              HTML to PDF, done right.
              No browser to babysit.
            </p>
            <div className="mt-4 flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              <span className="text-xs text-zinc-500">All systems operational</span>
            </div>
          </div>

          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <p className="mb-4 text-[10px] font-semibold uppercase tracking-widest text-zinc-500/50">
                {category}
              </p>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-zinc-500 transition-colors duration-150 hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="mt-12 flex items-center gap-3">
          <span className="text-zinc-700">+</span>
          <div className="flex-1 border-t border-dashed border-zinc-800" />
          <span className="text-zinc-700">+</span>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-3 sm:flex-row">
          <p className="text-xs text-zinc-600 uppercase tracking-wider font-mono">
            &copy; {new Date().getFullYear()} Rendr. All rights reserved.
          </p>
          <p className="text-xs text-zinc-600">
            Made for developers who ship fast.
          </p>
        </div>
      </div>

      {/* Large ASCII art "Rendr" below footer content */}
      <FooterAsciiArt />
    </footer>
  );
}
