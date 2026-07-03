import { getPublishedEquipment } from "@/lib/actions/equipment";
import { EquipmentClient } from "./EquipmentClient";

export default async function EquipmentPage() {
  const equipment = await getPublishedEquipment();

  return <EquipmentClient initialEquipment={equipment} />;
}
