'use client';

import CTA from "@/components/CTA";
import { motion } from "framer-motion";
import { Clock, Calendar, Users } from "lucide-react";

const classes = [
  {
    name: "Yoga & Meditation",
    trainer: "Priya Sharma",
    time: "6:00 AM - 7:00 AM",
    days: "Mon, Wed, Fri",
    level: "All Levels",
  },
  {
    name: "HIIT Training",
    trainer: "Raj Patel",
    time: "7:00 AM - 8:00 AM",
    days: "Tue, Thu, Sat",
    level: "Intermediate",
  },
  {
    name: "Strength Training",
    trainer: "Amit Singh",
    time: "6:00 PM - 7:00 PM",
    days: "Mon-Fri",
    level: "All Levels",
  },
  {
    name: "Zumba Fitness",
    trainer: "Guest Instructor",
    time: "7:00 PM - 8:00 PM",
    days: "Wed, Sat",
    level: "All Levels",
  },
  {
    name: "Core & Abs",
    trainer: "Raj Patel",
    time: "8:00 AM - 8:45 AM",
    days: "Mon, Wed, Fri",
    level: "All Levels",
  },
  {
    name: "Functional Training",
    trainer: "Amit Singh",
    time: "8:00 PM - 9:00 PM",
    days: "Tue, Thu",
    level: "Intermediate",
  },
];

export default function ClassesClient() {
  return (
    <>
      <section className="pt-32 pb-20 bg-gradient-to-b from-black to-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
            Our <span className="text-[#DC2626]">Classes</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Expert-led fitness classes for every level
          </p>
        </div>
      </section>

      <section className="py-20 sm:py-32 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {classes.map((cls, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -12, scale: 1.02 }}
                className="glass rounded-3xl p-8 hover:border-white/20 transition-all duration-300"
              >
                <h3 className="text-2xl font-bold mb-4">{cls.name}</h3>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3 text-gray-400">
                    <Users className="w-5 h-5 text-[#DC2626]" />
                    <span>Trainer: {cls.trainer}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-400">
                    <Clock className="w-5 h-5 text-[#DC2626]" />
                    <span>Time: {cls.time}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-400">
                    <Calendar className="w-5 h-5 text-[#DC2626]" />
                    <span>Days: {cls.days}</span>
                  </div>
                </div>
                <span className="inline-block px-4 py-2 bg-[#DC2626]/10 text-[#DC2626] rounded-full text-sm font-semibold">
                  {cls.level}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <CTA />
    </>
  );
}
