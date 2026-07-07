import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPublishedExercises, getExerciseBySlug, getExerciseSteps, getRelatedExercises } from "@/lib/actions/exercises";
import ExerciseDetail from "./ExerciseDetail";
import JsonLd from "@/components/JsonLd";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://gym56.in";

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
    const seedExercise = getSeedExerciseBySlug(slug);
    if (!seedExercise) notFound();

    const { getSeedExerciseSteps, getSeedExercises } = await import("@/lib/data/exercises-seed");
    const seedSteps = getSeedExerciseSteps(seedExercise.id);
    const allSeed = getSeedExercises();
    const seedRelated = allSeed.filter((e) => e.id !== seedExercise.id && e.category === seedExercise.category).slice(0, 4);

    const instructions = seedSteps.map((s) => s.description);

    const exerciseSchema = {
      "@context": "https://schema.org",
      "@type": "HowTo",
      name: seedExercise.name,
      description: `Learn how to perform the ${seedExercise.name} with proper form.`,
      difficulty: seedExercise.difficulty,
      category: seedExercise.category,
      ...(seedSteps.length > 0 && {
        step: seedSteps.map((s) => ({
          "@type": "HowToStep",
          position: s.step_number,
          text: s.description,
        })),
      }),
      ...(seedExercise.primary_image_url && { image: seedExercise.primary_image_url }),
    };

    const breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "Exercises", item: `${SITE_URL}/exercises` },
        { "@type": "ListItem", position: 3, name: seedExercise.name },
      ],
    };

    return (
      <>
        <JsonLd data={exerciseSchema} />
        <JsonLd data={breadcrumbSchema} />
        <ExerciseDetail
          exercise={seedExercise}
          instructions={instructions}
          relatedExercises={seedRelated}
        />
      </>
    );
  }
}
