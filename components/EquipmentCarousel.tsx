'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';
import { getPublishedEquipment } from '@/lib/actions/equipment';
import { Dumbbell } from 'lucide-react';

interface EquipmentItem {
  id: string;
  name: string;
  slug: string;
  category: string;
  primary_image_url: string | null;
}

export default function EquipmentCarousel() {
  const [equipment, setEquipment] = useState<EquipmentItem[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getPublishedEquipment().then((data) => setEquipment(data));
  }, []);

  if (equipment.length === 0) return null;

  const duplicated = [...equipment, ...equipment, ...equipment];

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

      <div className="relative" ref={scrollRef}>
        <motion.div
          className="flex gap-6 px-4"
          animate={{ x: [0, -((equipment.length * 300) + (equipment.length - 1) * 24)] }}
          transition={{
            x: {
              duration: equipment.length * 8,
              repeat: Infinity,
              ease: 'linear',
            },
          }}
        >
          {duplicated.map((item, index) => (
            <Link
              key={`${item.id}-${index}`}
              href={`/equipment/${item.slug}`}
              className="flex-shrink-0 group"
            >
              <motion.div
                whileHover={{ y: -8, scale: 1.03 }}
                transition={{ duration: 0.3 }}
                className="w-[280px] glass rounded-2xl overflow-hidden border border-white/10 hover:border-[#DC2626]/40 transition-all duration-300"
              >
                <div className="aspect-[4/3] bg-gradient-to-br from-gray-900 to-black flex items-center justify-center relative overflow-hidden">
                  {item.primary_image_url ? (
                    <Image
                      src={item.primary_image_url}
                      alt={item.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                      sizes="280px"
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-2">
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
                  <p className="text-sm text-gray-500 mt-1 uppercase tracking-wider">{item.category}</p>
                </div>
              </motion.div>
            </Link>
          ))}
        </motion.div>

        {/* Gradient fades on edges */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-black to-transparent pointer-events-none z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-black to-transparent pointer-events-none z-10" />
      </div>
    </section>
  );
}
