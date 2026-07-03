# Database Schema

## Overview

PostgreSQL database hosted on Supabase. All migrations in `supabase/migrations/`.  
RLS enabled on all tables. The `service_role` key (via `supabase-admin.ts`) bypasses RLS for admin operations.

## Tables

### `profiles`
User profiles linked to Supabase Auth. Auto-created via trigger on `auth.users` insert.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID PK | References `auth.users(id)` ON DELETE CASCADE |
| full_name | TEXT | User's display name |
| phone | TEXT | Phone number |
| avatar_url | TEXT | Avatar image URL (Supabase Storage) |
| role | TEXT | `member`, `admin`, or `trainer` (default `member`) |
| created_at | TIMESTAMPTZ | |
| updated_at | TIMESTAMPTZ | Auto-updated via `moddatetime` trigger |

### `membership_plans`
Gym membership pricing tiers.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID PK | `gen_random_uuid()` |
| name | TEXT | Plan name (e.g. "1 Month", "6 Months") |
| duration_months | INTEGER | Duration in months |
| currency | TEXT | ISO 4217 currency code (default `INR`) |
| price_minor | INTEGER | Price in minor units (paise for INR) |
| savings_label | TEXT | Discount label (e.g. "Save ₹2000") |
| is_featured | BOOLEAN | Featured on pricing section |
| is_active | BOOLEAN | Available for purchase |
| sort_order | INTEGER | Display order |
| created_at | TIMESTAMPTZ | |
| updated_at | TIMESTAMPTZ | |

### `subscriptions`
User membership subscriptions.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID PK | |
| user_id | UUID FK | References `auth.users(id)` ON DELETE CASCADE |
| plan_id | UUID FK | References `membership_plans(id)` ON DELETE RESTRICT |
| starts_at | DATE | Subscription start |
| expires_at | DATE | Subscription end (CHECK > starts_at) |
| payment_status | TEXT | `pending`, `paid`, `failed`, `refunded`, `cancelled` |
| payment_ref | TEXT | Razorpay/Stripe payment ID |
| payment_gateway | TEXT | `razorpay`, `stripe`, `cash`, `manual` |
| amount_paid_minor | INTEGER | Actual amount charged |
| currency | TEXT | Default `INR` |
| notes | TEXT | Admin notes |
| created_by | UUID FK | References `auth.users(id)` ON DELETE SET NULL |
| created_at | TIMESTAMPTZ | |
| updated_at | TIMESTAMPTZ | |

**View:** `active_subscriptions` — filters `paid` status with current date range.

### `equipment`
Gym equipment inventory. Supports soft delete.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID PK | |
| name | TEXT | Equipment name |
| slug | TEXT UNIQUE | URL-friendly identifier |
| category | TEXT | `Cardio`, `Strength`, `Free Weights`, `Machines`, `Functional`, `Recovery`, `Other` |
| description | TEXT | Detailed description |
| quantity | INTEGER | Number available (default 1) |
| condition | TEXT | `excellent`, `good`, `fair`, `maintenance`, `retired` |
| location | TEXT | Gym floor location |
| how_to_use | TEXT[] | Usage instructions |
| safety_tips | TEXT[] | Safety guidelines |
| is_available | BOOLEAN | Currently usable |
| is_published | BOOLEAN | Visible on public site (draft by default) |
| primary_image_url | TEXT | Main image URL |
| sort_order | INTEGER | Display order |
| created_by | UUID FK | |
| updated_by | UUID FK | |
| deleted_at | TIMESTAMPTZ | Soft-delete timestamp |
| created_at | TIMESTAMPTZ | |
| updated_at | TIMESTAMPTZ | |

### `equipment_images`
Normalized image gallery for equipment.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID PK | |
| equipment_id | UUID FK | References `equipment(id)` ON DELETE CASCADE |
| url | TEXT | Image URL (Supabase Storage) |
| alt_text | TEXT | SEO + accessibility text |
| sort_order | INTEGER | Display order |
| is_primary | BOOLEAN | Hero image flag |
| created_at | TIMESTAMPTZ | |

### `equipment_related`
Related equipment M:N join table.

| Column | Type | Description |
|--------|------|-------------|
| equipment_id | UUID FK | References `equipment(id)` ON DELETE CASCADE |
| related_id | UUID FK | References `equipment(id)` ON DELETE CASCADE |
| sort_order | INTEGER | Display order |
| PRIMARY KEY | (equipment_id, related_id) | No self-references allowed |

