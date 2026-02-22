import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { FeaturesClient } from "./features-client";

export const metadata = { title: "Feature Requests" };

export default async function FeaturesPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const [features, userVotes] = await Promise.all([
    prisma.featureRequest.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true, title: true, description: true, status: true, createdAt: true,
        user: { select: { email: true } },
        _count: { select: { votes: true } },
      },
    }),
    prisma.featureVote.findMany({
      where: { userId: session.user.id },
      select: { featureRequestId: true },
    }),
  ]);

  const votedIds = new Set(userVotes.map((v) => v.featureRequestId));

  const sorted = features
    .map((f) => ({
      id: f.id,
      title: f.title,
      description: f.description,
      status: f.status,
      createdAt: f.createdAt.toISOString(),
      votes: f._count.votes,
      hasVoted: votedIds.has(f.id),
      userEmail: f.user.email,
    }))
    .sort((a, b) => b.votes - a.votes);

  return <FeaturesClient features={sorted} />;
}
