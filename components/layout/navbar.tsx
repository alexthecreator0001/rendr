"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { ChevronDown, Menu, X, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { SOLUTIONS } from "@/lib/solutions-data";

// ── Solutions megamenu ─────────────────────────────────────────────────────

function SolutionsMenu({ active, dark }: { active?: boolean; dark: boolean }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        aria-expanded={open}
        className={cn(
          "relative flex items-center gap-[3px] px-3.5 py-1.5 text-[13.5px] font-medium rounded-lg transition-colors duration-150 outline-none",
          dark
            ? (open || active ? "text-white" : "text-zinc-400 hover:text-zinc-100")
            : (open || active ? "text-zinc-900" : "text-zinc-500 hover:text-zinc-900")
        )}
      >
        Solutions
        <ChevronDown
          className={cn(
            "h-3.5 w-3.5 opacity-40 transition-transform duration-200",
            open && "rotate-180"
          )}
        />
      </button>

      {/* Dropdown panel — only rendered when open to avoid blocking clicks on other nav items */}
      {open && <div
        className="absolute left-1/2 top-full z-50 w-[580px] -translate-x-1/2 pt-1.5"
      >
        <div
          className={cn(
            "rounded-2xl border backdrop-blur-3xl shadow-2xl animate-in fade-in slide-in-from-top-1 duration-150",
            dark
              ? "border-white/[0.08] bg-zinc-950/[0.98] shadow-black/70"
              : "border-zinc-200 bg-white/[0.98] shadow-zinc-900/10"
          )}
        >
          {/* Caret */}
          <div className={cn(
            "absolute -top-[6px] left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 rounded-tl-[2px] border-l border-t",
            dark
              ? "border-white/[0.08] bg-zinc-950/[0.98]"
              : "border-zinc-200 bg-white/[0.98]"
          )} />

          {/* Grid */}
          <div className="grid grid-cols-2 p-2">
            {SOLUTIONS.map((s) => (
              <Link
                key={s.slug}
                href={`/solutions/${s.slug}`}
                onClick={() => setOpen(false)}
                className={cn(
                  "group rounded-xl px-4 py-3.5 transition-colors duration-100",
                  dark ? "hover:bg-white/[0.05]" : "hover:bg-zinc-50"
                )}
              >
                <p className={cn(
                  "mb-1.5 text-[13px] font-medium leading-none",
                  dark ? "text-white" : "text-zinc-900"
                )}>
                  {s.name}
                </p>
                <p className={cn(
                  "text-[11.5px] leading-snug transition-colors",
                  dark ? "text-zinc-500 group-hover:text-zinc-400" : "text-zinc-400 group-hover:text-zinc-500"
                )}>
                  {s.tagline}
                </p>
              </Link>
            ))}
          </div>

          {/* Footer */}
          <div className={cn(
            "flex items-center justify-between border-t px-5 py-3",
            dark ? "border-white/[0.06]" : "border-zinc-100"
          )}>
            <span className={cn("text-[11.5px]", dark ? "text-zinc-600" : "text-zinc-400")}>
              PDF generation for every workflow
            </span>
            <Link
              href="/solutions"
              onClick={() => setOpen(false)}
              className={cn(
                "text-[12px] font-medium transition-colors",
                dark ? "text-zinc-400 hover:text-white" : "text-zinc-500 hover:text-zinc-900"
              )}
            >
              All solutions →
            </Link>
          </div>
        </div>
      </div>}
    </div>
  );
}

// ── Navbar ─────────────────────────────────────────────────────────────────

