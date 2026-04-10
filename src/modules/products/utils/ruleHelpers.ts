import type { AlertTrigger, AlertRule } from "../types/Product";

export const needsThreshold = (trigger: AlertTrigger): boolean =>
  ["stock_below_custom", "stock_below_percent", "no_sales_days"].includes(
    trigger
  );

export const thresholdLabel = (trigger: AlertTrigger): string => {
  switch (trigger) {
    case "stock_below_custom":
      return "Stock Threshold (units)";
    case "stock_below_percent":
      return "Percentage (%)";
    case "no_sales_days":
      return "Days without sales";
    default:
      return "Threshold";
  }
};

export const thresholdSuffix = (trigger: AlertTrigger): string => {
  if (trigger === "stock_below_percent") return "%";
  if (trigger === "no_sales_days") return " days";
  return " units";
};

export const formatCategories = (
  categories: AlertRule["categories"]
): string => {
  if (categories === "all") return "All categories";
  return (categories as string[]).join(", ");
};

let ruleCounter = 0;
export const generateRuleId = (existingCount: number): string => {
  ruleCounter = Math.max(ruleCounter, existingCount) + 1;
  return "ALR-" + String(ruleCounter).padStart(3, "0");
};
