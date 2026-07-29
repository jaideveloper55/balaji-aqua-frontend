import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Spin } from "antd";
import {
  HiOutlineCash,
  HiOutlinePlus,
  HiOutlineMinus,
  HiOutlineRefresh,
  HiOutlineCheckCircle,
  HiOutlineArrowDown,
  HiOutlineArrowUp,
  HiOutlineUser,
  HiOutlineClock,
} from "react-icons/hi";

import PettyCashModal from "./PettyCashModal";
import ReconcileModal from "./Reconcilemodal";
import {
  successNotification,
  errorNotification,
} from "../../../components/common/Notification";
import {
  getPettyCashBalanceApi,
  getPettyCashTransactionsApi,
  addPettyCashApi,
  spendPettyCashApi,
  reconcilePettyCashApi,
  type AddCashPayload,
  type SpendCashPayload,
} from "../api/Expenses.api";

const formatINR = (n: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n ?? 0);

const formatTime = (dateStr: string) =>
  new Date(dateStr).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

const formatReconciledTill = (dateStr: string | null): string => {
  if (!dateStr) return "Never";
  const date = new Date(dateStr);
  const now = new Date();
  const diffDays = Math.floor(
    (now.setHours(0, 0, 0, 0) - date.setHours(0, 0, 0, 0)) /
      (1000 * 60 * 60 * 24)
  );
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });
};

