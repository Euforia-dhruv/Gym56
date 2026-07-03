import { NextRequest, NextResponse } from "next/server";

// Routes that require the user to be logged OUT (auth pages)
const authOnlyRoutes = [
  "/login",
  "/signup",
  "/forgot-password",
  "/reset-password",
];

// Routes that require the user to be logged IN (protected pages)
const protectedRoutes = ["/admin", "/dashboard"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Read the Supabase session cookie.
  const hasSession = Array.from(request.cookies.getAll()).some(
    (cookie) =>
      cookie.name.startsWith("sb-") && cookie.name.endsWith("-auth-token")
  );

  // Redirect authenticated users away from auth pages
  if (authOnlyRoutes.includes(pathname) && hasSession) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Redirect unauthenticated users away from protected pages
  if (
    protectedRoutes.some((route) => pathname.startsWith(route)) &&
    !hasSession
  ) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
