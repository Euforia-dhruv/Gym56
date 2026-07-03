import type { Metadata } from "next";
import ClassesClient from "./ClassesClient";

export const metadata: Metadata = {
  title: "Classes - Gym 56",
  description:
    "Explore fitness classes at Gym 56 in Gandhinagar. Expert-led sessions for all fitness levels — from beginners to advanced athletes.",
  openGraph: {
    title: "Classes — Gym 56",
    description:
      "Explore fitness classes at Gym 56 in Gandhinagar. Expert-led sessions for all fitness levels.",
    url: "https://gym56.vercel.app/classes",
  },
};

export default function Classes() {
  return <ClassesClient />;
}
