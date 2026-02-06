import {Freemius, type CheckoutBuilderUserOptions} from "@freemius/sdk";
import config from "../config.server";

type PlanKey = "yearly" | "lifetime";

type CheckoutInput = {
  plan?: PlanKey;
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
  if (!freemius?.plans?.yearly?.planId) missing.push("FREEMIUS_PLAN_ID_YEARLY");
  if (!freemius?.plans?.lifetime?.planId) missing.push("FREEMIUS_PLAN_ID_LIFETIME");

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

function resolvePlanId(plan?: PlanKey): string | null {
  if (plan && config.freemius?.plans?.[plan]?.planId) {
    return String(config.freemius.plans[plan].planId);
  }

  const plans = Object.values(config.freemius?.plans ?? {});
  const fallback = plans.find((entry) => entry?.planId)?.planId;
  return fallback ? String(fallback) : null;
}

function buildCheckoutUser(email?: string, name?: string): CheckoutBuilderUserOptions | undefined {
  if (!email) return undefined;
  if (!name) return {email};
  return {email, name};
}

export async function createCheckoutLink(input: CheckoutInput) {
  const freemius = getFreemiusClient();
  const planId = resolvePlanId(input.plan);

  if (!planId) {
    throw new Error("Missing Freemius plan id.");
  }

  const checkout = await freemius.checkout.create({
    planId,
    isSandbox: Boolean(config.freemius?.isSandbox),
    user: buildCheckoutUser(input.email, input.name)
  });

  return checkout.getLink();
}
