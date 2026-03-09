"use client";

import { useRouter } from "next/navigation";
import { useTransition, useState } from "react";
import {
  Search, ChevronLeft, ChevronRight, Shield, Trash2,
  CheckCircle, Ban, ShieldOff, MoreVertical, Mail, Globe,
  Filter, X,
} from "lucide-react";
import { promoteUserAction, changePlanAction, deleteUserAction, banUserAction, unbanUserAction } from "../_actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type User = {
  id: string;
  email: string;
  plan: string;
  role: string;
  emailVerified: string | null;
  bannedAt: string | null;
  createdAt: string;
  googleId: string | null;
  _count: { jobs: number; apiKeys: number };
};

const PLANS = ["starter", "growth", "business"];

const PLAN_COLORS: Record<string, string> = {
  starter: "text-zinc-400 border-zinc-500/20 bg-zinc-500/10",
  growth: "text-violet-400 border-violet-500/20 bg-violet-500/10",
  business: "text-blue-400 border-blue-500/20 bg-blue-500/10",
};

// Known email providers with their display config
const EMAIL_PROVIDERS: Record<string, { label: string; color: string }> = {
  "gmail.com": { label: "Gmail", color: "text-red-400 bg-red-500/10 border-red-500/20" },
  "googlemail.com": { label: "Gmail", color: "text-red-400 bg-red-500/10 border-red-500/20" },
  "outlook.com": { label: "Outlook", color: "text-blue-400 bg-blue-500/10 border-blue-500/20" },
  "hotmail.com": { label: "Outlook", color: "text-blue-400 bg-blue-500/10 border-blue-500/20" },
  "live.com": { label: "Outlook", color: "text-blue-400 bg-blue-500/10 border-blue-500/20" },
  "yahoo.com": { label: "Yahoo", color: "text-purple-400 bg-purple-500/10 border-purple-500/20" },
  "icloud.com": { label: "iCloud", color: "text-sky-400 bg-sky-500/10 border-sky-500/20" },
  "protonmail.com": { label: "Proton", color: "text-violet-400 bg-violet-500/10 border-violet-500/20" },
  "proton.me": { label: "Proton", color: "text-violet-400 bg-violet-500/10 border-violet-500/20" },
};

function getEmailProvider(email: string) {
  const domain = email.split("@")[1]?.toLowerCase() ?? "";
  const known = EMAIL_PROVIDERS[domain];
  if (known) return { ...known, domain };
  return { label: domain, color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20", domain };
}

function EmailProviderBadge({ email }: { email: string }) {
  const provider = getEmailProvider(email);
  const Icon = EMAIL_PROVIDERS[provider.domain] ? Mail : Globe;
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium ${provider.color}`}>
      <Icon className="h-2.5 w-2.5" />
      {provider.label}
    </span>
  );
}

function AuthMethodBadge({ user }: { user: User }) {
  if (user.googleId) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-blue-500/20 bg-blue-500/10 px-2 py-0.5 text-[10px] font-medium text-blue-400">
        <svg className="h-2.5 w-2.5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
        </svg>
        Google
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-zinc-500/20 bg-zinc-500/10 px-2 py-0.5 text-[10px] font-medium text-zinc-400">
      <Mail className="h-2.5 w-2.5" />
      Email
    </span>
  );
}

function PlanBadge({ plan }: { plan: string }) {
  return (
    <span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold capitalize ${PLAN_COLORS[plan] ?? PLAN_COLORS.starter}`}>
      {plan}
    </span>
  );
}

