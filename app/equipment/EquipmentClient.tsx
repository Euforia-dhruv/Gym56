"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Dumbbell, ChevronRight, CheckCircle, XCircle, Search, X, SlidersHorizontal } from "lucide-react";
import { getConditionColor, cn } from "@/lib/utils";
import type { Equipment, EquipmentCategory } from "@/types";

const CATEGORIES: (EquipmentCategory | "All")[] = [
  "All", "Cardio", "Strength", "Free Weights", "Machines", "Functional", "Recovery", "Other",
];
const CONDITIONS = ["All", "excellent", "good", "fair", "maintenance"] as const;

export function EquipmentClient({ initialEquipment }: { initialEquipment: Equipment[] }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<EquipmentCategory | "All">("All");
  const [conditionFilter, setConditionFilter] = useState("All");
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    let list = initialEquipment;
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (eq) =>
          eq.name.toLowerCase().includes(q) ||
          eq.category.toLowerCase().includes(q) ||
          eq.description?.toLowerCase().includes(q) ||
          eq.location?.toLowerCase().includes(q)
      );
    }
    if (category !== "All") list = list.filter((eq) => eq.category === category);
    if (conditionFilter !== "All") list = list.filter((eq) => eq.condition === conditionFilter);
    return list;
  }, [initialEquipment, search, category, conditionFilter]);

  const availableCount = initialEquipment.filter((eq) => eq.is_available).length;

  return (
    <div className="min-h-screen bg-black pt-24 pb-16 px-4 sm:px-6 lg:px-8" role="region" aria-label="Equipment library">
      <div className="max-w-7xl mx-auto">
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
            {filtered.length} premium machines and tools for every workout
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex justify-center gap-6 mb-8"
        >
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Dumbbell className="w-4 h-4 text-[#DC2626]" />
            <span className="font-semibold text-white">{initialEquipment.length}</span>
            <span>total items</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <CheckCircle className="w-4 h-4 text-green-400" />
            <span className="font-semibold text-white">{availableCount}</span>
            <span>available</span>
          </div>
        </motion.div>

        {/* Search + Filter Toggle */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search equipment by name, category, or keyword..."
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-black/50 border border-white/10 focus:border-[#DC2626] focus:outline-none focus:ring-1 focus:ring-[#DC2626] transition-all text-white placeholder-gray-600"
              aria-label="Search equipment"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white" aria-label="Clear search">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-4 py-3 rounded-xl border transition-all flex items-center gap-2 text-sm font-medium ${
              showFilters ? "bg-[#DC2626]/10 border-[#DC2626]/30 text-[#DC2626]" : "bg-black/50 border-white/10 text-gray-400 hover:text-white"
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
          </button>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            className="glass rounded-2xl p-6 mb-8 space-y-5 border border-white/10"
          >
            <div>
              <p className="text-sm text-gray-400 mb-2">Category</p>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((c) => (
                  <button
                    key={c}
                    onClick={() => setCategory(c)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                      category === c ? "bg-[#DC2626] text-white" : "bg-white/5 text-gray-400 hover:text-white"
                    }`}
                    aria-label={`Filter by category: ${c}`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-2">Condition</p>
              <div className="flex flex-wrap gap-2">
                {CONDITIONS.map((c) => (
                  <button
                    key={c}
                    onClick={() => setConditionFilter(c)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all capitalize ${
                      conditionFilter === c ? "bg-[#DC2626] text-white" : "bg-white/5 text-gray-400 hover:text-white"
                    }`}
                    aria-label={`Filter by condition: ${c}`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
          {filtered.length === 0 ? (
            <div className="col-span-full text-center py-20">
              <Dumbbell className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No equipment found</p>
              <p className="text-gray-600 text-sm">Try adjusting your search or filters</p>
            </div>
          ) : (
            filtered.map((eq) => (
              <motion.div
                key={eq.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
                className="glass rounded-2xl p-6 hover:border-[#DC2626]/30 transition-all duration-300 border border-white/5 flex flex-col"
              >
                {eq.primary_image_url && (
                  <div className="aspect-video rounded-xl overflow-hidden mb-4 bg-gray-900">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={eq.primary_image_url}
                      alt={eq.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      loading="lazy"
                    />
                  </div>
                )}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <span className="text-xs text-gray-500 mb-1 block">{eq.category}</span>
                    <h3 className="text-lg font-bold text-white truncate">{eq.name}</h3>
                  </div>
                  <span className={cn("ml-3 px-2.5 py-1 text-[10px] font-semibold rounded-full border flex-shrink-0", getConditionColor(eq.condition as "excellent" | "good" | "fair" | "maintenance" | "retired"))}>
                    {eq.condition.charAt(0).toUpperCase() + eq.condition.slice(1)}
                  </span>
                </div>

                {eq.description && <p className="text-gray-400 text-sm mb-4 line-clamp-2 flex-1">{eq.description}</p>}

                <div className="flex flex-wrap items-center gap-3 mb-4 text-xs">
                  <span className="text-gray-500"><span className="text-gray-400 font-medium">Qty:</span> {eq.quantity}</span>
                  {eq.location && <span className="text-gray-500"><span className="text-gray-400 font-medium">At:</span> {eq.location}</span>}
                  {eq.is_available ? (
                    <span className="inline-flex items-center gap-1 text-green-400"><CheckCircle className="w-3.5 h-3.5" /> Available</span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-red-400"><XCircle className="w-3.5 h-3.5" /> Unavailable</span>
                  )}
                </div>

                <Link
                  href={`/equipment/${eq.slug}`}
                  className="inline-flex items-center gap-2 text-[#DC2626] font-semibold hover:text-white transition-colors duration-300 mt-auto pt-2 border-t border-white/5"
                  aria-label={`View details for ${eq.name}`}
                >
                  View Details
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
