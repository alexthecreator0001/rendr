import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { WebhooksClient } from "./webhooks-client";

export const dynamic = "force-dynamic";

export default async function WebhooksPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const webhooks = await prisma.webhook.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    select: { id: true, url: true, enabled: true, events: true, createdAt: true },
  });

  return <WebhooksClient webhooks={webhooks} />;
}
