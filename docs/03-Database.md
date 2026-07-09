# Database — Gym56

| Metadata | Value |
|----------|-------|
| **Version** | 1.0.0 |
| **Updated** | 2026-07-08 |
| **Engine** | Supabase PostgreSQL |
| **Migrations** | 13 files in `supabase/migrations/` |

---

## 1. Schema Overview

```
profiles              (extends auth.users)
membership_plans
subscriptions
equipment
equipment_images
equipment_related
exercises
exercise_steps
exercise_related
contact_submissions
```

All tables use:
- `UUID` primary keys with `gen_random_uuid()`
- `TIMESTAMPTZ` for timestamps
- TEXT columns with CHECK constraints (not ENUMs) for fixed values
- Soft delete via `deleted_at TIMESTAMPTZ` where applicable
- Auto-updating `updated_at` via `moddatetime` trigger

---

## 2. Table Definitions

### 2.1 `profiles`

Extends `auth.users` — created automatically via `handle_new_user()` trigger.

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| `id` | UUID | PK → `auth.users(id)` ON DELETE CASCADE | Matches Supabase auth user ID |
| `full_name` | TEXT | | From `raw_user_meta_data->>'full_name'` or email |
| `phone` | TEXT | | |
| `avatar_url` | TEXT | | Supabase storage URL |
| `role` | TEXT | NOT NULL DEFAULT 'member' CHECK (member,admin,trainer) | Used for RLS |
| `created_at` | TIMESTAMPTZ | NOT NULL DEFAULT NOW() | |
| `updated_at` | TIMESTAMPTZ | NOT NULL DEFAULT NOW() | Auto-updated by trigger |

**Triggers:**
- `on_auth_user_created` (AFTER INSERT on auth.users) — creates profile row
- `handle_profiles_updated_at` (BEFORE UPDATE) — updates `updated_at`

**Index:** `idx_profiles_role` on `role`

### 2.2 `membership_plans`

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| `id` | UUID | PK DEFAULT gen_random_uuid() | |
| `name` | TEXT | NOT NULL | e.g. "1 Month" |
| `duration_months` | INTEGER | NOT NULL CHECK (>0) | |
| `currency` | TEXT | NOT NULL DEFAULT 'INR' | |
| `price_minor` | INTEGER | NOT NULL CHECK (>=0) | Price in paise (₹1500 → 150000) |
| `savings_label` | TEXT | | e.g. "Save 11%" |
| `is_featured` | BOOLEAN | NOT NULL DEFAULT FALSE | Highlight on pricing page |
| `is_active` | BOOLEAN | NOT NULL DEFAULT TRUE | Soft enable/disable |
| `sort_order` | INTEGER | NOT NULL DEFAULT 0 | Display order |
| `created_at` | TIMESTAMPTZ | NOT NULL DEFAULT NOW() | |
| `updated_at` | TIMESTAMPTZ | NOT NULL DEFAULT NOW() | |

**Index:** `idx_membership_plans_active` on `(is_active, sort_order)`

### 2.3 `subscriptions`

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| `id` | UUID | PK DEFAULT gen_random_uuid() | |
| `user_id` | UUID | NOT NULL → `auth.users(id)` ON DELETE CASCADE | |
| `plan_id` | UUID | NOT NULL → `membership_plans(id)` ON DELETE RESTRICT | |
| `starts_at` | DATE | NOT NULL | Start date |
| `expires_at` | DATE | NOT NULL CHECK (> starts_at) | Expiry date |
| `payment_status` | TEXT | NOT NULL DEFAULT 'pending' CHECK (pending,paid,failed,refunded,cancelled) | |
| `payment_ref` | TEXT | | External payment reference |
| `payment_gateway` | TEXT | | e.g. "razorpay", "stripe" |
| `amount_paid_minor` | INTEGER | | In paise |
| `currency` | TEXT | NOT NULL DEFAULT 'INR' | |
| `notes` | TEXT | | Admin notes |
| `created_by` | UUID | → `auth.users(id)` ON DELETE SET NULL | Admin who created |
| `created_at` | TIMESTAMPTZ | NOT NULL DEFAULT NOW() | |
| `updated_at` | TIMESTAMPTZ | NOT NULL DEFAULT NOW() | |

