'use client';

import { motion } from 'framer-motion';
import { Award, User } from 'lucide-react';
import CountUp from 'react-countup';

const transformations = [
  {
    name: 'Rahul',
    beforeWeight: 85,
    afterWeight: 70,
    beforeText: '85 kg',
    afterText: '70 kg',
    time: '3 Months',
    description: 'Lost 15 kg with consistent training',
  },
  {
    name: 'Priya',
    beforeText: 'Out of Shape',
    afterText: 'Strong & Fit',
    time: '6 Months',
    description: 'Complete lifestyle transformation',
  },
  {
    name: 'Amit',
    beforeText: 'Beginner',
    afterText: 'Competitive',
    time: '1 Year',
    description: 'From couch to competitive athlete',
  },
];

export default function Transformations() {
  return (
    <section className="py-20 sm:py-32 bg-gradient-to-b from-black to-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            Member <span className="text-[#DC2626]">Transformations</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Real results from real members
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {transformations.map((transformation, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: index * 0.15 }}
              whileHover={{ y: -12, scale: 1.02 }}
              className="glass rounded-3xl overflow-hidden hover:border-white/20 transition-all duration-300"
            >
              <div className="grid grid-cols-2">
                {/* Before */}
                <div className="bg-gradient-to-b from-gray-900 to-black p-6 text-center border-r border-white/10">
                  <span className="text-sm text-gray-400 font-semibold mb-2 block">Before</span>
                  <div className="w-20 h-20 rounded-full bg-gray-800/50 flex items-center justify-center mx-auto mb-4">
                    <User className="w-10 h-10 text-gray-500" />
                  </div>
                  {transformation.beforeWeight ? (
                    <div className="text-2xl font-bold text-gray-400">
                      <CountUp
                        end={transformation.beforeWeight}
                        duration={2.5}
                        enableScrollSpy
                        scrollSpyOnce
                      />
                      kg
                    </div>
                  ) : (
                    <p className="text-xl font-semibold text-gray-400">{transformation.beforeText}</p>
                  )}
                </div>

                {/* After */}
                <div className="bg-gradient-to-b from-[#DC2626]/10 to-black p-6 text-center">
                  <span className="text-sm text-[#DC2626] font-semibold mb-2 block">After</span>
                  <div className="w-20 h-20 rounded-full bg-[#DC2626]/10 flex items-center justify-center mx-auto mb-4 border border-[#DC2626]/30">
                    <User className="w-10 h-10 text-[#DC2626]" />
                  </div>
                  {transformation.afterWeight ? (
                    <div className="text-2xl font-bold text-white">
                      <CountUp
                        end={transformation.afterWeight}
                        duration={2.5}
                        enableScrollSpy
                        scrollSpyOnce
                      />
                      kg
                    </div>
                  ) : (
                    <p className="text-xl font-semibold text-white">{transformation.afterText}</p>
                  )}
                </div>
              </div>

              <div className="p-8 text-center">
                <div className="w-12 h-12 rounded-full bg-[#DC2626]/10 flex items-center justify-center mx-auto mb-4">
                  <Award className="w-6 h-6 text-[#DC2626]" />
                </div>
                <h3 className="text-2xl font-bold mb-2">{transformation.name}</h3>
                <p className="text-[#DC2626] font-semibold mb-4">{transformation.time}</p>
                <p className="text-gray-400 text-sm">{transformation.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
