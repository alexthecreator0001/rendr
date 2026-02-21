"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Key,
  Layers,
  Webhook,
  BarChart2,
  CreditCard,
  BriefcaseBusiness,
  ChevronRight,
  FileOutput,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

const navItems = [
  {
    section: "Workspace",
    items: [
      { href: "/app", label: "Overview", icon: LayoutDashboard, exact: true },
      { href: "/app/convert", label: "Convert", icon: FileOutput },
      { href: "/app/jobs", label: "Jobs", icon: BriefcaseBusiness },
      { href: "/app/usage", label: "Usage", icon: BarChart2 },
    ],
  },
  {
    section: "Configure",
    items: [
      { href: "/app/api-keys", label: "API Keys", icon: Key },
      { href: "/app/templates", label: "Templates", icon: Layers },
      { href: "/app/webhooks", label: "Webhooks", icon: Webhook },
    ],
  },
  {
    section: "Account",
    items: [
      { href: "/app/billing", label: "Billing", icon: CreditCard },
    ],
  },
];

interface AppSidebarProps {
  user: { email: string };
}

export function AppSidebar({ user }: AppSidebarProps) {
  const pathname = usePathname();
  const initials = user.email.slice(0, 2).toUpperCase();
  const workspaceName = user.email.split("@")[0];

  return (
    <aside className="flex h-full w-56 flex-col border-r border-border bg-background">
      {/* Logo */}
      <div className="flex h-14 items-center border-b border-border px-5">
        <Link href="/">
          <img src="/logo.svg" alt="Rendr" className="h-4 w-auto dark:invert" />
        </Link>
      </div>

      {/* Workspace selector */}
      <div className="border-b border-border px-3 py-2.5">
        <div className="flex items-center gap-2.5 rounded-lg px-2.5 py-2">
          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-primary/10 text-[11px] font-bold text-primary">
            {initials.charAt(0)}
          </div>
          <span className="flex-1 truncate text-left font-medium text-sm">{workspaceName}</span>
        </div>
      </div>

      {/* Nav */}
      <ScrollArea className="flex-1 px-3 py-3">
        {navItems.map((section) => (
          <div key={section.section} className="mb-5">
            <p className="mb-1.5 px-2.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground/60">
              {section.section}
            </p>
            <ul className="space-y-0.5">
              {section.items.map((item) => {
                const isActive = item.exact
                  ? pathname === item.href
                  : pathname.startsWith(item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm transition-all duration-150",
                        isActive
                          ? "bg-primary/8 text-primary font-medium"
                          : "text-muted-foreground hover:text-foreground hover:bg-accent/60"
                      )}
                    >
                      <item.icon className={cn("h-4 w-4 shrink-0", isActive ? "text-primary" : "text-muted-foreground")} />
                      <span className="flex-1">{item.label}</span>
                      {(item as any).badge && (
                        <Badge variant="secondary" className="rounded-full px-1.5 py-0 text-[10px] h-4">
                          {(item as any).badge}
                        </Badge>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </ScrollArea>

      {/* User */}
      <div className="border-t border-border p-3">
        <div className="flex items-center gap-2.5 rounded-lg px-2.5 py-2">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-violet-600 text-xs font-semibold text-white">
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-semibold">{user.email}</p>
            <p className="truncate text-[11px] text-muted-foreground">Starter plan</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
