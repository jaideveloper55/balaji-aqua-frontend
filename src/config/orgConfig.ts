import {
  AiOutlineHome,
  AiOutlineBarChart,
  AiOutlineCalendar,
  AiOutlineDollar,
  AiOutlineTeam,
} from "react-icons/ai";
import {
  BsDroplet,
  BsPeopleFill,
  BsBox,
  BsTruck,
  BsReceipt,
  BsClipboardData,
  BsWallet2,
  BsGraphUp,
  BsCalendarEvent,
  BsCup,
  BsBoxSeam,
  BsCart3,
  BsBuilding,
} from "react-icons/bs";
import type { IconType } from "react-icons";

export interface MenuItem {
  id: string;
  icon: IconType;
  label: string;
  href: string;
  group: string;
}

export interface QuickLink {
  href: string;
  icon: IconType;
  label: string;
}

export interface OrgTheme {
  primary: string;
  gradientFrom: string;
  gradientTo: string;
  activeBg: string;
  activeShadow: string;
  hoverBg: string;
  pillBg: string;
  pillText: string;
  accentText: string;
  dropdownHoverBg: string;
  dropdownHoverText: string;
  /** Full group-hover class for icon color, e.g. "group-hover/item:text-blue-500" */
  iconGroupHover: string;
}

export interface OrgConfig {
  id: string;
  name: string;
  subtitle: string;
  tagline: string;
  logoIcon: IconType;
  theme: OrgTheme;
  menuItems: MenuItem[];
  groups: string[];
  quickLinks: QuickLink[];
}

// ── Balaji Aqua — Water Plant ─────────────────────────────────────
const waterPlantConfig: OrgConfig = {
  id: "balaji-aqua",
  name: "Balaji Aqua",
  subtitle: "Water Plant ERP",
  tagline: "Balaji Aqua Water Plant — ERP Dashboard",
  logoIcon: BsDroplet,
  theme: {
    primary: "#3b82f6",
    gradientFrom: "from-blue-500",
    gradientTo: "to-blue-600",
    activeBg: "bg-blue-500",
    activeShadow: "shadow-blue-500/25",
    hoverBg: "hover:bg-blue-50",
    pillBg: "bg-blue-50",
    pillText: "text-blue-600",
    accentText: "text-blue-500",
    dropdownHoverBg: "hover:bg-blue-50",
    dropdownHoverText: "hover:text-blue-600",
    iconGroupHover: "group-hover/item:text-blue-500",
  },
  groups: ["Main", "Operations", "Billing", "HR", "Finance", "Analytics"],
  menuItems: [
    {
      id: "dashboard",
      icon: AiOutlineHome,
      label: "Dashboard",
      href: "/admin/dashboard",
      group: "Main",
    },
    {
      id: "customers",
      icon: BsPeopleFill,
      label: "Customer Management",
      href: "/admin/customers",
      group: "Operations",
    },
    {
      id: "products",
      icon: BsBox,
      label: "Product Management",
      href: "/admin/products",
      group: "Operations",
    },
    {
      id: "delivery",
      icon: BsTruck,
      label: "Delivery Management",
      href: "/admin/delivery",
      group: "Operations",
    },
    {
      id: "jar-tracking",
      icon: BsDroplet,
      label: "Jar / Can Tracking",
      href: "/admin/jar-tracking",
      group: "Operations",
    },
    {
      id: "billing-pos",
      icon: BsReceipt,
      label: "Billing & POS",
      href: "/admin/billing-pos",
      group: "Billing",
    },
    {
      id: "event-orders",
      icon: BsCalendarEvent,
      label: "Event / Function Orders",
      href: "/admin/event-orders",
      group: "Billing",
    },
    {
      id: "inventory",
      icon: BsClipboardData,
      label: "Inventory Management",
      href: "/admin/inventory",
      group: "Billing",
    },
    {
      id: "employees",
      icon: AiOutlineTeam,
      label: "Employee Management",
      href: "/admin/employees",
      group: "HR",
    },
    {
      id: "attendance",
      icon: AiOutlineCalendar,
      label: "Attendance & Overtime",
      href: "/admin/attendance",
      group: "HR",
    },
    {
      id: "salary",
      icon: AiOutlineDollar,
      label: "Salary Management",
      href: "/admin/salary",
      group: "HR",
    },
    {
      id: "expenses",
      icon: BsWallet2,
      label: "Expense Management",
      href: "/admin/expenses",
      group: "Finance",
    },
    {
      id: "production",
      icon: BsGraphUp,
      label: "Water Production & Cost",
      href: "/admin/production",
      group: "Finance",
    },
    {
      id: "reports",
      icon: AiOutlineBarChart,
      label: "Reports & Analytics",
      href: "/admin/reports",
      group: "Analytics",
    },
  ],
  quickLinks: [
    { href: "/admin/dashboard", icon: AiOutlineHome, label: "Dashboard" },
    { href: "/admin/customers", icon: BsPeopleFill, label: "Customers" },
    { href: "/admin/billing-pos", icon: BsReceipt, label: "Billing & POS" },
    { href: "/admin/reports", icon: AiOutlineBarChart, label: "Reports" },
    { href: "/admin/employees", icon: AiOutlineTeam, label: "Employees" },
  ],
};

