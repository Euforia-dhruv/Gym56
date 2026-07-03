# Deployment Guide

## Prerequisites

- GitHub account
- Vercel account (Hobby plan works; Pro recommended for production)
- Supabase account (Pro plan recommended for production — required for 7+ day backup history)

## Environment Variables

| Variable | Required | Source |
|----------|----------|--------|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase Dashboard → Settings → API → Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase Dashboard → Settings → API → Anon Key |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | Supabase Dashboard → Settings → API → Service Role Key |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | No | Google Analytics 4 Admin → Data Stream → Measurement ID |
| `NEXT_PUBLIC_CLARITY_PROJECT_ID` | No | Microsoft Clarity Dashboard → Project → Project ID |

## Supabase Setup

### 1. Create Project
1. Go to [supabase.com](https://supabase.com) and create a new project
2. Note the project URL, anon key, and service role key from Settings → API

### 2. Run Migrations
Execute migrations in order from `supabase/migrations/` via the Supabase SQL Editor:

```sql
-- 1. Core tables (profiles, membership_plans, subscriptions, equipment, exercises, etc.)
-- 2. RLS policies
-- 3. Storage buckets
-- 4. JWT access token hook
-- 5. Equipment supplementary fields (how_to_use, safety_tips, equipment_related)
-- 6. Extended exercise categories
-- 7. Seed data (optional — run last)
```

**Recommended order:**
```
001_core_tables.sql
002_rls_policies.sql
003_storage_buckets.sql
004_custom_access_token_hook.sql
006_equipment_supplementary_fields.sql
007_fix_exercise_categories.sql
005_seed_data.sql
```

### 3. Enable Access Token Hook
1. Go to Supabase Dashboard → Auth → Hooks
2. Click "Access Token Hook" → "Create a new hook"
3. Set: Schema `public`, Function `custom_access_token_hook`, Type `Before JWT Created`
4. Save — this injects `user_role` into JWT claims for middleware auth checks

### 4. Create Admin User
1. Deploy the app (or run locally)
2. Sign up at `/signup` with your email
3. In Supabase Dashboard → SQL Editor, run:
   ```sql
   UPDATE public.profiles SET role = 'admin' WHERE id = '<your-user-uuid>';
   ```
4. Sign out and sign back in — the JWT will now contain `user_role: 'admin'`

### 5. Verify Setup
- [ ] All tables have RLS enabled
- [ ] Storage buckets exist: `avatars`, `equipment-images`, `exercise-media`
- [ ] Access Token Hook is active
- [ ] Seed data loaded (optional)

## Vercel Deployment

### Step 1: Push to GitHub
```bash
git add .
git commit -m "Ready for production"
git push
```

### Step 2: Import in Vercel
1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Framework preset: Next.js (auto-detected)

### Step 3: Add Environment Variables
Add all environment variables in Vercel Dashboard → Project Settings → Environment Variables.

**Important:** `NEXT_PUBLIC_` prefixed variables are exposed to the browser. Never prefix `SUPABASE_SERVICE_ROLE_KEY` with `NEXT_PUBLIC_`.

### Step 4: Deploy
Click "Deploy". Vercel will build and deploy automatically. The build runs:
- `npm run lint` (ESLint check)
- `npx tsc --noEmit` (TypeScript check)
- `next build` (Production build with static generation)

### Step 5: Custom Domain (Optional)
1. Go to Vercel Dashboard → Project → Domains
2. Add your custom domain
3. Update DNS records as instructed by Vercel

## Post-Deployment Checklist

- [ ] All pages render correctly (test public pages, admin pages, dashboard)
- [ ] Authentication works (login, signup, forgot/reset password, admin login)
- [ ] Equipment CRUD works in admin (/admin/equipment)
- [ ] Exercise CRUD works in admin (/admin/exercises)
- [ ] Membership plan management works (/admin/memberships)
- [ ] Contact form submissions work (test form, check /admin/contact)
- [ ] Image uploads work (admin equipment/exercise images)
- [ ] SEO metadata renders (test with OpenGraph debugger)
- [ ] Sitemap is accessible at `/sitemap.xml`
- [ ] Robots.txt is accessible at `/robots.txt`
- [ ] PWA manifest is accessible at `/manifest.webmanifest`
- [ ] Service worker registers successfully (check DevTools → Application → Service Workers)
- [ ] Error pages render (test `/404`, trigger errors in admin)
- [ ] Security headers present (check with securityheaders.com)
- [ ] Offline page works (disconnect network, navigate to cached page)
- [ ] Lighthouse score: Performance 90+, Accessibility 100, Best Practices 100, SEO 100

## Performance Monitoring

| Tool | Purpose | Setup |
|------|---------|-------|
| Vercel Analytics | Page views, top pages, geographic data | Auto-enabled |
| Vercel Speed Insights | LCP, CLS, INP (Core Web Vitals) | Auto-enabled |
| Google Analytics 4 | Detailed user behavior analytics | When `NEXT_PUBLIC_GA_MEASUREMENT_ID` is set |
| Microsoft Clarity | Session recordings, heatmaps | When `NEXT_PUBLIC_CLARITY_PROJECT_ID` is set |

All analytics respect cookie consent via the `CookieConsent` component. GA4 and Clarity only load after user acceptance.

## Troubleshooting

### Build fails
1. Check lint: `npm run lint`
2. Check TypeScript: `npx tsc --noEmit`
3. Check for missing environment variables
4. Run tests: `npm test`

### Auth not working
1. Verify Supabase project URL and anon key in environment variables
2. Check the Access Token Hook is enabled in Supabase Dashboard → Auth → Hooks
3. Check `middleware.ts` for correct cookie handling (Next.js 15 App Router)
4. Verify the admin user has `role = 'admin'` in the `profiles` table

### Images not loading
1. Verify `remotePatterns` in `next.config.ts` matches your Supabase storage URL
2. Check storage bucket permissions (public/private)
3. Verify the images exist in the bucket
4. Check browser console for CSP errors (Content Security Policy may block Supabase URLs)

### PWA / Offline not working
1. Verify service worker is registered (DevTools → Application → Service Workers)
2. Check that offline page loads at `/offline`
3. Clear browser cache and re-register the service worker

### Middleware blocking legitimate requests
1. Check browser cookies — `sb-*-auth-token` must be present
2. Verify the JWT contains `user_role` claim (from Access Token Hook)
3. Check `middleware.ts` matcher configuration