**Indexes:** `user_id`, `plan_id`, `expires_at`, `payment_status`

### 2.4 `equipment`

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| `id` | UUID | PK DEFAULT gen_random_uuid() | |
| `name` | TEXT | NOT NULL | |
| `slug` | TEXT | NOT NULL UNIQUE | URL-friendly |
| `category` | TEXT | NOT NULL CHECK (Cardio,Strength,Free Weights,Machines,Functional,Recovery,Other) | |
| `description` | TEXT | | |
| `quantity` | INTEGER | NOT NULL DEFAULT 1 CHECK (>=0) | |
| `condition` | TEXT | NOT NULL DEFAULT 'good' CHECK (excellent,good,fair,maintenance,retired) | |
| `location` | TEXT | | Physical location |
| `is_available` | BOOLEAN | NOT NULL DEFAULT TRUE | |
| `is_published` | BOOLEAN | NOT NULL DEFAULT FALSE | Public visibility |
| `primary_image_url` | TEXT | | |
| `difficulty` | TEXT | | Added in migration 011 |
| `muscles_trained` | TEXT | | Comma-separated |
| `secondary_muscles` | TEXT | | Added in migration 013 |
| `common_mistakes` | TEXT[] | NOT NULL DEFAULT '{}' | |
| `safety_tips` | TEXT[] | NOT NULL DEFAULT '{}' | |
| `maintenance_tips` | TEXT[] | NOT NULL DEFAULT '{}' | |
| `instructions` | TEXT | | |
| `how_to_use` | TEXT | | |
| `seat_adjustment` | TEXT | | Added in migration 013 |
| `sort_order` | INTEGER | NOT NULL DEFAULT 0 | |
| `created_by` | UUID | → `auth.users(id)` ON DELETE SET NULL | |
| `updated_by` | UUID | → `auth.users(id)` ON DELETE SET NULL | |
| `deleted_at` | TIMESTAMPTZ | | Soft delete |
| `created_at` | TIMESTAMPTZ | NOT NULL DEFAULT NOW() | |
| `updated_at` | TIMESTAMPTZ | NOT NULL DEFAULT NOW() | |

**Indexes:** `slug`, `category`, `is_published` (partial, WHERE deleted_at IS NULL)

### 2.5 `equipment_images`

| Column | Type | Constraints |
|--------|------|-------------|
| `id` | UUID | PK DEFAULT gen_random_uuid() |
| `equipment_id` | UUID | NOT NULL → `equipment(id)` ON DELETE CASCADE |
| `url` | TEXT | NOT NULL |
| `alt_text` | TEXT | |
| `sort_order` | INTEGER | NOT NULL DEFAULT 0 |
| `is_primary` | BOOLEAN | NOT NULL DEFAULT FALSE |
| `created_at` | TIMESTAMPTZ | NOT NULL DEFAULT NOW() |

**Indexes:** `equipment_id`, `(equipment_id, sort_order)`

### 2.6 `equipment_related` (M:N join)

| Column | Type | Constraints |
|--------|------|-------------|
| `equipment_id` | UUID | NOT NULL → `equipment(id)` ON DELETE CASCADE |
| `related_id` | UUID | NOT NULL → `equipment(id)` ON DELETE CASCADE |
| `sort_order` | INTEGER | NOT NULL DEFAULT 0 |

**PK:** `(equipment_id, related_id)` with CHECK (equipment_id <> related_id)

