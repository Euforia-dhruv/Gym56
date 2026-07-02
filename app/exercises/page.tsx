'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { categories, exercises, Category } from '@/lib/siteData';

export default function ExerciseLibrary() {
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');

  const filteredExercises = selectedCategory === 'All'
    ? exercises
    : exercises.filter(exercise => exercise.category === selectedCategory);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { duration: 0.5 } }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'Intermediate': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'Advanced': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

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
            Browse our complete collection of exercises with detailed instructions
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          <button
            onClick={() => setSelectedCategory('All')}
            className={`px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
              selectedCategory === 'All'
                ? 'bg-[#DC2626] text-white shadow-lg shadow-[#DC2626]/30'
                : 'glass text-gray-300 hover:text-white hover:border-white/30'
            }`}
          >
            All
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                selectedCategory === category
                  ? 'bg-[#DC2626] text-white shadow-lg shadow-[#DC2626]/30'
                  : 'glass text-gray-300 hover:text-white hover:border-white/30'
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
          {filteredExercises.map((exercise) => (
            <motion.div
              key={exercise.id}
              variants={item}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="glass rounded-2xl p-6 hover:border-white/20 transition-all duration-300"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex flex-col gap-1">
                  <span className="text-sm text-gray-400">{exercise.category}</span>
                  <h3 className="text-xl font-bold text-white">{exercise.name}</h3>
                </div>
                <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${getDifficultyColor(exercise.difficulty)}`}>
                  {exercise.difficulty}
                </span>
              </div>
              <div className="mb-4 text-sm text-gray-300">
                <p className="mb-1">
                  <span className="text-gray-500">Equipment:</span> {exercise.equipment}
                </p>
                <p>
                  <span className="text-gray-500">Target:</span> {exercise.targetMuscles.join(', ')}
                </p>
              </div>
              <Link
                href={`/exercise/${exercise.slug}`}
                className="inline-flex items-center gap-2 text-[#DC2626] font-semibold hover:text-white transition-colors duration-300"
              >
                View Details
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
