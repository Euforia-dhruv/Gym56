import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

const authOnlyRoutes = ["/login", "/signup", "/forgot-password", "/reset-password"];
const protectedRoutes = ["/admin", "/dashboard"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip auth check for static assets and API routes
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/auth") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll() {
          // Read-only in middleware
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const isAuthenticated = !!user;

  // Redirect authenticated users away from auth pages
  if (authOnlyRoutes.includes(pathname) && isAuthenticated) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Redirect unauthenticated users away from protected pages
  if (
    protectedRoutes.some((route) => pathname.startsWith(route)) &&
    !isAuthenticated
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
