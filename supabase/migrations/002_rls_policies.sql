-- ============================================================================
-- Gym56 — Sprint 2B: Row Level Security Policies
--
-- Enables RLS on all tables and creates policies per the architecture doc.
-- Admin bypass uses the JWT 'user_role' claim set by custom_access_token_hook.
-- ============================================================================

-- ── Enable RLS on all tables ──────────────────────────────────────────────────

ALTER TABLE public.profiles              ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.membership_plans      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.equipment             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.equipment_images      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exercises             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exercise_steps        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exercise_related      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_submissions   ENABLE ROW LEVEL SECURITY;

-- ── Helper: check if the current user is an admin via JWT claim ──────────────

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (auth.jwt() ->> 'user_role') = 'admin';
END;
$$ LANGUAGE plpgsql STABLE;

-- ── Profiles ─────────────────────────────────────────────────────────────────

-- Users can read their own profile; admins can read all
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id OR public.is_admin());

-- Users can update their own profile (but NOT the role column); admins can update all
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id OR public.is_admin())
  WITH CHECK (
    (auth.uid() = id AND (role IS NULL OR role = (SELECT role FROM public.profiles WHERE id = auth.uid())))
    OR
    public.is_admin()
  );

-- Admin-only insert/delete
CREATE POLICY "Admins can insert profiles"
  ON public.profiles FOR INSERT
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can delete profiles"
  ON public.profiles FOR DELETE
  USING (public.is_admin());

-- ── Membership Plans ─────────────────────────────────────────────────────────

-- Anyone can view active plans
CREATE POLICY "Anyone can view active plans"
  ON public.membership_plans FOR SELECT
  USING (is_active = TRUE OR public.is_admin());

-- Admin-only write
CREATE POLICY "Admins can manage plans"
  ON public.membership_plans FOR INSERT
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update plans"
  ON public.membership_plans FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can delete plans"
  ON public.membership_plans FOR DELETE
  USING (public.is_admin());

-- ── Subscriptions ────────────────────────────────────────────────────────────

-- Users can view their own subscriptions; admins can view all
CREATE POLICY "Users can view own subscriptions"
  ON public.subscriptions FOR SELECT
  USING (user_id = auth.uid() OR public.is_admin());

-- Admin-only write
CREATE POLICY "Admins can manage subscriptions"
  ON public.subscriptions FOR INSERT
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update subscriptions"
  ON public.subscriptions FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can delete subscriptions"
  ON public.subscriptions FOR DELETE
  USING (public.is_admin());

-- ── Equipment ────────────────────────────────────────────────────────────────

-- Public can view published, non-deleted equipment
CREATE POLICY "Public can view published equipment"
  ON public.equipment FOR SELECT
  USING (is_published = TRUE AND deleted_at IS NULL);

-- Authenticated users can also see non-published (for admin panel)
CREATE POLICY "Authenticated can view all equipment"
  ON public.equipment FOR SELECT
  USING (auth.role() = 'authenticated' AND deleted_at IS NULL);

-- Admin-only write
CREATE POLICY "Admins can insert equipment"
  ON public.equipment FOR INSERT
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update equipment"
  ON public.equipment FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can delete equipment"
  ON public.equipment FOR DELETE
  USING (public.is_admin());

-- ── Equipment Images ─────────────────────────────────────────────────────────

-- Public can view images linked to published equipment
CREATE POLICY "Public can view equipment images"
  ON public.equipment_images FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.equipment e
      WHERE e.id = equipment_id AND e.is_published = TRUE AND e.deleted_at IS NULL
    )
  );

-- Authenticated users can view all
CREATE POLICY "Authenticated can view all equipment images"
  ON public.equipment_images FOR SELECT
  USING (auth.role() = 'authenticated');

-- Admin-only write
CREATE POLICY "Admins can manage equipment images"
  ON public.equipment_images FOR INSERT
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update equipment images"
  ON public.equipment_images FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can delete equipment images"
  ON public.equipment_images FOR DELETE
  USING (public.is_admin());

-- ── Exercises ────────────────────────────────────────────────────────────────

-- Public can view published, non-deleted exercises
CREATE POLICY "Public can view published exercises"
  ON public.exercises FOR SELECT
  USING (is_published = TRUE AND deleted_at IS NULL);

-- Authenticated users can see all for admin panel
CREATE POLICY "Authenticated can view all exercises"
  ON public.exercises FOR SELECT
  USING (auth.role() = 'authenticated' AND deleted_at IS NULL);

-- Admin-only write
CREATE POLICY "Admins can insert exercises"
  ON public.exercises FOR INSERT
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update exercises"
  ON public.exercises FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can delete exercises"
  ON public.exercises FOR DELETE
  USING (public.is_admin());

-- ── Exercise Steps ───────────────────────────────────────────────────────────

CREATE POLICY "Public can view exercise steps"
  ON public.exercise_steps FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.exercises e
      WHERE e.id = exercise_id AND e.is_published = TRUE AND e.deleted_at IS NULL
    )
  );

CREATE POLICY "Authenticated can view all steps"
  ON public.exercise_steps FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can manage exercise steps"
  ON public.exercise_steps FOR INSERT
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update exercise steps"
  ON public.exercise_steps FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can delete exercise steps"
  ON public.exercise_steps FOR DELETE
  USING (public.is_admin());

-- ── Exercise Related ─────────────────────────────────────────────────────────

CREATE POLICY "Public can view related exercises"
  ON public.exercise_related FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.exercises e
      WHERE e.id = exercise_id AND e.is_published = TRUE AND e.deleted_at IS NULL
    )
  );

CREATE POLICY "Authenticated can view all related"
  ON public.exercise_related FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can manage related exercises"
  ON public.exercise_related FOR INSERT
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update related exercises"
  ON public.exercise_related FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can delete related exercises"
  ON public.exercise_related FOR DELETE
  USING (public.is_admin());

-- ── Contact Submissions ──────────────────────────────────────────────────────

-- Anyone can insert (contact form)
CREATE POLICY "Anyone can submit contact messages"
  ON public.contact_submissions FOR INSERT
  WITH CHECK (true);

-- Only admins can view/update
CREATE POLICY "Admins can view contact submissions"
  ON public.contact_submissions FOR SELECT
  USING (public.is_admin());

CREATE POLICY "Admins can update contact submissions"
  ON public.contact_submissions FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can delete contact submissions"
  ON public.contact_submissions FOR DELETE
  USING (public.is_admin());

-- ── Auth Hook: Custom JWT claims (run in Supabase Dashboard SQL Editor) ──────
-- Uncomment and run separately via Supabase Dashboard SQL Editor OR
-- as a separate migration AFTER deploying to Supabase.
-- 
-- CREATE OR REPLACE FUNCTION public.custom_access_token_hook(event JSONB)
-- RETURNS JSONB AS $$
-- DECLARE
--   claims JSONB;
--   user_role TEXT;
-- BEGIN
--   SELECT role INTO user_role FROM public.profiles WHERE id = (event->>'user_id')::UUID;
--   claims := event->'claims';
--   claims := jsonb_set(claims, '{user_role}', to_jsonb(COALESCE(user_role, 'member')));
--   RETURN jsonb_set(event, '{claims}', claims);
-- END;
-- $$ LANGUAGE plpgsql STABLE SECURITY DEFINER;
