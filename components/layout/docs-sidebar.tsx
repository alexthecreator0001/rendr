"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

interface NavItem {
  title: string;
  href?: string;
  items?: NavItem[];
  badge?: string;
}

const docsNav: NavItem[] = [
  {
    title: "Getting started",
    items: [
      { title: "Overview", href: "/docs" },
      { title: "Quick start", href: "/docs/quick-start", badge: "5 min" },
    ],
  },
  {
    title: "API Reference",
    items: [
      { title: "Authentication", href: "/docs/api" },
      { title: "Render job", href: "/docs/api#render-job" },
      { title: "Job status", href: "/docs/api#job-status" },
      { title: "Templates", href: "/docs/templates" },
      { title: "Webhooks", href: "/docs/api#webhooks" },
      { title: "Error codes", href: "/docs/api#errors" },
    ],
  },
  {
    title: "Guides",
    items: [
      { title: "Using templates", href: "/docs/templates" },
      { title: "Custom fonts", href: "/docs/templates#fonts" },
      { title: "Async jobs", href: "/docs/api#async" },
      { title: "Signed URLs", href: "/docs/api#signed-urls" },
      { title: "Integrations", href: "/docs/integrations", badge: "New" },
    ],
  },
  {
    title: "Resources",
    items: [
      { title: "SDKs", href: "/docs/api#sdks" },
      { title: "Rate limits", href: "/docs/api#rate-limits" },
    ],
  },
];

function NavGroup({ group }: { group: NavItem }) {
  const pathname = usePathname();
  const isActive = group.items?.some((item) => item.href && pathname.startsWith(item.href.split("#")[0]));
  const [open, setOpen] = useState(isActive ?? true);

  return (
    <div className="mb-5">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between px-1 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground/60 hover:text-muted-foreground transition-colors"
      >
        {group.title}
        <ChevronDown className={cn("h-3 w-3 transition-transform duration-200", open && "rotate-180")} />
      </button>
      {open && (
        <ul className="mt-1 space-y-0.5">
          {group.items?.map((item) => (
            <li key={`${item.href}-${item.title}`}>
              <NavLink href={item.href!} label={item.title} badge={item.badge} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function NavLink({ href, label, badge }: { href: string; label: string; badge?: string }) {
  const pathname = usePathname();
  const isActive = pathname === href || pathname === href.split("#")[0];

  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-2 rounded-lg py-1.5 pl-2.5 pr-2 text-sm transition-colors duration-150",
        isActive
          ? "bg-primary/8 text-primary font-medium"
          : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
      )}
    >
      <span className="flex-1">{label}</span>
      {badge && (
        <span className="rounded-full bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground font-medium">
          {badge}
        </span>
      )}
    </Link>
  );
}

export function DocsSidebar() {
  return (
    <nav className="py-5">
      {docsNav.map((group) => (
        <NavGroup key={group.title} group={group} />
      ))}
    </nav>
  );
}
