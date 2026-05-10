import { useState } from "react";
import { Input, Select } from "antd";
import {
  HiOutlineDocumentDownload,
  HiOutlineSearch,
  HiOutlineDocumentText,
  HiOutlineEye,
  HiOutlinePaperAirplane,
  HiOutlineCheckCircle,
} from "react-icons/hi";
import dayjs from "dayjs";
import { STATUS_META } from "../constants/Salary.constants";
import PayslipPreviewModal from "./PayslipPreviewModal";

interface PayslipRow {
  id: string;
  payslipNumber: string;
  employeeId: string;
  name: string;
  designation: string;
  month: string;
  netSalary: number;
  baseSalary: number;
  paymentMode: "bank" | "upi" | "cash";
  status: "draft" | "approved" | "paid" | "on_hold";
  generatedOn: string;
  sentOn?: string;
}

const INITIAL_PAYSLIPS: PayslipRow[] = [
  {
    id: "1",
    payslipNumber: "PS-2026-04-001",
    employeeId: "EMP-001",
    name: "Suresh Murugan",
    designation: "Senior Driver",
    month: "April 2026",
    baseSalary: 18000,
    netSalary: 19048,
    paymentMode: "bank",
    status: "paid",
    generatedOn: "2026-05-01",
    sentOn: "2026-05-01",
  },
  {
    id: "2",
    payslipNumber: "PS-2026-04-002",
    employeeId: "EMP-002",
    name: "Karthik Raja",
    designation: "Driver",
    month: "April 2026",
    baseSalary: 16000,
    netSalary: 13436,
    paymentMode: "upi",
    status: "paid",
    generatedOn: "2026-05-01",
    sentOn: "2026-05-01",
  },
  {
    id: "3",
    payslipNumber: "PS-2026-04-003",
    employeeId: "EMP-005",
    name: "Rajesh Kumar",
    designation: "Plant Operator",
    month: "April 2026",
    baseSalary: 22000,
    netSalary: 24188,
    paymentMode: "bank",
    status: "paid",
    generatedOn: "2026-05-01",
    sentOn: "2026-05-01",
  },
  {
    id: "4",
    payslipNumber: "PS-2026-04-004",
    employeeId: "EMP-006",
    name: "Divya Bharathi",
    designation: "Accountant",
    month: "April 2026",
    baseSalary: 25000,
    netSalary: 27000,
    paymentMode: "bank",
    status: "approved",
    generatedOn: "2026-05-02",
  },
];

const PAYMENT_MODE_META: Record<
  string,
  { label: string; icon: string; bg: string; color: string }
> = {
  bank: {
    label: "Bank",
    icon: "🏦",
    bg: "bg-blue-50 border-blue-200",
    color: "text-blue-700",
  },
  upi: {
    label: "UPI",
    icon: "📱",
    bg: "bg-purple-50 border-purple-200",
    color: "text-purple-700",
  },
  cash: {
    label: "Cash",
    icon: "💵",
    bg: "bg-emerald-50 border-emerald-200",
    color: "text-emerald-700",
  },
};

const formatINR = (n: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);

const formatDate = (s: string) => dayjs(s).format("DD MMM YYYY");

