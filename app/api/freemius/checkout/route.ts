import {NextResponse} from "next/server";
import config from "../../../../config";
import {createCheckoutLink} from "../../../../libs/freemius";

type CheckoutRequest = {
  plan?: "yearly" | "lifetime";
  email?: string;
  name?: string;
  userId?: string;
};

export async function POST(request: Request) {
  if (!config.freemius?.productId) {
    return NextResponse.json({error: "Missing Freemius configuration"}, {status: 500});
  }

  const body = (await request.json().catch(() => ({}))) as CheckoutRequest;
  if (!body.userId) {
    return NextResponse.json({error: "Missing user id"}, {status: 400});
  }
  if (!body.email) {
    return NextResponse.json({error: "Missing user email"}, {status: 400});
  }

  try {
    const url = await createCheckoutLink({
      plan: body.plan,
      email: body.email,
      name: body.name
    });

    return NextResponse.json({url});
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({error: message}, {status: 500});
  }
}
