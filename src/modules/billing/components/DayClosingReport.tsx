import React, { forwardRef } from "react";
import dayjs from "dayjs";
import { PaymentEntry } from "../types/billing";
import { formatCurrency } from "../utils/Helpers";
import CustomModal from "../../../components/common/CustomModal";
import { HiOutlineMoon, HiOutlinePrinter, HiOutlineCash } from "react-icons/hi";
import { HiBanknotes, HiMiniQrCode, HiBuildingLibrary } from "react-icons/hi2";

interface ExpenseRow {
  id: string;
  expenseNo: string;
  vendorName: string;
  description: string;
  categoryName: string;
  amount: number;
  paymentMode: string;
}

export interface PettyCashRow {
  id: string;
  txnNo: string;
  description: string;
  amount: number;
  handledByName?: string | null;
}

interface CustomerSummary {
  name: string;
  totalAmount: number;
  cashAmount: number;
  upiAmount: number;
  bankAmount: number;
  creditAmount: number;
  invoiceCount: number;
}

// NEW — one row per product sold today. Sourced from InvoiceItem, which
// already snapshots productName/sku/unit/quantity/lineTotal on every sale
// line, so this is an aggregation of data you already store, not a new
// data source.
export interface ProductSummary {
  productName: string;
  sku: string;
  unit: string;
  quantitySold: number;
  invoiceCount: number; // how many of today's invoices included this product
  totalAmount: number;
}

export interface DayClosingData {
  date: string;
  companyName?: string;
  invoiceCount: number;
  totalBilled: number;
  creditSales: number;
  cashCollected: number;
  upiCollected: number;
  bankCollected: number;
  totalCollected: number;
  totalOutstanding: number;
  expenses: ExpenseRow[];
  totalExpenses: number;
  cashExpenses: number;
  pettyCashExpenses: PettyCashRow[];
  totalPettyCashOut: number;
  customerBreakdown: CustomerSummary[];
  productBreakdown: ProductSummary[]; // NEW
  payments: PaymentEntry[];
}

interface Props {
  open: boolean;
  data: DayClosingData;
  onClose: () => void;
  onPrint: () => void;
}

/* ── Component ─────────────────────────────────────────────────────── */

