import { useState } from "react";
import {
  HiOutlineCash,
  HiOutlineCalculator,
  HiOutlineDocumentText,
  HiOutlineCog,
  HiOutlineCreditCard,
  HiOutlineClock,
  HiOutlineDownload,
  HiOutlinePlus,
} from "react-icons/hi";
import SalaryStatCards from "../components/Salarystatcards";
import CustomTabs from "../../../components/common/CustomTabs";
import PayslipsPanel from "../components/Payslipspanel";
import SalaryStructurePanel from "../components/Salarystructurepanel";
import LoansPanel from "../components/Loanspanel";
import RunPayrollPanel from "../components/Runpayrollpanel";
import HistoryPanel from "../components/Historypanel";

const TABS = [
  {
    key: "run",
    label: "Run Payroll",
    icon: <HiOutlineCalculator size={14} />,
  },
  {
    key: "payslips",
    label: "Payslips",
    icon: <HiOutlineDocumentText size={14} />,
  },
  {
    key: "structure",
    label: "Salary Structure",
    icon: <HiOutlineCog size={14} />,
  },
  {
    key: "loans",
    label: "Loans & Advances",
    icon: <HiOutlineCreditCard size={14} />,
  },
  { key: "history", label: "History", icon: <HiOutlineClock size={14} /> },
];

const SalaryPage = () => {
  const [activeTab, setActiveTab] = useState("run");
  const [toast, setToast] = useState<string | null>(null);
  // counter to force RunPayrollPanel to re-trigger its auto-calc when "New Payroll Run" is clicked
  const [payrollRunTrigger, setPayrollRunTrigger] = useState(0);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  // ===== Export handler =====
  const handleExport = () => {
    showToast("📥 Preparing salary export...");

    // Simulate file download
    setTimeout(() => {
      // Generate a simple CSV blob and download it
      const csvContent = `Employee ID,Name,Designation,Gross Salary,Deductions,Net Salary,Status
EMP-001,Suresh Murugan,Senior Driver,21900,2852,19048,Approved
EMP-002,Karthik Raja,Driver,18902,5466,13436,Draft
EMP-003,Vijay Prakash,Driver,18500,6535,11965,Draft
EMP-004,Arun Selvam,Loader,16800,1200,15600,Approved
EMP-005,Rajesh Kumar,Plant Operator,26828,2640,24188,Paid
EMP-006,Divya Bharathi,Accountant,30000,3000,27000,Approved`;

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `salary-export-${new Date()
        .toISOString()
        .slice(0, 10)}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      showToast("✓ Salary data exported as CSV");
    }, 800);
  };

  // ===== New Payroll Run handler =====
  const handleNewPayrollRun = () => {
    // 1. Switch to the Run Payroll tab
    setActiveTab("run");

    // 2. Notify user
    showToast("🚀 Starting new payroll run for this month...");

    // 3. Bump the trigger so RunPayrollPanel can react (sync attendance + auto-calc)
    setPayrollRunTrigger((t) => t + 1);
  };

  return (
    <div className="min-h-screen bg-slate-50/50">
      {/* Toast notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl bg-slate-900 text-white text-sm font-semibold shadow-2xl animate-in slide-in-from-bottom-4">
          {toast}
        </div>
      )}

      <div className=" space-y-6">
        {/* ============ Title Bar ============ */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-100">
              <HiOutlineCash className="w-7 h-7 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                Payroll Center
              </h2>
              <p className="text-sm text-slate-500 mt-0.5">
                Process salaries, manage payslips & track loans
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 text-sm font-medium hover:bg-slate-50 hover:border-slate-300 active:scale-95 transition-all"
            >
              <HiOutlineDownload className="w-4 h-4" />
              Export
            </button>
            <button
              type="button"
              onClick={handleNewPayrollRun}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-semibold shadow-md shadow-emerald-500/20 hover:bg-emerald-700 hover:shadow-lg hover:-translate-y-0.5 active:scale-95 transition-all"
            >
              <HiOutlinePlus className="w-4 h-4" />
              New Payroll Run
            </button>
          </div>
        </div>

        {/* ============ Stat Cards ============ */}
        <SalaryStatCards />

        {/* ============ Tabs ============ */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm overflow-x-auto">
          <CustomTabs
            items={TABS}
            activeKey={activeTab}
            onChange={setActiveTab}
            accentColor="#059669"
            className="min-w-[600px]"
          />
        </div>

        {/* ============ Tab Content ============ */}
        <div>
          {activeTab === "run" && (
            <RunPayrollPanel triggerKey={payrollRunTrigger} />
          )}
          {activeTab === "payslips" && <PayslipsPanel />}
          {activeTab === "structure" && <SalaryStructurePanel />}
          {activeTab === "loans" && <LoansPanel />}
          {activeTab === "history" && <HistoryPanel />}
        </div>
      </div>
    </div>
  );
};

export default SalaryPage;
