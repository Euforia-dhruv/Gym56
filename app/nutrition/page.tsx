"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, Calendar, BarChart3, Salad, Search } from "lucide-react";
import { FoodDatabase, RecipeSection, MealPlanner, CalorieTracker, MealCollections } from "@/components/nutrition/NutritionHub";

const TABS = [
  { id: "database", label: "Food Database", icon: Search, color: "#3B82F6" },
  { id: "collections", label: "Meal Collections", icon: Salad, color: "#10B981" },
  { id: "recipes", label: "Recipes", icon: BookOpen, color: "#F59E0B" },
  { id: "planner", label: "Meal Planner", icon: Calendar, color: "#8B5CF6" },
  { id: "tracker", label: "Calorie Tracker", icon: BarChart3, color: "#EF4444" },
];

export default function NutritionPage() {
  const [tab, setTab] = useState("database");

  return (
    <div className="min-h-screen bg-black pt-20">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-3">Nutrition Hub</h1>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Indian food database with complete macros, recipes, meal planner, and calorie tracker.
            Everything you need for science-based nutrition.
          </p>
        </motion.div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          {TABS.map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                tab === t.id ? "text-white" : "text-gray-500 hover:text-white bg-white/5"
              }`}
              style={tab === t.id ? { backgroundColor: `${t.color}20`, color: t.color, borderColor: `${t.color}40`, borderWidth: 1 } : {}}
            >
              <t.icon className="w-4 h-4" />
              {t.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <motion.div key={tab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
          {tab === "database" && <FoodDatabase />}
          {tab === "collections" && <MealCollections />}
          {tab === "recipes" && <RecipeSection />}
          {tab === "planner" && <MealPlanner />}
          {tab === "tracker" && <CalorieTracker />}
        </motion.div>
      </div>
    </div>
  );
}
