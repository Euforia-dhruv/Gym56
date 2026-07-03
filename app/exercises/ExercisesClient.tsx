"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { getDifficultyColor } from "@/lib/utils";
import { staggerContainer as container, fadeUpSmall as item } from "@/lib/animations";

const CATEGORIES = ["All", "Chest", "Back", "Shoulders", "Legs", "Arms", "Core", "Cardio", "Glutes", "Obliques", "Abs"] as const;

interface ExerciseData {
  id: string;
  name: string;
  slug: string;
  category: string;
  difficulty: string;
  equipment_label: string | null;
  target_muscles: string[];
}

export default function ExercisesClient({
  initialExercises,
}: {
  initialExercises: ExerciseData[];
}) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const filteredExercises =
    selectedCategory === "All"
      ? initialExercises
      : initialExercises.filter((ex) => ex.category === selectedCategory);

  return (
    <div className="min-h-screen bg-black pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4">
            Exercise <span className="text-[#DC2626]">Library</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Browse our complete collection of exercises with detailed
            instructions
          </p>
        </motion.div>

        {/* Category filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          role="group"
          aria-label="Filter exercises by category"
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          <button
            onClick={() => setSelectedCategory("All")}
            aria-pressed={selectedCategory === "All"}
            className={`px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
              selectedCategory === "All"
                ? "bg-[#DC2626] text-white shadow-lg shadow-[#DC2626]/30"
                : "glass text-gray-300 hover:text-white hover:border-white/30"
            }`}
          >
            All
          </button>
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              aria-pressed={selectedCategory === category}
              className={`px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                selectedCategory === category
                  ? "bg-[#DC2626] text-white shadow-lg shadow-[#DC2626]/30"
                  : "glass text-gray-300 hover:text-white hover:border-white/30"
              }`}
            >
              {category}
            </button>
          ))}
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {filteredExercises.length === 0 ? (
            <div className="col-span-full text-center py-20">
              <p className="text-gray-500 text-lg">No exercises found in this category</p>
            </div>
          ) : (
            filteredExercises.map((exercise) => (
              <motion.div
                key={exercise.id}
                variants={item}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
                className="glass rounded-2xl p-6 hover:border-white/20 transition-all duration-300"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-sm text-gray-400">
                      {exercise.category}
                    </span>
                    <h3 className="text-xl font-bold text-white">
                      {exercise.name}
                    </h3>
                  </div>
                  <span
                    className={`px-3 py-1 text-xs font-semibold rounded-full border ${getDifficultyColor(exercise.difficulty)}`}
                  >
                    {exercise.difficulty}
                  </span>
                </div>
                <div className="mb-4 text-sm text-gray-300">
                  <p className="mb-1">
                    <span className="text-gray-500">Equipment:</span>{" "}
                    {exercise.equipment_label || "Bodyweight"}
                  </p>
                  <p>
                    <span className="text-gray-500">Target:</span>{" "}
                    {exercise.target_muscles?.join(", ") || "—"}
                  </p>
                </div>
                <Link
                  href={`/exercise/${exercise.slug}`}
                  className="inline-flex items-center gap-2 text-[#DC2626] font-semibold hover:text-white transition-colors duration-300"
                >
                  View Details
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Link>
              </motion.div>
            ))
          )}
        </motion.div>
      </div>
    </div>
  );
}
