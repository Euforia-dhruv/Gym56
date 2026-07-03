import type { Metadata } from "next";
import { equipmentList } from "@/lib/siteData";
import EquipmentDetail from "./EquipmentDetail";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const equipment = equipmentList.find((eq) => eq.slug === slug);

  if (!equipment) {
    return {
      title: "Equipment Not Found",
      description: "The equipment you are looking for does not exist.",
    };
  }

  return {
    title: equipment.name,
    description: equipment.description.slice(0, 160),
    openGraph: {
      title: `${equipment.name} — Gym 56`,
      description: `Learn about the ${equipment.name} at Gym 56. ${equipment.category} equipment located in ${equipment.location}.`,
      url: `https://gym56.vercel.app/equipment/${equipment.slug}`,
    },
  };
}

export default function EquipmentDetailPage() {
  return <EquipmentDetail />;
}
