import React, { useState } from "react";
import {
  HiOutlineCheckCircle,
  HiOutlineExclamationCircle,
} from "react-icons/hi";
import CustomModal from "../../../components/common/CustomModal";
import { formatCurrency } from "../../billing/utils/Helpers";
import { EventOrder } from "../types/Events";

type PaymentModeOption = "CASH" | "UPI" | "BANK_TRANSFER" | "CARD";

interface Props {
  open: boolean;
  event: EventOrder | null;
  isSubmitting?: boolean;
  onRecordAndComplete: (amount: number, paymentMode: PaymentModeOption) => void;
  onCompleteAnyway: () => void;
  onClose: () => void;
}

const PAYMENT_MODES: { value: PaymentModeOption; label: string }[] = [
  { value: "CASH", label: "Cash" },
  { value: "UPI", label: "UPI" },
  { value: "BANK_TRANSFER", label: "Bank Transfer" },
  { value: "CARD", label: "Card" },
];

const Completeeventmodal: React.FC<Props> = ({
  open,
  event,
  isSubmitting,
  onRecordAndComplete,
  onCompleteAnyway,
  onClose,
}) => {
  const [paymentMode, setPaymentMode] = useState<PaymentModeOption>("CASH");

  if (!event) return null;

  const balanceDue = event.balanceDue ?? 0;

  return (
    <CustomModal
      open={open}
      onClose={onClose}
      title="Complete Event Order"
      subtitle={`${event.eventNumber} — ${event.customerName}`}
      icon={<HiOutlineCheckCircle className="w-5 h-5" />}
      iconTone="amber"
      size="md"
      closeOnOverlayClick={!isSubmitting}
      closeOnEsc={!isSubmitting}
      showCloseButton={!isSubmitting}
      footer={
        <div className="flex flex-col gap-2">
          <button
            onClick={() => onRecordAndComplete(balanceDue, paymentMode)}
            disabled={isSubmitting}
            className="w-full px-4 py-2.5 text-[13px] font-semibold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting
              ? "Processing..."
              : `Yes, Record ${formatCurrency(balanceDue)} & Complete`}
          </button>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 text-[13px] font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              onClick={onCompleteAnyway}
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 text-[13px] font-medium text-amber-700 bg-amber-50 border border-amber-200 rounded-lg hover:bg-amber-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Complete Anyway
            </button>
          </div>
        </div>
      }
    >
      <div className="space-y-4">
        <div className="flex items-start gap-3 bg-amber-50 border border-amber-100 rounded-xl p-4">
          <HiOutlineExclamationCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
          <p className="text-[13px] text-amber-800">
            This event still has a pending balance. Marking it Completed won't
            clear the balance on its own — confirm whether the remaining amount
            has actually been received.
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center text-[13px]">
            <span className="text-gray-500">Total Amount</span>
            <span className="font-semibold text-gray-900">
              {formatCurrency(event.totalAmount ?? 0)}
            </span>
          </div>
          <div className="flex justify-between items-center text-[13px]">
            <span className="text-gray-500">Already Paid</span>
            <span className="font-semibold text-emerald-600">
              {formatCurrency(event.advancePaid ?? 0)}
            </span>
          </div>
          <div className="flex justify-between items-center text-[13px] border-t border-gray-100 pt-2">
            <span className="text-gray-700 font-medium">Balance Due</span>
            <span className="font-bold text-amber-600 text-[15px]">
              {formatCurrency(balanceDue)}
            </span>
          </div>
        </div>

        <div>
          <label className="text-[12px] font-medium text-gray-600 mb-1.5 block">
            If paid, how was the remaining {formatCurrency(balanceDue)}{" "}
            received?
          </label>
          <div className="grid grid-cols-2 gap-2">
            {PAYMENT_MODES.map((m) => (
              <button
                key={m.value}
                type="button"
                onClick={() => setPaymentMode(m.value)}
                className={`px-3 py-2 rounded-lg text-[12px] font-medium border transition-colors ${
                  paymentMode === m.value
                    ? "bg-emerald-600 text-white border-emerald-600"
                    : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </CustomModal>
  );
};

export default Completeeventmodal;
