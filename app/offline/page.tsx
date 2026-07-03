import type { Metadata } from "next";
import Link from "next/link";
import { WifiOff } from "lucide-react";

export const metadata: Metadata = {
  title: "You're Offline",
  description: "Gym 56 is not available offline. Please check your internet connection.",
};

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 rounded-full bg-[#DC2626]/10 flex items-center justify-center mx-auto mb-6">
          <WifiOff className="w-10 h-10 text-[#DC2626]" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-4">You&apos;re Offline</h1>
        <p className="text-gray-400 mb-8">
          Please check your internet connection and try again. Some features require an active connection.
        </p>
        <Link
          href="/"
          className="inline-flex px-6 py-3 bg-[#DC2626] hover:bg-[#B91C1C] text-white font-semibold rounded-full transition-all duration-300"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
