import { useState } from "react";
import {
  HiOutlineClock,
  HiOutlinePhone,
  HiOutlineExclamation,
  HiOutlineRefresh,
  HiOutlineUserGroup,
  HiOutlineLogin,
  HiOutlineLogout,
  HiOutlineCalendar,
} from "react-icons/hi";
import { STATUS_META, SHIFT_CONFIG } from "../constants/Attendance.constants";

interface EmployeeAttendance {
  id: string;
  employeeId: string;
  name: string;
  designation: string;
  department: string;
  status: "present" | "absent" | "late" | "leave";
  checkIn?: string;
  checkOut?: string;
  lateBy?: number;
  phone: string;
}

const SAMPLE_TODAY: EmployeeAttendance[] = [
  {
    id: "1",
    employeeId: "EMP-001",
    name: "Suresh Murugan",
    designation: "Senior Driver",
    department: "Delivery",
    status: "present",
    checkIn: "08:55",
    phone: "9876543210",
  },
  {
    id: "2",
    employeeId: "EMP-002",
    name: "Karthik Raja",
    designation: "Driver",
    department: "Delivery",
    status: "late",
    checkIn: "09:25",
    lateBy: 25,
    phone: "9876543211",
  },
  {
    id: "3",
    employeeId: "EMP-003",
    name: "Vijay Prakash",
    designation: "Driver",
    department: "Delivery",
    status: "leave",
    phone: "9876543212",
  },
  {
    id: "4",
    employeeId: "EMP-004",
    name: "Arun Selvam",
    designation: "Loader",
    department: "Delivery",
    status: "present",
    checkIn: "09:02",
    phone: "9876543213",
  },
  {
    id: "5",
    employeeId: "EMP-005",
    name: "Rajesh Kumar",
    designation: "Plant Operator",
    department: "Plant",
    status: "present",
    checkIn: "08:50",
    phone: "9876543214",
  },
  {
    id: "6",
    employeeId: "EMP-006",
    name: "Divya Bharathi",
    designation: "Accountant",
    department: "Admin",
    status: "absent",
    phone: "9876543215",
  },
  {
    id: "7",
    employeeId: "EMP-007",
    name: "Anand S.",
    designation: "Plant Operator",
    department: "Plant",
    status: "present",
    checkIn: "08:58",
    phone: "9876543216",
  },
];