export function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileSolutionsOpen, setMobileSolutionsOpen] = useState(false);

  // Pages with dark hero backgrounds where navbar should be dark
  const isHeroPage = pathname === "/";
  // When on hero page and not scrolled = transparent dark navbar
  // When on hero page and scrolled = frosted dark navbar
  // When on other pages = frosted light navbar
  const isDark = isHeroPage;
  const scrollEffect = scrolled || !isHeroPage;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const isFeatures  = pathname.startsWith("/features");
  const isSolutions = pathname.startsWith("/solutions");
  const isPricing   = pathname.startsWith("/pricing");
  const isDocs      = pathname.startsWith("/docs");
  const isBlog      = pathname.startsWith("/blog");

  function navItem(active: boolean) {
    return cn(
      "px-3.5 py-1.5 text-[13.5px] font-medium rounded-lg transition-colors duration-150",
      isDark
        ? (active ? "text-white" : "text-zinc-400 hover:text-zinc-100")
        : (active ? "text-zinc-900" : "text-zinc-500 hover:text-zinc-900")
    );
  }

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 w-full transition-all duration-300",
          isDark
            ? scrollEffect
              ? "border-b border-white/[0.07] bg-zinc-950/80 backdrop-blur-2xl"
              : "border-b border-transparent bg-transparent"
            : scrollEffect
              ? "border-b border-zinc-200/80 bg-white/80 backdrop-blur-2xl"
              : "border-b border-transparent bg-transparent"
        )}
      >
        <div className="mx-auto flex h-[52px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

          {/* Logo */}
          <Link href="/" className="flex shrink-0 items-center">
            <img
              src={isDark ? "/logo.svg" : "/logo-dark.svg"}
              alt="Rendr"
              className="h-[17px] w-auto"
            />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center md:flex">
            <Link href="/" className={navItem(pathname === "/")}>
              Home
            </Link>

            <Link href="/features" className={navItem(isFeatures)}>
              Features
            </Link>

            <SolutionsMenu active={isSolutions} dark={isDark} />

            <Link href="/pricing" className={navItem(isPricing)}>
              Pricing
            </Link>

            <Link
              href="/docs"
              target="_blank"
              rel="noreferrer"
              className={cn(navItem(isDocs), "flex items-center gap-[3px]")}
            >
              Docs
              <span className={cn("text-[10px] leading-none", isDark ? "text-zinc-600" : "text-zinc-400")}>↗</span>
            </Link>

            <Link href="/blog" className={navItem(isBlog)}>
              Blog
            </Link>
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-1.5">
            <div className="hidden items-center gap-1 md:flex">
              <Button
                variant="ghost"
                size="sm"
                asChild
                className={cn(
                  "h-8 rounded-lg px-3.5 text-[13.5px] font-medium",
                  isDark
                    ? "text-zinc-400 hover:text-zinc-100 hover:bg-white/[0.06]"
                    : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100"
                )}
              >
                <Link href="/login">Sign in</Link>
              </Button>
              <Button
                size="sm"
                asChild
                className={cn(
                  "h-8 rounded-full px-4 text-[13px] font-medium shadow-sm",
                  isDark
                    ? "bg-white text-zinc-900 hover:bg-zinc-100"
                    : "bg-zinc-900 text-white hover:bg-zinc-800"
                )}
              >
                <Link href="/register">Get started</Link>
              </Button>
            </div>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(true)}
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-lg md:hidden transition-colors",
                isDark
                  ? "text-zinc-400 hover:text-zinc-100 hover:bg-white/[0.07]"
                  : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100"
              )}
            >
              <Menu className="h-[18px] w-[18px]" />
            </button>
          </div>
        </div>
      </header>

      {/* ── Mobile full-screen overlay menu ──────────────────────────── */}
      <div
        className={cn(
          "fixed inset-0 z-[100] transition-all duration-300 md:hidden",
          mobileOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        )}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />

        {/* Panel — slides from right */}
        <div
          className={cn(
            "absolute inset-y-0 right-0 flex w-full max-w-[340px] flex-col bg-white shadow-2xl shadow-black/20 transition-transform duration-300",
            mobileOpen ? "translate-x-0" : "translate-x-full"
          )}
        >
          {/* Header */}
          <div className="flex h-[52px] items-center justify-between px-5">
            <img src="/logo-dark.svg" alt="Rendr" className="h-[17px] w-auto" />
            <button
              onClick={() => setMobileOpen(false)}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Nav links */}
          <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
            {[
              { href: "/", label: "Home", active: pathname === "/" },
              { href: "/features", label: "Features", active: isFeatures },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center rounded-xl px-3.5 py-3 text-[14px] font-medium transition-colors",
                  item.active
                    ? "bg-zinc-100 text-zinc-900"
                    : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"
                )}
              >
                {item.label}
              </Link>
            ))}

            {/* Solutions expandable */}
            <div>
              <button
                onClick={() => setMobileSolutionsOpen((v) => !v)}
                className={cn(
                  "flex w-full items-center justify-between rounded-xl px-3.5 py-3 text-[14px] font-medium transition-colors",
                  isSolutions
                    ? "bg-zinc-100 text-zinc-900"
                    : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"
                )}
              >
                Solutions
                <ChevronDown
                  className={cn(
                    "h-4 w-4 text-zinc-400 transition-transform duration-200",
                    mobileSolutionsOpen && "rotate-180"
                  )}
                />
              </button>

              <div
                className={cn(
                  "overflow-hidden transition-all duration-200",
                  mobileSolutionsOpen ? "max-h-[500px] opacity-100 mt-1" : "max-h-0 opacity-0"
                )}
              >
                <div className="ml-3 space-y-0.5 rounded-xl bg-zinc-50 p-2">
                  {SOLUTIONS.map((s) => (
                    <Link
                      key={s.slug}
                      href={`/solutions/${s.slug}`}
                      onClick={() => setMobileOpen(false)}
                      className="block rounded-lg px-3 py-2.5 text-[13px] font-medium text-zinc-500 transition-colors hover:bg-white hover:text-zinc-900"
                    >
                      {s.name}
                    </Link>
                  ))}
                  <Link
                    href="/solutions"
                    onClick={() => setMobileOpen(false)}
                    className="block rounded-lg px-3 py-2 text-[12px] font-medium text-zinc-400 transition-colors hover:text-zinc-600"
                  >
                    All solutions →
                  </Link>
                </div>
              </div>
            </div>

            {[
              { href: "/pricing", label: "Pricing", active: isPricing },
              { href: "/docs", label: "Docs", active: isDocs, external: true },
              { href: "/blog", label: "Blog", active: isBlog },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                target={item.external ? "_blank" : undefined}
                rel={item.external ? "noreferrer" : undefined}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center justify-between rounded-xl px-3.5 py-3 text-[14px] font-medium transition-colors",
                  item.active
                    ? "bg-zinc-100 text-zinc-900"
                    : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"
                )}
              >
                {item.label}
                {item.external && (
                  <span className="text-[11px] text-zinc-400">↗</span>
                )}
              </Link>
            ))}
          </nav>

          {/* Footer CTAs */}
          <div className="border-t border-zinc-100 p-4 space-y-2.5">
            <Button
              variant="outline"
              size="sm"
              asChild
              className="w-full h-10 rounded-xl border-zinc-200 text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"
            >
              <Link href="/login" onClick={() => setMobileOpen(false)}>
                Sign in
              </Link>
            </Button>
            <Button
              size="sm"
              asChild
              className="w-full h-10 rounded-xl bg-zinc-900 text-white hover:bg-zinc-800 font-medium gap-2"
            >
              <Link href="/register" onClick={() => setMobileOpen(false)}>
                Get started free
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
