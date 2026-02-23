import Stripe from "stripe";

// Lazy singleton — not created at module load time so `next build` succeeds
// even when STRIPE_SECRET_KEY is not set in the build environment.
let _stripe: Stripe | undefined;

export function getStripe(): Stripe {
  if (!_stripe) {
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: "2024-12-18.acacia" as const,
    });
  }
  return _stripe;
}

export function planFromPriceId(priceId: string | null | undefined): string {
  if (!priceId) return "starter";
  const growthIds = [
    process.env.STRIPE_GROWTH_MONTHLY_EUR_PRICE_ID,
    process.env.STRIPE_GROWTH_YEARLY_EUR_PRICE_ID,
    process.env.STRIPE_GROWTH_MONTHLY_USD_PRICE_ID,
    process.env.STRIPE_GROWTH_YEARLY_USD_PRICE_ID,
  ];
  const businessIds = [
    process.env.STRIPE_BUSINESS_MONTHLY_EUR_PRICE_ID,
    process.env.STRIPE_BUSINESS_YEARLY_EUR_PRICE_ID,
    process.env.STRIPE_BUSINESS_MONTHLY_USD_PRICE_ID,
    process.env.STRIPE_BUSINESS_YEARLY_USD_PRICE_ID,
  ];
  if (growthIds.includes(priceId)) return "growth";
  if (businessIds.includes(priceId)) return "business";
  return "starter";
}
