'use client';

import Link from 'next/link';
import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import CountUp from 'react-countup';
import { Users, Trophy, Dumbbell, Clock } from 'lucide-react';

const stats = [
  { icon: Users, value: 45, label: 'Happy Members', suffix: '+' },
  { icon: Trophy, value: 1.5, label: 'Years of Coaching', decimals: 1, suffix: '' },
  { icon: Dumbbell, value: 3, label: 'Training Programs', suffix: '' },
  { icon: Clock, value: 6, label: 'Days a Week', suffix: '' },
];

interface Equipment {
  id: string;
  top: string;
  left?: string;
  right?: string;
  width: number;
  height: number;
  rotate: number;
}

const equipmentList: Equipment[] = [
  { id: 'squat-rack', top: '10%', right: '4%', width: 120, height: 170, rotate: -2 },
  { id: 'bench-press', top: '60%', right: '3%', width: 180, height: 100, rotate: 1 },
  { id: 'cable-machine', top: '30%', right: '1%', width: 110, height: 180, rotate: 0 },
  { id: 'dumbbell', top: '70%', left: '4%', width: 100, height: 60, rotate: -12 },
  { id: 'barbell', top: '14%', left: '3%', width: 180, height: 50, rotate: -3 },
  { id: 'plates', top: '42%', left: '2%', width: 90, height: 110, rotate: 2 },
];

