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

        const IMAGEKIT_BASE = "https://ik.imagekit.io/yuhonas";
        const imageUrl =
          ex.images && ex.images.length > 0
            ? `${IMAGEKIT_BASE}/${ex.images[0]}`
            : null;

        const force = (["push", "pull", "static"] as const).includes(ex.force as "push" | "pull" | "static")
          ? (ex.force as "push" | "pull" | "static")
          : null;
        const mechanic = (["compound", "isolation"] as const).includes(ex.mechanic as "compound" | "isolation")
          ? (ex.mechanic as "compound" | "isolation")
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
          force,
          mechanic,
          target_muscles: ex.primaryMuscles.map(formatMuscleName),
          secondary_muscles: ex.secondaryMuscles.map(formatMuscleName),
          instructions,
          images: ex.images || [],
          pro_tips: generateProTips(ex, difficulty),
          common_mistakes: generateCommonMistakes(ex, category),
          safety_tips: generateSafetyTips(ex),
          breathing: generateBreathing(ex.force),
          variations: generateVariations(equipmentLabel),
          alternatives: generateAlternatives(ex, category),
          progressions: generateProgressions(difficulty, equipmentLabel),
          regressions: generateRegressions(difficulty, equipmentLabel),
          beginner_tips: generateBeginnerTips(difficulty),
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

// ─── Derived / generic content generators ─────────────────────────────────

function pick<T>(arr: T[], index: number, count: number): T[] {
  const start = index % arr.length;
  const result: T[] = [];
  for (let i = 0; i < count; i++) {
    result.push(arr[(start + i) % arr.length]);
  }
  return result;
}

const COMMON_MISTAKES_POOL: Record<string, string[]> = {
  default: [
    "Using momentum instead of controlled muscle tension",
    "Not maintaining proper form throughout the movement",
    "Rushing through reps instead of using a controlled tempo",
    "Holding your breath during the movement",
    "Not using the full range of motion",
  ],
  Chest: [
    "Flaring elbows too wide during presses",
    "Bouncing the weight off your chest",
    "Not retracting your shoulder blades",
  ],
  Back: [
    "Rounding the lower back during pulls",
    "Using too much body momentum instead of back muscles",
    "Shrugging the shoulders instead of engaging lats",
  ],
  Legs: [
    "Allowing knees to cave inward",
    "Not reaching sufficient depth on squats",
    "Shifting weight onto the toes instead of the heels",
  ],
  Shoulders: [
    "Shrugging during pressing movements",
    "Using too much weight and sacrificing form",
    "Not keeping the core tight for stability",
  ],
  Arms: [
    "Swinging the weight with body momentum",
    "Not fully extending at the bottom of curls",
    "Locking out joints aggressively at the top",
  ],
  Core: [
    "Craning the neck during crunches or sit-ups",
    "Not engaging the core throughout the movement",
    "Arching the lower back off the floor",
  ],
  Abs: [
    "Craning the neck during crunches or sit-ups",
    "Not engaging the core throughout the movement",
    "Arching the lower back off the floor",
  ],
};

function generateCommonMistakes(ex: RawExercise, category: string): string[] {
  const pool = COMMON_MISTAKES_POOL[category] || COMMON_MISTAKES_POOL.default;
  return pick(pool, ex.name.length, 3);
}

const SAFETY_TIPS_POOL = [
  "Always warm up properly before attempting this exercise",
  "Stop immediately if you feel sharp or joint pain",
  "Keep your core engaged to protect your lower back",
  "Start with a weight you can control, not your one-rep max",
  "Maintain proper posture and alignment throughout the movement",
  "Use a spotter or safety racks when lifting heavy",
];

function generateSafetyTips(ex: RawExercise): string[] {
  return pick(SAFETY_TIPS_POOL, ex.name.length + (ex.force || "").length, 3);
}

function generateBreathing(force: string | null): string {
  if (force === "push") {
    return "Exhale as you push the weight away from your body, inhale deeply as you return to the starting position.";
  }
  if (force === "pull") {
    return "Exhale as you pull the weight toward your body, inhale as you extend back to the start.";
  }
  if (force === "static") {
    return "Breathe steadily throughout the hold — avoid holding your breath. Inhale and exhale in a controlled rhythm.";
  }
  return "Exhale during the exertion phase of the movement, inhale during the relaxation or lowering phase.";
}

const VARIATIONS_POOL: Record<string, string[]> = {
  Barbell: [
    "Try a close-grip stance to shift emphasis",
    "Perform with a slower eccentric for more time under tension",
    "Use a safety squat bar if available",
  ],
  Dumbbell: [
    "Perform one arm at a time to fix strength imbalances",
    "Try a neutral grip to reduce shoulder strain",
    "Increase the range of motion by using a bench that allows a deeper stretch",
  ],
  Bodyweight: [
    "Try a deficit version to increase the range of motion",
    "Add a pause at the bottom to eliminate momentum",
    "Increase intensity by elevating your feet",
  ],
  Cable: [
    "Adjust the pulley height to target different fibers",
    "Use a slow, controlled tempo to prevent the stack from clanking",
    "Try single-arm work for unilateral focus",
  ],
  Machine: [
    "Adjust the seat position to align the pivot with your joint",
    "Use a slower tempo and squeeze at the peak contraction",
    "Try one leg / one arm at a time",
  ],
  "Resistance Bands": [
    "Anchor the band higher or lower to change the resistance curve",
    "Slow down the eccentric to maximise band tension",
    "Double up bands for progressive overload",
  ],
  Kettlebell: [
    "Experiment with different bell weights to find the right loading",
    "Try a single-arm version to expose imbalances",
    "Focus on a powerful hip snap for ballistic moves",
  ],
};

