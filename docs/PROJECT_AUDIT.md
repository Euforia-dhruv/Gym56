# Gym56 — Production Readiness Audit

> **Author:** Lead Software Architect  
> **Date:** 2026-07-02  
> **Next.js:** 15.3.0 · **React:** 19.1.1 · **TypeScript:** 5.x strict  
> **Build status:** ✅ Passes (`next build` — 12 static pages)  
> **Lint status:** ✅ No ESLint warnings or errors  
> **TypeScript status:** ✅ `tsc --noEmit` passes  

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Code Quality](#2-code-quality)
3. [Folder Structure](#3-folder-structure)
4. [Component Reusability](#4-component-reusability)
5. [Authentication](#5-authentication)
6. [Security](#6-security)
7. [Performance](#7-performance)
8. [SEO](#8-seo)
9. [Accessibility](#9-accessibility)
10. [Mobile Responsiveness](#10-mobile-responsiveness)
11. [TypeScript Usage](#11-typescript-usage)
12. [Tailwind Best Practices](#12-tailwind-best-practices)
13. [Next.js Best Practices](#13-nextjs-best-practices)
14. [Supabase Integration](#14-supabase-integration)
15. [Error Handling](#15-error-handling)
16. [Loading States](#16-loading-states)
17. [Empty States](#17-empty-states)
18. [Database Design](#18-database-design)
19. [Future Scalability](#19-future-scalability)
20. [Issue Priority Matrix](#20-issue-priority-matrix)

---

## 1. Project Overview

Gym56 is a Next.js 15 App Router web application for a local gym in Gandhinagar, Gujarat. It is composed of a public marketing site (home, about, classes, services, contact), an exercise library, and Supabase-backed email/password + Google OAuth authentication.

### Current State Summary

| Area | Status |
|---|---|
| Build | ✅ Passing |
| Lint | ✅ Clean |
| TypeScript | ✅ Strict, no errors |
| Tests | ❌ Zero test files exist |
| Database | ❌ Supabase auth only — no DB tables used |
| Protected routes | ❌ None |
| Stub pages | ⚠️ 4 pages are empty placeholders |
| Broken flows | ❌ Password reset, CTA buttons, nav anchor links |
| Accessibility | ❌ No ARIA attributes anywhere |
| SEO | ⚠️ Single global metadata only |

---

## 2. Code Quality

### ✅ Strengths

- Consistent code style enforced by ESLint + Prettier (double quotes, 2-space indent, trailing commas).
- `eslint-config-prettier` correctly disables conflicting Prettier/ESLint rules.
- TypeScript `strict: true` is active — catches the widest class of type errors.
- Error catch blocks use proper `instanceof AuthError` type-narrowing before falling back to a generic message.
- `AuthContext` subscription cleanup is correctly implemented in the `useEffect` return.
- Framer Motion animation variants (`container`/`item`) are consistent across components.
- `CountUp` uses `enableScrollSpy` + `scrollSpyOnce` correctly, preventing re-triggers.

### ❌ Issues

#### CQ-01 — Duplicated `getDifficultyColor` helper (Medium)
The function is copy-pasted identically in both `app/exercises/page.tsx` and `app/exercise/[slug]/page.tsx`. Any change requires updating two files.

```ts
// Exists verbatim in TWO files — must be extracted to lib/utils.ts
const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case 'Beginner': return 'bg-green-500/20 text-green-400 border-green-500/30';
    case 'Intermediate': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    case 'Advanced': return 'bg-red-500/20 text-red-400 border-red-500/30';
    default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  }
};
```

#### CQ-02 — Duplicated Framer Motion animation variants (Low)
`container` and `item` motion variants are redefined independently in `Hero`, `Features`, `Membership`, `Reviews`, `TrustedSection`, `exercises/page.tsx`, and `exercise/[slug]/page.tsx`. Seven separate definitions of effectively the same object.

#### CQ-03 — Non-functional CTA buttons (Critical)
Three `<button>` elements perform no action and navigate nowhere:
- `Hero.tsx` — "Join Now" button
- `Hero.tsx` — "Explore Gym" button  
- `CTA.tsx` — "Join Gym 56 Today" button
- `Membership.tsx` — every "Join Now" card button

All four components are `'use client'` but contain no interactivity — they could be Server Components if the buttons were replaced with `<Link>`.

#### CQ-04 — `notFound()` called inside a Client Component (High)
`app/exercise/[slug]/page.tsx` is marked `'use client'` and calls `notFound()`. While this technically works in Next.js 15 (it throws a special error object), it is explicitly against Next.js documentation which states `notFound()` is for Server Components and Route Handlers. Using it in a client boundary can cause unexpected hydration behavior.

#### CQ-05 — Broken `relatedExercises` data references (High)
All exercise entries in `siteData.ts` reference `relatedExercises` slugs (e.g., `'incline-chest-press'`, `'lat-pulldown'`, `'dumbbell-shoulder-press'`) that do not exist in the exercise array. The Related Exercises section will always render empty for every exercise.

```ts
// Chest Press references these — none exist in the exercises array:
relatedExercises: ['incline-chest-press', 'decline-chest-press', 'dumbbell-fly']
```

#### CQ-06 — Dead footer links (Medium)
All four "Quick Links" in `Footer.tsx` use `href="#"` — they scroll to the top of the page instead of navigating anywhere useful.

#### CQ-07 — No test suite (High)
Zero test files exist. No unit, integration, or end-to-end tests. No test runner is configured (`jest`, `vitest`, `playwright`, `cypress` — none present in `package.json`).

---

## 3. Folder Structure

### Current Structure

```
Gym56/
└── Gym56/                    ← Redundant double-nesting
    ├── app/
    │   ├── about/page.tsx    ← Stub
    │   ├── classes/page.tsx  ← Stub
    │   ├── contact/page.tsx  ← Stub
    │   ├── exercise/[slug]/page.tsx
    │   ├── exercises/page.tsx
    │   ├── forgot-password/page.tsx
    │   ├── login/page.tsx
    │   ├── services/page.tsx ← Stub
    │   ├── signup/page.tsx
    │   ├── globals.css
    │   ├── layout.tsx
    │   └── page.tsx
    ├── components/           ← Flat — all 8 components in one folder
    ├── lib/
    │   ├── AuthContext.tsx
    │   ├── siteData.ts
    │   └── supabase.ts
    ├── docs/
    └── [config files]
```

### Issues

#### FS-01 — Double-nested root directory (Low)
The project root is `Gym56/Gym56/` — the outer folder appears to be a Git repository wrapper. This is an inconvenience but does not affect the build.

#### FS-02 — No `lib/utils.ts` (Medium)
There is no shared utilities file. Shared logic (like `getDifficultyColor`) is being duplicated across pages instead.

#### FS-03 — No `types/` directory (Medium)
All types are either inlined or declared inside `siteData.ts`. As the project grows, type definitions should be in `lib/types.ts` or a dedicated `types/` directory.

#### FS-04 — Flat `components/` folder (Low — but will not scale)
All 8 components live in the root of `components/`. As the project grows, this should be organized into subdirectories:

```
components/
├── layout/       (Navbar, Footer)
├── home/         (Hero, TrustedSection, Features, Membership, Reviews, CTA)
├── exercises/    (ExerciseCard, ExerciseFilter, ...)
├── auth/         (AuthForm, GoogleButton, ...)
└── ui/           (Button, Input, Badge, Card, ...)
```

#### FS-05 — No `middleware.ts` (Critical)
There is no `middleware.ts` at the project root. Without it, there is no route protection, redirect logic, or auth session validation at the edge.

#### FS-06 — Missing Next.js App Router special files (High)
None of the following exist anywhere in the `app/` directory:
- `loading.tsx` — no loading UI for any route
- `error.tsx` — no error boundary for any route  
- `not-found.tsx` — no custom 404 page
- `sitemap.ts` — no sitemap generation
- `robots.ts` — no robots.txt generation

---

## 4. Component Reusability

### ✅ Strengths

- `TrustedSection` correctly reads from `siteData` — the card data is not hardcoded inside the component.
- The `glass` CSS utility class is reused consistently across all cards and modals.

### ❌ Issues

#### CR-01 — No shared `<Button>` component (High)
The primary button style (`bg-[#DC2626] hover:bg-[#B91C1C] rounded-full font-semibold`) is copy-pasted in at least 8 places across the codebase. A single `<Button variant="primary" | "outline" | "ghost">` component would eliminate all duplication.

#### CR-02 — No shared `<Input>` component (Medium)
The form input style (`bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#DC2626]`) is copy-pasted across `login/page.tsx`, `signup/page.tsx`, and `forgot-password/page.tsx`.

#### CR-03 — No shared `<Card>` or `<SectionHeader>` component (Low)
The `glass rounded-2xl p-6` card pattern and the centered `<h2>` + subtext section header pattern are repeated across every section without abstraction.

#### CR-04 — Auth page layout is duplicated 3× (Medium)
The centered black-background auth card layout (`min-h-screen flex items-center justify-center bg-black`, `motion.div`, `glass rounded-2xl p-8`) is identical across `login`, `signup`, and `forgot-password`. This should be an `<AuthLayout>` wrapper component.

#### CR-05 — Animation variants defined inline 7× (Low)
`container`/`item` Framer Motion variants are redefined in every component file. A shared `lib/animations.ts` export would make them consistent and easy to adjust globally.

#### CR-06 — `ExerciseCard` is not a component (Medium)
The exercise card JSX exists inline in `exercises/page.tsx` and a variant exists in `exercise/[slug]/page.tsx` (Related Exercises). These should be a shared `<ExerciseCard>` component.

---

## 5. Authentication

### ✅ Strengths

- `AuthContext` correctly uses `getSession()` on mount and `onAuthStateChange` listener for reactivity.
- Subscription is properly cleaned up on unmount (`authListener.subscription.unsubscribe()`).
- Google OAuth with `redirectTo` is correctly implemented.
- Error type-narrowing with `instanceof AuthError` is correct.
- Login/Signup/ForgotPassword pages all clear prior error/success state on new submission.

### ❌ Issues

#### AUTH-01 — Password reset flow is broken end-to-end (Critical)
`forgot-password/page.tsx` sends a reset email with `redirectTo: .../login`. However:
- There is no `/reset-password` page to handle the Supabase callback token.
- Supabase sends users back with `#access_token` and `type=recovery` in the URL.
- Without a page that calls `supabase.auth.updateUser({ password: newPassword })`, users are permanently unable to reset their passwords.

#### AUTH-02 — No route protection whatsoever (Critical)
Without `middleware.ts`, every page is accessible to unauthenticated users. When a dashboard, member profile, or booking page is added, they will be publicly accessible by default.

**Required fix:** Create `middleware.ts` using the Supabase SSR auth helper to validate sessions at the edge and redirect unauthenticated users.

#### AUTH-03 — Supabase client is browser-only (High)
`lib/supabase.ts` creates a standard `createClient` (browser client). Once Server Components, Server Actions, or API Routes are added, a second `supabase-server.ts` using `createServerClient` from `@supabase/ssr` will be required. Using the browser client in a Server Component context will throw errors.

#### AUTH-04 — No password strength validation on signup (Medium)
`signup/page.tsx` has a `<input type="password">` with no `minLength`, no strength indicator, and no client-side validation. The user discovers the minimum length (6 characters) only after a server round-trip error from Supabase.

#### AUTH-05 — Profile dropdown only has "Sign Out" (Medium)
The logged-in user profile button in the Navbar shows `user.email.split('@')[0]` and a dropdown with only "Sign Out". There is no link to a profile, dashboard, or settings page.

#### AUTH-06 — `loading` state causes silent Navbar layout shift (Medium)
During auth initialization (`loading === true`), neither the "Login/Join Now" group nor the "Profile" button renders. This causes a visible layout jump on page load. A skeleton placeholder should be shown during loading.

#### AUTH-07 — No "Already logged in" redirect on auth pages (Low)
If a logged-in user navigates to `/login` or `/signup`, the page renders normally. They should be redirected to `/` or `/dashboard`.

---

## 6. Security

### ❌ Issues

#### SEC-01 — No HTTP security headers (High)
`next.config.ts` is completely empty. The following headers are absent:

```ts
// All of these are missing:
Content-Security-Policy
X-Frame-Options
X-Content-Type-Options
Referrer-Policy
Permissions-Policy
Strict-Transport-Security
```

#### SEC-02 — Supabase env vars lack startup validation (Medium)
`lib/supabase.ts` uses the `!` non-null assertion on both env vars:

```ts
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;      // ← silent if missing
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!; // ← silent if missing
```

If either variable is undefined (e.g., missing from Vercel environment), `createClient` is called with `undefined` and the app silently fails at runtime instead of throwing a clear startup error.

**Fix:**
```ts
if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error('Missing Supabase environment variables');
}
```

#### SEC-03 — No Row Level Security policy awareness (High)
No Supabase database tables exist yet, but once created (members, bookings, workouts), Row Level Security (RLS) must be enabled on every table. There is no documentation or enforcement of this convention. RLS being disabled is one of the most common Supabase production security mistakes.

#### SEC-04 — No CSRF awareness for future API Routes (Medium)
No API routes exist yet, but once added (e.g., a contact form submission), they should validate the `Origin` header or use a CSRF token. Next.js App Router does not add CSRF protection automatically.

#### SEC-05 — No rate limiting on auth forms (Medium)
Login, signup, and password reset forms have no client-side debounce or rate limiting. While Supabase's backend rate-limits auth endpoints, a determined user can submit forms rapidly and generate unnecessary server-side traffic and error emails.

#### SEC-06 — Google Reviews CTA links to `google.com` (Low)
`siteData.ts` has `cta.link: "https://www.google.com"` — a generic Google URL rather than the gym's actual Google Maps/Reviews page. This is misleading to users.

#### SEC-07 — No `.env.example` file (Medium)
`.env.local` exists but is correctly gitignored. However, there is no `.env.example` file to document what variables are required for a new developer setting up the project. New contributors will not know what env vars to set.

---

## 7. Performance

### Build Output Analysis

| Route | First Load JS | Type | Notes |
|---|---|---|---|
| `/` | **153 kB** | Static | Heavy — includes Framer Motion, CountUp, all section components |
| `/login` | **207 kB** | Static | 207 kB for a simple form — Framer Motion overhead |
| `/signup` | **206 kB** | Static | Same |
| `/forgot-password` | **206 kB** | Static | Same |
| `/exercise/[slug]` | **149 kB** | Dynamic | Should be Static |
| `/exercises` | **148 kB** | Static | OK |
| `/about`, `/classes`, etc. | **101 kB** | Static | Good — stubs are tiny |
| Shared JS | **101 kB** | — | Large shared chunk |

The target for a modern web app is < 100 kB first load JS for most routes.

### ❌ Issues

#### PERF-01 — `/exercise/[slug]` is Dynamic instead of Static (High)
The route is marked `ƒ (Dynamic)` in the build output, meaning it is server-rendered on every request. Since all exercise data is static in `siteData.ts`, this page should use `generateStaticParams` to pre-render all exercise pages at build time.

```ts
// Should be added to app/exercise/[slug]/page.tsx:
export async function generateStaticParams() {
  return exercises.map((ex) => ({ slug: ex.slug }));
}
```

This would change it from `ƒ Dynamic` to `○ Static` and eliminate server rendering entirely.

#### PERF-02 — `'use client'` applied to components that don't need it (High)
The following components are marked `'use client'` but contain no hooks, state, or event handlers — they only use `framer-motion`'s `whileInView`:
- `CTA.tsx` — no state, no events
- `Features.tsx` — no state, no events
- `Reviews.tsx` — no state, no events

Framer Motion v10+ supports `motion` in Server Components via `import { motion } from 'framer-motion'` with the correct setup. If not ready to refactor, these components are acceptable as-is, but it is a missed optimization.

#### PERF-03 — All auth pages share Framer Motion overhead (Medium)
`/login`, `/signup`, and `/forgot-password` each import Framer Motion for a single fade-in animation on page load. This pushes their First Load JS to ~206–207 kB. A simple CSS `@keyframes` animation would eliminate this dependency for these routes.

#### PERF-04 — 20 continuously animating particles on Hero (Low)
`Hero.tsx` renders 20 `<motion.div>` elements each with `repeat: Infinity` animations. These run forever in the background on the homepage, continuously consuming GPU/CPU compositing resources even when the section is scrolled out of view.

#### PERF-05 — No `next/font` — system font with potential CLS (Low)
`globals.css` uses `system-ui, -apple-system, ...` font stack. While system fonts avoid a network request, they render differently per OS, causing layout inconsistency. Using `next/font/google` would provide a consistent font with zero CLS and automatic self-hosting.

#### PERF-06 — No image optimization strategy (Low — no images yet)
No images are currently used. When gym photos are added, they must use `next/image` (`<Image>`) for automatic WebP conversion, lazy loading, and responsive `srcSet`. Plain `<img>` tags must not be used.

#### PERF-07 — Accent color as hardcoded hex, not Tailwind token (Low)
`#DC2626` appears 40+ times across the codebase as a raw hex string. This bypasses Tailwind's JIT optimization and makes global color changes require a project-wide find-and-replace.

---

## 8. SEO

### ❌ Issues

#### SEO-01 — Single global metadata for all 11 pages (Critical)
Only `app/layout.tsx` exports metadata:
```ts
export const metadata: Metadata = {
  title: 'Gym 56',
  description: 'Your fitness journey starts here',
};
```
Every page — including `/exercises`, `/exercise/bench-press`, `/about`, `/login` — has an identical `<title>` and `<meta name="description">`. Search engines will treat all pages as duplicates.

**Each page must export its own `metadata` object or use `generateMetadata()` for dynamic routes.**

#### SEO-02 — No Open Graph or Twitter Card metadata (High)
No `og:title`, `og:description`, `og:image`, `og:type`, `twitter:card`, or `twitter:image` is defined anywhere. Sharing any page on social media will produce a blank, unbranded preview.

#### SEO-03 — No `sitemap.ts` (High)
There is no `app/sitemap.ts`. Search engines must crawl the site blindly without a structured list of URLs. Next.js 15 supports auto-generated sitemaps via `export default function sitemap(): MetadataRoute.Sitemap`.

#### SEO-04 — No `robots.ts` (Medium)
There is no `app/robots.ts`. Without it, Next.js will not serve a `robots.txt`, and some crawlers may behave unexpectedly.

#### SEO-05 — No structured data / JSON-LD (Medium)
The exercise detail pages are ideal candidates for `HowTo` or `ExerciseAction` JSON-LD schema, which can appear as rich results in Google Search. The membership page is a candidate for `Product`/`Offer` schema.

#### SEO-06 — No canonical URL defined (Medium)
No `<link rel="canonical">` is set. If the site is ever accessible at both `www.gym56.com` and `gym56.com`, duplicate content issues will arise.

#### SEO-07 — No `viewport` meta tag explicitly set (Low)
Next.js 15 injects a default viewport meta tag, but the project does not explicitly export `export const viewport: Viewport` from `layout.tsx`. Explicitly declaring it gives control over `themeColor` and other viewport settings.

#### SEO-08 — No `favicon` or `apple-touch-icon` (Medium)
The `app/` directory has no `favicon.ico`, `icon.png`, `apple-icon.png`, or `manifest.json`. The browser will show a default blank favicon.

#### SEO-09 — Stub pages indexed by search engines (High)
`/about`, `/classes`, `/contact`, and `/services` exist as publicly accessible routes that return nearly empty HTML. They will be indexed by Google with no content, harming SEO.

---

## 9. Accessibility

This is the most critically underdeveloped area of the project.

### ❌ Issues

#### A11Y-01 — Zero ARIA attributes across entire codebase (Critical)
A grep for `aria-` across all `.tsx` files returns **zero matches**. Every interactive element — the mobile menu toggle, profile dropdown, filter buttons, form fields — has no ARIA attributes.

**Required additions include:**
- `aria-label` on icon-only buttons (hamburger menu, close button)
- `aria-expanded` on the mobile menu toggle and profile dropdown
- `aria-current="page"` on active nav links
- `aria-live="polite"` on error/success message regions
- `aria-describedby` connecting inputs to their labels and error messages
- `role="navigation"`, `role="main"`, `role="dialog"` on appropriate elements

#### A11Y-02 — Focus ring removed on all inputs (High)
All form inputs use `focus:outline-none` without replacing the outline with a visible custom focus indicator. This breaks keyboard navigation and violates WCAG 2.1 Success Criterion 2.4.7 (Focus Visible).

```tsx
// Current (WCAG violation):
className="... focus:outline-none focus:border-[#DC2626] ..."
// A border color change alone is not sufficient for focus visibility
// Fix: add focus-visible:ring-2 focus-visible:ring-[#DC2626] focus-visible:ring-offset-2
```

#### A11Y-03 — Mobile menu has no keyboard trap management (High)
When the mobile menu is open, pressing `Tab` does not cycle within the menu — focus escapes to behind the overlay. There is no `Escape` key handler to close the menu.

#### A11Y-04 — Profile dropdown has no keyboard support (High)
The profile dropdown (`isProfileMenuOpen`) has no `onKeyDown` handler, no `Escape` to close, no `aria-haspopup="menu"`, and no `aria-expanded`. It is completely inaccessible via keyboard.

#### A11Y-05 — No skip-to-content link (Medium)
There is no "Skip to main content" link as the first focusable element in the page. Screen reader and keyboard-only users must tab through the entire Navbar on every page load.

#### A11Y-06 — Color contrast may be insufficient (Medium)
The design uses `text-gray-400` (`#9CA3AF`) on `bg-black` (`#000000`). The contrast ratio is approximately 6.2:1 for normal text — this passes AA. However, `text-gray-500` (`#6B7280`) on `bg-black` is approximately 4.0:1 — this passes AA for large text but **fails AA for small text** (< 18px). Multiple instances of `text-gray-500` are used for small labels and subtitles.

#### A11Y-07 — Star rating is purely visual (Low)
`Reviews.tsx` renders star ratings as icon-only elements with no accessible text. Screen readers will announce nothing meaningful.

```tsx
// Missing accessible text:
{[...Array(review.rating)].map((_, i) => (
  <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
))}
// Should include: <span className="sr-only">{review.rating} out of 5 stars</span>
```

#### A11Y-08 — Form labels not linked to inputs via `htmlFor`/`id` (High)
Auth form inputs have visible `<label>` elements but no `htmlFor`/`id` association:

```tsx
// Current (broken association):
<label className="...">Email</label>
<input type="email" ... />

// Required:
<label htmlFor="email" className="...">Email</label>
<input id="email" type="email" ... />
```

Without this, clicking the label does not focus the input, and screen readers cannot associate the label with the field.

---

## 10. Mobile Responsiveness

### ✅ Strengths

- All section grids use responsive column variants: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`.
- `Hero.tsx` uses responsive typography: `text-4xl sm:text-5xl md:text-7xl lg:text-8xl`.
- Navbar has a full mobile menu implementation with `AnimatePresence`.
- Padding consistently uses `px-4 sm:px-6 lg:px-8`.

### ❌ Issues

#### MOB-01 — Exercise card grid breaks at `xl` on narrow viewports (Low)
`exercises/page.tsx` uses `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4`. At the `xl` breakpoint the cards can become very narrow. Exercise name + difficulty badge on the same row may overflow on cards narrower than ~250px.

#### MOB-02 — Membership card prices may overflow on very small screens (Low)
`<span className="text-5xl font-black text-white">{plan.price}</span>` — the `₹` character followed by a 4-digit price at `text-5xl` on a `grid-cols-1` card may overflow the card container on screens < 360px wide.

#### MOB-03 — Profile dropdown position not accounted for on mobile (Medium)
The profile dropdown in `Navbar.tsx` is positioned `absolute right-0 mt-2 w-48` relative to its parent button. On mobile screens (< 768px), the dropdown is not rendered (the mobile menu handles auth), but the `isProfileMenuOpen` state is not reset when the viewport switches sizes. If a user opens the dropdown, resizes to mobile, then resizes back, stale state could cause the desktop dropdown to still be open.

#### MOB-04 — No `touch-action` or swipe gesture for mobile menu (Low)
The mobile menu has no swipe-to-close gesture, which is a common UX expectation on mobile devices.

---

## 11. TypeScript Usage

### ✅ Strengths

- `strict: true` in `tsconfig.json` — the strictest TypeScript mode.
- `Exercise` and `Category` types are properly defined and exported from `siteData.ts`.
- `AuthContextType` interface is correctly typed.
- `User` type is imported from `@supabase/supabase-js` rather than re-declared.
- The `as const` assertion on `categories` array ensures the type is a readonly tuple, enabling the `Category` union type.

### ❌ Issues

#### TS-01 — `siteData` structure is not fully typed (Medium)
The `siteData` object in `siteData.ts` is inferred, not explicitly typed. The nested `trustedSection.cards` array has a heterogeneous `subtitle` type (either `string` or `string[]`) that is not formally declared. This makes consuming components have to handle both cases without a clear contract.

#### TS-02 — `difficulty` field uses string in helper, not the literal type (Low)
`getDifficultyColor(difficulty: string)` accepts `string` instead of `Exercise['difficulty']`. This means the TypeScript compiler cannot warn if a caller passes an invalid difficulty string.

```ts
// Current (too broad):
const getDifficultyColor = (difficulty: string) => { ... }

// Better:
const getDifficultyColor = (difficulty: Exercise['difficulty']) => { ... }
```

#### TS-03 — Missing `Database` type for Supabase (High)
`lib/supabase.ts` creates an untyped client:
```ts
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```
The Supabase client supports a generic `Database` type parameter that provides full type inference for all `.from()` queries. Without it, all DB operations return `any`.

```ts
// Should be:
import { Database } from '@/types/supabase'; // generated via supabase gen types
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
```

#### TS-04 — No `types/` directory or global type declarations (Low)
All types are either local or in `siteData.ts`. As the project grows, a `types/` directory with `supabase.ts` (generated), `index.ts` (shared), and `api.ts` (API contract types) will be needed.

---

## 12. Tailwind Best Practices

### ✅ Strengths

- `glass` utility class is correctly placed in `@layer utilities` in `globals.css` — it will be purged correctly.
- CSS custom properties (`--background`, `--foreground`, `--accent`) are defined in `:root`.
- Responsive prefixes are consistently applied (`sm:`, `md:`, `lg:`).
- Tailwind content paths correctly include `app/`, `components/`, and `pages/`.

### ❌ Issues

#### TW-01 — Accent color `#DC2626` is not a Tailwind token (High)
The color `#DC2626` (equivalent to Tailwind's `red-600`) appears as an arbitrary value in **40+ locations** across the codebase. This bypasses Tailwind's design token system and makes theming impossible.

**Fix:** Add to `tailwind.config.ts`:
```ts
theme: {
  extend: {
    colors: {
      accent: '#DC2626',
      background: 'var(--background)',
      foreground: 'var(--foreground)',
    },
  },
},
```
Then replace `bg-[#DC2626]` → `bg-accent`, `text-[#DC2626]` → `text-accent`, `hover:bg-[#B91C1C]` → `hover:bg-accent/90`, etc.

#### TW-02 — `hover:bg-[#B91C1C]` is a one-off arbitrary hover color (Medium)
The hover state color `#B91C1C` (Tailwind `red-700`) is used as an arbitrary value. Once the `accent` token is added, this should become `hover:bg-red-700` or a defined shade variant.

#### TW-03 — Inline `style` prop in Hero particles overrides Tailwind (Low)
Hero particles use `style={{ left: ..., top: ..., width: ..., height: ... }}` to apply positioning. This is acceptable for dynamic values (from the data array), but the pattern should be noted since it cannot be purged or linted by Tailwind tooling.

#### TW-04 — `@layer utilities` only contains two utilities (Low)
Only `.text-balance` and `.glass` are in the utilities layer. As the project grows, component-level abstractions (`.btn-primary`, `.card`, `.section-header`) should be added to `@layer components` to maintain consistency.

---

## 13. Next.js Best Practices

### ❌ Issues

#### NX-01 — `exercise/[slug]` uses `useParams()` in a Client Component instead of Server Component (High)
In Next.js 15 App Router, dynamic route page components receive `params` as a prop automatically in Server Components. The current implementation wraps the entire page in `'use client'` just to call `useParams()`, which negates all Server Component benefits (streaming, no client-side JS, direct data access).

**Correct pattern for a static data page:**
```tsx
// Server Component — no 'use client' needed
export default async function ExerciseDetail({ params }: { params: { slug: string } }) {
  const exercise = exercises.find(ex => ex.slug === params.slug);
  if (!exercise) notFound(); // ✅ Correct place to call notFound()
  // ...
}

export function generateStaticParams() {
  return exercises.map(ex => ({ slug: ex.slug }));
}
```

#### NX-02 — No `generateStaticParams` for exercise detail pages (High)
Without `generateStaticParams`, Next.js cannot pre-render exercise pages at build time. The build output confirms this: `/exercise/[slug]` is listed as `ƒ (Dynamic)` instead of `○ (Static)`.

#### NX-03 — No per-page `metadata` exports (High)
Only `layout.tsx` exports `metadata`. Every page should export its own `metadata` or `generateMetadata` function. See SEO-01.

#### NX-04 — Auth pages do not redirect authenticated users (Medium)
`/login`, `/signup`, and `/forgot-password` are accessible to logged-in users. The recommended pattern in Next.js is to check auth status in `middleware.ts` and redirect.

#### NX-05 — No `loading.tsx` files (Medium)
Without `loading.tsx` files, Next.js cannot show a loading skeleton during page transitions or data fetching. Users see nothing (or a flash of blank content) during navigation.

#### NX-06 — No `error.tsx` files (Medium)
Without `error.tsx` files, unhandled runtime errors in any page will show Next.js's default error UI in production. Custom error boundaries should be defined.

#### NX-07 — No `not-found.tsx` (Medium)
Navigating to an invalid exercise slug shows Next.js's default 404 page. A custom `not-found.tsx` in `app/` (or `app/exercise/`) would match the site's design.

#### NX-08 — `next.config.ts` is completely empty (High)
No security headers, no redirects, no image domain allowlist, no bundle analyzer. At minimum, security headers should be configured before production launch.

---

## 14. Supabase Integration

### ✅ Strengths

- Supabase client is correctly initialized as a singleton module — not re-created on every render.
- Auth state change listener pattern (`onAuthStateChange`) is the correct real-time approach.
- `signInWithOAuth` with `redirectTo` is correctly implemented.
- `resetPasswordForEmail` with `redirectTo` is implemented (though the target page is missing).

### ❌ Issues

#### SB-01 — Browser-only client, no SSR client (Critical)
The project uses `@supabase/supabase-js` directly instead of `@supabase/ssr`. For Next.js App Router, the recommended package is `@supabase/ssr`, which provides:
- `createBrowserClient()` — for Client Components
- `createServerClient()` — for Server Components, Server Actions, Middleware

Without the SSR client, auth cookies cannot be read server-side, meaning Server Components cannot access the current user session, and middleware cannot validate authentication.

#### SB-02 — No database tables, no schema (High)
Supabase is used exclusively for authentication. There is no database schema, no tables, and no RLS policies. All application data (exercises, membership plans, reviews, site copy) is hardcoded in `siteData.ts`. As the gym grows, this data needs to be in Supabase:
- `exercises` table
- `membership_plans` table
- `reviews` table (with admin moderation)
- `members` table (profiles)
- `bookings` table (class bookings)
- `contact_submissions` table

#### SB-03 — No generated TypeScript types for Supabase (High)
Without running `supabase gen types typescript`, there is no type-safe interface for database operations. The Supabase client returns `any` for all queries.

#### SB-04 — No `profiles` table for user data (High)
Supabase Auth stores only `email`, `id`, and OAuth metadata. There is no `profiles` table to store:
- Full name
- Phone number
- Membership tier
- Membership expiry date
- Profile photo URL

The Navbar currently displays `user.email.split('@')[0]` as the user's "name" — a temporary workaround.

#### SB-05 — No Supabase Storage configured (Low — future)
There is no Supabase Storage bucket configuration for:
- Exercise demo videos (currently "Video coming soon")
- User profile photos
- Gym photos / marketing assets

#### SB-06 — `resetPasswordForEmail` redirects to `/login` not `/reset-password` (Critical)
```ts
redirectTo: `${window.location.origin}/login`  // ← Wrong
redirectTo: `${window.location.origin}/reset-password`  // ← Correct
```
Supabase appends a recovery token to the `redirectTo` URL. The landing page must call `supabase.auth.updateUser({ password })` to complete the reset. Redirecting to `/login` discards the token.

---

## 15. Error Handling

### ✅ Strengths

- All three auth forms (`login`, `signup`, `forgot-password`) use `try/catch/finally` blocks.
- `loading` state is reset in `finally`, preventing stuck spinners even on error.
- Error messages are displayed inline below the form header.

### ❌ Issues

#### ERR-01 — Raw Supabase error messages shown to users (Medium)
Auth error messages are passed directly from Supabase to the UI:
```ts
setError(err instanceof AuthError ? err.message : 'An error occurred');
```
Messages like `"Email not confirmed"`, `"Invalid login credentials"`, or `"User already registered"` are technical Supabase strings, not user-friendly copy. These should be mapped to friendly messages.

#### ERR-02 — No global error boundary (High)
There is no `app/error.tsx` (Next.js error boundary). Any unexpected runtime error in a page or component will show Next.js's raw default error UI in production.

#### ERR-03 — `exercise/[slug]` 404 handling is wrong pattern (Medium)
Calling `notFound()` inside a `'use client'` component is not the intended pattern. The correct fix is to convert the page to a Server Component and call `notFound()` there (see NX-01).

#### ERR-04 — No error handling for auth state changes (Low)
`AuthContext.tsx` calls `supabase.auth.getSession()` without handling the potential `error` field:
```ts
// Current:
supabase.auth.getSession().then(({ data: { session } }) => { ... });

// Should handle error:
supabase.auth.getSession().then(({ data: { session }, error }) => {
  if (error) console.error('Session error:', error);
  ...
});
```

#### ERR-05 — No network error handling (Medium)
If the user is offline or Supabase is unreachable, auth form submissions will throw a generic network error that is caught and displayed as `'An error occurred'`. The user has no indication that this is a connectivity issue rather than an input error.

---

## 16. Loading States

### ❌ Issues

#### LOAD-01 — No global page transition loading UI (High)
There are no `loading.tsx` files in any route segment. When navigating between pages, the user sees no visual feedback that a new page is loading.

#### LOAD-02 — Auth loading causes Navbar layout shift (High)
During the initial `loading === true` phase in `AuthContext`, the Navbar renders neither the login/signup links nor the profile button:
```tsx
{!loading && !user ? (
  <> {/* Login + Join Now */} </>
) : (
  <> {/* Profile button */} </>
)}
```
This produces a visible layout shift (CLS) every time the page loads. A skeleton placeholder (`w-24 h-8 bg-white/5 rounded-full animate-pulse`) should render during loading.

#### LOAD-03 — No loading state for exercise library filter (Low)
The exercise category filter applies instantly (synchronous in-memory filter). No loading state is needed here, but if exercises are later fetched from Supabase, a loading skeleton should be shown during the query.

#### LOAD-04 — `loading` spinner text only (Low)
Auth buttons show `'Signing in...'`, `'Creating Account...'`, `'Sending Email...'` as text-only feedback. Adding a spinner icon (`<Loader2 className="animate-spin" />` from lucide-react) alongside the text would give stronger visual confirmation.

---

## 17. Empty States

### ❌ Issues

#### EMPTY-01 — Related Exercises section silently renders nothing (High)
`exercise/[slug]/page.tsx` filters exercises by `relatedExercises` slugs that don't exist:
```ts
const relatedExercises = exercises.filter(ex =>
  exercise.relatedExercises.includes(ex.slug)
);
```
This always returns `[]` for every exercise. The section conditionally renders only `if (relatedExercises.length > 0)` — so it silently disappears. The fix is to add the referenced exercise data OR change the `relatedExercises` to reference existing slugs.

#### EMPTY-02 — Exercise library shows no empty state for category filter (Low)
If a category has zero exercises (possible once exercises are fetched from DB), the grid renders an empty container with no message. An "No exercises found" empty state should be shown.

#### EMPTY-03 — Four stub pages are deployed with no content (Critical)
`/about`, `/classes`, `/contact`, and `/services` render a single `<h1>` with no content, no metadata, and no navigation aids. These pages are publicly deployed and indexed by search engines.

---

## 18. Database Design

### Current State

**No database tables exist.** Supabase is used exclusively for authentication.

### Required Schema (Pre-Launch Minimum)

```sql
-- User profiles (extends Supabase auth.users)
CREATE TABLE public.profiles (
  id          UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name   TEXT,
  phone       TEXT,
  avatar_url  TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at  TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE USING (auth.uid() = id);
```

### Recommended Schema (Full Feature Set)

```sql
-- Membership plans (replaces hardcoded siteData)
CREATE TABLE public.membership_plans (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name        TEXT NOT NULL,           -- '1 Month', '6 Months', etc.
  duration_months INT NOT NULL,
  price_inr   INTEGER NOT NULL,        -- price in paisa or rupees
  is_featured BOOLEAN DEFAULT FALSE,
  is_active   BOOLEAN DEFAULT TRUE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Member subscriptions
CREATE TABLE public.subscriptions (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id         UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  plan_id         UUID REFERENCES membership_plans(id) NOT NULL,
  starts_at       DATE NOT NULL,
  expires_at      DATE NOT NULL,
  payment_status  TEXT DEFAULT 'pending',  -- 'pending', 'paid', 'failed'
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Exercises (replaces hardcoded siteData)
CREATE TABLE public.exercises (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name            TEXT NOT NULL,
  slug            TEXT UNIQUE NOT NULL,
  category        TEXT NOT NULL,
  muscle_group    TEXT,
  equipment       TEXT,
  difficulty      TEXT CHECK (difficulty IN ('Beginner', 'Intermediate', 'Advanced')),
  target_muscles  TEXT[],
  instructions    TEXT[],
  common_mistakes TEXT[],
  safety_tips     TEXT[],
  video_url       TEXT,
  is_published    BOOLEAN DEFAULT TRUE,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Contact form submissions
CREATE TABLE public.contact_submissions (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name        TEXT NOT NULL,
  email       TEXT NOT NULL,
  message     TEXT NOT NULL,
  is_read     BOOLEAN DEFAULT FALSE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);
```

### RLS Policy Notes

Every table **must** have RLS enabled. The principle:
- `profiles` — users can only read/write their own row
- `subscriptions` — users can read their own; admins can read all
- `exercises` — public read; admin-only write
- `membership_plans` — public read; admin-only write
- `contact_submissions` — insert-only for anonymous users; admin read

---

## 19. Future Scalability

### Architecture Concerns

#### SCALE-01 — No admin role or admin panel (Future — High Priority)
There is no concept of an admin user. Once exercises, membership plans, reviews, and contact submissions are in Supabase, an admin panel is needed to manage them. Options:
1. Build a `/admin` route with Supabase RLS `admin` role checking
2. Use Supabase Studio directly (fine for small operation)
3. Use a CMS (Sanity, Contentful) for marketing content

#### SCALE-02 — No payment integration (Future — Critical for Business)
Membership "Join Now" buttons are non-functional. For the gym to accept memberships online, a payment gateway must be integrated. In India, the standard option is **Razorpay**, which supports UPI, cards, and net banking.

#### SCALE-03 — No class booking system (Future)
`/classes` is a stub. A class booking system requires:
- Class schedule table (`class_sessions`)
- Booking table (`class_bookings`)
- Capacity management
- Cancellation/refund logic

#### SCALE-04 — `siteData.ts` does not scale (Medium — Near Term)
All site content is in a single TypeScript file. As content grows (more exercises, plans, reviews), this becomes a maintenance burden and requires a developer to update content. Moving to Supabase or a headless CMS is the correct long-term solution.

#### SCALE-05 — No caching strategy for future DB queries (Future)
When exercises and plans are moved to Supabase, `fetch()` calls in Server Components should use Next.js `revalidate` or `cache` options:
```ts
// For content that changes infrequently:
const { data } = await supabase.from('exercises').select('*');
// Wrap in Next.js unstable_cache or use route revalidation
```

#### SCALE-06 — No monitoring or analytics (Future)
No error monitoring (Sentry, etc.), no analytics (Plausible, PostHog, etc.), no uptime monitoring. Before launch, at minimum:
- Sentry for error tracking
- Vercel Analytics (already on Vercel) for web vitals

#### SCALE-07 — No email notification system (Future)
Once contact forms and membership signups are functional, transactional emails are needed (booking confirmations, payment receipts, class reminders). Options: Resend, SendGrid, Supabase Edge Functions with email.

---

## 20. Issue Priority Matrix

### 🔴 Critical — Must Fix Before Launch

| ID | Issue | File(s) |
|---|---|---|
| AUTH-01 | Password reset flow broken — no `/reset-password` page | `app/forgot-password/page.tsx` |
| AUTH-02 | No route protection — all pages publicly accessible | Missing `middleware.ts` |
| SB-01 | Browser-only Supabase client — no SSR support | `lib/supabase.ts` |
| SB-06 | `resetPasswordForEmail` redirects to wrong page | `app/forgot-password/page.tsx` |
| CQ-03 | CTA/Hero/Membership "Join Now" buttons are non-functional | `Hero.tsx`, `CTA.tsx`, `Membership.tsx` |
| EMPTY-03 | Four stub pages deployed publicly with no content | `about/`, `classes/`, `contact/`, `services/` |
| SEO-01 | All 11 pages share identical title/description | `app/layout.tsx` |
| A11Y-01 | Zero ARIA attributes across the entire codebase | All components |
| A11Y-08 | Form labels not linked to inputs via `htmlFor`/`id` | `login/`, `signup/`, `forgot-password/` |

### 🟠 High Priority — Fix Before Marketing / Public Sharing

| ID | Issue | File(s) |
|---|---|---|
| CQ-04 | `notFound()` called inside Client Component | `app/exercise/[slug]/page.tsx` |
| CQ-05 | All `relatedExercises` reference non-existent slugs | `lib/siteData.ts` |
| CQ-07 | No test suite | Project-wide |
| FS-05 | No `middleware.ts` | Missing |
| FS-06 | No `loading.tsx`, `error.tsx`, `not-found.tsx` | `app/` |
| SEC-01 | No HTTP security headers | `next.config.ts` |
| SEC-02 | Supabase env vars not validated at startup | `lib/supabase.ts` |
| SEC-03 | No RLS policy plan for future DB tables | Supabase dashboard |
| SEC-07 | No `.env.example` file | Project root |
| PERF-01 | `/exercise/[slug]` renders dynamically instead of statically | `app/exercise/[slug]/page.tsx` |
| PERF-02 | `CTA`, `Features`, `Reviews` are `'use client'` unnecessarily | Component files |
| SEO-02 | No Open Graph or Twitter Card metadata | `app/layout.tsx` |
| SEO-03 | No `sitemap.ts` | Missing `app/sitemap.ts` |
| SEO-09 | Stub pages indexed by search engines | `about/`, `classes/`, etc. |
| A11Y-02 | Focus ring removed on all inputs | Auth pages |
| A11Y-03 | Mobile menu has no keyboard trap / Escape handler | `Navbar.tsx` |
| A11Y-04 | Profile dropdown has no keyboard support | `Navbar.tsx` |
| TS-03 | No `Database` type for Supabase client | `lib/supabase.ts` |
| NX-01 | `exercise/[slug]` should be a Server Component | `app/exercise/[slug]/page.tsx` |
| NX-02 | No `generateStaticParams` for exercise pages | `app/exercise/[slug]/page.tsx` |
| NX-08 | `next.config.ts` is empty | `next.config.ts` |
| TW-01 | Accent color is hardcoded hex, not a Tailwind token | `tailwind.config.ts` + all files |
| LOAD-01 | No page transition loading UI | Missing `loading.tsx` |
| LOAD-02 | Auth loading causes visible Navbar layout shift | `Navbar.tsx`, `AuthContext.tsx` |
| ERR-02 | No global error boundary | Missing `app/error.tsx` |
| EMPTY-01 | Related Exercises always empty | `lib/siteData.ts` |
| SB-02 | No Supabase database schema | Supabase dashboard |
| SB-04 | No `profiles` table for user data | Supabase dashboard |
| CR-01 | No shared `<Button>` component | Missing `components/ui/Button.tsx` |
| CR-04 | Auth page layout duplicated 3× | `login/`, `signup/`, `forgot-password/` |

### 🟡 Medium Priority — Fix Before v1.0 Feature Complete

| ID | Issue | File(s) |
|---|---|---|
| CQ-01 | `getDifficultyColor` duplicated in 2 files | Extract to `lib/utils.ts` |
| CQ-06 | Dead footer links | `Footer.tsx` |
| AUTH-04 | No password strength validation | `app/signup/page.tsx` |
| AUTH-05 | Profile dropdown only has "Sign Out" | `Navbar.tsx` |
| AUTH-06 | Navbar layout shift during auth loading | `Navbar.tsx` |
| SEC-04 | No CSRF plan for API Routes | Future API routes |
| SEC-05 | No rate limiting / debounce on auth forms | Auth pages |
| ERR-01 | Raw Supabase error messages shown to users | Auth pages |
| ERR-03 | `notFound()` in wrong component type | `app/exercise/[slug]/page.tsx` |
| SEO-04 | No `robots.ts` | Missing `app/robots.ts` |
| SEO-05 | No JSON-LD structured data | Exercise pages |
| SEO-08 | No favicon or app icons | `app/` public assets |
| A11Y-05 | No skip-to-content link | `app/layout.tsx` |
| A11Y-06 | `text-gray-500` fails WCAG AA on small text | Multiple components |
| A11Y-07 | Star ratings have no accessible text | `Reviews.tsx` |
| TS-01 | `siteData` not explicitly typed | `lib/siteData.ts` |
| NX-03 | No per-page metadata | All page files |
| NX-05 | No `loading.tsx` | `app/` directory |
| NX-06 | No `error.tsx` | `app/` directory |
| NX-07 | No `not-found.tsx` | `app/` directory |
| FS-02 | No `lib/utils.ts` | Missing |
| FS-03 | No `types/` directory | Missing |
| CR-02 | No shared `<Input>` component | Missing `components/ui/Input.tsx` |
| CR-06 | `ExerciseCard` inline, not a component | Missing `components/exercises/ExerciseCard.tsx` |
| LOAD-04 | Loading state is text-only, no spinner | Auth pages |
| EMPTY-02 | No empty state for exercise filter | `app/exercises/page.tsx` |
| MOB-03 | Profile dropdown state not reset on resize | `Navbar.tsx` |

### 🟢 Nice-to-Have — Post-Launch Polish

| ID | Issue | File(s) |
|---|---|---|
| CQ-02 | Framer Motion variants duplicated 7× | Extract to `lib/animations.ts` |
| FS-01 | Double-nested root directory | Project structure |
| FS-04 | Flat `components/` folder | Reorganize into subdirectories |
| PERF-03 | Auth pages import Framer Motion for one animation | Replace with CSS `@keyframes` |
| PERF-04 | 20 infinitely animating Hero particles | Add `IntersectionObserver` pause |
| PERF-05 | No `next/font` — potential CLS | `app/layout.tsx` |
| PERF-06 | No image optimization strategy | Plan for `next/image` usage |
| TW-02 | Hover color is one-off arbitrary value | `tailwind.config.ts` |
| TW-04 | No `@layer components` utilities | `globals.css` |
| TS-02 | `difficulty` helper accepts `string` not literal type | `lib/utils.ts` (after extraction) |
| TS-04 | No `types/` directory | Missing |
| A11Y-02 | Replace `focus:outline-none` with visible focus ring | All interactive elements |
| SEC-06 | Google Reviews link is `google.com` placeholder | `lib/siteData.ts` |
| SCALE-01 | No admin role/panel | Future feature |
| SCALE-02 | No payment integration (Razorpay) | Future feature |
| SCALE-06 | No monitoring (Sentry) or analytics | Future feature |
| MOB-04 | No swipe-to-close for mobile menu | `Navbar.tsx` |
| ERR-04 | No error handling in `getSession()` | `lib/AuthContext.tsx` |
| ERR-05 | No network error differentiation | Auth pages |

---

## Appendix: File-by-File Verdict

| File | Status | Key Issues |
|---|---|---|
| `app/layout.tsx` | ⚠️ Needs work | Global metadata only, no viewport export, no skip link |
| `app/page.tsx` | ✅ Clean | Correct server component composition |
| `app/login/page.tsx` | ⚠️ Needs work | No label `htmlFor`, no minLength, raw error messages |
| `app/signup/page.tsx` | ⚠️ Needs work | No label `htmlFor`, no password validation, no Google OAuth option |
| `app/forgot-password/page.tsx` | ❌ Broken | Wrong `redirectTo`, missing `/reset-password` target page |
| `app/exercise/[slug]/page.tsx` | ❌ Broken | Wrong component type, `notFound()` misuse, always-empty related exercises |
| `app/exercises/page.tsx` | ⚠️ Needs work | Duplicated helper, no search, no empty state |
| `app/about/page.tsx` | ❌ Stub | No content |
| `app/classes/page.tsx` | ❌ Stub | No content |
| `app/contact/page.tsx` | ❌ Stub | No content |
| `app/services/page.tsx` | ❌ Stub | No content |
| `components/Navbar.tsx` | ⚠️ Needs work | No ARIA, no keyboard support, layout shift |
| `components/Footer.tsx` | ⚠️ Needs work | Dead links |
| `components/Hero.tsx` | ⚠️ Needs work | Non-functional buttons, infinite animations |
| `components/Features.tsx` | ✅ Mostly fine | Unnecessary `'use client'` |
| `components/Membership.tsx` | ⚠️ Needs work | Non-functional buttons |
| `components/Reviews.tsx` | ⚠️ Needs work | No ARIA for stars, unnecessary `'use client'` |
| `components/CTA.tsx` | ⚠️ Needs work | Non-functional button, unnecessary `'use client'` |
| `components/TrustedSection.tsx` | ✅ Good | Placeholder Google link |
| `lib/AuthContext.tsx` | ✅ Good | Missing error handling in `getSession` |
| `lib/supabase.ts` | ⚠️ Needs work | No validation, no SSR client, no DB types |
| `lib/siteData.ts` | ⚠️ Needs work | Broken `relatedExercises`, not explicitly typed |
| `next.config.ts` | ❌ Empty | No headers, no image config |
| `tailwind.config.ts` | ⚠️ Needs work | Missing `accent` color token |
| `tsconfig.json` | ✅ Good | Strict mode enabled |
| `.gitignore` | ✅ Good | Correctly ignores `.env*` |
| `eslint.config.mjs` | ✅ Good | Prettier integration correct |
| `.prettierrc` | ✅ Good | Standard config |

---

*End of Audit — Gym56 Production Readiness Report*
