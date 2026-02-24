"use client";

import { useActionState, useState, useTransition } from "react";
import { removeMemberAction, leaveTeamAction, deleteTeamAction, generateInviteAction } from "@/app/actions/teams";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
  DialogTrigger, DialogFooter, DialogDescription,
} from "@/components/ui/dialog";
import {
  Users2, Link2, Crown, Trash2, LogOut,
  Layers, Copy, Check, AlertTriangle, Wand2,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type Member = {
  id: string;
  role: string;
  joinedAt: Date;
  user: { id: string; email: string };
};

type Template = {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
};

type Team = {
  id: string;
  name: string;
  ownerId: string;
  members: Member[];
  templates: Template[];
};

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1.5 rounded-lg border border-border bg-muted px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
    >
      {copied ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
      {copied ? "Copied!" : "Copy"}
    </button>
  );
}

function InviteSection({ teamId, isOwner }: { teamId: string; isOwner: boolean }) {
  const [inviteUrl, setInviteUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  if (!isOwner) return null;

  const generate = () => {
    startTransition(async () => {
      const result = await generateInviteAction(teamId);
      if (result.error) setError(result.error);
      else setInviteUrl(result.url ?? null);
    });
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-5 space-y-3">
      <div className="flex items-center gap-2">
        <Link2 className="h-4 w-4 text-muted-foreground" />
        <h3 className="font-semibold text-sm">Invite link</h3>
      </div>
      <p className="text-xs text-muted-foreground">Generate a 7-day invite link to share with new members.</p>
      {error && (
        <div className="flex items-center gap-2 rounded-xl border border-destructive/30 bg-destructive/5 px-3 py-2 text-xs text-destructive">
          <AlertTriangle className="h-3.5 w-3.5 shrink-0" />{error}
        </div>
      )}
      {inviteUrl ? (
        <div className="flex items-center gap-2 rounded-xl border border-border bg-muted/50 px-3 py-2">
          <span className="flex-1 truncate font-mono text-xs text-muted-foreground">{inviteUrl}</span>
          <CopyButton text={inviteUrl} />
        </div>
      ) : (
        <Button size="sm" variant="outline" className="rounded-lg gap-1.5" onClick={generate} disabled={pending}>
          <Link2 className="h-3.5 w-3.5" />
          {pending ? "Generating…" : "Generate invite link"}
        </Button>
      )}
    </div>
  );
}

function RemoveMemberButton({ teamId, userId }: { teamId: string; userId: string }) {
  const [state, action, pending] = useActionState(removeMemberAction, null);
  return (
    <form action={action}>
      <input type="hidden" name="teamId" value={teamId} />
      <input type="hidden" name="userId" value={userId} />
      <button
        type="submit"
        disabled={pending}
        title="Remove member"
        className="text-xs text-muted-foreground hover:text-destructive transition-colors"
      >
        {pending ? "Removing…" : "Remove"}
      </button>
      {state?.error && <p className="text-xs text-destructive mt-1">{state.error}</p>}
    </form>
  );
}

function DangerZone({ team, isOwner }: { team: Team; isOwner: boolean }) {
  const [leaveState, leaveAction, leavePending] = useActionState(leaveTeamAction, null);
  const [deleteState, deleteAction, deletePending] = useActionState(deleteTeamAction, null);

  return (
    <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-5 space-y-3">
      <h3 className="font-semibold text-sm text-destructive">Danger zone</h3>
      <div className="flex flex-wrap gap-2">
        {!isOwner && (
          <form action={leaveAction}>
            <input type="hidden" name="teamId" value={team.id} />
            <Button type="submit" size="sm" variant="outline" disabled={leavePending} className="gap-1.5 border-destructive/30 text-destructive hover:bg-destructive/10 rounded-lg">
              <LogOut className="h-3.5 w-3.5" />
              {leavePending ? "Leaving…" : "Leave team"}
            </Button>
            {leaveState?.error && <p className="text-xs text-destructive mt-1">{leaveState.error}</p>}
          </form>
        )}
        {isOwner && (
          <form action={deleteAction}>
            <input type="hidden" name="teamId" value={team.id} />
            <Button type="submit" size="sm" variant="outline" disabled={deletePending} className="gap-1.5 border-destructive/30 text-destructive hover:bg-destructive/10 rounded-lg">
              <Trash2 className="h-3.5 w-3.5" />
              {deletePending ? "Deleting…" : "Delete team"}
            </Button>
            {deleteState?.error && <p className="text-xs text-destructive mt-1">{deleteState.error}</p>}
          </form>
        )}
      </div>
    </div>
  );
}

export function TeamClient({ team, userId, isOwner }: { team: Team; userId: string; isOwner: boolean }) {
  return (
    <div className="space-y-8">
      {/* Team dashboard header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{team.name}</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {team.members.length} member{team.members.length !== 1 ? "s" : ""}
          {" · "}
          {team.templates.length} template{team.templates.length !== 1 ? "s" : ""}
          {isOwner && " · you are the owner"}
        </p>
      </div>

      {/* Quick stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-muted-foreground">Members</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10">
              <Users2 className="h-4 w-4 text-blue-400" />
            </div>
          </div>
          <p className="text-3xl font-bold tracking-tight">{team.members.length}</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-muted-foreground">Templates</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500/10">
              <Layers className="h-4 w-4 text-violet-400" />
            </div>
          </div>
          <p className="text-3xl font-bold tracking-tight">{team.templates.length}</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-muted-foreground">Quick action</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10">
              <Wand2 className="h-4 w-4 text-emerald-400" />
            </div>
          </div>
          <Link
            href="/app/convert"
            className="text-sm font-medium text-primary hover:underline underline-offset-2"
          >
            Open Studio
          </Link>
        </div>
      </div>

      {/* Invite */}
      <InviteSection teamId={team.id} isOwner={isOwner} />

      {/* Team templates */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="px-5 py-3.5 border-b border-border bg-muted/30 flex items-center justify-between">
          <h3 className="font-semibold text-sm flex items-center gap-2">
            <Layers className="h-4 w-4 text-muted-foreground" />
            Team templates
          </h3>
          <span className="text-xs text-muted-foreground">{team.templates.length}</span>
        </div>
        {team.templates.length > 0 ? (
          <div className="divide-y divide-border">
            {team.templates.map((t) => (
              <div key={t.id} className="flex items-center justify-between px-5 py-3.5 gap-4">
                <p className="text-sm truncate">{t.name}</p>
                <Link
                  href={`/app/convert?template=${t.id}`}
                  className="text-xs text-primary hover:underline shrink-0"
                >
                  Open in Studio
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-muted/60 mb-3">
              <Layers className="h-5 w-5 text-muted-foreground/50" />
            </div>
            <p className="text-sm font-medium">No templates yet</p>
            <p className="text-xs text-muted-foreground mt-1 max-w-xs">
              Create templates in Studio and assign them to this team.
            </p>
          </div>
        )}
      </div>

      {/* Members */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="px-5 py-3.5 border-b border-border bg-muted/30">
          <h3 className="font-semibold text-sm flex items-center gap-2">
            <Users2 className="h-4 w-4 text-muted-foreground" />
            Members
          </h3>
        </div>
        <div className="divide-y divide-border">
          {team.members.map((member) => (
            <div key={member.id} className="flex items-center justify-between px-5 py-3.5 gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-violet-600 text-xs font-bold text-white select-none">
                  {member.user.email.slice(0, 2).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{member.user.email}</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    {member.role === "owner" && (
                      <span className="inline-flex items-center gap-1 text-[10px] text-amber-600 dark:text-amber-400">
                        <Crown className="h-2.5 w-2.5" /> Owner
                      </span>
                    )}
                    <span className="text-[10px] text-muted-foreground">
                      Joined {new Date(member.joinedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </span>
                  </div>
                </div>
              </div>
              {isOwner && member.user.id !== userId && (
                <RemoveMemberButton teamId={team.id} userId={member.user.id} />
              )}
              {member.user.id === userId && (
                <span className="text-xs text-muted-foreground/50">You</span>
              )}
            </div>
          ))}
        </div>
      </div>

      <DangerZone team={team} isOwner={isOwner} />
    </div>
  );
}
