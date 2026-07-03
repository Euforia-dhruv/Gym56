# Sprint 2A — Admin Dashboard UI Foundation

> **Archive:** Historical sprint release document (July 2026).  
> The admin dashboard foundation was completed in this sprint.  
> All subsequent sprints built on this work. See [docs/](../) for current documentation.  
> Historical record — preserved for reference.


## Implementation Summary

> **Completed:** 2026-07-02  
> **Commit:** `4a216ce` — "Sprint 2A: Admin dashboard UI foundation"  
> **Branch:** `main`  
> **Tag:** _(not tagged — push and tag pending user approval)_

---

## Build & Lint Status

| Check | Result |
|---|---|
| `npm run lint` | ✅ No warnings or errors |
| `tsc --noEmit` | ✅ No type errors |
| `next build` | ✅ 20/20 pages generated successfully |
| Middleware | ✅ Compiled — 33.5 kB at edge |

### Build Output — Admin Routes

| Route | Size | Type |
|---|---|---|
| `/admin` | 1.42 kB | ○ Static |
| `/admin/contact` | 5.09 kB | ○ Static |
| `/admin/equipment` | 3.39 kB | ○ Static |
| `/admin/exercises` | 3.21 kB | ○ Static |
| `/admin/members` | 2.56 kB | ○ Static |
| `/admin/memberships` | 3.24 kB | ○ Static |
| `/admin/settings` | 5.35 kB | ○ Static |

All 7 admin routes are statically pre-rendered. First Load JS is well under 200 kB for all admin pages.

---

## Files Created (29 new files)

### `app/(admin)/` — Route Group

| File | Description |
|---|---|
| `app/(admin)/layout.tsx` | Route group layout — wraps all `/admin/*` in `AdminLayout` |
| `app/(admin)/admin/page.tsx` | Dashboard overview with stats, quick actions, activity, system status |
| `app/(admin)/admin/equipment/page.tsx` | Equipment CMS — searchable table, category filters, mock data |
| `app/(admin)/admin/exercises/page.tsx` | Exercise CMS — table with difficulty/category filters |
| `app/(admin)/admin/members/page.tsx` | Member management — avatar, status, plan, expiry |
| `app/(admin)/admin/memberships/page.tsx` | Plan cards + subscription history table |
| `app/(admin)/admin/contact/page.tsx` | Inbox-style UI — message list + detail pane |
| `app/(admin)/admin/settings/page.tsx` | Settings — gym info, contact, social links, opening hours |

### `components/admin/` — Admin Shell Components

| File | Description |
|---|---|
| `AdminLayout.tsx` | Root shell — sidebar + header + main content area + ToastProvider |
| `AdminSidebar.tsx` | Collapsible desktop sidebar + mobile drawer with `AnimatePresence` |
| `AdminHeader.tsx` | Sticky top bar — breadcrumb, notifications, profile dropdown |
| `StatCard.tsx` | Metric tile with trend indicator (up/down/neutral) |
| `DashboardCard.tsx` | Titled section card for dashboard widgets |
| `DataTable.tsx` | Full-featured table — search, sort, filter, pagination in one component |
| `SearchBar.tsx` | Accessible search input with clear button |
| `PageHeader.tsx` | Page title + description + action slot |
| `EmptyState.tsx` | Illustrated empty state with icon, title, description, optional CTA |
| `ConfirmDialog.tsx` | Destructive action confirmation modal (danger/warning variants) |

### `components/ui/` — Design System Primitives

| File | Description |
|---|---|
| `Button.tsx` | 5 variants (primary, outline, ghost, danger, success), 4 sizes, loading state |
| `Input.tsx` | Label + error + hint + leftIcon/rightIcon + full ARIA wiring |
| `Badge.tsx` | 6 variants, dot indicator, 2 sizes |
| `Card.tsx` | 3 variants (glass, solid, elevated) + `CardHeader`, `CardTitle`, `CardContent` |
| `Modal.tsx` | Accessible dialog — Escape key, backdrop click, body scroll lock, animations |
| `Skeleton.tsx` | `Skeleton`, `SkeletonCard`, `SkeletonRow`, `SkeletonTable` |
| `Table.tsx` | Typed generic table — sortable columns, loading rows, empty state |
| `Pagination.tsx` | Smart page number generator, keyboard accessible |
| `Toast.tsx` | `ToastProvider` + `useToast()` hook + animated toast region (4 variants) |

### `lib/`

| File | Description |
|---|---|
| `lib/utils.ts` | `cn()`, `getDifficultyColor()`, `getStatusColor()`, `getConditionColor()`, `slugify()`, `formatCurrency()`, `formatDate()`, `getInitials()`, `truncate()`, `pluralise()` |

### `docs/`

| File | Description |
|---|---|
| `docs/SPRINT2_ARCHITECTURE.md` | Full Sprint 2 revised architecture document (from architecture planning session) |
| `docs/SPRINT2A_SUMMARY.md` | This document |

---

## Files Modified (5 existing files)

| File | Changes |
|---|---|
| `tailwind.config.ts` | Added `accent`, `glass`, `admin` color tokens; `boxShadow` tokens |
| `app/globals.css` | Added admin surface utilities, accent shorthand classes, custom scrollbar, hover utilities |
| `middleware.ts` | Added `/admin` to `protectedRoutes` — unauthenticated users redirect to `/login` |
| `app/(admin)/admin/page.tsx` | _(created)_ — removed unused `Plus` import after lint |
| `app/(admin)/admin/contact/page.tsx` | _(created)_ — removed unused `Search` import after lint |

