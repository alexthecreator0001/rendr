import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { getStripe } from "@/lib/stripe";

const PLAN_PRICE_IDS: Record<string, Record<string, string | undefined>> = {
  growth: {
    monthly: process.env.STRIPE_GROWTH_MONTHLY_PRICE_ID,
    yearly:  process.env.STRIPE_GROWTH_YEARLY_PRICE_ID,
  },
  business: {
    monthly: process.env.STRIPE_BUSINESS_MONTHLY_PRICE_ID,
    yearly:  process.env.STRIPE_BUSINESS_YEARLY_PRICE_ID,
  },
};

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const plan = body.plan as string;
  const interval: "monthly" | "yearly" = body.interval === "yearly" ? "yearly" : "monthly";
  const priceId = PLAN_PRICE_IDS[plan]?.[interval];

  if (!priceId) {
    return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { email: true, stripeCustomerId: true, stripeSubscriptionId: true },
  });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  // Already subscribed → send to portal to switch plan
  if (user.stripeSubscriptionId && user.stripeCustomerId) {
    const portalSession = await getStripe().billingPortal.sessions.create({
      customer: user.stripeCustomerId,
      return_url: `${process.env.NEXTAUTH_URL}/app/billing`,
    });
    return NextResponse.json({ url: portalSession.url });
  }

  // Create Stripe customer if needed
  let customerId = user.stripeCustomerId;
  if (!customerId) {
    const customer = await getStripe().customers.create({
      email: user.email,
      metadata: { userId: session.user.id },
    });
    customerId = customer.id;
    await prisma.user.update({
      where: { id: session.user.id },
      data: { stripeCustomerId: customer.id },
    });
  }

  const checkoutSession = await getStripe().checkout.sessions.create({
    customer: customerId,
    mode: "subscription",
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${process.env.NEXTAUTH_URL}/app/billing?upgraded=true`,
    cancel_url: `${process.env.NEXTAUTH_URL}/app/billing`,
    allow_promotion_codes: true,
    subscription_data: {
      metadata: { userId: session.user.id },
    },
  });

  return NextResponse.json({ url: checkoutSession.url });
}
