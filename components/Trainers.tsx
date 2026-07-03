'use client';

import { motion } from 'framer-motion';
import { User, X, MessageSquare, Share2 } from 'lucide-react';

const trainers = [
  {
    name: 'Raj Patel',
    role: 'Head Coach',
    specialty: 'Strength & Conditioning',
    bio: 'Experienced strength coach dedicated to helping members achieve their fitness goals.',
  },
  {
    name: 'Priya Sharma',
    role: 'Fitness Coach',
    specialty: 'Weight Loss & Wellness',
    bio: 'Passionate about guiding members through sustainable fitness transformations.',
  },
  {
    name: 'Amit Singh',
    role: 'Personal Trainer',
    specialty: 'Strength & Mobility',
    bio: 'Focused on delivering personalized training programs for all fitness levels.',
  },
];

export default function Trainers() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  const item = {
    hidden: { y: 40, opacity: 0 },
    show: {
      y: 0, opacity: 1, transition: { duration: 0.7 },
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
            Meet Our <span className="text-[#DC2626]">Trainers</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Expert guidance to help you achieve your fitness goals
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {trainers.map((trainer, index) => (
            <motion.div
              key={index}
              variants={item}
              whileHover={{ y: -12, scale: 1.02 }}
              transition={{ duration: 0.3 }}
              className="glass rounded-3xl overflow-hidden hover:border-white/20 transition-all duration-300"
            >
              <div className="aspect-[4/5] bg-gradient-to-b from-[#DC2626]/20 to-black flex items-center justify-center relative overflow-hidden">
                <div className="w-32 h-32 rounded-full bg-[#DC2626]/10 flex items-center justify-center border border-[#DC2626]/20">
                  <User className="w-16 h-16 text-[#DC2626]" />
                </div>
              </div>
              <div className="p-8 text-center">
                <h3 className="text-2xl font-bold mb-1">{trainer.name}</h3>
                <p className="text-[#DC2626] text-sm mb-2 font-semibold">{trainer.role}</p>
                <p className="text-gray-400 text-sm mb-4">{trainer.specialty}</p>
                <p className="text-gray-500 text-sm mb-6">{trainer.bio}</p>
                <div className="flex justify-center gap-4">
                  {[
                    { Icon: X, label: 'Twitter' },
                    { Icon: MessageSquare, label: 'Message' },
                    { Icon: Share2, label: 'Share' },
                  ].map(({ Icon, label }) => (
                    <button
                      key={label}
                      aria-label={label}
                      className="w-10 h-10 rounded-full glass flex items-center justify-center hover:bg-[#DC2626] transition-colors"
                    >
                      <Icon className="w-5 h-5" aria-hidden="true" />
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
