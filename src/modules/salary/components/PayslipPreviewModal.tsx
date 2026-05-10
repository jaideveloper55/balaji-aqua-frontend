import {
  HiOutlineDocumentText,
  HiOutlineDocumentDownload,
  HiOutlinePaperAirplane,
  HiOutlinePrinter,
} from "react-icons/hi";
import CustomModal from "../../../components/common/CustomModal";

interface PayslipData {
  id?: string;
  payslipNumber?: string;
  employeeId: string;
  name: string;
  designation: string;
  department?: string;
  month: string;
  workingDays?: number;
  presentDays?: number;
  payableDays?: number;
  baseSalary: number;
  hra?: number;
  conveyance?: number;
  food?: number;
  otHours?: number;
  otAmount?: number;
  incentive?: number;
  grossSalary?: number;
  pf?: number;
  esi?: number;
  tds?: number;
  loanEMI?: number;
  jarDamage?: number;
  absentDeduction?: number;
  totalDeductions?: number;
  netSalary: number;
  paymentMode?: string;
  paidOn?: string;
  bankAccount?: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  payslip: PayslipData | null;
  onDownload?: () => void;
  onSend?: () => void;
}

const formatINR = (n: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);

const Row = ({
  label,
  value,
  bold = false,
  isDeduction = false,
  source,
}: {
  label: string;
  value: number;
  bold?: boolean;
  isDeduction?: boolean;
  source?: string;
}) => (
  <div
    className={`flex items-center justify-between py-1.5 ${
      bold ? "border-t border-slate-200 pt-2 mt-2" : ""
    }`}
  >
    <span
      className={`text-sm flex items-center gap-1.5 ${
        bold ? "font-bold text-slate-900" : "text-slate-600"
      }`}
    >
      {label}
      {source && (
        <span className="text-[9px] px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 font-bold">
          {source}
        </span>
      )}
    </span>
    <span
      className={`text-sm tabular-nums ${
        bold
          ? `font-bold ${isDeduction ? "text-red-700" : "text-emerald-700"}`
          : `font-semibold ${isDeduction ? "text-red-600" : "text-slate-900"}`
      }`}
    >
      {isDeduction && value > 0 ? "−" : ""}
      {formatINR(value)}
    </span>
  </div>
);

