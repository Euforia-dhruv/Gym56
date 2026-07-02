import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about Gym 56 — Gandhinagar's premium fitness destination in Sector 26. Our story, our trainers, and our community.",
  openGraph: {
    title: "About Us — Gym 56",
    description:
      "Learn about Gym 56 — Gandhinagar's premium fitness destination in Sector 26.",
    url: "https://gym56.vercel.app/about",
  },
};

export default function About() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <h1 className="text-4xl font-bold text-center">About Us</h1>
    </div>
  );
}
