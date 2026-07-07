"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowLeft, Dumbbell, AlertTriangle, Shield } from "lucide-react";
import { getDifficultyColor } from "@/lib/utils";

interface ExerciseCompare {
  id: string;
  name: string;
  slug: string;
  category: string;
  difficulty: string;
  equipment_label: string | null;
  target_muscles: string[];
  secondary_muscles: string[];
  common_mistakes: string[];
  safety_tips: string[];
  breathing: string | null;
  muscle_group: string | null;
  thumbnail_url: string | null;
  primary_image_url: string | null;
  variations: string[];
  alternatives: string[];
  progressions: string[];
  regressions: string[];
  beginner_tips: string[];
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[140px_repeat(auto-fit,minmax(0,1fr))] gap-4 border-b border-white/5 py-4">
      <div className="text-sm text-gray-500 font-medium sticky left-0">{label}</div>
      {children}
    </div>
  );
}

function Cell({ children }: { children: React.ReactNode }) {
  return <div className="text-sm text-gray-300 min-w-0">{children}</div>;
}

export default function ExerciseComparePage() {
  const searchParams = useSearchParams();
  const [exercises, setExercises] = useState<ExerciseCompare[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentIds = searchParams.get("ids")?.split(",").filter(Boolean) ?? [];
    if (currentIds.length === 0) { setLoading(false); return; }
    Promise.all(
      currentIds.map((id) =>
        fetch(`/api/exercises/${id}`)
          .then((r) => r.json())
          .catch(() => null)
      )
    ).then((results) => {
      setExercises(results.filter(Boolean));
      setLoading(false);
    });
  }, [searchParams]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center pt-20">
        <div className="w-8 h-8 border-2 border-[#DC2626] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (exercises.length === 0) {
    return (
      <div className="min-h-screen bg-black pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <Dumbbell className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-white mb-4">No Exercises to Compare</h1>
          <p className="text-gray-400 mb-8">Select exercises from the library to compare them side by side.</p>
          <Link href="/exercises" className="text-[#DC2626] hover:text-white transition-colors font-semibold">
            Back to Exercise Library
          </Link>
        </div>
      </div>
    );
  }

  const gridCols = `grid-cols-[140px_repeat(${exercises.length},minmax(0,1fr))]`;

  return (
    <div className="min-h-screen bg-black pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <Link
          href="/exercises"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Exercises
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">Exercise Comparison</h1>
          <p className="text-gray-400 mb-8">Comparing {exercises.length} exercises side by side</p>

          <div className="overflow-x-auto">
            <div className="min-w-[600px]">
              {/* Header Cards */}
              <div className={`${gridCols} gap-4 mb-6`}>
                <div />
                {exercises.map((ex) => (
                  <Link
                    key={ex.id}
                    href={`/exercise/${ex.slug}`}
                    className="glass rounded-xl p-4 hover:border-[#DC2626]/30 transition-all"
                  >
                    {/* Thumbnail */}
                    <div className="aspect-video rounded-lg overflow-hidden bg-gray-900 mb-3 relative">
                      {(ex.thumbnail_url || ex.primary_image_url) ? (
                        <Image
                          src={ex.thumbnail_url || ex.primary_image_url!}
                          alt={ex.name}
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 100vw, 50vw"
                          unoptimized={(ex.thumbnail_url || ex.primary_image_url || '').endsWith('.gif')}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Dumbbell className="w-8 h-8 text-white/10" />
                        </div>
                      )}
                    </div>
                    <h3 className="font-bold text-white text-sm mb-1">{ex.name}</h3>
                    <span className={`inline-block px-2 py-0.5 text-[10px] font-semibold rounded-full border ${getDifficultyColor(ex.difficulty)}`}>
                      {ex.difficulty}
                    </span>
                  </Link>
                ))}
              </div>

              <div className="glass rounded-2xl p-6">
                <Row label="Category">
                  {exercises.map((ex) => <Cell key={ex.id}>{ex.category}</Cell>)}
                </Row>

                <Row label="Muscle Group">
                  {exercises.map((ex) => <Cell key={ex.id}>{ex.muscle_group || "—"}</Cell>)}
                </Row>

                <Row label="Equipment">
                  {exercises.map((ex) => <Cell key={ex.id}>{ex.equipment_label || "Bodyweight"}</Cell>)}
                </Row>

                <Row label="Target Muscles">
                  {exercises.map((ex) => (
                    <Cell key={ex.id}>
                      <div className="flex flex-wrap gap-1">
                        {ex.target_muscles?.map((m, i) => (
                          <span key={i} className="px-2 py-0.5 bg-white/10 rounded text-[11px]">{m}</span>
                        ))}
                      </div>
                    </Cell>
                  ))}
                </Row>

                <Row label="Secondary Muscles">
                  {exercises.map((ex) => (
                    <Cell key={ex.id}>
                      {ex.secondary_muscles?.length ? (
                        <div className="flex flex-wrap gap-1">
                          {ex.secondary_muscles.map((m, i) => (
                            <span key={i} className="px-2 py-0.5 bg-white/5 rounded text-[11px] text-gray-400">{m}</span>
                          ))}
                        </div>
                      ) : "—"}
                    </Cell>
                  ))}
                </Row>

                <Row label="Breathing">
                  {exercises.map((ex) => <Cell key={ex.id}>{ex.breathing || "—"}</Cell>)}
                </Row>

                <Row label="Common Mistakes">
                  {exercises.map((ex) => (
                    <Cell key={ex.id}>
                      {ex.common_mistakes?.length ? (
                        <ul className="space-y-1">
                          {ex.common_mistakes.map((m, i) => (
                            <li key={i} className="text-red-400 text-[11px] flex items-start gap-1">
                              <AlertTriangle className="w-3 h-3 flex-shrink-0 mt-0.5" />
                              {m}
                            </li>
                          ))}
                        </ul>
                      ) : "—"}
                    </Cell>
                  ))}
                </Row>

                <Row label="Safety Tips">
                  {exercises.map((ex) => (
                    <Cell key={ex.id}>
                      {ex.safety_tips?.length ? (
                        <ul className="space-y-1">
                          {ex.safety_tips.map((t, i) => (
                            <li key={i} className="text-green-400 text-[11px] flex items-start gap-1">
                              <Shield className="w-3 h-3 flex-shrink-0 mt-0.5" />
                              {t}
                            </li>
                          ))}
                        </ul>
                      ) : "—"}
                    </Cell>
                  ))}
                </Row>

                <Row label="Variations">
                  {exercises.map((ex) => (
                    <Cell key={ex.id}>
                      {ex.variations?.length ? ex.variations.slice(0, 3).join(", ") + (ex.variations.length > 3 ? "..." : "") : "—"}
                    </Cell>
                  ))}
                </Row>

                <Row label="Progressions">
                  {exercises.map((ex) => (
                    <Cell key={ex.id}>
                      {ex.progressions?.length ? ex.progressions.slice(0, 3).join(", ") + (ex.progressions.length > 3 ? "..." : "") : "—"}
                    </Cell>
                  ))}
                </Row>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
