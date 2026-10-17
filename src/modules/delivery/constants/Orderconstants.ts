import dayjs from "dayjs";
import type { Order, OrderStatus } from "../types/Orders";

export const STATUS_META: Record<
  OrderStatus,
  { label: string; badge: string; dot: string }
> = {
  PENDING: {
    label: "Pending",
    badge: "bg-amber-50 text-amber-700 border-amber-200",
    dot: "bg-amber-500",
  },
  DELIVERED: {
    label: "Delivered",
    badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
    dot: "bg-emerald-500",
  },
  CANCELLED: {
    label: "Cancelled",
    badge: "bg-slate-100 text-slate-600 border-slate-200",
    dot: "bg-slate-400",
  },
};

/** Tabs above the table. `key` "ALL" means "no status filter". */
export const STATUS_TABS: { key: "ALL" | OrderStatus; label: string }[] = [
  { key: "ALL", label: "All" },
  { key: "PENDING", label: "Pending" },
  { key: "DELIVERED", label: "Delivered" },
  { key: "CANCELLED", label: "Cancelled" },
];

// ─── Dates (India day, same as the server) ─────────────────────────────────────────────────────────
const DAY = "YYYY-MM-DD";

/** Today in India as "YYYY-MM-DD", whatever timezone the browser is in. */
export const todayIST = (): string =>
  new Date(Date.now() + 330 * 60 * 1000).toISOString().slice(0, 10);

export const addDays = (day: string, n: number): string =>
  dayjs(day).add(n, "day").format(DAY);

/** "Today" / "Tomorrow" / "Yesterday" / "12 Oct" - what a person would say. */
export function dayLabel(day: string): string {
  const today = todayIST();
  if (day === today) return "Today";
  if (day === addDays(today, 1)) return "Tomorrow";
  if (day === addDays(today, -1)) return "Yesterday";
  const sameYear = dayjs(day).year() === dayjs(today).year();
  return dayjs(day).format(sameYear ? "D MMM" : "D MMM YYYY");
}

/** A PENDING order whose day has already passed - the ones that need attention. */
export const isOverdue = (o: Pick<Order, "status" | "deliveryDate">): boolean =>
  o.status === "PENDING" && o.deliveryDate < todayIST();

// ─── Money & names ─────────────────────────────────────────────────────────────────────────────────
export const formatINR = (v: number): string =>
  `₹${v.toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;

export const initials = (name: string): string =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join("") || "?";

export const SLOT_OPTIONS = [
  { value: "06:00-08:00", label: "6–8 AM" },
  { value: "08:00-10:00", label: "8–10 AM" },
  { value: "09:00-11:00", label: "9–11 AM" },
  { value: "10:00-12:00", label: "10 AM–12 PM" },
  { value: "12:00-14:00", label: "12–2 PM" },
  { value: "14:00-16:00", label: "2–4 PM" },
  { value: "16:00-18:00", label: "4–6 PM" },
  { value: "18:00-20:00", label: "6–8 PM" },
];

// ─── Slot helpers ──────────────────────────────────────────────────────────────────────────────────
/** "09:00","11:00" -> "9–11 AM" (the text the server makes). */
export function slotText(from: string, to: string): string {
  const p = (t: string) => {
    const [h, m] = t.split(":").map(Number) as [number, number];
    const h12 = h % 12 === 0 ? 12 : h % 12;
    return {
      text: m === 0 ? String(h12) : `${h12}:${String(m).padStart(2, "0")}`,
      ap: h < 12 ? "AM" : "PM",
    };
  };
  const a = p(from);
  const b = p(to);
  return a.ap === b.ap
    ? `${a.text}–${b.text} ${b.ap}`
    : `${a.text} ${a.ap}–${b.text} ${b.ap}`;
}

/** An order's slot as the dropdown value ("" = any time). */
export const slotValueOf = (o: Pick<Order, "slotFrom" | "slotTo">): string =>
  o.slotFrom && o.slotTo ? `${o.slotFrom}-${o.slotTo}` : "";

/** The dropdown value back into the two times ("" -> both null). */
export function splitSlot(value?: string | null): {
  slotFrom: string | null;
  slotTo: string | null;
} {
  if (!value) return { slotFrom: null, slotTo: null };
  const [slotFrom, slotTo] = value.split("-");
  return { slotFrom: slotFrom ?? null, slotTo: slotTo ?? null };
}
