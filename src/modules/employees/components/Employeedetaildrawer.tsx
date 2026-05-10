import {
  HiOutlinePhone,
  HiOutlineMail,
  HiOutlineLocationMarker,
  HiOutlineCalendar,
  HiOutlineCash,
  HiOutlineIdentification,
  HiOutlineTruck,
  HiOutlineStar,
  HiOutlineX,
  HiOutlinePencilAlt,
  HiOutlineExclamation,
  HiOutlineCheckCircle,
  HiOutlineClock,
} from "react-icons/hi";
import type { Employee } from "../types/Employees";
import { STATUS_META, DEPT_META } from "../constants/Employees.constants";

interface Props {
  employee: Employee | null;
  onClose: () => void;
  onEdit: (e: Employee) => void;
}

const formatINR = (n: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);

const formatDate = (s: string) => {
  const d = new Date(s);
  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const Field = ({
  label,
  value,
  icon,
}: {
  label: string;
  value: React.ReactNode;
  icon?: React.ReactNode;
}) => (
  <div className="py-2">
    <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
      {label}
    </div>
    <div className="text-sm font-medium text-slate-900 flex items-center gap-1.5">
      {icon}
      {value || <span className="text-slate-400 italic">Not provided</span>}
    </div>
  </div>
);

const EmployeeDetailDrawer = ({ employee, onClose, onEdit }: Props) => {
  if (!employee) return null;

  const status = STATUS_META[employee.status];
  const dept = DEPT_META[employee.department];

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 animate-in fade-in"
      />

      {/* Drawer */}
      <div className="fixed top-0 right-0 bottom-0 w-full sm:w-[480px] bg-white z-50 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="relative bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white p-6">
          <div className="flex items-start justify-between mb-4">
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
            >
              <HiOutlineX className="w-5 h-5" />
            </button>
            <button
              onClick={() => onEdit(employee)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/15 hover:bg-white/25 transition-colors text-xs font-semibold"
            >
              <HiOutlinePencilAlt className="w-3.5 h-3.5" />
              Edit
            </button>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm border-2 border-white/30 text-white text-3xl font-bold flex items-center justify-center shadow-lg">
              {employee.fullName.charAt(0)}
            </div>
            <div>
              <h2 className="text-2xl font-bold">{employee.fullName}</h2>
              <div className="text-sm text-white/80 mt-0.5">
                {employee.designation}
              </div>
              <div className="flex items-center gap-2 mt-2">
                <span className="px-2 py-0.5 rounded-md bg-white/15 text-xs font-mono font-semibold">
                  {employee.employeeId}
                </span>
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold ${status.bg} ${status.color}`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                  {status.label}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto bg-slate-50/40">
          {/* Quick Actions */}
          <div className="grid grid-cols-3 gap-2 p-4 bg-white border-b border-slate-200">
            <a
              href={`tel:${employee.phone}`}
              className="flex flex-col items-center gap-1 p-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 transition-colors"
            >
              <HiOutlinePhone className="w-5 h-5 text-emerald-600" />
              <span className="text-xs font-semibold text-emerald-700">
                Call
              </span>
            </a>
            <a
              href={`https://wa.me/${employee.phone}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-1 p-3 rounded-xl bg-blue-50 hover:bg-blue-100 transition-colors"
            >
              <span className="text-base">💬</span>
              <span className="text-xs font-semibold text-blue-700">
                WhatsApp
              </span>
            </a>
            {employee.email && (
              <a
                href={`mailto:${employee.email}`}
                className="flex flex-col items-center gap-1 p-3 rounded-xl bg-purple-50 hover:bg-purple-100 transition-colors"
              >
                <HiOutlineMail className="w-5 h-5 text-purple-600" />
                <span className="text-xs font-semibold text-purple-700">
                  Email
                </span>
              </a>
            )}
          </div>

          {/* Driver Performance (if driver) */}
          {employee.role === "driver" && (
            <div className="p-4 border-b border-slate-200">
              <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
                Driver Performance
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-blue-50 rounded-xl p-3 text-center border border-blue-100">
                  <div className="text-xl font-bold text-blue-700">
                    {employee.totalDeliveries ?? 0}
                  </div>
                  <div className="text-[10px] text-blue-600/80 font-semibold uppercase">
                    Deliveries
                  </div>
                </div>
                <div className="bg-emerald-50 rounded-xl p-3 text-center border border-emerald-100">
                  <div className="text-xl font-bold text-emerald-700">
                    {employee.onTimePercent ?? 0}%
                  </div>
                  <div className="text-[10px] text-emerald-600/80 font-semibold uppercase">
                    On Time
                  </div>
                </div>
                <div className="bg-amber-50 rounded-xl p-3 text-center border border-amber-100">
                  <div className="text-xl font-bold text-amber-700 flex items-center justify-center gap-0.5">
                    <HiOutlineStar className="w-4 h-4" />
                    {employee.rating ?? "—"}
                  </div>
                  <div className="text-[10px] text-amber-600/80 font-semibold uppercase">
                    Rating
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Sections */}
          <div className="p-4 space-y-4">
            {/* Contact */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4">
              <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Contact Information
              </div>
              <div className="divide-y divide-slate-100">
                <Field
                  label="Phone"
                  value={employee.phone}
                  icon={
                    <HiOutlinePhone className="w-3.5 h-3.5 text-slate-400" />
                  }
                />
                <Field
                  label="Email"
                  value={employee.email}
                  icon={
                    <HiOutlineMail className="w-3.5 h-3.5 text-slate-400" />
                  }
                />
                <Field
                  label="Address"
                  value={employee.currentAddress}
                  icon={
                    <HiOutlineLocationMarker className="w-3.5 h-3.5 text-slate-400" />
                  }
                />
              </div>
            </div>

            {/* Employment */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4">
              <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Employment
              </div>
              <div className="divide-y divide-slate-100">
                <Field
                  label="Department"
                  value={
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded border text-xs ${dept.bg} ${dept.color}`}
                    >
                      {dept.icon} {dept.label}
                    </span>
                  }
                />
                <Field label="Designation" value={employee.designation} />
                <Field
                  label="Employment Type"
                  value={employee.employmentType}
                />
                <Field
                  label="Joined"
                  value={formatDate(employee.joinedDate)}
                  icon={
                    <HiOutlineCalendar className="w-3.5 h-3.5 text-slate-400" />
                  }
                />
                <Field label="Shift" value={employee.shift} />
                {employee.vehicleAssigned && (
                  <Field
                    label="Vehicle Assigned"
                    value={
                      <span className="font-mono">
                        {employee.vehicleAssigned}
                      </span>
                    }
                    icon={
                      <HiOutlineTruck className="w-3.5 h-3.5 text-slate-400" />
                    }
                  />
                )}
                {employee.routeAssigned && (
                  <Field label="Route" value={employee.routeAssigned} />
                )}
              </div>
            </div>

            {/* Salary */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4">
              <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Compensation
              </div>
              <div className="divide-y divide-slate-100">
                <Field
                  label="Base Salary"
                  value={
                    <span className="text-base font-bold text-emerald-700">
                      {formatINR(employee.baseSalary)}
                      <span className="text-xs text-slate-500 font-normal ml-1">
                        /
                        {employee.salaryType === "monthly"
                          ? "month"
                          : employee.salaryType === "daily"
                          ? "day"
                          : "delivery"}
                      </span>
                    </span>
                  }
                  icon={
                    <HiOutlineCash className="w-3.5 h-3.5 text-slate-400" />
                  }
                />
                {employee.outstandingLoan ? (
                  <Field
                    label="Outstanding Loan"
                    value={
                      <span className="text-amber-700 font-bold">
                        {formatINR(employee.outstandingLoan)}
                      </span>
                    }
                  />
                ) : null}
              </div>
            </div>

            {/* Documents */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4">
              <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
                Documents
              </div>
              <div className="space-y-2">
                {[
                  { label: "Aadhaar", value: employee.aadhaar },
                  { label: "PAN", value: employee.pan },
                  {
                    label: "Driving License",
                    value: employee.drivingLicense,
                    expiry: employee.drivingLicenseExpiry,
                  },
                ].map((d) => (
                  <div
                    key={d.label}
                    className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-100"
                  >
                    <div className="flex items-center gap-2">
                      <HiOutlineIdentification className="w-4 h-4 text-slate-400" />
                      <span className="text-sm text-slate-700">{d.label}</span>
                    </div>
                    {d.value ? (
                      <div className="flex items-center gap-2">
                        {d.expiry && (
                          <span className="text-[10px] text-slate-500">
                            exp: {formatDate(d.expiry)}
                          </span>
                        )}
                        <HiOutlineCheckCircle className="w-4 h-4 text-emerald-500" />
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400">Missing</span>
                    )}
                  </div>
                ))}
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="text-base">👮</span>
                    <span className="text-sm text-slate-700">
                      Police Verification
                    </span>
                  </div>
                  {employee.policeVerified ? (
                    <HiOutlineCheckCircle className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <HiOutlineExclamation className="w-4 h-4 text-amber-500" />
                  )}
                </div>
              </div>
            </div>

            {/* Leave Balance */}
            {employee.totalLeaveBalance !== undefined && (
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <HiOutlineClock className="w-4 h-4 text-blue-600" />
                  <div className="text-xs font-bold text-blue-700 uppercase tracking-wider">
                    Leave Balance
                  </div>
                </div>
                <div className="text-2xl font-bold text-slate-900">
                  {employee.totalLeaveBalance}{" "}
                  <span className="text-sm font-medium text-slate-500">
                    days remaining
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default EmployeeDetailDrawer;