function EquipmentSVG({ id, className }: { id: string; className?: string }) {
  switch (id) {
    case 'squat-rack':
      return (
        <svg viewBox="0 0 120 170" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <defs>
            <linearGradient id="squatGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#fff" stopOpacity="0.08" />
              <stop offset="50%" stopColor="#fff" stopOpacity="0.14" />
              <stop offset="100%" stopColor="#fff" stopOpacity="0.08" />
            </linearGradient>
          </defs>
          <rect x="8" y="0" width="6" height="170" rx="3" fill="url(#squatGrad)" />
          <rect x="106" y="0" width="6" height="170" rx="3" fill="url(#squatGrad)" />
          <rect x="8" y="8" width="104" height="6" rx="3" fill="url(#squatGrad)" />
          <rect x="8" y="110" width="104" height="6" rx="3" fill="url(#squatGrad)" />
          <rect x="8" y="70" width="104" height="4" rx="2" fill="url(#squatGrad)" />
          <rect x="40" y="6" width="12" height="160" rx="6" fill="url(#squatGrad)" opacity="0.3" />
          <rect x="68" y="6" width="12" height="160" rx="6" fill="url(#squatGrad)" opacity="0.3" />
        </svg>
      );
    case 'bench-press':
      return (
        <svg viewBox="0 0 180 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <defs>
            <linearGradient id="benchGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#fff" stopOpacity="0.08" />
              <stop offset="50%" stopColor="#fff" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#fff" stopOpacity="0.08" />
            </linearGradient>
          </defs>
          <rect x="20" y="35" width="110" height="8" rx="4" fill="url(#benchGrad)" />
          <rect x="20" y="5" width="8" height="65" rx="4" fill="url(#benchGrad)" />
          <rect x="122" y="5" width="8" height="65" rx="4" fill="url(#benchGrad)" />
          <rect x="130" y="14" width="40" height="6" rx="3" fill="url(#benchGrad)" />
          <rect x="130" y="48" width="40" height="6" rx="3" fill="url(#benchGrad)" />
          <rect x="168" y="14" width="8" height="40" rx="4" fill="url(#benchGrad)" />
          <rect x="50" y="32" width="50" height="4" rx="2" fill="url(#benchGrad)" opacity="0.2" />
        </svg>
      );
    case 'cable-machine':
      return (
        <svg viewBox="0 0 110 180" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <defs>
            <linearGradient id="cableGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#fff" stopOpacity="0.08" />
              <stop offset="50%" stopColor="#fff" stopOpacity="0.14" />
              <stop offset="100%" stopColor="#fff" stopOpacity="0.08" />
            </linearGradient>
          </defs>
          <rect x="8" y="5" width="94" height="6" rx="3" fill="url(#cableGrad)" />
          <rect x="45" y="11" width="20" height="50" rx="5" fill="url(#cableGrad)" />
          <rect x="10" y="130" width="90" height="45" rx="6" fill="url(#cableGrad)" />
          <rect x="10" y="95" width="90" height="6" rx="3" fill="url(#cableGrad)" />
          <rect x="50" y="60" width="10" height="40" rx="3" fill="url(#cableGrad)" opacity="0.3" />
          <circle cx="55" cy="55" r="4" fill="url(#cableGrad)" />
        </svg>
      );
    case 'dumbbell':
      return (
        <svg viewBox="0 0 100 60" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <defs>
            <linearGradient id="dumbGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#fff" stopOpacity="0.08" />
              <stop offset="50%" stopColor="#fff" stopOpacity="0.16" />
              <stop offset="100%" stopColor="#fff" stopOpacity="0.08" />
            </linearGradient>
          </defs>
          <rect x="2" y="18" width="16" height="24" rx="4" fill="url(#dumbGrad)" />
          <rect x="18" y="22" width="10" height="16" rx="2" fill="url(#dumbGrad)" opacity="0.6" />
          <rect x="28" y="18" width="6" height="24" rx="2" fill="url(#dumbGrad)" />
          <rect x="34" y="22" width="32" height="16" rx="3" fill="url(#dumbGrad)" />
          <rect x="66" y="18" width="6" height="24" rx="2" fill="url(#dumbGrad)" />
          <rect x="72" y="22" width="10" height="16" rx="2" fill="url(#dumbGrad)" opacity="0.6" />
          <rect x="82" y="18" width="16" height="24" rx="4" fill="url(#dumbGrad)" />
        </svg>
      );
    case 'barbell':
      return (
        <svg viewBox="0 0 180 50" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <defs>
            <linearGradient id="barGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#fff" stopOpacity="0.08" />
              <stop offset="50%" stopColor="#fff" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#fff" stopOpacity="0.08" />
            </linearGradient>
          </defs>
          <rect x="0" y="20" width="180" height="10" rx="5" fill="url(#barGrad)" />
          <rect x="10" y="8" width="18" height="34" rx="4" fill="url(#barGrad)" />
          <rect x="36" y="12" width="8" height="26" rx="3" fill="url(#barGrad)" opacity="0.5" />
          <rect x="52" y="8" width="18" height="34" rx="4" fill="url(#barGrad)" />
          <rect x="110" y="8" width="18" height="34" rx="4" fill="url(#barGrad)" />
          <rect x="136" y="12" width="8" height="26" rx="3" fill="url(#barGrad)" opacity="0.5" />
          <rect x="152" y="8" width="18" height="34" rx="4" fill="url(#barGrad)" />
        </svg>
      );
    case 'plates':
      return (
        <svg viewBox="0 0 90 110" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <defs>
            <radialGradient id="plateGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fff" stopOpacity="0.12" />
              <stop offset="70%" stopColor="#fff" stopOpacity="0.06" />
              <stop offset="100%" stopColor="#fff" stopOpacity="0.02" />
            </radialGradient>
          </defs>
          <circle cx="45" cy="30" r="26" stroke="url(#barGrad)" strokeWidth="4" fill="url(#plateGrad)" />
          <circle cx="45" cy="30" r="10" fill="url(#barGrad)" opacity="0.4" />
          <circle cx="45" cy="80" r="26" stroke="url(#barGrad)" strokeWidth="4" fill="url(#plateGrad)" />
          <circle cx="45" cy="80" r="10" fill="url(#barGrad)" opacity="0.4" />
          <line x1="45" y1="10" x2="45" y2="56" stroke="url(#barGrad)" strokeWidth="5" opacity="0.3" />
          <line x1="45" y1="60" x2="45" y2="100" stroke="url(#barGrad)" strokeWidth="5" opacity="0.3" />
        </svg>
      );
    default:
      return null;
  }
}

