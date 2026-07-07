"use client";
import { motion } from "framer-motion";
import { Wind, Music, Car, Weight, HeartPulse } from "lucide-react";

const facilities = [
  { icon: Wind, title: "Air Conditioned", desc: "Stay cool during intense workouts." },
  { icon: Music, title: "Sound System", desc: "High-quality audio to keep you pumped." },
  { icon: Car, title: "Parking", desc: "Ample parking space for members." },

  { icon: Weight, title: "Cardio Zone", desc: "Treadmills, cycles, and more." },
  { icon: HeartPulse, title: "Recovery Area", desc: "Stretching and cool-down space." },
];

export default function Facilities() {
  return (
    <section id="services" className="py-20 sm:py-32 bg-gradient-to-b from-black to-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            Our <span className="text-[#DC2626]">Facilities</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Everything you need for a complete fitness experience.
          </p>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {facilities.map((facility, i) => (
            <motion.div
              key={facility.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -8 }}
              className="glass rounded-2xl p-8 border border-white/10 hover:border-[#DC2626]/40 transition-all duration-300"
            >
              <facility.icon className="w-12 h-12 text-[#DC2626] mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">{facility.title}</h3>
              <p className="text-gray-400">{facility.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
