export type AttendanceStatus =
  | "present"
  | "absent"
  | "half_day"
  | "leave"
  | "holiday"
  | "weekoff"
  | "late";

export type ShiftType = "morning" | "evening" | "night" | "general";

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  designation: string;
  shift: ShiftType;
  date: string; // YYYY-MM-DD
  status: AttendanceStatus;
  checkIn?: string; // HH:mm
  checkOut?: string; // HH:mm
  workedHours?: number;
  overtimeHours?: number;
  lateBy?: number; // minutes
  earlyBy?: number; // minutes
  remarks?: string;
}

export type OTType = "regular" | "weekend" | "holiday";
export type OTStatus = "pending" | "approved" | "rejected" | "paid";

export interface OvertimeRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  date: string;
  hours: number;
  type: OTType;
  multiplier: number;
  hourlyRate: number;
  totalAmount: number;
  reason: string;
  status: OTStatus;
  approvedBy?: string;
  approvedAt?: string;
}
