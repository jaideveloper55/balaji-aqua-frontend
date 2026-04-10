/**
 * Format a number in Indian locale (e.g. 1,85,000)
 */
export const fmt = (v: number): string => v.toLocaleString("en-IN");

/**
 * Format a date string to "DD Mon YYYY" (e.g. "01 Mar 2026")
 */
export const fmtDate = (d: string): string => {
  if (!d || d === "-") return "N/A";
  return new Date(d).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};
