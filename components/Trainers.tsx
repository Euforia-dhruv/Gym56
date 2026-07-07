'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';

const trainers = [
  {
    name: 'Yash Rathod',
    image: '/trainers/Yash Rathod.jpeg',
  },
  {
    name: 'Luckyrajsinh Jadeja',
    image: '/trainers/Luckyrajsinh Jadeja.png',
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
          className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto"
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
                <Image
                  src={trainer.image}
                  alt={trainer.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <div className="p-6 text-center">
                <h3 className="text-xl font-bold">{trainer.name}</h3>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
