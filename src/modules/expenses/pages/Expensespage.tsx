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
import { Button } from "antd";
import ExpenseStatCards from "../components/Expensestatcards";
import CustomTabs from "../../../components/common/CustomTabs";
import CustomPageHeader from "../../../components/common/CustomPageHeader";
import OverviewPanel from "../components/Overviewpanel";
import CategoriesPanel from "../components/Categoriespanel";
import VendorsPanel from "../components/Vendorspanel";
import RecurringPanel from "../components/Recurringpanel";
import PettyCashPanel from "../components/Pettycashpanel";
import ExpenseFormModal from "../components/Expenseformmodal";
import { successNotification } from "../../../components/common/Notification";
import { MOCK_EXPENSES } from "../constants/expenseMockData";
import Allexpensespanel from "../components/Allexpensespanel";

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

  const handleAdd = (data: any) => {
    successNotification(
      "Expense Added",
      `₹${(data.total || 0).toLocaleString("en-IN")} recorded`
    );
  };

  const handleExport = () => {
    successNotification("Export", "Exporting expense data...");
  };

  return (
    <div className="space-y-6">
      <CustomPageHeader
        icon={<HiOutlineFolder className="text-white" size={20} />}
        title="Expense Center"
        subtitle="Track, categorize & control your business spending"
        iconBg="bg-rose-500"
        actions={
          <>
            <Button
              icon={<HiOutlineDownload size={15} />}
              onClick={handleExport}
              className="!rounded-xl !h-9"
            >
              Export
            </Button>
            <Button
              type="primary"
              icon={<HiOutlinePlus size={15} />}
              onClick={() => setFormOpen(true)}
              className="!bg-rose-600 hover:!bg-rose-700 !rounded-xl !h-9 !font-semibold"
            >
              Add Expense
            </Button>
          </>
        }
      />

      {/* Stat Cards */}
      <ExpenseStatCards />

      {/* Tabs */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm overflow-x-auto">
        <CustomTabs
          items={TABS}
          activeKey={activeTab}
          onChange={setActiveTab}
          accentColor="#e11d48"
          className="min-w-[700px]"
        />
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === "overview" && <OverviewPanel />}
        {activeTab === "all" && (
          <Allexpensespanel
            expenses={MOCK_EXPENSES}
            onAdd={() => console.log("open add expense modal")}
            onView={(e) => console.log("view", e.expenseNo)}
            onEdit={(e) => console.log("edit", e.expenseNo)}
            onRefresh={() => console.log("refresh")}
            loading={false}
          />
        )}
        {activeTab === "categories" && <CategoriesPanel />}
        {activeTab === "vendors" && <VendorsPanel />}
        {activeTab === "recurring" && <RecurringPanel />}
        {activeTab === "petty" && <PettyCashPanel />}
      </div>

      <ExpenseFormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleAdd}
      />
    </div>
  );
};

export default ExpensesPage;
