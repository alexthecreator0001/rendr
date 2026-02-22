"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTransition } from "react";
import {
  LayoutDashboard, Users, BriefcaseBusiness, Settings,
  LogOut, ChevronLeft, Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { signOutAction } from "@/app/actions/auth";

const NAV = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/jobs", label: "Jobs", icon: BriefcaseBusiness },
];

export function AdminSidebar({ email }: { email: string }) {
  const pathname = usePathname();
  const [pending, startTransition] = useTransition();

  return (
    <aside className="flex w-[200px] shrink-0 flex-col border-r border-border bg-background">
      {/* Header */}
      <div className="flex h-14 items-center gap-2.5 border-b border-border px-4">
        <div className="flex h-6 w-6 items-center justify-center rounded-md bg-red-500/15 ring-1 ring-red-500/30">
          <Shield className="h-3.5 w-3.5 text-red-400" />
        </div>
        <span className="text-[13px] font-semibold text-foreground">Admin</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2.5 py-3 space-y-0.5">
        {NAV.map((item) => {
          const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group relative flex items-center gap-2.5 rounded-lg px-2.5 py-[7px] text-[13px] transition-all duration-100",
                isActive
                  ? "bg-accent text-foreground font-medium"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent/60"
              )}
            >
              {isActive && (
                <span className="absolute left-0 top-1.5 bottom-1.5 w-[2.5px] rounded-full bg-red-500" />
              )}
              <item.icon className={cn("h-[15px] w-[15px] shrink-0", isActive ? "text-foreground" : "text-muted-foreground")} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-border p-2.5 space-y-1">
        <Link
          href="/app"
          className="flex items-center gap-2.5 rounded-lg px-2.5 py-[7px] text-[13px] text-muted-foreground transition-all hover:text-foreground hover:bg-accent/60"
        >
          <ChevronLeft className="h-[15px] w-[15px]" />
          Back to app
        </Link>
        <button
          onClick={() => startTransition(() => signOutAction())}
          disabled={pending}
          className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-[7px] text-[13px] text-muted-foreground transition-all hover:text-destructive hover:bg-destructive/10"
        >
          <LogOut className="h-[15px] w-[15px]" />
          {pending ? "Signing out…" : "Sign out"}
        </button>
        <p className="px-2.5 pt-1 text-[11px] text-muted-foreground/50 truncate">{email}</p>
      </div>
    </aside>
  );
}
