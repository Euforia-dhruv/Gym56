import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Fitness Tools - Gym 56",
  description:
    "Professional fitness calculators at Gym 56 — BMI, BMR, TDEE, macros, one-rep max, body fat, heart rate zones, and more. Free and validated.",
  openGraph: {
    title: "Fitness Tools — Gym 56",
    description: "Free fitness calculators — BMI, BMR, TDEE, macros, one-rep max, body fat, and more. Science-based tools for your goals.",
    url: "https://gym56.vercel.app/tools",
  },
  twitter: {
    card: "summary_large_image",
    title: "Fitness Tools — Gym 56",
    description: "Free fitness calculators — BMI, BMR, TDEE, macros, one-rep max, body fat, and more. Science-based tools for your goals.",
  },
};

export default function ToolsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
