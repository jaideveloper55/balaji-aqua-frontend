// src/modules/employees/types/Employees.ts

export type EmployeeStatus = "active" | "on_leave" | "inactive" | "terminated";
export type Department =
  | "plant"
  | "delivery"
  | "sales"
  | "admin"
  | "maintenance";
export type EmploymentType =
  | "full_time"
  | "part_time"
  | "contract"
  | "daily_wage";
export type SalaryType = "monthly" | "daily" | "per_delivery";
export type ShiftType = "morning" | "evening" | "night" | "general";

export interface Employee {
  id: string;
  employeeId: string; // EMP-001
  photo?: string;
  fullName: string;
  fatherName?: string;
  dob?: string;
  gender?: "male" | "female" | "other";
  bloodGroup?: string;
  maritalStatus?: "single" | "married";

  // Contact
  phone: string;
  altPhone?: string;
  email?: string;
  currentAddress?: string;
  permanentAddress?: string;

  // Employment
  designation: string;
  department: Department;
  role: string;
  joinedDate: string;
  employmentType: EmploymentType;
  reportingManager?: string;
  workLocation?: "plant" | "field" | "office";
  shift?: ShiftType;
  status: EmployeeStatus;

  // Salary
  salaryType: SalaryType;
  baseSalary: number;
  hra?: number;
  conveyance?: number;
  food?: number;
  pfApplicable?: boolean;
  esiApplicable?: boolean;
  bankAccount?: string;
  ifsc?: string;
  upiId?: string;

  // Documents
  aadhaar?: string;
  pan?: string;
  drivingLicense?: string;
  drivingLicenseExpiry?: string;
  policeVerified?: boolean;

  // Emergency
  emergencyContactName?: string;
  emergencyContactRelation?: string;
  emergencyContactPhone?: string;

  // Performance (for drivers)
  vehicleAssigned?: string;
  routeAssigned?: string;
  totalDeliveries?: number;
  onTimePercent?: number;
  rating?: number;

  // Misc
  totalLeaveBalance?: number;
  outstandingLoan?: number;
}
