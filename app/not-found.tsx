"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Home, Dumbbell } from "lucide-react";

export default function NotFound() {
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
          className="w-20 h-20 rounded-2xl bg-[#DC2626]/10 flex items-center justify-center mx-auto mb-6"
        >
          <Dumbbell className="w-10 h-10 text-[#DC2626]" aria-hidden="true" />
        </motion.div>
        <h1 className="text-6xl font-black text-white mb-4">404</h1>
        <p className="text-xl text-gray-300 mb-2">Page Not Found</p>
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
      </motion.div>
    </div>
  );
}