const DEFAULT_VARIATIONS = [
  "Slow down the eccentric phase for increased time under tension",
  "Add a 1-second pause at the peak contraction",
  "Perform the movement one limb at a time",
];

function generateVariations(equipmentLabel: string): string[] {
  return VARIATIONS_POOL[equipmentLabel] || DEFAULT_VARIATIONS;
}

const ALTERNATIVES_POOL_BY_CATEGORY: Record<string, string[]> = {
  Cardio: [
    "Try a different cardio modality for variety",
    "Swap to interval training for a metabolic stimulus",
  ],
  Stretching: [
    "Try a dynamic warm-up version before workouts",
    "Use the contract-relax PNF method to deepen the stretch",
  ],
};

function generateAlternatives(ex: RawExercise, category: string): string[] {
  const base = ALTERNATIVES_POOL_BY_CATEGORY[category] || [];
  if (ex.primaryMuscles.length > 0) {
    const muscle = ex.primaryMuscles[0];
    return [
      ...base,
      `Choose another exercise that targets the ${formatMuscleName(muscle).toLowerCase()}`,
    ];
  }
  return base.length > 0 ? base : [
    "Swap the equipment for a different stimulus (e.g. dumbbells instead of barbell)",
    "Try the same movement pattern on a different apparatus",
  ];
}

const PROGRESSIONS = [
  "Increase the weight by 5-10% once you can complete all reps with clean form",
  "Slow down the eccentric (lowering) phase to 3-4 seconds",
  "Reduce rest periods between sets to increase workout density",
  "Add an extra set or rep each week (progressive overload)",
];

const REGRESSIONS = [
  "Reduce the weight to focus strictly on technique",
  "Decrease the range of motion if you feel joint discomfort",
  "Increase rest intervals to ensure full recovery between sets",
];

function generateProgressions(difficulty: string, equipmentLabel: string): string[] {
  const base = [...PROGRESSIONS];
  if (difficulty === "Beginner") {
    base.unshift("Master the basic form with bodyweight before adding external load");
  }
  if (["Dumbbell", "Barbell"].includes(equipmentLabel)) {
    base.push("Try the same exercise with a barbell instead of dumbbells to handle heavier loads");
  }
  return base;
}

function generateRegressions(difficulty: string, equipmentLabel: string): string[] {
  const base = [...REGRESSIONS];
  if (difficulty === "Advanced") {
    base.unshift("Drop to a moderate weight and focus on the mind-muscle connection");
  }
  if (equipmentLabel === "Bodyweight") {
    base.unshift("Use an assisted version (bands, partner, or machine) to reduce load");
  }
  if (["Dumbbell", "Barbell"].includes(equipmentLabel)) {
    base.push("Perform with just the bar or light dumbbells to groove the movement pattern");
  }
  return base;
}

const BEGINNER_TIPS = [
  "Master proper form before increasing weight",
  "Focus on slow, controlled movements — don't chase speed",
  "Start with 2-3 sets of 10-12 reps to build a solid foundation",
  "Record yourself to check your form",
  "Keep a training log to track progress and ensure progressive overload",
  "Don't be afraid to ask a coach or trainer for a form check",
];

function generateBeginnerTips(difficulty: string): string[] {
  if (difficulty === "Beginner") {
    return BEGINNER_TIPS.slice(0, 4);
  }
  if (difficulty === "Advanced") {
    return [
      "Even advanced lifters benefit from revisiting the basics — check your form with light weight periodically",
      "Use micro-loading (0.5-1 kg increments) to continue making progress",
    ];
  }
  return BEGINNER_TIPS.slice(0, 3);
}

const PRO_TIPS = [
  "Focus on the mind-muscle connection — consciously squeeze the target muscle at the peak of each rep",
  "Use a 2-1-3 tempo (2 seconds up, 1 second pause, 3 seconds down) to maximise time under tension",
  "Implement progressive overload by tracking every session and adding small increments",
  "Breathe deliberately — exhale during the hardest part of the movement",
  "Warm up with lighter sets of the same exercise to prime the nervous system",
  "Stay tight throughout — brace your core before every single rep",
];

function generateProTips(ex: RawExercise, difficulty: string): string[] {
  const tips = pick(PRO_TIPS, ex.name.length, 3);
  if (difficulty === "Advanced") {
    tips.push("Periodically deload (reduce volume by 40-60% for a week) to manage fatigue and prevent plateaus");
  }
  return tips;
}
