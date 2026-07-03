-- ============================================================================
-- Gym56 — Sprint 2B: Core Database Schema
-- 
-- This migration creates the foundational tables, RLS policies, triggers,
-- and storage bucket configuration used by the Gym56 admin CMS.
-- ============================================================================

-- ── 1. Extensions ─────────────────────────────────────────────────────────────

CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "moddatetime";

-- ── 2. Profiles (extends auth.users) ──────────────────────────────────────────

CREATE TABLE public.profiles (
  id            UUID        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name     TEXT,
  phone         TEXT,
  avatar_url    TEXT,
  role          TEXT        NOT NULL DEFAULT 'member'
                            CHECK (role IN ('member', 'admin', 'trainer')),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_profiles_role ON profiles(role);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.email),
    'member'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Auto-update updated_at
CREATE OR REPLACE TRIGGER handle_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE PROCEDURE moddatetime(updated_at);

-- ── 3. Membership Plans ───────────────────────────────────────────────────────

CREATE TABLE public.membership_plans (
  id                UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  name              TEXT        NOT NULL,
  duration_months   INTEGER     NOT NULL CHECK (duration_months > 0),
  currency          TEXT        NOT NULL DEFAULT 'INR',
  price_minor       INTEGER     NOT NULL CHECK (price_minor >= 0),
  savings_label     TEXT,
  is_featured       BOOLEAN     NOT NULL DEFAULT FALSE,
  is_active         BOOLEAN     NOT NULL DEFAULT TRUE,
  sort_order        INTEGER     NOT NULL DEFAULT 0,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_membership_plans_active ON membership_plans(is_active, sort_order);

CREATE OR REPLACE TRIGGER handle_membership_plans_updated_at
  BEFORE UPDATE ON public.membership_plans
  FOR EACH ROW
  EXECUTE PROCEDURE moddatetime(updated_at);

-- ── 4. Subscriptions ──────────────────────────────────────────────────────────

CREATE TABLE public.subscriptions (
  id                UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_id           UUID        NOT NULL REFERENCES public.membership_plans(id) ON DELETE RESTRICT,
  starts_at         DATE        NOT NULL,
  expires_at        DATE        NOT NULL CHECK (expires_at > starts_at),
  payment_status    TEXT        NOT NULL DEFAULT 'pending'
                                CHECK (payment_status IN ('pending','paid','failed','refunded','cancelled')),
  payment_ref       TEXT,
  payment_gateway   TEXT,
  amount_paid_minor INTEGER,
  currency          TEXT        NOT NULL DEFAULT 'INR',
  notes             TEXT,
  created_by        UUID        REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_plan_id ON subscriptions(plan_id);
CREATE INDEX idx_subscriptions_expires_at ON subscriptions(expires_at);
CREATE INDEX idx_subscriptions_payment_status ON subscriptions(payment_status);

CREATE OR REPLACE TRIGGER handle_subscriptions_updated_at
  BEFORE UPDATE ON public.subscriptions
  FOR EACH ROW
  EXECUTE PROCEDURE moddatetime(updated_at);

-- Active subscriptions view
CREATE VIEW public.active_subscriptions AS
  SELECT * FROM public.subscriptions
  WHERE payment_status = 'paid'
    AND starts_at <= CURRENT_DATE
    AND expires_at >= CURRENT_DATE;

-- ── 5. Equipment ──────────────────────────────────────────────────────────────

CREATE TABLE public.equipment (
  id                  UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  name                TEXT        NOT NULL,
  slug                TEXT        NOT NULL UNIQUE,
  category            TEXT        NOT NULL
                      CHECK (category IN ('Cardio','Strength','Free Weights','Machines','Functional','Recovery','Other')),
  description         TEXT,
  quantity            INTEGER     NOT NULL DEFAULT 1 CHECK (quantity >= 0),
  condition           TEXT        NOT NULL DEFAULT 'good'
                      CHECK (condition IN ('excellent','good','fair','maintenance','retired')),
  location            TEXT,
  is_available        BOOLEAN     NOT NULL DEFAULT TRUE,
  is_published        BOOLEAN     NOT NULL DEFAULT FALSE,
  primary_image_url   TEXT,
  sort_order          INTEGER     NOT NULL DEFAULT 0,
  created_by          UUID        REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_by          UUID        REFERENCES auth.users(id) ON DELETE SET NULL,
  deleted_at          TIMESTAMPTZ,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_equipment_slug ON equipment(slug);
CREATE INDEX idx_equipment_category ON equipment(category);
CREATE INDEX idx_equipment_published ON equipment(is_published) WHERE deleted_at IS NULL;

CREATE OR REPLACE TRIGGER handle_equipment_updated_at
  BEFORE UPDATE ON public.equipment
  FOR EACH ROW
  EXECUTE PROCEDURE moddatetime(updated_at);

-- ── 6. Equipment Images ───────────────────────────────────────────────────────

CREATE TABLE public.equipment_images (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  equipment_id    UUID        NOT NULL REFERENCES public.equipment(id) ON DELETE CASCADE,
  url             TEXT        NOT NULL,
  alt_text        TEXT,
  sort_order      INTEGER     NOT NULL DEFAULT 0,
  is_primary      BOOLEAN     NOT NULL DEFAULT FALSE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_equipment_images_equipment_id ON equipment_images(equipment_id);
CREATE INDEX idx_equipment_images_sort ON equipment_images(equipment_id, sort_order);

-- ── 7. Exercises ──────────────────────────────────────────────────────────────

CREATE TABLE public.exercises (
  id                  UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  name                TEXT        NOT NULL,
  slug                TEXT        NOT NULL UNIQUE,
  category            TEXT        NOT NULL
                      CHECK (category IN ('Chest','Back','Shoulders','Legs','Arms','Core','Cardio')),
  muscle_group        TEXT,
  equipment_id        UUID        REFERENCES public.equipment(id) ON DELETE SET NULL,
  equipment_label     TEXT,
  difficulty          TEXT        NOT NULL
                      CHECK (difficulty IN ('Beginner','Intermediate','Advanced')),
  target_muscles      TEXT[]      NOT NULL DEFAULT '{}',
  common_mistakes     TEXT[]      NOT NULL DEFAULT '{}',
  safety_tips         TEXT[]      NOT NULL DEFAULT '{}',
  primary_image_url   TEXT,
  video_url           TEXT,
  is_published        BOOLEAN     NOT NULL DEFAULT FALSE,
  sort_order          INTEGER     NOT NULL DEFAULT 0,
  created_by          UUID        REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_by          UUID        REFERENCES auth.users(id) ON DELETE SET NULL,
  deleted_at          TIMESTAMPTZ,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_exercises_slug ON exercises(slug);
CREATE INDEX idx_exercises_category ON exercises(category);
CREATE INDEX idx_exercises_difficulty ON exercises(difficulty);
CREATE INDEX idx_exercises_equipment_id ON exercises(equipment_id);
CREATE INDEX idx_exercises_published ON exercises(is_published) WHERE deleted_at IS NULL;

CREATE OR REPLACE TRIGGER handle_exercises_updated_at
  BEFORE UPDATE ON public.exercises
  FOR EACH ROW
  EXECUTE PROCEDURE moddatetime(updated_at);

-- ── 8. Exercise Steps ─────────────────────────────────────────────────────────

CREATE TABLE public.exercise_steps (
  id                UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  exercise_id       UUID        NOT NULL REFERENCES public.exercises(id) ON DELETE CASCADE,
  step_number       INTEGER     NOT NULL CHECK (step_number > 0),
  description       TEXT        NOT NULL,
  image_url         TEXT,
  video_timestamp   INTEGER,
  cue               TEXT,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (exercise_id, step_number)
);

CREATE INDEX idx_exercise_steps_exercise_id ON exercise_steps(exercise_id, step_number);

-- ── 9. Exercise Related (M:N join table) ──────────────────────────────────────

CREATE TABLE public.exercise_related (
  exercise_id   UUID        NOT NULL REFERENCES public.exercises(id) ON DELETE CASCADE,
  related_id    UUID        NOT NULL REFERENCES public.exercises(id) ON DELETE CASCADE,
  sort_order    INTEGER     NOT NULL DEFAULT 0,
  PRIMARY KEY (exercise_id, related_id),
  CHECK (exercise_id <> related_id)
);

-- ── 10. Contact Submissions ───────────────────────────────────────────────────

CREATE TABLE public.contact_submissions (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  name            TEXT        NOT NULL,
  email           TEXT        NOT NULL,
  phone           TEXT,
  subject         TEXT,
  message         TEXT        NOT NULL,
  is_read         BOOLEAN     NOT NULL DEFAULT FALSE,
  read_by         UUID        REFERENCES auth.users(id) ON DELETE SET NULL,
  read_at         TIMESTAMPTZ,
  replied_at      TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_contact_submissions_is_read ON contact_submissions(is_read);
CREATE INDEX idx_contact_submissions_created_at ON contact_submissions(created_at DESC);
