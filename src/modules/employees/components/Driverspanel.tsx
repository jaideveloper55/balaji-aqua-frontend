import {
  HiOutlinePhone,
  HiOutlineLocationMarker,
  HiOutlineTruck,
  HiOutlineStar,
  HiOutlineExclamation,
  HiOutlineIdentification,
} from "react-icons/hi";
import type { Employee } from "../types/Employees";
import { STATUS_META } from "../constants/Employees.constants";

interface Props {
  employees: Employee[];
  onView: (e: Employee) => void;
  onEdit: (e: Employee) => void;
}

const formatDate = (s: string) => {
  const d = new Date(s);
  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const daysUntil = (date: string) => {
  const d = new Date(date);
  const now = new Date();
  return Math.floor((d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
};

const DriverCard = ({
  driver,
  onView,
}: {
  driver: Employee;
  onView: (e: Employee) => void;
}) => {
  const status = STATUS_META[driver.status];
  const licenseDaysLeft = driver.drivingLicenseExpiry
    ? daysUntil(driver.drivingLicenseExpiry)
    : null;
  const licenseExpiringSoon = licenseDaysLeft !== null && licenseDaysLeft < 60;

  return (
    <div
      onClick={() => onView(driver)}
      className="group cursor-pointer bg-white rounded-2xl border border-slate-200 p-5 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-100/50 hover:-translate-y-0.5 transition-all duration-300"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-bold flex items-center justify-center shadow-md">
              {driver.fullName.charAt(0)}
            </div>
            <span
              className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white ${status.dot}`}
            />
          </div>
          <div className="min-w-0">
            <div className="font-bold text-slate-900 truncate">
              {driver.fullName}
            </div>
            <div className="text-xs text-slate-500 font-mono">
              {driver.employeeId}
            </div>
          </div>
        </div>
        <span
          className={`shrink-0 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[10px] font-semibold ${status.bg} ${status.color}`}
        >
          <span className={`w-1 h-1 rounded-full ${status.dot}`} />
          {status.label}
        </span>
      </div>

      {/* Contact + Vehicle */}
      <div className="space-y-2 mb-4 pb-4 border-b border-dashed border-slate-200">
        <div className="flex items-center gap-2 text-xs text-slate-600">
          <HiOutlinePhone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          {driver.phone}
        </div>
        {driver.vehicleAssigned && (
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <HiOutlineTruck className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="font-mono font-semibold">
              {driver.vehicleAssigned}
            </span>
          </div>
        )}
        {driver.routeAssigned && (
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <HiOutlineLocationMarker className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            {driver.routeAssigned}
          </div>
        )}
      </div>

      {/* Performance Stats */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="bg-blue-50 rounded-lg p-2.5 text-center">
          <div className="text-lg font-bold text-blue-700">
            {driver.totalDeliveries ?? 0}
          </div>
          <div className="text-[10px] text-blue-600/70 font-medium uppercase tracking-wide">
            Deliveries
          </div>
        </div>
        <div className="bg-emerald-50 rounded-lg p-2.5 text-center">
          <div className="text-lg font-bold text-emerald-700 flex items-center justify-center gap-0.5">
            {driver.onTimePercent ?? 0}
            <span className="text-xs">%</span>
          </div>
          <div className="text-[10px] text-emerald-600/70 font-medium uppercase tracking-wide">
            On Time
          </div>
        </div>
        <div className="bg-amber-50 rounded-lg p-2.5 text-center">
          <div className="text-lg font-bold text-amber-700 flex items-center justify-center gap-0.5">
            <HiOutlineStar className="w-3.5 h-3.5" />
            {driver.rating ?? "—"}
          </div>
          <div className="text-[10px] text-amber-600/70 font-medium uppercase tracking-wide">
            Rating
          </div>
        </div>
      </div>

      {/* License Footer */}
      <div
        className={`flex items-center justify-between p-2.5 rounded-lg text-xs ${
          licenseExpiringSoon
            ? licenseDaysLeft! < 30
              ? "bg-red-50 border border-red-200"
              : "bg-amber-50 border border-amber-200"
            : "bg-slate-50 border border-slate-200"
        }`}
      >
        <div className="flex items-center gap-1.5">
          <HiOutlineIdentification
            className={`w-3.5 h-3.5 ${
              licenseExpiringSoon ? "text-amber-600" : "text-slate-400"
            }`}
          />
          <span className="text-slate-600">License</span>
        </div>
        {driver.drivingLicenseExpiry ? (
          licenseExpiringSoon ? (
            <span
              className={`font-semibold flex items-center gap-1 ${
                licenseDaysLeft! < 30 ? "text-red-700" : "text-amber-700"
              }`}
            >
              <HiOutlineExclamation className="w-3 h-3" />
              {licenseDaysLeft} days left
            </span>
          ) : (
            <span className="text-slate-600 font-medium">
              {formatDate(driver.drivingLicenseExpiry)}
            </span>
          )
        ) : (
          <span className="text-slate-400">Not added</span>
        )}
      </div>
    </div>
  );
};

const DriversPanel = ({ employees, onView }: Props) => {
  if (employees.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
        <div className="inline-flex p-4 rounded-2xl bg-blue-50 mb-4">
          <HiOutlineTruck className="w-8 h-8 text-blue-600" />
        </div>
        <h3 className="text-lg font-semibold text-slate-900">No drivers yet</h3>
        <p className="text-sm text-slate-500 mt-1">
          Add drivers from the All Employees tab to see them here.
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Mini Summary Bar */}
      <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border border-blue-100 rounded-2xl p-4 mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-white shadow-sm">
            <HiOutlineTruck className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <div className="text-sm font-bold text-slate-900">
              {employees.length} Drivers
            </div>
            <div className="text-xs text-slate-600">
              Critical to your delivery operations
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <div>
            <div className="text-slate-500">Active</div>
            <div className="font-bold text-emerald-600">
              {employees.filter((e) => e.status === "active").length}
            </div>
          </div>
          <div>
            <div className="text-slate-500">Avg Rating</div>
            <div className="font-bold text-amber-600">
              {(
                employees.reduce((s, e) => s + (e.rating ?? 0), 0) /
                employees.length
              ).toFixed(1)}
            </div>
          </div>
          <div>
            <div className="text-slate-500">Total Deliveries</div>
            <div className="font-bold text-blue-600">
              {employees
                .reduce((s, e) => s + (e.totalDeliveries ?? 0), 0)
                .toLocaleString("en-IN")}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {employees.map((d) => (
          <DriverCard key={d.id} driver={d} onView={onView} />
        ))}
      </div>
    </div>
  );
};

export default DriversPanel;
