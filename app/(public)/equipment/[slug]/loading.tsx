import { Skeleton } from "@/components/ui/Skeleton";

export default function EquipmentDetailLoading() {
  return (
    <div className="min-h-screen bg-black pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Back link skeleton */}
        <div className="w-32 h-5 bg-white/5 rounded animate-pulse mb-8" />

        {/* Header badges */}
        <div className="flex gap-3 mb-4">
          <Skeleton className="w-20 h-6 rounded-full" />
          <Skeleton className="w-24 h-6 rounded-full" />
        </div>

        {/* Title */}
        <Skeleton className="w-96 h-12 rounded-xl mb-8" />

        {/* Quick info cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-24 bg-white/5 rounded-2xl animate-pulse" />
          ))}
        </div>

        {/* Description */}
        <div className="space-y-3 mb-10">
          <Skeleton className="w-48 h-8 rounded-lg" />
          <Skeleton className="w-full h-4 rounded" />
          <Skeleton className="w-5/6 h-4 rounded" />
          <Skeleton className="w-3/4 h-4 rounded" />
        </div>

        {/* How to use */}
        <div className="space-y-3 mb-10">
          <Skeleton className="w-40 h-8 rounded-lg" />
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex gap-4">
              <Skeleton variant="circular" width={32} height={32} />
              <Skeleton className="flex-1 h-5 rounded" />
            </div>
          ))}
        </div>

        {/* Safety tips */}
        <div className="space-y-3 mb-10">
          <Skeleton className="w-36 h-8 rounded-lg" />
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex gap-3">
              <Skeleton variant="circular" width={8} height={8} />
              <Skeleton className="flex-1 h-5 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
