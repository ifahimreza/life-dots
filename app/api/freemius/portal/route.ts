import {getFreemiusClient} from "../../../../libs/freemius";
import config from "../../../../config";

function getPortalEndpoint(request: Request) {
  const url = new URL(request.url);
  return `${url.origin}/api/freemius/portal`;
}

async function handlePortalRequest(request: Request) {
  const freemius = getFreemiusClient();
  const url = new URL(request.url);
  const email =
    url.searchParams.get("email") ?? request.headers.get("x-user-email");

  const getUser = async () => {
    if (email) {
      return {email};
    }
    return null;
  };

  return freemius.customerPortal.request.process(
    {
      getUser,
      portalEndpoint: getPortalEndpoint(request),
      isSandbox: Boolean(config.freemius?.isSandbox)
    },
    request
  );
}

export async function GET(request: Request) {
  return handlePortalRequest(request);
}

export async function POST(request: Request) {
  return handlePortalRequest(request);
}
