import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Classes",
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
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <h1 className="text-4xl font-bold text-center">Classes</h1>
    </div>
  );
}
