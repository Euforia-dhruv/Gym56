'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';

const faqs = [
  {
    question: 'What are the gym operating hours?',
    answer: 'Gym 56 is open Monday through Saturday from 6:00 AM – 10:00 AM and 5:00 PM – 10:00 PM. We are closed on Sundays.',
  },
  {
    question: 'What services do you offer?',
    answer: 'We offer three core programs: Strength Training, Weight Loss programs, and Personal Training — all guided by experienced coaches.',
  },
  {
    question: 'What equipment is available at Gym 56?',
    answer: 'Our gym includes Cable Crossover/Functional Trainer (Dual Stack), Lat Pulldown/Low Row, Pec Deck/Rear Delt Fly, Leg Press/Hack Squat, Adjustable Flat-Incline Benches, Leg Extension/Leg Curl, Flat Bench Press, HKF Strength Power Rack/Squat Rack, Cardio Treadmills, Spin Bikes, Dumbbell Rack, Barbells, EZ Curl Bar, and Weight Plates.',
  },
  {
    question: 'Do you offer personal training?',
    answer: 'Yes! We offer personal guidance and one-on-one training to help you reach your fitness goals.',
  },
  {
    question: 'Where is Gym 56 located?',
    answer: 'We are located at 2nd Floor, Yogi Mall, Behind D-Mart, Green City, Sector 26, Gandhinagar, Gujarat 382028.',
  },
  {
    question: 'How can I contact you?',
    answer: 'You can reach us by phone at +91 99244 41179 or visit us during our operating hours.',
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        const nextIndex = (index + 1) % faqs.length;
        itemRefs.current[nextIndex]?.focus();
        break;
      case 'ArrowUp':
        e.preventDefault();
        const prevIndex = (index - 1 + faqs.length) % faqs.length;
        itemRefs.current[prevIndex]?.focus();
        break;
      case 'Home':
        e.preventDefault();
        itemRefs.current[0]?.focus();
        break;
      case 'End':
        e.preventDefault();
        itemRefs.current[faqs.length - 1]?.focus();
        break;
    }
  };

  return (
    <section className="py-20 sm:py-32 bg-black">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            Frequently Asked <span className="text-[#DC2626]">Questions</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Find answers to common questions about our gym
          </p>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="glass rounded-2xl overflow-hidden"
            >
              <button
                ref={(el) => { itemRefs.current[index] = el; }}
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-white/5 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#DC2626]"
                aria-expanded={openIndex === index}
                aria-controls={`faq-content-${index}`}
                id={`faq-button-${index}`}
              >
                <span className="text-lg font-semibold">{faq.question}</span>
                {openIndex === index ? (
                  <ChevronUp className="w-6 h-6 text-[#DC2626]" aria-hidden="true" />
                ) : (
                  <ChevronDown className="w-6 h-6 text-gray-400" aria-hidden="true" />
                )}
              </button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    id={`faq-content-${index}`}
                    role="region"
                    aria-labelledby={`faq-button-${index}`}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="px-6 pb-5 text-gray-400">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
