import type { Metadata } from "next";
import { getPublishedExercises } from "@/lib/actions/exercises";
import ExercisesClient from "./ExercisesClient";

export const metadata: Metadata = {
  title: "Exercise Library - Gym 56",
  description:
    "Browse our complete collection of exercises with detailed instructions, target muscles, and difficulty levels.",
  openGraph: {
    title: "Exercise Library — Gym 56",
    description:
      "Browse our complete collection of exercises with detailed instructions, target muscles, and difficulty levels.",
    url: "https://gym56.vercel.app/exercises",
  },
  twitter: {
    card: "summary_large_image",
    title: "Exercise Library — Gym 56",
    description:
      "Browse our complete collection of exercises with detailed instructions, target muscles, and difficulty levels.",
  },
};

export default async function ExerciseLibraryPage() {
  let exercises;
  try {
    exercises = await getPublishedExercises();
  } catch {
    exercises = [];
  }

  return <ExercisesClient initialExercises={exercises} />;
}
