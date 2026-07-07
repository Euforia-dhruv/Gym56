import type { Metadata } from "next";
import { getPublishedEquipment } from "@/lib/actions/equipment";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { EquipmentClient } from "./EquipmentClient";

export const metadata: Metadata = {
  title: "Equipment - Gym 56",
  description:
    "Explore Gym 56's complete equipment library. Browse by category, condition, and availability. Detailed instructions, safety tips, and more.",
  openGraph: {
    title: "Equipment — Gym 56",
    description: "Browse Gym 56's complete equipment library with detailed info, how-to guides, and safety tips.",
    url: "https://gym56.vercel.app/equipment",
  },
  twitter: {
    card: "summary_large_image",
    title: "Equipment — Gym 56",
    description: "Browse Gym 56's complete equipment library with detailed info, how-to guides, and safety tips.",
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
  return (
    <>
      <Breadcrumb items={[{ label: "Equipment" }]} />
      <EquipmentClient initialEquipment={equipment} />
    </>
  );
}
