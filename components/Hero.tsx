'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import CountUp from 'react-countup';
import { Users, Trophy, Dumbbell, Clock } from 'lucide-react';

const stats = [
  { icon: Users, value: 45, label: 'Happy Members', suffix: '+' },
  { icon: Trophy, value: 1.5, label: 'Years of Coaching', decimals: 1, suffix: '' },
  { icon: Dumbbell, value: 3, label: 'Training Programs', suffix: '' },
  { icon: Clock, value: 6, label: 'Days a Week', suffix: '' },
];

const equipment = [
  {
    id: 'barbell',
    top: '18%',
    left: '5%',
    width: 100,
    delay: 0,
    duration: 8,
    rotate: 0,
    svg: (
      <svg viewBox="0 0 120 30" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <rect x="0" y="10" width="120" height="6" rx="3" fill="currentColor" className="text-white/5" />
        <rect x="5" y="4" width="12" height="18" rx="2" fill="currentColor" className="text-white/8" />
        <rect x="103" y="4" width="12" height="18" rx="2" fill="currentColor" className="text-white/8" />
      </svg>
    ),
  },
  {
    id: 'dumbbell',
    top: '72%',
    left: '8%',
    width: 80,
    delay: 1.5,
    duration: 10,
    rotate: -15,
    svg: (
      <svg viewBox="0 0 60 30" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <rect x="0" y="8" width="10" height="14" rx="2" fill="currentColor" className="text-white/6" />
        <rect x="10" y="10" width="6" height="10" rx="1" fill="currentColor" className="text-white/4" />
        <rect x="16" y="8" width="4" height="14" rx="1" fill="currentColor" className="text-white/6" />
        <rect x="20" y="10" width="20" height="10" rx="1" fill="currentColor" className="text-white/4" />
        <rect x="40" y="8" width="4" height="14" rx="1" fill="currentColor" className="text-white/6" />
        <rect x="44" y="10" width="6" height="10" rx="1" fill="currentColor" className="text-white/4" />
        <rect x="50" y="8" width="10" height="14" rx="2" fill="currentColor" className="text-white/6" />
      </svg>
    ),
  },
  {
    id: 'squat-rack',
    top: '12%',
    right: '6%',
    width: 90,
    delay: 2,
    duration: 11,
    rotate: 0,
    svg: (
      <svg viewBox="0 0 70 90" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <rect x="5" y="0" width="4" height="90" rx="2" fill="currentColor" className="text-white/5" />
        <rect x="61" y="0" width="4" height="90" rx="2" fill="currentColor" className="text-white/5" />
        <rect x="5" y="5" width="60" height="4" rx="2" fill="currentColor" className="text-white/6" />
        <rect x="5" y="60" width="60" height="4" rx="2" fill="currentColor" className="text-white/6" />
        <rect x="5" y="40" width="60" height="3" rx="1.5" fill="currentColor" className="text-white/4" />
      </svg>
    ),
  },
  {
    id: 'bench-press',
    top: '65%',
    right: '4%',
    width: 110,
    delay: 0.8,
    duration: 9,
    rotate: 0,
    svg: (
      <svg viewBox="0 0 110 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <rect x="10" y="20" width="70" height="5" rx="2.5" fill="currentColor" className="text-white/5" />
        <rect x="10" y="0" width="5" height="40" rx="2" fill="currentColor" className="text-white/6" />
        <rect x="75" y="0" width="5" height="40" rx="2" fill="currentColor" className="text-white/6" />
        <rect x="80" y="5" width="25" height="4" rx="2" fill="currentColor" className="text-white/5" />
        <rect x="80" y="25" width="25" height="4" rx="2" fill="currentColor" className="text-white/5" />
        <rect x="102" y="5" width="4" height="24" rx="2" fill="currentColor" className="text-white/4" />
      </svg>
    ),
  },
  {
    id: 'cable-machine',
    top: '35%',
    right: '2%',
    width: 75,
    delay: 3,
    duration: 12,
    rotate: 0,
    svg: (
      <svg viewBox="0 0 60 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <rect x="5" y="0" width="50" height="4" rx="2" fill="currentColor" className="text-white/6" />
        <rect x="25" y="4" width="10" height="30" rx="3" fill="currentColor" className="text-white/4" />
        <rect x="5" y="70" width="50" height="30" rx="3" fill="currentColor" className="text-white/5" />
        <rect x="5" y="50" width="50" height="4" rx="2" fill="currentColor" className="text-white/4" />
      </svg>
    ),
  },
  {
    id: 'plates',
    top: '45%',
    left: '3%',
    width: 70,
    delay: 1.2,
    duration: 7,
    rotate: 0,
    svg: (
      <svg viewBox="0 0 50 70" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <circle cx="25" cy="20" r="18" stroke="currentColor" strokeWidth="3" className="text-white/5" />
        <circle cx="25" cy="20" r="6" fill="currentColor" className="text-white/6" />
        <circle cx="25" cy="50" r="18" stroke="currentColor" strokeWidth="3" className="text-white/5" />
        <circle cx="25" cy="50" r="6" fill="currentColor" className="text-white/6" />
      </svg>
    ),
  },
  {
    id: 'exercise-bike',
    top: '78%',
    left: '55%',
    width: 95,
    delay: 2.5,
    duration: 9,
    rotate: 0,
    svg: (
      <svg viewBox="0 0 80 70" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <circle cx="20" cy="50" r="15" stroke="currentColor" strokeWidth="3" fill="none" className="text-white/5" />
        <circle cx="60" cy="50" r="15" stroke="currentColor" strokeWidth="3" fill="none" className="text-white/5" />
        <rect x="18" y="10" width="44" height="6" rx="3" fill="currentColor" className="text-white/5" />
        <rect x="22" y="0" width="4" height="20" rx="2" fill="currentColor" className="text-white/6" />
        <rect x="54" y="0" width="4" height="20" rx="2" fill="currentColor" className="text-white/6" />
        <rect x="0" y="35" width="80" height="3" rx="1.5" fill="currentColor" className="text-white/4" />
      </svg>
    ),
  },
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

  const particles = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: 2 + Math.random() * 3,
    duration: 10 + Math.random() * 15,
    delay: Math.random() * 5,
  }));

  const smokeBlobs = [
    { id: 0, top: '30%', left: '20%', size: 300, delay: 0, duration: 12 },
    { id: 1, top: '60%', left: '70%', size: 250, delay: 3, duration: 15 },
    { id: 2, top: '20%', left: '80%', size: 200, delay: 6, duration: 10 },
    { id: 3, top: '70%', left: '30%', size: 280, delay: 2, duration: 14 },
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-950 to-black">
        {/* Spotlights */}
        <div className="absolute top-0 left-1/4 w-[600px] h-[800px] bg-gradient-radial from-[#DC2626]/8 via-transparent to-transparent opacity-60" />
        <div className="absolute top-1/3 right-1/4 w-[400px] h-[600px] bg-gradient-radial from-[#DC2626]/5 via-transparent to-transparent opacity-40" />
        <div className="absolute bottom-0 left-1/3 w-[500px] h-[400px] bg-gradient-radial from-[#DC2626]/6 via-transparent to-transparent opacity-50" />

        {/* Soft red ambient glow */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#DC2626]/15 rounded-full blur-[120px] animate-pulse" />
          <div
            className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] bg-red-800/10 rounded-full blur-[100px] animate-pulse"
            style={{ animationDelay: '2s' }}
          />
        </div>
      </div>

      {/* Smoke blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        {smokeBlobs.map((blob) => (
          <motion.div
            key={blob.id}
            className="absolute rounded-full bg-gradient-radial from-white/[0.03] via-white/[0.01] to-transparent"
            style={{
              top: blob.top,
              left: blob.left,
              width: blob.size,
              height: blob.size,
            }}
            animate={{
              x: [0, 30, -20, 0],
              y: [0, -40, 20, 0],
              opacity: [0.15, 0.25, 0.1, 0.15],
              scale: [1, 1.1, 0.95, 1],
            }}
            transition={{
              duration: blob.duration,
              delay: blob.delay,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      {/* Floating Equipment */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-[1]" aria-hidden="true">
        {equipment.map((eq) => (
          <motion.div
            key={eq.id}
            className="absolute"
            style={{
              top: eq.top,
              left: eq.left,
              right: eq.right,
              width: eq.width,
              rotate: `${eq.rotate}deg`,
            }}
            animate={{
              y: [0, -20, 10, -15, 0],
              x: [0, 10, -15, 5, 0],
              rotate: [eq.rotate, eq.rotate + 3, eq.rotate - 2, eq.rotate + 1, eq.rotate],
              opacity: [0.4, 0.6, 0.35, 0.55, 0.4],
            }}
            transition={{
              duration: eq.duration,
              delay: eq.delay,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            {eq.svg}
          </motion.div>
        ))}
      </div>

      {/* Floating Particles */}
      <div
        className="absolute inset-0 overflow-hidden pointer-events-none z-[1]"
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
              y: [0, -40, 0],
              opacity: [0.1, 0.4, 0.1],
            }}
            transition={{
              duration: particle.duration,
              delay: particle.delay,
              repeat: Infinity,
              ease: 'easeInOut',
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
          <Link
            href="/signup"
            className="px-8 py-4 text-lg font-semibold text-white bg-[#DC2626] hover:bg-[#B91C1C] rounded-full transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-[#DC2626]/30"
          >
            Join Now
          </Link>

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
                  decimals={stat.decimals ?? 0}
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

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10"
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
