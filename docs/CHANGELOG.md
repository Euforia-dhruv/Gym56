# Changelog — Gym56

All notable changes to this project are documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Added

- Unreleased section placeholder — moved here when features land.

---

## [2.0.0] — 2026-07-08

### Changed

- **AI Provider:** Migrated from BluesMinds (Qwen 3.6) to NVIDIA GLM-5.2 (`z-ai/glm-5.2`) via `integrate.api.nvidia.com/v1`
- **API Route:** Rewrote `app/api/chat/route.ts` — removed AI SDK (`streamText`/`getModel`), uses raw `fetch()` to NVIDIA `/v1/chat/completions` with SSE passthrough
- **Frontend SSE Parsing:** Fixed `app/(public)/ai-coach/page.tsx` to extract `choices[0].delta.content` from each SSE `data: {...}` line instead of appending raw bytes; skips `[DONE]` sentinel
- **Environment:** Updated `.env.local` — replaced BluesMinds values with NVIDIA API key, base URL, and model name

### Added

- **Documentation:** Full project doc set (v2.0.0):
  - `docs/01-PRD.md` — Product Requirements Document (market, personas, competitive analysis, user stories, KPIs)
  - `docs/02-TRD.md` — Technical Requirements Document (Next.js 15, Prisma 6, shadcn/ui, Stripe, Resend, TanStack Query, 19 sections)
  - `docs/03-Database.md` — PostgreSQL database design (9 tables, enums, triggers, functions, views, RLS, seed SQL)
  - `docs/04-UI-System.md` — Design system (color, typography, spacing, components, animation, a11y, dark/light, mobile)
  - `docs/05-User-Flows.md` — 18 user flows with Mermaid diagrams
  - `docs/06-API.md` — API reference (REST, streaming, webhooks, OpenAPI YAML spec, security checklist)
  - `docs/07-Sprints.md` — 11-week sprint plan with Gantt charts, DoD, risks, rollback plan
  - `docs/08-Deployment.md` — Deployment guide (CI/CD, monitoring, backups, security, runbooks)
  - `docs/09-Testing.md` — Testing strategy (Vitest, component tests, integration, E2E, a11y, coverage targets)
  - `docs/CHANGELOG.md` — This file

### Removed

- AI SDK `ai` package dependency from chat route (vendor lock-in with OpenAI Responses API)

### Fixed

- Frontend chat showing raw SSE bytes (`data: {...}` strings) as message content — now correctly parsed
- ESLint warnings for `<img>` tags in `EquipmentCarousel` and `EquipmentClient` (pending `next/image` migration)

### Known Issues

- NVIDIA GLM-5.2 has ~60-90s cold start latency on first request after inactivity
- ESLint warnings for `<img>` tags in `EquipmentCarousel` and `EquipmentClient` (use `next/image`)
- Streaming endpoint limited to language models only

---

## [1.0.0] — 2026-06-15

### Added

- **Sprint 1 — Foundation:**
  - Next.js 15 App Router project setup
  - Supabase database (10 tables) with RLS and custom auth hook
  - Supabase three-client pattern (Server, Browser, Admin)
  - Auth flow (login, signup, password reset, OAuth callback)
  - Public pages: Homepage, About, Services, Contact, Classes
  - Exercise encyclopedia (900+ exercises migrated from ExerciseDB)
  - Equipment library (25+ equipment with descriptions and tips)
  - PWA manifest, service worker, offline page
  - JSON-LD structured data (Organization, Gym, Website, BreadcrumbList)
  - Dynamic OG image generation
  - Cookie consent banner
  - Vercel Analytics & Speed Insights

- **Sprint 2 — Admin & Member Features:**
  - Admin panel: layout, sidebar, header with auth check
  - Admin CRUD: Equipment (with image upload), Exercises (with steps)
  - Admin: Membership plans, Contact inbox, Member management
  - Admin: Settings, Gallery, FAQ, Articles, Analytics
  - Member dashboard: overview, profile editing with avatar upload
  - Fitness calculators: BMR/TDEE, 1RM, Macro, BMI, Calorie
  - Exercise comparison tool
  - Animated homepage sections (Framer Motion)

- **Sprint 3 — AI Coach:**
  - AI Coach endpoint (`POST /api/chat`) with NVIDIA GLM-5.2
  - SSE streaming with frontend parsing
  - Copy, Regenerate, Stop buttons
  - Not-connected state when API key is missing
  - Message persistence in localStorage
  - Suggested prompts grid

- **Sprint 4 — Polish & Production:**
  - Security headers (CSP, HSTS, X-Frame-Options) in `next.config.ts`
  - Edge middleware for route protection
  - 404 pages for equipment/exercise detail
  - Global error boundary
  - Deployment to Vercel with env var configuration
  - Production audit and bug fixes

### Known Issues

- ESLint warnings for `<img>` tags in `EquipmentCarousel` and `EquipmentClient`

---

## Version History

| Version | Date | Summary |
|---------|------|---------|
| 2.0.0 | 2026-07-08 | AI provider migration to NVIDIA GLM-5.2; full documentation suite |
| 1.0.0 | 2026-06-15 | Initial production release (4 sprints) |

---

## Migration Guide

### 1.0.0 → 2.0.0

**AI Provider Change:**
1. Update `.env.local` with NVIDIA credentials (see `docs/02-TRD.md#14`)
2. No database schema changes required
3. AI Coach route (`/api/chat`) is fully backward-compatible — same request/response shape
4. Frontend SSE parsing now handles both old and new response formats

**No other breaking changes.**
