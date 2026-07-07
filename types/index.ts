// ─── Database row types (mirrors Supabase generated types) ────────────────

export interface Profile {
  id: string;
  full_name: string | null;
  phone: string | null;
  avatar_url: string | null;
  role: "admin" | "trainer";
  created_at: string;
  updated_at: string;
}

export interface Equipment {
  id: string;
  name: string;
  slug: string;
  category: string;
  description: string | null;
  quantity: number;
  condition: string;
  location: string | null;
  is_available: boolean;
  is_published: boolean;
  primary_image_url: string | null;
  sort_order: number;
  secondary_muscles: string[];
  seat_adjustment: string[];
  how_to_use: string[];
  safety_tips: string[];
  common_mistakes: string[];
  maintenance_tips: string[];
  difficulty: string;
  muscles_trained: string[];
  instructions: string[];
  created_by: string | null;
  updated_by: string | null;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Exercise {
  id: string;
  name: string;
  slug: string;
  category: string;
  muscle_group: string | null;
  equipment_id: string | null;
  equipment_label: string | null;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  force?: "push" | "pull" | "static" | null;
  mechanic?: "compound" | "isolation" | null;
  target_muscles: string[];
  secondary_muscles: string[];
  pro_tips: string[];
  common_mistakes: string[];
  safety_tips: string[];
  breathing: string | null;
  variations: string[];
  alternatives: string[];
  progressions: string[];
  regressions: string[];
  beginner_tips: string[];
  instructions: string[];
  images: string[];
  primary_image_url: string | null;
  gif_url: string | null;
  thumbnail_url: string | null;
  video_url: string | null;
  is_published: boolean;
  sort_order: number;
  created_by: string | null;
  updated_by: string | null;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  is_read: boolean;
  read_by: string | null;
  read_at: string | null;
  replied_at: string | null;
  created_at: string;
}

// ─── Display / UI-friendly types ──────────────────────────────────────────

export type EquipmentCategory =
  | "Cardio"
  | "Strength"
  | "Free Weights"
  | "Machines"
  | "Functional"
  | "Recovery"
  | "Other";

export type ExerciseCategory =
  | "Chest"
  | "Back"
  | "Shoulders"
  | "Legs"
  | "Arms"
  | "Core"
  | "Cardio"
  | "Glutes"
  | "Obliques"
  | "Abs";

export type Difficulty = "Beginner" | "Intermediate" | "Advanced";

export type Condition =
  | "excellent"
  | "good"
  | "fair"
  | "maintenance"
  | "retired";

export const EQUIPMENT_CATEGORIES: EquipmentCategory[] = [
  "Cardio",
  "Strength",
  "Free Weights",
  "Machines",
  "Functional",
  "Recovery",
  "Other",
];

export const EXERCISE_CATEGORIES: ExerciseCategory[] = [
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
];

export const DIFFICULTIES: Difficulty[] = [
  "Beginner",
  "Intermediate",
  "Advanced",
];

export const CONDITIONS: Condition[] = [
  "excellent",
  "good",
  "fair",
  "maintenance",
  "retired",
];
