'use client';

import Features from "@/components/Features";
import CTA from "@/components/CTA";
import { motion } from "framer-motion";
import { Dumbbell, Users, Heart, Zap, Activity, Star } from "lucide-react";

const services = [
  {
    icon: Dumbbell,
    title: "Strength Training",
    description: "Build lean muscle with structured strength programs",
  },
  {
    icon: Activity,
    title: "Weight Loss",
    description: "Effective fat loss strategies with expert guidance",
  },
  {
    icon: Users,
    title: "Muscle Building",
    description: "Targeted hypertrophy programs for maximum gains",
  },
  {
    icon: Zap,
    title: "Functional Training",
    description: "Improve mobility and real-world movement patterns",
  },
  {
    icon: Heart,
    title: "Personal Guidance",
    description: "One-on-one coaching tailored to your goals",
  },
  {
    icon: Activity,
    title: "Cardio Training",
    description: "Boost endurance with treadmill and spin bike workouts",
  },
  {
    icon: Star,
    title: "Beginner Friendly Workouts",
    description: "Safe, structured programs for fitness newcomers",
  },
];

export default function ServicesClient() {
  return (
    <>
      <section className="pt-32 pb-20 bg-gradient-to-b from-black to-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
            Our <span className="text-[#DC2626]">Services</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Everything you need to achieve your fitness goals
          </p>
        </div>
      </section>

      <section className="py-20 sm:py-32 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -12, scale: 1.02 }}
                className="glass rounded-3xl p-8 hover:border-white/20 transition-all duration-300"
              >
                <div className="w-16 h-16 rounded-2xl bg-[#DC2626]/10 flex items-center justify-center mb-6">
                  <service.icon className="w-8 h-8 text-[#DC2626]" />
                </div>
                <h3 className="text-2xl font-bold mb-3">{service.title}</h3>
                <p className="text-gray-400">{service.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Features />
      <CTA />
    </>
  );
}
