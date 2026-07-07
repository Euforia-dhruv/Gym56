"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Search,
  Heart,
  Clock,
  GitCompare,
  X,
  Dumbbell,
  SlidersHorizontal,
} from "lucide-react";
import { getDifficultyColor } from "@/lib/utils";

const DIFFICULTIES = ["All", "Beginner", "Intermediate", "Advanced"] as const;

const FAVORITES_KEY = "gym56_favorite_exercises";
const RECENT_KEY = "gym56_recent_exercises";

const EXERCISE_IMAGE_BASE = "https://ik.imagekit.io/yuhonas";

interface ExerciseData {
  id: string;
  name: string;
  slug: string;
  category: string;
  difficulty: string;
  equipment_label: string | null;
  target_muscles: string[];
  secondary_muscles: string[];
  muscle_group: string | null;
  images: string[];
  thumbnail_url: string | null;
  primary_image_url: string | null;
}

function useLocalStorage<T>(key: string, initial: T): [T, (v: T) => void] {
  const [value, setValue] = useState<T>(initial);
  useEffect(() => {
    try {
      const stored = localStorage.getItem(key);
      if (stored) setValue(JSON.parse(stored));
    } catch { /* noop */ }
  }, [key]);
  const setAndStore = useCallback((v: T) => {
    setValue(v);
    try { localStorage.setItem(key, JSON.stringify(v)); }
    catch { /* noop */ }
  }, [key]);
  return [value, setAndStore];
}

