import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

/**
 * Server-side Supabase client for Server Components, Server Actions,
 * and Route Handlers.
 *
 * Reads the user session from the HTTP cookie store — works correctly
 * with Next.js 15 App Router streaming and partial pre-rendering.
 *
 * IMPORTANT: Never use this in Client Components.
 */
export async function createSupabaseServerClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            try {
              cookieStore.set(name, value, options);
            } catch {
              // Server Component cookies are read-only.
              // The middleware handles session refresh instead.
            }
          });
        },
      },
    }
  );
}