function UserActions({ user }: { user: User }) {
  const router = useRouter();
  const [, startTransition] = useTransition();

  function submit(action: (a: unknown, fd: FormData) => Promise<unknown>, extra: Record<string, string>) {
    startTransition(async () => {
      const fd = new FormData();
      fd.set("userId", user.id);
      for (const [k, v] of Object.entries(extra)) fd.set(k, v);
      await action(null, fd);
      router.refresh();
    });
  }

  const isBanned = !!user.bannedAt;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
          <MoreVertical className="h-3.5 w-3.5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        {user.role !== "admin" ? (
          <DropdownMenuItem onSelect={() => submit(promoteUserAction, { role: "admin" })} className="gap-2">
            <Shield className="h-3.5 w-3.5 text-red-400" /> Make admin
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem onSelect={() => submit(promoteUserAction, { role: "user" })} className="gap-2">
            <ShieldOff className="h-3.5 w-3.5" /> Remove admin
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        {PLANS.filter((p) => p !== user.plan).map((p) => (
          <DropdownMenuItem key={p} onSelect={() => submit(changePlanAction, { plan: p })} className="capitalize">
            Set plan: {p}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        {isBanned ? (
          <DropdownMenuItem onSelect={() => submit(unbanUserAction, {})} className="gap-2">
            <Ban className="h-3.5 w-3.5 text-emerald-400" /> Unban user
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem
            onSelect={() => {
              if (!confirm(`Ban ${user.email}? They will lose access.`)) return;
              submit(banUserAction, {});
            }}
            className="gap-2 text-orange-400 focus:text-orange-400"
          >
            <Ban className="h-3.5 w-3.5" /> Ban user
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onSelect={() => {
            if (!confirm(`Delete ${user.email}? This cannot be undone.`)) return;
            submit(deleteUserAction, {});
          }}
          className="gap-2 text-destructive focus:text-destructive"
        >
          <Trash2 className="h-3.5 w-3.5" /> Delete user
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// ─── Desktop table row ────────────────────────────────────────────────────────
function UserRow({ user }: { user: User }) {
  const isBanned = !!user.bannedAt;
  return (
    <tr className={`border-b border-border hover:bg-muted/20 transition-colors ${isBanned ? "opacity-50" : ""}`}>
      <td className="px-4 py-3">
        <div>
          <p className={`text-[13px] font-medium ${isBanned ? "line-through text-muted-foreground" : ""}`}>{user.email}</p>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <span className="text-[11px] text-muted-foreground">{new Date(user.createdAt).toLocaleDateString()}</span>
            <EmailProviderBadge email={user.email} />
            <AuthMethodBadge user={user} />
          </div>
        </div>
      </td>
      <td className="px-4 py-3"><PlanBadge plan={user.plan} /></td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-1">
          {user.role === "admin" ? (
            <span className="rounded-full border border-red-500/30 bg-red-500/10 px-2 py-0.5 text-[10px] font-semibold text-red-400">admin</span>
          ) : (
            <span className="text-[12px] text-muted-foreground">user</span>
          )}
          {isBanned && (
            <span className="rounded-full border border-orange-500/30 bg-orange-500/10 px-2 py-0.5 text-[10px] font-semibold text-orange-400">banned</span>
          )}
        </div>
      </td>
      <td className="px-4 py-3 hidden sm:table-cell">
        {user.emailVerified ? (
          <CheckCircle className="h-3.5 w-3.5 text-emerald-400" />
        ) : (
          <span className="text-[11px] text-muted-foreground/50">—</span>
        )}
      </td>
      <td className="px-4 py-3 text-[12px] text-muted-foreground tabular-nums hidden sm:table-cell">{user._count.jobs}</td>
      <td className="px-4 py-3 text-[12px] text-muted-foreground tabular-nums hidden md:table-cell">{user._count.apiKeys}</td>
      <td className="px-4 py-3"><UserActions user={user} /></td>
    </tr>
  );
}

// ─── Mobile card ──────────────────────────────────────────────────────────────
function UserCard({ user }: { user: User }) {
  const isBanned = !!user.bannedAt;
  return (
    <div className={`rounded-xl border border-border bg-card p-4 space-y-3 ${isBanned ? "opacity-50" : ""}`}>
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className={`text-[13px] font-medium truncate ${isBanned ? "line-through text-muted-foreground" : ""}`}>
            {user.email}
          </p>
          <span className="text-[11px] text-muted-foreground">{new Date(user.createdAt).toLocaleDateString()}</span>
        </div>
        <UserActions user={user} />
      </div>

      <div className="flex items-center gap-1.5 flex-wrap">
        <PlanBadge plan={user.plan} />
        <AuthMethodBadge user={user} />
        <EmailProviderBadge email={user.email} />
        {user.role === "admin" && (
          <span className="rounded-full border border-red-500/30 bg-red-500/10 px-2 py-0.5 text-[10px] font-semibold text-red-400">admin</span>
        )}
        {isBanned && (
          <span className="rounded-full border border-orange-500/30 bg-orange-500/10 px-2 py-0.5 text-[10px] font-semibold text-orange-400">banned</span>
        )}
        {user.emailVerified && (
          <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-400">
            <CheckCircle className="h-2.5 w-2.5" /> verified
          </span>
        )}
      </div>

      <div className="flex gap-4 text-[12px] text-muted-foreground">
        <span><strong className="text-foreground tabular-nums">{user._count.jobs}</strong> jobs</span>
        <span><strong className="text-foreground tabular-nums">{user._count.apiKeys}</strong> keys</span>
      </div>
    </div>
  );
}

// ─── Provider filter ──────────────────────────────────────────────────────────
const PROVIDER_FILTERS = [
  { key: "all", label: "All" },
  { key: "google", label: "Google login" },
  { key: "email", label: "Email login" },
  { key: "gmail", label: "Gmail", domains: ["gmail.com", "googlemail.com"] },
  { key: "outlook", label: "Outlook", domains: ["outlook.com", "hotmail.com", "live.com"] },
  { key: "custom", label: "Custom domain" },
];

const KNOWN_DOMAINS = new Set([
  "gmail.com", "googlemail.com", "outlook.com", "hotmail.com", "live.com",
  "yahoo.com", "icloud.com", "protonmail.com", "proton.me",
]);

export function AdminUsersClient({
  users, total, page, pageSize, query,
}: {
  users: User[];
  total: number;
  page: number;
  pageSize: number;
  query: string;
}) {
  const router = useRouter();
  const totalPages = Math.ceil(total / pageSize);
  const [providerFilter, setProviderFilter] = useState("all");

  function search(q: string) {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    router.push(`/admin/users?${params.toString()}`);
  }

  // Client-side filtering
  const filteredUsers = providerFilter === "all"
    ? users
    : users.filter((u) => {
        if (providerFilter === "google") return !!u.googleId;
        if (providerFilter === "email") return !u.googleId;
        const domain = u.email.split("@")[1]?.toLowerCase() ?? "";
        const filter = PROVIDER_FILTERS.find((f) => f.key === providerFilter);
        if (!filter) return true;
        if (filter.key === "custom") return !KNOWN_DOMAINS.has(domain);
        return filter.domains?.includes(domain) ?? true;
      });

  // Stats for current page
  const googleCount = users.filter((u) => u.googleId).length;
  const emailCount = users.length - googleCount;
  const domainCounts: Record<string, number> = {};
  for (const u of users) {
    const provider = getEmailProvider(u.email);
    domainCounts[provider.label] = (domainCounts[provider.label] ?? 0) + 1;
  }
  const topDomains = Object.entries(domainCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Users</h1>
          <p className="text-sm text-muted-foreground mt-1">{total.toLocaleString()} total</p>
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="Search email..."
            defaultValue={query}
            className="pl-8 h-8 text-[13px]"
            onKeyDown={(e) => {
              if (e.key === "Enter") search((e.target as HTMLInputElement).value);
            }}
          />
        </div>
      </div>

      {/* Stats bar */}
      <div className="flex items-center gap-2 flex-wrap text-[11px] text-muted-foreground">
        <span className="font-medium text-muted-foreground/60 uppercase tracking-wider mr-1">This page:</span>
        <span className="inline-flex items-center gap-1 rounded-md bg-blue-500/10 px-2 py-0.5 text-blue-400">
          Google <strong>{googleCount}</strong>
        </span>
        <span className="inline-flex items-center gap-1 rounded-md bg-zinc-500/10 px-2 py-0.5 text-zinc-400">
          Email <strong>{emailCount}</strong>
        </span>
        <span className="text-muted-foreground/30 mx-1">|</span>
        {topDomains.map(([label, count]) => (
          <span key={label} className="inline-flex items-center gap-1 rounded-md bg-muted/30 px-2 py-0.5">
            {label} <strong className="text-foreground">{count}</strong>
          </span>
        ))}
      </div>

      {/* Provider filter */}
      <div className="flex gap-2 flex-wrap items-center">
        <Filter className="h-3.5 w-3.5 text-muted-foreground/50" />
        {PROVIDER_FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setProviderFilter(f.key)}
            className={`rounded-lg px-3 py-1.5 text-[12px] font-medium transition-colors ${
              providerFilter === f.key
                ? "bg-foreground text-background"
                : "border border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            {f.label}
            {providerFilter === f.key && f.key !== "all" && (
              <X className="inline h-3 w-3 ml-1 -mr-0.5" onClick={(e) => { e.stopPropagation(); setProviderFilter("all"); }} />
            )}
          </button>
        ))}
      </div>

      {/* Desktop table (hidden on mobile) */}
      <div className="hidden md:block rounded-xl border border-border bg-card overflow-x-auto">
        <table className="w-full text-sm min-w-[600px]">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Email</th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Plan</th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Role</th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground hidden sm:table-cell">Verified</th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground hidden sm:table-cell">Jobs</th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground hidden md:table-cell">Keys</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-sm text-muted-foreground">
                  No users found.
                </td>
              </tr>
            ) : (
              filteredUsers.map((u) => <UserRow key={u.id} user={u} />)
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile cards (hidden on desktop) */}
      <div className="md:hidden space-y-3">
        {filteredUsers.length === 0 ? (
          <div className="text-center py-12 text-sm text-muted-foreground">No users found.</div>
        ) : (
          filteredUsers.map((u) => <UserCard key={u.id} user={u} />)
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline" size="sm"
              disabled={page <= 1}
              onClick={() => router.push(`/admin/users?page=${page - 1}${query ? `&q=${query}` : ""}`)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline" size="sm"
              disabled={page >= totalPages}
              onClick={() => router.push(`/admin/users?page=${page + 1}${query ? `&q=${query}` : ""}`)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
