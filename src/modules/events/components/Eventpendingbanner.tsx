import dayjs from "dayjs";
import { HiOutlineExclamationCircle, HiOutlineX } from "react-icons/hi";
import type { EventOrder } from "../types/Events";
import { formatINR } from "../constants/Events.constants";

interface Props {
  event: EventOrder;
  onDismiss: () => void;
  onView: () => void;
}

const getRelativeDayLabel = (eventDate: string): string => {
  const target = dayjs(eventDate).startOf("day");
  const today = dayjs().startOf("day");
  const diffDays = target.diff(today, "day");

  if (diffDays === 0) return "today";
  if (diffDays === 1) return "tomorrow";
  if (diffDays === -1) return "yesterday";
  if (diffDays > 1) return `in ${diffDays} days`;
  if (diffDays < -1) return `${Math.abs(diffDays)} days ago`;
  return target.format("DD MMM YYYY");
};

const STATUS_LABELS: Record<string, string> = {
  DRAFT: "Draft",
  CONFIRMED: "Confirmed",
  IN_PROGRESS: "In Progress",
  DELIVERED: "Delivered",
};

const EventPendingBanner = ({ event, onDismiss, onView }: Props) => {
  const relativeLabel = getRelativeDayLabel(event.eventDate);
  const statusLabel = STATUS_LABELS[event.status] ?? event.status;

  return (
    <div
      onClick={onView}
      className="flex items-center justify-between gap-3 bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3 cursor-pointer hover:border-amber-300 transition-colors"
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-9 h-9 rounded-full bg-amber-500 flex items-center justify-center shrink-0">
          <HiOutlineExclamationCircle className="w-5 h-5 text-white" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-bold text-amber-800 truncate">
            Pending: {event.eventName}
          </p>
          <p className="text-xs text-amber-700 truncate">
            {statusLabel} · Event {relativeLabel} ·{" "}
            {formatINR(event.balanceDue)} due
          </p>
        </div>
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDismiss();
        }}
        className="p-1.5 rounded-lg hover:bg-amber-100 transition-colors shrink-0"
        aria-label="Dismiss for now"
      >
        <HiOutlineX className="w-4 h-4 text-amber-600" />
      </button>
    </div>
  );
};

export default EventPendingBanner;
