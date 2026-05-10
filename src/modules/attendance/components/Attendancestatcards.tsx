// src/modules/attendance/components/AttendanceStatCards.tsx

import {
  HiOutlineCheckCircle,
  HiOutlineXCircle,
  HiOutlineClock,
  HiOutlineCalendar,
  HiOutlineTrendingUp,
} from "react-icons/hi";

const AttendanceStatCards = () => {
  // Mock data — replace with real API
  const total = 24;
  const present = 19;
  const absent = 2;
  const late = 1;
  const onLeave = 2;

  const cards = [
    {
      label: "PRESENT TODAY",
      value: present,
      total,
      icon: <HiOutlineCheckCircle className="w-6 h-6" />,
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600",
      ring: "ring-emerald-100",
      delta: `${Math.round((present / total) * 100)}% attendance`,
      deltaColor: "text-emerald-600",
      hover: "hover:border-emerald-200 hover:shadow-emerald-100/50",
      progressColor: "bg-emerald-500",
      progressTrack: "bg-emerald-100",
    },
    {
      label: "ABSENT",
      value: absent,
      total,
      icon: <HiOutlineXCircle className="w-6 h-6" />,
      iconBg: "bg-red-50",
      iconColor: "text-red-600",
      ring: "ring-red-100",
      delta: absent > 0 ? "Needs follow-up" : "Full attendance",
      deltaColor: absent > 0 ? "text-red-600" : "text-emerald-600",
      hover: "hover:border-red-200 hover:shadow-red-100/50",
      progressColor: "bg-red-500",
      progressTrack: "bg-red-100",
    },
    {
      label: "LATE ARRIVALS",
      value: late,
      total,
      icon: <HiOutlineClock className="w-6 h-6" />,
      iconBg: "bg-amber-50",
      iconColor: "text-amber-600",
      ring: "ring-amber-100",
      delta: late > 0 ? "Avg 25 min late" : "All on time",
      deltaColor: late > 0 ? "text-amber-600" : "text-emerald-600",
      hover: "hover:border-amber-200 hover:shadow-amber-100/50",
      progressColor: "bg-amber-500",
      progressTrack: "bg-amber-100",
    },
    {
      label: "ON LEAVE",
      value: onLeave,
      total,
      icon: <HiOutlineCalendar className="w-6 h-6" />,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
      ring: "ring-blue-100",
      delta: "2 approved leaves",
      deltaColor: "text-blue-600",
      hover: "hover:border-blue-200 hover:shadow-blue-100/50",
      progressColor: "bg-blue-500",
      progressTrack: "bg-blue-100",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {cards.map((c) => {
        const percent = c.total > 0 ? (c.value / c.total) * 100 : 0;
        return (
          <div
            key={c.label}
            className={`group relative bg-white rounded-2xl border border-slate-200 p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${c.hover}`}
          >
            <div className="flex items-start justify-between">
              <div
                className={`p-3 rounded-xl ${c.iconBg} ${c.iconColor} ring-1 ${c.ring} group-hover:scale-110 transition-transform`}
              >
                {c.icon}
              </div>
              <HiOutlineTrendingUp className="w-4 h-4 text-slate-300 group-hover:text-slate-400" />
            </div>

            <div className="mt-4">
              <div className="flex items-baseline gap-1.5">
                <div className="text-3xl font-bold text-slate-900 tracking-tight">
                  {c.value}
                </div>
                <div className="text-sm text-slate-400 font-medium">
                  / {c.total}
                </div>
              </div>
              <div className="text-xs font-semibold text-slate-500 mt-1 tracking-wider">
                {c.label}
              </div>

              {/* Progress bar */}
              <div
                className={`mt-3 h-1.5 rounded-full ${c.progressTrack} overflow-hidden`}
              >
                <div
                  className={`h-full rounded-full ${c.progressColor} transition-all duration-700`}
                  style={{ width: `${percent}%` }}
                />
              </div>

              <div className={`text-xs mt-2 font-medium ${c.deltaColor}`}>
                {c.delta}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AttendanceStatCards;
