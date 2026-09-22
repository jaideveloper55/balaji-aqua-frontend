import type { IconType } from "react-icons";
import { AiOutlineHome } from "react-icons/ai";
import {
  BsPeopleFill,
  BsBox,
  BsReceipt,
  BsCalendarEvent,
  BsClipboardData,
  BsWallet2,
} from "react-icons/bs";
import type { MenuKey } from "../types/Uam";

export const MENU_KEY_META: Record<
  MenuKey,
  {
    label: string;
    icon: IconType;
    group: string;
  }
> = {
  DASHBOARD: {
    label: "Dashboard",
    icon: AiOutlineHome,
    group: "Main",
  },

  CUSTOMER_MANAGEMENT: {
    label: "Customer Management",
    icon: BsPeopleFill,
    group: "Operations",
  },

  PRODUCT_MANAGEMENT: {
    label: "Product Management",
    icon: BsBox,
    group: "Operations",
  },

  BILLING_POS: {
    label: "Billing & POS",
    icon: BsReceipt,
    group: "Billing",
  },

  EVENT_ORDERS: {
    label: "Event / Function Orders",
    icon: BsCalendarEvent,
    group: "Billing",
  },

  INVENTORY: {
    label: "Inventory Management",
    icon: BsClipboardData,
    group: "Billing",
  },

  EXPENSES: {
    label: "Expense Management",
    icon: BsWallet2,
    group: "Finance",
  },
};

export const ALL_MENU_KEYS = Object.keys(MENU_KEY_META) as MenuKey[];

export const GROUPED_MENU_KEYS: [string, MenuKey[]][] = (() => {
  const groups = new Map<string, MenuKey[]>();
  ALL_MENU_KEYS.forEach((key) => {
    const group = MENU_KEY_META[key].group;
    if (!groups.has(group)) groups.set(group, []);
    groups.get(group)!.push(key);
  });
  return Array.from(groups.entries());
})();