export default function ExercisesClient({ initialExercises }: { initialExercises: ExerciseData[] }) {
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("All");
  const [showFilters, setShowFilters] = useState(false);
  const [favorites, setFavorites] = useLocalStorage<string[]>(FAVORITES_KEY, []);
  const [recent, setRecent] = useLocalStorage<string[]>(RECENT_KEY, []);
  const [compareList, setCompareList] = useState<string[]>([]);

  const toggleFavorite = useCallback((id: string) => {
    setFavorites(
      favorites.includes(id)
        ? favorites.filter((f) => f !== id)
        : [...favorites, id]
    );
  }, [favorites, setFavorites]);

  const addRecent = useCallback((id: string) => {
    setRecent([id, ...recent.filter((r) => r !== id)].slice(0, 20));
  }, [recent, setRecent]);

  const toggleCompare = useCallback((id: string) => {
    setCompareList((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : prev.length < 4 ? [...prev, id] : prev
    );
  }, []);

  const derivedCategories = useMemo(() => {
    const set = new Set<string>();
    initialExercises.forEach((ex) => { if (ex.category) set.add(ex.category); });
    return ["All", ...Array.from(set).sort()];
  }, [initialExercises]);

  const derivedMuscles = useMemo(() => {
    const set = new Set<string>();
    initialExercises.forEach((ex) => {
      (ex.target_muscles || []).forEach((m) => set.add(m));
      (ex.secondary_muscles || []).forEach((m) => set.add(m));
      if (ex.muscle_group) set.add(ex.muscle_group);
    });
    return ["All", ...Array.from(set).sort()];
  }, [initialExercises]);

  const equipmentSet = useMemo(() => {
    const set = new Set<string>();
    initialExercises.forEach((ex) => {
      if (ex.equipment_label) set.add(ex.equipment_label);
    });
    return ["All Equipment", ...Array.from(set).sort()];
  }, [initialExercises]);

  const [categoryFilter, setCategoryFilter] = useState("All");
  const [equipment, setEquipment] = useState("All Equipment");
  const [muscleFilter, setMuscleFilter] = useState("All");

  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [showRecent, setShowRecent] = useState(false);

  const filtered = useMemo(() => {
    let list = initialExercises;

    if (showFavoritesOnly) list = list.filter((ex) => favorites.includes(ex.id));

    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (ex) =>
          ex.name.toLowerCase().includes(q) ||
          ex.category.toLowerCase().includes(q) ||
          ex.target_muscles?.some((m) => m.toLowerCase().includes(q)) ||
          ex.equipment_label?.toLowerCase().includes(q)
      );
    }

    if (categoryFilter !== "All") list = list.filter((ex) => ex.category === categoryFilter);
    if (difficulty !== "All") list = list.filter((ex) => ex.difficulty === difficulty);
    if (muscleFilter !== "All") {
      list = list.filter(
        (ex) =>
          ex.target_muscles?.includes(muscleFilter) ||
          ex.secondary_muscles?.includes(muscleFilter) ||
          ex.muscle_group === muscleFilter
      );
    }
    if (equipment !== "All Equipment") list = list.filter((ex) => ex.equipment_label === equipment);

    return list;
  }, [initialExercises, search, categoryFilter, difficulty, muscleFilter, equipment, showFavoritesOnly, favorites]);

  const recentExercises = useMemo(
    () => recent.map((id) => initialExercises.find((ex) => ex.id === id)).filter(Boolean) as ExerciseData[],
    [recent, initialExercises]
  );

  const activeFilterCount = [categoryFilter !== "All", difficulty !== "All", muscleFilter !== "All", equipment !== "All Equipment", showFavoritesOnly].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-black pt-24 pb-16 px-4 sm:px-6 lg:px-8" role="region" aria-label="Exercise library">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4">
            Exercise <span className="text-[#DC2626]">Encyclopedia</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            {filtered.length} exercises with detailed instructions, tips, and variations
          </p>
        </motion.div>

        {/* Toolbar: Search + Toggles */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search exercises by name, muscle, or equipment..."
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-black/50 border border-white/10 focus:border-[#DC2626] focus:outline-none focus:ring-1 focus:ring-[#DC2626] transition-all text-white placeholder-gray-600"
              aria-label="Search exercises"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-4 py-3 rounded-xl border transition-all flex items-center gap-2 text-sm font-medium ${
              showFilters || activeFilterCount > 0
                ? "bg-[#DC2626]/10 border-[#DC2626]/30 text-[#DC2626]"
                : "bg-black/50 border-white/10 text-gray-400 hover:text-white hover:border-white/30"
            }`}
            aria-label="Toggle filters"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
            {activeFilterCount > 0 && (
              <span className="ml-1 w-5 h-5 rounded-full bg-[#DC2626] text-white text-xs flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>
          <button
            onClick={() => { setShowFavoritesOnly(!showFavoritesOnly); setShowRecent(false); }}
            className={`px-4 py-3 rounded-xl border transition-all flex items-center gap-2 text-sm font-medium ${
              showFavoritesOnly
                ? "bg-red-500/10 border-red-500/30 text-red-400"
                : "bg-black/50 border-white/10 text-gray-400 hover:text-white hover:border-white/30"
            }`}
            aria-label="Show favorites only"
            aria-pressed={showFavoritesOnly}
          >
            <Heart className={`w-4 h-4 ${showFavoritesOnly ? "fill-red-400" : ""}`} />
            Favorites {favorites.length > 0 && `(${favorites.length})`}
          </button>
          <button
            onClick={() => { setShowRecent(!showRecent); setShowFavoritesOnly(false); }}
            className={`px-4 py-3 rounded-xl border transition-all flex items-center gap-2 text-sm font-medium ${
              showRecent
                ? "bg-blue-500/10 border-blue-500/30 text-blue-400"
                : "bg-black/50 border-white/10 text-gray-400 hover:text-white hover:border-white/30"
            }`}
            aria-label="Show recently viewed"
            aria-pressed={showRecent}
          >
            <Clock className="w-4 h-4" />
            Recent
          </button>
          {compareList.length > 0 && (
            <Link
              href={`/exercise-compare?ids=${compareList.join(",")}`}
              className="px-4 py-3 rounded-xl border border-green-500/30 bg-green-500/10 text-green-400 transition-all flex items-center gap-2 text-sm font-medium hover:bg-green-500/20"
            >
              <GitCompare className="w-4 h-4" />
              Compare ({compareList.length})
            </Link>
          )}
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            className="glass rounded-2xl p-6 mb-8 space-y-5 border border-white/10"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-white font-semibold">Filters</h3>
              <button
                onClick={() => { setCategoryFilter("All"); setDifficulty("All"); setMuscleFilter("All"); setEquipment("All Equipment"); setShowFavoritesOnly(false); }}
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                Clear all
              </button>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-2">Category</p>
              <div className="flex flex-wrap gap-2">
                {derivedCategories.map((c) => (
                  <button
                    key={c}
                    onClick={() => setCategoryFilter(c)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                      categoryFilter === c
                        ? "bg-[#DC2626] text-white"
                        : "bg-white/5 text-gray-400 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-2">Difficulty</p>
              <div className="flex flex-wrap gap-2">
                {DIFFICULTIES.map((d) => (
                  <button
                    key={d}
                    onClick={() => setDifficulty(d)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                      difficulty === d
                        ? "bg-[#DC2626] text-white"
                        : "bg-white/5 text-gray-400 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-2">Target Muscle</p>
              <select
                value={muscleFilter}
                onChange={(e) => setMuscleFilter(e.target.value)}
                className="w-full px-4 py-2 rounded-xl bg-black/50 border border-white/10 text-white text-sm focus:border-[#DC2626] focus:outline-none"
                aria-label="Filter by muscle"
              >
                {derivedMuscles.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-2">Equipment</p>
              <select
                value={equipment}
                onChange={(e) => setEquipment(e.target.value)}
                className="w-full px-4 py-2 rounded-xl bg-black/50 border border-white/10 text-white text-sm focus:border-[#DC2626] focus:outline-none"
                aria-label="Filter by equipment"
              >
                {equipmentSet.map((e) => (
                  <option key={e} value={e}>{e}</option>
                ))}
              </select>
            </div>
          </motion.div>
        )}

        {/* Recent View */}
        {showRecent && recentExercises.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10"
          >
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-400" />
              Recently Viewed
            </h2>
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
              {recentExercises.map((ex) => (
                <Link
                  key={ex.id}
                  href={`/exercise/${ex.slug}`}
                  onClick={() => addRecent(ex.id)}
                  className="flex-shrink-0 glass rounded-xl p-3 hover:border-white/20 transition-all min-w-[140px]"
                >
                  <p className="text-sm font-medium text-white truncate">{ex.name}</p>
                  <p className="text-xs text-gray-500">{ex.category}</p>
                </Link>
              ))}
            </div>
          </motion.div>
        )}

        {/* Compare Selection Bar */}
        {compareList.length > 0 && (
          <div className="glass rounded-xl p-3 mb-6 flex items-center gap-3 flex-wrap border border-green-500/20">
            <GitCompare className="w-4 h-4 text-green-400" />
            <span className="text-sm text-gray-300">Compare: {compareList.length}/4 selected</span>
            {compareList.map((id) => {
              const ex = initialExercises.find((e) => e.id === id);
              return (
                <span key={id} className="inline-flex items-center gap-1 px-2 py-1 bg-white/5 rounded-full text-xs text-white">
                  {ex?.name}
                  <button onClick={() => toggleCompare(id)} className="text-gray-500 hover:text-white ml-1" aria-label={`Remove ${ex?.name || "item"} from comparison`}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              );
            })}
            <button
              onClick={() => setCompareList([])}
              className="ml-auto text-xs text-gray-500 hover:text-white transition-colors"
              aria-label="Clear comparison list"
            >
              Clear
            </button>
          </div>
        )}

        {/* Exercise Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {filtered.length === 0 ? (
            <div className="col-span-full text-center py-20">
              <Dumbbell className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-500 text-lg mb-2">No exercises found</p>
              <p className="text-gray-600 text-sm">Try adjusting your search or filters</p>
            </div>
          ) : (
            filtered.map((exercise) => (
              <motion.div
                key={exercise.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className="glass rounded-2xl overflow-hidden hover:border-[#DC2626]/30 transition-all duration-300 border border-white/5 group"
              >
                {/* Thumbnail */}
                <Link href={`/exercise/${exercise.slug}`} onClick={() => addRecent(exercise.id)}>
                  <div className="aspect-[16/9] bg-gradient-to-br from-gray-900 to-black relative overflow-hidden">
                    {(() => {
                      const imgSrc = exercise.thumbnail_url || exercise.primary_image_url || 
                        (exercise.images?.[0] ? `${EXERCISE_IMAGE_BASE}/${exercise.images[0]}` : null);
                      return imgSrc ? (
                        <Image
                          src={imgSrc}
                          alt={exercise.name}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Dumbbell className="w-10 h-10 text-white/10" />
                        </div>
                      );
                    })()}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    {/* Favorite Toggle */}
                    <button
                      onClick={(e) => { e.preventDefault(); toggleFavorite(exercise.id); }}
                      className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center hover:bg-black/60 transition-colors z-10"
                      aria-label={favorites.includes(exercise.id) ? "Remove from favorites" : "Add to favorites"}
                    >
                      <Heart
                        className={`w-4 h-4 ${favorites.includes(exercise.id) ? "fill-red-500 text-red-500" : "text-white/60"}`}
                      />
                    </button>
                    {/* Compare Toggle */}
                    <button
                      onClick={(e) => { e.preventDefault(); toggleCompare(exercise.id); }}
                      className={`absolute top-2 left-2 w-8 h-8 rounded-full backdrop-blur-sm flex items-center justify-center transition-colors z-10 ${
                        compareList.includes(exercise.id)
                          ? "bg-green-500/30 text-green-400"
                          : "bg-black/40 text-white/60 hover:bg-black/60"
                      }`}
                      aria-label={compareList.includes(exercise.id) ? "Remove from comparison" : "Add to comparison"}
                    >
                      <GitCompare className="w-3.5 h-3.5" />
                    </button>
                    {/* Difficulty badge */}
                    <span
                      className={`absolute bottom-2 left-2 px-2 py-0.5 text-[10px] font-semibold rounded-full border ${getDifficultyColor(exercise.difficulty)} bg-black/40 backdrop-blur-sm`}
                    >
                      {exercise.difficulty}
                    </span>
                    {/* Category badge */}
                    <span className="absolute bottom-2 right-2 px-2 py-0.5 text-[10px] font-medium rounded-full bg-white/10 text-gray-300 backdrop-blur-sm">
                      {exercise.category}
                    </span>
                  </div>
                </Link>
                <div className="p-4">
                  <Link href={`/exercise/${exercise.slug}`} onClick={() => addRecent(exercise.id)}>
                    <h3 className="font-bold text-white mb-1 truncate group-hover:text-[#DC2626] transition-colors">
                      {exercise.name}
                    </h3>
                  </Link>
                  <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                    <Dumbbell className="w-3 h-3" />
                    {exercise.equipment_label || "Bodyweight"}
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {(exercise.target_muscles || []).slice(0, 2).map((m, i) => (
                      <span key={i} className="px-2 py-0.5 bg-white/5 text-gray-400 rounded-full text-[10px]">
                        {m}
                      </span>
                    ))}
                    {(exercise.target_muscles?.length ?? 0) > 2 && (
                      <span className="px-2 py-0.5 text-gray-500 text-[10px]">
                        +{exercise.target_muscles!.length - 2}
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </motion.div>
      </div>
    </div>
  );
}
