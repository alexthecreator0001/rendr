"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface SearchItem {
  title: string;
  href: string;
  section: string;
}

const SEARCH_ITEMS: SearchItem[] = [
  // Getting started
  { title: "Overview", href: "/docs", section: "Getting started" },
  { title: "Quick start", href: "/docs/quick-start", section: "Getting started" },
  // API Reference
  { title: "Authentication", href: "/docs/api", section: "API Reference" },
  { title: "Render job (sync)", href: "/docs/api#render-job", section: "API Reference" },
  { title: "Render job (async)", href: "/docs/api#async", section: "API Reference" },
  { title: "Job status", href: "/docs/api#job-status", section: "API Reference" },
  { title: "Templates", href: "/docs/templates", section: "API Reference" },
  { title: "Webhooks", href: "/docs/api#webhooks", section: "API Reference" },
  { title: "Error codes", href: "/docs/api#errors", section: "API Reference" },
  { title: "Rate limits", href: "/docs/api#rate-limits", section: "API Reference" },
  { title: "SDKs", href: "/docs/api#sdks", section: "API Reference" },
  // Features
  { title: "waitForSelector", href: "/docs/api#waitforselector", section: "Features" },
  { title: "Custom filename", href: "/docs/api#filename", section: "Features" },
  { title: "Custom HTTP headers", href: "/docs/api#custom-headers", section: "Features" },
  { title: "PDF metadata", href: "/docs/api#pdf-metadata", section: "Features" },
  { title: "Watermark", href: "/docs/api#watermark", section: "Features" },
  { title: "Per-job webhook", href: "/docs/api#per-job-webhook", section: "Features" },
  { title: "PDF merge", href: "/docs/api#merge", section: "Features" },
  // Guides
  { title: "Using templates", href: "/docs/templates", section: "Guides" },
  { title: "Custom fonts", href: "/docs/templates#fonts", section: "Guides" },
  { title: "Async jobs", href: "/docs/api#async", section: "Guides" },
  { title: "Signed URLs", href: "/docs/api#signed-urls", section: "Guides" },
];

export function DocsSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = query.trim()
    ? SEARCH_ITEMS.filter(
        (item) =>
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.section.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const showDropdown = open && query.trim().length > 0;

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Reset active index when results change
  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  function navigate(href: string) {
    setQuery("");
    setOpen(false);
    inputRef.current?.blur();
    router.push(href);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (!showDropdown) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && filtered[activeIndex]) {
      e.preventDefault();
      navigate(filtered[activeIndex].href);
    } else if (e.key === "Escape") {
      setOpen(false);
      inputRef.current?.blur();
    }
  }

  return (
    <div ref={wrapperRef} className="relative ml-4 hidden flex-1 max-w-xs sm:block">
      <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground pointer-events-none" />
      <Input
        ref={inputRef}
        placeholder="Search docs…"
        className="h-8 pl-9 text-sm rounded-lg bg-muted border-0"
        aria-label="Search documentation"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={handleKeyDown}
      />

      {/* Results dropdown */}
      {showDropdown && (
        <div className="absolute left-0 right-0 top-full z-50 mt-1.5 rounded-xl border border-border bg-popover shadow-xl overflow-hidden">
          {filtered.length === 0 ? (
            <div className="px-4 py-6 text-center text-sm text-muted-foreground">
              No results for &quot;{query}&quot;
            </div>
          ) : (
            <div className="max-h-[320px] overflow-y-auto py-1.5">
              {filtered.map((item, i) => (
                <button
                  key={`${item.href}-${item.title}`}
                  onClick={() => navigate(item.href)}
                  onMouseEnter={() => setActiveIndex(i)}
                  className={cn(
                    "flex w-full items-center gap-3 px-3.5 py-2.5 text-left text-sm transition-colors",
                    i === activeIndex ? "bg-accent" : "hover:bg-accent/50"
                  )}
                >
                  <Search className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium truncate">{item.title}</p>
                    <p className="text-[11px] text-muted-foreground">{item.section}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
