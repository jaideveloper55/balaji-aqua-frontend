import { useState } from "react";
import { Input, Select } from "antd";
import {
  HiOutlineSearch,
  HiOutlineFilter,
  HiOutlineRefresh,
  HiOutlineEye,
  HiOutlinePencilAlt,
  HiOutlineDocumentText,
  HiOutlineDotsVertical,
  HiOutlinePaperClip,
  HiOutlinePlus,
} from "react-icons/hi";
import {
  CATEGORY_META,
  PAYMENT_MODE_META,
  STATUS_META,
  EXPENSE_CATEGORIES,
  EXPENSE_STATUS,
  PAYMENT_MODES,
} from "../constants/Expenses.constants";
import ExpenseFormModal from "./Expenseformmodal";

interface ExpenseRow {
  id: string;
  expenseNumber: string;
  date: string;
  category: string;
  vendor: string;
  description: string;
  amount: number;
  gst: number;
  total: number;
  paymentMode: string;
  status: string;
  hasReceipt: boolean;
  paidBy?: string;
}

const INITIAL_EXPENSES: ExpenseRow[] = [
  {
    id: "1",
    expenseNumber: "EXP-2026-042",
    date: "2026-05-04",
    category: "utilities",
    vendor: "TN Electricity Board",
    description: "Monthly electricity bill — April",
    amount: 16500,
    gst: 2000,
    total: 18500,
    paymentMode: "bank",
    status: "paid",
    hasReceipt: true,
    paidBy: "Devaa Balaji",
  },
  {
    id: "2",
    expenseNumber: "EXP-2026-041",
    date: "2026-05-04",
    category: "vehicle",
    vendor: "Indian Oil Pump",
    description: "Diesel for delivery vehicle TN 09 AB 1234",
    amount: 3200,
    gst: 0,
    total: 3200,
    paymentMode: "upi",
    status: "paid",
    hasReceipt: true,
    paidBy: "Suresh M.",
  },
  {
    id: "3",
    expenseNumber: "EXP-2026-040",
    date: "2026-05-03",
    category: "plant_ops",
    vendor: "Murugan Salt Suppliers",
    description: "Industrial salt for RO plant — 500kg",
    amount: 4280,
    gst: 220,
    total: 4500,
    paymentMode: "cash",
    status: "approved",
    hasReceipt: true,
    paidBy: "Rajesh K.",
  },
  {
    id: "4",
    expenseNumber: "EXP-2026-039",
    date: "2026-05-03",
    category: "packaging",
    vendor: "Saravanan Caps & Seals",
    description: "Bottle caps (500 units) + shrink wrap",
    amount: 2700,
    gst: 100,
    total: 2800,
    paymentMode: "upi",
    status: "pending",
    hasReceipt: false,
  },
  {
    id: "5",
    expenseNumber: "EXP-2026-038",
    date: "2026-05-02",
    category: "repairs",
    vendor: "Plant Maintenance — Kumar",
    description: "RO membrane replacement labor",
    amount: 1500,
    gst: 0,
    total: 1500,
    paymentMode: "cash",
    status: "paid",
    hasReceipt: false,
    paidBy: "Devaa Balaji",
  },
  {
    id: "6",
    expenseNumber: "EXP-2026-037",
    date: "2026-05-01",
    category: "rent",
    vendor: "Sundaram Property",
    description: "Plant rent for May 2026",
    amount: 12000,
    gst: 0,
    total: 12000,
    paymentMode: "bank",
    status: "paid",
    hasReceipt: true,
    paidBy: "Devaa Balaji",
  },
  {
    id: "7",
    expenseNumber: "EXP-2026-036",
    date: "2026-04-30",
    category: "office",
    vendor: "Local Stationery",
    description: "Bills, receipts, and office supplies",
    amount: 850,
    gst: 0,
    total: 850,
    paymentMode: "cash",
    status: "paid",
    hasReceipt: false,
    paidBy: "Divya B.",
  },
];

const formatINR = (n: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);

