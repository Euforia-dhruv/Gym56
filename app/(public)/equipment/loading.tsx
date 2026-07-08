import { SkeletonCard } from "@/components/ui/Skeleton";

export default function EquipmentLoading() {
  return (
    <div className="min-h-screen bg-black pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header skeleton */}
        <div className="text-center mb-12">
          <div className="w-96 h-12 bg-white/5 rounded-xl animate-pulse mx-auto mb-4" />
          <div className="w-72 h-5 bg-white/5 rounded-lg animate-pulse mx-auto" />
        </div>

        {/* Filter pills skeleton */}
        <div className="flex justify-center gap-3 mb-12">
          {Array.from({ length: 7 }).map((_, i) => (
            <div
              key={i}
              className="w-24 h-10 rounded-full bg-white/5 animate-pulse"
            />
          ))}
        </div>

        {/* Grid skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
