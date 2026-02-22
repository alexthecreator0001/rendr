import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { sendVerificationEmail } from "@/lib/email";
import { VerifyEmailClient } from "./verify-client";

export const metadata = { title: "Verify your email — Rendr" };

export default async function VerifyEmailPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login?callbackUrl=/verify-email");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { email: true, emailVerified: true },
  });

  if (!user) redirect("/login");

  // Already verified — go to dashboard
  if (user.emailVerified) redirect("/app");

  // Ensure there's an active token. Auto-create one if missing (e.g. user
  // navigated here after token expired, or email wasn't configured at sign-up).
  const existingToken = await prisma.verificationToken.findFirst({
    where: { userId: session.user.id, expiresAt: { gt: new Date() } },
    select: { id: true },
  });

  if (!existingToken) {
    // Delete any stale tokens, generate a fresh code, send it
    await prisma.verificationToken.deleteMany({ where: { userId: session.user.id } });
    for (let attempt = 0; attempt < 5; attempt++) {
      const code = String(Math.floor(100000 + Math.random() * 900000));
      try {
        await prisma.verificationToken.create({
          data: {
            userId: session.user.id,
            token: code,
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
          },
        });
        sendVerificationEmail(user.email, code).catch(() => {});
        break;
      } catch {
        // Unique collision — retry
      }
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 px-4">
      {/* Subtle background orbs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-[500px] w-[500px] rounded-full bg-blue-600/5 blur-[120px]" />
        <div className="absolute bottom-0 left-1/4 h-[400px] w-[400px] rounded-full bg-violet-600/5 blur-[100px]" />
      </div>

      <div className="relative w-full max-w-sm">
        {/* Card */}
        <div className="rounded-2xl border border-zinc-800/60 bg-zinc-900/60 backdrop-blur-xl px-8 py-10 shadow-2xl">
          <VerifyEmailClient email={user.email} />
        </div>
      </div>
    </div>
  );
}
