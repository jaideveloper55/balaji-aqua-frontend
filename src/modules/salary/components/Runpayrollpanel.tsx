import { useState, useEffect } from "react";
import { Select, Input, Tooltip } from "antd";
import {
  HiOutlineCalculator,
  HiOutlineCheckCircle,
  HiOutlineCash,
  HiOutlineDocumentDownload,
  HiOutlineSearch,
  HiOutlineRefresh,
  HiOutlineEye,
  HiOutlineLightningBolt,
  HiOutlineExclamation,
  HiOutlineCurrencyRupee,
  HiOutlineChevronDown,
  HiOutlineSparkles,
} from "react-icons/hi";
import dayjs from "dayjs";
import { STATUS_META } from "../constants/Salary.constants";
import PayslipPreviewModal from "./PayslipPreviewModal";
import PayrollConfirmModal from "./Payrollconfirmmodal";

interface PayrollRow {
  id: string;
  employeeId: string;
  name: string;
  designation: string;
  workingDays: number;
  presentDays: number;
  payableDays: number;
  baseSalary: number;
  allowances: number;
  otHours: number;
  otAmount: number;
  grossSalary: number;
  pf: number;
  loanEMI: number;
  jarDamage: number;
  absentDeduction: number;
  totalDeductions: number;
  netSalary: number;
  status: "draft" | "approved" | "paid" | "on_hold";
  hasAlert?: string;
}

const INITIAL_PAYROLL: PayrollRow[] = [
  {
    id: "1",
    employeeId: "EMP-001",
    name: "Suresh Murugan",
    designation: "Senior Driver",
    workingDays: 26,
    presentDays: 25,
    payableDays: 25.5,
    baseSalary: 18000,
    allowances: 3000,
    otHours: 8,
    otAmount: 900,
    grossSalary: 21900,
    pf: 2160,
    loanEMI: 0,
    jarDamage: 0,
    absentDeduction: 692,
    totalDeductions: 2852,
    netSalary: 19048,
    status: "approved",
  },
  {
    id: "2",
    employeeId: "EMP-002",
    name: "Karthik Raja",
    designation: "Driver",
    workingDays: 26,
    presentDays: 23,
    payableDays: 23.5,
    baseSalary: 16000,
    allowances: 2500,
    otHours: 4,
    otAmount: 402,
    grossSalary: 18902,
    pf: 1920,
    loanEMI: 1500,
    jarDamage: 200,
    absentDeduction: 1846,
    totalDeductions: 5466,
    netSalary: 13436,
    status: "draft",
    hasAlert: "Loan EMI deduction this month",
  },
  {
    id: "3",
    employeeId: "EMP-003",
    name: "Vijay Prakash",
    designation: "Driver",
    workingDays: 26,
    presentDays: 20,
    payableDays: 20,
    baseSalary: 16000,
    allowances: 2500,
    otHours: 0,
    otAmount: 0,
    grossSalary: 18500,
    pf: 1920,
    loanEMI: 0,
    jarDamage: 0,
    absentDeduction: 4615,
    totalDeductions: 6535,
    netSalary: 11965,
    status: "draft",
    hasAlert: "5 leave days taken — high deduction",
  },
  {
    id: "4",
    employeeId: "EMP-004",
    name: "Arun Selvam",
    designation: "Loader",
    workingDays: 26,
    presentDays: 24,
    payableDays: 24,
    baseSalary: 15600,
    allowances: 0,
    otHours: 12,
    otAmount: 1200,
    grossSalary: 16800,
    pf: 0,
    loanEMI: 0,
    jarDamage: 0,
    absentDeduction: 1200,
    totalDeductions: 1200,
    netSalary: 15600,
    status: "approved",
  },
  {
    id: "5",
    employeeId: "EMP-005",
    name: "Rajesh Kumar",
    designation: "Plant Operator",
    workingDays: 26,
    presentDays: 26,
    payableDays: 26,
    baseSalary: 22000,
    allowances: 4000,
    otHours: 6,
    otAmount: 828,
    grossSalary: 26828,
    pf: 2640,
    loanEMI: 0,
    jarDamage: 0,
    absentDeduction: 0,
    totalDeductions: 2640,
    netSalary: 24188,
    status: "paid",
  },
  {
    id: "6",
    employeeId: "EMP-006",
    name: "Divya Bharathi",
    designation: "Accountant",
    workingDays: 26,
    presentDays: 26,
    payableDays: 26,
    baseSalary: 25000,
    allowances: 5000,
    otHours: 0,
    otAmount: 0,
    grossSalary: 30000,
    pf: 3000,
    loanEMI: 0,
    jarDamage: 0,
    absentDeduction: 0,
    totalDeductions: 3000,
    netSalary: 27000,
    status: "approved",
  },
];

