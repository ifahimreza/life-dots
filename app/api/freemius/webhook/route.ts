import {parseDate, type LicenseEntity} from "@freemius/sdk";
import {getFreemiusClient, getMissingFreemiusConfigKeys} from "../../../../libs/freemius";
import {createSupabaseAdminClient} from "../../../../libs/supabaseAdmin";

function deriveAccessFromLicense(
  license: LicenseEntity | null | undefined | false
) {
  if (!license || typeof license !== "object") {
    return {
      hasAccess: false,
      planId: null,
      pricingId: null,
      freemiusUserId: null,
      freemiusLicenseId: null,
      freemiusSubscriptionId: null
    };
  }

  const expirationDate = license.expiration ? parseDate(license.expiration) : null;
  const isExpired = expirationDate ? expirationDate.getTime() < Date.now() : false;
  const hasAccess = !license.is_block_features && !isExpired;

  return {
    hasAccess,
    planId: license.plan_id ? String(license.plan_id) : null,
    pricingId: license.pricing_id ? String(license.pricing_id) : null,
    freemiusUserId: license.user_id ? String(license.user_id) : null,
    freemiusLicenseId: license.id ? String(license.id) : null,
    freemiusSubscriptionId: null
  };
}

async function resolveProfileId({
  supabase,
  freemiusUserId,
  email
}: {
  supabase: ReturnType<typeof createSupabaseAdminClient>;
  freemiusUserId: string | null;
  email?: string | null;
}) {
  if (freemiusUserId) {
    const {data} = await supabase
      .from("profiles")
      .select("id")
      .eq("freemius_user_id", freemiusUserId)
      .maybeSingle();
    if (data?.id) return data.id as string;

    const {data: legacyData} = await supabase
      .from("profiles")
      .select("id")
      .eq("customer_id", freemiusUserId)
      .maybeSingle();
    if (legacyData?.id) return legacyData.id as string;
  }

  if (email) {
    const {data} = await supabase
      .from("profiles")
      .select("id")
      .eq("email", email)
      .maybeSingle();
    if (data?.id) return data.id as string;
  }

  return null;
}

export async function POST(request: Request) {
  const missingFreemiusKeys = getMissingFreemiusConfigKeys();
  if (missingFreemiusKeys.length > 0) {
    return Response.json(
      {
        error: "Freemius server configuration is missing.",
        missing: missingFreemiusKeys
      },
      {status: 500}
    );
  }

  let supabase;
  try {
    supabase = createSupabaseAdminClient();
  } catch (error) {
    const message = error instanceof Error ? error.message : "Missing Supabase service role credentials.";
    return Response.json({error: message}, {status: 500});
  }

  let freemius;
  try {
    freemius = getFreemiusClient();
  } catch (error) {
    const message = error instanceof Error ? error.message : "Invalid Freemius configuration.";
    return Response.json({error: message}, {status: 500});
  }

  const listener = freemius.webhook.createListener();

  const handleEvent = async (event: any) => {
    const user = event.objects?.user;
    const license = event.objects?.license;
    const subscription = event.objects?.subscription;
    const access = deriveAccessFromLicense(license);
    const subscriptionId =
      subscription && typeof subscription === "object" && "id" in subscription && subscription.id
        ? String(subscription.id)
        : null;

    const freemiusUserId =
      (user?.id ? String(user.id) : null) ?? access.freemiusUserId;

    const profileId = await resolveProfileId({
      supabase,
      freemiusUserId,
      email: user?.email ?? null
    });

    if (!profileId) return;

    const updates: Record<string, unknown> = {
      has_access: access.hasAccess,
      freemius_last_event_type: event.type ?? null,
      freemius_last_event_at: event.created ?? new Date().toISOString()
    };

    if (freemiusUserId) {
      // Reuse legacy columns for Freemius identifiers.
      updates.customer_id = freemiusUserId;
      updates.freemius_user_id = freemiusUserId;
    }

    const pricing = access.pricingId ?? access.planId;
    if (pricing) {
      updates.price_id = pricing;
      updates.freemius_pricing_id = access.pricingId ?? null;
      updates.freemius_plan_id = access.planId ?? null;
    }

    if (access.freemiusLicenseId) {
      updates.freemius_license_id = access.freemiusLicenseId;
    }

    if (subscriptionId ?? access.freemiusSubscriptionId) {
      updates.freemius_subscription_id = subscriptionId ?? access.freemiusSubscriptionId;
    }

    await supabase.from("profiles").update(updates).eq("id", profileId);
  };

  listener.on(
    [
      "license.created",
      "license.updated",
      "license.extended",
      "license.shortened",
      "license.plan.changed",
      "license.expired",
      "license.cancelled",
      "license.deleted",
      "subscription.created",
      "subscription.cancelled",
      "subscription.renewal.failed.last"
    ],
    handleEvent
  );

  try {
    return freemius.webhook.processFetch(listener, request);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to process Freemius webhook.";
    return Response.json({error: message}, {status: 500});
  }
}
