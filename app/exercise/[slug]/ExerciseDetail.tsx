/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  AlertTriangle,
  Shield,
  Dumbbell,
  Target,
  Layers,
  Repeat,
  ArrowUp,
  ArrowDown,
  Sparkles,
  Wind,
  BookOpen,
  Play,
  Info,
  Share2,
  Zap,
} from "lucide-react";
import { getDifficultyColor } from "@/lib/utils";
import type { Exercise } from "@/types";

function Section({ title, icon, children, color = "text-[#DC2626]" }: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  color?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="glass rounded-2xl p-6 sm:p-8 hover:border-[#DC2626]/30 transition-all duration-300"
    >
      <div className="flex items-center gap-3 mb-5">
        <div className={`w-10 h-10 rounded-xl bg-[#DC2626]/10 flex items-center justify-center ${color}`}>
          {icon}
        </div>
        <h2 className="text-xl font-bold text-white">{title}</h2>
      </div>
      {children}
    </motion.div>
  );
}

function ListSection({ items, empty }: { items: string[]; empty?: string }) {
  if (!items || items.length === 0) {
    if (empty) return <p className="text-gray-500 text-sm">{empty}</p>;
    return null;
  }
  return (
    <ul className="space-y-2">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-3 text-gray-300">
          <span className="text-[#DC2626] mt-1 flex-shrink-0">•</span>
          {item}
        </li>
      ))}
    </ul>
  );
}