### 2.7 `exercises`

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| `id` | UUID | PK DEFAULT gen_random_uuid() | |
| `name` | TEXT | NOT NULL | |
| `slug` | TEXT | NOT NULL UNIQUE | |
| `category` | TEXT | NOT NULL CHECK (Chest,Back,Shoulders,Legs,Arms,Core,Cardio) | Extended in migration 007 with more values |
| `muscle_group` | TEXT | | |
| `equipment_id` | UUID | → `equipment(id)` ON DELETE SET NULL | |
| `equipment_label` | TEXT | | Free-text equipment name |
| `difficulty` | TEXT | NOT NULL CHECK (Beginner,Intermediate,Advanced) | |
| `target_muscles` | TEXT[] | NOT NULL DEFAULT '{}' | |
| `secondary_muscles` | TEXT[] | NOT NULL DEFAULT '{}' | Added in migration 009 |
| `instructions` | TEXT | | |
| `pro_tips` | TEXT | | Added in migration 013 |
| `common_mistakes` | TEXT[] | NOT NULL DEFAULT '{}' | |
| `safety_tips` | TEXT[] | NOT NULL DEFAULT '{}' | |
| `gif_url` | TEXT | | Added in migration 013 (ExerciseDB GIFs) |
| `primary_image_url` | TEXT | | |
| `video_url` | TEXT | | |
| `is_published` | BOOLEAN | NOT NULL DEFAULT FALSE | |
| `sort_order` | INTEGER | NOT NULL DEFAULT 0 | |
| `created_by` | UUID | → `auth.users(id)` ON DELETE SET NULL | |
| `updated_by` | UUID | → `auth.users(id)` ON DELETE SET NULL | |
| `deleted_at` | TIMESTAMPTZ | | Soft delete |
| `created_at` | TIMESTAMPTZ | NOT NULL DEFAULT NOW() | |
| `updated_at` | TIMESTAMPTZ | NOT NULL DEFAULT NOW() | |

**Indexes:** `slug`, `category`, `difficulty`, `equipment_id`, `is_published` (partial)

### 2.8 `exercise_steps`

| Column | Type | Constraints |
|--------|------|-------------|
| `id` | UUID | PK DEFAULT gen_random_uuid() |
| `exercise_id` | UUID | NOT NULL → `exercises(id)` ON DELETE CASCADE |
| `step_number` | INTEGER | NOT NULL CHECK (>0), UNIQUE per exercise |
| `description` | TEXT | NOT NULL |
| `image_url` | TEXT | |
| `video_timestamp` | INTEGER | Seconds (not MM:SS) |
| `cue` | TEXT | Training cue |
| `created_at` | TIMESTAMPTZ | NOT NULL DEFAULT NOW() |

**Index:** `(exercise_id, step_number)`

### 2.9 `exercise_related` (M:N join)

| Column | Type | Constraints |
|--------|------|-------------|
| `exercise_id` | UUID | NOT NULL → `exercises(id)` ON DELETE CASCADE |
| `related_id` | UUID | NOT NULL → `exercises(id)` ON DELETE CASCADE |
| `sort_order` | INTEGER | NOT NULL DEFAULT 0 |

**PK:** `(exercise_id, related_id)` with CHECK (exercise_id <> related_id)

### 2.10 `contact_submissions`

| Column | Type | Constraints |
|--------|------|-------------|
| `id` | UUID | PK DEFAULT gen_random_uuid() |
| `name` | TEXT | NOT NULL |
| `email` | TEXT | NOT NULL |
| `phone` | TEXT | |
| `subject` | TEXT | |
| `message` | TEXT | NOT NULL |
| `is_read` | BOOLEAN | NOT NULL DEFAULT FALSE |
| `read_by` | UUID | → `auth.users(id)` ON DELETE SET NULL |
| `read_at` | TIMESTAMPTZ | |
| `replied_at` | TIMESTAMPTZ | |
| `created_at` | TIMESTAMPTZ | NOT NULL DEFAULT NOW() |

**Indexes:** `is_read`, `created_at DESC`

---

## 3. Views

### 3.1 `active_subscriptions`

```sql
CREATE VIEW public.active_subscriptions AS
  SELECT * FROM public.subscriptions
  WHERE payment_status = 'paid'
    AND starts_at <= CURRENT_DATE
    AND expires_at >= CURRENT_DATE;
```

---

## 4. Functions

### 4.1 `handle_new_user()`

Trigger function — creates `profiles` row on `auth.users` insert:

```sql
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
```

### 4.2 `is_admin()`

Returns true if current user has admin role (used in RLS policies):

```sql
-- Injects role via custom JWT access token hook (migration 004)
-- RLS checks: auth.jwt() ->> 'user_role' = 'admin'
```

---

## 5. Row-Level Security

All tables have RLS enabled. Two access patterns:

1. **Service Role (Server Actions):** Uses `SUPABASE_SERVICE_ROLE_KEY` — bypasses RLS entirely
2. **Authenticated User (Browser):** Uses Supabase anon key — RLS enforced via JWT claims

