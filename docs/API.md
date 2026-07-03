# API Reference

Gym 56 uses Next.js Server Actions for all data mutations. There are no traditional REST API routes.

## Server Actions

All server actions are in `lib/actions/` and use `"use server"` directive.

### Equipment Actions (`lib/actions/equipment.ts`)

| Action | Description | Auth |
|--------|-------------|------|
| `getEquipment()` | List all non-deleted equipment | Public |
| `getEquipmentById(id)` | Get equipment by ID | Public |
| `getPublishedEquipment()` | List published equipment | Public |
| `getEquipmentBySlug(slug)` | Get published equipment by slug | Public |
| `getRelatedEquipment(id)` | Get related equipment | Public |
| `getEquipmentImages(id)` | Get equipment images | Public |
| `createEquipment(input)` | Create new equipment | Admin |
| `updateEquipment(input)` | Update existing equipment | Admin |
| `deleteEquipment(id)` | Soft-delete equipment | Admin |
| `toggleEquipmentPublish(id, published)` | Toggle publish status | Admin |
| `uploadEquipmentImage(id, formData)` | Upload equipment image | Admin |
| `deleteEquipmentImage(id)` | Delete equipment image | Admin |

### Exercise Actions (`lib/actions/exercises.ts`)

| Action | Description | Auth |
|--------|-------------|------|
| `getExercises()` | List all non-deleted exercises | Public |
| `getExerciseById(id)` | Get exercise by ID | Public |
| `getPublishedExercises()` | List published exercises | Public |
| `getExercisesByEquipment(id)` | Get exercises for equipment | Public |
| `getExerciseBySlug(slug)` | Get published exercise by slug | Public |
| `getRelatedExercises(id)` | Get related exercises | Public |
| `getExerciseSteps(id)` | Get exercise instruction steps | Public |
| `createExercise(input)` | Create new exercise | Admin |
| `updateExercise(input)` | Update exercise | Admin |
| `deleteExercise(id)` | Soft-delete exercise | Admin |
| `toggleExercisePublish(id, published)` | Toggle publish status | Admin |
| `uploadExerciseImage(id, formData)` | Upload exercise image | Admin |

### Membership Actions (`lib/actions/memberships.ts`)

| Action | Description | Auth |
|--------|-------------|------|
| `getMembershipPlans()` | List all plans | Public |
| `getActivePlans()` | List active plans | Public |
| `getMembershipPlanById(id)` | Get plan by ID | Public |
| `createMembershipPlan(input)` | Create plan | Admin |
| `updateMembershipPlan(input)` | Update plan | Admin |
| `deleteMembershipPlan(id)` | Delete plan | Admin |
| `getSubscriptions()` | List all subscriptions | Admin |
| `getSubscriptionCounts()` | Get subscription counts per plan | Admin |

### Contact Actions (`lib/actions/contact.ts`)

| Action | Description | Auth |
|--------|-------------|------|
| `submitContactForm(input)` | Submit contact form | Public |
| `getContactMessages()` | List all messages | Admin |
| `getUnreadCount()` | Get unread count | Admin |
| `markAsRead(id)` | Mark message as read | Admin |
| `markAllAsRead()` | Mark all as read | Admin |
| `deleteContactMessage(id)` | Delete message | Admin |

### Member Management Actions (`lib/actions/members.ts`)

| Action | Description | Auth |
|--------|-------------|------|
| `getMembers()` | List all members | Admin |
| `getMemberById(id)` | Get member details | Admin |
| `updateMemberProfile(input)` | Update member profile | Admin |
| `getDashboardStats()` | Get dashboard statistics | Admin |

### Member Profile Actions (`lib/actions/member-profile.ts`)

| Action | Description | Auth |
|--------|-------------|------|
| `getMyProfile()` | Get current user's profile | Member |
| `getMySubscriptions()` | Get current user's subscriptions | Member |
| `updateMyProfile(input)` | Update own profile | Member |
| `uploadMyAvatar(formData)` | Upload avatar image | Member |

## Validation Schemas (`types/api.ts`)

All create/update actions use Zod schemas for validation:

| Schema | Fields |
|--------|--------|
| `EquipmentCreateSchema` | name, category, description, quantity, condition, location, is_available, is_published |
| `EquipmentUpdateSchema` | Partial create fields + id (uuid) |
| `ExerciseCreateSchema` | name, category, muscle_group, equipment_id, equipment_label, difficulty, target_muscles (comma-separated → array), common_mistakes, safety_tips, is_published |
| `ExerciseUpdateSchema` | Partial create fields + id (uuid) |
| `MembershipPlanCreateSchema` | name, duration_months, price_minor, savings_label, is_featured, is_active, sort_order |
| `MembershipPlanUpdateSchema` | Partial create fields + id (uuid) |

## Error Handling

All server actions throw `Error` on failure. Client components catch and display errors via toast notifications or error boundaries.

Standard auth errors:
- `"Unauthenticated"` — No valid session
- `"Forbidden"` — Authenticated but not admin
- `"Not found"` — Resource not found
