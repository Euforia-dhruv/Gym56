'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState, useRef } from 'react';
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

interface EquipmentItem {
  src: string;
  label: string;
  size: number;
  rotate: number;
  blur: number;
  floatDuration: number;
  floatDelay: number;
  parallaxPx: number;
  depthLayer: 'background' | 'middle' | 'foreground';
  desktop: { top?: string; bottom?: string; left?: string; right?: string };
  hideOnMobile: boolean;
  href: string;
}

const equipmentData: EquipmentItem[] = [
  {
    src: '/hero/rope.png',
    label: 'rope',
    size: 120,
    rotate: -25,
    blur: 8,
    floatDuration: 11,
    floatDelay: 0.3,
    parallaxPx: 6,
    depthLayer: 'background',
    hideOnMobile: true,
    desktop: { top: '70px', left: '30px' },
    href: '/exercises?equipment=Bodyweight',
  },
  {
    src: '/hero/barbell.png',
    label: 'barbell',
    size: 240,
    rotate: 18,
    blur: 8,
    floatDuration: 9,
    floatDelay: 1.8,
    parallaxPx: 6,
    depthLayer: 'background',
    hideOnMobile: false,
    desktop: { top: '80px', right: '-20px' },
    href: '/exercises?equipment=Barbell',
  },
  {
    src: '/hero/cycle.png',
    label: 'cycle',
    size: 260,
    rotate: 12,
    blur: 5,
    floatDuration: 8,
    floatDelay: 4.2,
    parallaxPx: 12,
    depthLayer: 'middle',
    hideOnMobile: true,
    desktop: { top: '38%', right: '-60px' },
    href: '/exercises?equipment=Machine',
  },
  {
    src: '/hero/bench.png',
    label: 'bench',
    size: 220,
    rotate: -8,
    blur: 5,
    floatDuration: 10,
    floatDelay: 6.5,
    parallaxPx: 12,
    depthLayer: 'middle',
    hideOnMobile: true,
    desktop: { bottom: '70px', right: '-40px' },
    href: '/exercises?equipment=Barbell',
  },
  {
    src: '/hero/treadmill.png',
    label: 'treadmill',
    size: 260,
    rotate: -15,
    blur: 2,
    floatDuration: 7,
    floatDelay: 2.7,
    parallaxPx: 18,
    depthLayer: 'foreground',
    hideOnMobile: true,
    desktop: { top: '44%', left: '-80px' },
    href: '/exercises?equipment=Machine',
  },
  {
    src: '/hero/dumbell.png',
    label: 'dumbell',
    size: 190,
    rotate: -22,
    blur: 0,
    floatDuration: 12,
    floatDelay: 5.8,
    parallaxPx: 18,
    depthLayer: 'foreground',
    hideOnMobile: false,
    desktop: { bottom: '50px', left: '-30px' },
    href: '/exercises?equipment=Dumbbell',
  },
];

function maskForDepth(depth: string, label: string): string | undefined {
  if (label === 'treadmill' || label === 'barbell' || label === 'bench' || label === 'cycle') {
    if (label === 'treadmill') return 'linear-gradient(to right, transparent 0%, black 30%, black 100%)';
    if (label === 'barbell') return 'linear-gradient(to bottom, transparent 0%, black 25%, black 100%)';
    if (label === 'cycle') return 'linear-gradient(to left, transparent 0%, black 40%, black 100%)';
    if (label === 'bench') return 'linear-gradient(to left, transparent 0%, black 35%, black 100%)';
  }
  if (label === 'rope') return 'linear-gradient(to bottom, transparent 0%, black 20%, black 100%)';
  if (label === 'dumbell') return 'linear-gradient(to right, transparent 0%, black 20%, black 100%)';
  return undefined;
}

