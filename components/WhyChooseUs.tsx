"use client";
import { motion } from "framer-motion";
import { Dumbbell, Users, Shield, Clock, Target, Heart } from "lucide-react";

const reasons = [
  { icon: Dumbbell, title: "Modern Equipment", desc: "Premium machines and free weights for optimal training." },
  { icon: Users, title: "Expert Trainers", desc: "Certified professionals to guide your fitness journey." },
  { icon: Shield, title: "Clean Facility", desc: "Hygienic, sanitized environment with top-notch amenities." },
  { icon: Clock, title: "Extended Hours", desc: "Flexible morning and evening schedules for your convenience." },
  { icon: Target, title: "Personal Programs", desc: "Customized workout plans tailored to your goals." },
  { icon: Heart, title: "Community", desc: "Supportive environment that keeps you motivated." },
];

export default function WhyChooseUs() {
  return (
    <section id="about" className="py-20 sm:py-32 bg-gradient-to-b from-gray-950 to-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            Why Choose <span className="text-[#DC2626]">Gym56</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            We provide everything you need to achieve your fitness goals.
          </p>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {reasons.map((reason, i) => (
            <motion.div
              key={reason.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -8 }}
              className="glass rounded-2xl p-8 border border-white/10 hover:border-[#DC2626]/40 transition-all duration-300"
            >
              <reason.icon className="w-12 h-12 text-[#DC2626] mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">{reason.title}</h3>
              <p className="text-gray-400">{reason.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
