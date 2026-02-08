import {NextResponse} from "next/server";
import {getFreemiusClient, getMissingFreemiusConfigKeys} from "../../../../libs/freemius";
import {createSupabaseAdminClient} from "../../../../libs/supabaseAdmin";

export async function POST(request: Request) {
  const missingFreemiusKeys = getMissingFreemiusConfigKeys();
  if (missingFreemiusKeys.length > 0) {
    return NextResponse.json(
      {
        error: "Freemius server configuration is missing.",
        missing: missingFreemiusKeys
      },
      {status: 500}
    );
  }

  const authHeader = request.headers.get("authorization") ?? "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";
  if (!token) {
    return NextResponse.json({error: "Unauthorized"}, {status: 401});
  }

  const supabase = createSupabaseAdminClient();
  const {data: authData, error: authError} = await supabase.auth.getUser(token);
  if (authError || !authData?.user?.id || !authData.user.email) {
    return NextResponse.json({error: "Unauthorized"}, {status: 401});
  }

  try {
    const freemius = getFreemiusClient();
    const purchases = await freemius.purchase.retrievePurchasesByEmail(authData.user.email);
    const activePurchase = purchases.find((purchase) => purchase.isActive);

    if (!activePurchase) {
      const {data: existingProfile} = await supabase
        .from("profiles")
        .select("has_access")
        .eq("id", authData.user.id)
        .maybeSingle();

      return NextResponse.json({
        hasAccess: Boolean(existingProfile?.has_access),
        synced: false
      });
    }

    const updatePayload = {
      id: authData.user.id,
      email: authData.user.email,
      has_access: true,
      customer_id: activePurchase.userId ? String(activePurchase.userId) : null,
      freemius_user_id: activePurchase.userId ? String(activePurchase.userId) : null,
      price_id: activePurchase.pricingId ? String(activePurchase.pricingId) : null,
      freemius_pricing_id: activePurchase.pricingId ? String(activePurchase.pricingId) : null,
      freemius_plan_id: activePurchase.planId ? String(activePurchase.planId) : null,
      freemius_license_id: activePurchase.licenseId ? String(activePurchase.licenseId) : null,
      freemius_subscription_id: activePurchase.subscriptionId ? String(activePurchase.subscriptionId) : null,
      freemius_last_event_type: "manual_restore_sync",
      freemius_last_event_at: new Date().toISOString()
    };

    const {error: updateError} = await supabase
      .from("profiles")
      .upsert(updatePayload, {onConflict: "id"});
    if (updateError) {
      throw updateError;
    }

    return NextResponse.json({hasAccess: true, synced: true});
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to sync access.";
    return NextResponse.json({error: message}, {status: 500});
  }
}
