"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";

interface Props {
  title: string;
  icon: ReactNode;
  color: string;
  children: ReactNode;
}

export function CalculatorCard({ title, icon, color, children }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-2xl border border-white/5 overflow-hidden"
    >
      <div className="p-6 border-b border-white/5 flex items-center gap-3" style={{ borderLeftColor: color, borderLeftWidth: 3 }}>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${color}15` }}>
          <div style={{ color }}>{icon}</div>
        </div>
        <h2 className="text-lg font-bold text-white">{title}</h2>
      </div>
      <div className="p-6">{children}</div>
    </motion.div>
  );
}
