"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import {
  Menu, Zap, CreditCard, BookOpen, FileText,
  ChevronDown, ExternalLink, ArrowRight,
  Receipt, ShoppingBag, UserCheck, BarChart2, Scale,
  Award, Building2, Activity,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { SOLUTIONS } from "@/lib/solutions-data";

// ── Solution icon / color maps ────────────────────────────────────────────

const SOLUTION_ICONS: Record<string, React.ElementType> = {
  Receipt, ShoppingBag, UserCheck, BarChart2, Scale, Award, Building2, Activity,
};

const SOLUTION_COLORS: Record<string, { bg: string; text: string }> = {
  blue:    { bg: "bg-blue-500/10",    text: "text-blue-400"    },
  emerald: { bg: "bg-emerald-500/10", text: "text-emerald-400" },
  violet:  { bg: "bg-violet-500/10",  text: "text-violet-400"  },
  amber:   { bg: "bg-amber-500/10",   text: "text-amber-400"   },
  slate:   { bg: "bg-slate-500/10",   text: "text-slate-400"   },
  rose:    { bg: "bg-rose-500/10",    text: "text-rose-400"    },
  orange:  { bg: "bg-orange-500/10",  text: "text-orange-400"  },
  sky:     { bg: "bg-sky-500/10",     text: "text-sky-400"     },
};

// ── Logo ─────────────────────────────────────────────────────────────────

function Logo({ dark }: { dark?: boolean }) {
  if (dark) return <img src="/logo-white.svg" alt="Rendr" className="h-[18px] w-auto" />;
  return (
    <>
      <img src="/logo.svg"       alt="Rendr" className="h-[18px] w-auto block dark:hidden" />
      <img src="/logo-white.svg" alt="Rendr" className="h-[18px] w-auto hidden dark:block" />
    </>
  );
}

// ── Solutions megamenu ────────────────────────────────────────────────────

