"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/features", label: "Features" },
  { href: "/solutions", label: "Solutions" },
  { href: "/pricing", label: "Pricing" },
  { href: "/docs", label: "Docs" },
  { href: "/blog", label: "Blog" },
];

function Logo({ variant = "auto" }: { variant?: "dark" | "light" | "auto" }) {
  if (variant === "dark") {
    return <img src="/logo-white.svg" alt="Rendr" className="h-5 w-auto" />;
  }
  if (variant === "light") {
    return <img src="/logo.svg" alt="Rendr" className="h-5 w-auto" />;
  }
  return (
    <>
      <img src="/logo.svg" alt="Rendr" className="h-5 w-auto block dark:hidden" />
      <img src="/logo-white.svg" alt="Rendr" className="h-5 w-auto hidden dark:block" />
    </>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Detect if we're on the hero (dark) section
  const isHeroPage = pathname === "/";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        scrolled || !isHeroPage
          ? "border-b border-border bg-background/90 backdrop-blur-xl"
          : "bg-transparent border-b border-transparent"
      )}
    >
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          {isHeroPage && !scrolled ? (
            <Logo variant="dark" />
          ) : (
            <Logo variant="auto" />
          )}
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-0.5 md:flex">
          {navLinks.map((link) => {
            const isActive =
              pathname === link.href ||
              (link.href !== "/" && pathname.startsWith(link.href + "/"));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative rounded-lg px-3.5 py-1.5 text-sm font-medium transition-colors duration-150",
                  isHeroPage && !scrolled
                    ? isActive
                      ? "text-white"
                      : "text-white/55 hover:text-white hover:bg-white/[0.07]"
                    : isActive
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                )}
              >
                {link.label}
                {isActive && (
                  <span
                    className={cn(
                      "absolute inset-x-3 -bottom-px h-px rounded-full",
                      isHeroPage && !scrolled ? "bg-white/40" : "bg-primary/70"
                    )}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right */}
        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-1.5 md:flex">
            <Button
              variant="ghost"
              size="sm"
              asChild
              className={cn(
                "rounded-lg text-sm font-medium",
                isHeroPage && !scrolled
                  ? "text-white/55 hover:text-white hover:bg-white/[0.08]"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Link href="/login">Sign in</Link>
            </Button>
            <Button
              size="sm"
              asChild
              className={cn(
                "rounded-lg text-sm font-semibold",
                isHeroPage && !scrolled
                  ? "bg-white text-zinc-900 hover:bg-zinc-50 shadow-sm"
                  : ""
              )}
            >
              <Link href="/register">Get started</Link>
            </Button>
          </div>

          {/* Mobile */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "h-8 w-8",
                  isHeroPage && !scrolled ? "text-white hover:bg-white/10" : ""
                )}
              >
                <Menu className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 pt-10">
              <div className="mb-4 px-2">
                <Logo variant="auto" />
              </div>
              <nav className="flex flex-col gap-0.5 px-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                      pathname === link.href
                        ? "bg-accent text-accent-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="mt-4 flex flex-col gap-2 border-t border-border pt-4">
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/login" onClick={() => setOpen(false)}>Sign in</Link>
                  </Button>
                  <Button size="sm" asChild>
                    <Link href="/register" onClick={() => setOpen(false)}>Get started free</Link>
                  </Button>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
