"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Dumbbell,
  MapPin,
  CheckCircle,
  XCircle,
  Shield,
  BookOpen,
  ChevronRight,
  AlertTriangle,
  Wrench,
  Target,
  BarChart3,
  ImageIcon,
  Layers,
} from "lucide-react";
import { getConditionColor, getDifficultyColor } from "@/lib/utils";
import type { Equipment, Exercise } from "@/types";

interface EquipmentImage {
  id: string;
  url: string;
  alt_text: string | null;
  is_primary: boolean;
}

export default function EquipmentDetail({
  equipment,
  equipmentExercises,
  related,
  images = [],
}: {
  equipment: Equipment;
  equipmentExercises: Pick<Exercise, "id" | "name" | "slug" | "category" | "difficulty">[];
  related: Equipment[];
  images?: EquipmentImage[];
}) {
  const [selectedImage, setSelectedImage] = useState(images.find((i) => i.is_primary)?.url || equipment.primary_image_url || images[0]?.url || null);
  const allImages = images.length > 0 ? images.map((i) => i.url) : (equipment.primary_image_url ? [equipment.primary_image_url] : []);

  const muscles = equipment.muscles_trained?.length > 0
    ? equipment.muscles_trained
    : [...new Set(equipmentExercises.flatMap((ex) => (ex as Exercise).target_muscles || []))];

  const difficulty = equipment.difficulty !== "All Levels"
    ? equipment.difficulty
    : null;

  return (
    <div className="min-h-screen bg-black pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <Link
          href="/equipment"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6 group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" aria-hidden="true" />
          Back to Equipment
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="text-sm text-gray-500">{equipment.category}</span>
            <span
              className={`px-4 py-1 text-sm font-semibold rounded-full border ${getConditionColor(equipment.condition as "excellent" | "good" | "fair" | "maintenance" | "retired")}`}
            >
              {equipment.condition.charAt(0).toUpperCase() + equipment.condition.slice(1)}
            </span>
            {difficulty && (
              <span className={`px-4 py-1 text-sm font-semibold rounded-full border ${getDifficultyColor(difficulty)}`}>
                {difficulty}
              </span>
            )}
            {equipment.is_available ? (
              <span className="inline-flex items-center gap-1.5 text-sm text-green-400">
                <CheckCircle className="w-4 h-4" aria-hidden="true" />
                Available
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-sm text-red-400">
                <XCircle className="w-4 h-4" aria-hidden="true" />
                Under Maintenance
              </span>
            )}
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-8">
            {equipment.name}
          </h1>

          {/* Image Gallery */}
          {allImages.length > 0 && (
            <div className="mb-10">
              <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/10 bg-gray-900 group mb-3">
                {selectedImage ? (
                  <img
                    src={selectedImage}
                    alt={equipment.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="w-16 h-16 text-white/10" />
                  </div>
                )}
              </div>
              {allImages.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {allImages.map((url, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedImage(url)}
                      className={`flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                        selectedImage === url ? "border-[#DC2626] opacity-100" : "border-white/10 opacity-60 hover:opacity-100"
                      }`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={url} alt={`${equipment.name} ${i + 1}`} className="w-full h-full object-cover" loading="lazy" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Quick Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
            <div className="glass rounded-xl p-4 flex items-center gap-3">
              <Layers className="w-5 h-5 text-[#DC2626]" />
              <div>
                <p className="text-xs text-gray-500">Quantity</p>
                <p className="text-lg font-bold text-white">{equipment.quantity}</p>
              </div>
            </div>
            <div className="glass rounded-xl p-4 flex items-center gap-3">
              <MapPin className="w-5 h-5 text-[#DC2626]" />
              <div>
                <p className="text-xs text-gray-500">Location</p>
                <p className="text-lg font-bold text-white">{equipment.location || "Gym Floor"}</p>
              </div>
            </div>
            <div className="glass rounded-xl p-4 flex items-center gap-3">
              <BarChart3 className="w-5 h-5 text-[#DC2626]" />
              <div>
                <p className="text-xs text-gray-500">Exercises</p>
                <p className="text-lg font-bold text-white">{equipmentExercises.length}</p>
              </div>
            </div>
            <div className="glass rounded-xl p-4 flex items-center gap-3">
              <Target className="w-5 h-5 text-[#DC2626]" />
              <div>
                <p className="text-xs text-gray-500">Muscles</p>
                <p className="text-lg font-bold text-white">{muscles.length}</p>
              </div>
            </div>
          </div>

          {/* Description */}
          {equipment.description && (
            <div className="glass rounded-2xl p-6 sm:p-8 mb-6">
              <h2 className="text-xl font-bold text-white mb-4">About This Equipment</h2>
              <p className="text-gray-300 leading-relaxed text-lg">{equipment.description}</p>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Muscles Trained */}
            {muscles.length > 0 && (
              <div className="glass rounded-2xl p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-5">
                  <Target className="w-6 h-6 text-[#DC2626]" />
                  <h2 className="text-xl font-bold text-white">Muscles Trained</h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  {muscles.map((m, i) => (
                    <span key={i} className="px-3 py-1.5 bg-white/10 text-gray-200 rounded-full text-sm font-medium">
                      {m}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Difficulty & Availability */}
            <div className="glass rounded-2xl p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-5">
                <BarChart3 className="w-6 h-6 text-[#DC2626]" />
                <h2 className="text-xl font-bold text-white">Details</h2>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-white/10 pb-3">
                  <span className="text-gray-400">Difficulty Level</span>
                  <span className="text-white font-medium">{difficulty || "All Levels"}</span>
                </div>
                <div className="flex justify-between items-center border-b border-white/10 pb-3">
                  <span className="text-gray-400">Condition</span>
                  <span className="text-white font-medium capitalize">{equipment.condition}</span>
                </div>
                <div className="flex justify-between items-center border-b border-white/10 pb-3">
                  <span className="text-gray-400">Availability</span>
                  <span className={equipment.is_available ? "text-green-400 font-medium" : "text-red-400 font-medium"}>
                    {equipment.is_available ? "Available" : "Under Maintenance"}
                  </span>
                </div>
                <div className="flex justify-between items-center border-b border-white/10 pb-3">
                  <span className="text-gray-400">Quantity</span>
                  <span className="text-white font-medium">{equipment.quantity}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Location</span>
                  <span className="text-white font-medium">{equipment.location || "Gym Floor"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* How to Use / Instructions */}
          {(equipment.instructions?.length > 0 || equipment.how_to_use?.length > 0) && (
            <div className="glass rounded-2xl p-6 sm:p-8 mb-6">
              <div className="flex items-center gap-3 mb-6">
                <BookOpen className="w-6 h-6 text-[#DC2626]" />
                <h2 className="text-xl font-bold text-white">How to Use</h2>
              </div>
              <ol className="space-y-4">
                {(equipment.instructions?.length > 0 ? equipment.instructions : equipment.how_to_use).map((step, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.08 }}
                    className="flex gap-4"
                  >
                    <span className="flex-shrink-0 w-8 h-8 bg-[#DC2626] text-white rounded-full flex items-center justify-center font-bold text-sm" aria-hidden="true">
                      {index + 1}
                    </span>
                    <p className="text-gray-300 pt-1">{step}</p>
                  </motion.li>
                ))}
              </ol>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Safety Tips */}
            {equipment.safety_tips?.length > 0 && (
              <div className="glass rounded-2xl p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-5">
                  <Shield className="w-6 h-6 text-yellow-400" />
                  <h2 className="text-xl font-bold text-white">Safety Tips</h2>
                </div>
                <ul className="space-y-3">
                  {equipment.safety_tips.map((tip, i) => (
                    <li key={i} className="flex items-start gap-3 text-gray-300">
                      <span className="text-yellow-400 mt-1 flex-shrink-0">•</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Common Mistakes */}
            {equipment.common_mistakes?.length > 0 && (
              <div className="glass rounded-2xl p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-5">
                  <AlertTriangle className="w-6 h-6 text-red-400" />
                  <h2 className="text-xl font-bold text-white">Common Mistakes</h2>
                </div>
                <ul className="space-y-3">
                  {equipment.common_mistakes.map((m, i) => (
                    <li key={i} className="flex items-start gap-3 text-gray-300">
                      <span className="text-red-400 mt-1 flex-shrink-0">•</span>
                      <span>{m}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Maintenance Tips */}
          {equipment.maintenance_tips?.length > 0 && (
            <div className="glass rounded-2xl p-6 sm:p-8 mb-6">
              <div className="flex items-center gap-3 mb-5">
                <Wrench className="w-6 h-6 text-blue-400" />
                <h2 className="text-xl font-bold text-white">Maintenance Tips</h2>
              </div>
              <ul className="space-y-3">
                {equipment.maintenance_tips.map((tip, i) => (
                  <li key={i} className="flex items-start gap-3 text-gray-300">
                    <span className="text-blue-400 mt-1 flex-shrink-0">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Exercises Using This Equipment */}
          {equipmentExercises.length > 0 && (
            <div className="glass rounded-2xl p-6 sm:p-8 mb-6">
              <div className="flex items-center gap-3 mb-6">
                <Dumbbell className="w-6 h-6 text-[#DC2626]" />
                <h2 className="text-xl font-bold text-white">
                  Exercises Using This Equipment
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {equipmentExercises.map((ex) => (
                  <Link
                    key={ex.id}
                    href={`/exercise/${ex.slug}`}
                    className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 transition-all group"
                  >
                    <div className="min-w-0">
                      <p className="font-semibold text-white text-sm group-hover:text-[#DC2626] transition-colors truncate">
                        {ex.name}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-gray-500">{ex.category}</span>
                        {ex.difficulty && (
                          <span className={`text-[10px] px-1.5 py-0.5 rounded-full border ${getDifficultyColor(ex.difficulty)}`}>
                            {ex.difficulty}
                          </span>
                        )}
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-[#DC2626] group-hover:translate-x-0.5 transition-all flex-shrink-0" aria-hidden="true" />
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Related Equipment */}
          {related.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">Related Equipment</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {related.map((eq) => (
                  <motion.div
                    key={eq.id}
                    whileHover={{ y: -8, transition: { duration: 0.3 } }}
                    className="glass rounded-2xl p-6 hover:border-white/20 transition-all duration-300"
                  >
                    <span className="text-sm text-gray-500">{eq.category}</span>
                    <h3 className="text-xl font-bold text-white mb-2 mt-1">{eq.name}</h3>
                    {eq.description && (
                      <p className="text-gray-400 text-sm mb-4 line-clamp-2">{eq.description}</p>
                    )}
                    <Link
                      href={`/equipment/${eq.slug}`}
                      className="inline-flex items-center gap-2 text-[#DC2626] font-semibold hover:text-white transition-colors duration-300"
                    >
                      View Details
                      <ChevronRight className="w-4 h-4" aria-hidden="true" />
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
