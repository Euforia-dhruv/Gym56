import type { Metadata } from "next";
import Hero from "@/components/Hero";
import EquipmentCarousel from "@/components/EquipmentCarousel";
import TrustedSection from "@/components/TrustedSection";
import AboutSection from "@/components/AboutSection";
import Features from "@/components/Features";
import Trainers from "@/components/Trainers";
import Transformations from "@/components/Transformations";
import Membership from "@/components/Membership";
import Gallery from "@/components/Gallery";
import Reviews from "@/components/Reviews";
import FAQ from "@/components/FAQ";
import ContactSection from "@/components/ContactSection";
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
      <EquipmentCarousel />
      <TrustedSection />
      <AboutSection />
      <Features />
      <Trainers />
      <Transformations />
      <Membership />
      <Gallery />
      <Reviews />
      <FAQ />
      <ContactSection />
      <CTA />
    </>
  );
}
