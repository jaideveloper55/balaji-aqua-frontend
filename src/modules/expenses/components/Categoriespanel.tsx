import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Spin } from "antd";
import {
  HiOutlineCog,
  HiOutlinePlus,
  HiOutlineTrendingUp,
  HiOutlineTrendingDown,
} from "react-icons/hi";

import Configurebudgetmodal from "./Configurebudgetmodal";
import type { BudgetFormValues } from "./Configurebudgetmodal";
import {
  successNotification,
  errorNotification,
} from "../../../components/common/Notification";
import {
  getCategoriesApi,
  getCategoryOverviewApi,
  createCategoryApi,
  updateCategoryApi,
  type UpdateCategoryPayload,
  type CreateCategoryPayload,
} from "../api/Expenses.api";

const inr = (n: number) =>
  `₹${new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(
    n ?? 0
  )}`;

const usedColor = (pct: number) =>
  pct >= 95 ? "#dc2626" : pct >= 80 ? "#d97706" : "#059669";

const Categoriespanel: React.FC = () => {
  const queryClient = useQueryClient();

  const [modalOpen, setModalOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<any | null>(null);
  const [isCustom, setIsCustom] = useState(false);

  const { data: categoriesData, isLoading: isLoadingCategories } = useQuery({
    queryKey: ["categories"],
    queryFn: () => getCategoriesApi().then((res) => res.data),
    staleTime: 1000 * 60 * 5,
  });

  const { data: overviewData, isLoading: isLoadingOverview } = useQuery({
    queryKey: ["category-overview"],
    queryFn: () => getCategoryOverviewApi().then((res) => res.data),
    staleTime: 1000 * 60 * 5,
  });

  const categories = categoriesData ?? [];

  const totalBudget = overviewData?.totalBudget ?? 0;
  const totalSpent = overviewData?.totalSpent ?? 0;
  const budgetPct =
    totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0;

  const updateCategoryMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCategoryPayload }) =>
      updateCategoryApi(id, data).then((res) => res.data),
    onSuccess: (response) => {
      successNotification(
        "Budget Saved",
        `${response.name} budget set to ${inr(response.monthlyBudget ?? 0)}`
      );
      setModalOpen(false);
      setActiveCategory(null);
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["category-overview"] });
    },
    onError: (err: any) => {
      errorNotification(
        "Save Failed",
        err?.response?.data?.message ?? "Could not save budget"
      );
    },
  });

  const createCategoryMutation = useMutation({
    mutationFn: (data: CreateCategoryPayload) =>
      createCategoryApi(data).then((res) => res.data),
    onSuccess: (response) => {
      successNotification(
        "Category Created",
        `${response.name} added with ${inr(response.monthlyBudget ?? 0)} budget`
      );
      setModalOpen(false);
      setActiveCategory(null);

      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["categories-simple"] });
      queryClient.invalidateQueries({ queryKey: ["category-overview"] });
    },
    onError: (err: any) => {
      errorNotification(
        "Create Failed",
        err?.response?.data?.message ?? "Could not create category"
      );
    },
  });

  const openConfigure = (cat: any) => {
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
    if (isCustom) {
      createCategoryMutation.mutate({
        name: values.name ?? "",
        monthlyBudget: Number(values.monthlyBudget) || undefined,
        alertThreshold: values.alertThreshold
          ? Number(values.alertThreshold)
          : undefined,
        rolloverRule: values.rolloverRule as any,
      });
    } else {
      updateCategoryMutation.mutate({
        id: activeCategory.id,
        data: {
          monthlyBudget: Number(values.monthlyBudget) || undefined,
          alertThreshold: values.alertThreshold
            ? Number(values.alertThreshold)
            : undefined,
          rolloverRule: values.rolloverRule as any,
        },
      });
    }
  };

  const isSubmitting =
    createCategoryMutation.isPending || updateCategoryMutation.isPending;

  return (
    <div className="space-y-5">
      <Spin spinning={isLoadingOverview}>
        <div className="rounded-2xl border border-rose-100 bg-gradient-to-r from-rose-50 to-rose-50/40 p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[12px] font-bold text-rose-600 uppercase tracking-wide mb-2">
                Monthly Budget Overview
              </p>
              <p className="text-[26px] font-extrabold text-slate-900 leading-none">
                {inr(totalSpent)}{" "}
                <span className="text-slate-400 font-semibold text-[18px]">
                  / {inr(totalBudget)}
                </span>
              </p>
              <p className="text-[13px] text-slate-500 mt-1.5">
                {budgetPct}% of monthly budget utilized
              </p>
            </div>
            <button
              onClick={openAddCustom}
              className="inline-flex items-center gap-2 px-4 h-10 rounded-xl border border-rose-200 bg-white text-rose-600 text-[13px] font-semibold hover:bg-rose-50"
            >
              <HiOutlineCog size={16} /> Configure Budgets
            </button>
          </div>
          <div className="mt-4 h-2.5 rounded-full bg-white/60 overflow-hidden">
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${Math.min(budgetPct, 100)}%`,
                background: usedColor(budgetPct),
              }}
            />
          </div>
        </div>
      </Spin>

      {/* Category cards grid */}
      <Spin spinning={isLoadingCategories} tip="Loading categories...">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {categories.length === 0 && !isLoadingCategories && (
            <div className="col-span-full text-center py-12 text-slate-400 text-sm">
              No categories yet — add one below
            </div>
          )}

          {categories.map((cat: any) => {
            const spent = cat.spentThisMonth ?? 0;
            const budget = cat.monthlyBudget ?? 0;
            const pct = budget > 0 ? Math.round((spent / budget) * 100) : 0;
            const left = Math.max(0, budget - spent);
            const barColor = usedColor(pct);
            const isOverBudget = pct >= 100;
            const noBudget = budget === 0;

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
                      className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 text-lg"
                      style={{
                        background: cat.bg ?? "#f1f5f9",
                        color: cat.color ?? "#64748b",
                      }}
                    >
                      {/* icon from backend or fallback emoji */}
                      {cat.icon ?? "📦"}
                    </div>
                    <div>
                      <h3 className="text-[15px] font-bold text-slate-900">
                        {cat.name}
                      </h3>
                      <p className="text-[12px] text-slate-500">
                        {cat.description ?? ""}
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
                      {inr(spent)}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-1">
                      of {budget > 0 ? inr(budget) : "no budget"} budget
                    </p>
                  </div>
                  {/* trend — shown if backend returns it */}
                  {cat.trend != null && cat.trend !== 0 && (
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

                {/* Progress bar or "set budget" prompt */}
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
                      {cat.transactions ?? 0}
                    </span>{" "}
                    transaction{(cat.transactions ?? 0) === 1 ? "" : "s"}
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
      </Spin>

      <Configurebudgetmodal
        open={modalOpen}
        category={activeCategory}
        isCustom={isCustom}
        onClose={() => {
          setModalOpen(false);
          setActiveCategory(null);
        }}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};

export default Categoriespanel;
