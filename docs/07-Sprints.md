# Development History — Gym56

| Metadata | Value |
|----------|-------|
| **Version** | 1.0.0 |
| **Updated** | 2026-07-08 |
| **Sprints Completed** | 4 |

---

## Sprint 1 — Foundation

**Goal:** Next.js 15 App Router setup + database + auth + public pages

### Delivered

- Next.js 15 App Router project with TypeScript
- Supabase database schema (13 migrations covering all tables)
  - Core tables: profiles, membership_plans, subscriptions, equipment, exercises, exercise_steps, contact_submissions
  - Join tables: equipment_related, exercise_related
  - Storage: equipment_images
- Supabase three-client pattern:
  - `lib/supabase-browser.ts` — `createBrowserClient`
  - `lib/supabase-server.ts` — `createServerClient` (cookies)
  - `lib/supabase-admin.ts` — `createClient` (service_role)
- Auth flow: login, signup, password reset, OAuth callback
  - `middleware.ts` — redirects unauthenticated users from `/admin` and `/dashboard`
  - `app/auth/callback/route.ts` — handles OAuth code exchange
  - `lib/AuthContext.tsx` — client-side session + admin role detection
- Public pages: Homepage, About, Services, Contact, Classes, Nutrition Hub, Community, Tools
- Exercise encyclopedia: 900+ exercises migrated from ExerciseDB
  - Categories: Chest, Back, Shoulders, Legs, Arms, Core, Cardio
  - GIFs served via ImageKit CDN (`ik.imagekit.io/yuhonas`)
- Equipment library: 40+ equipment items with encyclopedia data
  - Categories: Cardio, Strength, Free Weights, Machines, Functional, Recovery, Other
- Seed data: membership plans (4 tiers), admin user
- PWA manifest (`app/manifest.ts`)
- JSON-LD structured data in root layout
- Dynamic OG image generation (`app/opengraph-image.tsx`)
- Custom scrollbar styling
- SEO: sitemap, robots.txt
- Cookie consent banner (in root layout)

### Migrations Created

001 → 008 (core schema, RLS, storage, JWT hook, seeds, fixes)

---

## Sprint 2 — Admin Panel & Member Features

**Goal:** Full admin CRUD, member dashboard, fitness tools

### Delivered

- Admin panel layout: sidebar, header with auth check
  - `app/(admin)/admin/layout.tsx` — sidebar navigation
  - Dark admin theme (`admin-surface`, `admin-elevated`, `admin-sidebar`)
- Admin CRUD pages:
  - Equipment management: list, create, edit, soft delete, undelete
  - Exercise management: list, create, edit, step management, soft delete
  - Contact inbox: list, mark read, mark all read, delete
  - Gallery, FAQs, Articles, Announcements, Testimonials, Analytics, Settings
- Member dashboard:
  - `app/(member)/dashboard/` — overview page
  - `app/(member)/dashboard/profile/` — profile editing with avatar upload (Supabase Storage)
- Exercise comparison tool (`app/(public)/exercise-compare/`)
- Fitness calculators in Tools (`/tools`):
  - BMR/TDEE, 1RM, Macro, BMI, Calorie
- Server Actions created:
  - `lib/actions/contact.ts` — 5 actions (submit, list, mark read, mark all, delete)
  - `lib/actions/equipment.ts` — 10+ actions (full CRUD + relations)
  - `lib/actions/exercises.ts` — 12+ actions (full CRUD + steps + relations)
- UI component library built:
  - Button, Card, Modal, Toast, Input, Select, Table, Badge, Breadcrumb, Pagination, Skeleton, Textarea
  - All with TypeScript, accessibility, dark theme
- Tailwind config with custom tokens:
  - Colors: accent (red), glass, admin surfaces
  - Shadows: accent, glass, card
- CSS animations in `globals.css`:
  - float, pulse-glow, shimmer, bounce-gentle, hover-lift, hover-zoom

### Migrations Created

009 → 013 (encyclopedia upgrades, additional seeds)

---

## Sprint 3 — AI Coach

**Goal:** Streaming AI chat for fitness advice

### Delivered

- AI Coach endpoint (`POST /api/chat`)
  - Raw `fetch()` to NVIDIA `integrate.api.nvidia.com/v1/chat/completions`
  - SSE passthrough (no re-encoding)
  - System prompt in `lib/ai/system-prompt.ts`
  - Returns 503 if `BLUESMINDS_API_KEY` not set
- Frontend chat interface (`app/(public)/ai-coach/page.tsx`)
  - SSE parsing: extracts `choices[0].delta.content` from `data: {...}` lines
  - Handles `[DONE]` sentinel
  - Copy, Regenerate, Stop buttons
  - Suggested prompts grid
  - Conversation persistence in localStorage
- AI SDK (`ai` package ^7.0.16) installed but not used for this route
- Environment variables:
  - `BLUESMINDS_API_KEY`, `BLUESMINDS_BASE_URL`, `BLUESMINDS_MODEL`

### Known Issue

- NVIDIA GLM-5.2 cold start ~60-90s on first request after inactivity

---

## Sprint 4 — Polish & Production

**Goal:** Security hardening, error handling, deployment

### Delivered

- Security headers in `next.config.ts`:
  - HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy
  - CSP not configured (known gap)
- Edge middleware (`middleware.ts`):
  - Route protection for `/admin/*` and `/dashboard/*`
  - Redirect auth users from login/signup pages
  - Cookie-based session detection
- Error handling:
  - `app/error.tsx` — global error boundary with Try Again button
  - `app/not-found.tsx` — custom 404 page
  - `app/loading.tsx` — root loading spinner
- Vitest setup:
  - 4 test files in `tests/`
  - Supabase mocking pattern
  - Server Action unit tests
- Deployment:
  - Vercel production deploy
  - Env vars configured in Vercel UI
- Reduced motion support (`prefers-reduced-motion`)
- PWA offline page (`/offline`)
- ESLint + Prettier configuration

---

## Sprint Status Summary

| Sprint | Focus | Status |
|--------|-------|--------|
| 1 | Foundation (Next.js, DB, Auth, Public Pages) | ✅ Done |
| 2 | Admin Panel, CRUD, Member Dashboard, Tools | ✅ Done |
| 3 | AI Coach (NVIDIA GLM-5.2, SSE streaming) | ✅ Done |
| 4 | Polish, Security, Error Handling, Deploy | ✅ Done |

### Not Implemented (Future Phases)

- Stripe payments (memberships are admin-managed)
- Resend email sending (contact form inserts to DB only)
- TanStack Query (all data fetching via Server Actions)
- React Hook Form (forms are controlled components)
- Prisma (Supabase JS client used directly)
- Cloudflare R2 (Supabase Storage used instead)
- Sentry error tracking
- Playwright E2E tests
- Class booking system
- Workout builder (AI-guided)
- Favorites / saved exercises
- i18n (Gujarati/Hindi)
- Content-Security-Policy header
- CI/CD pipeline (GitHub Actions)
