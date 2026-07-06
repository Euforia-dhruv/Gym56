-- Gym56 — Migration 009: Exercise Encyclopedia Enhancements
-- Adds columns for the full exercise encyclopedia feature.

ALTER TABLE public.exercises
  ADD COLUMN IF NOT EXISTS secondary_muscles TEXT[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS gif_url TEXT,
  ADD COLUMN IF NOT EXISTS thumbnail_url TEXT,
  ADD COLUMN IF NOT EXISTS breathing TEXT,
  ADD COLUMN IF NOT EXISTS variations TEXT[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS alternatives TEXT[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS progressions TEXT[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS regressions TEXT[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS beginner_tips TEXT[] NOT NULL DEFAULT '{}';
