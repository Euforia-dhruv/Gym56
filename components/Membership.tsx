"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { getActivePlans } from "@/lib/actions/memberships";
import { formatCurrency } from "@/lib/utils";
import { useEffect, useState } from "react";

interface Plan {
  id: string;
  name: string;
  duration_months: number;
  price_minor: number;
  currency: string;
  savings_label: string | null;
  is_featured: boolean;
}

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

export default function Membership() {
  const [plans, setPlans] = useState<Plan[]>([]);

  useEffect(() => {
    getActivePlans().then((data) => setPlans(data));
  }, []);

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
          {plans.map((plan) => (
            <motion.div
              key={plan.id}
              variants={item}
              whileHover={{ y: -12, scale: 1.02 }}
              transition={{ duration: 0.3 }}
              className={`relative glass rounded-2xl p-8 text-center transition-all duration-300 ${
                plan.is_featured
                  ? "border-[#DC2626]/50 shadow-2xl shadow-[#DC2626]/20"
                  : "border-white/10 hover:border-white/20"
              }`}
            >
              {plan.savings_label && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#DC2626] text-white text-xs font-bold px-4 py-1 rounded-full">
                  {plan.savings_label}
                </div>
              )}
              <h3 className="text-xl font-bold mb-4 text-gray-300">
                {plan.name}
              </h3>
              <div className="mb-6">
                <span className="text-5xl font-black text-white">
                  {formatCurrency(plan.price_minor, plan.currency)}
                </span>
              </div>
              <Link
                href="/signup"
                aria-label={`Join Now — ${plan.name} plan at ${formatCurrency(plan.price_minor, plan.currency)}`}
                className={`block w-full rounded-full font-semibold transition-all duration-300 ${
                  plan.is_featured
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
