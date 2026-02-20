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
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

const navItems = [
  {
    section: "Overview",
    items: [
      { href: "/app", label: "Dashboard", icon: LayoutDashboard, exact: true },
      { href: "/app/jobs", label: "Jobs", icon: BriefcaseBusiness },
      { href: "/app/usage", label: "Usage", icon: BarChart2 },
    ],
  },
  {
    section: "Configuration",
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

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-56 flex-col border-r border-border bg-background">
      {/* Logo */}
      <div className="flex h-14 items-center border-b border-border px-4">
        <Link href="/" className="flex items-center gap-2 font-semibold text-foreground">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary">
            <FileText className="h-3.5 w-3.5 text-primary-foreground" />
          </div>
          <span className="text-sm tracking-tight">Rendr</span>
        </Link>
      </div>

      {/* Nav */}
      <ScrollArea className="flex-1 px-3 py-4">
        {navItems.map((section) => (
          <div key={section.section} className="mb-5">
            <p className="mb-1 px-2 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
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
                        "flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm transition-colors",
                        isActive
                          ? "bg-primary/10 text-primary font-medium"
                          : "text-muted-foreground hover:text-foreground hover:bg-accent/60"
                      )}
                    >
                      <item.icon className="h-4 w-4 shrink-0" />
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </ScrollArea>

      {/* Footer */}
      <div className="border-t border-border p-3">
        <div className="flex items-center gap-2.5 rounded-lg px-2.5 py-2">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold">
            AK
          </div>
          <div className="min-w-0">
            <p className="truncate text-xs font-medium">Alex K.</p>
            <p className="truncate text-[11px] text-muted-foreground">Growth plan</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
