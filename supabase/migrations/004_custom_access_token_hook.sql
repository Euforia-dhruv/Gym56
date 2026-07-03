-- ============================================================================
-- Gym56 — Custom JWT Access Token Hook
--
-- Run this in the Supabase Dashboard SQL Editor.
-- This hook injects the user's role into the JWT so RLS policies can check
-- auth.jwt() ->> 'user_role' without an extra DB query on every request.
-- ============================================================================

-- ── 1. Custom access token hook ─────────────────────────────────────────────

CREATE OR REPLACE FUNCTION public.custom_access_token_hook(event JSONB)
RETURNS JSONB AS $$
DECLARE
  claims JSONB;
  user_role TEXT;
BEGIN
  claims := event->'claims';
  
  -- Fetch the user's role from the profiles table
  SELECT role INTO user_role FROM public.profiles WHERE id = (event->>'user_id')::UUID;
  
  -- Default to 'member' if no profile exists yet (during signup race condition)
  IF user_role IS NULL THEN
    user_role := 'member';
  END IF;
  
  -- Set the user_role claim
  claims := jsonb_set(claims, '{user_role}', to_jsonb(user_role));
  
  -- Return the modified event
  RETURN jsonb_set(event, '{claims}', claims);
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- ── 2. Grant permissions ─────────────────────────────────────────────────────

-- The hook runs as the authenticated user, so we need to grant usage
GRANT USAGE ON SCHEMA public TO supabase_auth_admin;
GRANT SELECT ON TABLE public.profiles TO supabase_auth_admin;

-- ── 3. Register the hook with Supabase Auth ──────────────────────────────────

-- Note: This must also be enabled in the Supabase Dashboard under
-- Auth > Hooks > Access Token Hook. Set it to:
--   Schema: public
--   Function: custom_access_token_hook
--   Type: Before JWT Created

-- ── 4. Ensure the first signed-up user gets admin role ───────────────────────

-- When seeding the first admin, run this in the SQL Editor:
-- UPDATE public.profiles SET role = 'admin' WHERE id = '<user-uuid>';
