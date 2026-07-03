-- ============================================================================
-- Gym56 — Sprint 2B-2: Equipment supplementary fields
--
-- Adds how_to_use, safety_tips arrays and related equipment join table
-- to fully replace siteData.ts mock data.
-- ============================================================================

-- ── 1. Add arrays to equipment ───────────────────────────────────────────────

ALTER TABLE public.equipment
  ADD COLUMN IF NOT EXISTS how_to_use   TEXT[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS safety_tips  TEXT[] NOT NULL DEFAULT '{}';

-- ── 2. Equipment Related (M:N join table) ────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.equipment_related (
  equipment_id   UUID NOT NULL REFERENCES public.equipment(id) ON DELETE CASCADE,
  related_id     UUID NOT NULL REFERENCES public.equipment(id) ON DELETE CASCADE,
  sort_order     INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (equipment_id, related_id),
  CHECK (equipment_id <> related_id)
);

-- ── RLS for equipment_related ────────────────────────────────────────────────

ALTER TABLE public.equipment_related ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view related equipment"
  ON public.equipment_related FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.equipment e
      WHERE e.id = equipment_id AND e.is_published = TRUE AND e.deleted_at IS NULL
    )
  );

CREATE POLICY "Authenticated can view all related"
  ON public.equipment_related FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can manage related equipment"
  ON public.equipment_related FOR INSERT
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update related equipment"
  ON public.equipment_related FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can delete related equipment"
  ON public.equipment_related FOR DELETE
  USING (public.is_admin());
