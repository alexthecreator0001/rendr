import Link from "next/link";
import { Search } from "lucide-react";
import { DocsSidebar } from "@/components/layout/docs-sidebar";
import { DocsToc } from "@/components/layout/docs-toc";
import { ThemeToggle } from "@/components/theme-toggle";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 flex h-14 items-center border-b border-border bg-background/90 px-4 backdrop-blur-xl sm:px-6">
        <div className="flex w-full items-center gap-4">
          <Link href="/" className="flex items-center shrink-0">
            <img src="/logo-white.svg" alt="Rendr" className="h-4 w-auto invert dark:invert-0" />
          </Link>
          <span className="text-border text-lg font-light">/</span>
          <Link href="/docs" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Docs
          </Link>

          <div className="relative ml-4 hidden flex-1 max-w-xs sm:block">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search docs…" className="h-8 pl-9 text-sm rounded-lg bg-muted border-0" aria-label="Search documentation" />
          </div>

          <div className="ml-auto flex items-center gap-2">
            <ThemeToggle />
            <Button variant="ghost" size="sm" asChild className="hidden sm:flex">
              <Link href="/app">Dashboard</Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        <aside className="hidden w-56 shrink-0 border-r border-border lg:block">
          <ScrollArea className="h-[calc(100vh-3.5rem)] sticky top-14">
            <div className="px-4">
              <DocsSidebar />
            </div>
          </ScrollArea>
        </aside>

        <main className="min-w-0 flex-1 px-6 sm:px-10 lg:px-14">
          <div className="mx-auto max-w-2xl py-10">{children}</div>
        </main>

        <aside className="hidden w-52 shrink-0 border-l border-border xl:block">
          <div className="sticky top-14 h-[calc(100vh-3.5rem)] overflow-auto px-5">
            <DocsToc />
          </div>
        </aside>
      </div>
    </div>
  );
}
