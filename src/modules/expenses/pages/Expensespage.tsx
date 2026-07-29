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
  type ExpenseFilters,
  type CreateExpensePayload,
  type UpdateExpensePayload,
} from "../api/Expenses.api";

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

  //  Expense stats
  const { data: expenseStats, isLoading: isLoadingStats } = useQuery({
    queryKey: ["expense-stats"],
    queryFn: () => getExpenseStatsApi().then((res) => res.data),
    staleTime: 1000 * 60 * 5,
  });

  //  Categories list
  const { data: categoriesSimple } = useQuery({
    queryKey: ["categories-simple"],
    queryFn: () => getCategoriesSimpleApi().then((res) => res.data),
    staleTime: 1000 * 60 * 10,
  });

  // Vendors list
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

  // Create expense
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

  //  Update expense
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

  // Delete expense
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
      updateExpenseMutation.mutate({
        id: editingExpense.id,
        data: formData,
      });
    } else {
      createExpenseMutation.mutate(formData);
    }
  };

  const handleEdit = (expense: any) => {
    setEditingExpense(expense);
    setFormOpen(true);
  };

  const handleView = (expense: any) => {
    console.log("View expense:", expense.expenseNo);
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
    successNotification("Export", "Exporting expense data...");
  };

  const handleCloseForm = () => {
    setFormOpen(false);
    setEditingExpense(null);
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

      <Spin spinning={isLoadingStats} tip="Loading stats...">
        <ExpenseStatCards
          totalThisMonth={expenseStats?.totalThisMonth}
          invoiceCount={expenseStats?.invoiceCount}
          trendPercent={expenseStats?.trendPercent}
          pendingApproval={expenseStats?.pendingApproval}
          topCategory={expenseStats?.topCategory}
          cashPercent={expenseStats?.cashPercent}
          digitalPercent={expenseStats?.digitalPercent}
        />
      </Spin>

      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm overflow-x-auto">
        <CustomTabs
          items={TABS}
          activeKey={activeTab}
          onChange={setActiveTab}
          accentColor="#e11d48"
          className="min-w-[700px]"
        />
      </div>

      <div>
        {/* OVERVIEW  */}
        {activeTab === "overview" && <OverviewPanel />}

        {/* ALL EXPENSES */}
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

        {/* CATEGORIES  */}
        {activeTab === "categories" && <CategoriesPanel />}

        {/* VENDORS  */}
        {activeTab === "vendors" && <VendorsPanel />}

        {/* RECURRING */}
        {activeTab === "recurring" && <RecurringPanel />}

        {/* PETTY CASH  */}
        {activeTab === "petty" && <PettyCashPanel />}
      </div>

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
