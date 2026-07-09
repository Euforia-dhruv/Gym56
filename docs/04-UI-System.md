# UI System — Gym56

| Metadata | Value |
|----------|-------|
| **Version** | 1.0.0 |
| **Updated** | 2026-07-08 |
| **Framework** | Tailwind CSS 3.4+ |
| **Icons** | Lucide React 1.x |
| **Animation** | Framer Motion 12.x + CSS keyframes |

---

## 1. Design Tokens

All tokens are defined in `tailwind.config.ts` and `app/globals.css`.

### 1.1 Colors

| Token | Value | Usage |
|-------|-------|-------|
| `--background` | `#0a0a0a` | Page background |
| `--foreground` | `#ffffff` | Default text |
| `accent DEFAULT` | `#DC2626` | Primary action, links, highlights |
| `accent-hover` | `#B91C1C` | Button hover state |
| `accent-light` | `rgba(220,38,38,0.1)` | Subtle backgrounds |
| `accent-glow` | `rgba(220,38,38,0.3)` | Box shadows |
| `glass DEFAULT` | `rgba(10,10,10,0.6)` | Public page cards |
| `glass-border` | `rgba(255,255,255,0.1)` | Card borders |
| `glass-hover` | `rgba(255,255,255,0.05)` | Card hover |
| `admin-sidebar` | `#0d0d0d` | Admin sidebar |
| `admin-surface` | `#111111` | Admin card backgrounds |
| `admin-elevated` | `#161616` | Admin elevated surfaces |
| `admin-border` | `rgba(255,255,255,0.08)` | Admin borders |
| `admin-muted` | `#6b7280` | Admin secondary text |

Status colors are applied via inline utility classes (not as theme tokens):
- **Green:** `bg-green-500/20 text-green-400` (success, beginner)
- **Yellow:** `bg-yellow-500/20 text-yellow-400` (warning, intermediate)
- **Red:** `bg-red-500/20 text-red-400` (error, advanced)
- **Blue:** `bg-blue-500/20 text-blue-400` (info)

### 1.2 Shadows

| Token | Value |
|-------|-------|
| `shadow-accent` | `0 0 20px rgba(220,38,38,0.3)` |
| `shadow-accent-sm` | `0 0 10px rgba(220,38,38,0.2)` |
| `shadow-glass` | `0 8px 32px rgba(0,0,0,0.4)` |
| `shadow-card` | `0 4px 16px rgba(0,0,0,0.3)` |

### 1.3 Typography

| Property | Value |
|----------|-------|
| Font family | System stack (Inter, -apple-system, Segoe UI, sans-serif) |
| Body size | 14px–16px (`text-sm`, `text-base`) |
| Headings | Bold, white (`text-white`, `font-bold`) |
| Muted | `text-gray-400`, `text-gray-500` |

No external fonts loaded (system font stack only).

### 1.4 Border Radius

| Size | Value |
|------|-------|
| Small | `rounded-lg` (8px) |
| Default | `rounded-xl` (12px) |
| Large | `rounded-2xl` (16px) |

Not theme tokens — applied inline via Tailwind classes.

---

## 2. Component Library

All components in `components/ui/` are **hand-written** (not shadcn/ui). They share:
- TypeScript interfaces with full prop types
- `cn()` from `lib/utils.ts` for class merging
- Dark theme (black backgrounds, silver/white text, red accent)
- Accessibility (ARIA attributes, keyboard navigation, focus management)

### 2.1 Button

| Prop | Options |
|------|---------|
| `variant` | `primary` \| `outline` \| `ghost` \| `danger` \| `success` |
| `size` | `sm` \| `md` \| `lg` \| `icon` |
| `loading` | boolean (shows spinner) |
| `disabled` | boolean |

```tsx
<Button variant="primary" size="md" loading={isSubmitting}>
  Submit
</Button>
```

**Accessibility:** `aria-disabled`, `role`, focus ring (`focus-visible:ring-2`), loading spinner with `aria-hidden`.

### 2.2 Card

| Prop | Options |
|------|---------|
| `variant` | `glass` \| `solid` \| `elevated` |
| `padding` | `none` \| `sm` \| `md` \| `lg` |

Sub-components: `CardHeader`, `CardTitle`, `CardContent`.

```tsx
<Card variant="glass" padding="md">
  <CardHeader><CardTitle>Title</CardTitle></CardHeader>
  <CardContent>Content here</CardContent>
</Card>
```

### 2.3 Modal

| Prop | Options |
|------|---------|
| `open` | boolean |
| `onClose` | `() => void` |
| `title` | string (optional) |
| `description` | string (optional) |
| `size` | `sm` \| `md` \| `lg` \| `xl` |

**Accessibility:** `role="dialog"`, `aria-modal="true"`, focus trap (Tab/Shift+Tab cycle), Escape key to close, backdrop click to close, focus restored on unmount.

```tsx
<Modal open={isOpen} onClose={() => setIsOpen(false)} title="Confirm" size="sm">
  <p>Are you sure?</p>
</Modal>
```

### 2.4 Toast

| Prop | Options |
|------|---------|
| `variant` | `success` \| `error` \| `warning` \| `info` |
| `title` | string |
| `description` | string (optional) |
| `duration` | number (default 4000ms) |

Usage via context:

```tsx
const { toast } = useToast()
toast({ title: "Saved!", variant: "success" })
```

**Accessibility:** `role="alert"`, auto-dismiss, dismiss button with `aria-label`.

### 2.5 Input

| Prop | Options |
|------|---------|
| `label` | string (optional) |
| `error` | string (optional) |
| `hint` | string (optional) |
| `leftIcon` | ReactNode (optional) |
| `rightIcon` | ReactNode (optional) |

