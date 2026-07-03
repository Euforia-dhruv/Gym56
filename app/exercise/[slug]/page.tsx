import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPublishedExercises, getExerciseBySlug, getExerciseSteps, getRelatedExercises } from "@/lib/actions/exercises";
import ExerciseDetail from "./ExerciseDetail";
import JsonLd from "@/components/JsonLd";

export async function generateStaticParams() {
  try {
    const exercises = await getPublishedExercises();
    return exercises.map((ex) => ({ slug: ex.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  try {
    const exercise = await getExerciseBySlug(slug);
    if (!exercise) {
      return {
        title: "Exercise Not Found",
        description: "The exercise you are looking for does not exist.",
      };
    }
    return {
      title: exercise.name,
      description: `Learn how to perform the ${exercise.name}. Step-by-step instructions, target muscles, common mistakes, and safety tips.`,
      openGraph: {
        title: `${exercise.name} — Gym 56`,
        description: `Learn how to perform the ${exercise.name} with proper form and technique.`,
      },
    };
  } catch {
    return {
      title: "Exercise Not Found",
      description: "The exercise you are looking for does not exist.",
    };
  }
}

export default async function ExerciseDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  try {
    const exercise = await getExerciseBySlug(slug);
    if (!exercise) notFound();

    const [steps, relatedExercises] = await Promise.all([
      getExerciseSteps(exercise.id).catch(() => []),
      getRelatedExercises(exercise.id).catch(() => []),
    ]);

    const instructions = steps.map((s) => s.description);

    const exerciseSchema = {
      "@context": "https://schema.org",
      "@type": "HowTo",
      name: exercise.name,
      description: `Learn how to perform the ${exercise.name} with proper form.`,
      difficulty: exercise.difficulty,
      category: exercise.category,
      ...(steps.length > 0 && {
        step: steps.map((s) => ({
          "@type": "HowToStep",
          position: s.step_number,
          text: s.description,
        })),
      }),
      ...(exercise.primary_image_url && { image: exercise.primary_image_url }),
    };

    const breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: process.env.NEXT_PUBLIC_SITE_URL || "https://gym56.in" },
        { "@type": "ListItem", position: 2, name: "Exercises", item: `${process.env.NEXT_PUBLIC_SITE_URL || "https://gym56.in"}/exercises` },
        { "@type": "ListItem", position: 3, name: exercise.name },
      ],
    };

    return (
      <>
        <JsonLd data={exerciseSchema} />
        <JsonLd data={breadcrumbSchema} />
        <ExerciseDetail
          exercise={exercise}
          instructions={instructions}
          relatedExercises={relatedExercises}
        />
      </>
    );
  } catch {
    notFound();
  }
}
