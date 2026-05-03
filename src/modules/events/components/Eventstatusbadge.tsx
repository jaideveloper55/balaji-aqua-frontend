import { EVENT_STATUS_META } from "../constants/Events.constants";
import type { EventStatus } from "../types/Events";

interface Props {
  status: EventStatus;
}

const EventStatusBadge = ({ status }: Props) => {
  const meta = EVENT_STATUS_META[status];

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
