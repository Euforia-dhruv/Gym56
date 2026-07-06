"use client";

import { useState, useMemo } from "react";
import { CalculatorCard } from "./CalculatorCard";
import {
  Scale, Flame, Activity, Utensils, Drumstick, Droplet, Zap,
  Dumbbell, Trophy, Target, Calculator, Percent, Brain, Weight,
  Ruler, Heart, Footprints, Bike, Timer, AlertCircle, Info,
} from "lucide-react";

type ResultSetter = (r: Record<string, string | number>) => void;

const ACTIVITY_FACTORS: Record<string, { label: string; factor: number }> = {
  sedentary: { label: "Sedentary (desk job, no exercise)", factor: 1.2 },
  light: { label: "Light (1-3 days/week)", factor: 1.375 },
  moderate: { label: "Moderate (3-5 days/week)", factor: 1.55 },
  active: { label: "Active (6-7 days/week)", factor: 1.725 },
  extreme: { label: "Extreme (2x/day, physical job)", factor: 1.9 },
};

const PROTEIN_LEVELS: Record<string, { label: string; min: number; max: number }> = {
  sedentary: { label: "Sedentary (no exercise)", min: 0.8, max: 1.0 },
  moderate: { label: "Moderate (3-5x/week)", min: 1.4, max: 1.8 },
  active: { label: "Active (6-7x/week)", min: 1.6, max: 2.0 },
  athlete: { label: "Athlete / bodybuilder", min: 1.8, max: 2.2 },
};

const METS: Record<string, { label: string; met: number }> = {
  running: { label: "Running (moderate pace)", met: 8.0 },
  cycling: { label: "Cycling (moderate)", met: 6.0 },
  swimming: { label: "Swimming (leisurely)", met: 5.0 },
  walking: { label: "Walking (brisk)", met: 3.5 },
  weights: { label: "Weightlifting", met: 4.0 },
  hiit: { label: "HIIT / Circuit", met: 9.0 },
  yoga: { label: "Yoga / Stretching", met: 2.5 },
  elliptical: { label: "Elliptical", met: 5.0 },
};

function InputRow({ label, unit, value, onChange, min, max, step, error }: {
  label: string; unit: string; value: string; onChange: (v: string) => void;
  min?: number; max?: number; step?: number; error?: string;
}) {
  return (
    <div>
      <label className="text-sm text-gray-400 mb-1 block">
        {label} <span className="text-gray-600">({unit})</span>
      </label>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        min={min} max={max} step={step}
        className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 focus:border-[#DC2626] focus:outline-none focus:ring-1 focus:ring-[#DC2626] text-white placeholder-gray-600 text-sm"
      />
      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
    </div>
  );
}

function SelectRow({ label, value, onChange, options }: {
  label: string; value: string; onChange: (v: string) => void; options: { value: string; label: string }[];
}) {
  return (
    <div>
      <label className="text-sm text-gray-400 mb-1 block">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 focus:border-[#DC2626] focus:outline-none focus:ring-1 focus:ring-[#DC2626] text-white text-sm"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value} className="bg-gray-900">{o.label}</option>
        ))}
      </select>
    </div>
  );
}

function ResultDisplay({ label, value, unit, color, description }: { label: string; value: string | number; unit: string; color?: string; description?: string }) {
  return (
    <div className="glass rounded-xl p-4 border border-white/5 text-center flex-1 min-w-[120px]">
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className="text-2xl font-bold" style={{ color: color || "#DC2626" }}>{value} <span className="text-sm text-gray-500">{unit}</span></p>
      {description && <p className="text-xs text-gray-500 mt-1">{description}</p>}
    </div>
  );
}

