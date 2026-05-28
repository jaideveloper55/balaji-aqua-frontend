export const formatINR = (n: number, compact = false) => {
  if (compact) {
    if (n >= 10000000) return `₹${(n / 10000000).toFixed(2)}Cr`;
    if (n >= 100000) return `₹${(n / 100000).toFixed(2)}L`;
    if (n >= 1000) return `₹${(n / 1000).toFixed(1)}K`;
  }
  return `₹${n.toLocaleString("en-IN")}`;
};

export const formatNumber = (n: number, compact = false) => {
  if (compact) {
    if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
    if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  }
  return n.toLocaleString("en-IN");
};

export const formatPercent = (n: number) => `${n.toFixed(1)}%`;

export const formatLitres = (n: number) => {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K L`;
  return `${n} L`;
};

export const formatValue = (
  v: number,
  format: "currency" | "number" | "percent" | "litres",
  compact = true
) => {
  switch (format) {
    case "currency":
      return formatINR(v, compact);
    case "number":
      return formatNumber(v, compact);
    case "percent":
      return formatPercent(v);
    case "litres":
      return formatLitres(v);
    default:
      return v.toString();
  }
};

export const calcChange = (curr: number, prev: number) => {
  if (prev === 0) return curr > 0 ? 100 : 0;
  return ((curr - prev) / prev) * 100;
};
