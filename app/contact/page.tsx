import type { Metadata } from "next";
import ContactSection from "@/components/ContactSection";

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
      <section className="pt-32 pb-20 bg-gradient-to-b from-black to-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
            Contact <span className="text-[#DC2626]">Us</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Have questions? We are here to help
          </p>
        </div>
      </section>

      {/* Google Maps Embed */}
      <section className="py-8 bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass rounded-2xl overflow-hidden">
            <iframe
              title="Gym 56 Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3665.6641636327668!2d72.63415768756579!3d23.25530495349888!2m3!1f0!2f0!3f0!1i1024!2i768!4f13.1!3m3!1m2!1s0x395c2d0061ed69ab%3A0x70866159496d731e!2sGYM%2056!5e0!3m2!1sen!2sin!4v1783099943712!5m2!1sen!2sin"
              width="100%"
              height="400"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
            />
          </div>
        </div>
      </section>

      <ContactSection />
    </>
  );
}
