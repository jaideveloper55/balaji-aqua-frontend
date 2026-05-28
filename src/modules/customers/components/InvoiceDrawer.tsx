import React, { useState, useMemo, useCallback } from "react";
import { Table, Spin } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useQuery } from "@tanstack/react-query";
import {
  HiOutlineDocumentText,
  HiOutlineX,
  HiOutlinePrinter,
  HiOutlineDocumentDownload,
  HiOutlineCube,
  HiOutlineTag,
  HiOutlineCalendar,
  HiOutlineTruck,
  HiOutlineReceiptTax,
  HiOutlineCash,
  HiOutlineClipboardCheck,
} from "react-icons/hi";

import type { LedgerEntry } from "../types/Customer";
import { ENTRY_MAP } from "../constants/ledgerConstants";
import { fmt, fmtDate } from "../../../utils/helpers";
import { generateInvoicePDF } from "../../../utils/generators";
import { billingApi } from "../../billing/api/billing.api";
import InfoCard from "./ledger/InfoCard";

interface InvoiceItem {
  id: string;
  productName: string;
  sku: string;
  unit: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  taxAmount: number;
  lineTotal: number;
}

const PAYMENT_MODE_LABEL: Record<string, string> = {
  CASH: "Cash",
  UPI: "UPI",
  BANK_TRANSFER: "Bank Transfer",
  CREDIT: "Credit",
};

interface InvoiceDrawerProps {
  entry: LedgerEntry;
  onClose: () => void;
  showGST: boolean;
}

