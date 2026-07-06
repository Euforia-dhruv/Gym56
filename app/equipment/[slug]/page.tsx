import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getEquipmentBySlug, getPublishedEquipment, getRelatedEquipment, getEquipmentImages } from "@/lib/actions/equipment";
import { getExercisesByEquipment } from "@/lib/actions/exercises";
import EquipmentDetail from "./EquipmentDetail";
import JsonLd from "@/components/JsonLd";

export async function generateStaticParams() {
  try {
    const equipment = await getPublishedEquipment();
    return equipment.map((eq) => ({ slug: eq.slug }));
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
    const equipment = await getEquipmentBySlug(slug);
    if (!equipment) {
      return {
        title: "Equipment Not Found",
        description: "The equipment you are looking for does not exist.",
      };
    }
    return {
      title: equipment.name,
      description: (equipment.description || "").slice(0, 160),
      openGraph: {
        title: `${equipment.name} — Gym 56`,
        description: `Learn about the ${equipment.name} at Gym 56. ${equipment.category} equipment.`,
      },
    };
  } catch {
    return {
      title: "Equipment Not Found",
      description: "The equipment you are looking for does not exist.",
    };
  }
}

export default async function EquipmentDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  try {
    const equipment = await getEquipmentBySlug(slug);
    if (!equipment) notFound();

    const [equipmentExercises, related, images] = await Promise.all([
      getExercisesByEquipment(equipment.id).catch(() => []),
      getRelatedEquipment(equipment.id).catch(() => []),
      getEquipmentImages(equipment.id).catch(() => []),
    ]);

    const equipmentSchema = {
      "@context": "https://schema.org",
      "@type": "Product",
      name: equipment.name,
      description: equipment.description || `${equipment.name} at Gym 56`,
      category: equipment.category,
      ...(equipment.primary_image_url && { image: equipment.primary_image_url }),
    };

    const breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: process.env.NEXT_PUBLIC_SITE_URL || "https://gym56.in" },
        { "@type": "ListItem", position: 2, name: "Equipment", item: `${process.env.NEXT_PUBLIC_SITE_URL || "https://gym56.in"}/equipment` },
        { "@type": "ListItem", position: 3, name: equipment.name },
      ],
    };

    return (
      <>
        <JsonLd data={equipmentSchema} />
        <JsonLd data={breadcrumbSchema} />
        <EquipmentDetail
          equipment={equipment}
          equipmentExercises={equipmentExercises}
          related={related}
          images={images}
        />
      </>
    );
  } catch {
    notFound();
  }
}
