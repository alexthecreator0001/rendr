"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTransition } from "react";
import {
  LayoutDashboard, Key, Layers, Webhook, BarChart2,
  CreditCard, BookOpen, Wand2, BriefcaseBusiness,
  Settings, LogOut, MoreVertical, ExternalLink,
  Zap, ShieldCheck, Users, BarChart3, Headphones,
  Lightbulb, MessageSquare, Users2, Bell, FileText,
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
    { href: "/app/teams",     label: "Teams",      icon: Users2 },
  ],
  [
    { href: "/app/support",   label: "Support",         icon: Headphones },
    { href: "/app/features",  label: "Feature Requests", icon: Lightbulb },
  ],
  [
    { href: "/docs",         label: "Documentation",  icon: BookOpen, external: true },
  ],
] as const;

const adminNavItems = [
  { href: "/admin",                   label: "Overview",       icon: BarChart3, exact: true },
  { href: "/admin/users",             label: "Users",          icon: Users },
  { href: "/admin/subscriptions",     label: "Subscriptions",  icon: CreditCard },
  { href: "/admin/jobs",              label: "Jobs",           icon: BriefcaseBusiness },
  { href: "/admin/support",           label: "Support",        icon: MessageSquare },
  { href: "/admin/features",          label: "Features",       icon: Lightbulb },
  { href: "/admin/notifications",     label: "Notifications",  icon: Bell },
  { href: "/admin/templates",         label: "Templates",      icon: Layers },
  { href: "/admin/blog",              label: "Blog",           icon: FileText },
] as const;

const PLAN_LABELS: Record<string, string> = {
  starter:  "Starter",
  growth:   "Growth",
  business: "Business",
};

interface AppSidebarProps {
  user: { email: string };
  usage: { used: number; limit: number };
  plan: string;
  role?: string;
}

export function AppSidebar({ user, usage, plan, role }: AppSidebarProps) {
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
  const isAdmin = role === "admin";
  const onAdminSection = pathname.startsWith("/admin");

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
        "fixed inset-y-0 left-0 z-50 h-full transition-transform duration-200",
        "md:relative md:z-auto md:translate-x-0 md:transition-none",
        open ? "translate-x-0" : "-translate-x-full",
      )}>

        {/* Logo */}
        <div className="flex h-14 items-center border-b border-border px-4">
          <Link href="/" className="flex items-center" onClick={close}>
            <img
              src="/logo.svg"
              alt="Rendr"
              className="h-[17px] w-auto invert dark:invert-0"
            />
          </Link>
        </div>

        {/* Navigation */}
        <ScrollArea className="flex-1">
          <nav className="px-2.5 py-3 space-y-0.5">

            {/* Regular app nav — hidden when in admin section */}
            {!onAdminSection && navGroups.map((group, gi) => (
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

            {/* Admin section */}
            {isAdmin && (
              <>
                <Separator className="my-2 opacity-50" />

                {onAdminSection ? (
                  /* Expanded admin nav when on admin pages */
                  <div>
                    <div className="flex items-center gap-1.5 px-2.5 pb-1 pt-0.5">
                      <ShieldCheck className="h-3 w-3 text-red-400" />
                      <span className="text-[10px] font-semibold uppercase tracking-widest text-red-400/80">
                        Admin
                      </span>
                    </div>
                    {adminNavItems.map((item) => {
                      const isActive = (item as { exact?: boolean }).exact
                        ? pathname === item.href
                        : pathname.startsWith(item.href);
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={close}
                          className={cn(
                            "group relative flex items-center gap-2.5 rounded-lg px-2.5 py-[7px] text-[13px] transition-all duration-100",
                            isActive
                              ? "bg-red-500/10 text-red-400 font-medium"
                              : "text-muted-foreground hover:text-red-400 hover:bg-red-500/8"
                          )}
                        >
                          {isActive && (
                            <span className="absolute left-0 top-1.5 bottom-1.5 w-[2.5px] rounded-full bg-red-500" />
                          )}
                          <item.icon className={cn(
                            "h-[15px] w-[15px] shrink-0 transition-colors",
                            isActive ? "text-red-400" : "text-muted-foreground group-hover:text-red-400"
                          )} />
                          <span className="flex-1 truncate leading-none">{item.label}</span>
                        </Link>
                      );
                    })}
                    <Separator className="my-2 opacity-50" />
                    <Link
                      href="/app"
                      onClick={close}
                      className="group flex items-center gap-2.5 rounded-lg px-2.5 py-[7px] text-[13px] text-muted-foreground hover:text-foreground hover:bg-accent/60 transition-all duration-100"
                    >
                      <LayoutDashboard className="h-[15px] w-[15px] shrink-0 text-muted-foreground group-hover:text-foreground" />
                      <span className="flex-1 truncate leading-none">Back to App</span>
                    </Link>
                  </div>
                ) : (
                  /* Collapsed admin link when on app pages */
                  <Link
                    href="/admin"
                    onClick={close}
                    className="group relative flex items-center gap-2.5 rounded-lg px-2.5 py-[7px] text-[13px] text-muted-foreground hover:text-red-400 hover:bg-red-500/8 transition-all duration-100"
                  >
                    <ShieldCheck className="h-[15px] w-[15px] shrink-0 text-muted-foreground group-hover:text-red-400 transition-colors" />
                    <span className="flex-1 truncate leading-none">Admin</span>
                  </Link>
                )}
              </>
            )}
          </nav>
        </ScrollArea>

        {/* Usage + plan — flat, no card */}
        {!onAdminSection && (
          <div className="px-3.5 pt-2 pb-1.5 border-t border-border/50">
            {/* Plan row */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <span className={cn(
                  "h-1.5 w-1.5 rounded-full shrink-0",
                  plan === "business" ? "bg-violet-500" :
                  plan === "growth"   ? "bg-blue-500"   :
                  "bg-muted-foreground/40"
                )} />
                <span className="text-[12px] font-medium text-foreground leading-none">
                  {planLabel}
                </span>
              </div>
              {plan === "starter" && (
                <Link
                  href="/app/billing"
                  onClick={close}
                  className="text-[11px] text-primary hover:underline underline-offset-2 leading-none"
                >
                  Upgrade
                </Link>
              )}
            </div>

            {/* Usage numbers */}
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] text-muted-foreground leading-none">
                <span className="tabular-nums font-semibold text-foreground">{usage.used.toLocaleString()}</span>
                {" / "}{usage.limit.toLocaleString()} renders
              </span>
              <span className={cn(
                "text-[10px] tabular-nums font-medium leading-none",
                usagePct >= 90 ? "text-red-500" :
                usagePct >= 70 ? "text-amber-500" :
                "text-muted-foreground/50"
              )}>{usagePct}%</span>
            </div>

            {/* Progress bar */}
            <div className="h-[3px] w-full overflow-hidden rounded-full bg-muted">
              <div
                className={cn("h-full rounded-full transition-all duration-500", barColor)}
                style={{ width: `${usagePct}%` }}
              />
            </div>

            {/* Upgrade nudge */}
            {usagePct >= 70 && (
              <Link
                href="/app/billing"
                onClick={close}
                className="mt-2 flex items-center gap-1 text-[10px] text-amber-500 hover:text-amber-600 transition-colors"
              >
                <Zap className="h-3 w-3 shrink-0" />
                {usagePct >= 90 ? "Almost at limit — upgrade" : "Upgrade for more renders"}
              </Link>
            )}
          </div>
        )}

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
              <DropdownMenuItem asChild>
                <Link href="/app/billing" onClick={close} className="flex items-center gap-2 cursor-pointer">
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                  Billing
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
