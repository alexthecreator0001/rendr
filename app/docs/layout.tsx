import Link from "next/link";
import { FileText, Search } from "lucide-react";
import { DocsSidebar } from "@/components/layout/docs-sidebar";
import { DocsToc } from "@/components/layout/docs-toc";
import { ThemeToggle } from "@/components/theme-toggle";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Top navbar */}
      <header className="sticky top-0 z-40 flex h-14 items-center border-b border-border bg-background/80 px-4 backdrop-blur-md sm:px-6">
        <div className="flex w-full items-center gap-4">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary">
              <FileText className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="tracking-tight">Rendr</span>
          </Link>
          <span className="text-muted-foreground/40">/</span>
          <span className="text-sm font-medium text-muted-foreground">Docs</span>

          {/* Search */}
          <div className="relative ml-4 hidden flex-1 max-w-sm sm:block">
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search docs…"
              className="h-8 pl-8 text-sm"
              aria-label="Search documentation"
            />
          </div>

          <div className="ml-auto flex items-center gap-2">
            <ThemeToggle />
            <Button variant="ghost" size="sm" asChild>
              <Link href="/app">Dashboard</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Three-column layout */}
      <div className="flex flex-1">
        {/* Left sidebar */}
        <aside className="hidden w-56 shrink-0 border-r border-border lg:block">
          <ScrollArea className="h-[calc(100vh-3.5rem)] sticky top-14">
            <div className="px-4">
              <DocsSidebar />
            </div>
          </ScrollArea>
        </aside>

        {/* Main content */}
        <main className="min-w-0 flex-1 px-4 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-2xl py-10">{children}</div>
        </main>

        {/* Right TOC */}
        <aside className="hidden w-52 shrink-0 border-l border-border xl:block">
          <div className="sticky top-14 h-[calc(100vh-3.5rem)] overflow-auto px-4">
            <DocsToc />
          </div>
        </aside>
      </div>
    </div>
  );
}
