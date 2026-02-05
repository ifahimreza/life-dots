import {Freemius, type CheckoutBuilderUserOptions} from "@freemius/sdk";
import config from "../config";

type PlanKey = "yearly" | "lifetime";

type CheckoutInput = {
  plan?: PlanKey;
  email?: string;
  name?: string;
};

let freemiusClient: Freemius | null = null;

export function getFreemiusClient() {
  if (freemiusClient) return freemiusClient;

  const {productId, apiKey, secretKey, publicKey} = config.freemius ?? {};
  if (!productId || !apiKey || !secretKey || !publicKey) {
    throw new Error("Missing Freemius credentials.");
  }

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
