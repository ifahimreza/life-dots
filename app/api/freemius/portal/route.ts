import {getFreemiusClient, getMissingFreemiusConfigKeys} from "../../../../libs/freemius";
import config from "../../../../config.server";
import {createSupabaseAdminClient} from "../../../../libs/supabaseAdmin";

function getPortalEndpoint(request: Request) {
  const url = new URL(request.url);
  return `${url.origin}/api/freemius/portal`;
}

async function handlePortalRequest(request: Request) {
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

  const authHeader = request.headers.get("authorization") ?? "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";
  if (!token) {
    return Response.json({error: "Unauthorized"}, {status: 401});
  }

  let supabase;
  try {
    supabase = createSupabaseAdminClient();
  } catch (error) {
    const message = error instanceof Error ? error.message : "Missing Supabase server credentials.";
    return Response.json({error: message}, {status: 500});
  }

  const {data, error} = await supabase.auth.getUser(token);
  if (error || !data?.user?.email) {
    return Response.json({error: "Unauthorized"}, {status: 401});
  }

  try {
    const freemius = getFreemiusClient();
    const email = data.user.email;
    const getUser = async () => {
      return {email};
    };

    return freemius.customerPortal.request.process(
      {
        getUser,
        portalEndpoint: getPortalEndpoint(request),
        isSandbox: Boolean(config.freemius?.isSandbox)
      },
      request
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to process billing portal request.";
    return Response.json({error: message}, {status: 500});
  }
}

export async function GET(request: Request) {
  return handlePortalRequest(request);
}

export async function POST(request: Request) {
  return handlePortalRequest(request);
}
