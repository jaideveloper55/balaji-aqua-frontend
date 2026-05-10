import { useState } from "react";
import { Select } from "antd";
import { HiOutlineChevronLeft, HiOutlineChevronRight } from "react-icons/hi";
import dayjs from "dayjs";
import { STATUS_META } from "../constants/Attendance.constants";

interface EmployeeCalendar {
  id: string;
  employeeId: string;
  name: string;
  designation: string;

  days: Record<number, keyof typeof STATUS_META>;
}

const generateMonthData = (): EmployeeCalendar[] => {
  const employees = [
    {
      id: "1",
      employeeId: "EMP-001",
      name: "Suresh Murugan",
      designation: "Senior Driver",
    },
    {
      id: "2",
      employeeId: "EMP-002",
      name: "Karthik Raja",
      designation: "Driver",
    },
    {
      id: "3",
      employeeId: "EMP-003",
      name: "Vijay Prakash",
      designation: "Driver",
    },
    {
      id: "4",
      employeeId: "EMP-004",
      name: "Arun Selvam",
      designation: "Loader",
    },
    {
      id: "5",
      employeeId: "EMP-005",
      name: "Rajesh Kumar",
      designation: "Plant Operator",
    },
    {
      id: "6",
      employeeId: "EMP-006",
      name: "Divya Bharathi",
      designation: "Accountant",
    },
  ];

  return employees.map((e, idx) => {
    const days: Record<number, keyof typeof STATUS_META> = {};
    for (let d = 1; d <= 31; d++) {
      // Sundays are weekoff
      const dayOfWeek = (d + 2) % 7;
      if (dayOfWeek === 0) {
        days[d] = "weekoff";
      } else if (d === 14) {
        days[d] = "holiday";
      } else if (d > 28) {
        // future days
        continue;
      } else {
        // Random-ish but deterministic per employee
        const seed = (idx * 31 + d) % 20;
        if (seed === 0) days[d] = "absent";
        else if (seed === 1) days[d] = "leave";
        else if (seed === 2) days[d] = "half_day";
        else if (seed === 3) days[d] = "late";
        else days[d] = "present";
      }
    }
    return { ...e, days };
  });
};