---

## New Dependencies Added

| Package | Version | Purpose |
|---|---|---|
| `clsx` | ^2.x | Conditional class merging for `cn()` |
| `tailwind-merge` | ^2.x | Tailwind class conflict resolution in `cn()` |

---

## Components Added Summary

| Category | Components |
|---|---|
| UI Primitives | Button, Input, Badge, Card, Modal, Skeleton, Table, Pagination, Toast |
| Admin Shell | AdminLayout, AdminSidebar, AdminHeader |
| Admin Widgets | StatCard, DashboardCard, DataTable, SearchBar, PageHeader, EmptyState, ConfirmDialog |

**Total new components: 19**

---

## Pages Added

| Route | Title | Features |
|---|---|---|
| `/admin` | Dashboard | 6 stat cards, quick actions, recent activity, system status, sprint roadmap |
| `/admin/equipment` | Equipment | Category filter pills, searchable DataTable, condition/availability badges, ConfirmDialog delete |
| `/admin/exercises` | Exercises | Category + difficulty filters, difficulty badges, published/draft status |
| `/admin/members` | Members | Coloured initials avatar, status filter tabs, expiry date highlighting |
| `/admin/memberships` | Memberships | Plan cards with subscriber counts, subscription history DataTable |
| `/admin/contact` | Contact Inbox | Split-pane inbox, unread badge, mark-as-read state, message detail view |
| `/admin/settings` | Settings | Gym info, contact details, social links, opening hours editor, save toasts |

---

## Design Decisions

| Decision | Rationale |
|---|---|
| All admin pages are `'use client'` | Mock data + interactive filters require client state. Will be refactored to Server Component + client island pattern in Sprint 2A when DB is connected. |
| Mock data co-located in page files | Keeps Sprint 2A self-contained. Will be replaced by Supabase queries via `lib/supabase-server.ts` in Sprint 2A. |
| `(admin)` route group | Clean separation from public routes. Layout auto-applied to all `/admin/*` paths without polluting the root layout. |
| All admin routes: Static (`○`) | Since mock data is inline, Next.js pre-renders everything. Will become dynamic server-rendered once connected to DB. |
| `ToastProvider` inside `AdminLayout` | Scoped to admin area only — doesn't affect public site. |
| `protectedRoutes: ['/admin']` | Middleware guards the entire admin area at the edge with session-cookie detection. Full role-based check (JWT claim `user_role === 'admin'`) deferred to Sprint 2A with `@supabase/ssr`. |

---

## Known TODOs (Tracked for Sprint 2A+)

| ID | Issue | Sprint |
|---|---|---|
| TODO-01 | Replace all mock data with Supabase DB queries | 2A |
| TODO-02 | Add `@supabase/ssr` → `lib/supabase-server.ts` + `lib/supabase-admin.ts` | 2A |
| TODO-03 | Upgrade middleware to verify `user_role === 'admin'` JWT claim | 2A |
| TODO-04 | Wire up Equipment `Edit` and `Add Equipment` buttons to create/edit forms | 2A |
| TODO-05 | Wire up Exercise `Edit` and `Add Exercise` to forms with step builder | 2C |
| TODO-06 | Wire up Member `View` and `Edit` to member detail page | 2B |
| TODO-07 | Wire Settings save buttons to Server Actions | 2A |
| TODO-08 | Add `ImageUploader` component for equipment photo management | 2A |
| TODO-09 | Add `SortableStepList` for exercise step reordering | 2C |
| TODO-10 | Connect Contact inbox replies to actual email sending | 2A |
| TODO-11 | Move `Membership.tsx` (public) to read from `membership_plans` DB table | 2A |
| TODO-12 | Add `loading.tsx` files for all admin routes | 2A |
| TODO-13 | Add `error.tsx` global error boundary for admin | 2A |
| TODO-14 | Add `not-found.tsx` for admin 404 | 2A |
| TODO-15 | Add analytics charts to `/admin/analytics` page | 2H |
| TODO-16 | Membership "Coming in 2A" danger zone button — wire to real reset action | 2A |
| TODO-17 | Settings: populate real values from DB once `gym_settings` table exists | 2A |
| TODO-18 | Contact inbox: persist `isRead` state to `contact_submissions` DB table | 2A |
| TODO-19 | Replace `lucide-react` social link `Link` icon with actual brand icons | Post-2A |
| TODO-20 | Add `Textarea` and `Select` to `components/ui/` | 2A |

---

## Route Map (Post Sprint 2A)

```
/admin                    ← Dashboard overview
/admin/equipment          ← Equipment CMS list
/admin/equipment/new      ← (TODO-04)
/admin/equipment/[id]     ← (TODO-04)
/admin/exercises          ← Exercise CMS list
/admin/exercises/new      ← (TODO-05)
/admin/exercises/[id]     ← (TODO-05)
/admin/members            ← Member list
/admin/members/[id]       ← (TODO-06)
/admin/memberships        ← Plans + subscriptions
/admin/memberships/plans  ← (future)
/admin/contact            ← Inbox UI
/admin/settings           ← Gym settings
/admin/analytics          ← (Sprint 2H)
```

---

*Sprint 2A UI foundation complete. Ready for Sprint 2A database integration.*
