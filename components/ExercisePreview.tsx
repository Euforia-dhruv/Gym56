"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const exerciseCategories = ["Chest", "Back", "Shoulders", "Legs", "Arms", "Core", "Cardio"];

export default function ExercisePreview() {
  return (
    <section className="py-20 sm:py-32 bg-gradient-to-b from-black to-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            Exercise <span className="text-[#DC2626]">Library</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Explore 270+ exercises with detailed instructions and tips.
          </p>
        </motion.div>
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {exerciseCategories.map((cat, i) => (
            <motion.span
              key={cat}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-gray-300"
            >
              {cat}
            </motion.span>
          ))}
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Link
            href="/exercises"
            className="inline-flex items-center gap-2 px-8 py-4 text-lg font-semibold text-white bg-[#DC2626] hover:bg-[#B91C1C] rounded-full transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-[#DC2626]/30"
          >
            Browse Exercises
            <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
