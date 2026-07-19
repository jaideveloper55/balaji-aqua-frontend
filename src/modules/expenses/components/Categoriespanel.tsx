import React, { useState } from "react";
import {
  HiOutlineCog,
  HiOutlinePlus,
  HiOutlineTrendingUp,
  HiOutlineTrendingDown,
} from "react-icons/hi";
import Configurebudgetmodal, { BudgetFormValues } from "./Configurebudgetmodal";

import type { ExpenseCategory } from "../types/Expenses";
import { successNotification } from "../../../components/common/Notification";
import {
  MOCK_CATEGORIES,
  MONTHLY_BUDGET,
} from "../constants/Expensecategorydata";

const inr = (n: number) =>
  `₹${new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(
    n ?? 0
  )}`;

const Categoriespanel: React.FC = () => {
  const [categories] = useState<ExpenseCategory[]>(MOCK_CATEGORIES);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<ExpenseCategory | null>(
    null
  );
  const [isCustom, setIsCustom] = useState(false);

  const budgetPct = Math.round(
    (MONTHLY_BUDGET.spent / MONTHLY_BUDGET.total) * 100
  );

  const openConfigure = (cat: ExpenseCategory) => {
    setActiveCategory(cat);
    setIsCustom(false);
    setModalOpen(true);
  };

  const openAddCustom = () => {
    setActiveCategory(null);
    setIsCustom(true);
    setModalOpen(true);
  };

  const handleSubmit = (values: BudgetFormValues) => {
    successNotification(
      isCustom ? "Category Created" : "Budget Saved",
      isCustom
        ? `${values.name} added with ${inr(
            Number(values.monthlyBudget)
          )} budget`
        : `${activeCategory?.name} budget set to ${inr(
            Number(values.monthlyBudget)
          )}`
    );
    setModalOpen(false);
  };

  const usedColor = (pct: number) =>
    pct >= 95 ? "#dc2626" : pct >= 80 ? "#d97706" : "#059669";

  return (
    <div className="space-y-5">
      {/* Monthly budget overview */}
      <div className="rounded-2xl border border-rose-100 bg-gradient-to-r from-rose-50 to-rose-50/40 p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[12px] font-bold text-rose-600 uppercase tracking-wide mb-2">
              Monthly Budget Overview
            </p>
            <p className="text-[26px] font-extrabold text-slate-900 leading-none">
              {inr(MONTHLY_BUDGET.spent)}{" "}
              <span className="text-slate-400 font-semibold text-[18px]">
                / {inr(MONTHLY_BUDGET.total)}
              </span>
            </p>
            <p className="text-[13px] text-slate-500 mt-1.5">
              {budgetPct}% of monthly budget utilized
            </p>
          </div>
          <button
            onClick={() => {
              setActiveCategory(null);
              setIsCustom(false);
              setModalOpen(true);
            }}
            className="inline-flex items-center gap-2 px-4 h-10 rounded-xl border border-rose-200 bg-white text-rose-600 text-[13px] font-semibold hover:bg-rose-50"
          >
            <HiOutlineCog size={16} /> Configure Budgets
          </button>
        </div>
        <div className="mt-4 h-2.5 rounded-full bg-white/60 overflow-hidden">
          <div
            className="h-full rounded-full transition-all"
            style={{ width: `${budgetPct}%`, background: usedColor(budgetPct) }}
          />
        </div>
      </div>

      {/* Category cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {categories.map((cat) => {
          const pct =
            cat.budget > 0 ? Math.round((cat.spent / cat.budget) * 100) : 0;
          const left = Math.max(0, cat.budget - cat.spent);
          const barColor = usedColor(pct);
          const isOverBudget = pct >= 100;
          const noBudget = cat.budget === 0;

          return (
            <div
              key={cat.id}
              className={`bg-white rounded-2xl border p-5 transition-all hover:shadow-md ${
                pct >= 95 ? "border-amber-300" : "border-slate-200"
              }`}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: cat.bg, color: cat.color }}
                  >
                    {cat.icon}
                  </div>
                  <div>
                    <h3 className="text-[15px] font-bold text-slate-900">
                      {cat.name}
                    </h3>
                    <p className="text-[12px] text-slate-500">
                      {cat.description}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => openConfigure(cat)}
                  className="text-slate-300 hover:text-slate-500 p-1"
                >
                  <HiOutlineCog size={18} />
                </button>
              </div>

              {/* Amount + trend */}
              <div className="flex items-end justify-between mb-1">
                <div>
                  <p className="text-[24px] font-extrabold text-slate-900 leading-none">
                    {inr(cat.spent)}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    of {inr(cat.budget)} budget
                  </p>
                </div>
                {cat.trend !== 0 && (
                  <span
                    className={`inline-flex items-center gap-0.5 text-[12px] font-semibold ${
                      cat.trend > 0 ? "text-rose-500" : "text-emerald-500"
                    }`}
                  >
                    {cat.trend > 0 ? (
                      <HiOutlineTrendingUp size={14} />
                    ) : (
                      <HiOutlineTrendingDown size={14} />
                    )}
                    {Math.abs(cat.trend)}%
                  </span>
                )}
              </div>

              {/* Progress */}
              {noBudget ? (
                <button
                  onClick={() => openConfigure(cat)}
                  className="w-full mt-3 py-2.5 rounded-lg border border-dashed border-slate-200 text-[12px] text-slate-400 hover:border-rose-300 hover:text-rose-500"
                >
                  No budget set — click to configure
                </button>
              ) : (
                <>
                  <div className="mt-3 h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${Math.min(100, pct)}%`,
                        background: barColor,
                      }}
                    />
                  </div>
                  <div className="flex items-center justify-between mt-1.5">
                    <span
                      className="text-[11px] font-semibold"
                      style={{ color: barColor }}
                    >
                      {pct}% used
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {isOverBudget ? "₹0 left" : `${inr(left)} left`}
                    </span>
                  </div>
                </>
              )}

              {/* Footer */}
              <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100">
                <span className="text-[12px] text-slate-500">
                  <span className="font-semibold text-slate-700">
                    {cat.transactions}
                  </span>{" "}
                  transaction{cat.transactions === 1 ? "" : "s"}
                </span>
                <button
                  onClick={() => openConfigure(cat)}
                  className="text-[12px] font-semibold text-rose-600 hover:underline flex items-center gap-1"
                >
                  Configure →
                </button>
              </div>
            </div>
          );
        })}

        {/* Add custom category tile */}
        <button
          onClick={openAddCustom}
          className="rounded-2xl border-2 border-dashed border-slate-200 hover:border-rose-300 hover:bg-rose-50/30 transition-all flex flex-col items-center justify-center gap-2 p-8 min-h-[220px]"
        >
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
            <HiOutlinePlus size={22} />
          </div>
          <p className="text-[15px] font-bold text-slate-700">
            Add Custom Category
          </p>
          <p className="text-[12px] text-slate-400">
            Create your own expense bucket
          </p>
        </button>
      </div>

      {/* Modal */}
      <Configurebudgetmodal
        open={modalOpen}
        category={activeCategory}
        isCustom={isCustom}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default Categoriespanel;
