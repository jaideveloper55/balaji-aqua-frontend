import { useState } from "react";
import {
  HiOutlineFolder,
  HiOutlineChartPie,
  HiOutlineReceiptTax,
  HiOutlineTag,
  HiOutlineUserGroup,
  HiOutlineRefresh,
  HiOutlineCash,
  HiOutlineDownload,
  HiOutlinePlus,
} from "react-icons/hi";
import ExpenseStatCards from "../components/Expensestatcards";
import CustomTabs from "../../../components/common/CustomTabs";
import OverviewPanel from "../components/Overviewpanel";
import AllExpensesPanel from "../components/Allexpensespanel";
import CategoriesPanel from "../components/Categoriespanel";
import VendorsPanel from "../components/Vendorspanel";
import RecurringPanel from "../components/Recurringpanel";
import PettyCashPanel from "../components/Pettycashpanel";
import ExpenseFormModal from "../components/Expenseformmodal";

const TABS = [
  { key: "overview", label: "Overview", icon: <HiOutlineChartPie size={14} /> },
  {
    key: "all",
    label: "All Expenses",
    icon: <HiOutlineReceiptTax size={14} />,
  },
  { key: "categories", label: "Categories", icon: <HiOutlineTag size={14} /> },
  { key: "vendors", label: "Vendors", icon: <HiOutlineUserGroup size={14} /> },
  {
    key: "recurring",
    label: "Recurring",
    icon: <HiOutlineRefresh size={14} />,
  },
  { key: "petty", label: "Petty Cash", icon: <HiOutlineCash size={14} /> },
];

const ExpensesPage = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [formOpen, setFormOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleAdd = (data: any) => {
    console.log("New expense from header:", data);
    showToast(`✓ Expense added: ₹${(data.total || 0).toLocaleString("en-IN")}`);
  };

  const handleExport = () => {
    showToast("📥 Exporting expense data...");
    // Real implementation: trigger CSV/Excel download
  };

  return (
    <div className="min-h-screen bg-slate-50/50">
      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl bg-slate-900 text-white text-sm font-semibold shadow-2xl animate-in slide-in-from-bottom-4">
          {toast}
        </div>
      )}

      <div className=" space-y-6">
        {/* ============ Title Bar ============ */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-2xl bg-rose-50 border border-rose-100">
              <HiOutlineFolder className="w-7 h-7 text-rose-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                Expense Center
              </h2>
              <p className="text-sm text-slate-500 mt-0.5">
                Track, categorize & control your business spending
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 text-sm font-medium hover:bg-slate-50 hover:border-slate-300 transition-all"
            >
              <HiOutlineDownload className="w-4 h-4" />
              Export
            </button>
            <button
              type="button"
              onClick={() => setFormOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-600 text-white text-sm font-semibold shadow-md shadow-rose-500/20 hover:bg-rose-700 hover:shadow-lg hover:-translate-y-0.5 transition-all"
            >
              <HiOutlinePlus className="w-4 h-4" />
              Add Expense
            </button>
          </div>
        </div>

        {/* ============ Stat Cards ============ */}
        <ExpenseStatCards />

        {/* ============ Tabs - FIXED LAYOUT ============ */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm overflow-x-auto">
          <CustomTabs
            items={TABS}
            activeKey={activeTab}
            onChange={setActiveTab}
            accentColor="#e11d48"
            className="min-w-[700px]"
          />
        </div>

        {/* ============ Tab Content ============ */}
        <div>
          {activeTab === "overview" && <OverviewPanel />}
          {activeTab === "all" && <AllExpensesPanel />}
          {activeTab === "categories" && <CategoriesPanel />}
          {activeTab === "vendors" && <VendorsPanel />}
          {activeTab === "recurring" && <RecurringPanel />}
          {activeTab === "petty" && <PettyCashPanel />}
        </div>
      </div>

      {/* Header-level Add Expense modal */}
      <ExpenseFormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleAdd}
      />
    </div>
  );
};

export default ExpensesPage;
