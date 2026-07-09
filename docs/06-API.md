# API Reference — Gym56

| Metadata | Value |
|----------|-------|
| **Version** | 1.0.0 |
| **Updated** | 2026-07-08 |
| **Protocol** | HTTPS |
| **Auth** | Supabase session cookie / service_role key |

---

## 1. Architecture

Gym56 uses a **hybrid API architecture**:

| Layer | Technology | Use Case |
|-------|-----------|----------|
| **Server Actions** | `"use server"` + Zod | All CRUD operations |
| **Route Handlers** | Next.js `app/api/` | AI streaming, public exercise fetch |

All CRUD goes through Server Actions. Route handlers are used only for streaming (AI) and simple public reads.

---

## 2. Authentication

### 2.1 Supabase Session (Browser)

```http
# Session cookie set by @supabase/ssr
Cookie: sb-{project-ref}-auth-token={token}

# Middleware validates cookie for /admin and /dashboard routes
```

### 2.2 Service Role (Server Only)

Server Actions use a `service_role` Supabase client that bypasses RLS:

```ts
// lib/supabase-admin.ts
import { createClient } from '@supabase/supabase-js'

export function createSupabaseAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}
```

---

## 3. Server Actions

All Server Actions live in `lib/actions/`. They follow the same pattern:
1. Validate inputs with Zod
2. Open admin Supabase client (service_role)
3. Perform database operation
4. Return `{ success, data?, message?, error? }`

### 3.1 Contact (`lib/actions/contact.ts`)

#### `submitContactForm(data)`

| Field | Type | Validation |
|-------|------|------------|
| `name` | string | Required, min 2 chars |
| `email` | string | Required, valid email |
| `subject` | string | Required, min 3 chars |
| `message` | string | Required, min 10 chars |

```ts
// Request (via form submission)
const formData = {
  name: "John Doe",
  email: "john@example.com",
  subject: "Question about memberships",
  message: "Hello, I would like to know more about your premium plan."
}

// Response (success)
{ success: true, message: "Message sent successfully!" }

// Response (validation error)
{ success: false, error: { field: "email", message: "Invalid email address" } }
```

#### `getContactMessages()`

Returns all contact submissions (admin only):

```ts
// Response
{
  success: true,
  data: [
    {
      id: "uuid",
      name: "John Doe",
      email: "john@example.com",
      subject: "Question",
      message: "...",
      is_read: false,
      created_at: "2026-07-08T10:00:00Z"
    }
  ]
}
```

#### `markAsRead(id: string)`, `markAllAsRead()`, `deleteContactMessage(id: string)`

All return `{ success: true }` on completion.

### 3.2 Equipment (`lib/actions/equipment.ts`)

#### `createEquipment(data)`

| Field | Type | Validation |
|-------|------|------------|
| `name` | string | Required |
| `slug` | string | Auto-generated from name |
| `category` | string | One of: strength/cardio/flexibility/olympic/functional/accessory |
| `condition` | string | One of: excellent/good/fair/maintenance/retired |
| `description` | string | Optional |
| `primary_image` | File | Optional (uploaded to Supabase storage) |

```ts
// Response (success)
{ success: true, data: { id: "uuid", name: "Barbell", ... } }
```

#### `updateEquipment(id, data)`, `deleteEquipment(id)` (soft delete), `undeleteEquipment(id)`

All return `{ success: true, data: { ... } }`.

#### `getAllEquipment()`, `getEquipmentBySlug(slug)`, `getEquipmentById(id)`

Return equipment records with `deleted_at IS NULL` filter.

#### `getRelatedEquipment(equipmentId)`, `updateRelatedEquipment(equipmentId, relatedIds)`

Manage the `equipment_related` junction table.

### 3.3 Exercises (`lib/actions/exercises.ts`)

#### `createExercise(data)`, `updateExercise(id, data)`, `deleteExercise(id)`

| Field | Type | Validation |
|-------|------|------------|
| `name` | string | Required |
| `category` | string | One of: Chest/Back/Shoulders/Legs/Arms/Core/Cardio |
| `difficulty` | string | One of: beginner/intermediate/advanced |
| `instructions` | text | Optional |
| `pro_tips` | text | Optional |
| `safety_tips` | text | Optional |
| `how_to_use` | text | Optional |
| `gif_url` | string | Optional |
| `maintenance_tips` | text | Optional |
| `muscles_trained` | text | Optional |
| `secondary_muscles` | text | Optional |
| `common_mistakes` | text | Optional |
| `seat_adjustment` | text | Optional |

#### `getExerciseBySlug(slug)`, `getExerciseById(id)`, `getAllExercises()`

Return exercise records.

#### Step Management

Exercises have ordered steps stored in `exercise_steps`:

```ts
// exercise_steps columns
{ id, exercise_id, step_number, instruction, video_timestamp }
```

Actions: `addStep(exerciseId, data)`, `updateStep(stepId, data)`, `deleteStep(stepId)`, `reorderSteps(exerciseId, stepIds)`.

#### Cross-References

- `getExercisesByEquipment(equipmentId)` — list exercises using a piece of equipment
- `getEquipmentForExercise(exerciseId)` — list equipment needed for an exercise
- `getRelatedExercises(exerciseId)` — related exercises via `exercise_related` table

---

## 4. Route Handlers

### 4.1 `POST /api/chat`

AI Coach streaming endpoint.

#### Request

```json
{
  "messages": [
    { "role": "user", "content": "What exercises work the chest?" }
  ]
}
```

