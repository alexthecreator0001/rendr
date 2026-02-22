import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { acceptInviteAction } from "@/app/actions/teams";
import Link from "next/link";
import { Users2, CheckCircle2, AlertCircle } from "lucide-react";

export default async function InvitePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const session = await auth();

  // Not logged in — redirect to login with callback
  if (!session?.user?.id) {
    redirect(`/login?callbackUrl=/invite/${token}`);
  }

  // Validate invite
  const invite = await prisma.teamInvite.findUnique({
    where: { token },
    include: { team: { select: { id: true, name: true } } },
  });

  let errorMessage: string | null = null;
  let teamId: string | null = null;

  if (!invite) {
    errorMessage = "This invite link is invalid or has been revoked.";
  } else if (invite.usedAt) {
    errorMessage = "This invite link has already been used.";
  } else if (invite.expiresAt < new Date()) {
    errorMessage = "This invite link has expired.";
  } else {
    // Accept the invite
    const result = await acceptInviteAction(token);
    if (result.error) {
      errorMessage = result.error;
    } else {
      teamId = result.teamId ?? null;
    }
  }

  if (teamId) {
    redirect(`/app/teams/${teamId}`);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="max-w-md w-full rounded-2xl border border-border bg-card p-8 text-center space-y-4">
        {errorMessage ? (
          <>
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10 mx-auto">
              <AlertCircle className="h-7 w-7 text-destructive" />
            </div>
            <h1 className="text-xl font-bold">Invalid invite</h1>
            <p className="text-sm text-muted-foreground">{errorMessage}</p>
            <Link href="/app/teams" className="inline-block text-sm text-primary hover:underline">
              Back to teams
            </Link>
          </>
        ) : (
          <>
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-500/10 mx-auto">
              <CheckCircle2 className="h-7 w-7 text-green-500" />
            </div>
            <h1 className="text-xl font-bold">You&apos;re in!</h1>
            <p className="text-sm text-muted-foreground">Redirecting to your team…</p>
          </>
        )}
      </div>
    </div>
  );
}
