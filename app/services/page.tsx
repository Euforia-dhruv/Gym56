import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Services",
  description:
    "Discover the premium fitness services offered at Gym 56 in Gandhinagar — personal training, group classes, modern equipment, and more.",
  openGraph: {
    title: "Our Services — Gym 56",
    description:
      "Discover the premium fitness services offered at Gym 56 in Gandhinagar.",
    url: "https://gym56.vercel.app/services",
  },
};

export default function Services() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <h1 className="text-4xl font-bold text-center">Our Services</h1>
    </div>
  );
}
