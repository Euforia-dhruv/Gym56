'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight, User } from 'lucide-react';

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
    content: 'Been a member for 6 months and I have seen amazing results. The 6-month plan is totally worth it.',
    rating: 5,
  },
  {
    name: 'Neha Verma',
    role: 'CrossFit Trainer',
    content: 'The facilities at Gym 56 are top-notch. I love the variety of equipment available.',
    rating: 5,
  },
];

export default function Reviews() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextReview = () => {
    setCurrentIndex((prev) => (prev + 1) % reviews.length);
  };

  const prevReview = () => {
    setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  return (
    <section className="py-20 sm:py-32 bg-gray-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
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
            Do not just take our word for it
          </p>
        </motion.div>

        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
              className="glass rounded-3xl p-12 text-center"
            >
              <div className="flex items-center justify-center gap-1 mb-8">
                {[...Array(reviews[currentIndex].rating)].map((_, i) => (
                  <Star key={i} className="w-7 h-7 text-yellow-400 fill-yellow-400" />
                ))}
              </div>

              <p className="text-xl md:text-2xl text-gray-300 mb-10 leading-relaxed">
                {reviews[currentIndex].content}
              </p>

              <div className="flex items-center justify-center gap-4">
                <div className="w-16 h-16 rounded-full bg-[#DC2626]/10 flex items-center justify-center border border-[#DC2626]/30">
                  <User className="w-8 h-8 text-[#DC2626]" />
                </div>
                <div className="text-left">
                  <h4 className="font-bold text-xl">{reviews[currentIndex].name}</h4>
                  <p className="text-gray-500">{reviews[currentIndex].role}</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Buttons */}
          <button
            onClick={prevReview}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 glass rounded-full flex items-center justify-center hover:bg-[#DC2626] transition-all duration-300"
            aria-label="Previous review"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={nextReview}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 glass rounded-full flex items-center justify-center hover:bg-[#DC2626] transition-all duration-300"
            aria-label="Next review"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-3 mt-10">
            {reviews.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex ? 'bg-[#DC2626] w-8' : 'bg-white/30 hover:bg-white/50'
                }`}
                aria-label={`Go to review ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
