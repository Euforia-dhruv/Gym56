import Link from "next/link";
import { Dumbbell, ArrowLeft } from "lucide-react";

export default function EquipmentNotFound() {
  return (
    <div className="min-h-screen bg-black pt-24 pb-16 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 rounded-2xl bg-[#DC2626]/10 flex items-center justify-center mx-auto mb-6">
          <Dumbbell className="w-10 h-10 text-[#DC2626]" aria-hidden="true" />
        </div>
        <h1 className="text-4xl font-bold text-white mb-4">Equipment Not Found</h1>
        <p className="text-gray-400 mb-8">
          The equipment you&apos;re looking for doesn&apos;t exist or may have been removed.
        </p>
        <Link
          href="/equipment"
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#DC2626] hover:bg-[#B91C1C] text-white font-semibold rounded-full transition-all duration-300"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          Back to Equipment Library
        </Link>
      </div>
    </div>
  );
}