const InvoiceDrawer: React.FC<InvoiceDrawerProps> = ({
  entry,
  onClose,
  showGST,
}) => {
  const [downloading, setDownloading] = useState(false);
  const [printing, setPrinting] = useState(false);
  const [activeTab, setActiveTab] = useState<"details" | "items">("items");

  const entryStyle = ENTRY_MAP[entry.entryType];
  const isInvoice = entry.entryType === "INVOICE";
  const isPayment = entry.entryType === "PAYMENT";

  const { data: invoiceData, isLoading: invoiceLoading } = useQuery({
    queryKey: ["invoice-by-ref", entry.referenceNo],
    queryFn: async () => {
      if (!entry.referenceNo) return null;
      const res = await billingApi.listInvoices({
        search: entry.referenceNo,
        limit: 1,
      });
      const invoices = (res as any)?.data ?? [];
      return (
        invoices.find((inv: any) => inv.invoiceNumber === entry.referenceNo) ??
        invoices[0] ??
        null
      );
    },
    enabled: isInvoice && !!entry.referenceNo,
    staleTime: 60_000,
  });

  const lineItems: InvoiceItem[] = invoiceData?.items ?? [];

  const subtotal = lineItems.reduce(
    (s, i) => s + (i.unitPrice * i.quantity - i.discount),
    0
  );
  const totalTax = lineItems.reduce((s, i) => s + i.taxAmount, 0);
  const totalCGST = totalTax / 2;
  const totalSGST = totalTax / 2;

  const totalGstOnEntry = entry.cgst + entry.sgst + entry.igst;
  const baseAmount =
    (entry.debitAmount > 0 ? entry.debitAmount : entry.creditAmount) -
    totalGstOnEntry;
  const grandTotal = showGST ? subtotal + totalTax : subtotal;

  const handleDownloadPDF = useCallback(() => {
    if (!isInvoice || !invoiceData) return;
    setDownloading(true);
    try {
      generateInvoicePDF(entry, invoiceData, showGST, { print: false });
    } catch (err) {
      console.error("PDF generation failed:", err);
    } finally {
      setTimeout(() => setDownloading(false), 800);
    }
  }, [entry, invoiceData, showGST, isInvoice]);

  const handlePrint = useCallback(() => {
    if (!isInvoice || !invoiceData) return;
    setPrinting(true);
    try {
      generateInvoicePDF(entry, invoiceData, showGST, { print: true });
    } catch (err) {
      console.error("Print failed:", err);
    } finally {
      setTimeout(() => setPrinting(false), 800);
    }
  }, [entry, invoiceData, showGST, isInvoice]);

  const drawerCols: ColumnsType<InvoiceItem> = useMemo(() => {
    const base: ColumnsType<InvoiceItem> = [
      {
        title: "Item",
        dataIndex: "productName",
        key: "productName",
        render: (text: string, record: InvoiceItem) => (
          <div>
            <p className="text-xs text-slate-700 font-medium">{text}</p>
            {record.sku && (
              <p className="text-[9px] text-slate-400 font-mono">
                SKU: {record.sku}
              </p>
            )}
          </div>
        ),
      },
      {
        title: "Qty",
        dataIndex: "quantity",
        key: "quantity",
        width: 80,
        align: "center",
        render: (qty: number, r: InvoiceItem) => (
          <span className="text-xs font-mono text-slate-500">
            {qty} {r.unit}
          </span>
        ),
      },
      {
        title: "Rate",
        dataIndex: "unitPrice",
        key: "unitPrice",
        width: 90,
        align: "right",
        render: (v: number) => (
          <span className="text-xs font-mono text-slate-500">₹{fmt(v)}</span>
        ),
      },
    ];
    if (showGST) {
      base.push({
        title: "Tax",
        dataIndex: "taxAmount",
        key: "tax",
        width: 80,
        align: "right",
        render: (v: number) => (
          <span className="text-[10px] font-mono text-slate-400">
            ₹{fmt(v)}
          </span>
        ),
      });
    }
    base.push({
      title: "Amount",
      key: "amount",
      width: 100,
      align: "right",
      render: (_: unknown, r: InvoiceItem) => {
        const baseLine = r.unitPrice * r.quantity - r.discount;
        const v = showGST ? baseLine + r.taxAmount : baseLine;
        return (
          <span className="text-xs font-semibold font-mono text-slate-800">
            ₹{fmt(v)}
          </span>
        );
      },
    });
    return base;
  }, [showGST]);

  const renderInvoiceBody = () => (
    <>
      <div className="flex gap-1 p-1 bg-slate-100 rounded-lg">
        <button
          onClick={() => setActiveTab("details")}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-md text-xs font-semibold transition-all ${
            activeTab === "details"
              ? "bg-white text-slate-800 shadow-sm"
              : "text-slate-400 hover:text-slate-600"
          }`}
        >
          <HiOutlineTag className="text-sm" /> Details
        </button>
        <button
          onClick={() => setActiveTab("items")}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-md text-xs font-semibold transition-all ${
            activeTab === "items"
              ? "bg-white text-slate-800 shadow-sm"
              : "text-slate-400 hover:text-slate-600"
          }`}
        >
          <HiOutlineCube className="text-sm" /> Line Items (
          {invoiceLoading ? "..." : lineItems.length})
        </button>
      </div>

      {activeTab === "details" && (
        <>
          <div className="grid grid-cols-2 gap-3">
            <InfoCard
              icon={HiOutlineTag}
              label="Customer"
              value={invoiceData?.customer?.name ?? "—"}
            />
            <InfoCard
              icon={HiOutlineReceiptTax}
              label="Status"
              value={invoiceData?.status ?? "—"}
            />
            <InfoCard
              icon={HiOutlineCalendar}
              label="Due Date"
              value={
                invoiceData?.dueDate ? fmtDate(invoiceData.dueDate) : "N/A"
              }
            />
            <InfoCard
              icon={HiOutlineTruck}
              label="Reference"
              value={entry.referenceNo ?? "—"}
              mono
            />
          </div>
          <div className="px-4 py-3 rounded-lg bg-blue-50/60 border border-blue-100">
            <p className="text-xs text-blue-400 font-medium mb-0.5">
              Description
            </p>
            <p className="text-sm text-slate-700 font-medium">
              {entry.description ?? "—"}
            </p>
          </div>
        </>
      )}

      {activeTab === "items" && (
        <>
          {invoiceLoading ? (
            <div className="flex flex-col items-center justify-center py-10 text-slate-400 gap-3">
              <Spin />
              <p className="text-sm">Loading invoice items…</p>
            </div>
          ) : lineItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-slate-300">
              <HiOutlineDocumentText className="text-4xl mb-2" />
              <p className="text-sm">No items found on this invoice.</p>
            </div>
          ) : (
            <Table<InvoiceItem>
              columns={drawerCols}
              dataSource={lineItems}
              pagination={false}
              size="small"
              rowKey="id"
              className="ledger-drawer-table"
              summary={() => (
                <Table.Summary fixed>
                  <Table.Summary.Row className="bg-slate-50">
                    <Table.Summary.Cell
                      index={0}
                      colSpan={showGST ? 4 : 3}
                      align="right"
                    >
                      <span className="text-[11px] font-semibold text-slate-500">
                        Subtotal
                      </span>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={1} align="right">
                      <span className="text-xs font-bold text-slate-700 font-mono">
                        ₹{fmt(subtotal)}
                      </span>
                    </Table.Summary.Cell>
                  </Table.Summary.Row>
                  {showGST && (
                    <>
                      <Table.Summary.Row className="bg-slate-50/60">
                        <Table.Summary.Cell index={0} colSpan={4} align="right">
                          <span className="text-[11px] text-slate-400">
                            CGST @ 9%
                          </span>
                        </Table.Summary.Cell>
                        <Table.Summary.Cell index={1} align="right">
                          <span className="text-xs text-slate-500 font-mono">
                            ₹{fmt(Math.round(totalCGST))}
                          </span>
                        </Table.Summary.Cell>
                      </Table.Summary.Row>
                      <Table.Summary.Row className="bg-slate-50/60">
                        <Table.Summary.Cell index={0} colSpan={4} align="right">
                          <span className="text-[11px] text-slate-400">
                            SGST @ 9%
                          </span>
                        </Table.Summary.Cell>
                        <Table.Summary.Cell index={1} align="right">
                          <span className="text-xs text-slate-500 font-mono">
                            ₹{fmt(Math.round(totalSGST))}
                          </span>
                        </Table.Summary.Cell>
                      </Table.Summary.Row>
                    </>
                  )}
                  <Table.Summary.Row className="bg-slate-100">
                    <Table.Summary.Cell
                      index={0}
                      colSpan={showGST ? 4 : 3}
                      align="right"
                    >
                      <span className="text-xs font-bold text-slate-700 uppercase">
                        {showGST ? "Grand Total" : "Total (excl. GST)"}
                      </span>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={1} align="right">
                      <span className="text-sm font-black text-slate-900 font-mono">
                        ₹{fmt(Math.round(grandTotal))}
                      </span>
                    </Table.Summary.Cell>
                  </Table.Summary.Row>
                </Table.Summary>
              )}
            />
          )}
        </>
      )}
    </>
  );

  const renderPaymentBody = () => (
    <>
      <div className="grid grid-cols-2 gap-3">
        <InfoCard
          icon={HiOutlineCash}
          label="Payment Type"
          value={
            (entry as any).paymentMode
              ? PAYMENT_MODE_LABEL[(entry as any).paymentMode] ??
                (entry as any).paymentMode
              : "—"
          }
        />
        <InfoCard
          icon={HiOutlineClipboardCheck}
          label="Reference No."
          value={entry.referenceNo ?? "—"}
          mono
        />
        <InfoCard
          icon={HiOutlineCalendar}
          label="Payment Date"
          value={fmtDate(entry.entryDate)}
        />
        <InfoCard
          icon={HiOutlineReceiptTax}
          label="Balance After"
          value={`₹${fmt(entry.balance)}`}
          mono
        />
      </div>
      <div className="px-4 py-3 rounded-lg bg-emerald-50/60 border border-emerald-100">
        <p className="text-xs text-emerald-500 font-medium mb-0.5">
          Description
        </p>
        <p className="text-sm text-slate-700 font-medium">
          {entry.description ?? "Payment received"}
        </p>
      </div>
      <div className="px-4 py-3 rounded-lg bg-slate-50 border border-slate-100 text-[11px] text-slate-500 leading-relaxed">
        Payments don't have line items. The amount above is the full payment
        received from the customer and has been applied against their
        outstanding balance.
      </div>
    </>
  );

  const renderNoteBody = (kind: "CREDIT" | "DEBIT") => (
    <>
      <div className="grid grid-cols-2 gap-3">
        <InfoCard
          icon={HiOutlineTag}
          label="Type"
          value={kind === "CREDIT" ? "Credit Note" : "Debit Note"}
        />
        <InfoCard
          icon={HiOutlineClipboardCheck}
          label="Reference No."
          value={entry.referenceNo ?? "—"}
          mono
        />
        <InfoCard
          icon={HiOutlineCalendar}
          label="Date"
          value={fmtDate(entry.entryDate)}
        />
        <InfoCard
          icon={HiOutlineReceiptTax}
          label="Balance After"
          value={`₹${fmt(entry.balance)}`}
          mono
        />
      </div>
      <div className="px-4 py-3 rounded-lg bg-amber-50/60 border border-amber-100">
        <p className="text-xs text-amber-500 font-medium mb-0.5">Description</p>
        <p className="text-sm text-slate-700 font-medium">
          {entry.description ?? "—"}
        </p>
      </div>
    </>
  );

  const actionsDisabled = !isInvoice || !invoiceData || invoiceLoading;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 animate-fadeIn"
        onClick={onClose}
      />

      <div className="fixed right-0 top-0 h-full w-full max-w-[560px] bg-white z-50 shadow-2xl flex flex-col overflow-hidden animate-slideIn">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div
              className={`w-9 h-9 rounded-lg ${
                entryStyle?.bg ?? "bg-slate-100"
              } ${
                entryStyle?.text ?? "text-slate-600"
              } flex items-center justify-center`}
            >
              <HiOutlineDocumentText className="text-lg" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-800">
                {entry.referenceNo ?? "—"}
              </h2>
              <p className="text-[11px] text-slate-400">
                {fmtDate(entry.entryDate)} &middot;{" "}
                {entryStyle?.label ?? entry.entryType}
                <span
                  className={`ml-2 px-1.5 py-0.5 rounded text-[9px] font-bold ${
                    showGST
                      ? "bg-blue-100 text-blue-600"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {showGST ? "GST" : "EXCL"}
                </span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <HiOutlineX className="text-lg" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-slate-50 to-slate-100/60 border border-slate-100">
            <div>
              <p className="text-[11px] uppercase tracking-wider text-slate-400 font-medium mb-1">
                {showGST ? "Amount (incl. GST)" : "Base Amount (excl. GST)"}
              </p>
              <p
                className={`text-2xl font-bold tabular-nums font-mono ${
                  entry.debitAmount > 0 ? "text-slate-800" : "text-emerald-600"
                }`}
              >
                ₹
                {fmt(
                  showGST ? entry.debitAmount || entry.creditAmount : baseAmount
                )}
              </p>
              {showGST && totalGstOnEntry > 0 && (
                <p className="text-[10px] text-slate-400 mt-1 font-mono">
                  Base: ₹{fmt(baseAmount)} + Tax: ₹{fmt(totalGstOnEntry)}
                </p>
              )}
            </div>
          </div>

          {isInvoice && renderInvoiceBody()}
          {isPayment && renderPaymentBody()}
          {entry.entryType === "CREDIT_NOTE" && renderNoteBody("CREDIT")}
          {entry.entryType === "DEBIT_NOTE" && renderNoteBody("DEBIT")}
        </div>

        <div className="px-6 py-4 border-t border-slate-100 bg-white flex items-center gap-3">
          <button
            onClick={handlePrint}
            disabled={actionsDisabled || printing}
            title={
              isInvoice
                ? invoiceData
                  ? "Open print dialog"
                  : "Loading invoice…"
                : "Print only available for invoices"
            }
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {printing ? (
              <>
                <svg
                  className="animate-spin h-3.5 w-3.5"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                Opening…
              </>
            ) : (
              <>
                <HiOutlinePrinter className="text-sm" /> Print
              </>
            )}
          </button>

          <button
            onClick={handleDownloadPDF}
            disabled={actionsDisabled || downloading}
            title={
              isInvoice
                ? invoiceData
                  ? "Download invoice PDF"
                  : "Loading invoice…"
                : "PDF download only available for invoices"
            }
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {downloading ? (
              <>
                <svg
                  className="animate-spin h-3.5 w-3.5"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                Generating…
              </>
            ) : (
              <>
                <HiOutlineDocumentDownload className="text-sm" /> Download PDF
              </>
            )}
          </button>
        </div>
      </div>
    </>
  );
};

export default InvoiceDrawer;
