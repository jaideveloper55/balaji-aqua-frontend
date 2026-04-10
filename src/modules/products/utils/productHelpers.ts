import type { Product, ProductCategory, AlertRule } from "../types/Product";

export const fmt = (v: number): string => v.toLocaleString("en-IN");

export const fmtDate = (d: string): string =>
  new Date(d).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

export type ProductAlertLevel = "critical" | "warning" | null;

export const getProductAlertLevel = (
  product: Product,
  rules: AlertRule[]
): ProductAlertLevel => {
  for (const rule of rules) {
    if (!rule.enabled) continue;
    if (
      rule.categories !== "all" &&
      !(rule.categories as ProductCategory[]).includes(product.category)
    ) {
      continue;
    }

    const matched = (() => {
      switch (rule.trigger) {
        case "stock_zero":
          return product.stock === 0;
        case "stock_below_min":
          return product.stock > 0 && product.stock <= product.minStock;
        case "stock_below_custom":
          return !!rule.threshold && product.stock <= rule.threshold;
        case "inactive_product":
          return product.status === "inactive";
        default:
          return false;
      }
    })();

    if (matched) {
      return rule.severity === "critical" ? "critical" : "warning";
    }
  }
  return null;
};

export const buildProductStats = (products: Product[]) => ({
  total: products.length,
  active: products.filter((p) => p.status === "active").length,
  outOfStock: products.filter(
    (p) => p.status === "out_of_stock" || p.stock === 0
  ).length,
  lowStock: products.filter((p) => p.stock > 0 && p.stock <= p.minStock).length,
});
