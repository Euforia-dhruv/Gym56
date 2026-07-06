import type { Metadata } from "next";
import ContactSection from "@/components/ContactSection";
import LocationSection from "@/components/LocationSection";

export const metadata: Metadata = {
  title: "Contact Us - Gym 56",
  description:
    "Get in touch with Gym 56. Visit us in Sector 26, Gandhinagar, Gujarat, or reach us by phone and email.",
  openGraph: {
    title: "Contact Us — Gym 56",
    description:
      "Get in touch with Gym 56. Visit us in Sector 26, Gandhinagar, Gujarat.",
    url: "https://gym56.vercel.app/contact",
  },
};

export default function Contact() {
  return (
    <>
      <section className="pt-32 pb-8 bg-gradient-to-b from-black to-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
            Contact <span className="text-[#DC2626]">Us</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Have questions? We are here to help
          </p>
        </div>
      </section>

      <LocationSection />
      <ContactSection />
    </>
  );
}