const formatINR = (n: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);

interface RunPayrollPanelProps {
  /** When this number changes, the panel auto-runs Sync + Auto-Calculate.
   *  Used by parent's "New Payroll Run" button. */
  triggerKey?: number;
}

const RunPayrollPanel = ({ triggerKey }: RunPayrollPanelProps = {}) => {
  const [payroll, setPayroll] = useState<PayrollRow[]>(INITIAL_PAYROLL);
  const [month, setMonth] = useState(dayjs().format("YYYY-MM"));
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [previewPayslip, setPreviewPayslip] = useState<PayrollRow | null>(null);
  const [confirmAction, setConfirmAction] = useState<
    "approve" | "process" | "pay" | null
  >(null);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  // Listen for "New Payroll Run" trigger from the page header.
  // Skip the very first render (triggerKey === 0 or undefined initially).
  useEffect(() => {
    if (!triggerKey) return;

    // Step 1: Sync attendance
    showToast("🔄 Syncing attendance data...");

    // Step 2: After a short delay, auto-calculate
    const t1 = setTimeout(() => {
      showToast("✨ Calculating salaries for all employees...");
    }, 1200);

    // Step 3: Done
    const t2 = setTimeout(() => {
      // Reset all paid/approved entries to draft so the user can review fresh
      setPayroll((prev) =>
        prev.map((r) => ({
          ...r,
          status: r.status === "paid" ? "paid" : "draft",
        }))
      );
      showToast("✓ Payroll ready — review & approve below");
    }, 2400);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [triggerKey]);

  const filtered = payroll.filter((r) => {
    if (filter !== "all" && r.status !== filter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        r.name.toLowerCase().includes(q) ||
        r.employeeId.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const stats = {
    total: payroll.length,
    draft: payroll.filter((r) => r.status === "draft").length,
    approved: payroll.filter((r) => r.status === "approved").length,
    paid: payroll.filter((r) => r.status === "paid").length,
    grossPayroll: payroll.reduce((s, r) => s + r.grossSalary, 0),
    totalDeductions: payroll.reduce((s, r) => s + r.totalDeductions, 0),
    netPayroll: payroll.reduce((s, r) => s + r.netSalary, 0),
    totalOTCost: payroll.reduce((s, r) => s + r.otAmount, 0),
  };

  // ============ Action handlers ============
  const handleSyncAttendance = () => {
    showToast("🔄 Syncing attendance data from Attendance module...");
    setTimeout(() => {
      showToast("✓ Attendance synced — present days & OT updated");
    }, 1500);
  };

  const handleAutoCalculate = () => {
    showToast("✨ Recalculating all salaries...");
    setTimeout(() => {
      showToast("✓ All salaries calculated successfully");
    }, 1500);
  };

  const handleApproveAll = () => {
    setPayroll((prev) =>
      prev.map((r) =>
        r.status === "draft" ? { ...r, status: "approved" as const } : r
      )
    );
    showToast(`✓ Approved ${stats.draft} payroll entries`);
  };

  const handlePayNow = (row: PayrollRow) => {
    setPayroll((prev) =>
      prev.map((r) => (r.id === row.id ? { ...r, status: "paid" as const } : r))
    );
    showToast(`💸 Paid ${formatINR(row.netSalary)} to ${row.name}`);
  };

  const handlePreview = (row: PayrollRow) => {
    setPreviewPayslip(row);
  };

  const handleDownload = (row: PayrollRow) => {
    showToast(`📥 Downloading payslip for ${row.name}...`);
  };

  const handlePayslipDownload = () => {
    if (!previewPayslip) return;
    showToast(`📥 Payslip PDF generated for ${previewPayslip.name}`);
  };

  const handlePayslipSend = () => {
    if (!previewPayslip) return;
    showToast(`📤 Payslip sent via WhatsApp to ${previewPayslip.name}`);
  };

  const filterChips = [
    { key: "all", label: "All", count: stats.total },
    { key: "draft", label: "Draft", count: stats.draft },
    { key: "approved", label: "Approved", count: stats.approved },
    { key: "paid", label: "Paid", count: stats.paid },
  ];

  // Confirm modal config
  const confirmConfig = {
    approve: {
      title: "Approve All Draft Entries",
      description: `${stats.draft} draft entries will be moved to approved`,
      onConfirm: handleApproveAll,
      total: payroll
        .filter((r) => r.status === "draft")
        .reduce((s, r) => s + r.netSalary, 0),
      count: stats.draft,
    },
    process: {
      title: "Process Payroll",
      description: "Generate payslips for all approved entries",
      onConfirm: () => showToast("✓ Payroll processed — payslips generated"),
      total: stats.netPayroll,
      count: stats.approved,
    },
    pay: {
      title: "Pay All Approved",
      description: "Mark all approved entries as paid (after bank transfer)",
      onConfirm: () => {
        setPayroll((prev) =>
          prev.map((r) =>
            r.status === "approved" ? { ...r, status: "paid" as const } : r
          )
        );
        showToast(`💸 Marked ${stats.approved} entries as paid`);
      },
      total: payroll
        .filter((r) => r.status === "approved")
        .reduce((s, r) => s + r.netSalary, 0),
      count: stats.approved,
    },
  };

  return (
    <>
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl bg-slate-900 text-white text-sm font-semibold shadow-2xl animate-in slide-in-from-bottom-4">
          {toast}
        </div>
      )}

      <div className="space-y-4">
        {/* ============ Period selector ============ */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center gap-3 flex-1">
              <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-100">
                <HiOutlineCalculator className="w-5 h-5 text-emerald-600" />
              </div>
              <div className="flex-1">
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Processing payroll for
                </div>
                <Select
                  size="large"
                  className="!w-56 [&_.ant-select-selector]:!border-0 [&_.ant-select-selector]:!shadow-none [&_.ant-select-selector]:!p-0 [&_.ant-select-selection-item]:!font-bold [&_.ant-select-selection-item]:!text-base [&_.ant-select-selection-item]:!text-slate-900"
                  value={month}
                  onChange={setMonth}
                  options={Array.from({ length: 12 }, (_, i) => {
                    const d = dayjs().subtract(i, "month");
                    return {
                      value: d.format("YYYY-MM"),
                      label: d.format("MMMM YYYY"),
                    };
                  })}
                />
                <div className="text-xs text-slate-500 mt-0.5">
                  {payroll.length} employees · 26 working days
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={handleSyncAttendance}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold hover:bg-blue-100 active:scale-95 transition-all"
              >
                <HiOutlineRefresh className="w-3.5 h-3.5" />
                Sync from Attendance
              </button>
              <button
                type="button"
                onClick={handleAutoCalculate}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-amber-50 border border-amber-200 text-amber-700 text-xs font-semibold hover:bg-amber-100 active:scale-95 transition-all"
              >
                <HiOutlineSparkles className="w-3.5 h-3.5" />
                Auto-Calculate All
              </button>
              <button
                type="button"
                onClick={() => setConfirmAction("approve")}
                disabled={stats.draft === 0}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-white text-xs font-semibold shadow-md transition-all ${
                  stats.draft === 0
                    ? "bg-slate-300 cursor-not-allowed"
                    : "bg-emerald-600 hover:bg-emerald-700 active:scale-95"
                }`}
              >
                <HiOutlineCheckCircle className="w-3.5 h-3.5" />
                Approve & Process All
                {stats.draft > 0 && (
                  <span className="px-1.5 py-0.5 bg-white/25 rounded text-[10px]">
                    {stats.draft}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* ============ Big Numbers ============ */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-full blur-2xl -translate-y-1/2 translate-x-1/4" />
            <div className="relative">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Gross Payroll
              </div>
              <div className="text-3xl font-bold text-slate-900 mt-2">
                {formatINR(stats.grossPayroll)}
              </div>
              <div className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                <HiOutlineCash className="w-3 h-3" />
                Including {formatINR(stats.totalOTCost)} OT
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-red-50 rounded-full blur-2xl -translate-y-1/2 translate-x-1/4" />
            <div className="relative">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Total Deductions
              </div>
              <div className="text-3xl font-bold text-red-700 mt-2">
                −{formatINR(stats.totalDeductions)}
              </div>
              <div className="text-xs text-slate-500 mt-1">
                PF · TDS · Loans · Absences
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-emerald-50 via-emerald-50 to-emerald-100/50 rounded-2xl border border-emerald-200 p-5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-200/40 rounded-full blur-2xl -translate-y-1/2 translate-x-1/4" />
            <div className="relative">
              <div className="text-xs font-semibold text-emerald-700 uppercase tracking-wider flex items-center gap-1">
                <HiOutlineCurrencyRupee className="w-3 h-3" />
                Net Payable
              </div>
              <div className="text-3xl font-bold text-emerald-800 mt-2">
                {formatINR(stats.netPayroll)}
              </div>
              <div className="text-xs text-emerald-700 mt-1">
                Will be transferred to {payroll.length} accounts
              </div>
            </div>
          </div>
        </div>

        {/* ============ Filters ============ */}
        <div className="bg-white rounded-2xl border border-slate-200 p-3 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
            <div className="md:col-span-5">
              <Input
                size="large"
                placeholder="Search employee by name or ID..."
                prefix={<HiOutlineSearch className="text-slate-400" />}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                allowClear
              />
            </div>
            <div className="md:col-span-7 flex items-center gap-2 overflow-x-auto">
              {filterChips.map((f) => (
                <button
                  key={f.key}
                  type="button"
                  onClick={() => setFilter(f.key)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all shrink-0 ${
                    filter === f.key
                      ? "bg-emerald-600 text-white shadow-sm"
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
        </div>

        {/* ============ Payroll rows ============ */}
        <div className="space-y-3">
          {filtered.map((row) => {
            const status = STATUS_META[row.status];
            const isExpanded = expandedId === row.id;
            const attendancePercent = (row.presentDays / row.workingDays) * 100;

            return (
              <div
                key={row.id}
                className={`bg-white rounded-2xl border overflow-hidden transition-all ${
                  isExpanded
                    ? "border-emerald-300 shadow-md"
                    : "border-slate-200 hover:shadow-md"
                }`}
              >
                {/* Header row */}
                <div
                  className="grid grid-cols-1 lg:grid-cols-12 gap-3 p-4 items-center cursor-pointer"
                  onClick={() => setExpandedId(isExpanded ? null : row.id)}
                >
                  {/* Employee */}
                  <div className="lg:col-span-3 flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 text-white font-bold flex items-center justify-center shadow-sm shrink-0">
                      {row.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <div className="font-semibold text-slate-900 truncate flex items-center gap-1.5">
                        {row.name}
                        {row.hasAlert && (
                          <Tooltip title={row.hasAlert}>
                            <HiOutlineExclamation className="w-4 h-4 text-amber-500" />
                          </Tooltip>
                        )}
                      </div>
                      <div className="text-xs text-slate-500 flex items-center gap-1.5">
                        <span className="font-mono">{row.employeeId}</span>
                        <span>•</span>
                        <span className="truncate">{row.designation}</span>
                      </div>
                    </div>
                  </div>

                  {/* Attendance */}
                  <div className="lg:col-span-2">
                    <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
                      Attendance
                    </div>
                    <div className="text-sm font-bold text-slate-900 mt-0.5">
                      {row.presentDays} / {row.workingDays}{" "}
                      <span className="text-xs text-slate-500 font-medium">
                        days
                      </span>
                    </div>
                    <div className="mt-1 h-1 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          attendancePercent >= 95
                            ? "bg-emerald-500"
                            : attendancePercent >= 85
                            ? "bg-amber-500"
                            : "bg-red-500"
                        }`}
                        style={{ width: `${attendancePercent}%` }}
                      />
                    </div>
                  </div>

                  {/* Gross */}
                  <div className="lg:col-span-2">
                    <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
                      Gross
                    </div>
                    <div className="text-sm font-bold text-slate-900 mt-0.5">
                      {formatINR(row.grossSalary)}
                    </div>
                    {row.otAmount > 0 && (
                      <div className="text-[10px] text-amber-600 font-medium">
                        + {formatINR(row.otAmount)} OT
                      </div>
                    )}
                  </div>

                  {/* Deductions */}
                  <div className="lg:col-span-2">
                    <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
                      Deductions
                    </div>
                    <div className="text-sm font-bold text-red-600 mt-0.5">
                      −{formatINR(row.totalDeductions)}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {row.loanEMI > 0 && "EMI · "}
                      {row.jarDamage > 0 && "Damage · "}
                      PF
                    </div>
                  </div>

                  {/* Net */}
                  <div className="lg:col-span-2">
                    <div className="text-xs text-emerald-700 font-semibold uppercase tracking-wider">
                      Net Payable
                    </div>
                    <div className="text-lg font-bold text-emerald-700 mt-0.5">
                      {formatINR(row.netSalary)}
                    </div>
                    <span
                      className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full border text-[10px] font-bold mt-0.5 ${status.bg} ${status.color}`}
                    >
                      <span className={`w-1 h-1 rounded-full ${status.dot}`} />
                      {status.label}
                    </span>
                  </div>

                  {/* Action */}
                  <div className="lg:col-span-1 flex justify-end">
                    <button
                      type="button"
                      className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
                    >
                      <HiOutlineChevronDown
                        className={`w-4 h-4 text-slate-400 transition-transform ${
                          isExpanded ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {/* Expanded breakdown */}
                {isExpanded && (
                  <div className="border-t border-slate-100 bg-slate-50/40 p-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {/* Earnings */}
                      <div className="bg-white rounded-xl border border-slate-200 p-4">
                        <div className="text-xs font-bold text-emerald-700 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                          <HiOutlineCash className="w-3.5 h-3.5" />
                          Earnings
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-600">
                              Base Salary ({row.payableDays} days)
                            </span>
                            <span className="font-semibold text-slate-900">
                              {formatINR(row.baseSalary)}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-600">Allowances</span>
                            <span className="font-semibold text-slate-900">
                              {formatINR(row.allowances)}
                            </span>
                          </div>
                          {row.otAmount > 0 && (
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-slate-600 flex items-center gap-1">
                                OT ({row.otHours} hrs)
                                <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-700 font-bold">
                                  FROM ATTENDANCE
                                </span>
                              </span>
                              <span className="font-semibold text-slate-900">
                                {formatINR(row.otAmount)}
                              </span>
                            </div>
                          )}
                          <div className="flex items-center justify-between text-base pt-2 mt-2 border-t border-slate-200">
                            <span className="font-bold text-slate-900">
                              Gross Total
                            </span>
                            <span className="font-bold text-emerald-700">
                              {formatINR(row.grossSalary)}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Deductions */}
                      <div className="bg-white rounded-xl border border-slate-200 p-4">
                        <div className="text-xs font-bold text-red-700 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                          <HiOutlineExclamation className="w-3.5 h-3.5" />
                          Deductions
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-600">PF (12%)</span>
                            <span className="font-semibold text-slate-900">
                              −{formatINR(row.pf)}
                            </span>
                          </div>
                          {row.absentDeduction > 0 && (
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-slate-600">
                                Absent ({row.workingDays - row.presentDays}{" "}
                                days)
                              </span>
                              <span className="font-semibold text-slate-900">
                                −{formatINR(row.absentDeduction)}
                              </span>
                            </div>
                          )}
                          {row.loanEMI > 0 && (
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-slate-600 flex items-center gap-1">
                                Loan EMI
                                <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 font-bold">
                                  FROM LOANS
                                </span>
                              </span>
                              <span className="font-semibold text-slate-900">
                                −{formatINR(row.loanEMI)}
                              </span>
                            </div>
                          )}
                          {row.jarDamage > 0 && (
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-slate-600 flex items-center gap-1">
                                Jar Damage
                                <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-100 text-cyan-700 font-bold">
                                  FROM JAR TRACKING
                                </span>
                              </span>
                              <span className="font-semibold text-slate-900">
                                −{formatINR(row.jarDamage)}
                              </span>
                            </div>
                          )}
                          <div className="flex items-center justify-between text-base pt-2 mt-2 border-t border-slate-200">
                            <span className="font-bold text-slate-900">
                              Total Deductions
                            </span>
                            <span className="font-bold text-red-700">
                              −{formatINR(row.totalDeductions)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Net + Actions */}
                    <div className="mt-5 bg-gradient-to-r from-emerald-50 to-emerald-100/40 border border-emerald-200 rounded-xl p-4 flex items-center justify-between flex-wrap gap-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-lg bg-emerald-600 text-white">
                          <HiOutlineCurrencyRupee className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">
                            Net Salary Payable
                          </div>
                          <div className="text-2xl font-bold text-emerald-900">
                            {formatINR(row.netSalary)}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePreview(row);
                          }}
                          className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 active:scale-95 transition-all"
                        >
                          <HiOutlineEye className="w-3.5 h-3.5" />
                          Preview Payslip
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDownload(row);
                          }}
                          className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 active:scale-95 transition-all"
                        >
                          <HiOutlineDocumentDownload className="w-3.5 h-3.5" />
                          Download
                        </button>
                        {row.status !== "paid" && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePayNow(row);
                            }}
                            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 active:scale-95 shadow-md transition-all"
                          >
                            <HiOutlineLightningBolt className="w-3.5 h-3.5" />
                            Pay Now
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Modals */}
      <PayslipPreviewModal
        open={previewPayslip !== null}
        onClose={() => setPreviewPayslip(null)}
        payslip={
          previewPayslip
            ? {
                ...previewPayslip,
                month: dayjs(month).format("MMMM YYYY"),
                hra: 0,
                conveyance: previewPayslip.allowances,
              }
            : null
        }
        onDownload={handlePayslipDownload}
        onSend={handlePayslipSend}
      />

      {confirmAction && (
        <PayrollConfirmModal
          open={confirmAction !== null}
          onClose={() => setConfirmAction(null)}
          onConfirm={confirmConfig[confirmAction].onConfirm}
          title={confirmConfig[confirmAction].title}
          description={confirmConfig[confirmAction].description}
          variant={confirmAction}
          totalEmployees={confirmConfig[confirmAction].count}
          totalAmount={confirmConfig[confirmAction].total}
        />
      )}
    </>
  );
};

export default RunPayrollPanel;
