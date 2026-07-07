"use client";
import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { CONFIG } from "@/lib/config";

export default function ContactCTA() {
  return (
    <section className="py-20 sm:py-32 bg-gradient-to-b from-gray-950 to-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="glass rounded-3xl p-10 sm:p-16 text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#DC2626]/10 to-transparent" aria-hidden="true" />
          <div className="relative z-10">
            <MessageCircle className="w-16 h-16 text-[#DC2626] mx-auto mb-6" />
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
              Ready to Start Your{" "}
              <span className="text-[#DC2626]">Fitness Journey</span>?
            </h2>
            <p className="text-gray-300 text-lg mb-10 max-w-2xl mx-auto">
              Contact us on WhatsApp for pricing, trial sessions, and more.
            </p>
            <a
              href={CONFIG.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-10 py-4 text-lg font-semibold text-white bg-[#DC2626] hover:bg-[#B91C1C] rounded-full transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-[#DC2626]/30"
            >
              <MessageCircle className="w-5 h-5" />
              Chat on WhatsApp
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