const TodayPanel = () => {
  const [filter, setFilter] = useState<string>("all");

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const currentTime = new Date().toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  const filtered = SAMPLE_TODAY.filter((e) =>
    filter === "all" ? true : e.status === filter
  );

  const stats = {
    total: SAMPLE_TODAY.length,
    present: SAMPLE_TODAY.filter(
      (e) => e.status === "present" || e.status === "late"
    ).length,
    absent: SAMPLE_TODAY.filter((e) => e.status === "absent").length,
    late: SAMPLE_TODAY.filter((e) => e.status === "late").length,
    leave: SAMPLE_TODAY.filter((e) => e.status === "leave").length,
    workingNow: SAMPLE_TODAY.filter(
      (e) => (e.status === "present" || e.status === "late") && !e.checkOut
    ).length,
  };

  return (
    <div className="space-y-4">
      {/* ============ Clean Today Header (no heavy gradient) ============ */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-100">
                <HiOutlineCalendar className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">
                    Live Attendance
                  </span>
                  <span className="flex items-center gap-1 text-[10px] text-slate-500">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Updated just now
                  </span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mt-0.5">
                  {today}
                </h3>
                <div className="text-sm text-slate-500 mt-0.5 flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <HiOutlineClock className="w-3.5 h-3.5" />
                    Current time:{" "}
                    <strong className="text-slate-700">{currentTime}</strong>
                  </span>
                </div>
              </div>
            </div>

            <button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold transition-all">
              <HiOutlineRefresh className="w-4 h-4" />
              Refresh
            </button>
          </div>

          {/* ============ Single Shift Info Strip ============ */}
          <div className="mt-5 grid grid-cols-2 md:grid-cols-4 gap-3">
            {/* Shift timing */}
            <div className="bg-slate-50/60 rounded-xl border border-slate-200 p-3">
              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1.5">
                <HiOutlineClock className="w-3.5 h-3.5" />
                Shift Timing
              </div>
              <div className="text-sm font-bold text-slate-900">
                {SHIFT_CONFIG.checkIn} – {SHIFT_CONFIG.checkOut}
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                {SHIFT_CONFIG.workingHours} hours · {SHIFT_CONFIG.label}
              </div>
            </div>

            {/* Workforce */}
            <div className="bg-slate-50/60 rounded-xl border border-slate-200 p-3">
              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1.5">
                <HiOutlineUserGroup className="w-3.5 h-3.5" />
                Workforce
              </div>
              <div className="text-sm font-bold text-slate-900">
                {stats.present}{" "}
                <span className="text-slate-400 font-medium">
                  / {stats.total}
                </span>
              </div>
              <div className="text-[11px] text-emerald-600 font-medium mt-0.5">
                {Math.round((stats.present / stats.total) * 100)}% checked in
              </div>
            </div>

            {/* Working now */}
            <div className="bg-emerald-50/60 rounded-xl border border-emerald-200 p-3">
              <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-semibold uppercase tracking-wider mb-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Working Now
              </div>
              <div className="text-sm font-bold text-emerald-800">
                {stats.workingNow}{" "}
                <span className="text-emerald-500 font-medium text-xs">
                  active
                </span>
              </div>
              <div className="text-[11px] text-emerald-600 mt-0.5">
                Currently on duty
              </div>
            </div>

            {/* Grace period */}
            <div className="bg-amber-50/60 rounded-xl border border-amber-200 p-3">
              <div className="flex items-center gap-1.5 text-xs text-amber-700 font-semibold uppercase tracking-wider mb-1.5">
                <HiOutlineExclamation className="w-3.5 h-3.5" />
                Grace Period
              </div>
              <div className="text-sm font-bold text-amber-800">
                {SHIFT_CONFIG.graceMinutes} min
              </div>
              <div className="text-[11px] text-amber-600 mt-0.5">
                After 09:{SHIFT_CONFIG.graceMinutes} = Late
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ============ Filter chips by status ============ */}
      <div className="bg-white rounded-2xl border border-slate-200 p-3 shadow-sm">
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {[
            {
              key: "all",
              label: "All",
              count: stats.total,
              activeBg: "bg-slate-700 text-white",
            },
            {
              key: "present",
              label: "Present",
              count: SAMPLE_TODAY.filter((e) => e.status === "present").length,
              activeBg: "bg-emerald-600 text-white",
            },
            {
              key: "late",
              label: "Late",
              count: stats.late,
              activeBg: "bg-orange-500 text-white",
            },
            {
              key: "absent",
              label: "Absent",
              count: stats.absent,
              activeBg: "bg-red-600 text-white",
            },
            {
              key: "leave",
              label: "On Leave",
              count: stats.leave,
              activeBg: "bg-blue-600 text-white",
            },
          ].map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                filter === f.key
                  ? f.activeBg + " shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {f.label}
              <span
                className={`px-1.5 py-0.5 rounded text-[10px] ${
                  filter === f.key
                    ? "bg-white/25 text-white"
                    : "bg-white text-slate-700"
                }`}
              >
                {f.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* ============ Employee cards ============ */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
        {filtered.map((e) => {
          const status = STATUS_META[e.status];
          const isPresent = e.status === "present" || e.status === "late";
          const isLate = e.status === "late";

          return (
            <div
              key={e.id}
              className={`group bg-white rounded-2xl border overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all ${
                e.status === "absent"
                  ? "border-red-100"
                  : e.status === "late"
                  ? "border-orange-100"
                  : e.status === "leave"
                  ? "border-blue-100"
                  : "border-slate-200"
              }`}
            >
              <div className="p-4">
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative shrink-0">
                      <div
                        className={`w-11 h-11 rounded-xl text-white font-bold flex items-center justify-center shadow-sm ${
                          e.status === "absent"
                            ? "bg-gradient-to-br from-red-400 to-red-600"
                            : e.status === "late"
                            ? "bg-gradient-to-br from-orange-400 to-orange-600"
                            : e.status === "leave"
                            ? "bg-gradient-to-br from-blue-400 to-blue-600"
                            : "bg-gradient-to-br from-emerald-400 to-emerald-600"
                        }`}
                      >
                        {e.name.charAt(0)}
                      </div>
                      <span
                        className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white ${status.dot}`}
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="font-semibold text-slate-900 truncate">
                        {e.name}
                      </div>
                      <div className="text-xs text-slate-500 truncate flex items-center gap-1.5">
                        <span className="font-mono">{e.employeeId}</span>
                        <span>•</span>
                        <span>{e.designation}</span>
                      </div>
                    </div>
                  </div>
                  <span
                    className={`shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px] font-bold ${status.bg} ${status.color}`}
                  >
                    <span className={`w-1 h-1 rounded-full ${status.dot}`} />
                    {status.label}
                  </span>
                </div>

                {/* Body — Check In / Check Out */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-slate-50 rounded-lg p-2.5 border border-slate-100">
                    <div className="text-[10px] text-slate-500 font-semibold uppercase flex items-center gap-1">
                      <HiOutlineLogin className="w-3 h-3" />
                      Check In
                    </div>
                    <div
                      className={`text-base font-bold mt-1 ${
                        isLate
                          ? "text-orange-600"
                          : e.checkIn
                          ? "text-emerald-700"
                          : "text-slate-300"
                      }`}
                    >
                      {e.checkIn || "—"}
                    </div>
                    {isLate && e.lateBy && (
                      <div className="text-[10px] text-orange-600 font-medium mt-0.5 flex items-center gap-0.5">
                        <HiOutlineExclamation className="w-3 h-3" />
                        {e.lateBy} min late
                      </div>
                    )}
                  </div>

                  <div className="bg-slate-50 rounded-lg p-2.5 border border-slate-100">
                    <div className="text-[10px] text-slate-500 font-semibold uppercase flex items-center gap-1">
                      <HiOutlineLogout className="w-3 h-3" />
                      Check Out
                    </div>
                    <div
                      className={`text-base font-bold mt-1 ${
                        e.checkOut ? "text-slate-700" : "text-slate-300"
                      }`}
                    >
                      {e.checkOut || "—"}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      Expected {SHIFT_CONFIG.checkOut}
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-dashed border-slate-200">
                  <a
                    href={`tel:${e.phone}`}
                    className="flex items-center gap-1 text-xs text-slate-500 hover:text-emerald-600 transition-colors"
                  >
                    <HiOutlinePhone className="w-3 h-3" />
                    {e.phone}
                  </a>
                  {e.status === "absent" && (
                    <button className="text-[10px] font-bold text-red-600 hover:text-red-700">
                      Mark Reason →
                    </button>
                  )}
                  {isPresent && !e.checkOut && (
                    <span className="text-[10px] font-semibold text-emerald-600 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Working now
                    </span>
                  )}
                  {e.status === "leave" && (
                    <span className="text-[10px] font-semibold text-blue-600">
                      Approved leave
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <div className="inline-flex p-4 rounded-2xl bg-slate-50 mb-3">
            <HiOutlineExclamation className="w-7 h-7 text-slate-400" />
          </div>
          <h3 className="text-base font-semibold text-slate-700">
            No employees in this filter
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Try selecting a different status.
          </p>
        </div>
      )}
    </div>
  );
};

export default TodayPanel;