export default function Hero() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });

  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      setMousePos({
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      });
    };
    window.addEventListener('mousemove', handleMouse, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouse);
  }, []);

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

  const particles = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: 1.5 + Math.random() * 3,
    duration: 8 + Math.random() * 20,
    delay: Math.random() * 8,
    startOpacity: 0.05 + Math.random() * 0.15,
  }));

  const smokeBlobs = [
    { id: 0, x: '15%', y: '25%', w: 400, h: 400, delay: 0, dur: 14 },
    { id: 1, x: '70%', y: '55%', w: 350, h: 350, delay: 3, dur: 18 },
    { id: 2, x: '60%', y: '18%', w: 280, h: 280, delay: 6, dur: 12 },
    { id: 3, x: '25%', y: '70%', w: 320, h: 320, delay: 2, dur: 16 },
    { id: 4, x: '80%', y: '75%', w: 250, h: 250, delay: 5, dur: 13 },
    { id: 5, x: '45%', y: '45%', w: 200, h: 200, delay: 4, dur: 10 },
  ];

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20"
    >
      {/* Base background */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-950 via-[#0a0a0a] to-black">
        {/* Spotlights */}
        <div className="absolute top-0 left-1/4 w-[700px] h-[900px] bg-gradient-radial from-[#DC2626]/10 via-[#DC2626]/3 to-transparent opacity-60" />
        <div className="absolute top-1/4 right-1/5 w-[500px] h-[700px] bg-gradient-radial from-[#DC2626]/6 via-transparent to-transparent opacity-40" />
        <div className="absolute bottom-0 left-1/3 w-[600px] h-[500px] bg-gradient-radial from-[#DC2626]/8 via-transparent to-transparent opacity-50" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-gradient-radial from-white/[0.02] via-transparent to-transparent" />

        {/* Red ambient glows */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-[#DC2626]/10 rounded-full blur-[150px] animate-pulse" />
          <div
            className="absolute bottom-1/3 right-1/4 w-[500px] h-[500px] bg-red-800/8 rounded-full blur-[130px] animate-pulse"
            style={{ animationDelay: '2.5s' }}
          />
          <div
            className="absolute top-1/2 left-1/2 w-[400px] h-[400px] bg-[#DC2626]/5 rounded-full blur-[120px] animate-pulse"
            style={{ animationDelay: '4s' }}
          />
        </div>
      </div>

      {/* Smoke blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        {smokeBlobs.map((blob) => (
          <motion.div
            key={blob.id}
            className="absolute rounded-full bg-gradient-radial from-white/[0.03] via-white/[0.008] to-transparent"
            style={{ left: blob.x, top: blob.y, width: blob.w, height: blob.h }}
            animate={{
              x: [0, 40, -30, 20, 0],
              y: [0, -50, 25, -20, 0],
              opacity: [0.1, 0.2, 0.06, 0.15, 0.1],
              scale: [1, 1.12, 0.92, 1.05, 1],
            }}
            transition={{
              duration: blob.dur,
              delay: blob.delay,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      {/* Floating Equipment with parallax & blur */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-[1]" aria-hidden="true">
        {equipmentList.map((eq) => {
          const px = (mousePos.x - 0.5) * 30;
          const py = (mousePos.y - 0.5) * 30;

          const posStyle: React.CSSProperties = {
            top: eq.top,
            width: eq.width,
            height: eq.height,
            transform: `translate(${px}px, ${py}px)`,
            transition: 'transform 0.3s ease-out',
          };
          if (eq.left) posStyle.left = eq.left;
          if (eq.right) posStyle.right = eq.right;

          return (
            <div
              key={eq.id}
              className="absolute"
              style={posStyle}
            >
              <motion.div
                className="w-full h-full"
                animate={{
                  y: [0, -16, 8, -12, 0],
                  x: [0, 8, -12, 4, 0],
                  rotate: [eq.rotate, eq.rotate + 3, eq.rotate - 2, eq.rotate + 2, eq.rotate],
                  opacity: [0.35, 0.55, 0.25, 0.45, 0.35],
                  filter: [
                    'blur(0px)',
                    'blur(1px)',
                    'blur(0.5px)',
                    'blur(1.5px)',
                    'blur(0px)',
                  ],
                }}
                transition={{
                  duration: 8 + Math.random() * 4,
                  delay: Math.random() * 3,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                <EquipmentSVG id={eq.id} className="w-full h-full" />
              </motion.div>
              <div
                className="absolute inset-0 -z-10 rounded-full blur-3xl"
                style={{
                  background: `radial-gradient(circle, rgba(220,38,38,${0.04 + (mousePos.x * 0.03 + mousePos.y * 0.02)}) 0%, transparent 70%)`,
                }}
              />
            </div>
          );
        })}
      </div>

      {/* Floating Particles */}
      <div
        className="absolute inset-0 overflow-hidden pointer-events-none z-[1]"
        aria-hidden="true"
      >
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-full"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              background: `radial-gradient(circle, rgba(255,255,255,${p.startOpacity * 2}) 0%, transparent 70%)`,
            }}
            animate={{
              y: [0, -60, 20, -30, 0],
              x: [0, 15, -20, 10, 0],
              opacity: [p.startOpacity, p.startOpacity * 3, p.startOpacity * 0.5, p.startOpacity * 2, p.startOpacity],
              scale: [1, 1.3, 0.8, 1.1, 1],
            }}
            transition={{
              duration: p.duration,
              delay: p.delay,
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
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20"
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
