import Link from "next/link";

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
    <footer className="bg-zinc-950">
      {/* Dark content section */}
      <div className="mx-auto max-w-7xl px-6 pt-16 pb-12 sm:px-8 lg:px-10">
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-4">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-1">
            <Link href="/" className="inline-flex items-center">
              <img src="/logo-white.svg" alt="Rendr" className="h-5 w-auto" />
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

        {/* Bottom copyright row */}
        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-white/[0.06] pt-8 sm:flex-row">
          <p className="text-xs text-zinc-600">
            © {new Date().getFullYear()} Rendr. All rights reserved.
          </p>
          <p className="text-xs text-zinc-600">
            Made for developers who ship fast.
          </p>
        </div>
      </div>

      {/* Gradient bridge — dark to transparent */}
      <div className="h-10 bg-gradient-to-b from-zinc-950 to-transparent" />

      {/* Full landscape image — no cropping, natural proportions */}
      <div className="w-full">
        <img
          src="/footer.jpg"
          alt="Meadow landscape"
          className="block w-full h-auto"
        />
      </div>
    </footer>
  );
}