const CalendarPanel = () => {
  const [currentMonth, setCurrentMonth] = useState(dayjs());
  const [department, setDepartment] = useState<string | null>(null);

  const data = generateMonthData();
  const daysInMonth = currentMonth.daysInMonth();
  const today = dayjs().date();
  const isCurrentMonth =
    currentMonth.format("YYYY-MM") === dayjs().format("YYYY-MM");

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  // Stats

  let present = 0,
    absent = 0,
    leave = 0,
    halfDay = 0;
  data.forEach((e) => {
    Object.values(e.days).forEach((s) => {
      if (s === "present" || s === "late") present++;
      else if (s === "absent") absent++;
      else if (s === "leave") leave++;
      else if (s === "half_day") halfDay++;
    });
  });

  return (
    <div className="space-y-4">
      {/* Header controls */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentMonth(currentMonth.subtract(1, "month"))}
              className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
            >
              <HiOutlineChevronLeft className="w-4 h-4 text-slate-600" />
            </button>
            <div className="px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-50 to-blue-50 border border-cyan-100 min-w-[200px] text-center">
              <div className="text-xs text-cyan-700 font-semibold uppercase tracking-wider">
                Viewing
              </div>
              <div className="font-bold text-slate-900">
                {currentMonth.format("MMMM YYYY")}
              </div>
            </div>
            <button
              onClick={() => setCurrentMonth(currentMonth.add(1, "month"))}
              className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
            >
              <HiOutlineChevronRight className="w-4 h-4 text-slate-600" />
            </button>
            {!isCurrentMonth && (
              <button
                onClick={() => setCurrentMonth(dayjs())}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-cyan-600 hover:bg-cyan-50 transition-colors"
              >
                Jump to Today
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Select
              size="large"
              placeholder="All Departments"
              className="!w-44"
              allowClear
              value={department}
              onChange={(v) => setDepartment(v ?? null)}
              options={[
                { value: "delivery", label: "Delivery" },
                { value: "plant", label: "Plant" },
                { value: "admin", label: "Admin" },
                { value: "sales", label: "Sales" },
              ]}
            />
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 mt-4 pt-4 border-t border-dashed border-slate-200 flex-wrap">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Legend:
          </span>
          {Object.entries(STATUS_META).map(([key, meta]) => (
            <div key={key} className="flex items-center gap-1.5">
              <div
                className={`w-5 h-5 rounded ${meta.cell} border flex items-center justify-center text-[10px] font-bold`}
              >
                {meta.short}
              </div>
              <span className="text-xs text-slate-600">{meta.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Month summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          {
            label: "Total Present Days",
            value: present,
            color: "text-emerald-700",
            bg: "from-emerald-50 to-emerald-100/50",
            border: "border-emerald-200",
          },
          {
            label: "Total Absent Days",
            value: absent,
            color: "text-red-700",
            bg: "from-red-50 to-red-100/50",
            border: "border-red-200",
          },
          {
            label: "Leaves Taken",
            value: leave,
            color: "text-blue-700",
            bg: "from-blue-50 to-blue-100/50",
            border: "border-blue-200",
          },
          {
            label: "Half Days",
            value: halfDay,
            color: "text-amber-700",
            bg: "from-amber-50 to-amber-100/50",
            border: "border-amber-200",
          },
        ].map((s) => (
          <div
            key={s.label}
            className={`bg-gradient-to-br ${s.bg} border ${s.border} rounded-xl p-4`}
          >
            <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
            <div className="text-xs font-semibold text-slate-600 mt-1">
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200 sticky top-0">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-bold text-slate-700 uppercase tracking-wider sticky left-0 bg-slate-50 min-w-[200px] border-r border-slate-200 z-10">
                  Employee
                </th>
                {days.map((d) => {
                  const dayDate = currentMonth.date(d);
                  const isWeekend = dayDate.day() === 0;
                  const isToday = isCurrentMonth && d === today;
                  return (
                    <th
                      key={d}
                      className={`px-1 py-2 text-xs font-bold text-center min-w-[36px] ${
                        isToday
                          ? "bg-cyan-100 text-cyan-700"
                          : isWeekend
                          ? "bg-slate-100 text-slate-400"
                          : "text-slate-600"
                      }`}
                    >
                      <div>{d}</div>
                      <div className="text-[9px] font-medium opacity-70">
                        {dayDate.format("dd")[0]}
                      </div>
                    </th>
                  );
                })}
                <th className="px-3 py-3 text-xs font-bold text-slate-700 uppercase text-center sticky right-0 bg-slate-50 border-l border-slate-200">
                  P / Total
                </th>
              </tr>
            </thead>
            <tbody>
              {data.map((emp) => {
                const presentCount = Object.values(emp.days).filter(
                  (s) => s === "present" || s === "late"
                ).length;
                const totalWorkingDays = Object.values(emp.days).filter(
                  (s) => s !== "weekoff" && s !== "holiday"
                ).length;
                const percent =
                  totalWorkingDays > 0
                    ? (presentCount / totalWorkingDays) * 100
                    : 0;

                return (
                  <tr
                    key={emp.id}
                    className="border-b border-slate-100 last:border-0 hover:bg-slate-50/40 transition-colors"
                  >
                    <td className="px-4 py-2 sticky left-0 bg-white border-r border-slate-200 z-10 group-hover:bg-slate-50/40">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-slate-400 to-slate-600 text-white text-xs font-bold flex items-center justify-center shrink-0">
                          {emp.name.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <div className="text-sm font-semibold text-slate-900 truncate">
                            {emp.name}
                          </div>
                          <div className="text-[10px] text-slate-500 truncate">
                            {emp.employeeId}
                          </div>
                        </div>
                      </div>
                    </td>

                    {days.map((d) => {
                      const status = emp.days[d];
                      const meta = status ? STATUS_META[status] : null;
                      const isToday = isCurrentMonth && d === today;
                      return (
                        <td key={d} className="px-1 py-1 text-center">
                          {meta ? (
                            <div
                              className={`mx-auto w-7 h-7 rounded ${
                                meta.cell
                              } border flex items-center justify-center text-[10px] font-bold transition-transform hover:scale-125 cursor-pointer ${
                                isToday ? "ring-2 ring-cyan-400" : ""
                              }`}
                              title={`${currentMonth
                                .date(d)
                                .format("DD MMM")}: ${meta.label}`}
                            >
                              {meta.short}
                            </div>
                          ) : (
                            <div className="w-7 h-7 mx-auto" />
                          )}
                        </td>
                      );
                    })}

                    <td className="px-3 py-2 text-center sticky right-0 bg-white border-l border-slate-200">
                      <div className="text-sm font-bold text-slate-900">
                        {presentCount}/{totalWorkingDays}
                      </div>
                      <div
                        className={`text-[10px] font-semibold ${
                          percent >= 90
                            ? "text-emerald-600"
                            : percent >= 75
                            ? "text-amber-600"
                            : "text-red-600"
                        }`}
                      >
                        {percent.toFixed(0)}%
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CalendarPanel;
