import { Input, Select } from "antd";
import {
  HiOutlineSearch,
  HiOutlineFilter,
  HiOutlineRefresh,
} from "react-icons/hi";
import {
  DEPARTMENTS,
  EMPLOYEE_STATUS,
  EMPLOYMENT_TYPES,
} from "../constants/Employees.constants";

interface Props {
  search: string;
  setSearch: (v: string) => void;
  departmentFilter: string | null;
  setDepartmentFilter: (v: string | null) => void;
  statusFilter: string | null;
  setStatusFilter: (v: string | null) => void;
  employmentTypeFilter: string | null;
  setEmploymentTypeFilter: (v: string | null) => void;
  resultCount: number;
  totalCount: number;
}

const EmployeeFilterBar = ({
  search,
  setSearch,
  departmentFilter,
  setDepartmentFilter,
  statusFilter,
  setStatusFilter,
  employmentTypeFilter,
  setEmploymentTypeFilter,
  resultCount,
  totalCount,
}: Props) => {
  const hasFilters =
    !!search || !!departmentFilter || !!statusFilter || !!employmentTypeFilter;

  const reset = () => {
    setSearch("");
    setDepartmentFilter(null);
    setStatusFilter(null);
    setEmploymentTypeFilter(null);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
          <HiOutlineFilter className="w-3.5 h-3.5" />
          Filters
        </div>
        <div className="text-xs text-slate-500">
          Showing{" "}
          <span className="font-semibold text-slate-900">{resultCount}</span> of{" "}
          <span className="font-semibold text-slate-900">{totalCount}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-3">
        <div className="lg:col-span-4">
          <Input
            size="large"
            placeholder="Search name, phone, employee ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            prefix={<HiOutlineSearch className="text-slate-400" />}
            allowClear
          />
        </div>

        <div className="lg:col-span-3">
          <Select
            size="large"
            placeholder="All Departments"
            className="w-full"
            allowClear
            value={departmentFilter}
            onChange={(v) => setDepartmentFilter(v ?? null)}
            options={DEPARTMENTS.map((d) => ({
              value: d.value,
              label: d.label,
            }))}
          />
        </div>

        <div className="lg:col-span-2">
          <Select
            size="large"
            placeholder="All Status"
            className="w-full"
            allowClear
            value={statusFilter}
            onChange={(v) => setStatusFilter(v ?? null)}
            options={EMPLOYEE_STATUS.map((s) => ({
              value: s.value,
              label: s.label,
            }))}
          />
        </div>

        <div className="lg:col-span-2">
          <Select
            size="large"
            placeholder="All Types"
            className="w-full"
            allowClear
            value={employmentTypeFilter}
            onChange={(v) => setEmploymentTypeFilter(v ?? null)}
            options={EMPLOYMENT_TYPES.map((t) => ({
              value: t.value,
              label: t.label,
            }))}
          />
        </div>

        <div className="lg:col-span-1">
          <button
            type="button"
            onClick={reset}
            disabled={!hasFilters}
            className={`w-full h-10 rounded-lg border text-sm font-medium flex items-center justify-center gap-1.5 transition-all
              ${
                hasFilters
                  ? "bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300"
                  : "bg-slate-50 border-slate-100 text-slate-300 cursor-not-allowed"
              }`}
          >
            <HiOutlineRefresh className="w-4 h-4" />
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmployeeFilterBar;