const PayslipPreviewModal = ({
  open,
  onClose,
  payslip,
  onDownload,
  onSend,
}: Props) => {
  if (!payslip) return null;

  const earnings = {
    baseSalary: payslip.baseSalary,
    hra: payslip.hra || 0,
    conveyance: payslip.conveyance || 0,
    food: payslip.food || 0,
    otAmount: payslip.otAmount || 0,
    incentive: payslip.incentive || 0,
  };
  const totalEarnings =
    payslip.grossSalary || Object.values(earnings).reduce((s, v) => s + v, 0);

  const deductions = {
    pf: payslip.pf || 0,
    esi: payslip.esi || 0,
    tds: payslip.tds || 0,
    loanEMI: payslip.loanEMI || 0,
    jarDamage: payslip.jarDamage || 0,
    absentDeduction: payslip.absentDeduction || 0,
  };
  const totalDeductions =
    payslip.totalDeductions ||
    Object.values(deductions).reduce((s, v) => s + v, 0);

  return (
    <CustomModal
      open={open}
      onClose={onClose}
      title={`Payslip — ${payslip.month}`}
      subtitle={`${payslip.name} · ${payslip.employeeId}`}
      icon={<HiOutlineDocumentText size={22} />}
      iconTone="green"
      size="3xl"
      footer={
        <div className="flex items-center justify-between gap-3">
          <div className="text-xs text-slate-500">
            Net Pay:{" "}
            <span className="text-emerald-700 font-bold text-base">
              {formatINR(payslip.netSalary)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors"
            >
              Close
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-700 text-sm font-semibold hover:bg-slate-50 transition-colors"
            >
              <HiOutlinePrinter className="w-4 h-4" />
              Print
            </button>
            <button
              type="button"
              onClick={onSend}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-blue-50 border border-blue-200 text-blue-700 text-sm font-semibold hover:bg-blue-100 transition-colors"
            >
              <HiOutlinePaperAirplane className="w-4 h-4" />
              Send
            </button>
            <button
              type="button"
              onClick={onDownload}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-semibold shadow-md hover:bg-emerald-700 transition-all"
            >
              <HiOutlineDocumentDownload className="w-4 h-4" />
              Download PDF
            </button>
          </div>
        </div>
      }
    >
      <div className="space-y-5">
        {/* Company header (printable) */}
        <div className="text-center pb-4 border-b border-slate-200">
          <h3 className="text-xl font-bold text-slate-900">
            Balaji Aqua Water Plant
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Pure water for a healthier life
          </p>
          <p className="text-[10px] text-slate-400 mt-1">
            Payslip #
            {payslip.payslipNumber ||
              `PS-${payslip.employeeId}-${payslip.month}`}
          </p>
        </div>

        {/* Employee info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-50/60 rounded-xl border border-slate-200 p-4">
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
              Employee
            </div>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Name</span>
                <span className="font-semibold text-slate-900">
                  {payslip.name}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Employee ID</span>
                <span className="font-mono font-semibold text-slate-900">
                  {payslip.employeeId}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Designation</span>
                <span className="font-semibold text-slate-900">
                  {payslip.designation}
                </span>
              </div>
              {payslip.department && (
                <div className="flex justify-between">
                  <span className="text-slate-500">Department</span>
                  <span className="font-semibold text-slate-900">
                    {payslip.department}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="bg-slate-50/60 rounded-xl border border-slate-200 p-4">
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
              Pay Period
            </div>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Month</span>
                <span className="font-semibold text-slate-900">
                  {payslip.month}
                </span>
              </div>
              {payslip.workingDays !== undefined && (
                <div className="flex justify-between">
                  <span className="text-slate-500">Working Days</span>
                  <span className="font-semibold text-slate-900">
                    {payslip.workingDays}
                  </span>
                </div>
              )}
              {payslip.presentDays !== undefined && (
                <div className="flex justify-between">
                  <span className="text-slate-500">Present Days</span>
                  <span className="font-semibold text-emerald-700">
                    {payslip.presentDays}
                  </span>
                </div>
              )}
              {payslip.payableDays !== undefined && (
                <div className="flex justify-between">
                  <span className="text-slate-500">Payable Days</span>
                  <span className="font-semibold text-slate-900">
                    {payslip.payableDays}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Earnings + Deductions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Earnings */}
          <div className="bg-emerald-50/40 rounded-xl border border-emerald-200 p-4">
            <div className="text-xs font-bold text-emerald-700 uppercase tracking-wider mb-3">
              Earnings
            </div>
            <Row label="Base Salary" value={earnings.baseSalary} />
            {earnings.hra > 0 && <Row label="HRA" value={earnings.hra} />}
            {earnings.conveyance > 0 && (
              <Row label="Conveyance" value={earnings.conveyance} />
            )}
            {earnings.food > 0 && (
              <Row label="Food Allowance" value={earnings.food} />
            )}
            {earnings.otAmount > 0 && (
              <Row
                label={`Overtime${
                  payslip.otHours ? ` (${payslip.otHours} hrs)` : ""
                }`}
                value={earnings.otAmount}
                source="ATTENDANCE"
              />
            )}
            {earnings.incentive > 0 && (
              <Row label="Incentive" value={earnings.incentive} />
            )}
            <Row label="Gross Earnings" value={totalEarnings} bold />
          </div>

          {/* Deductions */}
          <div className="bg-red-50/40 rounded-xl border border-red-200 p-4">
            <div className="text-xs font-bold text-red-700 uppercase tracking-wider mb-3">
              Deductions
            </div>
            {deductions.pf > 0 && (
              <Row label="PF (12%)" value={deductions.pf} isDeduction />
            )}
            {deductions.esi > 0 && (
              <Row label="ESI" value={deductions.esi} isDeduction />
            )}
            {deductions.tds > 0 && (
              <Row label="TDS" value={deductions.tds} isDeduction />
            )}
            {deductions.absentDeduction > 0 && (
              <Row
                label={`Absent Days${
                  payslip.workingDays && payslip.presentDays
                    ? ` (${payslip.workingDays - payslip.presentDays})`
                    : ""
                }`}
                value={deductions.absentDeduction}
                isDeduction
              />
            )}
            {deductions.loanEMI > 0 && (
              <Row
                label="Loan EMI"
                value={deductions.loanEMI}
                isDeduction
                source="LOANS"
              />
            )}
            {deductions.jarDamage > 0 && (
              <Row
                label="Jar Damage"
                value={deductions.jarDamage}
                isDeduction
                source="JAR TRACKING"
              />
            )}
            <Row
              label="Total Deductions"
              value={totalDeductions}
              bold
              isDeduction
            />
          </div>
        </div>

        {/* Net pay banner */}
        <div className="bg-gradient-to-r from-emerald-50 via-emerald-50 to-teal-50 border border-emerald-300 rounded-2xl p-5">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <div className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                Net Salary Payable
              </div>
              <div className="text-3xl font-bold text-emerald-800 mt-1">
                {formatINR(payslip.netSalary)}
              </div>
              {payslip.paymentMode && (
                <div className="text-xs text-emerald-700 mt-1">
                  Via {payslip.paymentMode.toUpperCase()}
                  {payslip.paidOn && ` · Paid on ${payslip.paidOn}`}
                </div>
              )}
            </div>
            <div className="text-5xl">💰</div>
          </div>
        </div>

        {/* Footer note */}
        <div className="text-center text-[10px] text-slate-400 pt-3 border-t border-dashed border-slate-200">
          This is a computer-generated payslip. No signature required.
        </div>
      </div>
    </CustomModal>
  );
};

export default PayslipPreviewModal;