#### Response (Success)

SSE stream (`text/event-stream`):

```
data: {"id":"...","object":"chat.completion.chunk","choices":[{"delta":{"content":"The"},"index":0}]}

data: {"id":"...","object":"chat.completion.chunk","choices":[{"delta":{"content":" chest"},"index":0}]}

data: [DONE]
```

#### Response (Not Connected — 503)

```json
{ "error": "not_connected", "message": "AI Coach is not connected yet." }
```

#### Response (API Error — 502)

```json
{ "error": "api_error", "message": "API returned 401" }
```

#### Response (Server Error — 500)

```json
{ "error": "server_error", "message": "Something went wrong. Please try again." }
```

#### Flow

```
Client POST /api/chat { messages }
  → Route prepends system prompt from lib/ai/system-prompt.ts
  → Route calls NVIDIA /v1/chat/completions with stream:true
  → Route returns raw Response(res.body, { headers: { "Content-Type": "text/event-stream" } })
  → Client parses SSE: data: {...}, extracts choices[0].delta.content
  → Client appends parsed text to message bubble
  → Client stops on [DONE] or stop button click
```

### 4.2 `GET /api/exercises/[id]`

Fetch a single exercise by UUID.

#### Response (Success — 200)

```json
{
  "id": "uuid",
  "name": "Bench Press",
  "slug": "bench-press",
  "category": "Chest",
  "difficulty": "intermediate",
  "instructions": "...",
  "gif_url": "https://ik.imagekit.io/yuhonas/exercises/gif/...",
  "muscles_trained": "Pectoralis Major, Triceps, Anterior Deltoids",
  "created_at": "2026-01-01T00:00:00Z",
  "deleted_at": null
}
```

#### Response (Not Found — 404)

```json
null
```

---

## 5. Zod Schemas

All validation is co-located in each Server Action file. No separate schema directory.

### 5.1 Contact Schema (in `lib/actions/contact.ts`)

```ts
const contactFormSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  subject: z.string().min(3),
  message: z.string().min(10),
})
```

### 5.2 Equipment Schema (in `lib/actions/equipment.ts`)

```ts
const equipmentSchema = z.object({
  name: z.string().min(1),
  category: z.enum(["strength","cardio","flexibility","olympic","functional","accessory"]),
  condition: z.enum(["excellent","good","fair","maintenance","retired"]).default("good"),
  description: z.string().optional(),
  // ... additional optional fields
})
```

### 5.3 Exercise Schema (in `lib/actions/exercises.ts`)

```ts
const exerciseSchema = z.object({
  name: z.string().min(1),
  slug: z.string().optional(),
  category: z.enum(["Chest","Back","Shoulders","Legs","Arms","Core","Cardio"]),
  difficulty: z.enum(["beginner","intermediate","advanced"]).default("beginner"),
  // ... optional fields
})
```

---

## 6. Error Handling Pattern

All Server Actions return a consistent shape:

```ts
type ActionResponse<T = unknown> = {
  success: true
  data?: T
  message?: string
} | {
  success: false
  error: string | { field: string; message: string }
}
```

Route handlers use HTTP status codes:
| Code | Meaning |
|------|---------|
| 200 | Success |
| 404 | Resource not found |
| 500 | Server error |
| 502 | Upstream API error |
| 503 | Service not configured |

---

## 7. Rate Limiting

No rate limiting is currently implemented. Considerations for future:
- Vercel Edge Functions have default concurrency limits
- NVIDIA API has its own rate limits (not documented publicly)

---

## 8. CORS

No CORS configuration needed — all requests originate from the same origin. API routes are not consumed by external clients.

---

## 9. Appendix: Quick Reference

### All Endpoints

| Method | Path | Type | Auth | Purpose |
|--------|------|------|------|---------|
| Action | `submitContactForm()` | Server Action | None | Submit contact message |
| Action | `getContactMessages()` | Server Action | Admin | List submissions |
| Action | `markAsRead()` | Server Action | Admin | Mark as read |
| Action | `markAllAsRead()` | Server Action | Admin | Mark all as read |
| Action | `deleteContactMessage()` | Server Action | Admin | Delete submission |
| Action | `createEquipment()` | Server Action | Admin | Create equipment |
| Action | `updateEquipment()` | Server Action | Admin | Update equipment |
| Action | `deleteEquipment()` | Server Action | Admin | Soft delete |
| Action | `getAllEquipment()` | Server Action | Public | List equipment |
| Action | `getEquipmentBySlug()` | Server Action | Public | Single equipment |
| Action | `createExercise()` | Server Action | Admin | Create exercise |
| Action | `updateExercise()` | Server Action | Admin | Update exercise |
| Action | `deleteExercise()` | Server Action | Admin | Soft delete |
| Action | `getAllExercises()` | Server Action | Public | List exercises |
| Action | `getExerciseBySlug()` | Server Action | Public | Single exercise |
| Action | `addStep()` / `updateStep()` / `deleteStep()` | Server Action | Admin | Exercise steps |
| Action | `getExercisesByEquipment()` | Server Action | Public | Cross-reference |
| Action | `getEquipmentForExercise()` | Server Action | Public | Cross-reference |
| Action | `getRelatedExercises()` | Server Action | Public | Related exercises |
| POST | `/api/chat` | Route | None | AI Coach streaming |
| GET | `/api/exercises/[id]` | Route | None | Exercise by UUID |
