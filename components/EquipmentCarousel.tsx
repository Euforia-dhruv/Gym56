'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Dumbbell, Target } from 'lucide-react';
import type { Exercise } from '@/types';
import { cn } from '@/lib/utils';

const IMAGEKIT_BASE = 'https://ik.imagekit.io/yuhonas';

export default function EquipmentCarousel({ exercises }: { exercises: Exercise[] }) {
  if (exercises.length === 0) return null;

  const duplicated = [...exercises, ...exercises, ...exercises];

  return (
    <section className="py-16 sm:py-20 bg-black overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            Premium <span className="text-[#DC2626]">Equipment</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Top-tier machines and free weights for every workout
          </p>
        </motion.div>
      </div>

      <div className="relative">
        <motion.div
          className="flex gap-6 px-4"
          animate={{ x: [0, -((exercises.length * 300) + (exercises.length - 1) * 24)] }}
          transition={{
            x: {
              duration: exercises.length * 8,
              repeat: Infinity,
              ease: 'linear',
            },
          }}
        >
          {duplicated.map((item, index) => {
            const imgUrl = item.images?.[0]
              ? `${IMAGEKIT_BASE}/${item.images[0]}`
              : item.thumbnail_url || item.primary_image_url;

            return (
              <Link
                key={`${item.id}-${index}`}
                href={`/exercise/${item.slug}`}
                className="flex-shrink-0 group"
              >
                <motion.div
                  whileHover={{ y: -8, scale: 1.03 }}
                  transition={{ duration: 0.3 }}
                  className="w-[280px] glass rounded-2xl overflow-hidden border border-white/10 hover:border-[#DC2626]/40 transition-all duration-300"
                >
                  <div className="aspect-[4/3] bg-gradient-to-br from-gray-900 to-black relative overflow-hidden">
                    {imgUrl ? (
                      <img
                        src={imgUrl}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full gap-2">
                        <Dumbbell className="w-12 h-12 text-[#DC2626]/40" />
                        <span className="text-gray-600 text-sm">No image</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-white truncate group-hover:text-[#DC2626] transition-colors">
                      {item.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-2">
                      {item.equipment_label && (
                        <span className="text-xs text-gray-500 uppercase tracking-wider">{item.equipment_label}</span>
                      )}
                      <span className={cn(
                        'text-[10px] font-semibold px-2 py-0.5 rounded-full',
                        item.difficulty === 'Beginner' ? 'text-green-400 bg-green-400/10' :
                        item.difficulty === 'Intermediate' ? 'text-yellow-400 bg-yellow-400/10' :
                        'text-red-400 bg-red-400/10'
                      )}>
                        {item.difficulty}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {item.target_muscles.slice(0, 2).map((m) => (
                        <span key={m} className="inline-flex items-center gap-0.5 text-[10px] text-gray-400 bg-white/5 rounded-full px-2 py-0.5">
                          <Target className="w-2.5 h-2.5" />
                          {m}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </Link>
            );
          })}
        </motion.div>

        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-black to-transparent pointer-events-none z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-black to-transparent pointer-events-none z-10" />
      </div>
    </section>
  );
}
