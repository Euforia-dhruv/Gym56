import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nutrition Hub - Gym 56",
  description:
    "Gym 56's Nutrition Hub — Indian food database with macros, meal collections, recipes, weekly meal planner, and daily calorie tracker.",
  openGraph: {
    title: "Nutrition Hub — Gym 56",
    description: "Indian food database, meal planner, calorie tracker, and recipes. Complete nutrition tools for your fitness journey.",
    url: "https://gym56.vercel.app/nutrition",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nutrition Hub — Gym 56",
    description: "Indian food database, meal planner, calorie tracker, and recipes. Complete nutrition tools for your fitness journey.",
  },
};

export default function NutritionLayout({ children }: { children: React.ReactNode }) {
  return children;
}
