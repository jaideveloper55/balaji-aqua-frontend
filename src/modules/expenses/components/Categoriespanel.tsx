// src/modules/expenses/components/CategoriesPanel.tsx

import { useState } from "react";
import {
  HiOutlineCog,
  HiOutlinePlusCircle,
  HiOutlineTrendingUp,
  HiOutlineTrendingDown,
} from "react-icons/hi";
import {
  EXPENSE_CATEGORIES,
  CATEGORY_META,
} from "../constants/Expenses.constants";
import BudgetModal from "./BudgetModal";

interface CategoryData {
  category: string;
  spent: number;
  budget: number;
  transactions: number;
  trend: number;
}

const INITIAL_DATA: CategoryData[] = [
  {
    category: "utilities",
    spent: 22500,
    budget: 25000,
    transactions: 4,
    trend: 8,
  },
  {
    category: "vehicle",
    spent: 18000,
    budget: 25000,
    transactions: 12,
    trend: -3,
  },
  {
    category: "plant_ops",
    spent: 14200,
    budget: 15000,
    transactions: 8,
    trend: 12,
  },
  { category: "rent", spent: 12000, budget: 12000, transactions: 1, trend: 0 },
  {
    category: "packaging",
    spent: 7800,
    budget: 10000,
    transactions: 6,
    trend: 5,
  },
  {
    category: "repairs",
    spent: 4500,
    budget: 8000,
    transactions: 3,
    trend: -10,
  },
  { category: "office", spent: 3200, budget: 5000, transactions: 9, trend: 2 },
  {
    category: "compliance",
    spent: 2300,
    budget: 5000,
    transactions: 2,
    trend: 0,
  },
  { category: "marketing", spent: 0, budget: 5000, transactions: 0, trend: 0 },
  { category: "loan", spent: 0, budget: 0, transactions: 0, trend: 0 },
];

const formatINR = (n: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);

