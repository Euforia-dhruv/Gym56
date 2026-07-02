import type { Metadata } from "next";
import { exercises } from "@/lib/siteData";
import ExerciseDetail from "./ExerciseDetail";

// generateMetadata runs on the server and can access params directly.
// This is the correct Next.js 15 pattern for dynamic per-page metadata.
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const exercise = exercises.find((ex) => ex.slug === slug);

  if (!exercise) {
    return {
      title: "Exercise Not Found",
      description: "The exercise you are looking for does not exist.",
    };
  }

  return {
    title: exercise.name,
    description: `Learn how to perform the ${exercise.name}. Step-by-step instructions, target muscles (${exercise.targetMuscles.slice(0, 3).join(", ")}), common mistakes, and safety tips.`,
    openGraph: {
      title: `${exercise.name} — Gym 56`,
      description: `Learn how to perform the ${exercise.name} with proper form and technique.`,
      url: `https://gym56.vercel.app/exercise/${exercise.slug}`,
    },
  };
}

export default function ExerciseDetailPage() {
  return <ExerciseDetail />;
}
