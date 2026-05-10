import { HiOutlineArrowRight } from "react-icons/hi";
import { DEPARTMENTS, DEPT_META } from "../constants/Employees.constants";
import type { Employee } from "../types/Employees";

interface Props {
  employees: Employee[];
}

const DepartmentsPanel = ({ employees }: Props) => {
  const total = employees.length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {DEPARTMENTS.map((dept) => {
        const meta = DEPT_META[dept.value];
        const deptEmployees = employees.filter(
          (e) => e.department === dept.value
        );
        const active = deptEmployees.filter(
          (e) => e.status === "active"
        ).length;
        const onLeave = deptEmployees.filter(
          (e) => e.status === "on_leave"
        ).length;
        const percent = total > 0 ? (deptEmployees.length / total) * 100 : 0;

        return (
          <div
            key={dept.value}
            className="group bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-lg hover:-translate-y-0.5 transition-all cursor-pointer"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-xl ${meta.bg} border text-2xl`}>
                {meta.icon}
              </div>
              <HiOutlineArrowRight className="w-4 h-4 text-slate-300 group-hover:text-slate-500 group-hover:translate-x-0.5 transition-all" />
            </div>

            <h3 className="font-bold text-slate-900 text-lg">{dept.label}</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {deptEmployees.length}{" "}
              {deptEmployees.length === 1 ? "member" : "members"}
            </p>

            {/* Progress bar */}
            <div className="mt-4">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-slate-500">Workforce share</span>
                <span className={`font-semibold ${meta.color}`}>
                  {percent.toFixed(0)}%
                </span>
              </div>
              <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${meta.bg
                    .replace("bg-", "bg-")
                    .replace("-50", "-400")}`}
                  style={{ width: `${percent}%` }}
                />
              </div>
            </div>

            {/* Mini stats */}
            <div className="grid grid-cols-2 gap-2 mt-4">
              <div className="rounded-lg bg-emerald-50 border border-emerald-100 px-3 py-2">
                <div className="text-xs text-emerald-700 font-medium">
                  Active
                </div>
                <div className="text-lg font-bold text-emerald-800">
                  {active}
                </div>
              </div>
              <div className="rounded-lg bg-amber-50 border border-amber-100 px-3 py-2">
                <div className="text-xs text-amber-700 font-medium">
                  On Leave
                </div>
                <div className="text-lg font-bold text-amber-800">
                  {onLeave}
                </div>
              </div>
            </div>

            {/* Avatars preview */}
            {deptEmployees.length > 0 && (
              <div className="flex items-center mt-4 pt-4 border-t border-dashed border-slate-200">
                <div className="flex -space-x-2">
                  {deptEmployees.slice(0, 4).map((e) => (
                    <div
                      key={e.id}
                      title={e.fullName}
                      className="w-7 h-7 rounded-full bg-gradient-to-br from-slate-400 to-slate-600 border-2 border-white text-white text-xs font-bold flex items-center justify-center"
                    >
                      {e.fullName.charAt(0)}
                    </div>
                  ))}
                  {deptEmployees.length > 4 && (
                    <div className="w-7 h-7 rounded-full bg-slate-100 border-2 border-white text-slate-600 text-[10px] font-bold flex items-center justify-center">
                      +{deptEmployees.length - 4}
                    </div>
                  )}
                </div>
                <span className="ml-auto text-xs text-slate-400">
                  View team →
                </span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default DepartmentsPanel;
