import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getPlanAiLimit } from "@/lib/plans";
import { AiStudioClient } from "./ai-studio-client";

export const metadata = { title: "AI Studio" };

export default async function AiStudioPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { plan: true },
  });

  const plan = user?.plan ?? "starter";
  const limit = getPlanAiLimit(plan);

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const used = await prisma.usageEvent.count({
    where: {
      userId: session.user.id,
      endpoint: "ai-generate",
      createdAt: { gte: monthStart },
    },
  });

  return (
    <div className="h-full overflow-hidden">
      <AiStudioClient plan={plan} creditsUsed={used} creditsLimit={limit} />
    </div>
  );
}
