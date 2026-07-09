# Deployment — Gym56

| Metadata | Value |
|----------|-------|
| **Version** | 1.0.0 |
| **Updated** | 2026-07-08 |
| **Platform** | Vercel (serverless) |
| **Database** | Supabase (PostgreSQL, managed) |
| **AI** | NVIDIA GLM-5.2 via `integrate.api.nvidia.com/v1` |
| **Images** | ImageKit CDN (ExerciseDB) + Supabase Storage (uploads) |

---

## 1. Architecture

```
Browser ──▶ Vercel Edge (Middleware)
                │
    ┌───────────┼───────────┐
    ▼           ▼           ▼
Next.js SSR  Server     Route
(Pages)     Actions    Handlers
    │           │           │
    ▼           ▼           ▼
Supabase    Supabase    NVIDIA
(public)    (service    GLM-5.2
 + RLS       _role)     (SSE)
```

- **Frontend:** Next.js 15 App Router (SSR)
- **API:** Server Actions for CRUD (service_role Supabase client)
- **Auth:** Supabase SSR cookie-based sessions
- **Storage:** Supabase Storage (avatars, equipment images, exercise media)
- **CDN:** ImageKit for ExerciseDB GIFs
- **AI:** NVIDIA GLM-5.2 via `integrate.api.nvidia.com/v1`

---

## 2. Environment Variables

### Required

| Variable | Value / Source |
|----------|---------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service_role key |
| `BLUESMINDS_API_KEY` | NVIDIA API key (`nvapi-...`) |
| `BLUESMINDS_BASE_URL` | `https://integrate.api.nvidia.com/v1` |
| `BLUESMINDS_MODEL` | `z-ai/glm-5.2` |

### Setting Vars on Vercel

```bash
vercel env add NEXT_PUBLIC_SUPABASE_URL production
vercel env add BLUESMINDS_API_KEY production --secret

# Or via Dashboard → Project Settings → Environment Variables
```

---

## 3. Deploy

```bash
# One-time deploy
npx vercel --prod

# Or push to main (auto-deploy if Git integration configured)
git push origin main
```

### Deploy Checklist

- [ ] All env vars set in Vercel
- [ ] Database migrations applied (Supabase Dashboard SQL Editor)
- [ ] `/` loads without errors
- [ ] `/exercises` loads 900+ entries
- [ ] `/ai-coach` sends message successfully
- [ ] `/login` → `/dashboard` works
- [ ] `/admin` renders sidebar + loads CRUD pages

---

## 4. Database

### Apply Migrations

```sql
-- Open Supabase Dashboard → SQL Editor
-- Paste and run migration files in order (001 → 013)
```

### Seed Data

After migrations, seed files (005, 010, 012) populate initial data.

### Rollback

```sql
DROP TABLE IF EXISTS target_table CASCADE;
-- Or restore from Supabase backup (Dashboard → Database → Backups)
```

---

## 5. Monitoring

| Tool | Purpose |
|------|---------|
| Vercel Dashboard | Deploy logs, function logs, error tracking |
| Vercel Analytics | Page views (configurable in root layout) |
| Vercel Speed Insights | LCP, CLS, INP (configurable) |

No Sentry, no uptime monitoring configured.

---

## 6. Security Headers

Configured in `next.config.ts`:
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`
- `Permissions-Policy: camera=(), microphone=(), geolocation=(), interest-cohort=()`

No Content-Security-Policy configured (future improvement).

---

## 7. Known Issues

| Issue | Workaround |
|-------|------------|
| NVIDIA GLM-5.2 cold start ~60-90s | Warm with scheduled ping (cron-job.org → GET /api/chat with a ping message) |
| No CSP header | Security best practice — add to `next.config.ts` if needed |
| No CI/CD pipeline | Manual deploy only |
| No automated backups beyond Supabase daily | Download manual backup periodically |
