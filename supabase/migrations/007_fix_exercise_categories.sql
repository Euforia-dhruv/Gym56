-- ============================================================================
-- Gym56 — Fix exercise categories to include Glutes, Obliques, and Abs
-- ============================================================================

ALTER TABLE public.exercises
  DROP CONSTRAINT IF EXISTS exercises_category_check;

ALTER TABLE public.exercises
  ADD CONSTRAINT exercises_category_check
  CHECK (category IN ('Chest','Back','Shoulders','Legs','Arms','Core','Cardio','Glutes','Obliques','Abs'));
