import { STATUS_META } from "../constants/Orderconstants";
import type { OrderStatus } from "../types/Orders";

interface Props {
  status: OrderStatus;
  overdue?: boolean;
}

const Orderstatusbadge = ({ status, overdue = false }: Props) => {
  const meta = overdue
    ? {
        label: "Overdue",
        badge: "bg-red-50 text-red-700 border-red-200",
        dot: "bg-red-500",
      }
    : STATUS_META[status];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${meta.badge}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} />
      {meta.label}
    </span>
  );
};

export default Orderstatusbadge;
