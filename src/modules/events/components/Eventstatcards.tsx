import {
  HiOutlineCalendar,
  HiOutlineClock,
  HiOutlineCurrencyRupee,
  HiOutlineExclamationCircle,
} from "react-icons/hi";
import { formatINR } from "../constants/Events.constants";
import type { EventOrderStats } from "../types/Events";
import CustomStatCard from "../../../components/common/CustomStatCard";

interface Props {
  stats?: EventOrderStats;
}

const CARDS = [
  {
    key: "totalEvents" as const,
    label: "Total Events",
    icon: HiOutlineCalendar,
    color: "#2563eb",
    bg: "#eff6ff",
    money: false,
  },
  {
    key: "upcomingEvents" as const,
    label: "Upcoming",
    icon: HiOutlineClock,
    color: "#0891b2",
    bg: "#ecfeff",
    money: false,
  },
  {
    key: "totalRevenue" as const,
    label: "Total Revenue",
    icon: HiOutlineCurrencyRupee,
    color: "#059669",
    bg: "#ecfdf5",
    money: true,
  },
  {
    key: "pendingDues" as const,
    label: "Pending Dues",
    icon: HiOutlineExclamationCircle,
    color: "#dc2626",
    bg: "#fff7ed",
    money: true,
    alert: true,
    tooltip: "Total outstanding dues across all events",
  },
] as const;

const SkeletonStatCard = () => (
  <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm animate-pulse">
    <div className="flex items-center gap-3 mb-3">
      <div className="w-10 h-10 rounded-xl bg-slate-200" />
      <div className="h-3 w-24 bg-slate-200 rounded" />
    </div>
    <div className="h-7 w-20 bg-slate-200 rounded mt-2" />
  </div>
);

const EventStatCards = ({ stats }: Props) => {
  if (!stats) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {CARDS.map((c) => (
          <SkeletonStatCard key={c.key} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {CARDS.map((c) => {
        const Icon = c.icon;

        const raw: number = stats[c.key] ?? 0;
        const value = c.money ? formatINR(raw) : raw;

        return (
          <CustomStatCard
            key={c.key}
            icon={<Icon className="w-5 h-5" />}
            label={c.label}
            value={value}
            color={c.color}
            bg={c.bg}
            alert={"alert" in c ? c.alert : false}
            tooltip={"tooltip" in c ? c.tooltip : undefined}
          />
        );
      })}
    </div>
  );
};

export default EventStatCards;
