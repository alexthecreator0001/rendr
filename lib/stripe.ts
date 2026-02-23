import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-12-18.acacia" as const,
});

// Map Stripe price IDs → internal plan names
export function planFromPriceId(priceId: string | null | undefined): string {
  if (!priceId) return "starter";
  if (priceId === process.env.STRIPE_GROWTH_PRICE_ID) return "growth";
  if (priceId === process.env.STRIPE_BUSINESS_PRICE_ID) return "business";
  return "starter";
}
