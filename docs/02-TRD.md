# Technical Requirements Document — Gym56

| Metadata | Value |
|----------|-------|
| **Version** | 1.0.0 |
| **Updated** | 2026-07-08 |
| **Status** | Released (reflects actual codebase) |

---

## 1. Technology Stack

### 1.1 Core

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| **Framework** | Next.js | 15.5+ | React App Router, SSR, API Routes |
| **Language** | TypeScript | 5.x | Type safety throughout |
| **Styling** | Tailwind CSS | 3.4+ | Utility-first CSS |
| **Animation** | Framer Motion | 12.x | Page transitions, micro-interactions |
| **Icons** | Lucide React | 1.x | Consistent icon library |

### 1.2 Database & Auth

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| **Database** | Supabase PostgreSQL | Managed | All persistent storage |
| **ORM** | Supabase JS Client | 2.110+ | Direct DB queries via Server Actions |
| **Auth** | Supabase SSR | 0.12+ | Authentication + Row-Level Security |
| **Schema** | Raw SQL Migrations | 13 files | Version-controlled schema evolution |

### 1.3 AI

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| **AI Provider** | NVIDIA GLM-5.2 | — | AI Coach chat completions |
| **Integration** | Raw `fetch()` SSE | — | Streaming via `/v1/chat/completions` |

### 1.4 UI

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| **Component Lib** | Custom (no shadcn/ui) | — | Hand-written components with Tailwind + cva |
| **Class Merge** | `clsx` + `tailwind-merge` | 2.x / 3.x | Safe class name composition |
| **Form Validation** | Zod | 4.x | Schema-based validation for Server Actions |

### 1.5 Testing & Quality

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| **Test Runner** | Vitest | 4.x | Unit + integration tests |
| **DOM Testing** | Testing Library | 16.x | Component tests |
| **Linting** | ESLint 9 + Prettier | — | Code quality enforcement |

### 1.6 Infrastructure

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| **Hosting** | Vercel | — | Serverless Next.js deployment |
| **CDN** | ImageKit | — | ExerciseDB image delivery |
| **Analytics** | Vercel Analytics | 2.x | Page views + Web Vitals |

### 1.7 Not Used (Why)

| Technology | Reason |
|-----------|--------|
| Prisma | Supabase JS client provides same query capabilities without build step |
| TanStack Query | Server Actions with React 19's `useActionState` handle mutations natively |
| React Hook Form | Forms use controlled components + Zod validation (simpler for current complexity) |
| Stripe | Payments deferred to Phase 2; membership is admin-managed |

---

## 2. Architecture

### 2.1 Route Groups

```
app/
├── (public)/        # Unauthenticated pages
│   ├── page.tsx             # Homepage
│   ├── about/page.tsx
│   ├── classes/page.tsx
│   ├── contact/page.tsx
│   ├── services/page.tsx
│   ├── equipment/page.tsx + [slug]/page.tsx
│   ├── exercises/page.tsx + [slug]/page.tsx
│   ├── exercise-compare/page.tsx
│   ├── ai-coach/page.tsx
│   ├── nutrition-hub/page.tsx
│   ├── tools/page.tsx + [slug]/page.tsx
│   ├── community/page.tsx
│   ├── login/page.tsx
│   ├── signup/page.tsx
│   ├── forgot-password/page.tsx
│   ├── reset-password/page.tsx
│   └── offline/page.tsx
├── (member)/         # Authenticated member pages
│   └── dashboard/
│       ├── layout.tsx
│       ├── page.tsx
│       └── profile/page.tsx
├── (admin)/          # Admin-only pages
│   └── admin/
│       ├── layout.tsx
│       ├── page.tsx
│       ├── analytics/page.tsx
│       ├── announcements/page.tsx
│       ├── articles/page.tsx
│       ├── contact/page.tsx
│       ├── equipment/page.tsx + new/page.tsx + [slug]/page.tsx
│       ├── exercises/page.tsx + new/page.tsx + [slug]/page.tsx
│       ├── faqs/page.tsx
│       ├── gallery/page.tsx
│       ├── settings/page.tsx
│       └── testimonials/page.tsx
├── api/              # Route Handlers
│   ├── chat/route.ts
│   └── exercises/[id]/route.ts
├── auth/             # Auth callbacks
│   └── callback/route.ts
├── layout.tsx
├── globals.css
├── middleware.ts
└── manifest.ts
```

### 2.2 Data Flow

```
Browser ──▶ React Server Component ──▶ Supabase (service_role)
   │                                            │
   │  Server Actions                            │
   │  onSubmit ▶ Zod validate ▶ Supabase query  │
   │                                            │
   │  Route Handlers                            │
   │  fetch() ▶ NVIDIA API ◀── SSE stream       │
```

