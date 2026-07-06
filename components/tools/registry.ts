import {
  Scale, Flame, Activity, Utensils, Drumstick, Droplet, Zap,
  Dumbbell, Trophy, Target, Calculator, Percent, Brain,
  Weight, Ruler, Heart, Footprints, Bike, Timer,
} from "lucide-react";
import { CalculatorDef } from "./types";

export const CALCULATORS: CalculatorDef[] = [
  { slug: "bmi", name: "BMI", description: "Body Mass Index — measure body fat based on height and weight", icon: Scale, category: "body", color: "#3B82F6" },
  { slug: "bmr", name: "BMR", description: "Basal Metabolic Rate — calories burned at complete rest", icon: Flame, category: "nutrition", color: "#EF4444" },
  { slug: "tdee", name: "TDEE", description: "Total Daily Energy Expenditure — total calories burned per day", icon: Activity, category: "nutrition", color: "#F59E0B" },
  { slug: "macros", name: "Macros", description: "Recommended macronutrient split for your goals", icon: Utensils, category: "nutrition", color: "#10B981" },
  { slug: "protein", name: "Protein", description: "Daily protein intake recommendations based on activity", icon: Drumstick, category: "nutrition", color: "#8B5CF6" },
  { slug: "water", name: "Water Intake", description: "Daily hydration needs based on weight and activity", icon: Droplet, category: "nutrition", color: "#06B6D4" },
  { slug: "calories", name: "Calories", description: "Calorie needs for maintenance, cutting, or bulking", icon: Zap, category: "nutrition", color: "#F97316" },
  { slug: "one-rep-max", name: "One Rep Max", description: "Estimate your 1RM from sub-maximal lifts", icon: Dumbbell, category: "performance", color: "#DC2626" },
  { slug: "wilks", name: "Wilks", description: "Powerlifting coefficient comparing strength across weight classes", icon: Trophy, category: "performance", color: "#EAB308" },
  { slug: "dots", name: "DOTS", description: "DOTS score — refined strength comparison across weight classes", icon: Target, category: "performance", color: "#14B8A6" },
  { slug: "plate-calculator", name: "Plate Calculator", description: "Calculate which plates to load on the barbell", icon: Calculator, category: "performance", color: "#6366F1" },
  { slug: "body-fat", name: "Body Fat", description: "Estimate body fat percentage from measurements", icon: Percent, category: "body", color: "#EC4899" },
  { slug: "lean-body-mass", name: "Lean Body Mass", description: "Your total body weight minus fat mass", icon: Brain, category: "body", color: "#A855F7" },
  { slug: "ffmi", name: "FFMI", description: "Fat-Free Mass Index — muscle mass relative to height", icon: Weight, category: "body", color: "#3B82F6" },
  { slug: "ideal-weight", name: "Ideal Weight", description: "Estimated healthy weight range for your height", icon: Ruler, category: "body", color: "#22C55E" },
  { slug: "waist-height-ratio", name: "Waist-Height Ratio", description: "Body fat distribution indicator and health risk", icon: Heart, category: "body", color: "#EF4444" },
  { slug: "heart-rate-zones", name: "Heart Rate Zones", description: "Target heart rate zones for training intensity", icon: Heart, category: "cardio", color: "#DC2626" },
  { slug: "pace-calculator", name: "Pace Calculator", description: "Running pace, speed, distance, and time calculations", icon: Footprints, category: "cardio", color: "#F59E0B" },
  { slug: "calories-burned", name: "Calories Burned", description: "Estimate calories burned during various activities", icon: Bike, category: "cardio", color: "#10B981" },
  { slug: "vo2-max", name: "VO2 Max", description: "Estimate your maximal oxygen uptake", icon: Timer, category: "cardio", color: "#8B5CF6" },
];

export function getCalculator(slug: string) {
  return CALCULATORS.find((c) => c.slug === slug);
}
