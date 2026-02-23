import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { getStripe } from "@/lib/stripe";

// Cancel subscription at end of current billing period (downgrade to free)
export async function POST() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { stripeSubscriptionId: true },
  });

  if (!user?.stripeSubscriptionId) {
    return NextResponse.json({ error: "No active subscription" }, { status: 400 });
  }

  await getStripe().subscriptions.update(user.stripeSubscriptionId, {
    cancel_at_period_end: true,
  });

  return NextResponse.json({ success: true });
}
