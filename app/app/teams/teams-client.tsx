"use client";

import { useActionState, useState } from "react";
import { createTeamAction } from "@/app/actions/teams";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
  DialogTrigger, DialogFooter, DialogDescription,
} from "@/components/ui/dialog";
import { Users2, Plus, Crown, ChevronRight, AlertTriangle } from "lucide-react";
import Link from "next/link";

type Team = {
  id: string;
  name: string;
  createdAt: Date;
  _count: { members: number };
};

function CreateTeamDialog() {
  const [open, setOpen] = useState(false);
  const [state, action, pending] = useActionState(createTeamAction, null);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-1.5 rounded-lg">
          <Plus className="h-4 w-4" /> New team
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle>Create a team</DialogTitle>
          <DialogDescription>Teams let you share templates with collaborators.</DialogDescription>
        </DialogHeader>
        <form action={action} className="space-y-4 pt-1">
          {state?.error && (
            <div className="flex items-center gap-2 rounded-xl border border-destructive/30 bg-destructive/5 px-3.5 py-2.5 text-sm text-destructive">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              {state.error}
            </div>
          )}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Team name</Label>
            <Input name="name" placeholder="Acme Design Team" required className="rounded-xl" />
          </div>
          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="rounded-lg">Cancel</Button>
            <Button type="submit" disabled={pending} className="rounded-lg">
              {pending ? "Creating…" : "Create team"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function TeamRow({ team, badge }: { team: Team; badge?: React.ReactNode }) {
  return (
    <Link
      href={`/app/teams/${team.id}`}
      className="group flex items-center gap-4 rounded-2xl border border-border bg-card p-4 transition-all hover:border-primary/40 hover:shadow-sm"
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-500/10 text-violet-600 dark:text-violet-400">
        <Users2 className="h-5 w-5" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="font-semibold text-sm truncate">{team.name}</p>
          {badge}
        </div>
        <p className="text-xs text-muted-foreground mt-0.5">
          {team._count.members} member{team._count.members !== 1 ? "s" : ""}
        </p>
      </div>
      <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
    </Link>
  );
}

export function TeamsClient({ ownedTeams, memberTeams }: { ownedTeams: Team[]; memberTeams: Team[] }) {
  const hasAny = ownedTeams.length > 0 || memberTeams.length > 0;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Teams</h1>
          <p className="mt-1 text-sm text-muted-foreground">Share templates across your organization.</p>
        </div>
        <CreateTeamDialog />
      </div>

      {!hasAny && (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-muted/50">
            <Users2 className="h-8 w-8 text-muted-foreground/25" />
          </div>
          <p className="text-[15px] font-semibold">No teams yet</p>
          <p className="mt-1.5 max-w-[280px] text-[13px] text-muted-foreground leading-relaxed">
            Create a team to share templates with your colleagues.
          </p>
          <div className="mt-6">
            <CreateTeamDialog />
          </div>
        </div>
      )}

      {ownedTeams.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Your teams</h2>
          {ownedTeams.map((team) => (
            <TeamRow
              key={team.id}
              team={team}
              badge={
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-medium text-amber-600 dark:text-amber-400">
                  <Crown className="h-2.5 w-2.5" /> Owner
                </span>
              }
            />
          ))}
        </div>
      )}

      {memberTeams.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Member of</h2>
          {memberTeams.map((team) => (
            <TeamRow key={team.id} team={team} />
          ))}
        </div>
      )}
    </div>
  );
}
