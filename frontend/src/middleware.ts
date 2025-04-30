import type { NextRequest } from "next/server";

import { NextResponse } from "next/server";

import { paths } from "./routes/paths";
import { LANGUAGE } from "./consts/language";

const locales = Object.values(LANGUAGE);
const defaultLocale = LANGUAGE.PL;

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

const PUBLIC_FILE = /\.(.*)$/;

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // --- 1. Ignoruj pliki statyczne i API
  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon.ico") ||
    PUBLIC_FILE.test(pathname)
  ) {
    return NextResponse.next();
  }

  // --- 2. Obsłuż brak języka w URL
  const hasLocale = locales.some((locale) => pathname.startsWith(`/${locale}`));

  if (!hasLocale) {
    const newUrl = req.nextUrl.clone();
    newUrl.pathname = `/${defaultLocale}${pathname}`;
    return NextResponse.rewrite(newUrl);
  }

  // --- 3. Obsługa autoryzacji
  const accessToken = req.cookies.get("access_token");

  // Usuń język z pathname (np. "/pl/account/dashboard" → "/account/dashboard")
  const localePath = `/${pathname.split("/")[1]}`;
  const pathWithoutLocale = pathname.replace(localePath, "");

  if (!accessToken) {
    if (AUTHORIZED_PATHS.includes(pathWithoutLocale)) {
      return NextResponse.redirect(
        new URL(`/${req.nextUrl.locale || defaultLocale}${paths.login}`, req.url)
      );
    }
  }

  if (accessToken) {
    if (UNAUTHORIZED_PATHS.includes(pathWithoutLocale)) {
      return NextResponse.redirect(
        new URL(`/${req.nextUrl.locale || defaultLocale}${paths.account.dashboard}`, req.url)
      );
    }
  }

  return NextResponse.next();
}

// --- Matcher that captures paths with or without locale ---
export const config = {
  matcher: [
    // Obsługujemy wszystkie ścieżki, z i bez /locale/
    "/((?!_next|api|favicon.ico|assets).*)",
  ],
};