const DayClosingReport = forwardRef<HTMLDivElement, Props>(
  ({ open, data, onClose, onPrint }, ref) => {
    // Petty cash is always cash (no paymentMode on that model — it's a physical box),
    // so it's deducted alongside cash expenses, but shown as its own line since it
    // comes from a different source than the Expenses tab.
    const netCashInHand =
      data.cashCollected - data.cashExpenses - data.totalPettyCashOut;
    const formattedDate = dayjs(data.date).format("DD MMM YYYY, dddd");

    return (
      <CustomModal
        open={open}
        onClose={onClose}
        title="Day Closing Report"
        subtitle={`${data.companyName ?? ""} — ${formattedDate}`}
        icon={<HiOutlineMoon className="w-5 h-5" />}
        iconTone="slate"
        size="4xl"
        footer={
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-gray-400">
              Generated at {dayjs().format("hh:mm A")}
            </span>
            <div className="flex gap-2">
              <button
                onClick={onClose}
                className="px-4 py-2 text-[13px] font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
              <button
                onClick={onPrint}
                className="px-4 py-2 text-[13px] font-semibold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2"
              >
                <HiOutlinePrinter className="w-4 h-4" />
                Print Report
              </button>
            </div>
          </div>
        }
      >
        <div ref={ref} className="space-y-6">
          {/* ── Sales & Collection Summary ──────────────────────── */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <SectionHeader label="Sales Summary" />
              <div className="space-y-2">
                <SummaryRow
                  label="Invoices Generated"
                  value={String(data.invoiceCount)}
                />
                <SummaryRow
                  label="Total Billed"
                  value={formatCurrency(data.totalBilled)}
                  bold
                />
                <SummaryRow
                  label="Credit Sales"
                  value={formatCurrency(data.creditSales)}
                  color="text-amber-600"
                />
              </div>
            </div>

            <div>
              <SectionHeader label="Collection Summary" />
              <div className="space-y-2">
                <SummaryRow
                  label="Cash"
                  value={formatCurrency(data.cashCollected)}
                  icon={
                    <HiBanknotes className="w-3.5 h-3.5 text-emerald-500" />
                  }
                />
                <SummaryRow
                  label="UPI"
                  value={formatCurrency(data.upiCollected)}
                  icon={<HiMiniQrCode className="w-3.5 h-3.5 text-blue-500" />}
                />
                <SummaryRow
                  label="Bank Transfer"
                  value={formatCurrency(data.bankCollected)}
                  icon={
                    <HiBuildingLibrary className="w-3.5 h-3.5 text-purple-500" />
                  }
                />
                <div className="border-t border-gray-200 pt-2 mt-2">
                  <SummaryRow
                    label="Total Collected"
                    value={formatCurrency(data.totalCollected)}
                    bold
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ── Customer-wise Breakdown ─────────────────────────── */}
          {data.customerBreakdown.length > 0 && (
            <div>
              <SectionHeader label="Customer-wise Sales" />
              <div className="overflow-x-auto">
                <table className="w-full text-[12px]">
                  <thead>
                    <tr className="border-b-2 border-gray-200">
                      <Th align="left">#</Th>
                      <Th align="left">Customer</Th>
                      <Th align="center">Bills</Th>
                      <Th align="right">Cash</Th>
                      <Th align="right">UPI</Th>
                      <Th align="right">Bank</Th>
                      <Th align="right">Credit</Th>
                      <Th align="right">Total</Th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.customerBreakdown.map((c, i) => (
                      <tr
                        key={c.name}
                        className="border-b border-gray-100 hover:bg-gray-50/50"
                      >
                        <td className="py-1.5 text-gray-400">{i + 1}</td>
                        <td className="py-1.5 font-medium text-gray-800">
                          {c.name}
                        </td>
                        <td className="py-1.5 text-center text-gray-500">
                          {c.invoiceCount}
                        </td>
                        <td className="py-1.5 text-right text-gray-700">
                          {c.cashAmount > 0
                            ? formatCurrency(c.cashAmount)
                            : "—"}
                        </td>
                        <td className="py-1.5 text-right text-gray-700">
                          {c.upiAmount > 0 ? formatCurrency(c.upiAmount) : "—"}
                        </td>
                        <td className="py-1.5 text-right text-gray-700">
                          {c.bankAmount > 0
                            ? formatCurrency(c.bankAmount)
                            : "—"}
                        </td>
                        <td className="py-1.5 text-right text-amber-600">
                          {c.creditAmount > 0
                            ? formatCurrency(c.creditAmount)
                            : "—"}
                        </td>
                        <td className="py-1.5 text-right font-semibold text-gray-900">
                          {formatCurrency(c.totalAmount)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t-2 border-gray-300">
                      <td colSpan={2} className="py-2 font-bold text-gray-800">
                        Total
                      </td>
                      <td className="py-2 text-center font-bold text-gray-800">
                        {data.customerBreakdown.reduce(
                          (s, c) => s + c.invoiceCount,
                          0
                        )}
                      </td>
                      <td className="py-2 text-right font-bold text-gray-800">
                        {formatCurrency(
                          data.customerBreakdown.reduce(
                            (s, c) => s + c.cashAmount,
                            0
                          )
                        )}
                      </td>
                      <td className="py-2 text-right font-bold text-gray-800">
                        {formatCurrency(
                          data.customerBreakdown.reduce(
                            (s, c) => s + c.upiAmount,
                            0
                          )
                        )}
                      </td>
                      <td className="py-2 text-right font-bold text-gray-800">
                        {formatCurrency(
                          data.customerBreakdown.reduce(
                            (s, c) => s + c.bankAmount,
                            0
                          )
                        )}
                      </td>
                      <td className="py-2 text-right font-bold text-amber-600">
                        {formatCurrency(
                          data.customerBreakdown.reduce(
                            (s, c) => s + c.creditAmount,
                            0
                          )
                        )}
                      </td>
                      <td className="py-2 text-right font-bold text-gray-900">
                        {formatCurrency(
                          data.customerBreakdown.reduce(
                            (s, c) => s + c.totalAmount,
                            0
                          )
                        )}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          )}

          {/* ── Product-wise Breakdown (NEW) ────────────────────────
              Same table pattern as Customer-wise Sales above, on purpose —
              a report reads as one coherent document when every breakdown
              table shares the same visual language, not a different one
              invented per section. */}
          {data.productBreakdown.length > 0 && (
            <div>
              <SectionHeader label="Product-wise Sales" />
              <div className="overflow-x-auto">
                <table className="w-full text-[12px]">
                  <thead>
                    <tr className="border-b-2 border-gray-200">
                      <Th align="left">#</Th>
                      <Th align="left">Product</Th>
                      <Th align="left">SKU</Th>
                      <Th align="center">Bills</Th>
                      <Th align="right">Qty Sold</Th>
                      <Th align="right">Amount</Th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.productBreakdown.map((p, i) => (
                      <tr
                        key={p.sku}
                        className="border-b border-gray-100 hover:bg-gray-50/50"
                      >
                        <td className="py-1.5 text-gray-400">{i + 1}</td>
                        <td className="py-1.5 font-medium text-gray-800">
                          {p.productName}
                        </td>
                        <td className="py-1.5 text-gray-500">{p.sku}</td>
                        <td className="py-1.5 text-center text-gray-500">
                          {p.invoiceCount}
                        </td>
                        <td className="py-1.5 text-right text-gray-700">
                          {p.quantitySold} {p.unit}
                        </td>
                        <td className="py-1.5 text-right font-semibold text-gray-900">
                          {formatCurrency(p.totalAmount)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t-2 border-gray-300">
                      <td colSpan={3} className="py-2 font-bold text-gray-800">
                        Total
                      </td>
                      <td className="py-2 text-center font-bold text-gray-800">
                        {data.productBreakdown.reduce(
                          (s, p) => s + p.invoiceCount,
                          0
                        )}
                      </td>
                      <td className="py-2 text-right font-bold text-gray-800">
                        {data.productBreakdown.reduce(
                          (s, p) => s + p.quantitySold,
                          0
                        )}
                      </td>
                      <td className="py-2 text-right font-bold text-gray-900">
                        {formatCurrency(
                          data.productBreakdown.reduce(
                            (s, p) => s + p.totalAmount,
                            0
                          )
                        )}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          )}

          {/* ── Expenses ───────────────────────────────────────────── */}
          <div>
            <SectionHeader label="Expenses" />
            {data.expenses.length > 0 ? (
              <table className="w-full text-[12px]">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <Th align="left">#</Th>
                    <Th align="left">Description</Th>
                    <Th align="left">Vendor</Th>
                    <Th align="left">Mode</Th>
                    <Th align="right">Amount</Th>
                  </tr>
                </thead>
                <tbody>
                  {data.expenses.map((e, i) => (
                    <tr
                      key={e.id}
                      className="border-b border-gray-100 hover:bg-gray-50/50"
                    >
                      <td className="py-1.5 text-gray-400">{i + 1}</td>
                      <td className="py-1.5 text-gray-800">{e.description}</td>
                      <td className="py-1.5 text-gray-500">{e.vendorName}</td>
                      <td className="py-1.5 text-gray-500">{e.paymentMode}</td>
                      <td className="py-1.5 text-right font-medium text-red-600">
                        {formatCurrency(e.amount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-gray-300">
                    <td colSpan={4} className="py-2 font-bold text-gray-800">
                      Total Expenses
                    </td>
                    <td className="py-2 text-right font-bold text-red-600">
                      {formatCurrency(data.totalExpenses)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            ) : (
              <p className="text-[12px] text-gray-400 italic">
                No expenses recorded for this period
              </p>
            )}
          </div>

          {/* ── Petty Cash Spend ─────────────────────────────────────── */}
          <div>
            <SectionHeader label="Petty Cash Spend" />
            {data.pettyCashExpenses.length > 0 ? (
              <table className="w-full text-[12px]">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <Th align="left">#</Th>
                    <Th align="left">Description</Th>
                    <Th align="left">Handled By</Th>
                    <Th align="right">Amount</Th>
                  </tr>
                </thead>
                <tbody>
                  {data.pettyCashExpenses.map((p, i) => (
                    <tr
                      key={p.id}
                      className="border-b border-gray-100 hover:bg-gray-50/50"
                    >
                      <td className="py-1.5 text-gray-400">{i + 1}</td>
                      <td className="py-1.5 text-gray-800">{p.description}</td>
                      <td className="py-1.5 text-gray-500">
                        {p.handledByName ?? "—"}
                      </td>
                      <td className="py-1.5 text-right font-medium text-red-600">
                        {formatCurrency(p.amount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-gray-300">
                    <td colSpan={3} className="py-2 font-bold text-gray-800">
                      Total Petty Cash Spend
                    </td>
                    <td className="py-2 text-right font-bold text-red-600">
                      {formatCurrency(data.totalPettyCashOut)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            ) : (
              <p className="text-[12px] text-gray-400 italic">
                No petty cash spend recorded for this period
              </p>
            )}
          </div>

          {/* ── Final Summary ──────────────────────────────────────── */}
          <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
            <SectionHeader label="Day Closing" />
            <div className="grid grid-cols-2 gap-x-8 gap-y-2">
              <ClosingRow
                label="Total Billed"
                value={formatCurrency(data.totalBilled)}
              />
              <ClosingRow
                label="Total Collected"
                value={formatCurrency(data.totalCollected)}
              />
              <ClosingRow
                label="Cash"
                value={formatCurrency(data.cashCollected)}
                icon={<HiBanknotes className="w-3.5 h-3.5 text-emerald-500" />}
              />
              <ClosingRow
                label="UPI"
                value={formatCurrency(data.upiCollected)}
                icon={<HiMiniQrCode className="w-3.5 h-3.5 text-blue-500" />}
              />
              <ClosingRow
                label="Bank Transfer"
                value={formatCurrency(data.bankCollected)}
                icon={
                  <HiBuildingLibrary className="w-3.5 h-3.5 text-purple-500" />
                }
              />
              <ClosingRow
                label="Credit / Balance"
                value={formatCurrency(data.creditSales)}
                color="text-amber-600"
              />
              <ClosingRow
                label="Expenses (Total)"
                value={`- ${formatCurrency(data.totalExpenses)}`}
                color="text-red-600"
              />
              <ClosingRow
                label="Petty Cash Spend"
                value={`- ${formatCurrency(data.totalPettyCashOut)}`}
                color="text-red-600"
                icon={<HiOutlineCash className="w-3.5 h-3.5 text-red-400" />}
              />

              <div className="col-span-2 border-t-2 border-gray-300 mt-2 pt-3 flex justify-between items-center">
                <span className="text-[14px] font-bold text-gray-900">
                  Net Cash in Hand
                </span>
                <span
                  className={`text-xl font-bold ${
                    netCashInHand >= 0 ? "text-emerald-600" : "text-red-600"
                  }`}
                >
                  {formatCurrency(netCashInHand)}
                </span>
              </div>

              <div className="col-span-2 flex justify-between items-center pt-1">
                <span className="text-[13px] font-semibold text-gray-600">
                  Outstanding Balance
                </span>
                <span className="text-[15px] font-bold text-amber-600">
                  {formatCurrency(data.totalOutstanding)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </CustomModal>
    );
  }
);

DayClosingReport.displayName = "DayClosingReport";

/* ── Small helpers ────────────────────────────────────────────────── */

const SectionHeader: React.FC<{ label: string }> = ({ label }) => (
  <h2 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-3">
    {label}
  </h2>
);

const Th: React.FC<{
  children: React.ReactNode;
  align: "left" | "center" | "right";
}> = ({ children, align }) => (
  <th className={`py-2 font-semibold text-gray-600 text-${align}`}>
    {children}
  </th>
);

const SummaryRow: React.FC<{
  label: string;
  value: string;
  bold?: boolean;
  color?: string;
  icon?: React.ReactNode;
}> = ({ label, value, bold, color, icon }) => (
  <div className="flex justify-between items-center">
    <span className="text-[13px] text-gray-500 flex items-center gap-1.5">
      {icon}
      {label}
    </span>
    <span
      className={`text-[13px] tabular-nums ${color ?? "text-gray-900"} ${
        bold ? "font-bold" : "font-medium"
      }`}
    >
      {value}
    </span>
  </div>
);

const ClosingRow: React.FC<{
  label: string;
  value: string;
  color?: string;
  icon?: React.ReactNode;
}> = ({ label, value, color, icon }) => (
  <div className="flex justify-between items-center">
    <span className="text-[13px] text-gray-600 flex items-center gap-1.5">
      {icon}
      {label}
    </span>
    <span
      className={`text-[13px] font-semibold tabular-nums ${
        color ?? "text-gray-900"
      }`}
    >
      {value}
    </span>
  </div>
);

export default DayClosingReport;
