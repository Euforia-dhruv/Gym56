import { createClient } from "@supabase/supabase-js";

/**
 * Server-only admin Supabase client using the service_role key.
 *
 * ⚠️ NEVER import this in Client Components — it exposes the service role
 * key and bypasses RLS. Only use in Server Actions and Route Handlers.
 */
export function createSupabaseAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error(
      "Missing Supabase admin credentials: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set."
    );
  }

  return createClient(url, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
