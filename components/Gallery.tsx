'use client';

import { motion } from 'framer-motion';
import {
  Dumbbell,
  Activity,
  Heart,
  Sun,
  Lock,
} from 'lucide-react';

const galleryImages = [
  { category: 'Gym Floor', icon: Dumbbell, color: '#DC2626' },
  { category: 'Cardio Zone', icon: Activity, color: '#10B981' },
  { category: 'Free Weights', icon: Dumbbell, color: '#F59E0B' },
  { category: 'Terrace Area', icon: Sun, color: '#6366F1' },
  { category: 'Stretching Zone', icon: Heart, color: '#EC4899' },
  { category: 'Locker Room', icon: Lock, color: '#8B5CF6' },
];

export default function Gallery() {
  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const item = {
    hidden: { opacity: 0, scale: 0.8, y: 20 },
    show: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.6 } },
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
            Our <span className="text-[#DC2626]">Facility</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Take a look at our premium gym facility
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-3 gap-6"
        >
          {galleryImages.map((image, index) => (
            <motion.div
              key={index}
              variants={item}
              whileHover={{
                scale: 1.05,
                y: -10,
                transition: { duration: 0.3 },
              }}
              className="group glass rounded-3xl aspect-square flex flex-col items-center justify-center gap-4 hover:border-[#DC2626]/40 transition-all duration-300 overflow-hidden relative"
            >
              {/* Background Gradient on Hover */}
              <div
                className="absolute inset-0 bg-gradient-to-t from-[#DC2626]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background: `linear-gradient(to top, ${image.color}20, transparent)`,
                }}
              />

              <div
                className="w-20 h-20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
                style={{ backgroundColor: `${image.color}10` }}
              >
                <image.icon
                  className="w-10 h-10 group-hover:scale-110 transition-transform duration-300"
                  style={{ color: image.color }}
                />
              </div>
              <p className="text-gray-300 font-semibold text-lg group-hover:text-white transition-colors">
                {image.category}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
