"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Dumbbell, ChevronRight, CheckCircle, XCircle } from "lucide-react";
import { equipmentList, equipmentCategories } from "@/lib/siteData";
import type { EquipmentCategory } from "@/lib/siteData";

const getConditionColor = (condition: string): string => {
  switch (condition) {
    case "excellent":
      return "bg-green-500/20 text-green-400 border-green-500/30";
    case "good":
      return "bg-blue-500/20 text-blue-400 border-blue-500/30";
    case "fair":
      return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
    case "maintenance":
    case "retired":
      return "bg-red-500/20 text-red-400 border-red-500/30";
    default:
      return "bg-gray-500/20 text-gray-400 border-gray-500/30";
  }
};

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const item = {
  hidden: { y: 24, opacity: 0 },
  show: { y: 0, opacity: 1, transition: { duration: 0.5 } },
};

export default function EquipmentLibrary() {
  const [selectedCategory, setSelectedCategory] = useState<EquipmentCategory | "All">("All");

  const filtered =
    selectedCategory === "All"
      ? equipmentList
      : equipmentList.filter((eq) => eq.category === selectedCategory);

  const availableCount = equipmentList.filter((eq) => eq.isAvailable).length;

  return (
    <div className="min-h-screen bg-black pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-6"
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4">
            Equipment <span className="text-[#DC2626]">Library</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Explore our premium gym equipment — from cardio machines to free weights, 
            everything you need for a complete workout
          </p>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex justify-center gap-6 mb-8"
        >
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Dumbbell className="w-4 h-4 text-[#DC2626]" aria-hidden="true" />
            <span className="font-semibold text-white">{equipmentList.length}</span>
            <span>total items</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <CheckCircle className="w-4 h-4 text-green-400" aria-hidden="true" />
            <span className="font-semibold text-white">{availableCount}</span>
            <span>available</span>
          </div>
        </motion.div>

        {/* Category filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          role="group"
          aria-label="Filter equipment by category"
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {equipmentCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              aria-pressed={selectedCategory === cat}
              className={`px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                selectedCategory === cat
                  ? "bg-[#DC2626] text-white shadow-lg shadow-[#DC2626]/30"
                  : "glass text-gray-300 hover:text-white hover:border-white/30"
              }`}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        {/* Equipment grid */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6"
        >
          {filtered.length === 0 ? (
            <div className="col-span-full text-center py-20">
              <Dumbbell className="w-12 h-12 text-gray-600 mx-auto mb-4" aria-hidden="true" />
              <p className="text-gray-500 text-lg">No equipment found in this category</p>
            </div>
          ) : (
            filtered.map((eq) => (
              <motion.div
                key={eq.id}
                variants={item}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
                className="glass rounded-2xl p-6 hover:border-white/20 transition-all duration-300 flex flex-col"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1 min-w-0">
                    <span className="text-sm text-gray-500 mb-1 block">
                      {eq.category}
                    </span>
                    <h3 className="text-xl font-bold text-white truncate">
                      {eq.name}
                    </h3>
                  </div>
                  <span
                    className={`ml-3 px-3 py-1 text-xs font-semibold rounded-full border flex-shrink-0 ${getConditionColor(eq.condition)}`}
                  >
                    {eq.condition.charAt(0).toUpperCase() + eq.condition.slice(1)}
                  </span>
                </div>

                {/* Description */}
                <p className="text-gray-400 text-sm mb-4 line-clamp-3 flex-1">
                  {eq.description}
                </p>

                {/* Meta */}
                <div className="flex flex-wrap items-center gap-3 mb-4 text-xs">
                  <span className="text-gray-500">
                    <span className="text-gray-400 font-medium">Qty:</span> {eq.quantity}
                  </span>
                  <span className="text-gray-500">
                    <span className="text-gray-400 font-medium">Location:</span> {eq.location}
                  </span>
                  {eq.isAvailable ? (
                    <span className="inline-flex items-center gap-1 text-green-400">
                      <CheckCircle className="w-3.5 h-3.5" aria-hidden="true" />
                      Available
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-red-400">
                      <XCircle className="w-3.5 h-3.5" aria-hidden="true" />
                      Unavailable
                    </span>
                  )}
                </div>

                {/* Link */}
                <Link
                  href={`/equipment/${eq.slug}`}
                  className="inline-flex items-center gap-2 text-[#DC2626] font-semibold hover:text-white transition-colors duration-300 mt-auto pt-2 border-t border-white/5"
                >
                  View Details
                  <ChevronRight className="w-4 h-4" aria-hidden="true" />
                </Link>
              </motion.div>
            ))
          )}
        </motion.div>
      </div>
    </div>
  );
}