- **All CRUD** uses Server Actions with Zod validation
- **Admin operations** use `service_role` Supabase client (bypasses RLS)
- **Public reads** use Supabase server client (RLS enforced)
- **AI streaming** uses raw `fetch()` to NVIDIA with SSE passthrough
- **Auth** is cookie-based via `@supabase/ssr`

### 2.3 Middleware

Edge middleware (`middleware.ts`) handles:
- Redirect authenticated users away from `/login`, `/signup`, `/forgot-password`, `/reset-password`
- Redirect unauthenticated users to `/login` from `/admin/*` and `/dashboard/*`
- Matcher excludes static assets, images, and SEO files

### 2.4 Auth Flow

```
User signs up → Supabase creates auth.users
              → Trigger: handle_new_user() creates profiles row
              → User redirected to dashboard

User logs in  → Supabase session cookie set
              → Middleware allows /dashboard and /admin
              → AuthContext reads session client-side
              → AuthContext queries profiles.role for admin check

User signs out → Cookie cleared
               → Middleware redirects to /login
```

---

## 3. Component Architecture

### 3.1 UI Components (`components/ui/`)

All components are custom-built (not shadcn/ui). They share:
- TypeScript interfaces with full prop types
- `cn()` utility for class merging
- Accessible by default (ARIA attributes, keyboard nav, focus management)
- Dark theme (black backgrounds, white/silver text, red accent)

| Component | Features |
|-----------|----------|
| `Button` | 5 variants (primary/outline/ghost/danger/success), 4 sizes (sm/md/lg/icon), loading spinner |
| `Card` | 3 variants (glass/solid/elevated), 4 padding sizes, sub-components (Header/Title/Content) |
| `Modal` | 4 sizes (sm/md/lg/xl), backdrop blur, focus trap, Escape key, Framer Motion animation |
| `Toast` | 4 variants (success/error/warning/info), auto-dismiss, context provider |
| `Input` | Label, error, hint, left/right icons, ARIA-describedby |
| `Select` | Label, error, hint, placeholder, typed options |
| `Table` | Generic typed columns, sorting, loading skeleton, empty state, accessible sort buttons |
| `Badge` | Inline status/difficulty labels |
| `Breadcrumb` | Navigation breadcrumbs |
| `Pagination` | Page navigation |
| `Skeleton` | Loading placeholder |
| `Textarea` | Multi-line text input |

### 3.2 Server Actions (`lib/actions/`)

| File | Export | Purpose |
|------|--------|---------|
| `contact.ts` | `submitContactForm()` | Zod-validated contact form → insert into `contact_submissions` |
| | `getContactMessages()` | Admin: list all submissions (admin client) |
| | `markAsRead()`, `markAllAsRead()`, `deleteContactMessage()` | Admin: manage submissions |
| `equipment.ts` | Full CRUD (create/update/delete/undelete/get) | Equipment management with image upload |
| | `getRelatedEquipment()`, `updateRelatedEquipment()` | Related equipment links |
| `exercises.ts` | Full CRUD (create/update/delete/get) | Exercise management |
| | `getExercisesByEquipment()`, `getEquipmentForExercise()` | Cross-references |
| | Step management (add/update/reorder/delete) | Exercise steps |

### 3.3 API Routes

| Route | Method | Purpose |
|-------|--------|---------|
| `/api/chat` | POST | AI Coach streaming chat (NVIDIA/BluesMinds) |
| `/api/exercises/[id]` | GET | Single exercise fetch by UUID |

---

## 4. Database

See `docs/03-Database.md` for full schema.

**Key design decisions:**
- TEXT columns with CHECK constraints instead of ENUMs (simpler migrations, no ENUM reordering issues)
- Soft delete via `deleted_at` TIMESTAMPTZ columns
- Row-Level Security enforced on all tables
- `service_role` client used for admin Server Actions (bypasses RLS)
- Auto-profile creation via trigger on `auth.users` insert
- `moddatetime` extension for automatic `updated_at` updates

---

## 5. Storage

Three Supabase Storage buckets:

