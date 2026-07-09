# Testing — Gym56

| Metadata | Value |
|----------|-------|
| **Version** | 1.0.0 |
| **Updated** | 2026-07-08 |
| **Framework** | Vitest 4.x |
| **Environment** | jsdom |
| **Test Files** | 4 (in `tests/`) |

---

## 1. Test Stack

| Layer | Tool | Purpose |
|-------|------|---------|
| Runner | Vitest 4.x | Unit + integration tests |
| DOM | jsdom 29.x | DOM environment |
| React | Testing Library 16.x | Component rendering (planned) |
| Mocking | `vi.mock()` | Module mocking |

---

## 2. Running Tests

```bash
npm run test       # Run all tests (vitest run)
npm run test:watch # Watch mode (vitest)
```

---

## 3. Test Files

### `tests/auth.test.ts`

Tests the `handle_new_user()` trigger logic by mocking Supabase's profile creation:

```ts
// What it tests:
// - Profile creation mirrors auth.users signup
// - Default role is 'member'
// - full_name falls back to email
```

### `tests/contact.test.ts`

Tests the contact form Server Action:

```ts
// What it tests:
// - Valid form submission (name, email, subject, message)
// - Invalid email rejection
// - Empty required fields
// - Zod validation errors
```

### `tests/equipment.test.ts`

Tests equipment CRUD Server Actions:

```ts
// What it tests:
// - Create equipment with valid data
// - Zod schema validation
// - Update equipment fields
// - Soft delete (sets deleted_at)
// - Undelete restores equipment
```

### `tests/exercises.test.ts`

Tests exercise CRUD Server Actions:

```ts
// What it tests:
// - Create exercise with valid data
// - Slug auto-generation
// - Category/difficulty validation
// - Exercise steps management
```

---

## 4. Test Patterns

### Supabase Mocking

```ts
vi.mock('@supabase/ssr', () => ({
  createServerClient: vi.fn(() => mockSupabase),
}))
```

All tests mock the Supabase server client. The mock implementation varies per test file but follows the same pattern: `vi.fn()` for each method chained in the builder pattern (`from().select().eq().single()`).

### Server Action Testing

Each Server Action is tested by:
1. Calling the exported function with controlled inputs
2. Asserting the return shape `{ success, data?, message?, error? }`
3. Verifying the mock Supabase was called with expected parameters

---

## 5. Coverage

No coverage thresholds configured. Coverage can be measured with:

```bash
npx vitest run --coverage
```

(Requires `@vitest/coverage-v8` to be installed.)

---

## 6. Linting & Type Checking

```bash
npm run lint       # ESLint (next lint)
npm run typecheck  # tsc --noEmit (via next build)
```

Both run automatically during `next build` on Vercel.

---

## 7. CI

No CI pipeline configured. Tests must be run manually before deploy.

```bash
# Pre-deploy checklist
npm run lint && npm run typecheck && npm run test && npm run build
```
