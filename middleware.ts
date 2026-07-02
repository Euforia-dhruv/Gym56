import { NextRequest, NextResponse } from 'next/server';

// Routes that require the user to be logged OUT (auth pages)
const authOnlyRoutes = ['/login', '/signup', '/forgot-password', '/reset-password'];

// Routes that require the user to be logged IN (protected pages)
// Extend this list as new protected pages are added (e.g. /dashboard, /profile)
const protectedRoutes: string[] = [];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Read the Supabase session cookie.
  // Supabase stores the session under the key:
  //   sb-<project-ref>-auth-token  (chunked as -0, -1, etc.)
  // We detect presence of any sb-*-auth-token cookie as a proxy for
  // "user has an active session". Full cryptographic validation happens
  // inside the Supabase client on the client side.
  const hasSession = Array.from(request.cookies.getAll()).some(
    (cookie) =>
      cookie.name.startsWith('sb-') && cookie.name.endsWith('-auth-token')
  );

  // Redirect authenticated users away from auth pages
  if (authOnlyRoutes.includes(pathname) && hasSession) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Redirect unauthenticated users away from protected pages
  if (protectedRoutes.some((route) => pathname.startsWith(route)) && !hasSession) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirectTo', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths EXCEPT:
     * - _next/static  (static files)
     * - _next/image   (image optimisation)
     * - favicon.ico
     * - public folder assets (png, jpg, svg, etc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
