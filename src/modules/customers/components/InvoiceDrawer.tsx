import React, { useState, useMemo, useCallback } from "react";
import { Table } from "antd";
import type { ColumnsType } from "antd/es/table";
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
} from "react-icons/hi";

import type { LedgerEntry, LineItem } from "../types/Customer";
import { ENTRY_MAP, STATUS_MAP } from "../constants/ledgerConstants";
import { LINE_ITEMS } from "../components/ledger/data";
import { fmt, fmtDate } from "../../../utils/helpers";
import { generateInvoicePDF } from "../../../utils/generators";
import InfoCard from "./ledger/InfoCard";

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
  const [activeTab, setActiveTab] = useState<"details" | "items">("items");

  const details = LINE_ITEMS[entry.id];
  const entryStyle = ENTRY_MAP[entry.type];
  const lineItems = details?.items ?? [];
  const subtotal = lineItems.reduce((s, i) => s + i.amount, 0);
  const totalCGST = lineItems.reduce(
    (s, i) => s + (i.amount * (i.gstRate / 2)) / 100,
    0
  );
  const totalSGST = totalCGST;
  const grandTotal = showGST ? subtotal + totalCGST + totalSGST : subtotal;

  const handleDownloadPDF = useCallback(() => {
    setDownloading(true);
    try {
      generateInvoicePDF(entry, details, showGST);
    } catch (err) {
      console.error(err);
    } finally {
      setTimeout(() => setDownloading(false), 800);
    }
  }, [entry, details, showGST]);

  const drawerCols: ColumnsType<LineItem> = useMemo(() => {
    const base: ColumnsType<LineItem> = [
      {
        title: "Item",
        dataIndex: "name",
        key: "name",
        render: (text: string, record: LineItem) => (
          <div>
            <p className="text-xs text-slate-700 font-medium">{text}</p>
            {record.hsn && record.hsn !== "-" && (
              <p className="text-[9px] text-slate-400 font-mono">
                HSN: {record.hsn}
              </p>
            )}
          </div>
        ),
      },
      {
        title: "Qty",
        dataIndex: "qty",
        key: "qty",
        width: 80,
        align: "center",
        render: (qty: number, r: LineItem) => (
          <span className="text-xs font-mono text-slate-500">
            {qty} {r.unit}
          </span>
        ),
      },
      {
        title: "Rate",
        dataIndex: "rate",
        key: "rate",
        width: 90,
        align: "right",
        render: (v: number) => (
          <span className="text-xs font-mono text-slate-500">₹{fmt(v)}</span>
        ),
      },
    ];
    if (showGST)
      base.push({
        title: "GST",
        dataIndex: "gstRate",
        key: "gst",
        width: 60,
        align: "right",
        render: (v: number) => (
          <span className="text-[10px] font-mono text-slate-400">{v}%</span>
        ),
      });
    base.push({
      title: "Amount",
      key: "amount",
      width: 100,
      align: "right",
      render: (_: unknown, r: LineItem) => {
        const g = showGST ? (r.amount * r.gstRate) / 100 : 0;
        return (
          <span className="text-xs font-semibold font-mono text-slate-800">
            ₹{fmt(r.amount + g)}
          </span>
        );
      },
    });
    return base;
  }, [showGST]);

  return (
    <>
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 animate-fadeIn"
        onClick={onClose}
      />

      <div className="fixed right-0 top-0 h-full w-full max-w-[560px] bg-white z-50 shadow-2xl flex flex-col overflow-hidden animate-slideIn">
        {/* ── Header ── */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div
              className={`w-9 h-9 rounded-lg ${entryStyle.bg} ${entryStyle.text} flex items-center justify-center`}
            >
              <HiOutlineDocumentText className="text-lg" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-800">
                {entry.referenceNo}
              </h2>
              <p className="text-[11px] text-slate-400">
                {fmtDate(entry.date)} &middot; {entryStyle.label}
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

        {/* ── Body ── */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {/* Amount + Status */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-slate-50 to-slate-100/60 border border-slate-100">
            <div>
              <p className="text-[11px] uppercase tracking-wider text-slate-400 font-medium mb-1">
                {showGST ? "Amount (incl. GST)" : "Base Amount (excl. GST)"}
              </p>
              <p
                className={`text-2xl font-bold tabular-nums font-mono ${
                  entry.debit > 0 ? "text-slate-800" : "text-emerald-600"
                }`}
              >
                ₹{fmt(showGST ? entry.debit || entry.credit : entry.baseAmount)}
              </p>
              {showGST && (entry.cgst > 0 || entry.sgst > 0) && (
                <p className="text-[10px] text-slate-400 mt-1 font-mono">
                  Base: ₹{fmt(entry.baseAmount)} + Tax: ₹
                  {fmt(entry.cgst + entry.sgst)}
                </p>
              )}
            </div>
            {details && (
              <div
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${
                  STATUS_MAP[details.status].bg
                } ${STATUS_MAP[details.status].text}`}
              >
                {React.createElement(STATUS_MAP[details.status].icon, {
                  className: "text-sm",
                })}
                {STATUS_MAP[details.status].label}
              </div>
            )}
          </div>

          {/* Tabs */}
          {details && (
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
                {lineItems.length})
              </button>
            </div>
          )}

          {/* Details Tab */}
          {activeTab === "details" && details && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <InfoCard
                  icon={HiOutlineTag}
                  label="Customer"
                  value={details.customer}
                />
                <InfoCard
                  icon={HiOutlineReceiptTax}
                  label="GST No."
                  value={details.gst}
                  mono
                />
                <InfoCard
                  icon={HiOutlineCalendar}
                  label="Due Date"
                  value={
                    details.dueDate === "-" ? "N/A" : fmtDate(details.dueDate)
                  }
                />
                <InfoCard
                  icon={HiOutlineTruck}
                  label="Reference"
                  value={entry.referenceNo}
                  mono
                />
              </div>
              <div className="px-4 py-3 rounded-lg bg-blue-50/60 border border-blue-100">
                <p className="text-xs text-blue-400 font-medium mb-0.5">
                  Description
                </p>
                <p className="text-sm text-slate-700 font-medium">
                  {entry.description}
                </p>
              </div>
            </>
          )}

          {/* Items Tab */}
          {activeTab === "items" && details && (
            <Table<LineItem>
              columns={drawerCols}
              dataSource={lineItems}
              pagination={false}
              size="small"
              rowKey={(_, idx) => String(idx)}
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

          {!details && (
            <div className="flex flex-col items-center justify-center py-10 text-slate-300">
              <HiOutlineDocumentText className="text-4xl mb-2" />
              <p className="text-sm">No line item details available.</p>
            </div>
          )}
        </div>

        {/* ── Footer ── */}
        <div className="px-6 py-4 border-t border-slate-100 bg-white flex items-center gap-3">
          <button
            onClick={onClose}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-50 transition-colors"
          >
            <HiOutlinePrinter className="text-sm" /> Print
          </button>
          <button
            onClick={handleDownloadPDF}
            disabled={downloading}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-colors disabled:opacity-70"
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
                </svg>{" "}
                Generating...
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
