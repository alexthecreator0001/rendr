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
  Layers, Copy, Check, AlertTriangle, ChevronLeft,
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
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/app/teams" className="text-muted-foreground hover:text-foreground transition-colors">
          <ChevronLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{team.name}</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {team.members.length} member{team.members.length !== 1 ? "s" : ""}
            {isOwner && " · you are the owner"}
          </p>
        </div>
      </div>

      {/* Invite */}
      <InviteSection teamId={team.id} isOwner={isOwner} />

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

      {/* Team templates */}
      {team.templates.length > 0 && (
        <div className="rounded-2xl border border-border bg-card overflow-hidden">
          <div className="px-5 py-3.5 border-b border-border bg-muted/30 flex items-center justify-between">
            <h3 className="font-semibold text-sm flex items-center gap-2">
              <Layers className="h-4 w-4 text-muted-foreground" />
              Team templates
            </h3>
            <span className="text-xs text-muted-foreground">{team.templates.length}</span>
          </div>
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
        </div>
      )}

      <DangerZone team={team} isOwner={isOwner} />
    </div>
  );
}