export default function Hero() {
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const sectionRef = useRef<HTMLDivElement>(null);

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

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20"
    >
      {/* Noise grain overlay */}
      <div
        className="absolute inset-0 z-[3] pointer-events-none"
        style={{
          opacity: 0.03,
          mixBlendMode: 'overlay',
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '256px 256px',
        }}
      />

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

      {/* Hero central ambient glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[1] pointer-events-none"
        style={{
          width: '700px',
          height: '500px',
          background: 'radial-gradient(ellipse, rgba(239,68,68,0.12) 0%, transparent 70%)',
        }}
      />

      {/* Vignette */}
      <div
        className="absolute inset-0 z-[2] pointer-events-none"
        style={{
          boxShadow: 'inset 0 0 150px 60px rgba(0,0,0,0.6)',
        }}
      />

      {/* Equipment */}
      <div className="absolute inset-0 overflow-hidden z-[1]">
        {equipmentData.map((eq) => {
          const px = (mousePos.x - 0.5) * eq.parallaxPx;
          const py = (mousePos.y - 0.5) * eq.parallaxPx;

          const mask = maskForDepth(eq.depthLayer, eq.label);

          const posStyle: React.CSSProperties = {
            width: eq.size,
            height: eq.size,
            transform: `translate(${px}px, ${py}px) rotate(${eq.rotate}deg)`,
            filter: `blur(${eq.blur}px)`,
            transition: 'transform 0.8s cubic-bezier(0.22, 1, 0.36, 1)',
            WebkitMaskImage: mask,
            maskImage: mask,
          };
          if (eq.desktop.top) posStyle.top = eq.desktop.top;
          if (eq.desktop.bottom) posStyle.bottom = eq.desktop.bottom;
          if (eq.desktop.left) posStyle.left = eq.desktop.left;
          if (eq.desktop.right) posStyle.right = eq.desktop.right;

          const classes = ['absolute'];
          if (eq.hideOnMobile) classes.push('hidden sm:block');

          return (
            <motion.div
              key={eq.label}
              className={classes.join(' ')}
              initial={{ opacity: 0 }}
              animate={{
                x: [0, 6, -4, 8, 0],
                y: [0, -10, 8, -6, 0],
                rotate: [eq.rotate, eq.rotate + 1.5, eq.rotate - 1, eq.rotate + 2, eq.rotate],
                opacity: [0.22, 0.28, 0.18, 0.25, 0.22],
              }}
              style={posStyle}
              transition={{
                x: {
                  duration: eq.floatDuration,
                  delay: eq.floatDelay,
                  repeat: Infinity,
                  ease: 'easeInOut',
                },
                y: {
                  duration: eq.floatDuration * 1.1,
                  delay: eq.floatDelay + 0.3,
                  repeat: Infinity,
                  ease: 'easeInOut',
                },
                rotate: {
                  duration: eq.floatDuration * 1.3,
                  delay: eq.floatDelay + 0.6,
                  repeat: Infinity,
                  ease: 'easeInOut',
                },
                opacity: {
                  duration: eq.floatDuration * 0.9,
                  delay: eq.floatDelay,
                  repeat: Infinity,
                  ease: 'easeInOut',
                },
              }}
              whileHover={{ opacity: 0.55, transition: { duration: 0.4 } }}
            >
              {/* Soft red glow behind equipment */}
              <div
                className="absolute"
                style={{
                  top: '-30%',
                  left: '-30%',
                  width: '160%',
                  height: '160%',
                  filter: 'blur(120px)',
                  background: 'radial-gradient(circle, rgba(239,68,68,0.15) 0%, rgba(239,68,68,0.06) 40%, transparent 70%)',
                  pointerEvents: 'none',
                }}
              />
              <a
                href={eq.href}
                className="relative block w-full h-full z-[1]"
                aria-label={`View ${eq.label} exercises`}
              >
                <Image
                  src={eq.src}
                  alt=""
                  width={eq.size}
                  height={eq.size}
                  className="w-full h-full object-contain"
                  draggable={false}
                  priority
                />
              </a>
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