function BarChart({ data, color = "#DC2626" }: { data: { label: string; value: number; max: number }[]; color?: string }) {
  return (
    <div className="space-y-2 mt-4">
      {data.map((d) => (
        <div key={d.label}>
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>{d.label}</span>
            <span>{d.value.toFixed(1)}</span>
          </div>
          <div className="h-2 bg-white/5 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min((d.value / d.max) * 100, 100)}%`, backgroundColor: color }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function InfoBox({ title, children, icon }: { title: string; children: React.ReactNode; icon?: React.ReactNode }) {
  return (
    <div className="glass rounded-xl p-4 border border-white/5 mt-4">
      <div className="flex items-center gap-2 mb-2">
        {icon || <Info className="w-4 h-4 text-[#DC2626]" />}
        <h4 className="text-sm font-semibold text-white">{title}</h4>
      </div>
      <p className="text-sm text-gray-400 leading-relaxed">{children}</p>
    </div>
  );
}

function validateNumber(v: string, min: number, max: number, label: string): string | undefined {
  const n = parseFloat(v);
  if (v === "" || isNaN(n)) return `${label} is required`;
  if (n < min) return `${label} must be at least ${min}`;
  if (n > max) return `${label} must be at most ${max}`;
  return undefined;
}


/* ─── BMI ─── */
export function BMICalculator({ onResult }: { onResult: ResultSetter }) {
  const [weight, setWeight] = useState(""); const [height, setHeight] = useState("");
  const [unit, setUnit] = useState("metric");
  const errW = validateNumber(weight, unit === "metric" ? 20 : 44, unit === "metric" ? 350 : 770, "Weight");
  const errH = validateNumber(height, unit === "metric" ? 50 : 20, unit === "metric" ? 280 : 110, "Height");

  const result = useMemo(() => {
    if (errW || errH) return null;
    const w = parseFloat(weight); const h = parseFloat(height);
    const wKg = unit === "metric" ? w : w * 0.453592;
    const hM = unit === "metric" ? h / 100 : h * 0.0254;
    const bmi = wKg / (hM * hM);
    let cat = ""; let color = "";
    if (bmi < 18.5) { cat = "Underweight"; color = "#F59E0B"; }
    else if (bmi < 25) { cat = "Normal"; color = "#22C55E"; }
    else if (bmi < 30) { cat = "Overweight"; color = "#F97316"; }
    else { cat = "Obese"; color = "#EF4444"; }
    const minHealthy = 18.5 * hM * hM;
    const maxHealthy = 24.9 * hM * hM;
    return { bmi, cat, color, minHealthy, maxHealthy, wKg, hM };
  }, [weight, height, unit, errW, errH]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useMemo(() => { if (result) onResult({ bmi: result.bmi.toFixed(1), category: result.cat, healthyRange: `${result.minHealthy.toFixed(0)}-${result.maxHealthy.toFixed(0)} kg` }); }, [result]);

  return (
    <CalculatorCard title="BMI Calculator" icon={<Scale className="w-5 h-5" />} color="#3B82F6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <SelectRow label="Unit System" value={unit} onChange={setUnit} options={[{ value: "metric", label: "Metric (kg, cm)" }, { value: "imperial", label: "Imperial (lb, in)" }]} />
        <div />
        <InputRow label="Weight" unit={unit === "metric" ? "kg" : "lb"} value={weight} onChange={setWeight} min={unit === "metric" ? 20 : 44} max={unit === "metric" ? 350 : 770} error={errW} />
        <InputRow label="Height" unit={unit === "metric" ? "cm" : "in"} value={height} onChange={setHeight} min={unit === "metric" ? 50 : 20} max={unit === "metric" ? 280 : 110} error={errH} />
      </div>
      {result && (
        <div className="mt-6 space-y-4">
          <div className="flex flex-wrap gap-3">
            <ResultDisplay label="BMI" value={result.bmi.toFixed(1)} unit="kg/m²" color={result.color} description={result.cat} />
            <ResultDisplay label="Healthy Weight Range" value={`${result.minHealthy.toFixed(0)} - ${result.maxHealthy.toFixed(0)}`} unit="kg" />
          </div>
          <BarChart data={[
            { label: "Underweight", value: result.bmi, max: 18.5 },
            { label: "Normal", value: result.bmi, max: 25 },
            { label: "Overweight", value: result.bmi, max: 30 },
            { label: "Obese", value: result.bmi, max: 40 },
          ]} color="#3B82F6" />
          <InfoBox title="What is BMI?" icon={<AlertCircle className="w-4 h-4 text-[#3B82F6]" />}>
            BMI is a screening tool that estimates body fat based on height and weight. It does not directly measure body fat and may not account for muscle mass, bone density, or body composition. Athletes may have a higher BMI due to muscle mass.
          </InfoBox>
          {result.cat === "Normal" ? (
            <InfoBox title="Recommendation" icon={<Info className="w-4 h-4 text-[#22C55E]" />}>
              You are in a healthy weight range. Maintain your current lifestyle with balanced nutrition and regular exercise at GYM 56 to stay in this range.
            </InfoBox>
          ) : result.cat === "Underweight" ? (
            <InfoBox title="Recommendation">
              Consider a calorie surplus with strength training to build muscle mass. Focus on compound lifts and nutrient-dense foods. Our GYM 56 trainers can help design a program for you.
            </InfoBox>
          ) : (
            <InfoBox title="Recommendation">
              {result.cat === "Overweight"
                ? "A moderate calorie deficit combined with strength training and cardio can help reach a healthier range. GYM 56 offers personalized weight loss programs."
                : "We recommend consulting a healthcare professional. A structured weight loss program combining nutrition, strength training, and cardio at GYM 56 can help."}
            </InfoBox>
          )}
        </div>
      )}
    </CalculatorCard>
  );
}

/* ─── BMR ─── */
export function BMRCalculator({ onResult }: { onResult: ResultSetter }) {
  const [gender, setGender] = useState("male"); const [age, setAge] = useState(""); const [weight, setWeight] = useState(""); const [height, setHeight] = useState("");
  const errA = validateNumber(age, 10, 120, "Age"); const errW = validateNumber(weight, 20, 350, "Weight"); const errH = validateNumber(height, 50, 280, "Height");

  const result = useMemo(() => {
    if (errA || errW || errH) return null;
    const a = parseFloat(age); const w = parseFloat(weight); const h = parseFloat(height);
    let bmr: number;
    const formula = "Mifflin-St Jeor";
    if (gender === "male") bmr = 10 * w + 6.25 * h - 5 * a + 5;
    else bmr = 10 * w + 6.25 * h - 5 * a - 161;
    return { bmr, formula };
  }, [gender, age, weight, height, errA, errW, errH]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useMemo(() => { if (result) onResult({ bmr: result.bmr.toFixed(0), formula: result.formula }); }, [result]);

  return (
    <CalculatorCard title="BMR Calculator" icon={<Flame className="w-5 h-5" />} color="#EF4444">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <SelectRow label="Gender" value={gender} onChange={setGender} options={[{ value: "male", label: "Male" }, { value: "female", label: "Female" }]} />
        <InputRow label="Age" unit="years" value={age} onChange={setAge} min={10} max={120} error={errA} />
        <InputRow label="Weight" unit="kg" value={weight} onChange={setWeight} min={20} max={350} error={errW} />
        <InputRow label="Height" unit="cm" value={height} onChange={setHeight} min={50} max={280} error={errH} />
      </div>
      {result && (
        <div className="mt-6 space-y-4">
          <ResultDisplay label="BMR" value={result.bmr.toFixed(0)} unit="kcal/day" description={`Using ${result.formula}`} />
          <BarChart data={[
            { label: "Sedentary (BMR)", value: result.bmr, max: result.bmr * 1.4 },
            { label: "Light Activity", value: result.bmr * 1.2, max: result.bmr * 1.4 },
            { label: "Moderate Activity", value: result.bmr * 1.375, max: result.bmr * 1.4 },
            { label: "Very Active", value: result.bmr * 1.55, max: result.bmr * 1.4 },
          ]} color="#EF4444" />
          <InfoBox title="What is BMR?" icon={<AlertCircle className="w-4 h-4 text-[#EF4444]" />}>
            BMR is the number of calories your body needs at complete rest to maintain vital functions like breathing, circulation, and cell production. It accounts for about 60-75% of your total daily calorie burn.
          </InfoBox>
          <InfoBox title="How to use this">
            Use your BMR as a baseline. To lose weight, eat below your TDEE (BMR × activity factor). To gain, eat above. Never eat below your BMR without medical supervision.
          </InfoBox>
        </div>
      )}
    </CalculatorCard>
  );
}

/* ─── TDEE ─── */
export function TDEECalculator({ onResult }: { onResult: ResultSetter }) {
  const [gender, setGender] = useState("male"); const [age, setAge] = useState(""); const [weight, setWeight] = useState(""); const [height, setHeight] = useState(""); const [activity, setActivity] = useState("moderate");
  const errA = validateNumber(age, 10, 120, "Age"); const errW = validateNumber(weight, 20, 350, "Weight"); const errH = validateNumber(height, 50, 280, "Height");

  const result = useMemo(() => {
    if (errA || errW || errH) return null;
    const a = parseFloat(age); const w = parseFloat(weight); const h = parseFloat(height);
    let bmr: number;
    if (gender === "male") bmr = 10 * w + 6.25 * h - 5 * a + 5;
    else bmr = 10 * w + 6.25 * h - 5 * a - 161;
    const tdee = bmr * ACTIVITY_FACTORS[activity].factor;
    return { bmr, tdee, cut: tdee - 500, bulk: tdee + 300 };
  }, [gender, age, weight, height, activity, errA, errW, errH]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useMemo(() => { if (result) onResult({ tdee: result.tdee.toFixed(0), bmr: result.bmr.toFixed(0), cut: result.cut.toFixed(0), bulk: result.bulk.toFixed(0) }); }, [result]);

  return (
    <CalculatorCard title="TDEE Calculator" icon={<Activity className="w-5 h-5" />} color="#F59E0B">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <SelectRow label="Gender" value={gender} onChange={setGender} options={[{ value: "male", label: "Male" }, { value: "female", label: "Female" }]} />
        <InputRow label="Age" unit="years" value={age} onChange={setAge} min={10} max={120} error={errA} />
        <InputRow label="Weight" unit="kg" value={weight} onChange={setWeight} min={20} max={350} error={errW} />
        <InputRow label="Height" unit="cm" value={height} onChange={setHeight} min={50} max={280} error={errH} />
        <div className="sm:col-span-2">
          <SelectRow label="Activity Level" value={activity} onChange={setActivity} options={Object.entries(ACTIVITY_FACTORS).map(([k, v]) => ({ value: k, label: v.label }))} />
        </div>
      </div>
      {result && (
        <div className="mt-6 space-y-4">
          <div className="flex flex-wrap gap-3">
            <ResultDisplay label="BMR" value={result.bmr.toFixed(0)} unit="kcal" />
            <ResultDisplay label="TDEE" value={result.tdee.toFixed(0)} unit="kcal/day" color="#F59E0B" />
            <ResultDisplay label="Cut (Lose)" value={result.cut.toFixed(0)} unit="kcal/day" color="#22C55E" />
            <ResultDisplay label="Bulk (Gain)" value={result.bulk.toFixed(0)} unit="kcal/day" color="#EF4444" />
          </div>
          <BarChart data={[
            { label: "BMR", value: result.bmr, max: result.tdee },
            { label: "TDEE", value: result.tdee, max: result.tdee },
            { label: "Cut Deficit", value: result.cut, max: result.tdee },
            { label: "Bulk Surplus", value: result.bulk, max: result.tdee },
          ]} color="#F59E0B" />
          <InfoBox title="What is TDEE?" icon={<AlertCircle className="w-4 h-4 text-[#F59E0B]" />}>
            TDEE is your total daily calorie burn including BMR, digestion, and physical activity. Eating at TDEE maintains weight, below it causes weight loss, above it causes weight gain.
          </InfoBox>
        </div>
      )}
    </CalculatorCard>
  );
}

/* ─── Macros ─── */
export function MacrosCalculator({ onResult }: { onResult: ResultSetter }) {
  const [calories, setCalories] = useState(""); const [goal, setGoal] = useState("maintain");
  const errC = validateNumber(calories, 800, 10000, "Calories");

  const macros = useMemo(() => {
    if (errC) return null;
    const cal = parseFloat(calories);
    const ratios = goal === "cut" ? { protein: 0.40, fat: 0.30, carbs: 0.30 }
      : goal === "bulk" ? { protein: 0.30, fat: 0.25, carbs: 0.45 }
      : { protein: 0.30, fat: 0.30, carbs: 0.40 };
    return {
      protein: { g: (cal * ratios.protein / 4).toFixed(0), cal: cal * ratios.protein },
      fat: { g: (cal * ratios.fat / 9).toFixed(0), cal: cal * ratios.fat },
      carbs: { g: (cal * ratios.carbs / 4).toFixed(0), cal: cal * ratios.carbs },
      ratios,
    };
  }, [calories, goal, errC]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useMemo(() => { if (macros) onResult({ protein: macros.protein.g, fat: macros.fat.g, carbs: macros.carbs.g, goal }); }, [macros]);

  return (
    <CalculatorCard title="Macro Calculator" icon={<Utensils className="w-5 h-5" />} color="#10B981">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputRow label="Daily Calories" unit="kcal" value={calories} onChange={setCalories} min={800} max={10000} error={errC} />
        <SelectRow label="Goal" value={goal} onChange={setGoal} options={[{ value: "cut", label: "Cutting (Fat Loss)" }, { value: "maintain", label: "Maintenance" }, { value: "bulk", label: "Bulking (Muscle Gain)" }]} />
      </div>
      {macros && (
        <div className="mt-6 space-y-4">
          <div className="flex flex-wrap gap-3">
            <ResultDisplay label="Protein" value={macros.protein.g} unit="g" color="#EF4444" description={`${(macros.ratios.protein * 100).toFixed(0)}% of calories`} />
            <ResultDisplay label="Carbs" value={macros.carbs.g} unit="g" color="#F59E0B" description={`${(macros.ratios.carbs * 100).toFixed(0)}% of calories`} />
            <ResultDisplay label="Fat" value={macros.fat.g} unit="g" color="#3B82F6" description={`${(macros.ratios.fat * 100).toFixed(0)}% of calories`} />
          </div>
          <BarChart data={[
            { label: `Protein (${(macros.ratios.protein * 100).toFixed(0)}%)`, value: macros.ratios.protein * 100, max: 100 },
            { label: `Carbs (${(macros.ratios.carbs * 100).toFixed(0)}%)`, value: macros.ratios.carbs * 100, max: 100 },
            { label: `Fat (${(macros.ratios.fat * 100).toFixed(0)}%)`, value: macros.ratios.fat * 100, max: 100 },
          ]} color="#10B981" />
          <InfoBox title="Macro Guidelines">
            Protein: 4 kcal/g — Essential for muscle repair and growth.
            Carbs: 4 kcal/g — Primary energy source for workouts.
            Fat: 9 kcal/g — Hormone production and health. Adjust ratios based on your response and preferences.
          </InfoBox>
        </div>
      )}
    </CalculatorCard>
  );
}

/* ─── Protein ─── */
export function ProteinCalculator({ onResult }: { onResult: ResultSetter }) {
  const [weight, setWeight] = useState(""); const [activity, setActivity] = useState("moderate");
  const errW = validateNumber(weight, 20, 350, "Weight");

  const result = useMemo(() => {
    if (errW) return null;
    const w = parseFloat(weight);
    const lvl = PROTEIN_LEVELS[activity];
    return { min: w * lvl.min, max: w * lvl.max, weight: w, level: lvl };
  }, [weight, activity, errW]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useMemo(() => { if (result) onResult({ proteinMin: result.min.toFixed(1), proteinMax: result.max.toFixed(1) }); }, [result]);

  return (
    <CalculatorCard title="Protein Calculator" icon={<Drumstick className="w-5 h-5" />} color="#8B5CF6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputRow label="Weight" unit="kg" value={weight} onChange={setWeight} min={20} max={350} error={errW} />
          <SelectRow label="Activity Level" value={activity} onChange={setActivity} options={Object.entries(PROTEIN_LEVELS).map(([k, v]) => ({ value: k, label: v.label }))} />
      </div>
      {result && (
        <div className="mt-6 space-y-4">
          <div className="flex flex-wrap gap-3">
            <ResultDisplay label="Daily Protein" value={result.min.toFixed(0)} unit="g" color="#8B5CF6" description={`Min: ${result.level.min.toFixed(1)}g/kg`} />
            <ResultDisplay label="Max Protein" value={result.max.toFixed(0)} unit="g" description={`Max: ${result.level.max.toFixed(1)}g/kg`} />
            <ResultDisplay label="Per Meal (4x)" value={(result.min / 4).toFixed(0)} unit="g" description="Spread across 4 meals" />
          </div>
          <BarChart data={[
            { label: "Minimum", value: result.min, max: result.max },
            { label: "Maximum", value: result.max, max: result.max },
          ]} color="#8B5CF6" />
          <InfoBox title="Why Protein Matters">
            Protein is essential for muscle repair, enzyme production, and immune function. Spread intake across 3-5 meals for optimal muscle protein synthesis. Good sources: chicken, eggs, fish, paneer, lentils, whey protein.
          </InfoBox>
        </div>
      )}
    </CalculatorCard>
  );
}

/* ─── Water Intake ─── */
export function WaterCalculator({ onResult }: { onResult: ResultSetter }) {
  const [weight, setWeight] = useState(""); const [activity, setActivity] = useState("30");
  const [climate, setClimate] = useState("moderate");
  const errW = validateNumber(weight, 10, 350, "Weight");

  const result = useMemo(() => {
    if (errW) return null;
    const w = parseFloat(weight);
    const actMin = parseInt(activity);
    const climateFactor = climate === "hot" ? 1.2 : climate === "cold" ? 0.9 : 1.0;
    const base = w * 0.033;
    const activityExtra = (actMin / 30) * 0.35;
    const total = (base + activityExtra) * climateFactor;
    return { base, activityExtra, total, climateFactor };
  }, [weight, activity, climate, errW]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useMemo(() => { if (result) onResult({ water: result.total.toFixed(1), base: result.base.toFixed(1) }); }, [result]);

  return (
    <CalculatorCard title="Water Intake" icon={<Droplet className="w-5 h-5" />} color="#06B6D4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputRow label="Weight" unit="kg" value={weight} onChange={setWeight} min={10} max={350} error={errW} />
        <SelectRow label="Daily Exercise" value={activity} onChange={setActivity} options={[{ value: "0", label: "None" }, { value: "15", label: "15 minutes" }, { value: "30", label: "30 minutes" }, { value: "60", label: "60 minutes" }, { value: "90", label: "90+ minutes" }]} />
        <SelectRow label="Climate" value={climate} onChange={setClimate} options={[{ value: "cool", label: "Cool" }, { value: "moderate", label: "Moderate" }, { value: "hot", label: "Hot/Humid" }]} />
      </div>
      {result && (
        <div className="mt-6 space-y-4">
          <div className="flex flex-wrap gap-3">
            <ResultDisplay label="Total Daily" value={result.total.toFixed(1)} unit="L" color="#06B6D4" />
            <ResultDisplay label="Base (no exercise)" value={result.base.toFixed(1)} unit="L" />
            <ResultDisplay label="Exercise Extra" value={result.activityExtra.toFixed(2)} unit="L" />
          </div>
          <BarChart data={[
            { label: "Base Water", value: result.base, max: result.total },
            { label: "Exercise Top-up", value: result.activityExtra, max: result.total },
            { label: "Total", value: result.total, max: result.total },
          ]} color="#06B6D4" />
          <InfoBox title="Hydration Tips">
            Drink water consistently throughout the day. Thirst is a late indicator of dehydration. Urine color should be pale yellow. Increase intake on hot days and during intense workouts at GYM 56.
          </InfoBox>
        </div>
      )}
    </CalculatorCard>
  );
}

/* ─── Calories ─── */
export function CaloriesCalculator({ onResult }: { onResult: ResultSetter }) {
  const [tdee, setTdee] = useState("");
  const errT = validateNumber(tdee, 800, 10000, "TDEE");

  const result = useMemo(() => {
    if (errT) return null;
    const t = parseFloat(tdee);
    return {
      maintain: t,
      mildCut: t - 250, cut: t - 500, aggressiveCut: t - 1000,
      mildBulk: t + 150, bulk: t + 300, aggressiveBulk: t + 500,
    };
  }, [tdee, errT]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useMemo(() => { if (result) onResult({ maintain: result.maintain.toFixed(0), cut: result.cut.toFixed(0), bulk: result.bulk.toFixed(0) }); }, [result]);

  return (
    <CalculatorCard title="Calorie Needs" icon={<Zap className="w-5 h-5" />} color="#F97316">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputRow label="Your TDEE" unit="kcal" value={tdee} onChange={setTdee} min={800} max={10000} error={errT} />
      </div>
      {result && (
        <div className="mt-6 space-y-4">
          <div className="flex flex-wrap gap-3">
            <ResultDisplay label="Maintain" value={result.maintain.toFixed(0)} unit="kcal" color="#F59E0B" />
            <ResultDisplay label="Mild Cut (-250)" value={result.mildCut.toFixed(0)} unit="kcal" color="#22C55E" />
            <ResultDisplay label="Cut (-500)" value={result.cut.toFixed(0)} unit="kcal" color="#10B981" />
            <ResultDisplay label="Bulk (+300)" value={result.bulk.toFixed(0)} unit="kcal" color="#EF4444" />
          </div>
          <BarChart data={[
            { label: "Maintain", value: result.maintain, max: result.maintain + 500 },
            { label: "Cut (-500)", value: result.cut, max: result.maintain + 500 },
            { label: "Bulk (+300)", value: result.bulk, max: result.maintain + 500 },
          ]} color="#F97316" />
          <InfoBox title="Calorie Guidelines">
            A 300-500 calorie deficit leads to 0.3-0.5 kg fat loss per week. A 300-500 surplus supports muscle gain. Keep cuts moderate — aggressive deficits ({'>'}1000 cal) can cause muscle loss and metabolic slowdown.
          </InfoBox>
        </div>
      )}
    </CalculatorCard>
  );
}

/* ─── One Rep Max ─── */
export function OneRepMaxCalculator({ onResult }: { onResult: ResultSetter }) {
  const [weight, setWeight] = useState(""); const [reps, setReps] = useState("5");
  const errW = validateNumber(weight, 1, 1000, "Weight"); const errR = validateNumber(reps, 1, 30, "Reps");

  const result = useMemo(() => {
    if (errW || errR) return null;
    const w = parseFloat(weight); const r = parseInt(reps);
    const epley = w * (1 + r / 30);
    const brzycki = w * 36 / (37 - r);
    const lombardi = w * Math.pow(r, 0.1);
    const avg = (epley + brzycki + lombardi) / 3;
    return { weight: w, reps: r, epley, brzycki, lombardi, avg };
  }, [weight, reps, errW, errR]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useMemo(() => { if (result) onResult({ oneRepMax: result.avg.toFixed(1), epley: result.epley.toFixed(1) }); }, [result]);

  return (
    <CalculatorCard title="One Rep Max" icon={<Dumbbell className="w-5 h-5" />} color="#DC2626">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputRow label="Weight Lifted" unit="kg" value={weight} onChange={setWeight} min={1} max={1000} error={errW} />
        <InputRow label="Reps Performed" unit="" value={reps} onChange={setReps} min={1} max={30} error={errR} />
      </div>
      {result && (
        <div className="mt-6 space-y-4">
          <ResultDisplay label="Estimated 1RM" value={result.avg.toFixed(0)} unit="kg" color="#DC2626" description={`From ${result.weight}kg for ${result.reps} reps`} />
          <div className="grid grid-cols-3 gap-3">
            <ResultDisplay label="Epley" value={result.epley.toFixed(0)} unit="kg" />
            <ResultDisplay label="Brzycki" value={result.brzycki.toFixed(0)} unit="kg" />
            <ResultDisplay label="Lombardi" value={result.lombardi.toFixed(0)} unit="kg" />
          </div>
          <BarChart data={[
            { label: "Epley", value: result.epley, max: result.avg * 1.1 },
            { label: "Brzycki", value: result.brzycki, max: result.avg * 1.1 },
            { label: "Lombardi", value: result.lombardi, max: result.avg * 1.1 },
            { label: "Average", value: result.avg, max: result.avg * 1.1 },
          ]} color="#DC2626" />
          <InfoBox title="Using Your 1RM">
            Use 1RM percentages for programming: 65-75% for volume, 75-85% for strength, 85%+ for peaking. Test 1RM rarely (every 4-8 weeks) and always with a spotter at GYM 56.
          </InfoBox>
        </div>
      )}
    </CalculatorCard>
  );
}

/* ─── Wilks ─── */
export function WilksCalculator({ onResult }: { onResult: ResultSetter }) {
  const [gender, setGender] = useState("male"); const [bw, setBw] = useState(""); const [total, setTotal] = useState("");
  const errBw = validateNumber(bw, 20, 350, "Body weight"); const errT = validateNumber(total, 20, 2000, "Total");

  const result = useMemo(() => {
    if (errBw || errT) return null;
    const w = parseFloat(bw); const t = parseFloat(total);
    const coeff = gender === "male"
      ? 500 / (-0.000001 * w * w * w * w + 0.000255 * w * w * w - 0.02719 * w * w + 1.232 * w + 21.849)
      : 500 / (-0.0000006 * w * w * w * w + 0.000167 * w * w * w - 0.02044 * w * w + 1.131 * w + 29.837);
    return { wilks: t * coeff, coefficient: coeff };
  }, [gender, bw, total, errBw, errT]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useMemo(() => { if (result) onResult({ wilks: result.wilks.toFixed(2), coefficient: result.coefficient.toFixed(4) }); }, [result]);

  return (
    <CalculatorCard title="Wilks Coefficient" icon={<Trophy className="w-5 h-5" />} color="#EAB308">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <SelectRow label="Gender" value={gender} onChange={setGender} options={[{ value: "male", label: "Male" }, { value: "female", label: "Female" }]} />
        <InputRow label="Body Weight" unit="kg" value={bw} onChange={setBw} min={20} max={350} error={errBw} />
        <InputRow label="Total (S+B+D)" unit="kg" value={total} onChange={setTotal} min={20} max={2000} error={errT} />
      </div>
      {result && (
        <div className="mt-6 space-y-4">
          <ResultDisplay label="Wilks Score" value={result.wilks.toFixed(1)} unit="" color="#EAB308" description="Higher is better" />
          <BarChart data={[
            { label: "Untrained", value: 150, max: 600 },
            { label: "Novice", value: 250, max: 600 },
            { label: "Intermediate", value: 350, max: 600 },
            { label: "Advanced", value: 450, max: 600 },
            { label: "Elite", value: 550, max: 600 },
            { label: "Your Score", value: result.wilks, max: 600 },
          ]} color="#EAB308" />
          <InfoBox title="What is Wilks?" icon={<AlertCircle className="w-4 h-4 text-[#EAB308]" />}>
            The Wilks coefficient compares powerlifting strength across bodyweight classes. A higher score means more relative strength. Scores above 300 are intermediate, 400+ advanced, 500+ elite.
          </InfoBox>
        </div>
      )}
    </CalculatorCard>
  );
}

/* ─── DOTS ─── */
export function DOTSCalculator({ onResult }: { onResult: ResultSetter }) {
  const [gender, setGender] = useState("male"); const [bw, setBw] = useState(""); const [total, setTotal] = useState("");
  const errBw = validateNumber(bw, 20, 350, "Body weight"); const errT = validateNumber(total, 20, 2000, "Total");

  const result = useMemo(() => {
    if (errBw || errT) return null;
    const w = parseFloat(bw); const t = parseFloat(total);
    const mf = gender === "male" ? 1 : 0;
    const dots = 500 * Math.exp(-0.000432 * Math.pow(w, 2) + 0.0656 * w - 5.594 + (mf ? 0 : 1.868));
    return { dots, approx: t / Math.pow(w, 2 / 3) * 100 };
  }, [gender, bw, total, errBw, errT]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useMemo(() => { if (result) onResult({ dots: result.dots.toFixed(1) }); }, [result]);

  return (
    <CalculatorCard title="DOTS Score" icon={<Target className="w-5 h-5" />} color="#14B8A6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <SelectRow label="Gender" value={gender} onChange={setGender} options={[{ value: "male", label: "Male" }, { value: "female", label: "Female" }]} />
        <InputRow label="Body Weight" unit="kg" value={bw} onChange={setBw} min={20} max={350} error={errBw} />
        <InputRow label="Total (S+B+D)" unit="kg" value={total} onChange={setTotal} min={20} max={2000} error={errT} />
      </div>
      {result && (
        <div className="mt-6 space-y-4">
          <ResultDisplay label="DOTS Score" value={result.dots.toFixed(1)} unit="" color="#14B8A6" description="More precise than Wilks" />
          <InfoBox title="DOTS vs Wilks" icon={<AlertCircle className="w-4 h-4 text-[#14B8A6]" />}>
            DOTS (Defense Outlaw Total System) is a modern refinement of the Wilks formula. It better accounts for extreme bodyweights and is the preferred coefficient in many modern powerlifting federations.
          </InfoBox>
        </div>
      )}
    </CalculatorCard>
  );
}

/* ─── Plate Calculator ─── */
export function PlateCalculator({ onResult }: { onResult: ResultSetter }) {
  const [target, setTarget] = useState(""); const [bar, setBar] = useState("20");
  const errT = validateNumber(target, 1, 1000, "Target weight");

  const plates = useMemo(() => {
    if (errT) return null;
    const t = parseFloat(target); const b = parseFloat(bar);
    const remaining = (t - b) / 2;
    if (remaining < 0) return { error: "Target weight must exceed bar weight", plates: [] };
    const available = [25, 20, 15, 10, 5, 2.5, 1.25, 0.5];
    let r = remaining;
    const result: { plate: number; count: number }[] = [];
    for (const p of available) {
      const count = Math.floor(r / p);
      if (count > 0) { result.push({ plate: p, count }); r -= count * p; }
    }
    return { error: null, plates: result, remainder: r };
  }, [target, bar, errT]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useMemo(() => { if (plates && !plates.error) onResult({ platesPerSide: plates.plates.map((p) => `${p.count}x${p.plate}kg`).join(", ") }); }, [plates]);

  return (
    <CalculatorCard title="Plate Calculator" icon={<Calculator className="w-5 h-5" />} color="#6366F1">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputRow label="Target Weight" unit="kg" value={target} onChange={setTarget} min={1} max={1000} error={errT} />
        <SelectRow label="Bar Weight" value={bar} onChange={setBar} options={[{ value: "20", label: "Olympic Bar (20kg)" }, { value: "15", label: "Women's Bar (15kg)" }, { value: "10", label: "EZ/Technique Bar (10kg)" }, { value: "0", label: "No bar (machines)" }]} />
      </div>
      {plates && (
        <div className="mt-6 space-y-4">
          {plates.error ? (
            <p className="text-red-400 text-sm">{plates.error}</p>
          ) : (
            <>
              <ResultDisplay label="Each Side" value={plates.plates.map((p) => `${p.count}x${p.plate}`).join(" + ")} unit="kg" color="#6366F1" />
              {plates.remainder! > 0.01 && (
                <p className="text-amber-400 text-xs">Remainder: {plates.remainder!.toFixed(2)}kg — use fractional plates or add a small plate</p>
              )}
              <div className="glass rounded-xl p-4 border border-white/5">
                <p className="text-sm text-gray-400 mb-2">Per side:</p>
                <div className="flex flex-wrap gap-2">
                  {plates.plates.map((p, i) => (
                    <span key={i} className="px-3 py-1 bg-white/5 rounded-full text-xs text-white">
                      {p.count} × {p.plate}kg
                    </span>
                  ))}
                </div>
                <p className="text-sm text-gray-500 mt-2">Total: {parseFloat(target)}kg ({parseFloat(bar)}kg bar + {plates.plates.reduce((s, p) => s + p.count * p.plate * 2, 0).toFixed(1)}kg plates)</p>
              </div>
            </>
          )}
        </div>
      )}
    </CalculatorCard>
  );
}

/* ─── Body Fat ─── */
export function BodyFatCalculator({ onResult }: { onResult: ResultSetter }) {
  const [gender, setGender] = useState("male");
  const [neck, setNeck] = useState(""); const [waist, setWaist] = useState(""); const [hip, setHip] = useState("");
  const [height, setHeight] = useState("");
  const errN = validateNumber(neck, 10, 80, "Neck"); const errW = validateNumber(waist, 30, 200, "Waist");
  const errHt = validateNumber(height, 50, 280, "Height");

  const result = useMemo(() => {
    if (gender === "female" && !hip) return null;
    if (errN || errW || errHt) return null;
    const n = parseFloat(neck); const w = parseFloat(waist); const h = parseFloat(height);
    let bf: number;
    if (gender === "male") {
      bf = 495 / (1.0324 - 0.19077 * Math.log10(w - n) + 0.15456 * Math.log10(h)) - 450;
    } else {
      const hp = parseFloat(hip);
      if (!hp) return null;
      bf = 495 / (1.29579 - 0.35004 * Math.log10(w + hp - n) + 0.22100 * Math.log10(h)) - 450;
    }
    const cat = bf < (gender === "male" ? 6 : 14) ? "Essential Fat"
      : bf < (gender === "male" ? 14 : 21) ? "Athletic"
      : bf < (gender === "male" ? 18 : 25) ? "Fitness"
      : bf < (gender === "male" ? 25 : 32) ? "Average"
      : "Obese";
    return { bf, cat };
  }, [gender, neck, waist, hip, height, errN, errW, errHt]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useMemo(() => { if (result) onResult({ bodyFat: result.bf.toFixed(1), category: result.cat }); }, [result]);

  return (
    <CalculatorCard title="Body Fat (US Navy)" icon={<Percent className="w-5 h-5" />} color="#EC4899">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <SelectRow label="Gender" value={gender} onChange={setGender} options={[{ value: "male", label: "Male" }, { value: "female", label: "Female" }]} />
        <InputRow label="Height" unit="cm" value={height} onChange={setHeight} min={50} max={280} error={errHt} />
        <InputRow label="Neck circumference" unit="cm" value={neck} onChange={setNeck} min={10} max={80} error={errN} />
        <InputRow label="Waist circumference" unit="cm" value={waist} onChange={setWaist} min={30} max={200} error={errW} />
        {gender === "female" && (
          <InputRow label="Hip circumference" unit="cm" value={hip} onChange={setHip} min={30} max={200} />
        )}
      </div>
      {result && (
        <div className="mt-6 space-y-4">
          <ResultDisplay label="Body Fat" value={result.bf.toFixed(1)} unit="%" color="#EC4899" description={result.cat} />
          <InfoBox title="Body Fat Ranges">
            Essential fat: {gender === "male" ? "2-5%" : "10-13%"}. Athletic: {gender === "male" ? "6-13%" : "14-20%"}. Fitness: {gender === "male" ? "14-17%" : "21-24%"}. Average: {gender === "male" ? "18-24%" : "25-31%"}. Obese: {gender === "male" ? "25%+" : "32%+"}.
          </InfoBox>
          <InfoBox title="Note">
            The US Navy method provides a reasonable estimate but can be off by 2-3%. For more accurate measurement, consider DEXA scan or hydrostatic weighing.
          </InfoBox>
        </div>
      )}
    </CalculatorCard>
  );
}

/* ─── Lean Body Mass ─── */
export function LeanBodyMassCalculator({ onResult }: { onResult: ResultSetter }) {
  const [weight, setWeight] = useState(""); const [bf, setBf] = useState("");
  const errW = validateNumber(weight, 10, 350, "Weight"); const errBf = validateNumber(bf, 1, 70, "Body fat %");

  const result = useMemo(() => {
    if (errW || errBf) return null;
    const w = parseFloat(weight); const b = parseFloat(bf);
    const lbm = w * (1 - b / 100);
    const fat = w - lbm;
    return { lbm, fat, weight: w };
  }, [weight, bf, errW, errBf]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useMemo(() => { if (result) onResult({ leanMass: result.lbm.toFixed(1), fatMass: result.fat.toFixed(1) }); }, [result]);

  return (
    <CalculatorCard title="Lean Body Mass" icon={<Brain className="w-5 h-5" />} color="#A855F7">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputRow label="Total Weight" unit="kg" value={weight} onChange={setWeight} min={10} max={350} error={errW} />
        <InputRow label="Body Fat" unit="%" value={bf} onChange={setBf} min={1} max={70} error={errBf} />
      </div>
      {result && (
        <div className="mt-6 space-y-4">
          <div className="flex flex-wrap gap-3">
            <ResultDisplay label="Lean Body Mass" value={result.lbm.toFixed(1)} unit="kg" color="#A855F7" />
            <ResultDisplay label="Fat Mass" value={result.fat.toFixed(1)} unit="kg" />
            <ResultDisplay label="Lean %" value={((result.lbm / result.weight) * 100).toFixed(1)} unit="%" />
          </div>
          <BarChart data={[
            { label: "Lean Mass", value: result.lbm, max: result.weight },
            { label: "Fat Mass", value: result.fat, max: result.weight },
          ]} color="#A855F7" />
          <InfoBox title="Why LBM Matters">
            Lean Body Mass includes muscle, bone, organs, and water. Tracking LBM helps ensure weight loss comes from fat, not muscle. Prioritize protein and strength training at GYM 56 to preserve LBM during cuts.
          </InfoBox>
        </div>
      )}
    </CalculatorCard>
  );
}

/* ─── FFMI ─── */
export function FFMICalculator({ onResult }: { onResult: ResultSetter }) {
  const [height, setHeight] = useState(""); const [lbm, setLbm] = useState("");
  const errH = validateNumber(height, 50, 280, "Height"); const errL = validateNumber(lbm, 10, 200, "LBM");

  const result = useMemo(() => {
    if (errH || errL) return null;
    const h = parseFloat(height); const l = parseFloat(lbm);
    const hM = h / 100;
    const ffmi = l / (hM * hM);
    const adjusted = ffmi + 6.3 * (1.8 - hM);
    const cat = ffmi < 18 ? "Below average" : ffmi < 20 ? "Average" : ffmi < 22 ? "Above average" : ffmi < 25 ? "Excellent" : "Exceptional (likely enhanced)";
    return { ffmi, adjusted, cat };
  }, [height, lbm, errH, errL]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useMemo(() => { if (result) onResult({ ffmi: result.ffmi.toFixed(1), adjusted: result.adjusted.toFixed(1) }); }, [result]);

  return (
    <CalculatorCard title="FFMI" icon={<Weight className="w-5 h-5" />} color="#3B82F6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputRow label="Height" unit="cm" value={height} onChange={setHeight} min={50} max={280} error={errH} />
        <InputRow label="Lean Body Mass" unit="kg" value={lbm} onChange={setLbm} min={10} max={200} error={errL} />
      </div>
      {result && (
        <div className="mt-6 space-y-4">
          <ResultDisplay label="FFMI" value={result.ffmi.toFixed(1)} unit="" color="#3B82F6" description={result.cat} />
          <ResultDisplay label="Adjusted FFMI" value={result.adjusted.toFixed(1)} unit="" description="Corrected for height (1.8m reference)" />
          <BarChart data={[
            { label: "Below Avg", value: 16, max: 30 },
            { label: "Average", value: 19, max: 30 },
            { label: "Above Avg", value: 21, max: 30 },
            { label: "Excellent", value: 23, max: 30 },
            { label: "Exceptional", value: 26, max: 30 },
            { label: "Your FFMI", value: result.ffmi, max: 30 },
          ]} color="#3B82F6" />
          <InfoBox title="FFMI Reference">
            Most natural athletes have FFMI between 20-24. Values above 25 are rare without performance-enhancing substances. Use this as a guideline, not a definitive measure.
          </InfoBox>
        </div>
      )}
    </CalculatorCard>
  );
}

/* ─── Ideal Weight ─── */
export function IdealWeightCalculator({ onResult }: { onResult: ResultSetter }) {
  const [gender, setGender] = useState("male"); const [height, setHeight] = useState("");
  const errH = validateNumber(height, 50, 280, "Height");

  const result = useMemo(() => {
    if (errH) return null;
    const h = parseFloat(height);
    const inches = h / 2.54;
    const base = inches - 60;
    const devine = gender === "male" ? 50 + 2.3 * base : 45.5 + 2.3 * base;
    const robinson = gender === "male" ? 52 + 1.9 * base : 49 + 1.7 * base;
    const miller = gender === "male" ? 56.2 + 1.41 * base : 53.1 + 1.36 * base;
    const hamwi = gender === "male" ? 48 + 2.7 * base : 45.5 + 2.2 * base;
    const avg = (devine + robinson + miller + hamwi) / 4;
    return { devine, robinson, miller, hamwi, avg };
  }, [gender, height, errH]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useMemo(() => { if (result) onResult({ idealWeight: result.avg.toFixed(1) }); }, [result]);

  return (
    <CalculatorCard title="Ideal Weight" icon={<Ruler className="w-5 h-5" />} color="#22C55E">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <SelectRow label="Gender" value={gender} onChange={setGender} options={[{ value: "male", label: "Male" }, { value: "female", label: "Female" }]} />
        <InputRow label="Height" unit="cm" value={height} onChange={setHeight} min={50} max={280} error={errH} />
      </div>
      {result && (
        <div className="mt-6 space-y-4">
          <div className="flex flex-wrap gap-3">
            <ResultDisplay label="Ideal Weight" value={result.avg.toFixed(0)} unit="kg" color="#22C55E" description="Average of 4 formulas" />
            <ResultDisplay label="Devine" value={result.devine.toFixed(0)} unit="kg" />
            <ResultDisplay label="Robinson" value={result.robinson.toFixed(0)} unit="kg" />
            <ResultDisplay label="Miller" value={result.miller.toFixed(0)} unit="kg" />
            <ResultDisplay label="Hamwi" value={result.hamwi.toFixed(0)} unit="kg" />
          </div>
          <BarChart data={[
            { label: "Devine", value: result.devine, max: result.avg * 1.2 },
            { label: "Robinson", value: result.robinson, max: result.avg * 1.2 },
            { label: "Miller", value: result.miller, max: result.avg * 1.2 },
            { label: "Hamwi", value: result.hamwi, max: result.avg * 1.2 },
            { label: "Average", value: result.avg, max: result.avg * 1.2 },
          ]} color="#22C55E" />
          <InfoBox title="Important Note">
            Ideal weight formulas are rough estimates. They do not account for muscle mass, bone density, or body composition. Athletes and lifters at GYM 56 may weigh more than these formulas suggest while being perfectly healthy.
          </InfoBox>
        </div>
      )}
    </CalculatorCard>
  );
}

/* ─── Waist-Height Ratio ─── */
export function WaistHeightRatioCalculator({ onResult }: { onResult: ResultSetter }) {
  const [waist, setWaist] = useState(""); const [height, setHeight] = useState("");
  const errWa = validateNumber(waist, 30, 200, "Waist"); const errH = validateNumber(height, 50, 280, "Height");

  const result = useMemo(() => {
    if (errWa || errH) return null;
    const w = parseFloat(waist); const h = parseFloat(height);
    const whtr = w / h;
    const risk = whtr < 0.4 ? "Extremely low" : whtr < 0.5 ? "Low" : whtr < 0.6 ? "Moderate" : "High";
    const color = whtr < 0.5 ? "#22C55E" : whtr < 0.6 ? "#F59E0B" : "#EF4444";
    return { whtr, risk, color };
  }, [waist, height, errWa, errH]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useMemo(() => { if (result) onResult({ whtr: result.whtr.toFixed(3), risk: result.risk }); }, [result]);

  return (
    <CalculatorCard title="Waist-Height Ratio" icon={<Heart className="w-5 h-5" />} color="#EF4444">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputRow label="Waist circumference" unit="cm" value={waist} onChange={setWaist} min={30} max={200} error={errWa} />
        <InputRow label="Height" unit="cm" value={height} onChange={setHeight} min={50} max={280} error={errH} />
      </div>
      {result && (
        <div className="mt-6 space-y-4">
          <ResultDisplay label="Waist-Height Ratio" value={result.whtr.toFixed(3)} unit="" color={result.color} description={`Risk: ${result.risk}`} />
          <BarChart data={[
            { label: "Low Risk", value: 0.4, max: 0.7 },
            { label: "Moderate Risk", value: 0.5, max: 0.7 },
            { label: "High Risk", value: 0.6, max: 0.7 },
            { label: "Your Ratio", value: result.whtr, max: 0.7 },
          ]} color={result.color} />
          <InfoBox title="Health Risk Indicator" icon={<AlertCircle className="w-4 h-4 text-[#EF4444]" />}>
            WHtR is a strong predictor of cardiovascular risk. Keep your waist circumference below half your height (ratio &lt; 0.5). Unlike BMI, it accounts for central adiposity which is more closely linked to health outcomes.
          </InfoBox>
        </div>
      )}
    </CalculatorCard>
  );
}

/* ─── Heart Rate Zones ─── */
export function HeartRateZonesCalculator({ onResult }: { onResult: ResultSetter }) {
  const [age, setAge] = useState(""); const [restHr, setRestHr] = useState("70");
  const errA = validateNumber(age, 10, 120, "Age"); const errRh = validateNumber(restHr, 30, 120, "Resting HR");

  const zones = useMemo(() => {
    if (errA) return null;
    const a = parseFloat(age); const r = parseFloat(restHr);
    const max = 220 - a;
    const hrr = max - r;
    return {
      max, rest: r,
      zones: [
        { name: "Zone 1: Very Light", pct: "50-60%", min: Math.round(r + hrr * 0.5), max: Math.round(r + hrr * 0.6), benefit: "Recovery, warm-up" },
        { name: "Zone 2: Light", pct: "60-70%", min: Math.round(r + hrr * 0.6), max: Math.round(r + hrr * 0.7), benefit: "Fat burn, endurance" },
        { name: "Zone 3: Moderate", pct: "70-80%", min: Math.round(r + hrr * 0.7), max: Math.round(r + hrr * 0.8), benefit: "Aerobic fitness" },
        { name: "Zone 4: Hard", pct: "80-90%", min: Math.round(r + hrr * 0.8), max: Math.round(r + hrr * 0.9), benefit: "Anaerobic, speed" },
        { name: "Zone 5: Maximum", pct: "90-100%", min: Math.round(r + hrr * 0.9), max: Math.round(r + hrr * 1.0), benefit: "Peak power" },
      ],
    };
  }, [age, restHr, errA]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useMemo(() => { if (zones) onResult({ maxHr: zones.max, zone2: `${zones.zones[1].min}-${zones.zones[1].max}` }); }, [zones]);

  return (
    <CalculatorCard title="Heart Rate Zones" icon={<Heart className="w-5 h-5" />} color="#DC2626">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputRow label="Age" unit="years" value={age} onChange={setAge} min={10} max={120} error={errA} />
        <InputRow label="Resting HR" unit="bpm" value={restHr} onChange={setRestHr} min={30} max={120} error={errRh} />
      </div>
      {zones && (
        <div className="mt-6 space-y-3">
          <div className="flex flex-wrap gap-3">
            <ResultDisplay label="Max HR" value={zones.max} unit="bpm" color="#DC2626" />
            <ResultDisplay label="HR Reserve" value={zones.max - zones.rest} unit="bpm" />
          </div>
          <div className="grid grid-cols-1 gap-2">
            {zones.zones.map((z) => (
              <div key={z.name} className="glass rounded-xl p-3 border border-white/5 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-white">{z.name}</p>
                  <p className="text-xs text-gray-500">{z.benefit}</p>
                </div>
                <p className="text-lg font-bold" style={{ color: "#DC2626" }}>{z.min}-{z.max} <span className="text-xs text-gray-500">bpm</span></p>
              </div>
            ))}
          </div>
          <InfoBox title="Training Zones">
            Zone 2 (60-70% HRR) is ideal for building aerobic base. Zone 4-5 for high-intensity interval training (HIIT). Use a heart rate monitor during GYM 56 cardio sessions for precision.
          </InfoBox>
        </div>
      )}
    </CalculatorCard>
  );
}

/* ─── Pace Calculator ─── */
export function PaceCalculator({ onResult }: { onResult: ResultSetter }) {
  const [distance, setDistance] = useState(""); const [timeM, setTimeM] = useState(""); const [timeS, setTimeS] = useState("");
  const errD = validateNumber(distance, 0.1, 200, "Distance");

  const result = useMemo(() => {
    if (errD) return null;
    const d = parseFloat(distance);
    const tm = parseFloat(timeM) || 0; const ts = parseFloat(timeS) || 0;
    if (tm <= 0 && ts <= 0) return null;
    const totalMin = tm + ts / 60;
    const paceMin = totalMin / d;
    const speed = d / (totalMin / 60);
    const paceM = Math.floor(paceMin);
    const paceS = Math.round((paceMin - paceM) * 60);
    return { km: d, timeMin: totalMin, paceMin, paceM, paceS, speed, paceString: `${paceM}:${paceS.toString().padStart(2, "0")} min/km` };
  }, [distance, timeM, timeS, errD]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useMemo(() => { if (result) onResult({ pace: result.paceString, speed: result.speed.toFixed(1) }); }, [result]);

  return (
    <CalculatorCard title="Pace Calculator" icon={<Footprints className="w-5 h-5" />} color="#F59E0B">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputRow label="Distance" unit="km" value={distance} onChange={setDistance} min={0.1} max={200} error={errD} />
        <div />
        <InputRow label="Time (minutes)" unit="" value={timeM} onChange={setTimeM} min={0} max={1440} />
        <InputRow label="Time (seconds)" unit="" value={timeS} onChange={setTimeS} min={0} max={59} />
      </div>
      {result && (
        <div className="mt-6 space-y-4">
          <div className="flex flex-wrap gap-3">
            <ResultDisplay label="Pace" value={result.paceString} unit="" color="#F59E0B" />
            <ResultDisplay label="Speed" value={result.speed.toFixed(1)} unit="km/h" />
            <ResultDisplay label="Total Time" value={`${Math.floor(result.timeMin)}:${Math.round((result.timeMin % 1) * 60).toString().padStart(2, "0")}`} unit="min" />
          </div>
          <InfoBox title="Pacing Tips">
            For distance running: 5K pace is typically 15-30 sec/km faster than 10K pace. Half marathon pace is 5-10 sec/km slower than 10K pace. Use GYM 56&apos;s treadmills for controlled pace training.
          </InfoBox>
        </div>
      )}
    </CalculatorCard>
  );
}

/* ─── Calories Burned ─── */
export function CaloriesBurnedCalculator({ onResult }: { onResult: ResultSetter }) {
  const [weight, setWeight] = useState(""); const [activity, setActivity] = useState("running"); const [duration, setDuration] = useState("30");
  const errW = validateNumber(weight, 10, 350, "Weight"); const errD = validateNumber(duration, 1, 600, "Duration");

  const result = useMemo(() => {
    if (errW || errD) return null;
    const w = parseFloat(weight); const d = parseFloat(duration);
    const met = METS[activity].met;
    const cal = met * w * (d / 60);
    return { cal, met, duration: d, weight: w };
  }, [weight, activity, duration, errW, errD]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useMemo(() => { if (result) onResult({ caloriesBurned: result.cal.toFixed(0) }); }, [result]);

  return (
    <CalculatorCard title="Calories Burned" icon={<Bike className="w-5 h-5" />} color="#10B981">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputRow label="Weight" unit="kg" value={weight} onChange={setWeight} min={10} max={350} error={errW} />
        <InputRow label="Duration" unit="min" value={duration} onChange={setDuration} min={1} max={600} error={errD} />
        <div className="sm:col-span-2">
          <SelectRow label="Activity" value={activity} onChange={setActivity} options={Object.entries(METS).map(([k, v]) => ({ value: k, label: `${v.label} (${v.met} MET)` }))} />
        </div>
      </div>
      {result && (
        <div className="mt-6 space-y-4">
          <ResultDisplay label="Calories Burned" value={result.cal.toFixed(0)} unit="kcal" color="#10B981" description={`${result.duration}min at ${result.met} MET`} />
          <BarChart data={[
            { label: "Rest (1 MET)", value: 1 * result.weight * (result.duration / 60), max: result.cal },
            { label: `This activity (${result.met} MET)`, value: result.cal, max: result.cal },
          ]} color="#10B981" />
          <InfoBox title="How Calories Burned is Calculated">
            Calories = MET × weight (kg) × duration (hours). MET values are estimates — actual burn varies with intensity, efficiency, and individual metabolism. Use a heart rate monitor at GYM 56 for more accuracy.
          </InfoBox>
        </div>
      )}
    </CalculatorCard>
  );
}

/* ─── VO2 Max ─── */
export function VO2MaxCalculator({ onResult }: { onResult: ResultSetter }) {
  const [gender, setGender] = useState("male");
  const [age, setAge] = useState(""); const [restHr, setRestHr] = useState("70");
  const [method, setMethod] = useState("resting");
  const errA = validateNumber(age, 10, 120, "Age"); const errRh = validateNumber(restHr, 30, 120, "Resting HR");

  const result = useMemo(() => {
    if (errA) return null;
    const a = parseFloat(age); const r = parseFloat(restHr);
    let vo2: number;
    if (method === "resting") {
      if (errRh) return null;
      vo2 = gender === "male" ? 15.3 * (220 - a) / r : 14.7 * (226 - a) / r;
    } else {
      const maxHr = gender === "male" ? 220 - a : 226 - a;
      vo2 = maxHr / r * 15.3;
    }
    const fitness = vo2 > (gender === "male" ? 45 : 38) ? "Excellent"
      : vo2 > (gender === "male" ? 38 : 31) ? "Good"
      : vo2 > (gender === "male" ? 31 : 25) ? "Average"
      : "Below average";
    return { vo2, fitness };
  }, [gender, age, restHr, method, errA, errRh]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useMemo(() => { if (result) onResult({ vo2max: result.vo2.toFixed(1), fitness: result.fitness }); }, [result]);

  return (
    <CalculatorCard title="VO₂ Max" icon={<Timer className="w-5 h-5" />} color="#8B5CF6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <SelectRow label="Gender" value={gender} onChange={setGender} options={[{ value: "male", label: "Male" }, { value: "female", label: "Female" }]} />
        <InputRow label="Age" unit="years" value={age} onChange={setAge} min={10} max={120} error={errA} />
        <InputRow label="Resting HR" unit="bpm" value={restHr} onChange={setRestHr} min={30} max={120} error={method === "resting" ? errRh : undefined} />
        <SelectRow label="Method" value={method} onChange={setMethod} options={[{ value: "resting", label: "Resting HR method" }, { value: "maxhr", label: "Max HR method" }]} />
      </div>
      {result && (
        <div className="mt-6 space-y-4">
          <ResultDisplay label="VO₂ Max" value={result.vo2.toFixed(1)} unit="ml/kg/min" color="#8B5CF6" description={result.fitness} />
          <BarChart data={[
            { label: "Below Avg", value: 25, max: 60 },
            { label: "Average", value: 33, max: 60 },
            { label: "Good", value: 40, max: 60 },
            { label: "Excellent", value: 48, max: 60 },
            { label: "Your VO₂ Max", value: result.vo2, max: 60 },
          ]} color="#8B5CF6" />
          <InfoBox title="What is VO₂ Max?">
            VO₂ Max is the maximum rate of oxygen consumption during exercise. Higher values indicate better cardiovascular fitness. Improve it with consistent Zone 2 cardio and HIIT at GYM 56.
          </InfoBox>
        </div>
      )}
    </CalculatorCard>
  );
}
