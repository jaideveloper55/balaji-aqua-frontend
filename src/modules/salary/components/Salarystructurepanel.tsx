import { useState } from "react";
import { Input } from "antd";
import {
  HiOutlinePencilAlt,
  HiOutlineSearch,
  HiOutlinePlusCircle,
  HiOutlineMinusCircle,
} from "react-icons/hi";
import SalaryStructureModal from "./Salarystructuremodal";

interface StructureRow {
  id: string;
  employeeId: string;
  name: string;
  designation: string;
  salaryType: "monthly" | "daily";
  baseSalary: number;
  hra: number;
  conveyance: number;
  food: number;
  pf: number;
  ctc: number;
  netInHand: number;
}

const INITIAL_DATA: StructureRow[] = [
  {
    id: "1",
    employeeId: "EMP-001",
    name: "Suresh Murugan",
    designation: "Senior Driver",
    salaryType: "monthly",
    baseSalary: 18000,
    hra: 2000,
    conveyance: 1000,
    food: 0,
    pf: 2160,
    ctc: 21000,
    netInHand: 18840,
  },
  {
    id: "2",
    employeeId: "EMP-002",
    name: "Karthik Raja",
    designation: "Driver",
    salaryType: "monthly",
    baseSalary: 16000,
    hra: 1500,
    conveyance: 1000,
    food: 0,
    pf: 1920,
    ctc: 18500,
    netInHand: 16580,
  },
  {
    id: "3",
    employeeId: "EMP-004",
    name: "Arun Selvam",
    designation: "Loader",
    salaryType: "daily",
    baseSalary: 600,
    hra: 0,
    conveyance: 0,
    food: 0,
    pf: 0,
    ctc: 600,
    netInHand: 600,
  },
  {
    id: "4",
    employeeId: "EMP-005",
    name: "Rajesh Kumar",
    designation: "Plant Operator",
    salaryType: "monthly",
    baseSalary: 22000,
    hra: 2500,
    conveyance: 1500,
    food: 0,
    pf: 2640,
    ctc: 26000,
    netInHand: 23360,
  },
  {
    id: "5",
    employeeId: "EMP-006",
    name: "Divya Bharathi",
    designation: "Accountant",
    salaryType: "monthly",
    baseSalary: 25000,
    hra: 3000,
    conveyance: 2000,
    food: 0,
    pf: 3000,
    ctc: 30000,
    netInHand: 27000,
  },
];

const formatINR = (n: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);