RLS policies:
- `profiles`: users can read/update own profile; admins can read all
- `exercises`/`equipment`: public can read published items; admins can CRUD all
- `contact_submissions`: admins only (CRUD)
- `subscriptions`: users can view own; admins can view all

---

## 6. Storage Buckets

| Bucket | Purpose | File Size Limit | Allowed MIME |
|--------|---------|-----------------|--------------|
| `avatars` | User profile images | 10 MB | image/* |
| `equipment-images` | Equipment photos | 8 MB (8,388,608 bytes) | image/* |
| `exercise-media` | Exercise demos (GIFs, videos) | 500 MB (524,288,000 bytes) | image/*, video/* |

Storage policies allow authenticated users to upload; public read access.

---

## 7. Seed Data

### 7.1 Membership Plans

| Name | Duration | Price | Savings |
|------|----------|-------|---------|
| 1 Month | 1 month | ₹1,500 | — |
| 3 Months | 3 months | ₹4,000 | — |
| 6 Months | 6 months | ₹7,000 | — |
| 12 Months | 12 months | ₹9,000 | Save ₹3,000 |

### 7.2 Equipment

~40 items across all categories (Cardio, Strength, Free Weights, Machines, Functional, Recovery, Other) with encyclopedia data (how_to_use, safety_tips, etc.).

### 7.3 Exercises

~900+ exercises seeded from ExerciseDB, each with:
- Name, slug, category, difficulty
- target_muscles, secondary_muscles
- GIF URL (from `ik.imagekit.io/yohonas` via ExerciseDB)
- Common mistakes, safety tips

### 7.4 Admin User

Default admin account seeded for initial access.

---

## 8. Indexes Summary

| Table | Indexes |
|-------|---------|
| `profiles` | `idx_profiles_role` |
| `membership_plans` | `idx_membership_plans_active` |
| `subscriptions` | `user_id`, `plan_id`, `expires_at`, `payment_status` |
| `equipment` | `slug`, `category`, `is_published` (partial) |
| `equipment_images` | `equipment_id`, `(equipment_id, sort_order)` |
| `exercises` | `slug`, `category`, `difficulty`, `equipment_id`, `is_published` (partial) |
| `exercise_steps` | `(exercise_id, step_number)` |
| `contact_submissions` | `is_read`, `created_at DESC` |

---

## 9. Extension Requirements

```sql
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "moddatetime";
```

- `pgcrypto` — `gen_random_uuid()` function
- `moddatetime` — Automatic `updated_at` trigger function

---

## 10. Migration History

| # | File | Change |
|---|------|--------|
| 001 | `001_core_tables.sql` | Core schema (profiles, plans, subscriptions, equipment, equipment_images, exercises, exercise_steps, exercise_related, contact_submissions) |
| 002 | `002_rls_policies.sql` | RLS on all tables |
| 003 | `003_storage_buckets.sql` | Storage buckets + policies |
| 004 | `004_custom_access_token_hook.sql` | JWT hook for user_role |
| 005 | `005_seed_data.sql` | Initial seed (plans, equipment, exercises, admin) |
| 006 | `006_equipment_supplementary_fields.sql` | Equipment: how_to_use, safety_tips, equipment_related table |
| 007 | `007_fix_exercise_categories.sql` | Extended exercise categories |
| 008 | `008_fix_membership_duplicates.sql` | Dedup + UNIQUE constraint on plan name |
| 009 | `009_exercise_encyclopedia.sql` | Exercises: secondary_muscles, instructions, etc. |
| 010 | `010_seed_more_exercises.sql` | 200 additional exercise seeds |
| 011 | `011_equipment_encyclopedia.sql` | Equipment: encyclopedia columns |
| 012 | `012_seed_more_equipment.sql` | 35+ additional equipment seeds |
| 013 | `013_encyclopedia_upgrades.sql` | pro_tips, seat_adjustment, exercise GIFs |

---

## 11. Migration Strategy

- All migrations in `supabase/migrations/` directory
- Apply via Supabase Dashboard SQL Editor or `supabase db push`
- Each migration is idempotent (uses `IF NOT EXISTS`, `ADD COLUMN IF NOT EXISTS`)
- Seed data includes dedup logic (migration 008)
- Rollback: reverse migration (DROP TABLE / ALTER TABLE DROP COLUMN)
