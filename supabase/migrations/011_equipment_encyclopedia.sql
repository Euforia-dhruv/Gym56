-- Gym56 — Migration 011: Equipment Encyclopedia Enhancements

ALTER TABLE public.equipment
  ADD COLUMN IF NOT EXISTS common_mistakes TEXT[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS maintenance_tips TEXT[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS difficulty TEXT CHECK (difficulty IN ('Beginner','Intermediate','Advanced','All Levels')) DEFAULT 'All Levels',
  ADD COLUMN IF NOT EXISTS muscles_trained TEXT[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS instructions TEXT[] NOT NULL DEFAULT '{}';
