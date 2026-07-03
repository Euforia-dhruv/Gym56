import type { Metadata } from "next";
import AboutSection from "@/components/AboutSection";
import Trainers from "@/components/Trainers";
import CTA from "@/components/CTA";

export const metadata: Metadata = {
  title: "About Us - Gym 56",
  description:
    "Learn about Gym 56 — Gandhinagar's premier fitness destination in Sector 26. Our story, our trainers, and our community.",
  openGraph: {
    title: "About Us — Gym 56",
    description:
      "Learn about Gym 56 — Gandhinagar's premier fitness destination in Sector 26.",
    url: "https://gym56.vercel.app/about",
  },
};

export default function About() {
  return (
    <>
      <section className="pt-32 pb-20 bg-gradient-to-b from-black to-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
            About <span className="text-[#DC2626]">Gym 56</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Transforming lives through fitness since 2019
          </p>
        </div>
      </section>
      <AboutSection />
      <Trainers />
      <CTA />
    </>
  );
}
