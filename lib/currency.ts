// Currency detection + plan pricing per currency

export type Currency = "eur" | "usd";

// EU member states (ISO 3166-1 alpha-2)
const EU_COUNTRIES = new Set([
  "AT","BE","BG","CY","CZ","DE","DK","EE","ES","FI",
  "FR","GR","HR","HU","IE","IT","LT","LU","LV","MT",
  "NL","PL","PT","RO","SE","SI","SK",
]);

/**
 * Detect currency from request country header.
 * Cloudflare passes CF-IPCountry; Vercel passes x-vercel-ip-country.
 * Defaults to EUR (primary currency) when country is unknown.
 */
export function detectCurrency(country: string | null | undefined): Currency {
  if (!country) return "eur";
  return EU_COUNTRIES.has(country.toUpperCase()) ? "eur" : "usd";
}

export const CURRENCY_SYMBOL: Record<Currency, string> = {
  eur: "€",
  usd: "$",
};

// Display prices — same numbers, different symbol
export const PLAN_PRICES: Record<Currency, {
  growth:   { monthly: string; yearly: string; yearlyPerMonth: string };
  business: { monthly: string; yearly: string; yearlyPerMonth: string };
}> = {
  eur: {
    growth:   { monthly: "€9.90",   yearly: "€99.90",   yearlyPerMonth: "€8.33"  },
    business: { monthly: "€49.90",  yearly: "€490.90",  yearlyPerMonth: "€40.91" },
  },
  usd: {
    growth:   { monthly: "$9.90",   yearly: "$99.90",   yearlyPerMonth: "$8.33"  },
    business: { monthly: "$49.90",  yearly: "$490.90",  yearlyPerMonth: "$40.91" },
  },
};

/**
 * Resolve Stripe Price ID from env based on plan / interval / currency.
 * Env var pattern: STRIPE_{PLAN}_{INTERVAL}_{CURRENCY}_PRICE_ID
 * e.g. STRIPE_GROWTH_MONTHLY_EUR_PRICE_ID
 */
export function getPriceId(
  plan: "growth" | "business",
  interval: "monthly" | "yearly",
  currency: Currency,
): string | undefined {
  const key = `STRIPE_${plan.toUpperCase()}_${interval.toUpperCase()}_${currency.toUpperCase()}_PRICE_ID`;
  return process.env[key];
}