**Accessibility:** `aria-describedby` for hints/errors, `aria-invalid` for error state, `htmlFor` label association.

### 2.6 Select

| Prop | Options |
|------|---------|
| `label` | string (optional) |
| `error` | string (optional) |
| `hint` | string (optional) |
| `options` | `{ value, label }[]` |
| `placeholder` | string (optional) |

**Accessibility:** Same pattern as Input.

### 2.7 Table

| Prop | Type |
|------|------|
| `columns` | `Column<T>[]` (typed) |
| `data` | `T[]` (typed) |
| `keyExtractor` | `(row: T) => string` |
| `sortable` | Boolean per column |
| `loading` | Shows 5-row skeleton |
| `emptyMessage` | Custom empty state text |

**Accessibility:** `role="button"` on sortable headers, `aria-sort` for active sort direction, keyboard-accessible sorting (Enter/Space).

### 2.8 Additional Components

| Component | Description |
|-----------|-------------|
| `Badge` | Inline status/difficulty labels (colored) |
| `Breadcrumb` | Navigation breadcrumbs |
| `Pagination` | Page navigation controls |
| `Skeleton` | Loading placeholder with shimmer animation |
| `Textarea` | Multi-line text input with label/error/hint |

---

## 3. CSS Architecture

### 3.1 Base Layer (`app/globals.css`)

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --background: #0a0a0a;
  --foreground: #ffffff;
  --accent: #dc2626;
}
```

### 3.2 Utility Classes

| Class | Effect |
|-------|--------|
| `.glass` | `rgba(10,10,10,0.6)` background + `blur(16px)` + white border |
| `.bg-admin-sidebar` | `#0d0d0d` |
| `.bg-admin-surface` | `#111111` |
| `.bg-admin-elevated` | `#161616` |
| `.bg-accent` / `.text-accent` / `.border-accent` | Red token shorthands |
| `.bg-accent/5` through `.bg-accent/30` | Red opacity variants |
| `.hover-bg-accent-hover` | `#B91C1C` on hover |
| `.hover-bg-accent/20` | Red hover for ghost buttons |

### 3.3 Animation Classes

| Class | Animation | Duration |
|-------|-----------|----------|
| `.animate-float` | Float up/down 6px | 4s ease-in-out infinite |
| `.animate-pulse-glow` | Pulse box-shadow | 3s ease-in-out infinite |
| `.animate-shimmer` | Background gradient sweep | 2s ease-in-out infinite |
| `.animate-bounce-gentle` | Subtle bounce 4px | 8s ease-in-out infinite |
| `.hover-lift` | TranslateY(-6px) + shadow | 0.4s cubic-bezier |
| `.hover-zoom` | Scale(1.03) | 0.5s cubic-bezier |
| `.heading-glow` | Radial gradient glow behind headings | 6s ease-in-out infinite |

### 3.4 Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

### 3.5 Scrollbar

Custom thin scrollbar (8px) with dark track, gray thumb, red hover state. Firefox variant via `scrollbar-width: thin`.

---

## 4. Layout

### 4.1 Public Pages

- **Background:** `#0a0a0a` (solid black)
- **Surfaces:** Glassmorphism cards (`.glass` utility) with `blur(16px)`
- **Accent:** Red (#DC2626) for buttons, links, interactive elements
- **Grid:** CSS Grid with responsive columns (`grid-cols-1 md:grid-cols-2 lg:grid-cols-3`)

### 4.2 Admin Panel

- **Sidebar:** `#0d0d0d`, fixed width, contains nav links with icons
- **Content:** `#111111` surfaces, `#161616` elevated cards
- **Borders:** `rgba(255,255,255,0.08)` dividers
- **Tables:** Dark rows with `rgba(255,255,255,0.03)` hover

### 4.3 Dashboard (Member)

- Same admin palette (`#111111` surfaces, `#0d0d0d` sidebar)
- Profile editing with avatar upload (Supabase Storage)

---

## 5. Responsive Design

| Breakpoint | Tailwind | Target |
|------------|----------|--------|
| Mobile | default (<640px) | Single column, stacked navigation |
| Tablet | `sm` (640px) | Two columns, sidebar visible |
| Desktop | `lg` (1024px) | Full layout, 3+ columns |
| Wide | `xl` (1280px) | Max content width |

All components are mobile-first:
- `Button` uses `w-full` on mobile, `w-auto` on desktop
- `Card` grid uses `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`
- Admin sidebar collapses to top nav on mobile
- Modal uses `mx-4` on mobile, `max-w-md` on desktop

---

## 6. Accessibility

| Requirement | Implementation |
|-------------|---------------|
| Focus indicators | `focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-black` |
| Keyboard nav | Tab through all interactive elements; Enter/Space to activate |
| ARIA labels | All interactive elements have accessible names |
| Roles | `dialog`, `alert`, `button`, `columnheader` with proper `role` attrs |
| Focus management | Modal traps focus, restores to trigger on close |
| Reduced motion | `@media (prefers-reduced-motion: reduce)` disables all animations |
| Color contrast | White text on black background exceeds WCAG AA |

---

## 7. Theme

Gym56 uses a **dark-only** theme. No light mode or theme toggle is implemented.

The `--background` CSS variable is set to `#0a0a0a` in `:root` with no media query or class override.

---

## 8. Icons

All icons use [Lucide React](https://lucide.dev). Import pattern:

```tsx
import { Dumbbell, ChevronRight, X } from 'lucide-react'
```

Icons are rendered at `w-4 h-4` to `w-6 h-6` depending on context. All have `aria-hidden="true"`.
