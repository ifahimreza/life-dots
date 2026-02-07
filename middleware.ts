import {NextRequest, NextResponse} from "next/server";
import {AUTH_TOKEN_COOKIE} from "./libs/authConstants";

const PRIVATE_PREFIXES = ["/dashboard", "/settings", "/onboarding", "/admin"];
const AUTH_PAGES = ["/login"];

type SupabaseUser = {
  id: string;
  app_metadata?: {role?: string};
  user_metadata?: {role?: string};
};

function isPrivatePath(pathname: string) {
  return PRIVATE_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

function isAuthPage(pathname: string) {
  return AUTH_PAGES.includes(pathname);
}

function isSafeNextPath(nextPath: string | null) {
  if (!nextPath) return false;
  return nextPath.startsWith("/") && !nextPath.startsWith("//");
}

function redirectToLogin(request: NextRequest) {
  const loginUrl = new URL("/login", request.url);
  const nextPath = `${request.nextUrl.pathname}${request.nextUrl.search}`;
  loginUrl.searchParams.set("next", nextPath);
  return NextResponse.redirect(loginUrl);
}

function redirectToUpgradeModal(request: NextRequest) {
  const url = new URL("/", request.url);
  url.searchParams.set("upgrade", "1");
  return NextResponse.redirect(url);
}

async function fetchSupabaseUser(token: string) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
  if (!supabaseUrl || !anonKey) return null;

  try {
    const response = await fetch(`${supabaseUrl}/auth/v1/user`, {
      headers: {
        apikey: anonKey,
        Authorization: `Bearer ${token}`
      },
      cache: "no-store"
    });

    if (!response.ok) return null;
    return (await response.json()) as SupabaseUser;
  } catch {
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const {pathname, searchParams} = request.nextUrl;

  if (pathname === "/signup") {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  if (pathname === "/plus") {
    return redirectToUpgradeModal(request);
  }

  const token = request.cookies.get(AUTH_TOKEN_COOKIE)?.value;
  const privatePath = isPrivatePath(pathname);
  const authPage = isAuthPage(pathname);

  if (!privatePath && !authPage) {
    return NextResponse.next();
  }

  if (!token) {
    if (privatePath && searchParams.has("code")) {
      // Allow PKCE callback exchange on protected routes.
      return NextResponse.next();
    }
    if (privatePath) {
      return redirectToLogin(request);
    }
    return NextResponse.next();
  }

  const user = await fetchSupabaseUser(token);

  if (!user) {
    const response = privatePath ? redirectToLogin(request) : NextResponse.next();
    response.cookies.delete(AUTH_TOKEN_COOKIE);
    return response;
  }

  if (pathname.startsWith("/admin")) {
    const isAdmin =
      user.app_metadata?.role === "admin" ||
      user.user_metadata?.role === "admin";
    if (!isAdmin) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  if (authPage) {
    const nextPath = searchParams.get("next");
    const destination = isSafeNextPath(nextPath) ? nextPath : "/dashboard";
    return NextResponse.redirect(new URL(destination, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|_next/webpack-hmr|favicon.ico|robots.txt|sitemap.xml|manifest.json|icons|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|map|txt)$).*)"
  ]
};
