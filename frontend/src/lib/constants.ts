import { Code, Cpu, Layers, Sparkles, Users, type LucideIcon } from "lucide-react";

export const experienceLevels = [
  { value: "entry", label: "Entry", hint: "0–2 years" },
  { value: "mid", label: "Mid", hint: "2–5 years" },
  { value: "senior", label: "Senior", hint: "5–8 years" },
  { value: "expert", label: "Expert", hint: "8+ years" },
] as const;

export const categories: { value: string; label: string; icon: LucideIcon }[] = [
  { value: "technical", label: "Technical", icon: Code },
  { value: "behavioral", label: "Behavioral", icon: Users },
  { value: "system-design", label: "System Design", icon: Layers },
  { value: "coding", label: "Coding", icon: Cpu },
  { value: "mixed", label: "Mixed", icon: Sparkles },
];

export const difficultyStyles: Record<string, string> = {
  easy: "bg-emerald-500/10 text-emerald-300 ring-1 ring-emerald-500/20",
  medium: "bg-amber-500/10 text-amber-300 ring-1 ring-amber-500/20",
  hard: "bg-orange-500/10 text-orange-300 ring-1 ring-orange-500/20",
  expert: "bg-rose-500/10 text-rose-300 ring-1 ring-rose-500/20",
};

export const categoryStyles: Record<string, string> = {
  technical: "bg-sky-500/12 text-sky-300",
  behavioral: "bg-emerald-500/12 text-emerald-300",
  "system-design": "bg-violet-500/12 text-violet-300",
  coding: "bg-orange-500/12 text-orange-300",
  mixed: "bg-indigo-500/12 text-indigo-300",
};

export function labelForExperience(value: string) {
  return experienceLevels.find((level) => level.value === value)?.label ?? value;
}

export function labelForCategory(value: string) {
  return categories.find((category) => category.value === value)?.label ?? value;
}

export function questionCount(questions?: unknown[]) {
  return questions?.length ?? 0;
}