| Bucket | Purpose | Max File Size | Allowed MIME |
|--------|---------|---------------|--------------|
| `avatars` | User profile images | 10 MB | image/* |
| `equipment-images` | Equipment photos | 8 MB | image/* |
| `exercise-media` | Exercise demonstrations | 500 MB | image/*, video/* |

Files are uploaded via Server Actions → public URL stored in DB → rendered with `next/image`.

---

## 6. AI Integration

### 6.1 Provider

- **Endpoint:** `https://integrate.api.nvidia.com/v1/chat/completions`
- **Model:** `z-ai/glm-5.2`
- **Auth:** Bearer token in `BLUESMINDS_API_KEY` env var
- **Protocol:** Server-Sent Events (SSE) streaming

### 6.2 Route: `/api/chat`

1. Receives `{ messages: [{ role, content }] }` from client
2. Prepends system prompt (`lib/ai/system-prompt.ts`)
3. Calls NVIDIA API with `stream: true`
4. SSE passthrough (no re-encoding)
5. Returns 503 if `BLUESMINDS_API_KEY` not set

### 6.3 Frontend: AI Coach Page

- Parses SSE `data: {...}` lines → extracts `choices[0].delta.content`
- Handles `[DONE]` sentinel
- Persists conversation in localStorage
- Supports Send, Copy, Regenerate, Stop

---

## 7. Security

### 7.1 HTTP Headers

Configured in `next.config.ts`:
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`
- `Permissions-Policy: camera=(), microphone=(), geolocation=(), interest-cohort=()`

### 7.2 Auth Security

- Supabase SSR cookie-based sessions (httpOnly, secure, sameSite)
- Service role key used only in Server Actions (never exposed to client)
- RLS policies prevent unauthorized access at database level
- Middleware enforces route-level access control

### 7.3 Input Validation

All Server Actions validate inputs with Zod schemas before database operations.

---

## 8. Performance

| Strategy | Implementation |
|----------|---------------|
| SSR | All public pages render on server |
| Image optimization | `next/image` with WebP, lazy loading |
| Static generation | Equipment/exercise detail pages can use `generateStaticParams` |
| Font | System font stack (no external font loading) |
| Bundle | Tree-shaken (only imported components ship) |

---

## 9. Accessibility

| Requirement | Implementation |
|-------------|---------------|
| Keyboard navigation | All interactive elements focusable via Tab |
| ARIA labels | `aria-label`, `aria-describedby`, `aria-invalid` on inputs |
| Screen reader | `role="dialog"`, `aria-modal`, `role="alert"` on toasts |
| Focus management | Modal traps focus, restores on close |
| Reduced motion | `prefers-reduced-motion` disables animations |
| Color contrast | White text on black background (high contrast) |

---

## 10. Monitoring

| Tool | What It Tracks |
|------|---------------|
| Vercel Analytics | Page views, unique visitors |
| Vercel Speed Insights | LCP, CLS, INP, SSR timing |
| Server `console.log` | AI API errors, validation failures (Vercel Logs) |

No Sentry, OpenTelemetry, or uptime monitoring configured.

---

## 11. Browser Support

| Browser | Support |
|---------|---------|
| Chrome 100+ | Full |
| Firefox 100+ | Full |
| Safari 15+ | Full |
| Edge 100+ | Full |

---

## 12. PWA

- **Manifest:** `app/manifest.ts` — standalone mode, red theme, 1024x1024 icon
- **Offline page:** `/offline` — basic fallback (no service worker caching)
- **Service worker:** Registered in root layout (config file at `public/sw.js`)

---

## 13. SEO

| Feature | Implementation |
|---------|---------------|
| Metadata | `generateMetadata()` in each route |
| Structured data | JSON-LD (Organization, Gym, Website, BreadcrumbList) in root layout |
| Sitemap | `app/sitemap.ts` — dynamic (fetches equipment/exercise slugs) |
| Robots | `app/robots.ts` — disallows `/admin/`, `/dashboard/`, `/auth/` |
| OG images | `app/opengraph-image.tsx` — 1200x630, red gradient theme |

---

## 14. Environment Variables

| Variable | Required | Purpose |
|----------|----------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase anon key (client-safe) |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | Supabase service_role key (server-only) |
| `BLUESMINDS_API_KEY` | Yes | NVIDIA API key |
| `BLUESMINDS_BASE_URL` | Yes | NVIDIA API base URL |
| `BLUESMINDS_MODEL` | Yes | NVIDIA model name |

---

## 15. Appendix: File Map

```
lib/
├── actions/
│   ├── contact.ts
│   ├── equipment.ts
│   └── exercises.ts
├── ai/
│   └── system-prompt.ts
├── supabase-browser.ts
├── supabase-server.ts
├── supabase-admin.ts
├── AuthContext.tsx
├── config.ts
├── utils.ts
├── animations.ts
└── data/
    └── ...
components/ui/
├── Badge.tsx
├── Breadcrumb.tsx
├── Button.tsx
├── Card.tsx
├── Input.tsx
├── Modal.tsx
├── Pagination.tsx
├── Select.tsx
├── Skeleton.tsx
├── Table.tsx
├── Textarea.tsx
└── Toast.tsx
tests/
├── auth.test.ts
├── contact.test.ts
├── equipment.test.ts
└── exercises.test.ts
```
