// src/modules/attendance/constants/Attendance.constants.ts

export const ATTENDANCE_STATUS = [
  { value: "present", label: "Present" },
  { value: "absent", label: "Absent" },
  { value: "half_day", label: "Half Day" },
  { value: "leave", label: "On Leave" },
  { value: "holiday", label: "Holiday" },
  { value: "weekoff", label: "Week Off" },
  { value: "late", label: "Late" },
] as const;

export const STATUS_META: Record<
  string,
  {
    label: string;
    short: string;
    bg: string;
    color: string;
    dot: string;
    cell: string;
  }
> = {
  present: {
    label: "Present",
    short: "P",
    bg: "bg-emerald-50 border-emerald-200",
    color: "text-emerald-700",
    dot: "bg-emerald-500",
    cell: "bg-emerald-100 text-emerald-700 border-emerald-200",
  },
  absent: {
    label: "Absent",
    short: "A",
    bg: "bg-red-50 border-red-200",
    color: "text-red-700",
    dot: "bg-red-500",
    cell: "bg-red-100 text-red-700 border-red-200",
  },
  half_day: {
    label: "Half Day",
    short: "HD",
    bg: "bg-amber-50 border-amber-200",
    color: "text-amber-700",
    dot: "bg-amber-500",
    cell: "bg-amber-100 text-amber-700 border-amber-200",
  },
  leave: {
    label: "Leave",
    short: "L",
    bg: "bg-blue-50 border-blue-200",
    color: "text-blue-700",
    dot: "bg-blue-500",
    cell: "bg-blue-100 text-blue-700 border-blue-200",
  },
  holiday: {
    label: "Holiday",
    short: "H",
    bg: "bg-purple-50 border-purple-200",
    color: "text-purple-700",
    dot: "bg-purple-500",
    cell: "bg-purple-100 text-purple-700 border-purple-200",
  },
  weekoff: {
    label: "Week Off",
    short: "WO",
    bg: "bg-slate-50 border-slate-200",
    color: "text-slate-600",
    dot: "bg-slate-400",
    cell: "bg-slate-100 text-slate-600 border-slate-200",
  },
  late: {
    label: "Late",
    short: "LT",
    bg: "bg-orange-50 border-orange-200",
    color: "text-orange-700",
    dot: "bg-orange-500",
    cell: "bg-orange-100 text-orange-700 border-orange-200",
  },
};

// SINGLE SHIFT — your company runs one shift only
export const SHIFT_CONFIG = {
  label: "General Shift",
  checkIn: "09:00",
  checkOut: "18:00",
  graceMinutes: 15, // late after this
  workingHours: 8,
  halfDayHours: 4,
};

export const OT_TYPES = [
  { value: "regular", label: "Regular OT (1.5x)", multiplier: 1.5 },
  { value: "weekend", label: "Weekend OT (2x)", multiplier: 2 },
  { value: "holiday", label: "Holiday OT (2.5x)", multiplier: 2.5 },
] as const;

export const OT_STATUS = [
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
  { value: "paid", label: "Paid" },
] as const;
