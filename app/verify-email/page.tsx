import { prisma } from "@/lib/db";
import Link from "next/link";
import { CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  if (!token) {
    return <Result ok={false} message="No verification token provided." />;
  }

  const record = await prisma.verificationToken.findUnique({ where: { token } });

  if (!record) {
    return <Result ok={false} message="This verification link is invalid or has already been used." />;
  }

  if (record.expiresAt < new Date()) {
    await prisma.verificationToken.delete({ where: { token } });
    return <Result ok={false} message="This verification link has expired. Please request a new one." />;
  }

  // Mark email as verified and remove token
  await Promise.all([
    prisma.user.update({
      where: { id: record.userId },
      data: { emailVerified: new Date() },
    }),
    prisma.verificationToken.delete({ where: { token } }),
  ]);

  return <Result ok={true} message="Your email has been verified successfully." />;
}

function Result({ ok, message }: { ok: boolean; message: string }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 px-4">
      <div className="w-full max-w-sm text-center">
        <div className="mb-6 flex justify-center">
          {ok ? (
            <CheckCircle className="h-14 w-14 text-emerald-400" />
          ) : (
            <XCircle className="h-14 w-14 text-red-400" />
          )}
        </div>
        <h1 className="mb-2 text-xl font-bold tracking-tight text-white">
          {ok ? "Email verified" : "Verification failed"}
        </h1>
        <p className="mb-8 text-sm text-zinc-400">{message}</p>
        <Button asChild className="w-full">
          <Link href={ok ? "/app" : "/app/settings"}>
            {ok ? "Go to dashboard" : "Go to settings"}
          </Link>
        </Button>
      </div>
    </div>
  );
}
