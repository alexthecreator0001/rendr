"use client";

import { useState, useTransition } from "react";
import {
  Bell, Search, FileOutput, LayoutDashboard, Key,
  Layers, Webhook, BarChart2, CreditCard, BriefcaseBusiness,
  BookOpen, Settings, LogOut, Menu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { signOutAction } from "@/app/actions/auth";
import { useSidebar } from "@/components/providers/sidebar-provider";
import Link from "next/link";

const SEARCH_ITEMS = [
  { label: "Overview",       href: "/app",            icon: LayoutDashboard },
  { label: "Convert to PDF", href: "/app/convert",    icon: FileOutput },
  { label: "Jobs",           href: "/app/jobs",       icon: BriefcaseBusiness },
  { label: "Usage",          href: "/app/usage",      icon: BarChart2 },
  { label: "API Keys",       href: "/app/api-keys",   icon: Key },
  { label: "Templates",      href: "/app/templates",  icon: Layers },
  { label: "Webhooks",       href: "/app/webhooks",   icon: Webhook },
  { label: "Billing",        href: "/app/billing",    icon: CreditCard },
  { label: "Settings",       href: "/app/settings",   icon: Settings },
  { label: "Documentation",  href: "/docs",           icon: BookOpen },
];

interface AppTopbarProps {
  user: { email: string };
}

export function AppTopbar({ user }: AppTopbarProps) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [pending, startTransition] = useTransition();
  const { toggle } = useSidebar();
  const initials = user.email.slice(0, 2).toUpperCase();

  const filtered = query.trim()
    ? SEARCH_ITEMS.filter((i) => i.label.toLowerCase().includes(query.toLowerCase()))
    : SEARCH_ITEMS;

  const closeSearch = () => { setSearchOpen(false); setQuery(""); };

  return (
    <>
      <header className="flex h-14 items-center justify-between border-b border-border bg-background px-4 sm:px-6 shrink-0">
        {/* Mobile hamburger */}
        <button
          onClick={toggle}
          className="flex items-center justify-center h-8 w-8 rounded-lg hover:bg-accent transition-colors md:hidden"
          aria-label="Toggle sidebar"
        >
          <Menu className="h-4 w-4" />
        </button>

        <div className="hidden md:block" />

        <div className="flex items-center gap-1.5">
          {/* Search trigger */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSearchOpen(true)}
            className="h-8 gap-2 rounded-lg text-muted-foreground hover:text-foreground"
          >
            <Search className="h-4 w-4" />
            <span className="hidden text-sm sm:block">Search…</span>
            <kbd className="hidden sm:inline-flex h-5 items-center rounded border border-border bg-muted px-1.5 font-mono text-[10px] text-muted-foreground">
              ⌘K
            </kbd>
          </Button>

          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg" aria-label="Notifications">
            <Bell className="h-4 w-4" />
          </Button>

          {/* User menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                <Avatar className="h-7 w-7">
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-violet-600 text-[11px] font-semibold text-white">
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              <DropdownMenuLabel>
                <p className="truncate text-sm font-medium">{user.email}</p>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/app/settings" className="flex items-center gap-2">
                  <Settings className="h-4 w-4" /> Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/app/billing" className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4" /> Billing
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="flex items-center gap-2 text-destructive focus:text-destructive cursor-pointer"
                onSelect={() => startTransition(() => signOutAction())}
                disabled={pending}
              >
                <LogOut className="h-4 w-4" />
                {pending ? "Signing out…" : "Sign out"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Search dialog */}
      <Dialog open={searchOpen} onOpenChange={(v) => { if (!v) closeSearch(); else setSearchOpen(true); }}>
        <DialogContent className="gap-0 p-0 max-w-md overflow-hidden">
          <div className="flex items-center border-b border-border px-4">
            <Search className="mr-3 h-4 w-4 shrink-0 text-muted-foreground" />
            <Input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search pages…"
              className="h-12 border-0 px-0 shadow-none focus-visible:ring-0"
            />
          </div>
          <div className="max-h-72 overflow-y-auto py-2">
            {filtered.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeSearch}
                className="flex items-center gap-3 px-4 py-2.5 text-sm transition-colors hover:bg-accent/60"
              >
                <item.icon className="h-4 w-4 shrink-0 text-muted-foreground" />
                {item.label}
              </Link>
            ))}
            {filtered.length === 0 && (
              <p className="py-8 text-center text-sm text-muted-foreground">
                No results for &ldquo;{query}&rdquo;
              </p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