const CategoriesPanel = () => {
  const [data, setData] = useState<CategoryData[]>(INITIAL_DATA);
  const [budgetModalOpen, setBudgetModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<CategoryData | null>(
    null
  );
  const [toast, setToast] = useState<string | null>(null);

  const totalBudget = data.reduce((s, c) => s + c.budget, 0);
  const totalSpent = data.reduce((s, c) => s + c.spent, 0);
  const utilization = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const openBudgetModal = (categoryData: CategoryData) => {
    setSelectedCategory(categoryData);
    setBudgetModalOpen(true);
  };

  const handleBudgetSave = (formData: { category: string; budget: number }) => {
    setData((prev) =>
      prev.map((c) =>
        c.category === formData.category ? { ...c, budget: formData.budget } : c
      )
    );
    const meta = CATEGORY_META[formData.category];
    showToast(
      `✓ Budget for ${meta.label} set to ${formatINR(formData.budget)}`
    );
  };

  const handleConfigureBudgets = () => {
    showToast("💡 Click any category card to set its budget");
  };

  return (
    <>
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl bg-slate-900 text-white text-sm font-semibold shadow-2xl animate-in slide-in-from-bottom-4">
          {toast}
        </div>
      )}

      <div className="space-y-4">
        {/* Top summary */}
        <div className="bg-gradient-to-br from-rose-50 via-rose-50 to-pink-50 border border-rose-200 rounded-2xl p-5">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <div className="text-xs font-semibold text-rose-700 uppercase tracking-wider">
                Monthly Budget Overview
              </div>
              <h3 className="text-lg font-bold text-slate-900 mt-1">
                {formatINR(totalSpent)} / {formatINR(totalBudget)}
              </h3>
              <p className="text-xs text-slate-600 mt-0.5">
                {utilization.toFixed(1)}% of monthly budget utilized
              </p>
            </div>
            <button
              type="button"
              onClick={handleConfigureBudgets}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-rose-200 text-rose-700 text-xs font-semibold shadow-sm hover:bg-rose-50 transition-colors"
            >
              <HiOutlineCog className="w-3.5 h-3.5" />
              Configure Budgets
            </button>
          </div>
          <div className="mt-4 h-2 rounded-full bg-white/60 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-rose-500 to-pink-500 transition-all duration-700"
              style={{ width: `${Math.min(utilization, 100)}%` }}
            />
          </div>
        </div>

        {/* Category cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          {data.map((row) => {
            const meta = CATEGORY_META[row.category];
            const cat = EXPENSE_CATEGORIES.find(
              (c) => c.value === row.category
            );
            const percent = row.budget > 0 ? (row.spent / row.budget) * 100 : 0;
            const isOver = percent > 100;
            const isCritical = percent >= 90 && percent <= 100;
            const isWarning = percent >= 75 && percent < 90;

            return (
              <div
                key={row.category}
                onClick={() => openBudgetModal(row)}
                className={`group bg-white rounded-2xl border overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer ${
                  isOver
                    ? "border-red-300"
                    : isCritical
                    ? "border-amber-300"
                    : "border-slate-200"
                }`}
              >
                <div className="p-4">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-12 h-12 rounded-xl ${meta.iconBg} border flex items-center justify-center text-2xl`}
                      >
                        {meta.icon}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900">
                          {meta.label}
                        </div>
                        <p className="text-[11px] text-slate-500 line-clamp-1">
                          {cat?.description}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        openBudgetModal(row);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 transition-all"
                      title="Edit budget"
                    >
                      <HiOutlineCog className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Spent amount */}
                  <div className="mb-3">
                    <div className="flex items-baseline justify-between">
                      <div>
                        <div className="text-xl font-bold text-slate-900">
                          {formatINR(row.spent)}
                        </div>
                        <div className="text-[10px] text-slate-500 mt-0.5">
                          of {formatINR(row.budget)} budget
                        </div>
                      </div>
                      {row.trend !== 0 && (
                        <span
                          className={`text-xs font-semibold flex items-center gap-0.5 ${
                            row.trend > 0 ? "text-rose-600" : "text-emerald-600"
                          }`}
                        >
                          {row.trend > 0 ? (
                            <HiOutlineTrendingUp className="w-3 h-3" />
                          ) : (
                            <HiOutlineTrendingDown className="w-3 h-3" />
                          )}
                          {Math.abs(row.trend)}%
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Progress */}
                  {row.budget > 0 && (
                    <div className="mb-3">
                      <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            isOver
                              ? "bg-red-500"
                              : isCritical
                              ? "bg-amber-500"
                              : isWarning
                              ? "bg-amber-400"
                              : "bg-emerald-500"
                          }`}
                          style={{ width: `${Math.min(percent, 100)}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-[10px] mt-1">
                        <span
                          className={`font-bold ${
                            isOver
                              ? "text-red-700"
                              : isCritical
                              ? "text-amber-700"
                              : "text-slate-600"
                          }`}
                        >
                          {percent.toFixed(0)}% used
                        </span>
                        <span
                          className={`font-medium ${
                            isOver ? "text-red-600" : "text-slate-500"
                          }`}
                        >
                          {isOver
                            ? `Over by ${formatINR(row.spent - row.budget)}`
                            : `${formatINR(row.budget - row.spent)} left`}
                        </span>
                      </div>
                    </div>
                  )}

                  {row.budget === 0 && (
                    <div className="mb-3 px-3 py-2 rounded-lg bg-slate-50 text-xs text-slate-500 text-center border border-dashed border-slate-200">
                      No budget set — click to configure
                    </div>
                  )}

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-3 border-t border-dashed border-slate-200 text-xs">
                    <span className="text-slate-500">
                      <span className="font-bold text-slate-900">
                        {row.transactions}
                      </span>{" "}
                      transaction{row.transactions !== 1 ? "s" : ""}
                    </span>
                    <span className="text-rose-600 font-semibold group-hover:text-rose-700">
                      Configure →
                    </span>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Add category card */}
          <button
            type="button"
            onClick={() => showToast("💡 Custom categories coming in Phase 2")}
            className="bg-white rounded-2xl border-2 border-dashed border-slate-200 p-4 hover:border-rose-300 hover:bg-rose-50/30 transition-all flex flex-col items-center justify-center min-h-[200px] group"
          >
            <div className="p-3 rounded-2xl bg-slate-100 group-hover:bg-rose-100 transition-colors mb-2">
              <HiOutlinePlusCircle className="w-6 h-6 text-slate-400 group-hover:text-rose-600 transition-colors" />
            </div>
            <div className="text-sm font-semibold text-slate-700 group-hover:text-rose-700">
              Add Custom Category
            </div>
            <div className="text-xs text-slate-500 mt-1">
              Create your own expense bucket
            </div>
          </button>
        </div>
      </div>

      <BudgetModal
        open={budgetModalOpen}
        onClose={() => setBudgetModalOpen(false)}
        onSubmit={handleBudgetSave}
        category={selectedCategory?.category || null}
        currentBudget={selectedCategory?.budget || 0}
        currentSpent={selectedCategory?.spent || 0}
      />
    </>
  );
};

export default CategoriesPanel;
