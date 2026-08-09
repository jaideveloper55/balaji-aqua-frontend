import { EVENT_TYPE_META } from "../constants/Events.constants";
import type { EventType } from "../types/Events";

interface Props {
  type: EventType;
}

const EventTypeBadge = ({ type }: Props) => {
  const meta = EVENT_TYPE_META[type];
  const Icon = meta.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium ring-1 ring-inset ${meta.bg} ${meta.text} ${meta.ring}`}
    >
      <Icon className="w-3.5 h-3.5" aria-hidden />
      {meta.label}
    </span>
  );
};

export default EventTypeBadge;
