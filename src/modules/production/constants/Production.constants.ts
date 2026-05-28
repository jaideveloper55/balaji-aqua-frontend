import {
  ProductionShift,
  ProductionStatus,
  QualityResult,
} from "../types/Production";

export const SHIFT_OPTIONS: { value: ProductionShift; label: string }[] = [
  { value: "morning", label: "Morning (6am – 2pm)" },
  { value: "evening", label: "Evening (2pm – 10pm)" },
  { value: "night", label: "Night (10pm – 6am)" },
];

export const PRODUCT_OPTIONS = [
  { value: "20L Jar", label: "20L Jar" },
  { value: "1L Bottle", label: "1L Bottle" },
  { value: "500ml Bottle", label: "500ml Bottle" },
  { value: "250ml Cup", label: "250ml Cup" },
];

export const STATUS_COLORS: Record<
  ProductionStatus,
  { color: string; bg: string; label: string; dot: string }
> = {
  completed: {
    color: "#059669",
    bg: "#ECFDF5",
    label: "Completed",
    dot: "#10B981",
  },
  in_progress: {
    color: "#0284C7",
    bg: "#EFF6FF",
    label: "In Progress",
    dot: "#0EA5E9",
  },
  halted: {
    color: "#DC2626",
    bg: "#FEF2F2",
    label: "Halted",
    dot: "#EF4444",
  },
};

export const QUALITY_COLORS: Record<
  QualityResult,
  { color: string; bg: string; label: string }
> = {
  pass: { color: "#059669", bg: "#ECFDF5", label: "Pass" },
  fail: { color: "#DC2626", bg: "#FEF2F2", label: "Fail" },
  pending: { color: "#D97706", bg: "#FFFBEB", label: "Pending" },
};

export const SHIFT_BADGE: Record<
  ProductionShift,
  { color: string; bg: string; label: string }
> = {
  morning: { color: "#D97706", bg: "#FFFBEB", label: "Morning" },
  evening: { color: "#7C3AED", bg: "#F5F3FF", label: "Evening" },
  night: { color: "#1E40AF", bg: "#EFF6FF", label: "Night" },
};

export const COST_CATEGORIES = [
  { key: "rawWater", label: "Raw Water", color: "#0EA5E9" },
  { key: "electricity", label: "Electricity", color: "#F59E0B" },
  { key: "labor", label: "Labor", color: "#8B5CF6" },
  { key: "packaging", label: "Packaging", color: "#EC4899" },
  { key: "chemicals", label: "Chemicals", color: "#10B981" },
  { key: "maintenance", label: "Maintenance", color: "#EF4444" },
  { key: "others", label: "Others", color: "#64748B" },
];

export const QUALITY_RANGES = {
  tds: { min: 50, max: 150, unit: "ppm" },
  ph: { min: 6.5, max: 8.5, unit: "" },
  temperature: { min: 20, max: 28, unit: "°C" },
  hardness: { min: 30, max: 100, unit: "ppm" },
  chlorine: { min: 0, max: 0.5, unit: "ppm" },
};
