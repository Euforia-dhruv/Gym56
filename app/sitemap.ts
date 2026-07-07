import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://gym56.vercel.app";

  const staticPages = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 1.0 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${baseUrl}/services`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${baseUrl}/classes`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${baseUrl}/exercises`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.9 },
    { url: `${baseUrl}/exercise-compare`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.5 },
    { url: `${baseUrl}/equipment`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.9 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.7 },
  ];

  let equipmentSlugs: string[] = [];
  let exerciseSlugs: string[] = [];

  try {
    const { getPublishedEquipment } = await import("@/lib/actions/equipment");
    const equipment = await getPublishedEquipment();
    equipmentSlugs = equipment.map((e) => e.slug);
  } catch {
    equipmentSlugs = [];
  }

  try {
    const { getPublishedExercises } = await import("@/lib/actions/exercises");
    const exercises = await getPublishedExercises();
    exerciseSlugs = exercises.map((e) => e.slug);
  } catch {
    exerciseSlugs = [];
  }

  const equipmentPages = equipmentSlugs.map((slug) => ({
    url: `${baseUrl}/equipment/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const exercisePages = exerciseSlugs.map((slug) => ({
    url: `${baseUrl}/exercise/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...equipmentPages, ...exercisePages];
}
