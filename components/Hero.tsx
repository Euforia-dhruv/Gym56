'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import CountUp from 'react-countup';
import { Users, Trophy, Dumbbell, Clock } from 'lucide-react';

const stats = [
  { icon: Users, value: 200, label: 'Happy Members', suffix: '+' },
  { icon: Trophy, value: 5, label: 'Years Experience', suffix: '+' },
  { icon: Dumbbell, value: 12, label: 'Premium Programs', suffix: '' },
  { icon: Clock, value: 24, label: 'Hours Support', suffix: '/7' },
];

export default function Hero() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const item = {
    hidden: { y: 50, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { duration: 0.8 } },
  };

  const particles = [
    { id: 0, x: 71.63, y: 54.16, size: 3.54, duration: 15.3 },
    { id: 1, x: 82.8, y: 62.88, size: 4.5, duration: 12.7 },
    { id: 2, x: 6.21, y: 24.18, size: 3.29, duration: 18.2 },
    { id: 3, x: 19.36, y: 65.04, size: 3.57, duration: 14.1 },
    { id: 4, x: 52.03, y: 85.48, size: 4.58, duration: 16.5 },
    { id: 5, x: 92.95, y: 56.55, size: 2.68, duration: 19.8 },
    { id: 6, x: 61.17, y: 74.85, size: 2.98, duration: 11.2 },
    { id: 7, x: 96.19, y: 56.98, size: 2.63, duration: 17.6 },
    { id: 8, x: 17.88, y: 11.03, size: 3.54, duration: 13.9 },
    { id: 9, x: 60.36, y: 53.39, size: 4.14, duration: 20.1 },
    { id: 10, x: 10.06, y: 5.88, size: 2.44, duration: 15.7 },
    { id: 11, x: 26.33, y: 55.4, size: 2.78, duration: 14.5 },
    { id: 12, x: 86.22, y: 37.02, size: 3.07, duration: 18.9 },
    { id: 13, x: 22.24, y: 53.24, size: 4.16, duration: 12.3 },
    { id: 14, x: 60.28, y: 7.95, size: 2.89, duration: 16.8 },
    { id: 15, x: 77.74, y: 49.84, size: 2.33, duration: 17.2 },
    { id: 16, x: 30.01, y: 0.95, size: 3.98, duration: 11.9 },
    { id: 17, x: 22.95, y: 86.47, size: 3.29, duration: 19.3 },
    { id: 18, x: 77.11, y: 80.51, size: 3.93, duration: 13.6 },
    { id: 19, x: 98.26, y: 56.38, size: 2.32, duration: 15.1 },
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-950 to-black">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#DC2626]/20 rounded-full blur-3xl animate-pulse" />
          <div
            className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-red-800/10 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: '2s' }}
          />
        </div>
      </div>

      {/* Floating Particles — aria-hidden so screen readers skip decorative elements */}
      <div
        className="absolute inset-0 overflow-hidden pointer-events-none"
        aria-hidden="true"
      >
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full bg-white/10"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
            }}
          />
        ))}
      </div>

      {/* Hero Content */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
      >
        <motion.h1
          variants={item}
          className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black leading-tight tracking-tighter mb-6"
        >
          <span className="block">FORGED STRENGTH.</span>
          <span className="block bg-gradient-to-r from-white via-gray-200 to-[#DC2626] bg-clip-text text-transparent">
            BUILT DISCIPLINE.
          </span>
        </motion.h1>

        <motion.p
          variants={item}
          className="text-lg sm:text-xl md:text-2xl text-gray-300 mb-12 max-w-2xl mx-auto"
        >
          Premium Fitness Experience in Gandhinagar
        </motion.p>

        <motion.div
          variants={item}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          {/* "Join Now" navigates to the signup page */}
          <Link
            href="/signup"
            className="px-8 py-4 text-lg font-semibold text-white bg-[#DC2626] hover:bg-[#B91C1C] rounded-full transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-[#DC2626]/30"
          >
            Join Now
          </Link>

          {/* "Explore Gym" scrolls down to the membership section */}
          <a
            href="#membership"
            className="px-8 py-4 text-lg font-semibold text-white border border-white/20 hover:border-white/40 rounded-full transition-all duration-300 hover:scale-105 glass"
          >
            Explore Gym
          </a>
        </motion.div>

        {/* Statistics Cards */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              variants={item}
              whileHover={{ y: -10, transition: { duration: 0.3 } }}
              className="glass rounded-2xl p-6 border border-white/10 hover:border-[#DC2626]/40 transition-all duration-300"
            >
              <stat.icon className="w-10 h-10 text-[#DC2626] mx-auto mb-3" />
              <div className="text-3xl md:text-4xl font-black text-white mb-1">
                <CountUp
                  end={stat.value}
                  duration={2.5}
                  enableScrollSpy
                  scrollSpyOnce
                />
                {stat.suffix}
              </div>
              <p className="text-gray-400 text-sm">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll Indicator — decorative, aria-hidden */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        aria-hidden="true"
      >
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
          <motion.div
            className="w-1.5 h-3 bg-white/60 rounded-full"
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
      </motion.div>
    </section>
  );
}