function SolutionsMenu({ dark, active }: { dark: boolean; active?: boolean }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      {/* Trigger button */}
      <button
        aria-expanded={open}
        className={cn(
          "relative flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors duration-150",
          dark
            ? open || active
              ? "bg-white/[0.08] text-white"
              : "text-white/60 hover:text-white hover:bg-white/[0.07]"
            : open || active
              ? "bg-accent text-foreground"
              : "text-muted-foreground hover:text-foreground hover:bg-accent/60"
        )}
      >
        {active && (
          <span className={cn(
            "absolute inset-x-2.5 -bottom-px h-px rounded-full",
            dark ? "bg-white/30" : "bg-primary/60"
          )} />
        )}
        Solutions
        <ChevronDown
          className={cn(
            "h-3.5 w-3.5 shrink-0 transition-transform duration-200",
            open ? "rotate-180" : ""
          )}
        />
      </button>

      {/* Dropdown panel */}
      <div
        className={cn(
          "absolute left-1/2 top-[calc(100%+8px)] z-50 w-[620px] -translate-x-1/2",
          "rounded-2xl border border-border bg-background/[0.98] backdrop-blur-2xl",
          "shadow-2xl shadow-black/10 dark:shadow-black/60",
          "transition-all duration-150 origin-top",
          open
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 -translate-y-2 scale-[0.97] pointer-events-none"
        )}
      >
        {/* Caret */}
        <div className="absolute -top-[7px] left-1/2 h-3.5 w-3.5 -translate-x-1/2 rotate-45 rounded-tl-sm border-l border-t border-border bg-background/[0.98]" />

        {/* Grid */}
        <div className="grid grid-cols-4 gap-1 p-3">
          {SOLUTIONS.map((solution) => {
            const Icon = SOLUTION_ICONS[solution.icon] ?? Receipt;
            const clr = SOLUTION_COLORS[solution.color] ?? SOLUTION_COLORS.blue;
            return (
              <Link
                key={solution.slug}
                href={`/solutions/${solution.slug}`}
                onClick={() => setOpen(false)}
                className="group flex flex-col gap-2.5 rounded-xl p-3 transition-colors duration-100 hover:bg-accent/70"
              >
                <div className={cn("flex h-8 w-8 items-center justify-center rounded-lg", clr.bg)}>
                  <Icon className={cn("h-4 w-4", clr.text)} />
                </div>
                <div>
                  <p className={cn("mb-0.5 text-[9.5px] font-semibold uppercase tracking-widest leading-none", clr.text)}>
                    {solution.label}
                  </p>
                  <p className="text-[12.5px] font-semibold leading-snug text-foreground">
                    {solution.name}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-border/60 px-4 py-3">
          <p className="text-[12px] text-muted-foreground">
            PDF generation for every document workflow
          </p>
          <Link
            href="/solutions"
            onClick={() => setOpen(false)}
            className="flex items-center gap-1 text-[12px] font-semibold text-primary transition-colors hover:text-primary/80"
          >
            All solutions <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}

// ── Navbar ────────────────────────────────────────────────────────────────

export function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileSolutionsOpen, setMobileSolutionsOpen] = useState(false);

  const isHeroPage = pathname === "/";
  const isDark = isHeroPage && !scrolled;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Nav item helper
  function navClass(active: boolean) {
    return cn(
      "relative flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors duration-150",
      isDark
        ? active
          ? "text-white"
          : "text-white/60 hover:text-white hover:bg-white/[0.07]"
        : active
          ? "text-foreground"
          : "text-muted-foreground hover:text-foreground hover:bg-accent/60"
    );
  }

  function activeLine() {
    return (
      <span
        className={cn(
          "absolute inset-x-2.5 -bottom-px h-px rounded-full",
          isDark ? "bg-white/30" : "bg-primary/60"
        )}
      />
    );
  }

  const isFeatures  = pathname.startsWith("/features");
  const isSolutions = pathname.startsWith("/solutions");
  const isPricing   = pathname.startsWith("/pricing");
  const isDocs      = pathname.startsWith("/docs");
  const isBlog      = pathname.startsWith("/blog");

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        scrolled || !isHeroPage
          ? "border-b border-border/80 bg-background/90 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent"
      )}
    >
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* Logo */}
        <Link href="/" className="flex shrink-0 items-center">
          <Logo dark={isDark} />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-0.5 md:flex">

          {/* Features */}
          <Link href="/features" className={navClass(isFeatures)}>
            <Zap className="h-3.5 w-3.5 shrink-0" />
            Features
            {isFeatures && activeLine()}
          </Link>

          {/* Solutions — megamenu */}
          <SolutionsMenu dark={isDark} active={isSolutions} />

          {/* Pricing */}
          <Link href="/pricing" className={navClass(isPricing)}>
            <CreditCard className="h-3.5 w-3.5 shrink-0" />
            Pricing
            {isPricing && activeLine()}
          </Link>

          {/* Docs — external */}
          <Link
            href="/docs"
            target="_blank"
            rel="noreferrer"
            className={navClass(isDocs)}
          >
            <BookOpen className="h-3.5 w-3.5 shrink-0" />
            Docs
            <ExternalLink className="h-3 w-3 shrink-0 opacity-40" />
            {isDocs && activeLine()}
          </Link>

          {/* Blog */}
          <Link href="/blog" className={navClass(isBlog)}>
            <FileText className="h-3.5 w-3.5 shrink-0" />
            Blog
            {isBlog && activeLine()}
          </Link>
        </nav>

        {/* Right side — desktop */}
        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-1.5 md:flex">
            <Button
              variant="ghost"
              size="sm"
              asChild
              className={cn(
                "h-8 rounded-lg px-3.5 text-sm font-medium",
                isDark
                  ? "text-white/60 hover:text-white hover:bg-white/[0.08]"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Link href="/login">Sign in</Link>
            </Button>
            <Button
              size="sm"
              asChild
              className={cn(
                "h-8 rounded-lg px-4 text-sm font-semibold",
                isDark
                  ? "bg-white text-zinc-900 hover:bg-zinc-100 shadow-sm shadow-black/20"
                  : ""
              )}
            >
              <Link href="/register">Get started</Link>
            </Button>
          </div>

          {/* Mobile hamburger */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "h-8 w-8",
                  isDark ? "text-white hover:bg-white/10" : ""
                )}
              >
                <Menu className="h-4 w-4" />
              </Button>
            </SheetTrigger>

            <SheetContent side="right" className="flex w-[300px] flex-col gap-0 p-0">
              {/* Mobile header */}
              <div className="flex h-14 items-center border-b border-border px-5">
                <Logo />
              </div>

              {/* Mobile nav */}
              <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">

                {/* Features */}
                <Link
                  href="/features"
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                    isFeatures ? "bg-accent text-foreground" : "text-muted-foreground hover:text-foreground hover:bg-accent/60"
                  )}
                >
                  <Zap className="h-4 w-4 shrink-0" />
                  Features
                </Link>

                {/* Solutions — expandable */}
                <div>
                  <button
                    onClick={() => setMobileSolutionsOpen((v) => !v)}
                    className={cn(
                      "flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                      isSolutions ? "bg-accent text-foreground" : "text-muted-foreground hover:text-foreground hover:bg-accent/60"
                    )}
                  >
                    <ChevronDown className={cn("h-4 w-4 shrink-0 transition-transform", mobileSolutionsOpen && "rotate-180")} />
                    <span className="flex-1 text-left">Solutions</span>
                  </button>

                  {mobileSolutionsOpen && (
                    <div className="mt-1 ml-4 grid grid-cols-2 gap-1 rounded-xl bg-muted/40 p-2">
                      {SOLUTIONS.map((s) => {
                        const Icon = SOLUTION_ICONS[s.icon] ?? Receipt;
                        const clr = SOLUTION_COLORS[s.color] ?? SOLUTION_COLORS.blue;
                        return (
                          <Link
                            key={s.slug}
                            href={`/solutions/${s.slug}`}
                            onClick={() => setMobileOpen(false)}
                            className="flex items-center gap-2 rounded-lg p-2 text-[12px] font-medium text-muted-foreground hover:text-foreground hover:bg-accent/60 transition-colors"
                          >
                            <div className={cn("flex h-6 w-6 shrink-0 items-center justify-center rounded-md", clr.bg)}>
                              <Icon className={cn("h-3.5 w-3.5", clr.text)} />
                            </div>
                            {s.name}
                          </Link>
                        );
                      })}
                      <Link
                        href="/solutions"
                        onClick={() => setMobileOpen(false)}
                        className="col-span-2 mt-1 flex items-center justify-center gap-1 rounded-lg py-1.5 text-[11px] font-semibold text-primary hover:bg-accent/60 transition-colors"
                      >
                        View all solutions <ArrowRight className="h-3 w-3" />
                      </Link>
                    </div>
                  )}
                </div>

                {/* Pricing */}
                <Link
                  href="/pricing"
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                    isPricing ? "bg-accent text-foreground" : "text-muted-foreground hover:text-foreground hover:bg-accent/60"
                  )}
                >
                  <CreditCard className="h-4 w-4 shrink-0" />
                  Pricing
                </Link>

                {/* Docs */}
                <Link
                  href="/docs"
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent/60 transition-colors"
                >
                  <BookOpen className="h-4 w-4 shrink-0" />
                  Docs
                  <ExternalLink className="ml-auto h-3.5 w-3.5 opacity-40" />
                </Link>

                {/* Blog */}
                <Link
                  href="/blog"
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                    isBlog ? "bg-accent text-foreground" : "text-muted-foreground hover:text-foreground hover:bg-accent/60"
                  )}
                >
                  <FileText className="h-4 w-4 shrink-0" />
                  Blog
                </Link>
              </nav>

              {/* Mobile footer CTAs */}
              <div className="border-t border-border p-3 space-y-2">
                <Button variant="outline" size="sm" className="w-full rounded-xl" asChild>
                  <Link href="/login" onClick={() => setMobileOpen(false)}>Sign in</Link>
                </Button>
                <Button size="sm" className="w-full rounded-xl font-semibold" asChild>
                  <Link href="/register" onClick={() => setMobileOpen(false)}>Get started free</Link>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
