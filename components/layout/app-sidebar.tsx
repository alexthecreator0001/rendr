"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTransition } from "react";
import {
  LayoutDashboard, Key, Layers, Webhook, BarChart2,
  CreditCard, BookOpen, Wand2, BriefcaseBusiness,
  Settings, LogOut, MoreVertical, ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOutAction } from "@/app/actions/auth";

// Nav groups — each array is a visual section separated by a divider
const navGroups = [
  [
    { href: "/app",          label: "Overview",       icon: LayoutDashboard, exact: true },
    { href: "/app/convert",  label: "Studio",         icon: Wand2 },
    { href: "/app/jobs",     label: "Jobs",           icon: BriefcaseBusiness },
    { href: "/app/usage",    label: "Usage",          icon: BarChart2 },
  ],
  [
    { href: "/app/api-keys",  label: "API Keys",   icon: Key },
    { href: "/app/templates", label: "Templates",  icon: Layers },
    { href: "/app/webhooks",  label: "Webhooks",   icon: Webhook },
  ],
  [
    { href: "/app/billing",  label: "Billing",        icon: CreditCard },
  ],
  [
    { href: "/docs",         label: "Documentation",  icon: BookOpen, external: true },
  ],
] as const;

interface AppSidebarProps {
  user: { email: string };
}

export function AppSidebar({ user }: AppSidebarProps) {
  const pathname = usePathname();
  const [pending, startTransition] = useTransition();
  const initials = user.email.slice(0, 2).toUpperCase();

  return (
    <aside className="flex h-full w-[220px] shrink-0 flex-col border-r border-border bg-background">

        {/* Logo */}
        <div className="flex h-14 items-center border-b border-border px-4">
          <Link href="/" className="flex items-center">
            <img src="/logo.svg" alt="Rendr" className="h-[18px] w-auto dark:invert" />
          </Link>
        </div>

        {/* Navigation */}
        <ScrollArea className="flex-1">
          <nav className="px-2.5 py-3 space-y-0.5">
            {navGroups.map((group, gi) => (
              <div key={gi}>
                {gi > 0 && <Separator className="my-2 opacity-60" />}
                {group.map((item) => {
                  const isActive = (item as { exact?: boolean }).exact
                    ? pathname === item.href
                    : pathname.startsWith(item.href);
                  const isExternal = (item as { external?: boolean }).external;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      target={isExternal ? "_blank" : undefined}
                      rel={isExternal ? "noreferrer" : undefined}
                      className={cn(
                        "group relative flex items-center gap-2.5 rounded-lg px-2.5 py-[7px] text-sm transition-all duration-100",
                        isActive
                          ? "bg-accent text-foreground font-medium"
                          : "text-muted-foreground hover:text-foreground hover:bg-accent/60"
                      )}
                    >
                      {/* Active indicator bar */}
                      {isActive && (
                        <span className="absolute left-0 top-1.5 bottom-1.5 w-[2.5px] rounded-full bg-primary" />
                      )}

                      <item.icon
                        className={cn(
                          "h-[15px] w-[15px] shrink-0 transition-colors",
                          isActive
                            ? "text-foreground"
                            : "text-muted-foreground group-hover:text-foreground"
                        )}
                      />
                      <span className="flex-1 truncate leading-none">{item.label}</span>

                      {isExternal && (
                        <ExternalLink className="h-3 w-3 shrink-0 text-muted-foreground/40 group-hover:text-muted-foreground transition-colors" />
                      )}
                      {(item as { badge?: string }).badge && (
                        <Badge
                          variant="secondary"
                          className="h-4 rounded-full px-1.5 py-0 text-[10px]"
                        >
                          {(item as { badge?: string }).badge}
                        </Badge>
                      )}
                    </Link>
                  );
                })}
              </div>
            ))}
          </nav>
        </ScrollArea>

        {/* User footer */}
        <div className="border-t border-border p-2.5">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="group flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left transition-all duration-100 hover:bg-accent/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {/* Avatar */}
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-violet-600 text-xs font-bold text-white select-none">
                  {initials}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[12px] font-semibold leading-tight">{user.email}</p>
                  <p className="truncate text-[10px] text-muted-foreground leading-tight mt-0.5">
                    Starter plan
                  </p>
                </div>
                <MoreVertical className="h-3.5 w-3.5 shrink-0 text-muted-foreground/60 group-hover:text-muted-foreground transition-colors" />
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent side="top" align="end" sideOffset={6} className="w-48 mb-1">
              <DropdownMenuItem asChild>
                <Link href="/app/settings" className="flex items-center gap-2 cursor-pointer">
                  <Settings className="h-4 w-4 text-muted-foreground" />
                  Settings
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

      </aside>
  );
}
