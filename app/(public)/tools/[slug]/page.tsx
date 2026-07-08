"use client";

import { useState, type ReactNode } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getCalculator, CALCULATORS } from "@/components/tools/registry";
import {
  BMICalculator, BMRCalculator, TDEECalculator, MacrosCalculator,
  ProteinCalculator, WaterCalculator, CaloriesCalculator, OneRepMaxCalculator,
  WilksCalculator, DOTSCalculator, PlateCalculator, BodyFatCalculator,
  LeanBodyMassCalculator, FFMICalculator, IdealWeightCalculator,
  WaistHeightRatioCalculator, HeartRateZonesCalculator, PaceCalculator,
  CaloriesBurnedCalculator, VO2MaxCalculator,
} from "@/components/tools/calculators";
import { motion } from "framer-motion";

const CALC_MAP: Record<string, (props: { onResult: (r: Record<string, string | number>) => void }) => ReactNode> = {
  bmi: BMICalculator,
  bmr: BMRCalculator,
  tdee: TDEECalculator,
  macros: MacrosCalculator,
  protein: ProteinCalculator,
  water: WaterCalculator,
  calories: CaloriesCalculator,
  "one-rep-max": OneRepMaxCalculator,
  wilks: WilksCalculator,
  dots: DOTSCalculator,
  "plate-calculator": PlateCalculator,
  "body-fat": BodyFatCalculator,
  "lean-body-mass": LeanBodyMassCalculator,
  ffmi: FFMICalculator,
  "ideal-weight": IdealWeightCalculator,
  "waist-height-ratio": WaistHeightRatioCalculator,
  "heart-rate-zones": HeartRateZonesCalculator,
  "pace-calculator": PaceCalculator,
  "calories-burned": CaloriesBurnedCalculator,
  "vo2-max": VO2MaxCalculator,
};

export default function ToolDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const calc = getCalculator(slug);
  const [results, setResults] = useState<Record<string, string | number>>({});

  const Component = slug ? CALC_MAP[slug] : null;

  if (!calc || !Component) {
    return (
      <div className="min-h-screen bg-black pt-20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-2">Calculator not found</h1>
          <p className="text-gray-500 mb-4">The calculator you&apos;re looking for doesn&apos;t exist.</p>
          <Link href="/tools" className="text-[#DC2626] hover:underline">Back to all tools</Link>
        </div>
      </div>
    );
  }

  const similar = CALCULATORS.filter((c) => c.category === calc.category && c.slug !== calc.slug).slice(0, 3);

  return (
    <div className="min-h-screen bg-black pt-20">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link href="/tools" className="inline-flex items-center gap-2 text-gray-500 hover:text-white transition-colors mb-6 text-sm">
          <ArrowLeft className="w-4 h-4" /> Back to all tools
        </Link>

        <Component onResult={setResults} />

        {Object.keys(results).length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-2xl border border-white/5 p-6 mt-6"
          >
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Your Results</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {Object.entries(results).map(([key, val]) => (
                <div key={key} className="bg-white/5 rounded-xl px-3 py-2">
                  <p className="text-xs text-gray-500">{key.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase())}</p>
                  <p className="text-sm font-semibold text-white">{String(val)}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {similar.length > 0 && (
          <div className="mt-12">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Similar Tools</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {similar.map((c) => (
                <Link
                  key={c.slug}
                  href={`/tools/${c.slug}`}
                  className="glass rounded-xl p-4 border border-white/5 hover:border-[#DC2626]/30 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <c.icon className="w-4 h-4" style={{ color: c.color }} />
                    <span className="text-sm text-white font-medium">{c.name}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
