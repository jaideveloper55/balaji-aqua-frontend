import {
  HiOutlineCalendar,
  HiOutlineClock,
  HiOutlineCurrencyRupee,
  HiOutlineExclamationCircle,
} from "react-icons/hi";
import { formatINR } from "../constants/Events.constants";
import type { EventStats } from "../types/Events";
import CustomStatCard from "../../../components/common/CustomStatCard";

interface Props {
  stats: EventStats;
}

const cards = [
  {
    key: "totalEvents",
    label: "Total Events",
    icon: HiOutlineCalendar,
    color: "#2563eb",
    bg: "#eff6ff",
  },
  {
    key: "upcomingEvents",
    label: "Upcoming",
    icon: HiOutlineClock,
    color: "#0891b2",
    bg: "#ecfeff",
  },
  {
    key: "totalRevenue",
    label: "Total Revenue",
    icon: HiOutlineCurrencyRupee,
    color: "#059669",
    bg: "#ecfdf5",
    money: true,
  },
  {
    key: "pendingDues",
    label: "Pending Dues",
    icon: HiOutlineExclamationCircle,
    color: "#dc2626",
    bg: "#fff7ed",
    money: true,
    alert: true,
    tooltip: "Total outstanding dues across all events",
  },
] as const;

const EventStatCards = ({ stats }: Props) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((c) => {
        const raw = stats[c.key as keyof EventStats];
        const Icon = c.icon;
        const value = "money" in c && c.money ? formatINR(raw as number) : raw;

        return (
          <CustomStatCard
            key={c.key}
            icon={<Icon className="w-5 h-5" />}
            label={c.label}
            value={value as string | number}
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
