import React, { useState, useEffect } from "react";
import { Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import { HiOutlineDocumentText } from "react-icons/hi";
import { customerApi } from "../services/Customer.api";
import type { LedgerEntry, LedgerEntryType } from "../types/Customer";

const ENTRY_MAP: Record<LedgerEntryType, { label: string; color: string }> = {
  invoice: { label: "Invoice", color: "blue" },
  payment: { label: "Payment", color: "green" },
  credit_note: { label: "Credit Note", color: "cyan" },
  debit_note: { label: "Debit Note", color: "orange" },
};

interface LedgerTableProps {
  customerId: string;
}

const LedgerTable: React.FC<LedgerTableProps> = ({ customerId }) => {
  const [data, setData] = useState<LedgerEntry[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        setData(await customerApi.getCustomerLedger(customerId));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [customerId]);

  const totalDebit = data.reduce((s, e) => s + e.debit, 0);
  const totalCredit = data.reduce((s, e) => s + e.credit, 0);

  const columns: ColumnsType<LedgerEntry> = [
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      width: 110,
      render: (d: string) => (
        <span className="text-xs font-medium text-slate-600">
          {new Date(d).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
        </span>
      ),
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      width: 120,
      render: (t: LedgerEntryType) => (
        <Tag color={ENTRY_MAP[t].color}>{ENTRY_MAP[t].label}</Tag>
      ),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "desc",
      ellipsis: true,
      render: (d: string, r) => (
        <div className="flex flex-col gap-0.5">
          <span className="text-sm text-slate-700">{d}</span>
          {r.referenceNo && (
            <span className="text-[10px] font-mono text-slate-400">
              Ref: {r.referenceNo}
            </span>
          )}
        </div>
      ),
    },
    {
      title: "Debit",
      dataIndex: "debit",
      key: "debit",
      width: 110,
      align: "right",
      render: (v: number) =>
        v > 0 ? (
          <span className="text-sm font-semibold text-red-500 tabular-nums">
            ₹{v.toLocaleString("en-IN")}
          </span>
        ) : (
          <span className="text-xs text-slate-300">—</span>
        ),
    },
    {
      title: "Credit",
      dataIndex: "credit",
      key: "credit",
      width: 110,
      align: "right",
      render: (v: number) =>
        v > 0 ? (
          <span className="text-sm font-semibold text-green-600 tabular-nums">
            ₹{v.toLocaleString("en-IN")}
          </span>
        ) : (
          <span className="text-xs text-slate-300">—</span>
        ),
    },
    {
      title: "Balance",
      dataIndex: "balance",
      key: "balance",
      width: 120,
      align: "right",
      fixed: "right",
      render: (v: number) => (
        <span
          className={`text-sm font-bold tabular-nums ${v > 0 ? "text-slate-800" : "text-green-600"}`}
        >
          ₹{v.toLocaleString("en-IN")}
        </span>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <HiOutlineDocumentText size={16} className="text-blue-500" />
          <h3 className="text-sm font-bold text-slate-800">Account Ledger</h3>
        </div>
        <div className="flex items-center gap-5 text-xs">
          <span className="text-slate-500">
            Debit:{" "}
            <span className="font-bold text-red-500 tabular-nums">
              ₹{totalDebit.toLocaleString("en-IN")}
            </span>
          </span>
          <span className="text-slate-500">
            Credit:{" "}
            <span className="font-bold text-green-600 tabular-nums">
              ₹{totalCredit.toLocaleString("en-IN")}
            </span>
          </span>
        </div>
      </div>
      <Table<LedgerEntry>
        columns={columns}
        dataSource={data}
        rowKey="id"
        loading={loading}
        size="middle"
        scroll={{ x: 700 }}
        pagination={{ pageSize: 10, showSizeChanger: true }}
        summary={() => (
          <Table.Summary fixed>
            <Table.Summary.Row className="bg-slate-50 font-bold">
              <Table.Summary.Cell index={0} colSpan={3}>
                <span className="text-xs font-bold text-slate-700">TOTAL</span>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={3} align="right">
                <span className="text-sm font-bold text-red-500 tabular-nums">
                  ₹{totalDebit.toLocaleString("en-IN")}
                </span>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={4} align="right">
                <span className="text-sm font-bold text-green-600 tabular-nums">
                  ₹{totalCredit.toLocaleString("en-IN")}
                </span>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={5} align="right">
                <span className="text-sm font-black text-slate-800 tabular-nums">
                  ₹{(data[0]?.balance ?? 0).toLocaleString("en-IN")}
                </span>
              </Table.Summary.Cell>
            </Table.Summary.Row>
          </Table.Summary>
        )}
      />
    </div>
  );
};

export default LedgerTable;
