import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { ConvertClient } from "@/app/app/convert/convert-client";

export const dynamic = "force-dynamic";
export const metadata = { title: "Team Studio" };

export default async function TeamConvertPage({
  params,
}: {
  params: Promise<{ teamId: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const { teamId } = await params;

  const [templates, user] = await Promise.all([
    prisma.template.findMany({
      where: { teamId },
      orderBy: { updatedAt: "desc" },
      select: { id: true, name: true, html: true },
    }),
    prisma.user.findUnique({
      where: { id: session.user.id },
      select: { plan: true },
    }),
  ]);

  return (
    <div className="h-full overflow-hidden">
      <ConvertClient templates={templates} plan={user?.plan ?? "starter"} teamId={teamId} />
    </div>
  );
}
