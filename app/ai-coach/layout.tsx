import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "AI Coach - Premium Fitness Assistant - Gym 56",
  description:
    "Get expert-level workout plans, nutrition guidance, and fitness advice from Gym 56's premium AI Coach. Workout generation, beginner guidance, fat loss plans, muscle gain programs, and more.",
  openGraph: {
    title: "AI Coach — Premium Fitness Assistant — Gym 56",
    description:
      "Expert-level workout plans, nutrition guidance, and personalized fitness advice powered by Gym 56's premium AI.",
    url: "https://gym56.vercel.app/ai-coach",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Coach — Premium Fitness Assistant — Gym 56",
    description:
      "Expert-level workout plans, nutrition guidance, and personalized fitness advice powered by Gym 56's premium AI.",
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How do I create a workout routine?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Start with your goals (strength, hypertrophy, endurance), choose a split (push/pull/legs, upper/lower, or full body), select compound exercises, set appropriate sets/reps, and progress overload over time.",
      },
    },
    {
      "@type": "Question",
      name: "What should I eat before and after a workout?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Before workout: eat carbs and protein 1-2 hours prior. Good options include a banana with peanut butter or oats with whey protein. After workout: consume protein and carbs within 2 hours for optimal recovery.",
      },
    },
    {
      "@type": "Question",
      name: "How do I properly perform a barbell squat?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Stand with feet shoulder-width apart, bar on upper back. Brace your core, push hips back, and descend until thighs are parallel. Keep chest up, knees tracking over toes. Drive through heels to stand back up.",
      },
    },
    {
      "@type": "Question",
      name: "What is the best approach for building muscle?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Progressive overload, adequate protein (1.6-2.2g per kg bodyweight), sufficient calories (maintenance or slight surplus), consistent sleep, and training each muscle group 2x per week.",
      },
    },
  ],
};

export default function AiCoachLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd data={faqSchema} />
      {children}
    </>
  );
}
