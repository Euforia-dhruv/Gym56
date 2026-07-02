import type { Metadata } from "next";
import Hero from "@/components/Hero";
import TrustedSection from "@/components/TrustedSection";
import Features from "@/components/Features";
import Membership from "@/components/Membership";
import Reviews from "@/components/Reviews";
import CTA from "@/components/CTA";

export const metadata: Metadata = {
  title: "Gym 56 — Premium Fitness in Gandhinagar",
  description:
    "Join Gym 56 in Sector 26, Gandhinagar. Modern equipment, expert trainers, air-conditioned facilities, and flexible membership plans starting at ₹1500.",
  openGraph: {
    title: "Gym 56 — Premium Fitness in Gandhinagar",
    description:
      "Join Gym 56 in Sector 26, Gandhinagar. Modern equipment, expert trainers, and flexible membership plans.",
    url: "https://gym56.vercel.app",
    type: "website",
  },
};

export default function Home() {
  return (
    <>
      <Hero />
      <TrustedSection />
      <Features />
      <Membership />
      <Reviews />
      <CTA />
    </>
  );
}
