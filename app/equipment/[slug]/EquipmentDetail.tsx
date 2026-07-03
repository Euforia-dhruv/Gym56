"use client";

import { useParams, notFound } from "next/navigation";
import Link from "next/link";
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
} from "lucide-react";
import { equipmentList, exercises } from "@/lib/siteData";

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

export default function EquipmentDetail() {
  const params = useParams();
  const slug = params.slug as string;
  const equipment = equipmentList.find((eq) => eq.slug === slug);

  if (!equipment) {
    notFound();
  }

  // Find exercises that use this equipment
  const equipmentExercises = exercises.filter((ex) =>
    equipment.exercisesUsing.includes(ex.slug)
  );

  // Find related equipment
  const related = equipmentList.filter((eq) =>
    equipment.relatedEquipment.includes(eq.slug)
  );

  return (
    <div className="min-h-screen bg-black pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Back link */}
        <Link
          href="/equipment"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8 group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" aria-hidden="true" />
          Back to Equipment
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header badges */}
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="text-sm text-gray-500">{equipment.category}</span>
            <span
              className={`px-4 py-1 text-sm font-semibold rounded-full border ${getConditionColor(equipment.condition)}`}
            >
              {equipment.condition.charAt(0).toUpperCase() + equipment.condition.slice(1)}
            </span>
            {equipment.isAvailable ? (
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

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-8">
            {equipment.name}
          </h1>

          {/* Quick info cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
            <div className="glass rounded-2xl p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#DC2626]/10 flex items-center justify-center flex-shrink-0">
                <Dumbbell className="w-6 h-6 text-[#DC2626]" aria-hidden="true" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Quantity</p>
                <p className="text-xl font-bold text-white">{equipment.quantity}</p>
              </div>
            </div>
            <div className="glass rounded-2xl p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#DC2626]/10 flex items-center justify-center flex-shrink-0">
                <MapPin className="w-6 h-6 text-[#DC2626]" aria-hidden="true" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Location</p>
                <p className="text-xl font-bold text-white">{equipment.location}</p>
              </div>
            </div>
            <div className="glass rounded-2xl p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#DC2626]/10 flex items-center justify-center flex-shrink-0">
                <BookOpen className="w-6 h-6 text-[#DC2626]" aria-hidden="true" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Exercises</p>
                <p className="text-xl font-bold text-white">{equipmentExercises.length}</p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="glass rounded-2xl p-8 mb-10">
            <h2 className="text-2xl font-bold text-white mb-4">About This Equipment</h2>
            <p className="text-gray-300 leading-relaxed text-lg">
              {equipment.description}
            </p>
          </div>

          {/* How to Use */}
          <div className="glass rounded-2xl p-8 mb-10">
            <div className="flex items-center gap-3 mb-6">
              <BookOpen className="w-6 h-6 text-[#DC2626]" aria-hidden="true" />
              <h2 className="text-2xl font-bold text-white">How to Use</h2>
            </div>
            <ol className="space-y-4">
              {equipment.howToUse.map((step, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
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
          </div>

          {/* Safety Tips */}
          <div className="glass rounded-2xl p-8 mb-10">
            <div className="flex items-center gap-3 mb-6">
              <Shield className="w-6 h-6 text-yellow-400" aria-hidden="true" />
              <h2 className="text-2xl font-bold text-white">Safety Tips</h2>
            </div>
            <ul className="space-y-3">
              {equipment.safetyTips.map((tip, index) => (
                <li key={index} className="flex items-start gap-3 text-gray-300">
                  <span className="text-yellow-400 mt-1 flex-shrink-0" aria-hidden="true">•</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Exercises using this equipment */}
          {equipmentExercises.length > 0 && (
            <div className="glass rounded-2xl p-8 mb-10">
              <div className="flex items-center gap-3 mb-6">
                <Dumbbell className="w-6 h-6 text-[#DC2626]" aria-hidden="true" />
                <h2 className="text-2xl font-bold text-white">
                  Exercises Using This Equipment
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {equipmentExercises.map((ex) => (
                  <Link
                    key={ex.id}
                    href={`/exercise/${ex.slug}`}
                    className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 transition-all group"
                  >
                    <div>
                      <p className="font-semibold text-white text-sm group-hover:text-[#DC2626] transition-colors">
                        {ex.name}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">{ex.category}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-[#DC2626] group-hover:translate-x-0.5 transition-all" aria-hidden="true" />
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Related equipment */}
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
                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                      {eq.description}
                    </p>
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
