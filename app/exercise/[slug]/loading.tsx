export default function ExerciseLoading() {
  return (
    <div className="min-h-screen bg-black pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="h-5 w-32 bg-white/5 rounded-full animate-pulse mb-8" />
        <div className="aspect-video rounded-2xl bg-white/5 animate-pulse mb-10" />
        <div className="h-10 w-64 bg-white/10 rounded-full animate-pulse mb-6" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-20 bg-white/5 rounded-xl animate-pulse" />
          ))}
        </div>
        <div className="space-y-4 mb-10">
          <div className="h-8 w-48 bg-white/10 rounded-full animate-pulse" />
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-4 bg-white/5 rounded-full animate-pulse" style={{ width: `${70 + i * 10}%` }} />
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="h-48 bg-white/5 rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  );
}
