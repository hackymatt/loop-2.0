import type { NextRequest } from "next/server";

import { NextResponse } from "next/server";

import { paths } from "./routes/paths";

const AUTHORIZED_PATHS = [paths.certificates, paths.learn, paths.account.dashboard];
const UNAUTHORIZED_PATHS = [
  paths.home,
  paths.login,
  paths.register,
  paths.activate,
  paths.resetPassword,
  paths.updatePassword,
  paths.pricing,
  paths.about,
];

export async function middleware(req: NextRequest) {
  const accessToken = req.cookies.get("access_token"); // Access cookie

  // Check if user is logged in
  if (!accessToken) {
    if (AUTHORIZED_PATHS.includes(req.nextUrl.pathname)) {
      console.log(`Redirecting to login from ${req.nextUrl.pathname}`);
      return NextResponse.redirect(new URL(paths.login, req.url));
    }
  }

  // If the user is logged in and is on an unauthorized path, redirect to the dashboard
  if (accessToken) {
    if (UNAUTHORIZED_PATHS.includes(req.nextUrl.pathname)) {
      console.log(`Redirecting to dashboard from ${req.nextUrl.pathname}`);
      return NextResponse.redirect(new URL(paths.dashboard, req.url));
    }
  }

  return NextResponse.next();
}

// Export configuration with statically defined matcher
export const config = {
  matcher: [
    "/certificates",
    "/lesson",
    "/account",
    "/",
    "/auth/login",
    "/auth/register",
    "/auth/activate",
    "/auth/resetPassword",
    "/auth/updatePassword",
    "/pricing",
    "/about",
  ],
};
