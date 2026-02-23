import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { getStripe } from "@/lib/stripe";

// Resume a subscription that was set to cancel_at_period_end
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
    cancel_at_period_end: false,
  });

  return NextResponse.json({ success: true });
}
