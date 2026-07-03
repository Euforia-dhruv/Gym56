# Architecture

## Overview

Gym 56 is a full-stack web application built with Next.js 15 App Router and Supabase. It follows a server-first architecture with Server Components and Server Actions, minimizing client-side JavaScript.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│                     Browser                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │
│  │  Public Site  │  │  Admin CMS   │  │  Dashboard   │   │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘   │
│         │                  │                  │           │
└─────────┼──────────────────┼──────────────────┼───────────┘
          │                  │                  │
          ▼                  ▼                  ▼
┌─────────────────────────────────────────────────────────┐
│                 Next.js 15 (App Router)                   │
│  ┌──────────────────────────────────────────────────┐    │
│  │           Server Components (RSC)                 │    │
│  │  - Equipment/Exercise pages (SSG)                │    │
│  │  - Layouts with metadata/JSON-LD                 │    │
│  │  - Error/loading/not-found boundaries            │    │
│  └──────────────────────────────────────────────────┘    │
│  ┌──────────────────────────────────────────────────┐    │
│  │           Client Components (thin layer)          │    │
│  │  - Interactive UI (filters, forms, animations)   │    │
│  │  - Framer Motion wrappers                         │    │
│  └──────────────────────────────────────────────────┘    │
│  ┌──────────────────────────────────────────────────┐    │
│  │           Server Actions                          │    │
│  │  - All CRUD operations as "use server" functions  │    │
│  │  - Auth checks (requireAdmin helper)             │    │
│  │  - Zod input validation                          │    │
│  │  - revalidatePath for cache invalidation         │    │
│  └──────────────────────────────────────────────────┘    │
│  ┌──────────────────────────────────────────────────┐    │
│  │           Middleware (Edge)                       │    │
│  │  - Route protection (admin/member/auth)          │    │
│  │  - JWT role claim verification                   │    │
│  └──────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────┐
│                     Supabase                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │
│  │  PostgreSQL   │  │    Auth      │  │   Storage    │   │
│  │  - Tables     │  │  - Email     │  │  - Images   │   │
│  │  - RLS        │  │  - Google    │  │  - Avatars  │   │
│  │  - Functions  │  │  - JWT Hooks │  │              │   │
│  └──────────────┘  └──────────────┘  └──────────────┘   │
└─────────────────────────────────────────────────────────┘
```

## Key Design Decisions

### Server Components First
All pages are Server Components by default. Client Components are used only when interactivity is needed (forms, filters, animations). This minimizes JavaScript bundle size.

### Server Actions for Mutations
All database mutations use Server Actions (`"use server"` functions). This provides:
- Type-safe API calls
- Automatic revalidation (`revalidatePath`)
- Progressive enhancement (forms work without JS)
- No separate REST API routes needed

### Supabase Client Architecture
Three Supabase client factories serve different needs:

| Client | File | Key | Usage |
|--------|------|-----|-------|
| **Server** | `lib/supabase-server.ts` | Anon key + cookie | Server Components, Server Actions |
| **Browser** | `lib/supabase-browser.ts` | Anon key + cookie | Client Components |
| **Admin** | `lib/supabase-admin.ts` | `service_role` key | Admin Server Actions (bypasses RLS) |

### Static Generation with Database
Dynamic pages (`/equipment/[slug]`, `/exercise/[slug]`) use `generateStaticParams()` to query Supabase and pre-render all published items at build time.

## Route Groups

| Route Group | Layout | Access |
|-------------|--------|--------|
| `(admin)/` | AdminLayout (sidebar + header) | Admin role required |
| `(member)/` | MemberLayout (dashboard nav) | Authenticated only |

## Route Protection (Middleware)

`middleware.ts` runs at the edge on every request:

- `/admin/*` → Requires session + `user_role === 'admin'` in JWT claims
- `/dashboard/*` → Requires session
- `/login`, `/signup`, `/forgot-password`, `/reset-password` → Redirect to dashboard if authenticated

The admin role is embedded in the Supabase JWT via a `custom_access_token_hook` (SQL function), making it readable in middleware without a database query.

## Security Model (Defence in Depth)

1. **Middleware (Edge):** Route protection, session validation, role check via JWT claims
2. **RLS (Database):** Row-level policies on every table — public reads, owner writes, admin full access
3. **Server Actions (Application):** Independent auth verification before every mutation
4. **Security Headers:** CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy

## Performance

- Static pages pre-rendered at build time (`generateStaticParams`)
- Next.js `<Image>` with `remotePatterns` for Supabase Storage
- Vercel Analytics + Speed Insights for real user monitoring
- Service worker for offline support and static asset caching

## Accessibility

- Semantic HTML with ARIA attributes
- Focus trap in modals
- Keyboard navigation (Enter/Space) for interactive elements
- Skip-to-content hidden links
- Toast region with `role="alert"` (single live region)

## Error Handling

- `error.tsx` error boundaries at every route segment
- `loading.tsx` skeleton loaders at every route segment
- `not-found.tsx` custom 404 pages
- Shared components: `LoadingSpinner`, `ErrorFallback`, `NotFound`
- Toast notifications for user-facing errors
