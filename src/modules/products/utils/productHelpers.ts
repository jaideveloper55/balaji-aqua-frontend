export const fmt = (v: number): string => v.toLocaleString("en-IN");

export const fmtDate = (d: string): string =>
  new Date(d).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
