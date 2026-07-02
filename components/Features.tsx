'use client';

import { motion } from 'framer-motion';
import {
  Dumbbell,
  Snowflake,
  Users,
  Sparkles,
  Droplets,
  Bath,
  Sun,
  Smile,
} from 'lucide-react';

const features = [
  { icon: Dumbbell, title: 'Modern Equipment', description: 'State-of-the-art machines and free weights' },
  { icon: Snowflake, title: 'Fully Air Conditioned', description: 'Comfortable workout environment year-round' },
  { icon: Users, title: 'Friendly Trainers', description: 'Expert guidance to help you reach your goals' },
  { icon: Sparkles, title: 'Clean Environment', description: 'Spotlessly clean facilities at all times' },
  { icon: Droplets, title: 'Water Cooler', description: 'Hydration stations throughout the gym' },
  { icon: Bath, title: 'Washroom', description: 'Hygienic and well-maintained washrooms' },
  { icon: Sun, title: 'Terrace Warm-up Area', description: 'Outdoor space for stretching and warm-ups' },
  { icon: Smile, title: 'Positive Community', description: 'Motivating and supportive atmosphere' },
];

export default function Features() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { y: 30, opacity: 0 },
    show: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6 },
    },
  };

  return (
    <section className="py-20 sm:py-32 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            Why <span className="text-[#DC2626]">Gym 56</span>?
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Everything you need to transform your fitness journey
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={item}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="glass p-8 rounded-2xl hover:border-white/20 transition-all duration-300 group"
            >
              <div className="w-14 h-14 rounded-xl bg-[#DC2626]/10 flex items-center justify-center mb-6 group-hover:bg-[#DC2626]/20 transition-colors">
                <feature.icon className="w-7 h-7 text-[#DC2626]" />
              </div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-gray-400 text-sm">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
