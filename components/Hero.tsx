'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import CountUp from 'react-countup';
import { Users, Trophy, Dumbbell, Clock } from 'lucide-react';
import { CONFIG } from '@/lib/config';

const stats = [
  { icon: Users, value: 45, label: 'Happy Members', suffix: '+' },
  { icon: Trophy, value: 1.5, label: 'Years of Coaching', decimals: 1, suffix: '' },
  { icon: Dumbbell, value: 3, label: 'Training Programs', suffix: '' },
  { icon: Clock, value: 6, label: 'Days a Week', suffix: '' },
];

const equipmentImages = [
  { src: '/hero/barbell.png', top: '8%', right: '3%', width: 200, height: 140 },
  { src: '/hero/bench.png', top: '55%', right: '2%', width: 220, height: 140 },
  { src: '/hero/cycle.png', top: '24%', right: '1%', width: 180, height: 200 },
  { src: '/hero/dumbell.png', top: '65%', left: '3%', width: 150, height: 150 },
  { src: '/hero/rope.png', top: '10%', left: '2%', width: 140, height: 170 },
  { src: '/hero/treadmill.png', top: '34%', left: '1%', width: 170, height: 200 },
];

export default function Hero() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.3 },
    },
  };

  const item = {
    hidden: { y: 50, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { duration: 0.8 } },
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Base background */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-950 via-[#0a0a0a] to-black">
        <div className="absolute top-0 left-1/4 w-[700px] h-[900px] bg-gradient-radial from-[#DC2626]/10 via-[#DC2626]/3 to-transparent opacity-60" />
        <div className="absolute top-1/4 right-1/5 w-[500px] h-[700px] bg-gradient-radial from-[#DC2626]/6 via-transparent to-transparent opacity-40" />
        <div className="absolute bottom-0 left-1/3 w-[600px] h-[500px] bg-gradient-radial from-[#DC2626]/8 via-transparent to-transparent opacity-50" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-gradient-radial from-white/[0.02] via-transparent to-transparent" />
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-[#DC2626]/10 rounded-full blur-[150px] animate-pulse" />
          <div className="absolute bottom-1/3 right-1/4 w-[500px] h-[500px] bg-red-800/8 rounded-full blur-[130px] animate-pulse" style={{ animationDelay: '2.5s' }} />
          <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] bg-[#DC2626]/5 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '4s' }} />
        </div>
      </div>

      {/* Equipment images on sides */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-[1]" aria-hidden="true">
        {equipmentImages.map((eq, i) => {
          const posStyle: React.CSSProperties = {
            top: eq.top,
            width: eq.width,
            height: eq.height,
          };
          if (eq.left) posStyle.left = eq.left;
          if (eq.right) posStyle.right = eq.right;

          return (
            <motion.div
              key={i}
              className="absolute"
              style={posStyle}
              animate={{
                y: [0, -10, 5, -8, 0],
                opacity: [0.6, 0.85, 0.5, 0.75, 0.6],
              }}
              transition={{
                duration: 6 + (i % 3) * 2,
                delay: i * 0.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              {eq.src.includes('rope') && (
                <div
                  className="absolute inset-0"
                  style={{
                    filter: 'blur(30px)',
                    background: 'radial-gradient(circle, rgba(255,255,255,0.5) 0%, transparent 70%)',
                  }}
                />
              )}
              <Image
                src={eq.src}
                alt="Equipment"
                width={eq.width}
                height={eq.height}
                className="w-full h-full object-contain relative z-[1]"
                style={{ filter: 'drop-shadow(0 0 20px rgba(220,38,38,0.3))' }}
              />
            </motion.div>
          );
        })}
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
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20"
        >
          <a
            href={CONFIG.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-4 text-lg font-semibold text-white bg-[#DC2626] hover:bg-[#B91C1C] rounded-full transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-[#DC2626]/30"
          >
            Join Now
          </a>

          <Link
            href="/equipment"
            className="px-8 py-4 text-lg font-semibold text-white border border-white/20 hover:border-white/40 rounded-full transition-all duration-300 hover:scale-105 glass"
          >
            Explore Equipment
          </Link>
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
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        aria-hidden="true"
      >
        <div className="w-5 h-8 border-2 border-white/20 rounded-full flex justify-center pt-2">
          <motion.div
            className="w-1 h-2.5 bg-white/40 rounded-full"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
      </motion.div>
    </section>
  );
}
