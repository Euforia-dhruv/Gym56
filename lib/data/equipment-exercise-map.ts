import { getDbExercisesByEquipment } from "@/lib/data/exercise-loader";
import type { Exercise } from "@/types";

const equipmentToDbLabels: Record<string, string[]> = {
  treadmill: ["other"],
  "stationary-bike": ["other"],
  "elliptical-trainer": ["other"],
  "rowing-machine": ["other"],
  "stair-climber": ["other"],
  "bench-press": ["barbell"],
  "squat-rack": ["barbell"],
  "deadlift-platform": ["barbell"],
  "cable-crossover-machine": ["cable"],
  "lat-pulldown-machine": ["cable", "machine"],
  "leg-press-machine": ["machine"],
  "smith-machine": ["machine", "barbell"],
  "dumbbell-set": ["dumbbell"],
  "barbell-set": ["barbell"],
  "kettlebell-set": ["kettlebell"],
  "medicine-balls": ["medicine ball"],
  "battle-ropes": ["other"],
  "resistance-bands-set": ["bands"],
  "yoga-mats": ["body only"],
  "foam-rollers": ["foam roll"],
  "pull-up-station": ["body only"],
  "preacher-curl-bench": ["dumbbell", "e-z curl bar"],
  "hack-squat-machine": ["machine"],
  "pec-deck-machine": ["machine"],
  "trx-suspension-trainer": ["body only"],
};

export function getExercisesForEquipmentSlug(slug: string): Exercise[] {
  const labels = equipmentToDbLabels[slug];
  if (!labels) return [];
  const seen = new Set<string>();
  const results: Exercise[] = [];
  for (const label of labels) {
    const exercises = getDbExercisesByEquipment(label);
    for (const ex of exercises) {
      if (!seen.has(ex.id) && ex.images?.length) {
        seen.add(ex.id);
        results.push(ex);
      }
    }
  }
  return results;
}

export function getExerciseCountForSlug(slug: string): number {
  const labels = equipmentToDbLabels[slug];
  if (!labels) return 0;
  const seen = new Set<string>();
  let count = 0;
  for (const label of labels) {
    const exercises = getDbExercisesByEquipment(label);
    for (const ex of exercises) {
      if (!seen.has(ex.id) && ex.images?.length) {
        seen.add(ex.id);
        count++;
      }
    }
  }
  return count;
}
