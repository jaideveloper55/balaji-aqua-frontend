import { useState, useMemo } from "react";
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
  HiOutlineX,
  HiOutlineExclamationCircle,
} from "react-icons/hi";
import { Button, Spin } from "antd";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import ExpenseStatCards from "../components/Expensestatcards";
import CustomTabs from "../../../components/common/CustomTabs";
import CustomPageHeader from "../../../components/common/CustomPageHeader";
import OverviewPanel from "../components/Overviewpanel";
import CategoriesPanel from "../components/Categoriespanel";
import VendorsPanel from "../components/Vendorspanel";
import RecurringPanel from "../components/Recurringpanel";
import PettyCashPanel from "../components/Pettycashpanel";
import ExpenseFormModal from "../components/Expenseformmodal";
import Allexpensespanel from "../components/Allexpensespanel";

import {
  successNotification,
  errorNotification,
} from "../../../components/common/Notification";

import {
  getExpensesApi,
  getExpenseStatsApi,
  createExpenseApi,
  updateExpenseApi,
  deleteExpenseApi,
  getCategoriesSimpleApi,
  getVendorsSimpleApi,
  getRecurringRemindersApi,
  acknowledgeReminderApi,
  getPettyCashBalanceApi,
  type ExpenseFilters,
  type CreateExpensePayload,
  type UpdateExpensePayload,
} from "../api/Expenses.api";
import ExpenseExportDrawer from "../components/Expenseexportdrawer";
import ExpenseViewModal from "../components/Expenseviewmodal";

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
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState("overview");
  const [formOpen, setFormOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<any | null>(null);
  const [exportOpen, setExportOpen] = useState(false);
  const [viewingExpense, setViewingExpense] = useState<any | null>(null);
  const [expensePage, setExpensePage] = useState(1);
  const [expenseSearch, setExpenseSearch] = useState("");

  const expenseFilters: ExpenseFilters = useMemo(
    () => ({
      search: expenseSearch || undefined,
      page: expensePage,
      limit: 10,
      sortBy: "date",
      sortOrder: "desc",
    }),
    [expenseSearch, expensePage]
  );

  const {
    data: expensesData,
    isLoading: isLoadingExpenses,
    isFetching: isFetchingExpenses,
  } = useQuery({
    queryKey: ["expenses", expenseFilters],
    queryFn: () => getExpensesApi(expenseFilters).then((res) => res.data),
    staleTime: 1000 * 30,
    enabled: activeTab === "all",
  });

  const { data: expenseStats, isLoading: isLoadingStats } = useQuery({
    queryKey: ["expense-stats"],
    queryFn: () => getExpenseStatsApi().then((res) => res.data),
    staleTime: 1000 * 60 * 5,
  });

  // Petty cash balance — for "Cash on Hand" stat card
  const { data: pettyCashBalance } = useQuery({
    queryKey: ["petty-cash-balance"],
    queryFn: () => getPettyCashBalanceApi().then((res) => res.data),
    staleTime: 1000 * 60 * 2,
  });

  const { data: categoriesSimple } = useQuery({
    queryKey: ["categories-simple"],
    queryFn: () => getCategoriesSimpleApi().then((res) => res.data),
    staleTime: 1000 * 60 * 10,
  });

  const { data: vendorsSimple } = useQuery({
    queryKey: ["vendors-simple"],
    queryFn: () => getVendorsSimpleApi().then((res) => res.data),
    staleTime: 1000 * 60 * 10,
  });

  const expenses = expensesData?.data ?? [];
  const pagination = expensesData?.pagination ?? {
    page: 1,
    total: 0,
    totalPages: 1,
    limit: 10,
  };

  const createExpenseMutation = useMutation({
    mutationFn: (data: CreateExpensePayload) =>
      createExpenseApi(data).then((res) => res.data),
    onSuccess: (response) => {
      successNotification(
        "Expense Added",
        `${response.expenseNo} · ₹${Number(response.amount).toLocaleString(
          "en-IN"
        )} recorded`
      );
      setFormOpen(false);
      setEditingExpense(null);
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      queryClient.invalidateQueries({ queryKey: ["expense-stats"] });
      queryClient.invalidateQueries({ queryKey: ["category-overview"] });
    },
    onError: (err: any) => {
      errorNotification(
        "Failed to Add Expense",
        err?.response?.data?.message ?? "Please check all required fields"
      );
    },
  });

  const updateExpenseMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateExpensePayload }) =>
      updateExpenseApi(id, data).then((res) => res.data),
    onSuccess: () => {
      successNotification("Expense Updated", "Changes saved successfully");
      setFormOpen(false);
      setEditingExpense(null);
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      queryClient.invalidateQueries({ queryKey: ["expense-stats"] });
      queryClient.invalidateQueries({ queryKey: ["category-overview"] });
    },
    onError: (err: any) => {
      errorNotification(
        "Update Failed",
        err?.response?.data?.message ?? "Could not update expense"
      );
    },
  });

  const deleteExpenseMutation = useMutation({
    mutationFn: (id: string) => deleteExpenseApi(id).then((res) => res.data),
    onSuccess: () => {
      successNotification("Expense Deleted", "Record removed successfully");
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      queryClient.invalidateQueries({ queryKey: ["expense-stats"] });
      queryClient.invalidateQueries({ queryKey: ["category-overview"] });
    },
    onError: (err: any) => {
      errorNotification(
        "Delete Failed",
        err?.response?.data?.message ?? "Could not delete expense"
      );
    },
  });

  const handleFormSubmit = (formData: any) => {
    if (editingExpense) {
      updateExpenseMutation.mutate({ id: editingExpense.id, data: formData });
    } else {
      createExpenseMutation.mutate(formData);
    }
  };

  const handleEdit = (expense: any) => {
    setEditingExpense(expense);
    setFormOpen(true);
  };

  const handleView = (expense: any) => {
    setViewingExpense(expense);
  };

  const handleDelete = (expense: any) => {
    deleteExpenseMutation.mutate(expense.id);
  };

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ["expenses"] });
  };

  const handleOpenAdd = () => {
    setEditingExpense(null);
    setFormOpen(true);
  };

  const handleExport = () => {
    setExportOpen(true);
  };

  const handleCloseForm = () => {
    setFormOpen(false);
    setEditingExpense(null);
  };

  const { data: remindersData } = useQuery({
    queryKey: ["recurring-reminders"],
    queryFn: () => getRecurringRemindersApi().then((res) => res.data),
    staleTime: 1000 * 60 * 10,
    refetchOnWindowFocus: true,
  });

  const reminders = remindersData?.reminders ?? [];
  const urgentReminders = reminders.filter(
    (r: any) => r.severity === "critical" || r.severity === "urgent"
  );

  const handleAcknowledgeReminder = async (id: string) => {
    try {
      await acknowledgeReminderApi(id);
      queryClient.invalidateQueries({ queryKey: ["recurring-reminders"] });
    } catch {}
  };

  const isSubmitting =
    createExpenseMutation.isPending || updateExpenseMutation.isPending;

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
              onClick={handleOpenAdd}
              className="!bg-rose-600 hover:!bg-rose-700 !rounded-xl !h-9 !font-semibold"
            >
              Add Expense
            </Button>
          </>
        }
      />

      {urgentReminders.length > 0 && (
        <div className="space-y-2">
          {urgentReminders.map((r: any) => (
            <div
              key={r.id}
              className={`flex items-center justify-between gap-3 px-4 py-3 rounded-xl border ${
                r.severity === "critical"
                  ? "bg-red-50 border-red-200"
                  : "bg-amber-50 border-amber-200"
              }`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <HiOutlineExclamationCircle
                  size={18}
                  className={
                    r.severity === "critical"
                      ? "text-red-600 shrink-0"
                      : "text-amber-600 shrink-0"
                  }
                />
                <div className="min-w-0">
                  <span
                    className={`text-sm font-semibold ${
                      r.severity === "critical"
                        ? "text-red-800"
                        : "text-amber-800"
                    }`}
                  >
                    {r.severity === "critical" ? "Overdue:" : "Due soon:"}{" "}
                    {r.name}
                  </span>
                  <span
                    className={`ml-2 text-xs ${
                      r.severity === "critical"
                        ? "text-red-600"
                        : "text-amber-600"
                    }`}
                  >
                    {r.daysUntil < 0
                      ? `${Math.abs(r.daysUntil)} day(s) overdue`
                      : r.daysUntil === 0
                      ? "Due today"
                      : `Due in ${r.daysUntil} day(s)`}{" "}
                    · ₹{Number(r.amount).toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
              <button
                onClick={() => handleAcknowledgeReminder(r.id)}
                className="shrink-0 p-1 rounded-lg hover:bg-white/60 transition-colors"
                title="Dismiss for this cycle"
              >
                <HiOutlineX size={16} className="text-slate-500" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Stat Cards — Spin only on very first load */}
      <Spin spinning={isLoadingStats} tip="Loading stats...">
        <ExpenseStatCards
          totalThisMonth={expenseStats?.totalThisMonth}
          trendPercent={expenseStats?.trendPercent}
          thisWeekSpend={expenseStats?.thisWeekSpend}
          weekTrend={expenseStats?.weekTrend}
          topCategory={expenseStats?.topCategory}
          pettyCashBalance={pettyCashBalance?.currentBalance}
          reconciledTill={pettyCashBalance?.reconciledTill}
        />
      </Spin>

      {/* Tabs nav */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm overflow-x-auto">
        <CustomTabs
          items={TABS}
          activeKey={activeTab}
          onChange={setActiveTab}
          accentColor="#e11d48"
          className="min-w-[700px]"
        />
      </div>

      {/* Tab panels */}
      <div>
        {activeTab === "overview" && (
          <OverviewPanel onAddExpense={handleOpenAdd} />
        )}

        {activeTab === "all" && (
          <Spin
            spinning={isLoadingExpenses || isFetchingExpenses}
            tip={isLoadingExpenses ? "Loading expenses..." : "Refreshing..."}
          >
            <Allexpensespanel
              expenses={expenses}
              loading={isLoadingExpenses}
              totalCount={pagination.total}
              currentPage={pagination.page}
              pageSize={pagination.limit}
              onPageChange={(page: number) => setExpensePage(page)}
              onAdd={handleOpenAdd}
              onView={handleView}
              onEdit={handleEdit}
              onRefresh={handleRefresh}
              onDelete={handleDelete}
              isDeleting={deleteExpenseMutation.isPending}
              search={expenseSearch}
              onSearchChange={(val: string) => {
                setExpenseSearch(val);
                setExpensePage(1);
              }}
            />
          </Spin>
        )}

        {activeTab === "categories" && <CategoriesPanel />}
        {activeTab === "vendors" && <VendorsPanel />}
        {activeTab === "recurring" && <RecurringPanel />}
        {activeTab === "petty" && <PettyCashPanel />}
      </div>

      {/* Export Drawer */}
      <ExpenseExportDrawer
        open={exportOpen}
        onClose={() => setExportOpen(false)}
      />

      {/* View Expense Modal */}
      <ExpenseViewModal
        open={!!viewingExpense}
        onClose={() => setViewingExpense(null)}
        expense={viewingExpense}
        onEdit={(expense) => {
          setViewingExpense(null);
          handleEdit(expense);
        }}
      />

      <ExpenseFormModal
        open={formOpen}
        onClose={handleCloseForm}
        onSubmit={handleFormSubmit}
        initialData={editingExpense}
        categories={categoriesSimple ?? []}
        vendors={vendorsSimple ?? []}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};

export default ExpensesPage;
