import { useState } from "react";
import { Input, DatePicker } from "antd";
import {
  HiOutlineClock,
  HiOutlineCalendar,
  HiOutlineCheck,
  HiOutlineSearch,
  HiOutlineSave,
  HiOutlineLightningBolt,
} from "react-icons/hi";
import dayjs from "dayjs";

type QuickStatus = "present" | "absent" | "half_day" | "leave";

interface EmployeeRow {
  id: string;
  employeeId: string;
  name: string;
  designation: string;
  department: string;
  status: QuickStatus | null;
  checkIn?: string;
  checkOut?: string;
}

const SAMPLE: EmployeeRow[] = [
  {
    id: "1",
    employeeId: "EMP-001",
    name: "Suresh Murugan",
    designation: "Senior Driver",
    department: "Delivery",
    status: "present",
    checkIn: "06:00",
  },
  {
    id: "2",
    employeeId: "EMP-002",
    name: "Karthik Raja",
    designation: "Driver",
    department: "Delivery",
    status: "present",
    checkIn: "06:25",
  },
  {
    id: "3",
    employeeId: "EMP-003",
    name: "Vijay Prakash",
    designation: "Driver",
    department: "Delivery",
    status: "leave",
  },
  {
    id: "4",
    employeeId: "EMP-004",
    name: "Arun Selvam",
    designation: "Loader",
    department: "Delivery",
    status: null,
  },
  {
    id: "5",
    employeeId: "EMP-005",
    name: "Rajesh Kumar",
    designation: "Plant Operator",
    department: "Plant",
    status: "present",
    checkIn: "05:50",
  },
  {
    id: "6",
    employeeId: "EMP-006",
    name: "Divya Bharathi",
    designation: "Accountant",
    department: "Admin",
    status: null,
  },
  {
    id: "7",
    employeeId: "EMP-007",
    name: "Anand S.",
    designation: "Plant Operator",
    department: "Plant",
    status: null,
  },
];

const QUICK_STATUSES: {
  value: QuickStatus;
  label: string;
  short: string;
  bg: string;
  border: string;
  text: string;
  hoverBg: string;
  activeBg: string;
}[] = [
  {
    value: "present",
    label: "Present",
    short: "P",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    text: "text-emerald-700",
    hoverBg: "hover:bg-emerald-100",
    activeBg: "bg-emerald-600 border-emerald-600 text-white",
  },
  {
    value: "absent",
    label: "Absent",
    short: "A",
    bg: "bg-red-50",
    border: "border-red-200",
    text: "text-red-700",
    hoverBg: "hover:bg-red-100",
    activeBg: "bg-red-600 border-red-600 text-white",
  },
  {
    value: "half_day",
    label: "Half Day",
    short: "HD",
    bg: "bg-amber-50",
    border: "border-amber-200",
    text: "text-amber-700",
    hoverBg: "hover:bg-amber-100",
    activeBg: "bg-amber-600 border-amber-600 text-white",
  },
  {
    value: "leave",
    label: "On Leave",
    short: "L",
    bg: "bg-blue-50",
    border: "border-blue-200",
    text: "text-blue-700",
    hoverBg: "hover:bg-blue-100",
    activeBg: "bg-blue-600 border-blue-600 text-white",
  },
];

