export default function RootLoading() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 rounded-2xl bg-[#DC2626]/10 flex items-center justify-center mx-auto mb-6">
          <div className="w-8 h-8 rounded-lg bg-[#DC2626] animate-pulse" />
        </div>
        <p className="text-gray-500 text-sm animate-pulse">Loading…</p>
      </div>
    </div>
  );
}