const PayslipsPanel = () => {
  const [payslips, setPayslips] = useState<PayslipRow[]>(INITIAL_PAYSLIPS);
  const [search, setSearch] = useState("");
  const [monthFilter, setMonthFilter] = useState<string | null>(null);
  const [selected, setSelected] = useState<string[]>([]);
  const [previewSlip, setPreviewSlip] = useState<PayslipRow | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const filtered = payslips.filter((p) =>
    search
      ? p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.payslipNumber.toLowerCase().includes(search.toLowerCase())
      : true
  );

  const toggleSelect = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    if (selected.length === filtered.length) {
      setSelected([]);
    } else {
      setSelected(filtered.map((f) => f.id));
    }
  };

  const handleSendWhatsApp = () => {
    showToast(`📤 Sending ${selected.length} payslips via WhatsApp...`);
    setTimeout(() => {
      // Mark as sent
      const today = new Date().toISOString().split("T")[0];
      setPayslips((prev) =>
        prev.map((p) => (selected.includes(p.id) ? { ...p, sentOn: today } : p))
      );
      showToast(`✓ ${selected.length} payslips sent successfully`);
      setSelected([]);
    }, 1500);
  };

  const handleBulkDownload = () => {
    showToast(`📥 Downloading ${selected.length} payslips as ZIP...`);
  };

  const handleSinglePreview = (p: PayslipRow) => {
    setPreviewSlip(p);
  };

  const handleSingleDownload = (p: PayslipRow) => {
    showToast(`📥 Downloading payslip for ${p.name}...`);
  };

  const handleSingleSend = (p: PayslipRow) => {
    const today = new Date().toISOString().split("T")[0];
    setPayslips((prev) =>
      prev.map((x) => (x.id === p.id ? { ...x, sentOn: today } : x))
    );
    showToast(`📤 Payslip sent to ${p.name}`);
  };

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
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
            <div className="md:col-span-5">
              <Input
                size="large"
                placeholder="Search by name or payslip number..."
                prefix={<HiOutlineSearch className="text-slate-400" />}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                allowClear
              />
            </div>
            <div className="md:col-span-3">
              <Select
                size="large"
                placeholder="All Months"
                className="w-full"
                allowClear
                value={monthFilter}
                onChange={(v) => setMonthFilter(v ?? null)}
                options={Array.from({ length: 12 }, (_, i) => {
                  const d = dayjs().subtract(i, "month");
                  return {
                    value: d.format("YYYY-MM"),
                    label: d.format("MMMM YYYY"),
                  };
                })}
              />
            </div>
            <div className="md:col-span-4 flex items-center gap-2 justify-end">
              {selected.length > 0 && (
                <>
                  <span className="text-xs font-semibold text-slate-600">
                    {selected.length} selected
                  </span>
                  <button
                    type="button"
                    onClick={handleSendWhatsApp}
                    className="flex items-center gap-1 px-3 py-2 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold hover:bg-emerald-100 active:scale-95 transition-all"
                  >
                    <HiOutlinePaperAirplane className="w-3.5 h-3.5" />
                    Send via WhatsApp
                  </button>
                  <button
                    type="button"
                    onClick={handleBulkDownload}
                    className="flex items-center gap-1 px-3 py-2 rounded-lg bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold hover:bg-blue-100 active:scale-95 transition-all"
                  >
                    <HiOutlineDocumentDownload className="w-3.5 h-3.5" />
                    Download All
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Payslip list */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="grid grid-cols-12 gap-3 px-4 py-3 bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-700 uppercase tracking-wider">
            <div className="col-span-1 flex items-center">
              <input
                type="checkbox"
                checked={
                  selected.length === filtered.length && filtered.length > 0
                }
                onChange={toggleAll}
                className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
              />
            </div>
            <div className="col-span-4">Employee</div>
            <div className="col-span-2">Period</div>
            <div className="col-span-1">Mode</div>
            <div className="col-span-2 text-right">Net Salary</div>
            <div className="col-span-1">Status</div>
            <div className="col-span-1 text-center">Actions</div>
          </div>

          {filtered.map((p) => {
            const status = STATUS_META[p.status];
            const modeMeta = PAYMENT_MODE_META[p.paymentMode];
            const isSelected = selected.includes(p.id);

            return (
              <div
                key={p.id}
                className={`grid grid-cols-12 gap-3 px-4 py-3 items-center border-b border-slate-100 last:border-0 transition-colors ${
                  isSelected ? "bg-emerald-50/40" : "hover:bg-slate-50/50"
                }`}
              >
                <div className="col-span-1">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleSelect(p.id)}
                    className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                  />
                </div>

                <div className="col-span-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 text-white text-sm font-bold flex items-center justify-center shrink-0">
                    {p.name.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <div className="font-semibold text-slate-900 truncate">
                      {p.name}
                    </div>
                    <div className="text-xs text-slate-500 flex items-center gap-1.5">
                      <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-600">
                        {p.payslipNumber}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="col-span-2">
                  <div className="text-sm font-semibold text-slate-900">
                    {p.month}
                  </div>
                  <div className="text-xs text-slate-500">
                    Generated {formatDate(p.generatedOn)}
                  </div>
                </div>

                <div className="col-span-1">
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md border text-[10px] font-semibold ${modeMeta.bg} ${modeMeta.color}`}
                  >
                    {modeMeta.icon} {modeMeta.label}
                  </span>
                </div>

                <div className="col-span-2 text-right">
                  <div className="text-base font-bold text-emerald-700">
                    {formatINR(p.netSalary)}
                  </div>
                  {p.sentOn && (
                    <div className="text-[10px] text-slate-400 flex items-center gap-1 justify-end mt-0.5">
                      <HiOutlineCheckCircle className="w-3 h-3 text-emerald-500" />
                      Sent {formatDate(p.sentOn)}
                    </div>
                  )}
                </div>

                <div className="col-span-1">
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px] font-bold ${status.bg} ${status.color}`}
                  >
                    <span className={`w-1 h-1 rounded-full ${status.dot}`} />
                    {status.label}
                  </span>
                </div>

                <div className="col-span-1 flex items-center justify-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleSinglePreview(p)}
                    className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition-colors"
                    title="View"
                  >
                    <HiOutlineEye className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSingleDownload(p)}
                    className="p-1.5 rounded-lg hover:bg-blue-50 text-slate-500 hover:text-blue-600 transition-colors"
                    title="Download PDF"
                  >
                    <HiOutlineDocumentDownload className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSingleSend(p)}
                    className="p-1.5 rounded-lg hover:bg-emerald-50 text-slate-500 hover:text-emerald-600 transition-colors"
                    title="Send via WhatsApp"
                  >
                    <HiOutlinePaperAirplane className="w-4 h-4" />
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
                No payslips found
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Try a different search or process this month's payroll first.
              </p>
            </div>
          )}
        </div>
      </div>

      <PayslipPreviewModal
        open={previewSlip !== null}
        onClose={() => setPreviewSlip(null)}
        payslip={previewSlip}
        onDownload={() => previewSlip && handleSingleDownload(previewSlip)}
        onSend={() => previewSlip && handleSingleSend(previewSlip)}
      />
    </>
  );
};

export default PayslipsPanel;
