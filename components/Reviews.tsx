'use client';

import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const reviews = [
  {
    name: 'Rahul Patel',
    role: 'Fitness Enthusiast',
    content: 'Gym 56 has completely transformed my approach to fitness. The trainers are incredibly supportive and the atmosphere is motivating.',
    rating: 5,
  },
  {
    name: 'Priya Sharma',
    role: 'Yoga Practitioner',
    content: 'The clean environment and modern equipment make every workout a pleasure. Best gym in Gandhinagar by far!',
    rating: 5,
  },
  {
    name: 'Amit Singh',
    role: 'Bodybuilder',
    content: 'Been a member for 6 months and I\'ve seen amazing results. The 6-month plan is totally worth it.',
    rating: 5,
  },
];

export default function Reviews() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const item = {
    hidden: { y: 30, opacity: 0 },
    show: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.7, ease: 'easeOut' },
    },
  };

  return (
    <section className="py-20 sm:py-32 bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            What Our <span className="text-[#DC2626]">Members</span> Say
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Don&apos;t just take our word for it
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {reviews.map((review, index) => (
            <motion.div
              key={index}
              variants={item}
              whileHover={{ y: -8, scale: 1.02 }}
              transition={{ duration: 0.3 }}
              className="glass rounded-2xl p-8 hover:border-white/20 transition-all duration-300"
            >
              <div className="flex items-center gap-1 mb-6">
                {[...Array(review.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <p className="text-gray-300 mb-6 leading-relaxed">
                &quot;{review.content}&quot;
              </p>
              <div>
                <h4 className="font-bold text-lg">{review.name}</h4>
                <p className="text-gray-500 text-sm">{review.role}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
