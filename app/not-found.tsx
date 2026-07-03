import Link from "next/link";
import { Home, Dumbbell } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 rounded-2xl bg-[#DC2626]/10 flex items-center justify-center mx-auto mb-6">
          <Dumbbell className="w-10 h-10 text-[#DC2626]" aria-hidden="true" />
        </div>
        <h1 className="text-6xl font-black text-white mb-4">404</h1>
        <p className="text-xl text-gray-300 mb-2">Page not found</p>
        <p className="text-gray-500 mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#DC2626] hover:bg-[#B91C1C] text-white font-semibold rounded-full transition-all duration-300"
        >
          <Home className="w-4 h-4" aria-hidden="true" />
          Go Home
        </Link>
      </div>
    </div>
  );
}
