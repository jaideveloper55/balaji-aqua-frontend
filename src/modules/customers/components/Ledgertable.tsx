import React, { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  HiOutlineDocumentText,
  HiOutlineDownload,
  HiOutlineSearch,
  HiOutlineCurrencyRupee,
  HiOutlineArrowSmUp,
  HiOutlineArrowSmDown,
  HiOutlineClipboardList,
  HiOutlineX,
  HiOutlineFilter,
} from "react-icons/hi";

import CustomSelect from "../../../components/common/CustomSelect";
import CustomDateRange from "../../../components/common/CustomDateRange";

import type {
  FilterFormValues,
  LedgerEntry,
  LedgerTableProps,
  EntryType,
} from "../types/Customer";
import {
  TYPE_FILTER_OPTIONS,
  PAGE_SIZE,
  ENTRY_MAP,
} from "../constants/ledgerConstants";
import { DUMMY_DATA } from "./ledger/data";
import { fmt, fmtDate } from "../../../utils/helpers";

import InvoiceDrawer from "./InvoiceDrawer";
import ExportModal from "./ExportModal";
import SummaryCard from "./ledger/SummaryCard";
import GSTToggle from "./ledger/GSTToggle";

const LedgerTable: React.FC<LedgerTableProps> = () => {
  const [data] = useState<LedgerEntry[]>(DUMMY_DATA);
  const [search, setSearch] = useState("");
  const [selectedEntry, setSelectedEntry] = useState<LedgerEntry | null>(null);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showGST, setShowGST] = useState(true);

  // ── Form (filters) ─────────────────────────────────────────
  const {
    control,
    formState: { errors },
    watch,
  } = useForm<FilterFormValues>({
    defaultValues: { typeFilter: "all", dateRange: null },
  });
  const typeFilter = watch("typeFilter");
  const dateRange = watch("dateRange");

  // ── Filtered data ──────────────────────────────────────────
  const filtered = useMemo(() => {
    let d = data;
    if (typeFilter && typeFilter !== "all")
      d = d.filter((e) => e.type === typeFilter);
    if (dateRange?.[0]) {
      const f = dateRange[0].format("YYYY-MM-DD");
      d = d.filter((e) => e.date >= f);
    }
    if (dateRange?.[1]) {
      const t = dateRange[1].format("YYYY-MM-DD");
      d = d.filter((e) => e.date <= t);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      d = d.filter(
        (e) =>
          e.description.toLowerCase().includes(q) ||
          (e.referenceNo || "").toLowerCase().includes(q)
      );
    }
    return d;
  }, [data, search, typeFilter, dateRange]);

  // ── Computed totals ────────────────────────────────────────
  const totalDebit = filtered.reduce((s, e) => s + e.debit, 0);
  const totalCredit = filtered.reduce((s, e) => s + e.credit, 0);
  const totalBaseDebit = filtered.reduce(
    (s, e) => s + (e.debit > 0 ? e.baseAmount : 0),
    0
  );
  const totalBaseCredit = filtered.reduce(
    (s, e) => s + (e.credit > 0 ? e.baseAmount : 0),
    0
  );
  const totalCGST = filtered.reduce((s, e) => s + e.cgst, 0);
  const totalSGST = filtered.reduce((s, e) => s + e.sgst, 0);
  const outstanding = totalDebit - totalCredit;
  const baseOutstanding = totalBaseDebit - totalBaseCredit;

  // ── Column Definitions ─────────────────────────────────────
  const columns: ColumnsType<LedgerEntry> = useMemo(() => {
    const cols: ColumnsType<LedgerEntry> = [
      {
        title: "Date",
        dataIndex: "date",
        key: "date",
        width: 100,
        sorter: (a, b) =>
          new Date(a.date).getTime() - new Date(b.date).getTime(),
        render: (d: string) => (
          <span className="text-xs font-medium text-slate-600 font-mono tabular-nums whitespace-nowrap">
            {fmtDate(d)}
          </span>
        ),
      },
      {
        title: "Type",
        dataIndex: "type",
        key: "type",
        width: 150,
        align: "center",
        render: (type: EntryType) => {
          const es = ENTRY_MAP[type];
          return (
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold whitespace-nowrap ${es.bg} ${es.text}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${es.dot}`} />
              {es.label}
            </span>
          );
        },
      },
      {
        title: "Description",
        dataIndex: "description",
        key: "description",
        align: "start",
        render: (text: string, record: LedgerEntry) => {
          return (
            <div className="flex items-center gap-2 ">
              <div className="min-w-0 flex-1">
                <p className="text-xs text-slate-700 font-medium truncate">
                  {text}
                </p>
                {record.referenceNo && (
                  <p className="text-[10px] font-mono text-slate-400 mt-0.5 truncate">
                    {record.referenceNo}
                  </p>
                )}
              </div>
            </div>
          );
        },
      },
      {
        title: showGST ? "Debit" : "Debit (Base)",
        dataIndex: "debit",
        key: "debit",
        width: 110,
        align: "right",
        sorter: (a, b) => a.debit - b.debit,
        render: (_: number, r: LedgerEntry) =>
          r.debit > 0 ? (
            <span className="text-xs font-semibold text-red-500 font-mono tabular-nums whitespace-nowrap">
              ₹{fmt(showGST ? r.debit : r.baseAmount)}
            </span>
          ) : (
            <span className="text-xs text-slate-300">—</span>
          ),
      },
      {
        title: showGST ? "Credit" : "Credit (Base)",
        dataIndex: "credit",
        key: "credit",
        width: 110,
        align: "right",
        sorter: (a, b) => a.credit - b.credit,
        render: (_: number, r: LedgerEntry) =>
          r.credit > 0 ? (
            <span className="text-xs font-semibold text-emerald-600 font-mono tabular-nums whitespace-nowrap">
              ₹{fmt(showGST ? r.credit : r.baseAmount)}
            </span>
          ) : (
            <span className="text-xs text-slate-300">—</span>
          ),
      },
    ];

    if (showGST) {
      cols.push(
        {
          title: "CGST",
          dataIndex: "cgst",
          key: "cgst",
          width: 85,
          align: "right",
          render: (v: number) =>
            v > 0 ? (
              <span className="text-[11px] text-slate-400 font-mono tabular-nums whitespace-nowrap">
                ₹{fmt(v)}
              </span>
            ) : (
              <span className="text-xs text-slate-300">—</span>
            ),
        },
        {
          title: "SGST",
          dataIndex: "sgst",
          key: "sgst",
          width: 85,
          align: "right",
          render: (v: number) =>
            v > 0 ? (
              <span className="text-[11px] text-slate-400 font-mono tabular-nums whitespace-nowrap">
                ₹{fmt(v)}
              </span>
            ) : (
              <span className="text-xs text-slate-300">—</span>
            ),
        }
      );
    }

    cols.push({
      title: "Balance",
      dataIndex: "balance",
      key: "balance",
      width: 110,
      align: "right",
      sorter: (a, b) => a.balance - b.balance,
      render: (v: number) => (
        <span
          className={`text-xs font-bold font-mono tabular-nums whitespace-nowrap ${
            v > 0 ? "text-slate-800" : "text-emerald-600"
          }`}
        >
          ₹{fmt(v)}
        </span>
      ),
    });

    return cols;
  }, [showGST]);

  return (
    <div className="flex flex-col gap-5 mx-auto">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <SummaryCard
          icon={HiOutlineArrowSmUp}
          iconColor="text-red-500"
          value={`₹${fmt(showGST ? totalDebit : totalBaseDebit)}`}
          label="Total Debit"
          sublabel={showGST ? "incl. GST" : "excl. GST"}
        />
        <SummaryCard
          icon={HiOutlineArrowSmDown}
          iconColor="text-emerald-500"
          value={`₹${fmt(showGST ? totalCredit : totalBaseCredit)}`}
          label="Total Credit"
          sublabel={showGST ? "incl. GST" : "excl. GST"}
        />
        <SummaryCard
          icon={HiOutlineCurrencyRupee}
          iconColor="text-amber-500"
          value={`₹${fmt(showGST ? outstanding : baseOutstanding)}`}
          label="Outstanding"
          sublabel={outstanding > 0 ? "Receivable" : "Settled"}
        />
        <SummaryCard
          icon={HiOutlineClipboardList}
          iconColor="text-blue-500"
          value={filtered.length}
          label="Total Entries"
        />
      </div>

      {/* Toolbar Row 1: Title + Actions */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <HiOutlineDocumentText className="text-sm" />
            </div>
            <h3 className="text-sm font-bold text-slate-800">Account Ledger</h3>
            <span className="text-[11px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full font-medium">
              {filtered.length} entries
            </span>
          </div>
          <div className="flex items-center gap-2">
            <GSTToggle
              showGST={showGST}
              onToggle={() => setShowGST(!showGST)}
            />
            <button
              onClick={() => setShowExportModal(true)}
              className="flex items-center gap-1.5 px-4 py-[7px] rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 active:bg-blue-800 transition-colors whitespace-nowrap"
            >
              <HiOutlineDownload className="text-sm" /> Export
            </button>
          </div>
        </div>

        {/* Toolbar Row 2: Filters */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative flex-shrink-0">
            <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
            <input
              type="text"
              placeholder="Search description or ref..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-8 py-[7px] w-60 rounded-lg border border-slate-200 text-xs text-slate-700 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <HiOutlineX className="text-xs" />
              </button>
            )}
          </div>
          <div className="w-40 flex-shrink-0">
            <CustomSelect
              name="typeFilter"
              control={control}
              errors={errors}
              placeholder="All Types"
              options={TYPE_FILTER_OPTIONS}
              size="middle"
              showSearch={false}
              suffixIcon={<HiOutlineFilter className="text-slate-400" />}
            />
          </div>
          <div className="w-60 flex-shrink-0">
            <CustomDateRange
              name="dateRange"
              control={control}
              errors={errors}
              placeholder={["From", "To"]}
              size="middle"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-slate-200 overflow-hidden bg-white">
        <Table<LedgerEntry>
          columns={columns}
          dataSource={filtered}
          rowKey="id"
          size="middle"
          tableLayout="fixed"
          pagination={{
            pageSize: PAGE_SIZE,
            showSizeChanger: false,
            showTotal: (total, range) => (
              <span className="text-xs text-slate-400">
                {range[0]}–{range[1]} of {total} entries
              </span>
            ),
          }}
          onRow={(record) => ({
            onClick: () => setSelectedEntry(record),
            className: "cursor-pointer",
          })}
          className="ledger-main-table"
          summary={() => (
            <Table.Summary>
              <Table.Summary.Row className="bg-slate-50">
                <Table.Summary.Cell index={0} colSpan={3}>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    Total ({filtered.length} entries)
                  </span>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={1} align="right">
                  <span className="text-xs font-bold text-red-500 font-mono tabular-nums">
                    ₹{fmt(showGST ? totalDebit : totalBaseDebit)}
                  </span>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={2} align="right">
                  <span className="text-xs font-bold text-emerald-600 font-mono tabular-nums">
                    ₹{fmt(showGST ? totalCredit : totalBaseCredit)}
                  </span>
                </Table.Summary.Cell>
                {showGST && (
                  <>
                    <Table.Summary.Cell index={3} align="right">
                      <span className="text-[10px] font-bold text-slate-500 font-mono tabular-nums">
                        ₹{fmt(totalCGST)}
                      </span>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={4} align="right">
                      <span className="text-[10px] font-bold text-slate-500 font-mono tabular-nums">
                        ₹{fmt(totalSGST)}
                      </span>
                    </Table.Summary.Cell>
                  </>
                )}
                <Table.Summary.Cell index={showGST ? 5 : 3} align="right">
                  <span className="text-sm font-black text-slate-900 font-mono tabular-nums">
                    ₹{fmt(showGST ? outstanding : baseOutstanding)}
                  </span>
                </Table.Summary.Cell>
              </Table.Summary.Row>
            </Table.Summary>
          )}
        />
      </div>

      {/* Modals */}
      {selectedEntry && (
        <InvoiceDrawer
          entry={selectedEntry}
          onClose={() => setSelectedEntry(null)}
          showGST={showGST}
        />
      )}
      {showExportModal && (
        <ExportModal
          data={filtered}
          onClose={() => setShowExportModal(false)}
          showGST={showGST}
        />
      )}
    </div>
  );
};

export default LedgerTable;
