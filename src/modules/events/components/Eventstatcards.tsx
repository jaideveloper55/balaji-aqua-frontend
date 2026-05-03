import {
  HiOutlineCalendar,
  HiOutlineClock,
  HiOutlineCurrencyRupee,
  HiOutlineExclamationCircle,
} from "react-icons/hi";
import { formatINR } from "../constants/Events.constants";
import type { EventStats } from "../types/Events";

interface Props {
  stats: EventStats;
}

const cards = [
  {
    key: "totalEvents",
    label: "TOTAL EVENTS",
    icon: HiOutlineCalendar,
    iconBg: "bg-blue-50",
    iconColor: "text-blue-600",
    accent: "border-slate-200",
  },
  {
    key: "upcomingEvents",
    label: "UPCOMING",
    icon: HiOutlineClock,
    iconBg: "bg-cyan-50",
    iconColor: "text-cyan-600",
    accent: "border-slate-200",
  },
  {
    key: "totalRevenue",
    label: "TOTAL REVENUE",
    icon: HiOutlineCurrencyRupee,
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-600",
    accent: "border-emerald-200",
    money: true,
  },
  {
    key: "pendingDues",
    label: "PENDING DUES",
    icon: HiOutlineExclamationCircle,
    iconBg: "bg-amber-50",
    iconColor: "text-amber-600",
    accent: "border-amber-200",
    money: true,
    danger: true,
  },
] as const;

const EventStatCards = ({ stats }: Props) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((c) => {
        const value = stats[c.key as keyof EventStats];
        const Icon = c.icon;
        return (
          <div
            key={c.key}
            className={`bg-white rounded-2xl border ${c.accent} px-5 py-4 flex items-center gap-4 transition hover:shadow-md hover:-translate-y-0.5 duration-200`}
          >
            <div
              className={`w-12 h-12 rounded-xl ${c.iconBg} ${c.iconColor} flex items-center justify-center shrink-0`}
            >
              <Icon className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <div
                className={`text-2xl font-bold tracking-tight ${
                  "danger" in c && c.danger ? "text-red-600" : "text-slate-900"
                }`}
              >
                {"money" in c && c.money ? formatINR(value as number) : value}
              </div>
              <div className="text-[11px] font-semibold text-slate-500 tracking-wider mt-0.5">
                {c.label}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default EventStatCards;
