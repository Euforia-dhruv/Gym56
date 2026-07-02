'use client';

import { motion } from 'framer-motion';
import CountUp from 'react-countup';
import { siteData } from '@/lib/siteData';

export default function TrustedSection() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const item = {
    hidden: { y: 30, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { duration: 0.7 } },
  };

  return (
    <section className="py-20 sm:py-24 bg-black relative overflow-hidden">
      {/* Subtle red glow background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#DC2626]/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            {siteData.trustedSection.title}
          </h2>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
        >
          {siteData.trustedSection.cards.map((card, index) => (
            <motion.div
              key={index}
              variants={item}
              whileHover={{ y: -10, transition: { duration: 0.3 } }}
              className="relative glass border border-white/10 hover:border-[#DC2626]/40 rounded-2xl p-8 text-center transition-all duration-300 overflow-hidden"
            >
              {/* Subtle glowing border */}
              <div className="absolute inset-0 rounded-2xl border border-[#DC2626]/20 pointer-events-none opacity-0 hover:opacity-100 transition-opacity duration-300" />

              <div className="text-4xl mb-4">{card.icon}</div>
              <h3 className="text-xl font-bold text-gray-300 mb-2">{card.title}</h3>
              <div className="mb-4">
                {typeof card.value === 'number' ? (
                  <span className="text-5xl font-black text-white">
                    <CountUp
                      end={card.value}
                      duration={2.5}
                      decimals={card.value % 1 !== 0 ? 1 : 0}
                      enableScrollSpy
                      scrollSpyOnce
                    />
                    {card.suffix}
                  </span>
                ) : (
                  <span className="text-3xl font-bold text-white">{card.value}</span>
                )}
              </div>
              <div className="text-gray-400 text-sm">
                {Array.isArray(card.subtitle) ? (
                  <ul className="space-y-1 text-left mx-auto max-w-xs">
                    {card.subtitle.map((item, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <span className="text-[#DC2626]">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                ) : (
                  card.subtitle
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center"
        >
          <a
            href={siteData.trustedSection.cta.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 text-lg font-semibold text-white bg-[#DC2626] hover:bg-[#B91C1C] rounded-full transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-[#DC2626]/30"
          >
            {siteData.trustedSection.cta.text}
          </a>
        </motion.div>
      </div>
    </section>
  );
}
