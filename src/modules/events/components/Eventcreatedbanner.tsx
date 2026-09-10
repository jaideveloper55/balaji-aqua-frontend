import dayjs from "dayjs";
import { HiOutlineCheckCircle, HiOutlineX } from "react-icons/hi";
import type { EventOrder } from "../types/Events";

const EVENT_TYPE_LABELS: Record<string, string> = {
  WEDDING: "Wedding",
  ENGAGEMENT: "Engagement",
  BIRTHDAY: "Birthday",
  CORPORATE: "Corporate",
  RELIGIOUS: "Religious",
  HOUSE_WARMING: "House Warming",
  OTHER: "Other",
};

interface Props {
  event: EventOrder;
  onDismiss: () => void;
}

const getRelativeDayLabel = (eventDate: string): string => {
  const target = dayjs(eventDate).startOf("day");
  const today = dayjs().startOf("day");
  const diffDays = target.diff(today, "day");

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Tomorrow";
  if (diffDays === -1) return "Yesterday";
  if (diffDays > 1) return `in ${diffDays} days`;
  if (diffDays < -1) return `${Math.abs(diffDays)} days ago`;
  return target.format("DD MMM YYYY");
};

const EventCreatedBanner = ({ event, onDismiss }: Props) => {
  const typeLabel = EVENT_TYPE_LABELS[event.eventType] ?? event.eventType;
  const dateLabel = dayjs(event.eventDate).format("ddd, DD MMM YYYY");
  const relativeLabel = getRelativeDayLabel(event.eventDate);
  const venue = [event.venueName, event.venueCity].filter(Boolean).join(", ");

  return (
    <div className="flex items-center justify-between gap-3 bg-emerald-50 border border-emerald-200 rounded-2xl px-4 py-3">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-9 h-9 rounded-full bg-emerald-500 flex items-center justify-center shrink-0">
          <HiOutlineCheckCircle className="w-5 h-5 text-white" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-bold text-emerald-800 truncate">
            Event Created: {event.eventName}
          </p>
          <p className="text-xs text-emerald-700 truncate">
            {typeLabel} · {dateLabel} ({relativeLabel})
            {venue ? ` · ${venue}` : ""}
            {event.deliveryTime ? ` · ${event.deliveryTime}` : ""}
          </p>
        </div>
      </div>
      <button
        onClick={onDismiss}
        className="p-1.5 rounded-lg hover:bg-emerald-100 transition-colors shrink-0"
        aria-label="Dismiss"
      >
        <HiOutlineX className="w-4 h-4 text-emerald-600" />
      </button>
    </div>
  );
};

export default EventCreatedBanner;
