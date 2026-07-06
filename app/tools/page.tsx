"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Search, ChevronRight } from "lucide-react";
import { CALCULATORS } from "@/components/tools/registry";

const CATEGORIES = [
  { key: "all", label: "All" },
  { key: "body", label: "Body Composition" },
  { key: "nutrition", label: "Nutrition" },
  { key: "performance", label: "Performance" },
  { key: "cardio", label: "Cardio" },
];

export default function ToolsPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  const filtered = CALCULATORS.filter((c) => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.description.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === "all" || c.category === category;
    return matchSearch && matchCat;
  });

  return (
    <div className="min-h-screen bg-black pt-20">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Fitness Tools</h1>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Professional fitness calculators to track your progress, plan your training, and optimize your nutrition.
            All tools are free and based on validated formulas.
          </p>
        </motion.div>

        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder="Search calculators..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-black/50 border border-white/10 focus:border-[#DC2626] focus:outline-none focus:ring-1 focus:ring-[#DC2626] text-white placeholder-gray-600 text-sm"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setCategory(cat.key)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  category === cat.key
                    ? "bg-[#DC2626] text-white"
                    : "bg-white/5 text-gray-400 hover:text-white hover:bg-white/10"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((calc, i) => (
            <motion.div
              key={calc.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
            >
              <Link
                href={`/tools/${calc.slug}`}
                className="block glass rounded-2xl border border-white/5 hover:border-[#DC2626]/30 transition-all p-5 group h-full"
              >
                <div className="flex items-start gap-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${calc.color}15` }}
                  >
                    <calc.icon className="w-6 h-6" style={{ color: calc.color }} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-white group-hover:text-[#DC2626] transition-colors">{calc.name}</h3>
                      <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-[#DC2626] transition-colors flex-shrink-0" />
                    </div>
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">{calc.description}</p>
                    <span className="inline-block mt-2 text-[10px] uppercase tracking-wider text-gray-600 bg-white/5 px-2 py-0.5 rounded">
                      {calc.category}
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No calculators found matching &quot;{search}&quot;</p>
          </div>
        )}
      </div>
    </div>
  );
}
