import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Exercise Comparison - Gym 56",
  description:
    "Compare exercises side by side at Gym 56. View muscles worked, difficulty, equipment, variations, progressions, and safety tips.",
  openGraph: {
    title: "Exercise Comparison — Gym 56",
    description: "Compare exercises side by side. View muscles worked, difficulty, equipment, and variations.",
    url: "https://gym56.vercel.app/exercise-compare",
  },
  twitter: {
    card: "summary_large_image",
    title: "Exercise Comparison — Gym 56",
    description: "Compare exercises side by side. View muscles worked, difficulty, equipment, and variations.",
  },
};

export default function ExerciseCompareLayout({ children }: { children: React.ReactNode }) {
  return children;
}
