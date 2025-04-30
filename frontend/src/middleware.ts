import type { NextRequest } from "next/server";

import { NextResponse } from "next/server";

import { paths } from "./routes/paths";

const AUTHORIZED_PATHS = [
  paths.certificates,
  paths.learn,
  paths.account.dashboard,
  paths.account.personal,
  paths.account.manage,
  paths.account.subscription,
  paths.payment,
];

const UNAUTHORIZED_PATHS = [
  paths.home,
  paths.login,
  paths.register,
  paths.activate,
  paths.resetPassword,
  paths.updatePassword,
  paths.about,
];

const locales = ["pl", "en"];
const defaultLocale = "pl";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // --- Extract locale from the pathname ---
  const pathnameParts = pathname.split("/");
  const locale = locales.includes(pathnameParts[1]) ? pathnameParts[1] : defaultLocale;

  // --- Normalize pathname without locale ---
  const normalizedPathname = locales.includes(pathnameParts[1])
    ? "/" + pathnameParts.slice(2).join("/")
    : pathname;

  // --- Auth check ---
  const accessToken = req.cookies.get("access_token");

  if (!accessToken && AUTHORIZED_PATHS.includes(normalizedPathname)) {
    const redirectUrl = new URL(`/${locale}/auth/login`, req.url);
    return NextResponse.redirect(redirectUrl);
  }

  if (accessToken && UNAUTHORIZED_PATHS.includes(normalizedPathname)) {
    const redirectUrl = new URL(`/${locale}/account/dashboard`, req.url);
    return NextResponse.redirect(redirectUrl);
  }

  // --- Ensure locale cookie is set ---
  const response = NextResponse.next();
  const currentLocaleCookie = req.cookies.get("NEXT_LOCALE")?.value;

  if (!currentLocaleCookie || currentLocaleCookie !== locale) {
    response.cookies.set("NEXT_LOCALE", locale);
  }

  return response;
}

// --- Matcher that captures paths with or without locale ---
export const config = {
  matcher: [
    "/certificates",
    "/pl/certificates",
    "/en/certificates",

    "/lesson",
    "/pl/lesson",
    "/en/lesson",

    "/account/:path*",
    "/pl/account/:path*",
    "/en/account/:path*",

    "/learn/:path*",
    "/pl/learn/:path*",
    "/en/learn/:path*",

    "/",
    "/pl",
    "/en",

    "/auth/login",
    "/pl/auth/login",
    "/en/auth/login",

    "/auth/register",
    "/pl/auth/register",
    "/en/auth/register",

    "/auth/activate",
    "/pl/auth/activate",
    "/en/auth/activate",

    "/auth/resetPassword",
    "/pl/auth/resetPassword",
    "/en/auth/resetPassword",

    "/auth/updatePassword",
    "/pl/auth/updatePassword",
    "/en/auth/updatePassword",

    "/about",
    "/pl/about",
    "/en/about",

    "/payment",
    "/pl/payment",
    "/en/payment",
  ],
};
