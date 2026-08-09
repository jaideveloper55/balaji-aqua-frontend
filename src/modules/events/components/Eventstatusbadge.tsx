import type { EventOrderStatus } from "../types/Events";

const EVENT_STATUS_META: Record<
  EventOrderStatus,
  { label: string; bg: string; text: string; dot: string }
> = {
  DRAFT: {
    label: "Draft",
    bg: "bg-slate-100",
    text: "text-slate-600",
    dot: "bg-slate-400",
  },
  CONFIRMED: {
    label: "Confirmed",
    bg: "bg-blue-100",
    text: "text-blue-700",
    dot: "bg-blue-500",
  },
  IN_PROGRESS: {
    label: "In Progress",
    bg: "bg-amber-100",
    text: "text-amber-700",
    dot: "bg-amber-500",
  },
  DELIVERED: {
    label: "Delivered",
    bg: "bg-cyan-100",
    text: "text-cyan-700",
    dot: "bg-cyan-500",
  },
  COMPLETED: {
    label: "Completed",
    bg: "bg-emerald-100",
    text: "text-emerald-700",
    dot: "bg-emerald-500",
  },
  CANCELLED: {
    label: "Cancelled",
    bg: "bg-red-100",
    text: "text-red-700",
    dot: "bg-red-500",
  },
};

interface Props {
  status: EventOrderStatus;
}

const EventStatusBadge = ({ status }: Props) => {
  const meta = EVENT_STATUS_META[status] ?? {
    label: status,
    bg: "bg-slate-100",
    text: "text-slate-600",
    dot: "bg-slate-400",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${meta.bg} ${meta.text}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${meta.dot}`} />
      {meta.label}
    </span>
  );
};

export default EventStatusBadge;
