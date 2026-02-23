"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { ChevronDown, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { SOLUTIONS } from "@/lib/solutions-data";

// ── Solutions megamenu ─────────────────────────────────────────────────────

function SolutionsMenu({ active }: { active?: boolean }) {
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
          open || active ? "text-white" : "text-zinc-400 hover:text-zinc-100"
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

      {/* Dropdown panel — outer wrapper bridges gap from button to panel */}
      <div
        className={cn(
          "absolute left-1/2 top-full z-50 w-[580px] -translate-x-1/2 pt-1.5",
          open ? "pointer-events-auto" : "pointer-events-none"
        )}
      >
        <div
          className={cn(
            "rounded-2xl border border-white/[0.08] bg-zinc-950/[0.98] backdrop-blur-3xl",
            "shadow-2xl shadow-black/70",
            "transition-all duration-150 origin-top",
            open
              ? "opacity-100 translate-y-0 scale-100"
              : "opacity-0 -translate-y-1 scale-[0.98]"
          )}
        >
          {/* Caret */}
          <div className="absolute -top-[6px] left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 rounded-tl-[2px] border-l border-t border-white/[0.08] bg-zinc-950/[0.98]" />

          {/* Grid */}
          <div className="grid grid-cols-2 p-2">
            {SOLUTIONS.map((s) => (
              <Link
                key={s.slug}
                href={`/solutions/${s.slug}`}
                onClick={() => setOpen(false)}
                className="group rounded-xl px-4 py-3.5 transition-colors duration-100 hover:bg-white/[0.05]"
              >
                <p className="mb-1.5 text-[13px] font-medium leading-none text-white">
                  {s.name}
                </p>
                <p className="text-[11.5px] leading-snug text-zinc-500 group-hover:text-zinc-400 transition-colors">
                  {s.tagline}
                </p>
              </Link>
            ))}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between border-t border-white/[0.06] px-5 py-3">
            <span className="text-[11.5px] text-zinc-600">
              PDF generation for every workflow
            </span>
            <Link
              href="/solutions"
              onClick={() => setOpen(false)}
              className="text-[12px] font-medium text-zinc-400 transition-colors hover:text-white"
            >
              All solutions →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Navbar ─────────────────────────────────────────────────────────────────

export function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileSolutionsOpen, setMobileSolutionsOpen] = useState(false);

  const isHeroPage = pathname === "/";
  const scrollEffect = scrolled || !isHeroPage;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isFeatures  = pathname.startsWith("/features");
  const isSolutions = pathname.startsWith("/solutions");
  const isPricing   = pathname.startsWith("/pricing");
  const isDocs      = pathname.startsWith("/docs");
  const isBlog      = pathname.startsWith("/blog");

  function navItem(active: boolean) {
    return cn(
      "px-3.5 py-1.5 text-[13.5px] font-medium rounded-lg transition-colors duration-150",
      active ? "text-white" : "text-zinc-400 hover:text-zinc-100"
    );
  }

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        scrollEffect
          ? "border-b border-white/[0.07] bg-zinc-950/80 backdrop-blur-2xl"
          : "border-b border-transparent bg-transparent"
      )}
    >
      <div className="mx-auto flex h-[52px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* Logo */}
        <Link href="/" className="flex shrink-0 items-center">
          <img src="/logo-white.svg" alt="Rendr" className="h-[17px] w-auto" />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center md:flex">
          <Link href="/features" className={navItem(isFeatures)}>
            Features
          </Link>

          <SolutionsMenu active={isSolutions} />

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
            <span className="text-[10px] leading-none text-zinc-600">↗</span>
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
              className="h-8 rounded-lg px-3.5 text-[13.5px] font-medium text-zinc-400 hover:text-zinc-100 hover:bg-white/[0.06]"
            >
              <Link href="/login">Sign in</Link>
            </Button>
            <Button
              size="sm"
              asChild
              className="h-8 rounded-full px-4 text-[13px] font-medium bg-white text-zinc-900 hover:bg-zinc-100 shadow-sm"
            >
              <Link href="/register">Get started</Link>
            </Button>
          </div>

          {/* Mobile menu */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 text-zinc-400 hover:text-zinc-100 hover:bg-white/[0.07]"
              >
                <Menu className="h-[18px] w-[18px]" />
              </Button>
            </SheetTrigger>

            <SheetContent
              side="right"
              className="flex w-[300px] flex-col gap-0 border-white/[0.07] bg-zinc-950 p-0"
            >
              {/* Header */}
              <div className="flex h-[52px] items-center border-b border-white/[0.07] px-5">
                <img src="/logo-white.svg" alt="Rendr" className="h-[17px] w-auto" />
              </div>

              {/* Nav */}
              <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-px">
                <Link
                  href="/features"
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex items-center rounded-xl px-3 py-2.5 text-[13.5px] font-medium transition-colors",
                    isFeatures ? "bg-white/[0.07] text-white" : "text-zinc-400 hover:text-zinc-100 hover:bg-white/[0.05]"
                  )}
                >
                  Features
                </Link>

                {/* Solutions expandable */}
                <div>
                  <button
                    onClick={() => setMobileSolutionsOpen((v) => !v)}
                    className={cn(
                      "flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-[13.5px] font-medium transition-colors",
                      isSolutions ? "bg-white/[0.07] text-white" : "text-zinc-400 hover:text-zinc-100 hover:bg-white/[0.05]"
                    )}
                  >
                    Solutions
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 opacity-40 transition-transform duration-200",
                        mobileSolutionsOpen && "rotate-180"
                      )}
                    />
                  </button>

                  {mobileSolutionsOpen && (
                    <div className="mt-1 ml-3 space-y-px rounded-xl bg-white/[0.03] p-1.5">
                      {SOLUTIONS.map((s) => (
                        <Link
                          key={s.slug}
                          href={`/solutions/${s.slug}`}
                          onClick={() => setMobileOpen(false)}
                          className="block rounded-lg px-3 py-2 text-[12.5px] font-medium text-zinc-400 transition-colors hover:text-zinc-100 hover:bg-white/[0.05]"
                        >
                          {s.name}
                        </Link>
                      ))}
                      <Link
                        href="/solutions"
                        onClick={() => setMobileOpen(false)}
                        className="block rounded-lg px-3 py-2 text-[12px] font-medium text-zinc-600 transition-colors hover:text-zinc-300"
                      >
                        All solutions →
                      </Link>
                    </div>
                  )}
                </div>

                <Link
                  href="/pricing"
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex items-center rounded-xl px-3 py-2.5 text-[13.5px] font-medium transition-colors",
                    isPricing ? "bg-white/[0.07] text-white" : "text-zinc-400 hover:text-zinc-100 hover:bg-white/[0.05]"
                  )}
                >
                  Pricing
                </Link>

                <Link
                  href="/docs"
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-between rounded-xl px-3 py-2.5 text-[13.5px] font-medium text-zinc-400 transition-colors hover:text-zinc-100 hover:bg-white/[0.05]"
                >
                  Docs
                  <span className="text-[11px] text-zinc-600">↗</span>
                </Link>

                <Link
                  href="/blog"
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex items-center rounded-xl px-3 py-2.5 text-[13.5px] font-medium transition-colors",
                    isBlog ? "bg-white/[0.07] text-white" : "text-zinc-400 hover:text-zinc-100 hover:bg-white/[0.05]"
                  )}
                >
                  Blog
                </Link>
              </nav>

              {/* Footer CTAs */}
              <div className="border-t border-white/[0.07] p-3 space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="w-full rounded-xl border-white/10 bg-transparent text-zinc-300 hover:bg-white/[0.07] hover:text-white"
                >
                  <Link href="/login" onClick={() => setMobileOpen(false)}>
                    Sign in
                  </Link>
                </Button>
                <Button
                  size="sm"
                  asChild
                  className="w-full rounded-xl bg-white text-zinc-900 hover:bg-zinc-100 font-medium"
                >
                  <Link href="/register" onClick={() => setMobileOpen(false)}>
                    Get started free
                  </Link>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
