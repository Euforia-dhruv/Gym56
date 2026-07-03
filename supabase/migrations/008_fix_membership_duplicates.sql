-- ============================================================================
-- Gym56 — Fix Membership Duplicates
--
-- Root cause: membership_plans had no UNIQUE constraint on `name`, so every
-- seed migration run (or manual admin creation) added duplicate rows.
-- ON CONFLICT DO NOTHING in the seed was ineffective because it had no
-- conflict target — only `id` (auto-generated UUID) is implicitly unique.
--
-- This migration:
--   1. Deduplicates rows, keeping only the lowest sort_order per plan name
--   2. Adds a UNIQUE constraint on `name` to prevent future duplicates
-- ============================================================================

-- ── 1. Remove duplicate rows ─────────────────────────────────────────────────
-- Keep the row with the lowest sort_order for each plan name.
-- If sort_order ties, keep the earliest-created row.

DELETE FROM public.membership_plans
WHERE id NOT IN (
  SELECT DISTINCT ON (name) id
  FROM public.membership_plans
  ORDER BY name, sort_order ASC, created_at ASC
);

-- ── 2. Add UNIQUE constraint on name ──────────────────────────────────────────
-- This prevents future seed runs or admin inserts from creating duplicates.

ALTER TABLE public.membership_plans
  ADD CONSTRAINT membership_plans_name_key UNIQUE (name);
