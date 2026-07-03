export default function LoadingSpinner({ text = "Loading..." }: { text?: string }) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center bg-black">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-4 border-[#DC2626]/30 border-t-[#DC2626] rounded-full animate-spin" />
        <p className="text-gray-400 text-sm">{text}</p>
      </div>
    </div>
  );
}
