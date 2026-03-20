import type { TenantConfig, TenantId } from "../types/Auth";

export const TENANT_CONFIG: Record<TenantId, TenantConfig> = {
  "sri-balaji-aqua": {
    id: "sri-balaji-aqua",
    name: "Sri Balaji Aqua Water",
    shortName: "Aqua",
    tagline: "Premium Water Solutions",
    accent: "#0077B6",
    accentHover: "#005F8A",
    accentSoft: "rgba(0,119,182,0.08)",
    gradientFrom: "#023E58",
    gradientVia: "#0077B6",
    gradientTo: "#00A8E8",
    description:
      "End-to-end water delivery management — billing, routing, and customer ops in one unified platform.",
    features: [
      { icon: "truck", title: "Live Tracking", desc: "Real-time delivery GPS" },
      { icon: "droplet", title: "Smart Routes", desc: "AI route optimization" },
      { icon: "chart", title: "Auto Billing", desc: "Invoicing & payments" },
      { icon: "phone", title: "Self Service", desc: "Customer portal" },
    ],
  },
  "royal-beverage": {
    id: "royal-beverage",
    name: "Royal Beverage",
    shortName: "Beverage",
    tagline: "Refreshing Drinks Division",
    accent: "#059669",
    accentHover: "#047857",
    accentSoft: "rgba(5,150,105,0.08)",
    gradientFrom: "#022C22",
    gradientVia: "#059669",
    gradientTo: "#34D399",
    description:
      "Complete beverage distribution — inventory, dispatch, and real-time delivery tracking at scale.",
    features: [
      { icon: "cube", title: "Multi-SKU", desc: "Full inventory control" },
      { icon: "package", title: "Fleet Ops", desc: "Dispatch management" },
      { icon: "trending", title: "Analytics", desc: "Sales dashboards" },
      { icon: "handshake", title: "Network", desc: "Dealer & distributor" },
    ],
  },
};

export const TENANT_LIST = Object.values(TENANT_CONFIG);