export default function ExerciseDetail({
  exercise,
  instructions = [],
  relatedExercises = [],
}: {
  exercise: Exercise;
  instructions?: string[];
  relatedExercises?: Exercise[];
}) {
  const mediaUrl = exercise.video_url || exercise.gif_url || exercise.thumbnail_url || exercise.primary_image_url;
  const hasBreathing = exercise.breathing && exercise.breathing.length > 0;
  const hasVariations = exercise.variations && exercise.variations.length > 0;
  const hasAlternatives = exercise.alternatives && exercise.alternatives.length > 0;
  const hasProgressions = exercise.progressions && exercise.progressions.length > 0;
  const hasRegressions = exercise.regressions && exercise.regressions.length > 0;
  const hasBeginnerTips = exercise.beginner_tips && exercise.beginner_tips.length > 0;
  const hasSecondary = exercise.secondary_muscles && exercise.secondary_muscles.length > 0;

  const [copied, setCopied] = useState(false);
  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try { await navigator.share({ title: exercise.name, url }); } catch {}
    } else {
      try {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {}
    }
  };

  return (
    <div className="min-h-screen bg-black pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <Link
          href="/exercises"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8 group"
          aria-label="Back to exercises"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" aria-hidden="true" />
          Back to Exercises
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="flex flex-wrap items-center gap-4 mb-4">
            <span className="text-sm text-gray-500">{exercise.category}</span>
            <span
              className={`px-4 py-1 text-sm font-semibold rounded-full border ${getDifficultyColor(exercise.difficulty)}`}
            >
              {exercise.difficulty}
            </span>
          </div>

          <div className="flex items-start justify-between gap-4 mb-6">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold">
              {exercise.name}
            </h1>
            <button
              onClick={handleShare}
              className="flex-shrink-0 p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all group mt-2"
              aria-label={copied ? "Link copied" : "Share exercise"}
            >
              {copied ? (
                <span className="text-xs text-green-400 font-medium">Copied!</span>
              ) : (
                <Share2 className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
              )}
            </button>
          </div>

          {/* Media Section */}
          {mediaUrl && (
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden mb-10 border border-white/10 bg-gray-900 group">
              {exercise.video_url ? (
                <video
                  src={exercise.video_url}
                  controls
                  className="w-full h-full object-cover"
                  aria-label={`${exercise.name} demonstration video`}
                >
                  Your browser does not support the video tag.
                </video>
              ) : (
                <img
                  src={mediaUrl}
                  alt={exercise.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                />
              )}
              {exercise.video_url ? (
                <div className="absolute top-3 left-3 px-3 py-1 bg-black/60 backdrop-blur-sm rounded-full text-xs text-white flex items-center gap-1.5">
                  <Play className="w-3 h-3" />
                  Video
                </div>
              ) : exercise.gif_url ? (
                <div className="absolute top-3 left-3 px-3 py-1 bg-black/60 backdrop-blur-sm rounded-full text-xs text-white flex items-center gap-1.5">
                  <Play className="w-3 h-3" />
                  GIF
                </div>
              ) : null}
            </div>
          )}

          {/* Info Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            <div className="glass rounded-xl p-4 flex items-center gap-3">
              <Dumbbell className="w-5 h-5 text-[#DC2626] flex-shrink-0" />
              <div>
                <p className="text-xs text-gray-500">Equipment</p>
                <p className="text-sm text-white font-medium">{exercise.equipment_label || "Bodyweight"}</p>
              </div>
            </div>
            <div className="glass rounded-xl p-4 flex items-center gap-3">
              <Target className="w-5 h-5 text-[#DC2626] flex-shrink-0" />
              <div>
                <p className="text-xs text-gray-500">Target Muscles</p>
                <p className="text-sm text-white font-medium">
                  {exercise.target_muscles?.slice(0, 2).join(", ") || "—"}
                  {(exercise.target_muscles?.length ?? 0) > 2 && " + more"}
                </p>
              </div>
            </div>
            <div className="glass rounded-xl p-4 flex items-center gap-3">
              <Layers className="w-5 h-5 text-[#DC2626] flex-shrink-0" />
              <div>
                <p className="text-xs text-gray-500">Category</p>
                <p className="text-sm text-white font-medium">{exercise.category}</p>
              </div>
            </div>
            <div className="glass rounded-xl p-4 flex items-center gap-3">
              <Info className="w-5 h-5 text-[#DC2626] flex-shrink-0" />
              <div>
                <p className="text-xs text-gray-500">Muscle Group</p>
                <p className="text-sm text-white font-medium">{exercise.muscle_group || "—"}</p>
              </div>
            </div>
          </div>

          <div className="space-y-6 mb-12">
            {/* Target Muscles (detailed) */}
            <Section title="Target Muscles" icon={<Target className="w-5 h-5" />}>
              <div className="flex flex-wrap gap-2">
                {(exercise.target_muscles || []).map((muscle, i) => (
                  <span
                    key={i}
                    className="px-3 py-1.5 bg-white/10 text-gray-200 rounded-full text-sm font-medium"
                  >
                    {muscle}
                  </span>
                ))}
              </div>
              {hasSecondary && (
                <div className="mt-4">
                  <p className="text-sm text-gray-400 mb-2">Secondary Muscles</p>
                  <div className="flex flex-wrap gap-2">
                    {exercise.secondary_muscles.map((muscle, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-white/5 text-gray-400 rounded-full text-sm"
                      >
                        {muscle}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </Section>

            {/* Instructions */}
            {instructions.length > 0 && (
              <Section title="Step-by-Step Instructions" icon={<BookOpen className="w-5 h-5" />}>
                <ol className="space-y-4">
                  {instructions.map((step, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: index * 0.08 }}
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
              </Section>
            )}

            {/* Breathing */}
            {hasBreathing && (
              <Section title="Breathing" icon={<Wind className="w-5 h-5" />}>
                <p className="text-gray-300">{exercise.breathing}</p>
              </Section>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Common Mistakes */}
              {(exercise.common_mistakes || []).length > 0 && (
                <Section
                  title="Common Mistakes"
                  icon={<AlertTriangle className="w-5 h-5 text-yellow-400" />}
                  color="text-yellow-400"
                >
                  <ListSection items={exercise.common_mistakes} />
                </Section>
              )}

              {/* Safety Tips */}
              {(exercise.safety_tips || []).length > 0 && (
                <Section
                  title="Safety Tips"
                  icon={<Shield className="w-5 h-5" />}
                >
                  <ListSection items={exercise.safety_tips} />
                </Section>
              )}
            </div>

            {/* Variations, Alternatives, Progressions, Regressions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {hasVariations && (
                <Section title="Variations" icon={<Repeat className="w-5 h-5" />}>
                  <ListSection items={exercise.variations} />
                </Section>
              )}
              {hasAlternatives && (
                <Section title="Alternatives" icon={<Dumbbell className="w-5 h-5" />}>
                  <ListSection items={exercise.alternatives} />
                </Section>
              )}
              {hasProgressions && (
                <Section title="Progressions" icon={<ArrowUp className="w-5 h-5" />}>
                  <ListSection items={exercise.progressions} />
                </Section>
              )}
              {hasRegressions && (
                <Section title="Regressions" icon={<ArrowDown className="w-5 h-5" />}>
                  <ListSection items={exercise.regressions} />
                </Section>
              )}
            </div>

            {/* Beginner Tips */}
            {hasBeginnerTips && (
              <Section title="Beginner Tips" icon={<Sparkles className="w-5 h-5" />}>
                <ListSection items={exercise.beginner_tips} />
              </Section>
            )}

            {exercise.pro_tips && exercise.pro_tips.length > 0 && (
              <Section title="Pro Tips" icon={<Zap className="w-5 h-5" />}>
                <ul className="space-y-2">
                  {exercise.pro_tips.map((tip, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#DC2626] mt-2 flex-shrink-0" />
                      {tip}
                    </li>
                  ))}
                </ul>
              </Section>
            )}
          </div>

          {/* Related Exercises */}
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
                    <p className="text-gray-400 text-sm mb-4">{related.equipment_label || "Bodyweight"}</p>
                    <Link
                      href={`/exercise/${related.slug}`}
                      className="inline-flex items-center gap-2 text-[#DC2626] font-semibold hover:text-white transition-colors duration-300"
                      aria-label={`View ${related.name}`}
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
