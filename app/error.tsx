"use client";

import { useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass rounded-2xl border border-white/5 p-10 text-center max-w-md w-full"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="w-20 h-20 rounded-2xl bg-red-500/10 flex items-center justify-center mx-auto mb-6"
        >
          <AlertTriangle className="w-10 h-10 text-red-400" aria-hidden="true" />
        </motion.div>
        <h1 className="text-3xl font-bold text-white mb-4">Something Went Wrong</h1>
        <p className="text-gray-400 mb-8">
          An unexpected error occurred. Please try again or go back to the homepage.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#DC2626] hover:bg-[#B91C1C] text-white font-semibold rounded-full transition-all duration-300"
          >
            <RefreshCw className="w-4 h-4" aria-hidden="true" />
            Try Again
          </button>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-full transition-all duration-300"
          >
            <Home className="w-4 h-4" aria-hidden="true" />
            Go Home
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
