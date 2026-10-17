import {
  HiOutlineCheckCircle,
  HiOutlineClipboardList,
  HiOutlineClock,
  HiOutlineUserAdd,
} from "react-icons/hi";
import CustomStatCard from "../../../components/common/CustomStatCard";
import type { OrderStats } from "../types/Orders";

export type StatKey = "today" | "delivered" | "overdue" | "unassigned";

interface Props {
  stats?: OrderStats;
  onSelect: (key: StatKey) => void;
}

const Orderstatcards = ({ stats, onSelect }: Props) => {
  const n = (v?: number) => (v === undefined ? "–" : v);

  const cards = [
    {
      key: "today" as const,
      label: "Today's Orders",
      icon: HiOutlineClipboardList,
      value: n(stats?.today.total),
      color: "#2563eb",
      bg: "#eff6ff",
      tooltip: "Everything planned for today – click to see it",
    },
    {
      key: "delivered" as const,
      label: "Delivered Today",
      icon: HiOutlineCheckCircle,
      value: n(stats?.today.delivered),
      color: "#059669",
      bg: "#ecfdf5",
      tooltip: stats
        ? `${stats.today.pending} still pending today – click to see the delivered ones`
        : undefined,
    },
    {
      key: "overdue" as const,
      label: "Overdue",
      icon: HiOutlineClock,
      value: n(stats?.overdue),
      color: "#dc2626",
      bg: "#fef2f2",
      alert: (stats?.overdue ?? 0) > 0,
      tooltip: "Pending orders whose delivery day has passed – click to review",
    },
    {
      key: "unassigned" as const,
      label: "Not Assigned",
      icon: HiOutlineUserAdd,
      value: n(stats?.unassigned),
      color: "#d97706",
      bg: "#fffbeb",
      alert: (stats?.unassigned ?? 0) > 0,
      tooltip: "Pending orders with no delivery boy yet – click to assign them",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((c) => {
        const Icon = c.icon;
        return (
          <button
            key={c.key}
            type="button"
            onClick={() => onSelect(c.key)}
            className="rounded-2xl text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-300"
            aria-label={`${c.label}: ${c.value}`}
          >
            <CustomStatCard
              icon={<Icon className="h-6 w-6" />}
              label={c.label}
              value={c.value}
              color={c.color}
              bg={c.bg}
              alert={"alert" in c ? c.alert : false}
              tooltip={c.tooltip}
            />
          </button>
        );
      })}
    </div>
  );
};

export default Orderstatcards;
