import {
  HiOutlineCheckCircle,
  HiOutlineLightningBolt,
  HiOutlineCash,
} from "react-icons/hi";
import CustomModal from "../../../components/common/CustomModal";

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  variant: "approve" | "process" | "pay";
  totalEmployees: number;
  totalAmount: number;
}

const formatINR = (n: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);

const PayrollConfirmModal = ({
  open,
  onClose,
  onConfirm,
  title,
  description,
  variant,
  totalEmployees,
  totalAmount,
}: Props) => {
  const config = {
    approve: {
      icon: <HiOutlineCheckCircle size={22} />,
      tone: "blue" as const,
      btnLabel: "Approve All",
      btnClass: "bg-blue-600 hover:bg-blue-700",
      bannerBg: "bg-blue-50/60 border-blue-100",
      bannerColor: "text-blue-600",
    },
    process: {
      icon: <HiOutlineLightningBolt size={22} />,
      tone: "amber" as const,
      btnLabel: "Process Payroll",
      btnClass: "bg-amber-600 hover:bg-amber-700",
      bannerBg: "bg-amber-50/60 border-amber-100",
      bannerColor: "text-amber-600",
    },
    pay: {
      icon: <HiOutlineCash size={22} />,
      tone: "green" as const,
      btnLabel: "Pay Now",
      btnClass: "bg-emerald-600 hover:bg-emerald-700",
      bannerBg: "bg-emerald-50/60 border-emerald-100",
      bannerColor: "text-emerald-600",
    },
  }[variant];

  return (
    <CustomModal
      open={open}
      onClose={onClose}
      title={title}
      subtitle={description}
      icon={config.icon}
      iconTone={config.tone}
      size="lg"
      footer={
        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`px-5 py-2 rounded-lg text-white text-sm font-semibold shadow-md transition-all ${config.btnClass}`}
          >
            {config.btnLabel}
          </button>
        </div>
      }
    >
      <div className="space-y-4">
        <div
          className={`rounded-xl border p-4 flex items-center gap-3 ${config.bannerBg}`}
        >
          <div className={`p-2 rounded-lg bg-white ${config.bannerColor}`}>
            {config.icon}
          </div>
          <div>
            <div className="text-sm font-semibold text-slate-900">
              You're about to {config.btnLabel.toLowerCase()}
            </div>
            <div className="text-xs text-slate-600 mt-0.5">
              This action will affect all selected employees
            </div>
          </div>
        </div>

        {/* Summary card */}
        <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 space-y-3">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Summary
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600">Total Employees</span>
              <span className="font-bold text-slate-900">{totalEmployees}</span>
            </div>
            <div className="flex items-center justify-between text-sm pt-2 mt-2 border-t border-slate-200">
              <span className="text-slate-600 font-semibold">Total Amount</span>
              <span className="text-2xl font-bold text-emerald-700">
                {formatINR(totalAmount)}
              </span>
            </div>
          </div>
        </div>

        {variant === "pay" && (
          <div className="rounded-xl bg-amber-50 border border-amber-200 p-3 text-xs text-amber-800">
            ⚠ This will mark all approved entries as paid. Make sure bank
            transfers are completed first.
          </div>
        )}
      </div>
    </CustomModal>
  );
};

export default PayrollConfirmModal;