const SalaryStructurePanel = () => {
  const [data, setData] = useState<StructureRow[]>(INITIAL_DATA);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<StructureRow | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const filtered = data.filter((s) =>
    search
      ? s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.employeeId.toLowerCase().includes(search.toLowerCase())
      : true
  );

  const totalCTC = data.reduce((s, r) => s + r.ctc, 0);
  const avgCTC = totalCTC / data.length;

  const handleEdit = (row: StructureRow) => {
    setEditing(row);
  };

  const handleSave = (updated: StructureRow) => {
    setData((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
    showToast(`✓ Salary structure updated for ${updated.name}`);
    setEditing(null);
  };

  return (
    <>
      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl bg-slate-900 text-white text-sm font-semibold shadow-2xl animate-in slide-in-from-bottom-4">
          {toast}
        </div>
      )}

      <div className="space-y-4">
        {/* Top summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="bg-white border border-slate-200 rounded-2xl p-4">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total CTC (Monthly)
            </div>
            <div className="text-2xl font-bold text-slate-900 mt-1">
              {formatINR(totalCTC)}
            </div>
            <div className="text-xs text-slate-500 mt-1">
              Across {data.length} employees
            </div>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl p-4">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Average CTC
            </div>
            <div className="text-2xl font-bold text-blue-700 mt-1">
              {formatINR(avgCTC)}
            </div>
            <div className="text-xs text-slate-500 mt-1">Per employee</div>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl p-4">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Annual Payroll
            </div>
            <div className="text-2xl font-bold text-emerald-700 mt-1">
              {formatINR(totalCTC * 12)}
            </div>
            <div className="text-xs text-slate-500 mt-1">Projected yearly</div>
          </div>
        </div>

        {/* Search */}
        <Input
          size="large"
          placeholder="Search employee..."
          prefix={<HiOutlineSearch className="text-slate-400" />}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          allowClear
          className="!rounded-xl"
        />

        {/* Structure cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {filtered.map((s) => (
            <div
              key={s.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-md transition-all group"
            >
              {/* Header */}
              <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/40">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 text-white font-bold flex items-center justify-center shadow-sm">
                    {s.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900">{s.name}</div>
                    <div className="text-xs text-slate-500 flex items-center gap-1.5">
                      <span className="font-mono">{s.employeeId}</span>
                      <span>•</span>
                      <span>{s.designation}</span>
                      <span>•</span>
                      <span
                        className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                          s.salaryType === "monthly"
                            ? "bg-blue-50 text-blue-700 border border-blue-200"
                            : "bg-amber-50 text-amber-700 border border-amber-200"
                        }`}
                      >
                        {s.salaryType.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleEdit(s)}
                  className="p-1.5 rounded-lg hover:bg-emerald-50 text-slate-400 hover:text-emerald-600 active:scale-95 transition-all opacity-0 group-hover:opacity-100"
                  title="Edit salary structure"
                >
                  <HiOutlinePencilAlt className="w-4 h-4" />
                </button>
              </div>

              {/* Earnings */}
              <div className="p-4 space-y-2">
                <div className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider flex items-center gap-1">
                  <HiOutlinePlusCircle className="w-3 h-3" />
                  Earnings
                </div>
                <div className="text-xs text-slate-600 flex items-center justify-between">
                  <span>Base Salary</span>
                  <span className="font-semibold text-slate-900">
                    {formatINR(s.baseSalary)}
                    {s.salaryType === "daily" && (
                      <span className="text-[10px] text-slate-400 ml-1">
                        /day
                      </span>
                    )}
                  </span>
                </div>
                {s.hra > 0 && (
                  <div className="text-xs text-slate-600 flex items-center justify-between">
                    <span>HRA</span>
                    <span className="font-semibold text-slate-900">
                      {formatINR(s.hra)}
                    </span>
                  </div>
                )}
                {s.conveyance > 0 && (
                  <div className="text-xs text-slate-600 flex items-center justify-between">
                    <span>Conveyance</span>
                    <span className="font-semibold text-slate-900">
                      {formatINR(s.conveyance)}
                    </span>
                  </div>
                )}
                {s.food > 0 && (
                  <div className="text-xs text-slate-600 flex items-center justify-between">
                    <span>Food Allowance</span>
                    <span className="font-semibold text-slate-900">
                      {formatINR(s.food)}
                    </span>
                  </div>
                )}

                {/* Deductions */}
                {s.pf > 0 && (
                  <>
                    <div className="text-[10px] font-bold text-red-700 uppercase tracking-wider flex items-center gap-1 pt-3 border-t border-slate-100 mt-2">
                      <HiOutlineMinusCircle className="w-3 h-3" />
                      Default Deductions
                    </div>
                    <div className="text-xs text-slate-600 flex items-center justify-between">
                      <span>PF (12%)</span>
                      <span className="font-semibold text-red-600">
                        −{formatINR(s.pf)}
                      </span>
                    </div>
                  </>
                )}
              </div>

              {/* Footer totals */}
              <div className="bg-emerald-50/40 border-t border-emerald-100 px-4 py-3 grid grid-cols-2 gap-2">
                <div>
                  <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                    Gross CTC
                  </div>
                  <div className="text-base font-bold text-slate-900">
                    {formatINR(s.ctc)}
                    {s.salaryType === "daily" && (
                      <span className="text-[10px] text-slate-400 ml-1">
                        /day
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] font-semibold text-emerald-700 uppercase tracking-wider">
                    Net In Hand
                  </div>
                  <div className="text-base font-bold text-emerald-700">
                    {formatINR(s.netInHand)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Edit Modal */}
      <SalaryStructureModal
        open={editing !== null}
        onClose={() => setEditing(null)}
        onSubmit={handleSave}
        employee={editing}
      />
    </>
  );
};

export default SalaryStructurePanel;
