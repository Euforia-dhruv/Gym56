import type { Exercise } from "@/types";
import { slugify } from "@/lib/utils";
// eslint-disable-next-line @typescript-eslint/no-require-imports
const EXERCISE_DB: RawExercise[] = require("./exercisedb.json");

interface RawExercise {
  name: string;
  force: string | null;
  level: string;
  mechanic: string | null;
  equipment: string;
  primaryMuscles: string[];
  secondaryMuscles: string[];
  instructions: string[];
  category: string;
  images: string[];
  id: string;
}

let cachedExercises: Exercise[] | null = null;

const LEVEL_MAP: Record<string, "Beginner" | "Intermediate" | "Advanced"> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  expert: "Advanced",
};

const CATEGORY_MAP: Record<string, string> = {
  strength: "Strength",
  powerlifting: "Powerlifting",
  olympic_weightlifting: "Olympic Weightlifting",
  "olympic weightlifting": "Olympic Weightlifting",
  plyometrics: "Plyometrics",
  cardio: "Cardio",
  stretching: "Stretching",
  strongman: "Strongman",
};

const EQUIPMENT_MAP: Record<string, string> = {
  "body only": "Bodyweight",
  barbell: "Barbell",
  dumbbell: "Dumbbell",
  cable: "Cable",
  machine: "Machine",
  bands: "Resistance Bands",
  "e-z curl bar": "EZ Curl Bar",
  kettlebells: "Kettlebell",
  "medicine ball": "Medicine Ball",
  "exercise ball": "Exercise Ball",
  "foam roll": "Foam Roll",
  other: "Other",
};

function getMuscleGroup(primaryMuscles: string[], category: string): string {
  const MUSCLE_GROUP_MAP: Record<string, string> = {
    abdominals: "Abs",
    quadriceps: "Legs",
    hamstrings: "Legs",
    glutes: "Glutes",
    chest: "Chest",
    back: "Back",
    shoulders: "Shoulders",
    biceps: "Arms",
    triceps: "Arms",
    forearms: "Arms",
    calves: "Legs",
    traps: "Back",
    lats: "Back",
    lower_back: "Back",
    middle_back: "Back",
    neck: "Other",
    adductors: "Legs",
    abductors: "Legs",
  };

  if (primaryMuscles.length > 0 && MUSCLE_GROUP_MAP[primaryMuscles[0]]) {
    return MUSCLE_GROUP_MAP[primaryMuscles[0]];
  }
  if (category === "cardio") return "Cardio";
  if (category === "stretching") return "Flexibility";
  return "Full Body";
}

export function getExercisesFromDb(): Exercise[] {
  if (cachedExercises) return cachedExercises;

  try {
    const rawData = EXERCISE_DB;
    if (!rawData || !Array.isArray(rawData)) {
      cachedExercises = [];
      return [];
    }
    const IMAGEKIT_BASE = "https://ik.imagekit.io/yuhonas";

    cachedExercises = rawData
      .filter((ex) => ex.name && ex.instructions && ex.instructions.length > 0)
      .map((ex, index) => {
        const slug = slugify(ex.name);
        const cat = (ex.category || "strength").toLowerCase();
        const category = CATEGORY_MAP[cat] || "Strength";
        const muscleGroup = getMuscleGroup(ex.primaryMuscles, ex.category || "");
        const diff = (ex.level || "intermediate").toLowerCase();
        const difficulty = LEVEL_MAP[diff] || "Intermediate";
        const eq = (ex.equipment || "body only").toLowerCase();
        const equipmentLabel = EQUIPMENT_MAP[eq] || ex.equipment || "Other";
        const instructions = ex.instructions.map((i) =>
          i.endsWith(".") ? i : i + "."
        );

        const imageUrl =
          ex.images && ex.images.length > 0
            ? `${IMAGEKIT_BASE}/${ex.images[0]}`
            : null;

        return {
          id: slug,
          slug,
          name: ex.name,
          category,
          muscle_group: muscleGroup,
          equipment_id: null,
          equipment_label: equipmentLabel,
          difficulty,
          target_muscles: ex.primaryMuscles.map(formatMuscleName),
          secondary_muscles: ex.secondaryMuscles.map(formatMuscleName),
          instructions,
          pro_tips: [],
          common_mistakes: [],
          safety_tips: [],
          breathing: null,
          variations: [],
          alternatives: [],
          progressions: [],
          regressions: [],
          beginner_tips: [],
          primary_image_url: imageUrl,
          gif_url: null,
          thumbnail_url: imageUrl,
          video_url: null,
          is_published: true,
          sort_order: index + 1,
          created_by: null,
          updated_by: null,
          deleted_at: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
      });
  } catch (e) {
    console.error("[Gym56 ExerciseDB] Failed to load exercises:", e instanceof Error ? e.message : e);
    cachedExercises = [];
  }

  return cachedExercises || [];
}

function formatMuscleName(muscle: string): string {
  const NAME_MAP: Record<string, string> = {
    abdominals: "Abdominals",
    quadriceps: "Quadriceps",
    hamstrings: "Hamstrings",
    glutes: "Glutes",
    chest: "Chest",
    back: "Back",
    shoulders: "Shoulders",
    biceps: "Biceps",
    triceps: "Triceps",
    forearms: "Forearms",
    calves: "Calves",
    traps: "Traps",
    lats: "Lats",
    lower_back: "Lower Back",
    middle_back: "Middle Back",
    neck: "Neck",
    adductors: "Adductors",
    abductors: "Abductors",
    pectorals: "Pectorals",
    deltoids: "Deltoids",
    obliques: "Obliques",
    spinal_erectors: "Spinal Erectors",
  };
  return NAME_MAP[muscle] || muscle.charAt(0).toUpperCase() + muscle.slice(1);
}

export function getDbExerciseBySlug(slug: string): Exercise | undefined {
  return getExercisesFromDb().find((ex) => ex.slug === slug);
}

export function getDbExercisesByEquipment(equipmentLabel: string): Exercise[] {
  return getExercisesFromDb().filter(
    (ex) => ex.equipment_label?.toLowerCase() === equipmentLabel.toLowerCase()
  );
}

export function searchDbExercises(query: string): Exercise[] {
  const q = query.toLowerCase();
  return getExercisesFromDb().filter(
    (ex) =>
      ex.name.toLowerCase().includes(q) ||
      ex.target_muscles.some((m) => m.toLowerCase().includes(q)) ||
      ex.category.toLowerCase().includes(q) ||
      ex.equipment_label?.toLowerCase().includes(q)
  );
}
