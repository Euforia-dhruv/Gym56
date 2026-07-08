import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPublishedExercises, getExerciseBySlug, getExerciseSteps, getRelatedExercises } from "@/lib/actions/exercises";
import { getExercisesFromDb } from "@/lib/data/exercise-loader";
import { getSeedExercises } from "@/lib/data/exercises-seed";
import ExerciseDetail from "./ExerciseDetail";
import JsonLd from "@/components/JsonLd";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://gym56.in";

export async function generateStaticParams() {
  const slugs = new Set<string>();
  try {
    const exercises = await getPublishedExercises();
    exercises.forEach((ex) => slugs.add(ex.slug));
  } catch { /* fall through */ }
  try {
    getSeedExercises().forEach((ex) => slugs.add(ex.slug));
  } catch { /* fall through */ }
  try {
    getExercisesFromDb().forEach((ex) => slugs.add(ex.slug));
  } catch { /* fall through */ }
  return Array.from(slugs).map((slug) => ({ slug }));
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
    const images = exercise.primary_image_url
      ? [{ url: exercise.primary_image_url, width: 1200, height: 630, alt: exercise.name }]
      : [];

    return {
      title: exercise.name,
      description: `Learn how to perform the ${exercise.name}. Step-by-step instructions, target muscles, common mistakes, and safety tips.`,
      openGraph: {
        title: `${exercise.name} — Gym 56`,
        description: `Learn how to perform the ${exercise.name} with proper form and technique.`,
        url: `${SITE_URL}/exercise/${slug}`,
        images,
      },
      twitter: {
        card: "summary_large_image",
        title: `${exercise.name} — Gym 56`,
        description: `Learn how to perform the ${exercise.name} with proper form and technique.`,
        ...(exercise.primary_image_url && { images: [exercise.primary_image_url] }),
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
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "Exercises", item: `${SITE_URL}/exercises` },
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
    const { getSeedExerciseBySlug } = await import("@/lib/data/exercises-seed");
    const found = getSeedExerciseBySlug(slug);
    const { getDbExerciseBySlug } = await import("@/lib/data/exercise-loader");
    const fallbackExercise = found || getDbExerciseBySlug(slug);

    if (!fallbackExercise) notFound();

    const { getSeedExerciseSteps, getSeedExercises } = await import("@/lib/data/exercises-seed");
    const seedSteps = getSeedExerciseSteps(fallbackExercise.id);
    const allSeed = getSeedExercises();
    const seedRelated = allSeed.filter((e) => e.id !== fallbackExercise.id && e.category === fallbackExercise.category).slice(0, 4);

    const instructions = seedSteps.length > 0
      ? seedSteps.map((s) => s.description)
      : fallbackExercise.instructions;

    const exerciseSchema = {
      "@context": "https://schema.org",
      "@type": "HowTo",
      name: fallbackExercise.name,
      description: `Learn how to perform the ${fallbackExercise.name} with proper form.`,
      difficulty: fallbackExercise.difficulty,
      category: fallbackExercise.category,
      ...(instructions.length > 0 && {
        step: instructions.map((text: string, i: number) => ({
          "@type": "HowToStep",
          position: i + 1,
          text,
        })),
      }),
      ...(fallbackExercise.primary_image_url && { image: fallbackExercise.primary_image_url }),
    };

    const breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "Exercises", item: `${SITE_URL}/exercises` },
        { "@type": "ListItem", position: 3, name: fallbackExercise.name },
      ],
    };

    return (
      <>
        <JsonLd data={exerciseSchema} />
        <JsonLd data={breadcrumbSchema} />
        <ExerciseDetail
          exercise={fallbackExercise}
          instructions={instructions}
          relatedExercises={seedRelated}
        />
      </>
    );
  }
}