const PettyCashPanel = () => {
  const queryClient = useQueryClient();

  const [modalType, setModalType] = useState<"in" | "out" | null>(null);
  const [reconcileOpen, setReconcileOpen] = useState(false);

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const { data: balanceData, isLoading: isLoadingBalance } = useQuery({
    queryKey: ["petty-cash-balance"],
    queryFn: () => getPettyCashBalanceApi().then((res) => res.data),
    staleTime: 1000 * 30,
  });

  const { data: transactionsData, isLoading: isLoadingTransactions } = useQuery(
    {
      queryKey: ["petty-cash-transactions"],
      queryFn: () => getPettyCashTransactionsApi().then((res) => res.data),
      staleTime: 1000 * 30,
    }
  );

  const currentBalance = balanceData?.currentBalance ?? 0;
  const openingBalance = balanceData?.openingBalance ?? 0;
  const reconciledTill = balanceData?.reconciledTill ?? null;
  const todayCashIn = balanceData?.today?.cashIn ?? 0;
  const todayCashInCount = balanceData?.today?.cashInCount ?? 0;
  const todayCashOut = balanceData?.today?.cashOut ?? 0;
  const todayCashOutCount = balanceData?.today?.cashOutCount ?? 0;

  const transactions: any[] = transactionsData ?? [];

  const addCashMutation = useMutation({
    mutationFn: (data: AddCashPayload) =>
      addPettyCashApi(data).then((res) => res.data),
    onSuccess: (response) => {
      successNotification(
        "Cash Added",
        `${formatINR(response.amount)} added · Balance: ${formatINR(
          response.balanceAfter
        )}`
      );
      setModalType(null);
      // Refresh both queries — balance card + transaction log
      queryClient.invalidateQueries({ queryKey: ["petty-cash-balance"] });
      queryClient.invalidateQueries({ queryKey: ["petty-cash-transactions"] });
    },
    onError: (err: any) => {
      errorNotification(
        "Failed to Add Cash",
        err?.response?.data?.message ?? "Could not add cash"
      );
    },
  });

  const spendCashMutation = useMutation({
    mutationFn: (data: SpendCashPayload) =>
      spendPettyCashApi(data).then((res) => res.data),
    onSuccess: (response) => {
      successNotification(
        "Expense Recorded",
        `${formatINR(response.amount)} spent · Balance: ${formatINR(
          response.balanceAfter
        )}`
      );
      setModalType(null);
      queryClient.invalidateQueries({ queryKey: ["petty-cash-balance"] });
      queryClient.invalidateQueries({ queryKey: ["petty-cash-transactions"] });
    },
    onError: (err: any) => {
      errorNotification(
        "Insufficient Balance",
        err?.response?.data?.message ?? "Could not record expense"
      );
    },
  });

  const reconcileMutation = useMutation({
    mutationFn: () => reconcilePettyCashApi().then((res) => res.data),
    onSuccess: (response) => {
      successNotification(
        "Reconciled",
        `All transactions marked till ${formatReconciledTill(
          response.reconciledTill
        )}`
      );
      setReconcileOpen(false);
      queryClient.invalidateQueries({ queryKey: ["petty-cash-balance"] });
      queryClient.invalidateQueries({ queryKey: ["petty-cash-transactions"] });
    },
    onError: (err: any) => {
      errorNotification(
        "Reconcile Failed",
        err?.response?.data?.message ?? "Could not reconcile"
      );
    },
  });

  const handleModalSubmit = (data: AddCashPayload | SpendCashPayload) => {
    if (modalType === "in") {
      addCashMutation.mutate(data as AddCashPayload);
    } else {
      spendCashMutation.mutate(data as SpendCashPayload);
    }
  };

  const handleReconcile = () => {
    reconcileMutation.mutate();
  };

  const isModalSubmitting =
    addCashMutation.isPending || spendCashMutation.isPending;

  return (
    <>
      <div className="space-y-4">
        <Spin spinning={isLoadingBalance}>
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-3">
              <div className="lg:col-span-2 p-6 bg-gradient-to-br from-emerald-50 via-emerald-50 to-teal-50 border-b lg:border-b-0 lg:border-r border-emerald-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-200/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
                <div className="relative">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-xl bg-white shadow-sm">
                        <HiOutlineCash className="w-5 h-5 text-emerald-600" />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">
                          Current Cash Balance
                        </div>
                        <div className="text-xs text-slate-600 mt-0.5">
                          {today}
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setReconcileOpen(true)}
                      disabled={reconcileMutation.isPending}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-emerald-200 text-emerald-700 text-xs font-semibold hover:bg-emerald-50 transition-colors disabled:opacity-50"
                    >
                      <HiOutlineRefresh
                        className={`w-3.5 h-3.5 ${
                          reconcileMutation.isPending ? "animate-spin" : ""
                        }`}
                      />
                      Reconcile
                    </button>
                  </div>

                  <div className="mt-4">
                    <div className="text-5xl font-bold text-emerald-800 tracking-tight">
                      {formatINR(currentBalance)}
                    </div>
                    <div className="text-sm text-slate-600 mt-2">
                      Opening: {formatINR(openingBalance)} ·{" "}
                      <span className="text-emerald-700 font-semibold">
                        +{formatINR(todayCashIn)}
                      </span>{" "}
                      in,{" "}
                      <span className="text-rose-700 font-semibold">
                        −{formatINR(todayCashOut)}
                      </span>{" "}
                      out
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-4">
                    <button
                      type="button"
                      onClick={() => setModalType("in")}
                      className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg bg-emerald-600 text-white text-sm font-semibold shadow-md hover:bg-emerald-700 active:scale-95 transition-all"
                    >
                      <HiOutlinePlus className="w-4 h-4" />
                      Add Cash
                    </button>
                    <button
                      type="button"
                      onClick={() => setModalType("out")}
                      className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg bg-rose-600 text-white text-sm font-semibold shadow-md hover:bg-rose-700 active:scale-95 transition-all"
                    >
                      <HiOutlineMinus className="w-4 h-4" />
                      Spend Cash
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-5 space-y-3 bg-white">
                <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Today's Activity
                </div>

                <div className="rounded-xl bg-emerald-50 border border-emerald-100 p-3">
                  <div className="flex items-center gap-2">
                    <HiOutlineArrowDown className="w-4 h-4 text-emerald-600" />
                    <span className="text-xs font-semibold text-emerald-700">
                      Cash In
                    </span>
                  </div>
                  <div className="text-xl font-bold text-emerald-800 mt-1">
                    {formatINR(todayCashIn)}
                  </div>
                  <div className="text-[10px] text-emerald-600 mt-0.5">
                    {todayCashInCount}{" "}
                    {todayCashInCount === 1 ? "entry" : "entries"}
                  </div>
                </div>

                <div className="rounded-xl bg-rose-50 border border-rose-100 p-3">
                  <div className="flex items-center gap-2">
                    <HiOutlineArrowUp className="w-4 h-4 text-rose-600" />
                    <span className="text-xs font-semibold text-rose-700">
                      Cash Out
                    </span>
                  </div>
                  <div className="text-xl font-bold text-rose-800 mt-1">
                    {formatINR(todayCashOut)}
                  </div>
                  <div className="text-[10px] text-rose-600 mt-0.5">
                    {todayCashOutCount}{" "}
                    {todayCashOutCount === 1 ? "expense" : "expenses"}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">Reconciled till</span>
                    <span className="font-semibold text-slate-700 flex items-center gap-1">
                      <HiOutlineCheckCircle className="w-3 h-3 text-emerald-500" />
                      {formatReconciledTill(reconciledTill)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Spin>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Today's Cash Movements
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Real-time log of cash in & out
              </p>
            </div>
            <span className="text-xs text-slate-500">
              {transactions.length} transactions
            </span>
          </div>

          <Spin spinning={isLoadingTransactions} tip="Loading transactions...">
            <div className="divide-y divide-slate-100">
              {transactions.length === 0 && !isLoadingTransactions ? (
                <p className="text-sm text-slate-400 text-center py-10">
                  No transactions yet today
                </p>
              ) : (
                transactions.map((entry: any) => {
                  const isIn = entry.direction === "IN";
                  return (
                    <div
                      key={entry.id}
                      className="flex items-center gap-3 px-5 py-3 hover:bg-slate-50/50 transition-colors"
                    >
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                          isIn
                            ? "bg-emerald-50 border border-emerald-200 text-emerald-600"
                            : "bg-rose-50 border border-rose-200 text-rose-600"
                        }`}
                      >
                        {isIn ? (
                          <HiOutlineArrowDown className="w-5 h-5" />
                        ) : (
                          <HiOutlineArrowUp className="w-5 h-5" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-slate-900 text-sm truncate">
                          {entry.description}
                        </div>
                        <div className="text-xs text-slate-500 flex items-center gap-3 mt-0.5">
                          {entry.handledByName && (
                            <span className="flex items-center gap-1">
                              <HiOutlineUser className="w-3 h-3" />
                              {entry.handledByName}
                            </span>
                          )}
                          {entry.handledByName && <span>•</span>}
                          <span className="flex items-center gap-1">
                            <HiOutlineClock className="w-3 h-3" />

                            {formatTime(entry.txnDate)}
                          </span>
                          <span className="font-mono text-[10px] text-slate-400">
                            {entry.txnNo}
                          </span>
                        </div>
                      </div>

                      <div
                        className={`text-base font-bold shrink-0 ${
                          isIn ? "text-emerald-700" : "text-rose-700"
                        }`}
                      >
                        {isIn ? "+" : "−"}
                        {formatINR(entry.amount)}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </Spin>
        </div>
      </div>

      <PettyCashModal
        open={modalType !== null}
        onClose={() => setModalType(null)}
        type={modalType ?? "in"}
        onSubmit={handleModalSubmit}
        currentBalance={currentBalance}
        isSubmitting={isModalSubmitting}
      />

      <ReconcileModal
        open={reconcileOpen}
        onClose={() => setReconcileOpen(false)}
        systemBalance={currentBalance}
        onSubmit={handleReconcile}
        isSubmitting={reconcileMutation.isPending}
      />
    </>
  );
};

export default PettyCashPanel;
