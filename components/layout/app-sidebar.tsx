"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTransition } from "react";
import {
  LayoutDashboard, Key, Layers, Webhook, BarChart2,
  CreditCard, BookOpen, Wand2, BriefcaseBusiness,
  Settings, LogOut, MoreVertical, ExternalLink,
  Zap,
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
import { useSidebar } from "@/components/providers/sidebar-provider";

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

const PLAN_LABELS: Record<string, string> = {
  starter: "Starter",
  growth: "Growth",
  pro: "Pro",
};

interface AppSidebarProps {
  user: { email: string };
  usage: { used: number; limit: number };
  plan: string;
}

export function AppSidebar({ user, usage, plan }: AppSidebarProps) {
  const pathname = usePathname();
  const [pending, startTransition] = useTransition();
  const { open, close } = useSidebar();
  const initials = user.email.slice(0, 2).toUpperCase();

  const usagePct = Math.min(Math.round((usage.used / usage.limit) * 100), 100);
  const barColor =
    usagePct >= 90 ? "bg-red-500" :
    usagePct >= 70 ? "bg-amber-500" :
    "bg-primary";

  const planLabel = PLAN_LABELS[plan] ?? plan;

  return (
    <>
      {/* Mobile backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={close}
        />
      )}

      <aside className={cn(
        "flex w-[220px] shrink-0 flex-col border-r border-border bg-background",
        // Mobile: fixed drawer, slides in/out
        "fixed inset-y-0 left-0 z-50 h-full transition-transform duration-200",
        // Desktop: static in flex flow
        "md:relative md:z-auto md:translate-x-0 md:transition-none",
        // Mobile open/closed
        open ? "translate-x-0" : "-translate-x-full",
      )}>

        {/* Logo */}
        <div className="flex h-14 items-center border-b border-border px-4">
          <Link href="/" className="flex items-center" onClick={close}>
            <img
              src="/logo-white.svg"
              alt="Rendr"
              className="h-[18px] w-auto invert dark:invert-0"
            />
          </Link>
        </div>

        {/* Navigation */}
        <ScrollArea className="flex-1">
          <nav className="px-2.5 py-3 space-y-0.5">
            {navGroups.map((group, gi) => (
              <div key={gi}>
                {gi > 0 && <Separator className="my-2 opacity-50" />}
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
                      onClick={close}
                      className={cn(
                        "group relative flex items-center gap-2.5 rounded-lg px-2.5 py-[7px] text-[13px] transition-all duration-100",
                        isActive
                          ? "bg-accent text-foreground font-medium"
                          : "text-muted-foreground hover:text-foreground hover:bg-accent/60"
                      )}
                    >
                      {isActive && (
                        <span className="absolute left-0 top-1.5 bottom-1.5 w-[2.5px] rounded-full bg-primary" />
                      )}
                      <item.icon
                        className={cn(
                          "h-[15px] w-[15px] shrink-0 transition-colors",
                          isActive ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"
                        )}
                      />
                      <span className="flex-1 truncate leading-none">{item.label}</span>
                      {isExternal && (
                        <ExternalLink className="h-3 w-3 shrink-0 text-muted-foreground/40 group-hover:text-muted-foreground/70 transition-colors" />
                      )}
                    </Link>
                  );
                })}
              </div>
            ))}
          </nav>
        </ScrollArea>

        {/* Usage widget */}
        <div className="px-3 pb-2">
          <div className="rounded-xl border border-border/60 bg-muted/30 px-3 py-2.5 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Badge
                  variant="secondary"
                  className="rounded-full px-1.5 py-0 text-[9px] h-4 font-medium"
                >
                  {planLabel}
                </Badge>
              </div>
              <span className="font-mono text-[10px] text-muted-foreground">
                {usage.used}
                <span className="text-muted-foreground/40">/{usage.limit}</span>
              </span>
            </div>

            {/* Progress bar */}
            <div className="h-[3px] w-full overflow-hidden rounded-full bg-muted">
              <div
                className={cn("h-full rounded-full transition-all duration-500", barColor)}
                style={{ width: `${usagePct}%` }}
              />
            </div>

            <div className="flex items-center justify-between">
              <p className="text-[10px] text-muted-foreground/60">renders this month</p>
              {usagePct >= 70 && (
                <Link
                  href="/app/billing"
                  onClick={close}
                  className="flex items-center gap-0.5 text-[10px] text-primary hover:underline underline-offset-2"
                >
                  <Zap className="h-2.5 w-2.5" />
                  Upgrade
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* User footer */}
        <div className="border-t border-border p-2.5">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="group flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left transition-all duration-100 hover:bg-accent/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-violet-600 text-xs font-bold text-white select-none">
                  {initials}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[12px] font-semibold leading-tight">{user.email}</p>
                </div>
                <MoreVertical className="h-3.5 w-3.5 shrink-0 text-muted-foreground/50 group-hover:text-muted-foreground transition-colors" />
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent side="top" align="end" sideOffset={6} className="w-48 mb-1">
              <DropdownMenuItem asChild>
                <Link href="/app/settings" onClick={close} className="flex items-center gap-2 cursor-pointer">
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
    </>
  );
}
