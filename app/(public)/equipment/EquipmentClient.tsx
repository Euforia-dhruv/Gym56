"use client";

import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dumbbell,
  ChevronRight,
  CheckCircle,
  XCircle,
  Search,
  X,
  SlidersHorizontal,
  ExternalLink,
  AlertCircle,
  Activity,
  Target,
  Layers,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Equipment } from "@/types";
import type { Exercise } from "@/types";

const CATEGORIES = [
  "All", "Cardio", "Strength", "Free Weights", "Machines", "Functional", "Recovery", "Other",
] as const;

type EquipmentWithExercises = Equipment & {
  exercises: Exercise[];
  exerciseCount: number;
};

const IMAGEKIT_BASE = "https://ik.imagekit.io/yuhonas";

function getExerciseImageUrl(ex: Exercise): string | null {
  if (ex.images && ex.images.length > 0) {
    return `${IMAGEKIT_BASE}/${ex.images[0]}`;
  }
  return ex.thumbnail_url || ex.primary_image_url || null;
}

export function EquipmentClient({ equipment }: { equipment: EquipmentWithExercises[] }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [showFilters, setShowFilters] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [loadingImages, setLoadingImages] = useState<Set<string>>(new Set());
  const containerRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => {
    let list = equipment;
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
    return list;
  }, [equipment, search, category]);

  const availableCount = equipment.filter((eq) => eq.is_available).length;

  const toggleExpand = useCallback((id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  }, []);

  useEffect(() => {
    if (!expandedId) return;
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(`[data-equipment-id="${expandedId}"]`)) {
        setExpandedId(null);
      }
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setExpandedId(null);
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [expandedId]);

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
            Hover or tap a card to explore exercises for each machine
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex justify-center gap-6 mb-8"
        >
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Dumbbell className="w-4 h-4 text-[#DC2626]" />
            <span className="font-semibold text-white">{equipment.length}</span>
            <span>total items</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <CheckCircle className="w-4 h-4 text-green-400" />
            <span className="font-semibold text-white">{availableCount}</span>
            <span>available</span>
          </div>
        </motion.div>

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
          </motion.div>
        )}

        <div ref={containerRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.length === 0 ? (
            <div className="col-span-full text-center py-20">
              <Dumbbell className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No equipment found</p>
              <p className="text-gray-600 text-sm">Try adjusting your search or filters</p>
            </div>
          ) : (
            filtered.map((eq) => (
              <EquipmentCard
                key={eq.id}
                eq={eq}
                expandedId={expandedId}
                onToggle={toggleExpand}
                loadingImages={loadingImages}
                setLoadingImages={setLoadingImages}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function EquipmentCard({
  eq,
  expandedId,
  onToggle,
  loadingImages,
  setLoadingImages,
}: {
  eq: EquipmentWithExercises;
  expandedId: string | null;
  onToggle: (id: string) => void;
  loadingImages: Set<string>;
  setLoadingImages: React.Dispatch<React.SetStateAction<Set<string>>>;
}) {
  const isExpanded = expandedId === eq.id;
  const displayExercises = eq.exercises.slice(0, 6);
  const hasExercises = eq.exerciseCount > 0;

  useEffect(() => {
    if (isExpanded && hasExercises) {
      displayExercises.forEach((ex) => {
        const url = getExerciseImageUrl(ex);
        if (url) {
          const key = ex.id;
          if (!loadingImages.has(key)) {
            setLoadingImages((prev) => new Set(prev).add(key));
            const img = new window.Image();
            img.onload = () => {
              setLoadingImages((prev) => {
                const next = new Set(prev);
                next.delete(key);
                return next;
              });
            };
            img.onerror = () => {
              setLoadingImages((prev) => {
                const next = new Set(prev);
                next.delete(key);
                return next;
              });
            };
            img.src = url;
          }
        }
      });
    }
  }, [isExpanded]);

  return (
    <motion.div
      layout
      data-equipment-id={eq.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "glass rounded-2xl border transition-all duration-300 flex flex-col cursor-pointer overflow-hidden",
        isExpanded
          ? "border-[#DC2626]/40 shadow-lg shadow-[#DC2626]/5"
          : "border-white/5 hover:border-[#DC2626]/20 hover:-translate-y-1"
      )}
      onClick={() => onToggle(eq.id)}
      onMouseEnter={() => onToggle(eq.id)}
      role="button"
      tabIndex={0}
      aria-expanded={isExpanded}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onToggle(eq.id); } }}
    >
      <div className="p-5">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1 min-w-0">
            <span className="text-xs text-gray-500 mb-1 block">{eq.category}</span>
            <h3 className="text-lg font-bold text-white truncate">{eq.name}</h3>
          </div>
          <span className={cn(
            "ml-3 px-2.5 py-1 text-[10px] font-semibold rounded-full border flex-shrink-0",
            eq.condition === "excellent" ? "text-green-400 border-green-400/30 bg-green-400/5" :
            eq.condition === "good" ? "text-blue-400 border-blue-400/30 bg-blue-400/5" :
            eq.condition === "fair" ? "text-yellow-400 border-yellow-400/30 bg-yellow-400/5" :
            "text-red-400 border-red-400/30 bg-red-400/5"
          )}>
            {eq.condition.charAt(0).toUpperCase() + eq.condition.slice(1)}
          </span>
        </div>

        {eq.description && (
          <p className="text-gray-400 text-sm mb-3 line-clamp-2">{eq.description}</p>
        )}

        <div className="flex flex-wrap items-center gap-3 mb-2 text-xs">
          {eq.location && (
            <span className="text-gray-500"><span className="text-gray-400 font-medium">At:</span> {eq.location}</span>
          )}
          {hasExercises && (
            <span className="inline-flex items-center gap-1 text-[#DC2626]">
              <Activity className="w-3.5 h-3.5" />
              <span>{eq.exerciseCount} exercise{eq.exerciseCount !== 1 ? "s" : ""}</span>
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {eq.is_available ? (
            <span className="inline-flex items-center gap-1 text-green-400 text-xs"><CheckCircle className="w-3 h-3" /> Available</span>
          ) : (
            <span className="inline-flex items-center gap-1 text-red-400 text-xs"><XCircle className="w-3 h-3" /> Unavailable</span>
          )}
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="border-t border-white/5 overflow-hidden"
          >
            <div className="p-5 pt-3">
              {hasExercises ? (
                <>
                  <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                    <Dumbbell className="w-4 h-4 text-[#DC2626]" />
                    Exercises with this equipment
                  </h4>
                  <div className="grid gap-3">
                    {displayExercises.map((ex, i) => (
                      <motion.div
                        key={ex.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05, duration: 0.2 }}
                      >
                        <Link
                          href={`/exercise/${ex.slug}`}
                          className="flex gap-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] transition-colors p-2 group"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-900 flex-shrink-0 relative">
                            {getExerciseImageUrl(ex) && (
                              <img
                                src={getExerciseImageUrl(ex)!}
                                alt={ex.name}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                loading="lazy"
                              />
                            )}
                          </div>
                          <div className="flex-1 min-w-0 py-0.5">
                            <h5 className="text-sm font-semibold text-white truncate group-hover:text-[#DC2626] transition-colors">
                              {ex.name}
                            </h5>
                            <div className="flex flex-wrap gap-1.5 mt-1.5">
                              {ex.target_muscles.slice(0, 1).map((m) => (
                                <span key={m} className="inline-flex items-center gap-0.5 text-[10px] text-gray-400 bg-white/5 rounded-full px-2 py-0.5">
                                  <Target className="w-2.5 h-2.5" />
                                  {m}
                                </span>
                              ))}
                              {ex.secondary_muscles && ex.secondary_muscles.slice(0, 1).map((m) => (
                                <span key={m} className="inline-flex items-center gap-0.5 text-[10px] text-gray-500 bg-white/5 rounded-full px-2 py-0.5">
                                  <Layers className="w-2.5 h-2.5" />
                                  {m}
                                </span>
                              ))}
                              <span className={cn(
                                "text-[10px] font-semibold px-2 py-0.5 rounded-full",
                                ex.difficulty === "Beginner" ? "text-green-400 bg-green-400/10" :
                                ex.difficulty === "Intermediate" ? "text-yellow-400 bg-yellow-400/10" :
                                "text-red-400 bg-red-400/10"
                              )}>
                                {ex.difficulty}
                              </span>
                            </div>
                          </div>
                        </Link>
                      </motion.div>
                    ))}
                  </div>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="mt-4 flex items-center gap-3"
                  >
                    <Link
                      href="/exercises"
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-[#DC2626] hover:text-white transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      View All Exercises
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                    <Link
                      href={`/equipment/${eq.slug}`}
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-400 hover:text-white transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Equipment Details
                      <ChevronRight className="w-3 h-3" />
                    </Link>
                  </motion.div>
                </>
              ) : (
                <div className="flex flex-col items-center py-6 text-center">
                  <AlertCircle className="w-8 h-8 text-gray-600 mb-2" />
                  <p className="text-sm text-gray-500 font-medium">Exercises coming soon</p>
                  <p className="text-xs text-gray-600 mt-1">We are adding exercise demonstrations for this equipment.</p>
                  <Link
                    href={`/equipment/${eq.slug}`}
                    className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-[#DC2626] hover:text-white transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    View Equipment Details
                    <ChevronRight className="w-3 h-3" />
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