// ── Royal Beverage — Refreshing Drinks ────────────────────────────
const beverageConfig: OrgConfig = {
  id: "royal-beverage",
  name: "Royal Beverage",
  subtitle: "Refreshing Drinks",
  tagline: "Royal Beverage — Distribution Dashboard",
  logoIcon: BsCup,
  theme: {
    primary: "#0d9488",
    gradientFrom: "from-teal-500",
    gradientTo: "to-emerald-600",
    activeBg: "bg-teal-500",
    activeShadow: "shadow-teal-500/25",
    hoverBg: "hover:bg-teal-50",
    pillBg: "bg-teal-50",
    pillText: "text-teal-600",
    accentText: "text-teal-500",
    dropdownHoverBg: "hover:bg-teal-50",
    dropdownHoverText: "hover:text-teal-600",
    iconGroupHover: "group-hover/item:text-teal-500",
  },
  groups: ["Main", "Inventory", "Sales", "Fleet", "HR", "Analytics"],
  menuItems: [
    {
      id: "dashboard",
      icon: AiOutlineHome,
      label: "Dashboard",
      href: "/admin/dashboard",
      group: "Main",
    },
    {
      id: "products",
      icon: BsBoxSeam,
      label: "SKU Management",
      href: "/admin/products",
      group: "Inventory",
    },
    {
      id: "inventory",
      icon: BsClipboardData,
      label: "Stock & Warehouse",
      href: "/admin/inventory",
      group: "Inventory",
    },
    {
      id: "production",
      icon: BsGraphUp,
      label: "Production Batches",
      href: "/admin/production",
      group: "Inventory",
    },
    {
      id: "customers",
      icon: BsPeopleFill,
      label: "Dealer Network",
      href: "/admin/customers",
      group: "Sales",
    },
    {
      id: "orders",
      icon: BsCart3,
      label: "Orders & Dispatch",
      href: "/admin/orders",
      group: "Sales",
    },
    {
      id: "billing-pos",
      icon: BsReceipt,
      label: "Billing & Invoicing",
      href: "/admin/billing-pos",
      group: "Sales",
    },
    {
      id: "delivery",
      icon: BsTruck,
      label: "Fleet & Logistics",
      href: "/admin/delivery",
      group: "Fleet",
    },
    {
      id: "routes",
      icon: BsBuilding,
      label: "Route Management",
      href: "/admin/routes",
      group: "Fleet",
    },
    {
      id: "employees",
      icon: AiOutlineTeam,
      label: "Employee Management",
      href: "/admin/employees",
      group: "HR",
    },
    {
      id: "attendance",
      icon: AiOutlineCalendar,
      label: "Attendance & Overtime",
      href: "/admin/attendance",
      group: "HR",
    },
    {
      id: "salary",
      icon: AiOutlineDollar,
      label: "Salary Management",
      href: "/admin/salary",
      group: "HR",
    },
    {
      id: "expenses",
      icon: BsWallet2,
      label: "Expense Tracking",
      href: "/admin/expenses",
      group: "Analytics",
    },
    {
      id: "reports",
      icon: AiOutlineBarChart,
      label: "Reports & Analytics",
      href: "/admin/reports",
      group: "Analytics",
    },
  ],
  quickLinks: [
    { href: "/admin/dashboard", icon: AiOutlineHome, label: "Dashboard" },
    { href: "/admin/customers", icon: BsPeopleFill, label: "Dealers" },
    { href: "/admin/orders", icon: BsCart3, label: "Orders" },
    { href: "/admin/delivery", icon: BsTruck, label: "Fleet" },
    { href: "/admin/reports", icon: AiOutlineBarChart, label: "Reports" },
  ],
};

// ── Registry ──────────────────────────────────────────────────────
export const ORG_CONFIGS: Record<string, OrgConfig> = {
  "balaji-aqua": waterPlantConfig,
  "royal-beverage": beverageConfig,
};

/** Get config by org ID. Falls back to balaji-aqua. */
export const getOrgConfig = (orgId?: string | null): OrgConfig => {
  return ORG_CONFIGS[orgId || ""] ?? waterPlantConfig;
};
