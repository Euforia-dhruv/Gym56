"use client";

import { useEffect } from "react";

export default function ErrorFallback({
  error,
  reset,
  title = "Something went wrong",
  message = "An unexpected error occurred. Please try again.",
}: {
  error: Error & { digest?: string };
  reset?: () => void;
  title?: string;
  message?: string;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center bg-black px-4">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 rounded-full bg-[#DC2626]/10 flex items-center justify-center mx-auto mb-6">
          <span className="text-3xl">!</span>
        </div>
        <h2 className="text-2xl font-bold text-white mb-3">{title}</h2>
        <p className="text-gray-400 mb-8">{message}</p>
        {reset && (
          <button
            onClick={reset}
            className="px-6 py-3 bg-[#DC2626] hover:bg-[#B91C1C] text-white font-semibold rounded-full transition-all duration-300"
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  );
}
