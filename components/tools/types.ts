import { LucideIcon } from "lucide-react";

export interface CalculatorDef {
  slug: string;
  name: string;
  description: string;
  icon: LucideIcon;
  category: "body" | "performance" | "nutrition" | "cardio";
  color: string;
}

export interface CalculatorProps {
  result?: Record<string, string | number>;
  setResult: (r: Record<string, string | number>) => void;
}

export interface ValidationResult {
  valid: boolean;
  errors: Record<string, string>;
}
