'use client';

import { useParams, notFound } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Video, AlertTriangle, Shield, Dumbbell } from 'lucide-react';
import { exercises } from '@/lib/siteData';

export default function ExerciseDetail() {
  const params = useParams();
  const slug = params.slug as string;
  const exercise = exercises.find(ex => ex.slug === slug);

  if (!exercise) {
    notFound();
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'Intermediate': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'Advanced': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const relatedExercises = exercises.filter(ex =>
    exercise.relatedExercises.includes(ex.slug)
  );

  return (
    <div className="min-h-screen bg-black pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <Link
          href="/exercises"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="w-5 h-5" aria-hidden="true" />
          Back to Exercises
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <span className="text-sm text-gray-500">{exercise.category}</span>
            <span className={`px-4 py-1 text-sm font-semibold rounded-full border ${getDifficultyColor(exercise.difficulty)}`}>
              {exercise.difficulty}
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-8">
            {exercise.name}
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="glass rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Dumbbell className="w-6 h-6 text-[#DC2626]" aria-hidden="true" />
                <h2 className="font-bold text-white">Equipment</h2>
              </div>
              <p className="text-gray-300">{exercise.equipment}</p>
            </div>
            <div className="glass rounded-2xl p-6 md:col-span-2">
              <h2 className="font-bold text-white mb-4">Target Muscles</h2>
              <div className="flex flex-wrap gap-2">
                {exercise.targetMuscles.map((muscle, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-white/10 text-gray-300 rounded-full text-sm"
                  >
                    {muscle}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="glass rounded-2xl p-8 mb-12">
            <div className="flex items-center gap-3 mb-6">
              <Video className="w-6 h-6 text-[#DC2626]" aria-hidden="true" />
              <h2 className="text-2xl font-bold text-white">Demo Video</h2>
            </div>
            <div
              className="aspect-video bg-white/5 rounded-xl flex items-center justify-center border border-dashed border-white/20"
              role="img"
              aria-label="Demo video coming soon"
            >
              <p className="text-gray-500">Video coming soon</p>
            </div>
          </div>

          <div className="glass rounded-2xl p-8 mb-12">
            <h2 className="text-2xl font-bold text-white mb-6">Instructions</h2>
            <ol className="space-y-4">
              {exercise.instructions.map((step, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex gap-4"
                >
                  <span
                    className="flex-shrink-0 w-8 h-8 bg-[#DC2626] text-white rounded-full flex items-center justify-center font-bold text-sm"
                    aria-hidden="true"
                  >
                    {index + 1}
                  </span>
                  <p className="text-gray-300 pt-1">{step}</p>
                </motion.li>
              ))}
            </ol>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="glass rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <AlertTriangle className="w-6 h-6 text-yellow-400" aria-hidden="true" />
                <h2 className="text-2xl font-bold text-white">Common Mistakes</h2>
              </div>
              <ul className="space-y-3">
                {exercise.commonMistakes.map((mistake, index) => (
                  <li key={index} className="flex items-start gap-3 text-gray-300">
                    <span className="text-yellow-400 mt-1" aria-hidden="true">•</span>
                    {mistake}
                  </li>
                ))}
              </ul>
            </div>

            <div className="glass rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <Shield className="w-6 h-6 text-[#DC2626]" aria-hidden="true" />
                <h2 className="text-2xl font-bold text-white">Safety Tips</h2>
              </div>
              <ul className="space-y-3">
                {exercise.safetyTips.map((tip, index) => (
                  <li key={index} className="flex items-start gap-3 text-gray-300">
                    <span className="text-[#DC2626] mt-1" aria-hidden="true">•</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {relatedExercises.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">Related Exercises</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedExercises.map((related) => (
                  <motion.div
                    key={related.id}
                    whileHover={{ y: -8, transition: { duration: 0.3 } }}
                    className="glass rounded-2xl p-6 hover:border-white/20 transition-all duration-300"
                  >
                    <h3 className="text-xl font-bold text-white mb-2">{related.name}</h3>
                    <p className="text-gray-400 text-sm mb-4">{related.equipment}</p>
                    <Link
                      href={`/exercise/${related.slug}`}
                      className="inline-flex items-center gap-2 text-[#DC2626] font-semibold hover:text-white transition-colors duration-300"
                    >
                      View
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
