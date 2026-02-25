"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Search, ChevronLeft, ChevronRight, Shield, Trash2, CheckCircle, Ban, ShieldOff } from "lucide-react";
import { promoteUserAction, changePlanAction, deleteUserAction, banUserAction, unbanUserAction } from "../_actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";

type User = {
  id: string;
  email: string;
  plan: string;
  role: string;
  emailVerified: string | null;
  bannedAt: string | null;
  createdAt: string;
  _count: { jobs: number; apiKeys: number };
};

const PLANS = ["starter", "growth", "business"];

function UserRow({ user }: { user: User }) {
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
    <tr className={`border-b border-border hover:bg-muted/20 transition-colors ${isBanned ? "opacity-50" : ""}`}>
      <td className="px-4 py-3">
        <div>
          <p className={`text-[13px] font-medium ${isBanned ? "line-through text-muted-foreground" : ""}`}>{user.email}</p>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            {new Date(user.createdAt).toLocaleDateString()}
          </p>
        </div>
      </td>
      <td className="px-4 py-3">
        <span className="text-[12px] text-muted-foreground capitalize">{user.plan}</span>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-1">
          {user.role === "admin" ? (
            <span className="rounded-full border border-red-500/30 bg-red-500/10 px-2 py-0.5 text-[10px] font-semibold text-red-400">
              admin
            </span>
          ) : (
            <span className="text-[12px] text-muted-foreground">user</span>
          )}
          {isBanned && (
            <span className="rounded-full border border-orange-500/30 bg-orange-500/10 px-2 py-0.5 text-[10px] font-semibold text-orange-400">
              banned
            </span>
          )}
        </div>
      </td>
      <td className="px-4 py-3">
        {user.emailVerified ? (
          <CheckCircle className="h-3.5 w-3.5 text-emerald-400" />
        ) : (
          <span className="text-[11px] text-muted-foreground/50">—</span>
        )}
      </td>
      <td className="px-4 py-3 text-[12px] text-muted-foreground">{user._count.jobs}</td>
      <td className="px-4 py-3 text-[12px] text-muted-foreground">{user._count.apiKeys}</td>
      <td className="px-4 py-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
              <MoreVertical className="h-3.5 w-3.5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44">
            {/* Role */}
            {user.role !== "admin" ? (
              <DropdownMenuItem
                onSelect={() => submit(promoteUserAction, { role: "admin" })}
                className="gap-2"
              >
                <Shield className="h-3.5 w-3.5 text-red-400" />
                Make admin
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem
                onSelect={() => submit(promoteUserAction, { role: "user" })}
                className="gap-2"
              >
                <ShieldOff className="h-3.5 w-3.5" />
                Remove admin
              </DropdownMenuItem>
            )}

            <DropdownMenuSeparator />

            {/* Plans */}
            {PLANS.filter((p) => p !== user.plan).map((p) => (
              <DropdownMenuItem
                key={p}
                onSelect={() => submit(changePlanAction, { plan: p })}
                className="capitalize"
              >
                Set plan: {p}
              </DropdownMenuItem>
            ))}

            <DropdownMenuSeparator />

            {/* Ban / Unban */}
            {isBanned ? (
              <DropdownMenuItem
                onSelect={() => submit(unbanUserAction, {})}
                className="gap-2"
              >
                <Ban className="h-3.5 w-3.5 text-emerald-400" />
                Unban user
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem
                onSelect={() => {
                  if (!confirm(`Ban ${user.email}? They will lose access.`)) return;
                  submit(banUserAction, {});
                }}
                className="gap-2 text-orange-400 focus:text-orange-400"
              >
                <Ban className="h-3.5 w-3.5" />
                Ban user
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
              <Trash2 className="h-3.5 w-3.5" />
              Delete user
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </td>
    </tr>
  );
}

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

  function search(q: string) {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    router.push(`/admin/users?${params.toString()}`);
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Users</h1>
          <p className="text-sm text-muted-foreground mt-1">{total.toLocaleString()} total</p>
        </div>
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="Search email…"
            defaultValue={query}
            className="pl-8 h-8 text-[13px]"
            onKeyDown={(e) => {
              if (e.key === "Enter") search((e.target as HTMLInputElement).value);
            }}
          />
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Email</th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Plan</th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Role</th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Verified</th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Jobs</th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Keys</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-sm text-muted-foreground">
                  No users found.
                </td>
              </tr>
            ) : (
              users.map((u) => <UserRow key={u.id} user={u} />)
            )}
          </tbody>
        </table>
      </div>

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
