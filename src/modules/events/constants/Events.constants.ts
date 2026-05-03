import type {
  EventStatus,
  EventType,
  PaymentStatus,
} from "../types/Events";

// ─── Event Type Display ─────────────────────────────────────────────────────
export const EVENT_TYPE_OPTIONS: Array<{ value: EventType; label: string }> = [
  { value: "WEDDING", label: "Wedding" },
  { value: "ENGAGEMENT", label: "Engagement" },
  { value: "BIRTHDAY", label: "Birthday" },
  { value: "CORPORATE", label: "Corporate" },
  { value: "RELIGIOUS", label: "Religious" },
  { value: "HOUSE_WARMING", label: "House Warming" },
  { value: "OTHER", label: "Other" },
];

export const EVENT_TYPE_META: Record<
  EventType,
  { label: string; emoji: string; bg: string; text: string; ring: string }
> = {
  WEDDING: {
    label: "Wedding",
    emoji: "💍",
    bg: "bg-rose-50",
    text: "text-rose-700",
    ring: "ring-rose-200",
  },
  ENGAGEMENT: {
    label: "Engagement",
    emoji: "💐",
    bg: "bg-pink-50",
    text: "text-pink-700",
    ring: "ring-pink-200",
  },
  BIRTHDAY: {
    label: "Birthday",
    emoji: "🎂",
    bg: "bg-amber-50",
    text: "text-amber-700",
    ring: "ring-amber-200",
  },
  CORPORATE: {
    label: "Corporate",
    emoji: "🏢",
    bg: "bg-indigo-50",
    text: "text-indigo-700",
    ring: "ring-indigo-200",
  },
  RELIGIOUS: {
    label: "Religious",
    emoji: "🕉️",
    bg: "bg-orange-50",
    text: "text-orange-700",
    ring: "ring-orange-200",
  },
  HOUSE_WARMING: {
    label: "House Warming",
    emoji: "🏠",
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    ring: "ring-emerald-200",
  },
  OTHER: {
    label: "Other",
    emoji: "✨",
    bg: "bg-slate-50",
    text: "text-slate-700",
    ring: "ring-slate-200",
  },
};

// ─── Event Status Display ───────────────────────────────────────────────────
export const EVENT_STATUS_OPTIONS: Array<{
  value: EventStatus;
  label: string;
}> = [
  { value: "DRAFT", label: "Draft" },
  { value: "CONFIRMED", label: "Confirmed" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "DELIVERED", label: "Delivered" },
  { value: "COMPLETED", label: "Completed" },
  { value: "CANCELLED", label: "Cancelled" },
];

export const EVENT_STATUS_META: Record<
  EventStatus,
  { label: string; dot: string; bg: string; text: string }
> = {
  DRAFT: {
    label: "Draft",
    dot: "bg-slate-400",
    bg: "bg-slate-50",
    text: "text-slate-700",
  },
  CONFIRMED: {
    label: "Confirmed",
    dot: "bg-blue-500",
    bg: "bg-blue-50",
    text: "text-blue-700",
  },
  IN_PROGRESS: {
    label: "In Progress",
    dot: "bg-amber-500",
    bg: "bg-amber-50",
    text: "text-amber-700",
  },
  DELIVERED: {
    label: "Delivered",
    dot: "bg-cyan-500",
    bg: "bg-cyan-50",
    text: "text-cyan-700",
  },
  COMPLETED: {
    label: "Completed",
    dot: "bg-emerald-500",
    bg: "bg-emerald-50",
    text: "text-emerald-700",
  },
  CANCELLED: {
    label: "Cancelled",
    dot: "bg-red-500",
    bg: "bg-red-50",
    text: "text-red-700",
  },
};

// ─── Payment Status ─────────────────────────────────────────────────────────
export const PAYMENT_STATUS_META: Record<
  PaymentStatus,
  { label: string; bg: string; text: string }
> = {
  UNPAID: { label: "Unpaid", bg: "bg-red-50", text: "text-red-700" },
  PARTIAL: { label: "Partial", bg: "bg-amber-50", text: "text-amber-700" },
  PAID: { label: "Paid", bg: "bg-emerald-50", text: "text-emerald-700" },
};

export const DEFAULT_PAGE_SIZE = 10;

export const formatINR = (n: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);

export const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
