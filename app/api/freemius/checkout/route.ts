import {NextResponse} from "next/server";
import config from "../../../../config.server";
import {createCheckoutLink, getMissingFreemiusConfigKeys} from "../../../../libs/freemius";
import {createSupabaseAdminClient} from "../../../../libs/supabaseAdmin";

type CheckoutRequest = {
  pricing?: "monthly" | "yearly" | "lifetime";
  email?: string;
  name?: string;
  userId?: string;
};

export async function POST(request: Request) {
  const missingFreemiusKeys = getMissingFreemiusConfigKeys();
  if (missingFreemiusKeys.length > 0) {
    console.error("Freemius config missing keys:", missingFreemiusKeys.join(", "));
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
  if (authError || !authData?.user) {
    return NextResponse.json({error: "Unauthorized"}, {status: 401});
  }

  const body = (await request.json().catch(() => ({}))) as CheckoutRequest;
  if (body.userId && body.userId !== authData.user.id) {
    return NextResponse.json({error: "Unauthorized"}, {status: 403});
  }
  if (!authData.user.email) {
    return NextResponse.json({error: "Missing user email"}, {status: 400});
  }

  try {
    const url = await createCheckoutLink({
      pricing: body.pricing,
      email: authData.user.email,
      name:
        body.name ??
        (authData.user.user_metadata?.full_name as string | undefined) ??
        (authData.user.user_metadata?.name as string | undefined)
    });

    return NextResponse.json({url});
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({error: message}, {status: 500});
  }
}
