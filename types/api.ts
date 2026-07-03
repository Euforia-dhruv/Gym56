import { z } from "zod";

// ─── Equipment ───────────────────────────────────────────────────────────────

export const EquipmentCreateSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  category: z.enum([
    "Cardio",
    "Strength",
    "Free Weights",
    "Machines",
    "Functional",
    "Recovery",
    "Other",
  ]),
  description: z.string().max(5000).optional().default(""),
  quantity: z.coerce.number().int().min(0).default(1),
  condition: z
    .enum(["excellent", "good", "fair", "maintenance", "retired"])
    .default("good"),
  location: z.string().max(200).optional().default(""),
  is_available: z.boolean().default(true),
  is_published: z.boolean().default(false),
});

export const EquipmentUpdateSchema = EquipmentCreateSchema.partial().extend({
  id: z.string().uuid(),
});

export type EquipmentCreateInput = z.infer<typeof EquipmentCreateSchema>;
export type EquipmentUpdateInput = z.infer<typeof EquipmentUpdateSchema>;

// ─── Exercises ───────────────────────────────────────────────────────────────

export const ExerciseCreateSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  category: z.enum([
    "Chest",
    "Back",
    "Shoulders",
    "Legs",
    "Arms",
    "Core",
    "Cardio",
    "Glutes",
    "Obliques",
    "Abs",
  ]),
  muscle_group: z.string().max(200).optional().default(""),
  equipment_id: z.string().uuid().optional().nullable().default(null),
  equipment_label: z.string().max(200).optional().default(""),
  difficulty: z.enum(["Beginner", "Intermediate", "Advanced"]),
  target_muscles: z
    .string()
    .transform((s) =>
      s
        .split(",")
        .map((m) => m.trim())
        .filter(Boolean)
    )
    .optional()
    .default([]),
  common_mistakes: z
    .string()
    .transform((s) =>
      s
        .split(",")
        .map((m) => m.trim())
        .filter(Boolean)
    )
    .optional()
    .default([]),
  safety_tips: z
    .string()
    .transform((s) =>
      s
        .split(",")
        .map((m) => m.trim())
        .filter(Boolean)
    )
    .optional()
    .default([]),
  is_published: z.boolean().default(false),
});

export const ExerciseUpdateSchema = ExerciseCreateSchema.partial().extend({
  id: z.string().uuid(),
});

export type ExerciseCreateInput = z.infer<typeof ExerciseCreateSchema>;
export type ExerciseUpdateInput = z.infer<typeof ExerciseUpdateSchema>;

// ─── Membership Plans ────────────────────────────────────────────────────────

export const MembershipPlanCreateSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  duration_months: z.coerce.number().int().positive("Duration must be positive"),
  price_minor: z.coerce.number().int().min(0, "Price must be ≥ 0"),
  savings_label: z.string().max(200).optional().default(""),
  is_featured: z.boolean().default(false),
  is_active: z.boolean().default(true),
  sort_order: z.coerce.number().int().min(0).default(0),
});

export const MembershipPlanUpdateSchema = MembershipPlanCreateSchema.partial().extend({
  id: z.string().uuid(),
});

export type MembershipPlanCreateInput = z.infer<typeof MembershipPlanCreateSchema>;
export type MembershipPlanUpdateInput = z.infer<typeof MembershipPlanUpdateSchema>;

// ─── Contact Form ────────────────────────────────────────────────────────────

export const ContactSubmissionSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  email: z.string().email("Invalid email").max(320),
  phone: z.string().max(20).optional(),
  subject: z.string().max(200).optional(),
  message: z.string().min(1, "Message is required").max(10000),
});

export type ContactSubmissionInput = z.infer<typeof ContactSubmissionSchema>;

// ─── Profile Update ──────────────────────────────────────────────────────────

export const ProfileUpdateSchema = z.object({
  full_name: z.string().max(200).optional(),
  phone: z.string().max(20).optional(),
});

export type ProfileUpdateInput = z.infer<typeof ProfileUpdateSchema>;

// ─── Generic ID param ────────────────────────────────────────────────────────

export const IdParamSchema = z.string().uuid("Invalid ID");
