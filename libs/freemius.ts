import {Freemius, type CheckoutBuilderUserOptions} from "@freemius/sdk";
import config from "../config.server";

type PricingKey = "monthly" | "yearly" | "lifetime";

type CheckoutInput = {
  pricing?: PricingKey;
  email?: string;
  name?: string;
};

let freemiusClient: Freemius | null = null;

export function getMissingFreemiusConfigKeys(): string[] {
  const missing: string[] = [];
  const freemius = config.freemius;

  if (!freemius?.productId) missing.push("FREEMIUS_PRODUCT_ID");
  if (!freemius?.apiKey) missing.push("FREEMIUS_API_KEY");
  if (!freemius?.secretKey) missing.push("FREEMIUS_SECRET_KEY");
  if (!freemius?.publicKey) missing.push("FREEMIUS_PUBLIC_KEY");
  if (!freemius?.plan?.planId) missing.push("FREEMIUS_PLAN_ID");
  if (!freemius?.pricing?.monthly?.pricingId) missing.push("FREEMIUS_PRICING_ID_MONTHLY");
  if (!freemius?.pricing?.yearly?.pricingId) missing.push("FREEMIUS_PRICING_ID_YEARLY");
  if (!freemius?.pricing?.lifetime?.pricingId) missing.push("FREEMIUS_PRICING_ID_LIFETIME");

  return missing;
}

export function getFreemiusClient() {
  if (freemiusClient) return freemiusClient;

  const missing = getMissingFreemiusConfigKeys();
  if (missing.length > 0) {
    throw new Error(`Missing Freemius credentials: ${missing.join(", ")}`);
  }
  const {productId, apiKey, secretKey, publicKey} = config.freemius ?? {};

  freemiusClient = new Freemius({
    productId,
    apiKey,
    secretKey,
    publicKey
  });

  return freemiusClient;
}

function resolvePlanId(): string | null {
  const planId = config.freemius?.plan?.planId;
  return planId ? String(planId) : null;
}

function resolvePricingId(pricing?: PricingKey): string | null {
  if (pricing && config.freemius?.pricing?.[pricing]?.pricingId) {
    return String(config.freemius.pricing[pricing].pricingId);
  }

  const pricingOptions = Object.values(config.freemius?.pricing ?? {});
  const fallback = pricingOptions.find((entry) => entry?.pricingId)?.pricingId;
  return fallback ? String(fallback) : null;
}

function buildCheckoutUser(email?: string, name?: string): CheckoutBuilderUserOptions | undefined {
  if (!email) return undefined;
  if (!name) return {email};
  return {email, name};
}

export async function createCheckoutLink(input: CheckoutInput) {
  const freemius = getFreemiusClient();
  const planId = resolvePlanId();
  const pricingId = resolvePricingId(input.pricing);

  if (!planId) {
    throw new Error("Missing Freemius plan id.");
  }
  if (!pricingId) {
    throw new Error("Missing Freemius pricing id.");
  }

  const checkout = await freemius.checkout.create({
    isSandbox: Boolean(config.freemius?.isSandbox),
    user: buildCheckoutUser(input.email, input.name)
  });
  checkout.setPlan(planId);
  checkout.setPricing(pricingId);

  return checkout.getLink();
}
