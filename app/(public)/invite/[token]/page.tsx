import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { acceptInviteAction } from "@/app/actions/teams";
import Link from "next/link";
import { Users2, CheckCircle2, AlertCircle } from "lucide-react";

export default async function InvitePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const session = await auth();

  // Not logged in — show landing so new users can register and existing can login
  if (!session?.user?.id) {
    const preview = await prisma.teamInvite.findUnique({
      where: { token },
      include: { team: { select: { name: true } } },
    });
    const callbackUrl = encodeURIComponent(`/invite/${token}`);
    const isValid = preview && !preview.usedAt && preview.expiresAt > new Date();

    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="max-w-sm w-full rounded-2xl border border-border bg-card p-8 text-center space-y-5">
          {isValid ? (
            <>
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 mx-auto">
                <Users2 className="h-7 w-7 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Join {preview.team.name}</h1>
                <p className="text-sm text-muted-foreground mt-1.5">
                  Create an account or sign in to accept this team invite.
                </p>
              </div>
              <div className="flex flex-col gap-2.5">
                <Link
                  href={`/register?callbackUrl=${callbackUrl}`}
                  className="block w-full rounded-xl bg-primary text-primary-foreground py-2.5 text-sm font-semibold hover:bg-primary/90 transition-colors"
                >
                  Create account
                </Link>
                <Link
                  href={`/login?callbackUrl=${callbackUrl}`}
                  className="block w-full rounded-xl border border-border py-2.5 text-sm font-medium hover:bg-accent/60 transition-colors"
                >
                  Sign in
                </Link>
              </div>
            </>
          ) : (
            <>
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10 mx-auto">
                <AlertCircle className="h-7 w-7 text-destructive" />
              </div>
              <h1 className="text-xl font-bold">Invalid invite</h1>
              <p className="text-sm text-muted-foreground">
                This invite link is invalid, has already been used, or has expired.
              </p>
              <Link href="/register" className="text-sm text-primary hover:underline">
                Create an account anyway →
              </Link>
            </>
          )}
        </div>
      </div>
    );
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
