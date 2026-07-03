'use client';

import { motion } from 'framer-motion';
import { Dumbbell, Heart, Trophy, Zap } from 'lucide-react';

export default function About() {
  const stats = [
    { icon: Dumbbell, value: '5+', label: 'Years Experience' },
    { icon: Trophy, value: '200+', label: 'Happy Members' },
    { icon: Zap, value: '24/7', label: 'Access (Soon)' },
    { icon: Heart, value: '100%', label: 'Dedication' },
  ];

  return (
    <section className="py-20 sm:py-32 bg-gradient-to-b from-gray-950 to-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
              About <span className="text-[#DC2626]">Gym 56</span>
            </h2>
            <p className="text-gray-400 text-lg mb-6 leading-relaxed">
              Welcome to Gym 56, your premier fitness destination located at 2nd Floor, Yogi Mall, Green City, Sector 26, Gandhinagar. We specialize in modern strength training, functional fitness, muscle building, and weight loss, all within a professional and friendly atmosphere.
            </p>
            <p className="text-gray-400 text-lg mb-8 leading-relaxed">
              Our facility is equipped with cutting-edge equipment including cable crossover towers, power racks, leg press/hack squat machines, and premium cardio gear. Whether you are a beginner or an experienced lifter, our expert guidance and supportive environment will help you achieve your healthy lifestyle goals.
            </p>
            
            <div className="grid grid-cols-2 gap-6">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="glass rounded-2xl p-6 text-center"
                >
                  <stat.icon className="w-10 h-10 text-[#DC2626] mx-auto mb-3" />
                  <div className="text-3xl font-black text-white mb-1">{stat.value}</div>
                  <div className="text-gray-400 text-sm">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="glass rounded-3xl p-2 border border-white/10">
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-[#DC2626]/20 to-black flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-[#DC2626]/10 to-transparent" />
                <div className="relative z-10 text-center">
                  <Dumbbell className="w-32 h-32 text-[#DC2626]/30 mx-auto mb-4" />
                  <p className="text-gray-500">Premium Gym Facility</p>
                </div>
              </div>
            </div>
            <motion.div
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -bottom-6 -left-6 glass rounded-2xl p-6 border border-[#DC2626]/30"
            >
              <Trophy className="w-12 h-12 text-[#DC2626] mb-2" />
              <p className="text-white font-bold">Best Gym</p>
              <p className="text-gray-400 text-sm">Gandhinagar</p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