const MarkAttendancePanel = () => {
  const [date, setDate] = useState(dayjs());
  const [search, setSearch] = useState("");
  const [rows, setRows] = useState<EmployeeRow[]>(SAMPLE);
  const [unsavedCount, setUnsavedCount] = useState(0);

  const updateStatus = (id: string, status: QuickStatus) => {
    setRows((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              status,
              checkIn: status === "present" ? r.checkIn || "06:00" : r.checkIn,
            }
          : r
      )
    );
    setUnsavedCount((c) => c + 1);
  };

  const markAllPresent = () => {
    setRows((prev) => prev.map((r) => ({ ...r, status: "present" as const })));
    setUnsavedCount(rows.length);
  };

  const filtered = rows.filter((r) =>
    search
      ? r.name.toLowerCase().includes(search.toLowerCase()) ||
        r.employeeId.toLowerCase().includes(search.toLowerCase())
      : true
  );

  const stats = {
    total: rows.length,
    marked: rows.filter((r) => r.status !== null).length,
    present: rows.filter((r) => r.status === "present").length,
    absent: rows.filter((r) => r.status === "absent").length,
    halfDay: rows.filter((r) => r.status === "half_day").length,
    leave: rows.filter((r) => r.status === "leave").length,
    pending: rows.filter((r) => r.status === null).length,
  };

  return (
    <div className="space-y-4">
      {/* Top bar with date + bulk action */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center gap-3 flex-1">
            <div className="p-2.5 rounded-xl bg-cyan-50 border border-cyan-100">
              <HiOutlineCalendar className="w-5 h-5 text-cyan-600" />
            </div>
            <div className="flex-1">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Marking attendance for
              </div>
              <DatePicker
                size="large"
                value={date}
                onChange={(d) => d && setDate(d)}
                format="dddd, DD MMMM YYYY"
                className="!border-0 !p-0 !shadow-none [&_input]:!font-bold [&_input]:!text-slate-900 [&_input]:!text-base [&_input]:!p-0"
                allowClear={false}
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={markAllPresent}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold hover:bg-emerald-100 transition-colors"
            >
              <HiOutlineLightningBolt className="w-3.5 h-3.5" />
              Mark All Present
            </button>
            <button
              disabled={unsavedCount === 0}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                unsavedCount > 0
                  ? "bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md hover:shadow-lg"
                  : "bg-slate-100 text-slate-400 cursor-not-allowed"
              }`}
            >
              <HiOutlineSave className="w-3.5 h-3.5" />
              Save{" "}
              {unsavedCount > 0 && (
                <span className="px-1.5 py-0.5 bg-white/25 rounded text-[10px]">
                  {unsavedCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mini stats row */}
        <div className="grid grid-cols-3 md:grid-cols-6 gap-2 mt-4 pt-4 border-t border-dashed border-slate-200">
          {[
            {
              label: "Total",
              value: stats.total,
              color: "text-slate-700",
              bg: "bg-slate-50",
            },
            {
              label: "Marked",
              value: stats.marked,
              color: "text-cyan-700",
              bg: "bg-cyan-50",
            },
            {
              label: "Present",
              value: stats.present,
              color: "text-emerald-700",
              bg: "bg-emerald-50",
            },
            {
              label: "Absent",
              value: stats.absent,
              color: "text-red-700",
              bg: "bg-red-50",
            },
            {
              label: "Leave",
              value: stats.leave,
              color: "text-blue-700",
              bg: "bg-blue-50",
            },
            {
              label: "Pending",
              value: stats.pending,
              color: "text-amber-700",
              bg: "bg-amber-50",
            },
          ].map((s) => (
            <div
              key={s.label}
              className={`${s.bg} rounded-lg px-3 py-2 text-center`}
            >
              <div className={`text-lg font-bold ${s.color}`}>{s.value}</div>
              <div className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Search */}
      <Input
        size="large"
        placeholder="Search employee by name or ID..."
        prefix={<HiOutlineSearch className="text-slate-400" />}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        allowClear
        className="!rounded-xl"
      />

      {/* Mark rows */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        {filtered.map((row, i) => (
          <div
            key={row.id}
            className={`px-4 py-3 flex items-center gap-3 transition-colors ${
              i !== filtered.length - 1 ? "border-b border-slate-100" : ""
            } ${
              row.status === null ? "bg-amber-50/30" : "hover:bg-slate-50/50"
            }`}
          >
            {/* Avatar */}
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-400 to-slate-600 text-white font-bold flex items-center justify-center shrink-0">
              {row.name.charAt(0)}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <div className="font-semibold text-slate-900 truncate">
                  {row.name}
                </div>
                {row.status === null && (
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-100 text-amber-700 border border-amber-200 uppercase">
                    Pending
                  </span>
                )}
              </div>
              <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                <span className="font-mono">{row.employeeId}</span>
                <span>•</span>
                <span>{row.designation}</span>
                {row.checkIn && row.status === "present" && (
                  <>
                    <span>•</span>
                    <span className="flex items-center gap-1 text-emerald-600">
                      <HiOutlineClock className="w-3 h-3" />
                      {row.checkIn}
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Status pills */}
            <div className="flex items-center gap-1 shrink-0">
              {QUICK_STATUSES.map((s) => {
                const isActive = row.status === s.value;
                return (
                  <button
                    key={s.value}
                    onClick={() => updateStatus(row.id, s.value)}
                    className={`group/btn relative px-2.5 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                      isActive
                        ? s.activeBg + " shadow-md"
                        : `${s.bg} ${s.border} ${s.text} ${s.hoverBg}`
                    }`}
                    title={s.label}
                  >
                    <span className="hidden md:inline">{s.short}</span>
                    <span className="md:hidden text-[10px]">{s.label[0]}</span>
                    {isActive && (
                      <HiOutlineCheck className="w-3 h-3 absolute -top-1 -right-1 bg-white text-emerald-600 rounded-full p-0.5" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="p-8 text-center text-sm text-slate-500">
            No employees match "{search}"
          </div>
        )}
      </div>
    </div>
  );
};

export default MarkAttendancePanel;
