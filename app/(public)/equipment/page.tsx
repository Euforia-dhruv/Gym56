import type { Metadata } from "next";
import { getPublishedEquipment } from "@/lib/actions/equipment";
import { getExercisesForEquipmentSlug } from "@/lib/data/equipment-exercise-map";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { EquipmentClient } from "./EquipmentClient";

export const metadata: Metadata = {
  title: "Equipment - Gym 56",
  description:
    "Explore Gym 56's complete equipment library with exercise demonstrations and detailed guides.",
  openGraph: {
    title: "Equipment — Gym 56",
    description: "Browse Gym 56's equipment with linked exercise demonstrations.",
    url: "https://gym56.vercel.app/equipment",
  },
  twitter: {
    card: "summary_large_image",
    title: "Equipment — Gym 56",
    description: "Browse Gym 56's equipment with linked exercise demonstrations.",
  },
};

export default async function EquipmentPage() {
  let equipment;
  try {
    equipment = await getPublishedEquipment();
  } catch {
    const { getSeedEquipment } = await import("@/lib/data/equipment-seed");
    equipment = getSeedEquipment();
  }

  const enriched = equipment.map((eq) => {
    const exercises = getExercisesForEquipmentSlug(eq.slug);
    return {
      ...eq,
      exercises,
      exerciseCount: exercises.length,
    };
  });

  return (
    <>
      <Breadcrumb items={[{ label: "Equipment" }]} />
      <EquipmentClient equipment={enriched} />
    </>
  );
}
