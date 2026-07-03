# Gym 56 — Premium Fitness in Gandhinagar

A full-stack Next.js application for Gym 56, a premium fitness gym in Sector 26, Gandhinagar, Gujarat.

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript (strict mode)
- **Database:** Supabase (PostgreSQL) with Row Level Security
- **Auth:** Supabase Auth (Email/Password + Google OAuth)
- **Storage:** Supabase Storage (equipment images, exercise media, avatars)
- **Styling:** Tailwind CSS + Framer Motion
- **Validation:** Zod (shared server/client)
- **Analytics:** Vercel Analytics, Vercel Speed Insights, Google Analytics 4, Microsoft Clarity
- **Testing:** Vitest + Testing Library
- **Deployment:** Vercel (Edge + Serverless)

## Features

### Public Website
- Landing page with hero, features, trainers, transformations gallery
- Equipment library with category filtering and detail pages (SSG)
- Exercise library with step-by-step instructions, target muscles, and safety tips (SSG)
- Membership plans with pricing (from database)
- Contact form with Supabase storage
- Service pages, class schedules, about page
- SEO optimized — JSON-LD schemas (LocalBusiness, Organization), OpenGraph images, Twitter cards
- PWA support — offline page and service worker for static asset caching

### Admin CMS (`/admin`)
- Dashboard with real-time stats (members, equipment, subscriptions)
- Equipment CRUD with image upload and gallery management
- Exercise CRUD with step builder and category/difficulty filters
- Membership plan management (pricing tiers, active/inactive)
- Member management with subscription tracking
- Contact inbox with read/unread management
- Role-based access (`admin` role required)

### Member Dashboard (`/dashboard`)
- Profile overview with membership status and days remaining
- Edit profile (name, phone, avatar upload)
- Subscription history
- Quick links to exercises and equipment

### Security
- Defence-in-depth: Middleware → RLS → Server Action role check
- HTTP security headers (CSP, HSTS, X-Frame-Options, etc.)
- Row Level Security on all database tables
- Admin role via JWT custom claims (no DB query in middleware)
- Cookie consent for analytics tracking

### Performance
- Static pages pre-rendered at build time (`generateStaticParams`)
- Server Components minimize client JavaScript
- Next.js `<Image>` with `remotePatterns` for Supabase Storage
- Core Web Vitals monitoring via Vercel Speed Insights

## Getting Started

### 1. Prerequisites

- Node.js 18+
- A Supabase account (free tier works for development)

### 2. Clone and Install

```bash
git clone <your-repo-url>
cd gym56
npm install
```

### 3. Set Up Supabase

1. Create a new Supabase project
2. Go to the SQL Editor and run the migrations in order (see `docs/DEPLOYMENT.md` for the recommended order):
   - `001_core_tables.sql`
   - `002_rls_policies.sql`
   - `003_storage_buckets.sql`
   - `004_custom_access_token_hook.sql`
   - `006_equipment_supplementary_fields.sql`
   - `007_fix_exercise_categories.sql`
   - `005_seed_data.sql`
3. Enable the Access Token Hook: Auth → Hooks → Access Token Hook → Schema `public`, Function `custom_access_token_hook`, Type `Before JWT Created`
4. Copy your Supabase URL, anon key, and service role key from Settings → API

### 4. Configure Environment

```bash
cp .env.example .env.local
```

Edit `.env.local` with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX (optional)
NEXT_PUBLIC_CLARITY_PROJECT_ID=xxxxxxxx (optional)
```

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 6. Create Admin User

1. Sign up at `/signup` with your email
2. In Supabase Dashboard → SQL Editor, run:
   ```sql
   UPDATE public.profiles SET role = 'admin' WHERE id = '<your-user-uuid>';
   ```
3. Sign out and sign back in to get the admin JWT claim

## Deployment

### Deploy to Vercel

1. Push your code to a Git repository
2. Import the project in Vercel
3. Add the environment variables (see `.env.example` for the full list)
4. Deploy!

See `docs/DEPLOYMENT.md` for detailed deployment instructions.

### Build Locally

```bash
npm run build
```

### Lint

```bash
npm run lint
```

### Test

```bash
npm test         # Run once
npm run test:watch  # Watch mode
```

## Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── (admin)/            # Admin route group (role: admin)
│   ├── (member)/           # Member dashboard route group
│   ├── equipment/          # Public equipment pages (SSG)
│   ├── exercise/           # Exercise detail pages (SSG)
│   ├── (public)/           # Public marketing pages (home, about, classes, etc.)
│   ├── (auth)/             # Auth pages (login, signup, forgot/reset password)
│   └── ...                 # Other pages (contact, services, etc.)
├── components/             # React components
│   ├── admin/              # Admin CMS components
│   ├── shared/             # Shared loading, error, not-found components
│   ├── ui/                 # Design system (Modal, Table, Toast, Button, etc.)
│   ├── home/               # Homepage sections
│   ├── layout/             # Navbar, Footer
│   └── auth/               # Auth-related components
├── lib/                    # Server-side logic
│   ├── actions/            # Server Actions (equipment, exercises, memberships, etc.)
│   ├── supabase-*.ts       # Supabase client factories (server, browser, admin)
│   └── utils.ts            # Utility functions (cn, slugify, formatCurrency, etc.)
├── types/                  # TypeScript type definitions
│   ├── api.ts              # Zod schemas + inferred types
│   ├── supabase.ts         # Generated Supabase types
│   ├── index.ts            # Shared types
│   └── global.d.ts         # Global augmentations (gtag, clarity)
├── supabase/migrations/    # Database migrations (SQL)
├── public/                 # Static assets
│   ├── sw.js               # Service worker (PWA offline support)
│   └── gym56-logo.*        # Logo files (SVG, PNG)
├── tests/                  # Vitest test files
└── docs/                   # Documentation
    ├── ARCHITECTURE.md     # System architecture
    ├── API.md              # Server Action API reference
    ├── DATABASE.md         # Database schema
    ├── DEPLOYMENT.md       # Deployment guide
    ├── releases/           # Historical sprint release docs
    └── archive/            # Archived audit docs
```

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm test` | Run tests once |
| `npm run test:watch` | Run tests in watch mode |

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase anonymous key |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | Supabase service role key (admin operations) |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | No | Google Analytics 4 measurement ID |
| `NEXT_PUBLIC_CLARITY_PROJECT_ID` | No | Microsoft Clarity project ID |

## Documentation

| Document | Description |
|----------|-------------|
| `docs/ARCHITECTURE.md` | System architecture and design decisions |
| `docs/API.md` | Server Action API reference |
| `docs/DATABASE.md` | Database schema and migrations |
| `docs/DEPLOYMENT.md` | Deployment guide and troubleshooting |

## License

Private — Gym 56