### `exercises`
Exercise library. Supports soft delete.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID PK | |
| name | TEXT | Exercise name |
| slug | TEXT UNIQUE | URL-friendly identifier |
| category | TEXT | `Chest`, `Back`, `Shoulders`, `Legs`, `Arms`, `Core`, `Cardio`, `Glutes`, `Obliques`, `Abs` |
| muscle_group | TEXT | Primary muscle group |
| equipment_id | UUID FK | References `equipment(id)` ON DELETE SET NULL |
| equipment_label | TEXT | Fallback text when no FK |
| difficulty | TEXT | `Beginner`, `Intermediate`, `Advanced` |
| target_muscles | TEXT[] | Muscles worked |
| common_mistakes | TEXT[] | Common form errors |
| safety_tips | TEXT[] | Safety precautions |
| primary_image_url | TEXT | Main image |
| video_url | TEXT | YouTube embed ID or storage URL |
| is_published | BOOLEAN | Visible on public site (draft by default) |
| sort_order | INTEGER | Display order |
| created_by | UUID FK | |
| updated_by | UUID FK | |
| deleted_at | TIMESTAMPTZ | Soft-delete timestamp |
| created_at | TIMESTAMPTZ | |
| updated_at | TIMESTAMPTZ | |

### `exercise_steps`
Step-by-step instructions. Replaces a flat `instructions` array.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID PK | |
| exercise_id | UUID FK | References `exercises(id)` ON DELETE CASCADE |
| step_number | INTEGER | Order (UNIQUE per exercise) |
| description | TEXT | Instruction text |
| image_url | TEXT | Step illustration |
| video_timestamp | INTEGER | Seconds into exercise video |
| cue | TEXT | Short coaching cue |
| created_at | TIMESTAMPTZ | |

### `exercise_related`
Related exercises M:N join table.

| Column | Type | Description |
|--------|------|-------------|
| exercise_id | UUID FK | References `exercises(id)` ON DELETE CASCADE |
| related_id | UUID FK | References `exercises(id)` ON DELETE CASCADE |
| sort_order | INTEGER | Display order |
| PRIMARY KEY | (exercise_id, related_id) | No self-references allowed |

### `contact_submissions`
Contact form submissions.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID PK | |
| name | TEXT | Sender name |
| email | TEXT | Sender email |
| phone | TEXT | Optional phone |
| subject | TEXT | Message subject |
| message | TEXT | Message body |
| is_read | BOOLEAN | Admin read status |
| read_by | UUID FK | References `auth.users(id)` ON DELETE SET NULL |
| read_at | TIMESTAMPTZ | When read |
| replied_at | TIMESTAMPTZ | When replied |
| created_at | TIMESTAMPTZ | Submission time |

## Row Level Security

All tables have RLS enabled. Policies are defined in migration `002_rls_policies.sql`.

- **Public (anon):** Read published equipment, exercises, membership plans. Create contact submissions.
- **Authenticated:** Read/write own profile, own subscriptions, own bookings.
- **Admin:** Full access via `auth.jwt() ->> 'user_role' = 'admin'` check (from JWT custom claims hook).

## Storage Buckets

| Bucket | Access | Path Pattern |
|--------|--------|-------------|
| `avatars` | Private (owner) | `{user_id}/avatar.{ext}` |
| `equipment-images` | Public read, admin write | `{equipment_id}/{filename}` |
| `exercise-media` | Public read, admin write | `{exercise_id}/{type}/{filename}` |

## Migrations

| # | File | Description |
|---|------|-------------|
| 001 | `001_core_tables.sql` | Core tables: profiles, membership_plans, subscriptions, equipment, equipment_images, exercises, exercise_steps, exercise_related, contact_submissions |
| 002 | `002_rls_policies.sql` | Row Level Security policies for all tables |
| 003 | `003_storage_buckets.sql` | Supabase Storage bucket setup |
| 004 | `004_custom_access_token_hook.sql` | JWT access token hook for `user_role` claim |
| 005 | `005_seed_data.sql` | Seed data: equipment, exercises, membership plans |
| 006 | `006_equipment_supplementary_fields.sql` | Added `how_to_use`, `safety_tips` to equipment; created `equipment_related` table |
| 007 | `007_fix_exercise_categories.sql` | Extended exercise categories to include Glutes, Obliques, Abs |

## Triggers

- `handle_new_user()` — auto-creates `profiles` row on auth signup
- `moddatetime` — auto-updates `updated_at` on profiles, equipment, exercises, subscriptions, membership_plans
