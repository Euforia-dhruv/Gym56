# Changelog

## v1.0.0 — 2026-07-03

### Sprint 4: Production Hardening & Launch Readiness

#### Features
- **Performance:** Replaced `<img>` with Next.js `<Image>` (profile avatar, uploader preview); configured `remotePatterns` for Supabase Storage
- **SEO:** `sitemap.ts`, `robots.ts`, `manifest.ts`, dynamic OpenGraph image (`1200×630`), Twitter/OG metadata, canonical URLs, JSON-LD schemas (LocalBusiness, Organization, HowTo for exercises, Product for equipment, BreadcrumbList)
- **PWA:** Service worker (`public/sw.js`), offline fallback page (`/offline`), installable manifest with SVG icons
- **Analytics:** Vercel Analytics, Vercel Speed Insights, Google Analytics 4, Microsoft Clarity — all with cookie consent gating (`CookieConsent` component)
- **Accessibility:** Focus trap in Modal, `aria-label` on social buttons and footer input, `aria-live`/`role="alert"` on dynamic content, keyboard support for Table headers, toggle menus
- **Security:** CSP + HSTS + X-Frame-Options + security headers in `next.config.ts`; Zod validation on all Server Action inputs; `requireAdmin()` on all admin-only actions; RLS profile privilege escalation fix
- **Error Handling:** `loading.tsx`/`error.tsx` at every route segment; shared `LoadingSpinner`, `ErrorFallback`, `NotFound` components; `not-found.tsx` for dynamic routes
- **Testing:** Vitest + Testing Library setup; 12 tests covering auth, equipment, exercises, memberships, contact, dashboard
- **Documentation:** `ARCHITECTURE.md`, `API.md`, `DATABASE.md`, `DEPLOYMENT.md`; `README.md` with full project structure and setup guide

#### Security Fixes
- Added `requireAdmin()` to: `getMembers()`, `getMemberById()`, `getDashboardStats()`, `getSubscriptions()`, `getSubscriptionCounts()`, `getContactMessages()`, `getUnreadCount()`
- Added Zod validation to: `submitContactForm()`, `updateMyProfile()`, `updateMemberProfile()`, `deleteEquipment()`, `deleteExercise()`, `toggleEquipmentPublish()`, `toggleExercisePublish()`, `uploadEquipmentImage()`, `uploadExerciseImage()`, `deleteEquipmentImage()`, `deleteContactMessage()`, `markAsRead()`, `deleteMembershipPlan()`
- Fixed RLS profiles UPDATE policy to prevent non-admin users from changing `role` column
- Added `IdParamSchema` (UUID validation) for all admin mutation ID parameters

#### Code Quality
- Removed unused `pluralise()` utility function
- Removed 4 unused type interfaces (`EquipmentImage`, `ExerciseStep`, `ExerciseRelated`, `EquipmentRelated`)
- Refactored Features component to import animation variants from shared `lib/animations.ts`
- Fixed 9 accessibility issues across Navbar, AdminSidebar, AdminHeader, ContactSection, Footer, DataTable, contact inbox

#### Build Status
- `npm run lint`: ✅ Zero warnings or errors
- `npx tsc --noEmit`: ✅ Zero errors
- `npm test`: ✅ 12/12 passing
- `npm run build`: ✅ 28 pages, zero warnings

### Sprint 3: Supabase Integration & Data Migration

- Migrated all application data from `siteData.ts` to Supabase database tables
- Created comprehensive database schema with migrations, RLS, storage buckets
- Implemented full CMS (equipment CRUD, exercise CRUD, membership CRUD, contact inbox)
- Member dashboard with profile editing, avatar upload, subscription status
- Seed data with equipment, exercises, and membership plans

### Sprint 2: Admin Dashboard UI Foundation

- Admin layout with sidebar navigation and header
- Admin pages: Dashboard, Equipment, Exercises, Members, Memberships, Contact, Settings
- UI component library (Button, Input, Modal, Table, Toast, Card, Badge, Pagination, Skeleton)
- Middleware for route protection
- Auth pages with email/password and Google OAuth

### Sprint 1: Initial MVP

- Next.js 15 App Router setup with Tailwind CSS and Framer Motion
- Public website (Hero, Features, Membership, Reviews, Trainers, Gallery, CTA, FAQ)
- Exercise library with detail pages
- Supabase Auth integration
- Responsive design with dark theme
