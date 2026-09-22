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
  BsCup,
  BsBoxSeam,
  BsCart3,
  BsBuilding,
  BsCalendarEvent,
  BsShieldLock,
} from "react-icons/bs";
import type { IconType } from "react-icons";
// Reusing the same MenuKey enum UAM's Role→Menu toggles already speak —
// one shared vocabulary, so a sidebar item and its RoleMenuPermission row
// always refer to the exact same thing, spelled the exact same way.
import type { MenuKey } from "../modules/uam/types/Uam"; // adjust path if orgConfig.ts sits elsewhere relative to modules/uam

export interface MenuItem {
  id: string;
  icon: IconType;
  label: string;
  href: string;
  group: string;
  // Hard, permanent gate — never configurable via the toggle panel.
  // Used only for things like UAM itself, which must always be
  // Super-Admin-only regardless of what any RoleMenuPermission row says.
  roles?: ("SUPER_ADMIN" | "ADMIN" | "STAFF" | "DELIVERY_BOY")[];
  // Soft, Super-Admin-configurable gate. If set, the Sidebar checks this
  // item against the logged-in user's enabledMenuKeys (from login()/me()
  // — see auth.store.ts) before showing it. Omit entirely for items that
  // should always show to everyone with base access (rare — most items
  // should have one).
  menuKey?: MenuKey;
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
  groups: [
    "Main",
    "Operations",
    "Billing",
    "HR",
    "Finance",
    "Analytics",
    "Admin",
  ],
  menuItems: [
    {
      id: "dashboard",
      icon: AiOutlineHome,
      label: "Dashboard",
      href: "/admin/dashboard",
      group: "Main",
      menuKey: "DASHBOARD",
    },
    {
      id: "customers",
      icon: BsPeopleFill,
      label: "Customer Management",
      href: "/admin/customers",
      group: "Operations",
      menuKey: "CUSTOMER_MANAGEMENT",
    },
    {
      id: "products",
      icon: BsBox,
      label: "Product Management",
      href: "/admin/products",
      group: "Operations",
      menuKey: "PRODUCT_MANAGEMENT",
    },
    {
      id: "billing-pos",
      icon: BsReceipt,
      label: "Billing & POS",
      href: "/admin/billing-pos",
      group: "Billing",
      menuKey: "BILLING_POS",
    },
    {
      id: "event-orders",
      icon: BsCalendarEvent,
      label: "Event / Function Orders",
      href: "/admin/event-orders",
      group: "Billing",
      menuKey: "EVENT_ORDERS",
    },
    {
      id: "inventory",
      icon: BsClipboardData,
      label: "Inventory Management",
      href: "/admin/inventory",
      group: "Billing",
      menuKey: "INVENTORY",
    },
    {
      id: "expenses",
      icon: BsWallet2,
      label: "Expense Management",
      href: "/admin/expenses",
      group: "Finance",
      menuKey: "EXPENSES",
    },
    {
      id: "uam",
      icon: BsShieldLock,
      label: "User Access Management",
      href: "/admin/uam",
      group: "Admin",
      roles: ["SUPER_ADMIN"], // hard gate only — deliberately no menuKey
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
// NOTE: this config's menuItem ids/labels (e.g. "SKU Management" instead
// of "Product Management") don't line up with the shared MenuKey enum at
// all yet — that enum was built only from the Water Plant sidebar's
// current items. Leaving menuKey off every entry here for now rather than
// guessing a mapping; a Beverage-side STAFF/ADMIN account would currently
// see everything unfiltered until this config gets its own reviewed set.
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
  groups: [
    "Main",
    "Operations",
    "Billing",
    "HR",
    "Finance",
    "Analytics",
    "Admin",
  ],
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

export const ORG_CONFIGS: Record<string, OrgConfig> = {
  "balaji-aqua": waterPlantConfig,
  "royal-beverage": beverageConfig,
};

export const getOrgConfig = (orgId?: string | null): OrgConfig => {
  return ORG_CONFIGS[orgId || ""] ?? waterPlantConfig;
};
