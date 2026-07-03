-- Fix exercise category constraint
ALTER TABLE public.exercises
  DROP CONSTRAINT IF EXISTS exercises_category_check;

ALTER TABLE public.exercises
  ADD CONSTRAINT exercises_category_check
  CHECK (category IN ('Chest','Back','Shoulders','Legs','Arms','Core','Cardio','Glutes','Obliques','Abs'));

-- Add supplementary fields to equipment
ALTER TABLE public.equipment
  ADD COLUMN IF NOT EXISTS how_to_use   TEXT[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS safety_tips  TEXT[] NOT NULL DEFAULT '{}';

-- Create equipment_related table
CREATE TABLE IF NOT EXISTS public.equipment_related (
  equipment_id UUID NOT NULL REFERENCES public.equipment(id) ON DELETE CASCADE,
  related_id   UUID NOT NULL REFERENCES public.equipment(id) ON DELETE CASCADE,
  sort_order   INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (equipment_id, related_id),
  CHECK (equipment_id <> related_id)
);

ALTER TABLE public.equipment_related ENABLE ROW LEVEL SECURITY;