const formatDate = (s: string) => {
  return new Date(s).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const AllExpensesPanel = () => {
  const [expenses, setExpenses] = useState<ExpenseRow[]>(INITIAL_EXPENSES);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [paymentFilter, setPaymentFilter] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<ExpenseRow | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const filtered = expenses.filter((e) => {
    if (categoryFilter && e.category !== categoryFilter) return false;
    if (statusFilter && e.status !== statusFilter) return false;
    if (paymentFilter && e.paymentMode !== paymentFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        e.vendor.toLowerCase().includes(q) ||
        e.description.toLowerCase().includes(q) ||
        e.expenseNumber.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const reset = () => {
    setSearch("");
    setCategoryFilter(null);
    setStatusFilter(null);
    setPaymentFilter(null);
  };

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleAdd = () => {
    setEditingExpense(null);
    setFormOpen(true);
  };

  const handleEdit = (expense: ExpenseRow) => {
    setEditingExpense(expense);
    setFormOpen(true);
  };

  const handleSave = (data: any) => {
    if (editingExpense) {
      // Update existing
      setExpenses((prev) =>
        prev.map((e) => (e.id === editingExpense.id ? { ...e, ...data } : e))
      );
      showToast("✓ Expense updated successfully");
    } else {
      // Add new
      const nextNum = String(expenses.length + 43).padStart(3, "0");
      const newExpense: ExpenseRow = {
        id: String(Date.now()),
        expenseNumber: `EXP-2026-${nextNum}`,
        date: data.date,
        category: data.category,
        vendor: data.vendor,
        description: data.description,
        amount: data.amount,
        gst: data.gst,
        total: data.total,
        paymentMode: data.paymentMode,
        status: data.status || "draft",
        hasReceipt: false,
        paidBy: data.paidBy,
      };
      setExpenses((prev) => [newExpense, ...prev]);
      showToast(`✓ Expense added: ${formatINR(data.total)}`);
    }
  };

  const total = filtered.reduce((s, e) => s + e.total, 0);
  const hasFilters =
    !!search || !!categoryFilter || !!statusFilter || !!paymentFilter;

  return (
    <>
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl bg-slate-900 text-white text-sm font-semibold shadow-2xl animate-in slide-in-from-bottom-4">
          {toast}
        </div>
      )}

      <div className="space-y-4">
        {/* Filter bar */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <HiOutlineFilter className="w-3.5 h-3.5" />
              Filters
            </div>
            <div className="flex items-center gap-3">
              <div className="text-xs text-slate-500">
                <span className="font-semibold text-slate-900">
                  {filtered.length}
                </span>{" "}
                results · Total:{" "}
                <span className="font-semibold text-rose-600">
                  {formatINR(total)}
                </span>
              </div>
              <button
                type="button"
                onClick={handleAdd}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-600 text-white text-xs font-semibold shadow-sm hover:bg-rose-700 transition-colors"
              >
                <HiOutlinePlus className="w-3.5 h-3.5" />
                Add Expense
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
            <div className="md:col-span-4">
              <Input
                size="large"
                placeholder="Search vendor, description, number..."
                prefix={<HiOutlineSearch className="text-slate-400" />}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                allowClear
              />
            </div>
            <div className="md:col-span-3">
              <Select
                size="large"
                placeholder="All Categories"
                className="w-full"
                allowClear
                value={categoryFilter}
                onChange={(v) => setCategoryFilter(v ?? null)}
                options={EXPENSE_CATEGORIES.map((c) => ({
                  value: c.value,
                  label: `${c.icon}  ${c.label}`,
                }))}
              />
            </div>
            <div className="md:col-span-2">
              <Select
                size="large"
                placeholder="All Status"
                className="w-full"
                allowClear
                value={statusFilter}
                onChange={(v) => setStatusFilter(v ?? null)}
                options={EXPENSE_STATUS.map((s) => ({
                  value: s.value,
                  label: s.label,
                }))}
              />
            </div>
            <div className="md:col-span-2">
              <Select
                size="large"
                placeholder="Payment Mode"
                className="w-full"
                allowClear
                value={paymentFilter}
                onChange={(v) => setPaymentFilter(v ?? null)}
                options={PAYMENT_MODES.map((p) => ({
                  value: p.value,
                  label: `${p.icon}  ${p.label}`,
                }))}
              />
            </div>
            <div className="md:col-span-1">
              <button
                type="button"
                onClick={reset}
                disabled={!hasFilters}
                className={`w-full h-10 rounded-lg border text-sm font-medium flex items-center justify-center gap-1.5 transition-all ${
                  hasFilters
                    ? "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                    : "bg-slate-50 border-slate-100 text-slate-300 cursor-not-allowed"
                }`}
              >
                <HiOutlineRefresh className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Expense list */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="hidden lg:grid grid-cols-12 gap-3 px-4 py-3 bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-700 uppercase tracking-wider">
            <div className="col-span-1">Date</div>
            <div className="col-span-3">Vendor / Description</div>
            <div className="col-span-2">Category</div>
            <div className="col-span-2 text-right">Amount</div>
            <div className="col-span-1">Payment</div>
            <div className="col-span-1">Status</div>
            <div className="col-span-1">Receipt</div>
            <div className="col-span-1 text-center">Actions</div>
          </div>

          {filtered.map((e) => {
            const cat = CATEGORY_META[e.category];
            const pay = PAYMENT_MODE_META[e.paymentMode];
            const status = STATUS_META[e.status];

            return (
              <div
                key={e.id}
                className="grid grid-cols-1 lg:grid-cols-12 gap-3 px-4 py-3 items-center border-b border-slate-100 last:border-0 hover:bg-slate-50/50 transition-colors group"
              >
                {/* Date */}
                <div className="lg:col-span-1">
                  <div className="text-xs font-semibold text-slate-900">
                    {formatDate(e.date).split(" ")[0]}
                  </div>
                  <div className="text-[10px] text-slate-500">
                    {formatDate(e.date).split(" ").slice(1).join(" ")}
                  </div>
                </div>

                {/* Vendor */}
                <div className="lg:col-span-3 min-w-0">
                  <div className="font-semibold text-slate-900 text-sm truncate">
                    {e.vendor}
                  </div>
                  <div className="text-xs text-slate-500 truncate">
                    {e.description}
                  </div>
                  <div className="text-[10px] font-mono text-slate-400 mt-0.5">
                    {e.expenseNumber}
                  </div>
                </div>

                {/* Category */}
                <div className="lg:col-span-2">
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md border text-xs font-semibold ${cat.bg} ${cat.color}`}
                  >
                    {cat.icon} {cat.label}
                  </span>
                </div>

                {/* Amount */}
                <div className="lg:col-span-2 lg:text-right">
                  <div className="text-base font-bold text-rose-600">
                    −{formatINR(e.total)}
                  </div>
                  {e.gst > 0 && (
                    <div className="text-[10px] text-slate-400">
                      incl. {formatINR(e.gst)} GST
                    </div>
                  )}
                </div>

                {/* Payment */}
                <div className="lg:col-span-1">
                  <span
                    className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold border ${pay.bg} ${pay.color}`}
                  >
                    {pay.icon} {pay.label}
                  </span>
                </div>

                {/* Status */}
                <div className="lg:col-span-1">
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px] font-bold ${status.bg} ${status.color}`}
                  >
                    <span className={`w-1 h-1 rounded-full ${status.dot}`} />
                    {status.label}
                  </span>
                </div>

                {/* Receipt */}
                <div className="lg:col-span-1">
                  {e.hasReceipt ? (
                    <button className="flex items-center gap-1 text-xs text-emerald-600 hover:text-emerald-700 transition-colors">
                      <HiOutlinePaperClip className="w-3.5 h-3.5" />
                      <span className="hidden xl:inline">View</span>
                    </button>
                  ) : (
                    <span className="text-xs text-slate-300 flex items-center gap-1">
                      <HiOutlinePaperClip className="w-3.5 h-3.5" />
                      None
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="lg:col-span-1 flex items-center lg:justify-center gap-0.5">
                  <button
                    type="button"
                    className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
                    title="View"
                  >
                    <HiOutlineEye className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleEdit(e)}
                    className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
                    title="Edit"
                  >
                    <HiOutlinePencilAlt className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
                    title="More"
                  >
                    <HiOutlineDotsVertical className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}

          {filtered.length === 0 && (
            <div className="p-12 text-center">
              <div className="inline-flex p-4 rounded-2xl bg-slate-50 mb-3">
                <HiOutlineDocumentText className="w-7 h-7 text-slate-400" />
              </div>
              <h3 className="text-base font-semibold text-slate-700">
                No expenses found
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Try adjusting filters or add a new expense.
              </p>
              <button
                type="button"
                onClick={handleAdd}
                className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-rose-600 text-white text-sm font-semibold hover:bg-rose-700 transition-colors"
              >
                <HiOutlinePlus className="w-4 h-4" />
                Add First Expense
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Form modal */}
      <ExpenseFormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSave}
        initialData={editingExpense}
      />
    </>
  );
};

export default AllExpensesPanel;
