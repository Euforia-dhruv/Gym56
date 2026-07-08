import NotFound from "@/components/shared/NotFound";

export default function EquipmentNotFound() {
  return (
    <NotFound
      title="Equipment not found"
      message="The equipment you are looking for does not exist or has been removed."
      returnText="Browse Equipment"
      returnHref="/equipment"
    />
  );
}
