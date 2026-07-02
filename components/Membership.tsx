"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const plans = [
  { duration: "1 Month", price: "₹1500", savings: null },
  { duration: "3 Months", price: "₹4000", savings: "Save ₹500" },
  {
    duration: "6 Months",
    price: "₹7000",
    savings: "Save ₹2000",
    featured: true,
  },
  { duration: "12 Months", price: "₹9000", savings: "Save ₹9000" },
];

export default function Membership() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const item = {
    hidden: { y: 40, opacity: 0 },
    show: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.7 },
    },
  };

  return (
    <section
      id="membership"
      className="py-20 sm:py-32 bg-gradient-to-b from-black to-gray-950"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            Choose Your <span className="text-[#DC2626]">Plan</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Flexible membership options to fit your fitness journey
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              variants={item}
              whileHover={{ y: -12, scale: 1.02 }}
              transition={{ duration: 0.3 }}
              className={`relative glass rounded-2xl p-8 text-center transition-all duration-300 ${
                plan.featured
                  ? "border-[#DC2626]/50 shadow-2xl shadow-[#DC2626]/20"
                  : "border-white/10 hover:border-white/20"
              }`}
            >
              {plan.savings && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#DC2626] text-white text-xs font-bold px-4 py-1 rounded-full">
                  {plan.savings}
                </div>
              )}
              <h3 className="text-xl font-bold mb-4 text-gray-300">
                {plan.duration}
              </h3>
              <div className="mb-6">
                <span className="text-5xl font-black text-white">
                  {plan.price}
                </span>
              </div>
              {/* Link replaces the non-functional button — preserves all existing styles */}
              <Link
                href="/signup"
                aria-label={`Join Now — ${plan.duration} plan at ${plan.price}`}
                className={`block w-full rounded-full font-semibold transition-all duration-300 ${
                  plan.featured
                    ? "bg-[#DC2626] text-white hover:bg-[#B91C1C] hover:shadow-xl hover:shadow-[#DC2626]/40 py-4 text-lg"
                    : "border border-white/20 text-white hover:border-[#DC2626] hover:text-[#DC2626] py-3"
                }`}
              >
                Join Now
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
