import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import {
  HiOutlineCheckCircle,
  HiOutlineExclamation,
  HiOutlineShieldCheck,
  HiOutlineDocumentText,
} from "react-icons/hi";
import CustomModal from "../../../components/common/CustomModal";
import CustomInput from "../../../components/common/CustomInput";
import CustomSelect from "../../../components/common/CustomSelect";
import type { EventOrder, PaymentMode } from "../types/Events";

interface CompleteEventModalProps {
  open: boolean;
  event: EventOrder | null;
  isSubmitting?: boolean;
  onRecordAndComplete: (amount: number, paymentMode: PaymentMode) => void;
  onCompleteAnyway: () => void;
  onClose: () => void;
}

const PAYMENT_MODE_OPTIONS = [
  { value: "CASH", label: "Cash" },
  { value: "UPI", label: "UPI" },
  { value: "BANK_TRANSFER", label: "Bank Transfer" },
  { value: "CARD", label: "Card" },
  { value: "CREDIT", label: "Credit" },
];

const formatINR = (n: number) =>
  `₹${(n ?? 0).toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;

interface FormValues {
  amount: string;
  paymentMode: PaymentMode;
}

const Completeeventmodal = ({
  open,
  event,
  isSubmitting = false,
  onRecordAndComplete,
  onCompleteAnyway,
  onClose,
}: CompleteEventModalProps) => {
  const balanceDue = event?.balanceDue ?? 0;
  const hasBalance = balanceDue > 0;
  const securityDeposit = event?.securityDeposit ?? 0;
  const hasSecurityDeposit = securityDeposit > 0;
  const hasNotes = !!event?.notes?.trim();

  const {
    control,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: { amount: "", paymentMode: "CASH" },
  });

  useEffect(() => {
    if (open && event) {
      reset({
        amount: balanceDue > 0 ? String(balanceDue) : "",
        paymentMode: "CASH",
      });
    }
  }, [open, event?.id]);

  const amountValue = Number(watch("amount")) || 0;
  const remainingAfter = useMemo(
    () => Math.max(0, +(balanceDue - amountValue).toFixed(2)),
    [balanceDue, amountValue]
  );

  if (!event) return null;

  const submitPayment = (values: FormValues) => {
    onRecordAndComplete(Number(values.amount), values.paymentMode);
  };

  const footer = hasBalance ? (
    <div className="flex flex-col items-stretch gap-2.5">
      <button
        type="button"
        onClick={handleSubmit(submitPayment)}
        disabled={isSubmitting}
        className="w-full px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700
          text-white text-sm font-semibold shadow-sm shadow-emerald-500/25
          transition disabled:opacity-50 flex items-center justify-center gap-2"
      >
        <HiOutlineCheckCircle size={17} />
        {isSubmitting ? "Saving..." : "Record Payment & Complete"}
      </button>
    </div>
  ) : (
    <button
      type="button"
      onClick={onCompleteAnyway}
      disabled={isSubmitting}
      className="w-full px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700
        text-white text-sm font-semibold shadow-sm shadow-emerald-500/25
        transition disabled:opacity-50 flex items-center justify-center gap-2"
    >
      <HiOutlineCheckCircle size={17} />
      {isSubmitting ? "Saving..." : "Mark as Completed"}
    </button>
  );

  return (
    <CustomModal
      open={open}
      onClose={onClose}
      title="Complete Event"
      subtitle={`${event.eventNumber} · ${event.eventName}`}
      icon={<HiOutlineExclamation size={22} />}
      iconTone="amber"
      size="md"
      closeOnOverlayClick={!isSubmitting}
      closeOnEsc={!isSubmitting}
      showCloseButton={!isSubmitting}
      footer={footer}
    >
      <div className="flex flex-col gap-5">
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-xl bg-slate-50 border border-slate-100 p-3">
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">
              Total
            </p>
            <p className="text-base font-bold text-slate-800 mt-1">
              {formatINR(event.totalAmount)}
            </p>
          </div>
          <div className="rounded-xl bg-emerald-50 border border-emerald-100 p-3">
            <p className="text-[11px] font-semibold text-emerald-600 uppercase tracking-wide">
              Already Paid
            </p>
            <p className="text-base font-bold text-emerald-700 mt-1">
              {formatINR(event.advancePaid)}
            </p>
          </div>
          <div className="rounded-xl bg-amber-50 border border-amber-200 p-3">
            <p className="text-[11px] font-semibold text-amber-600 uppercase tracking-wide">
              Balance Due
            </p>
            <p className="text-base font-bold text-amber-700 mt-1">
              {formatINR(balanceDue)}
            </p>
          </div>
        </div>

        {hasSecurityDeposit && (
          <div className="rounded-xl bg-indigo-50 border border-indigo-100 p-3 flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
              <HiOutlineShieldCheck size={16} />
            </div>
            <div>
              <p className="text-sm font-semibold text-indigo-700">
                Security Deposit Held: {formatINR(securityDeposit)}
              </p>
              <p className="text-xs text-indigo-500 mt-0.5">
                This is a refundable hold, not part of the event fee. Confirm
                all cans/equipment are returned before refunding it separately.
              </p>
            </div>
          </div>
        )}

        {hasNotes && (
          <div className="rounded-xl bg-slate-50 border border-slate-100 p-3 flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-200 text-slate-500 flex items-center justify-center shrink-0">
              <HiOutlineDocumentText size={16} />
            </div>
            <div>
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">
                Event Notes
              </p>
              <p className="text-sm text-slate-600 mt-0.5">{event.notes}</p>
            </div>
          </div>
        )}

        {hasBalance ? (
          <div className="border-t border-slate-100 pt-4">
            <p className="text-sm font-semibold text-slate-700 mb-3">
              Record final payment
            </p>

            <div className="flex flex-col gap-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-slate-600">
                    Amount received
                  </span>
                  <button
                    type="button"
                    onClick={() => setValue("amount", String(balanceDue))}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-700"
                  >
                    Pay full balance ({formatINR(balanceDue)})
                  </button>
                </div>
                <CustomInput
                  name="amount"
                  control={control}
                  errors={errors}
                  placeholder="0"
                  numbersOnly
                  rules={{
                    required: "Enter the amount received",
                    validate: (v: string) => {
                      const num = Number(v);
                      if (isNaN(num) || num <= 0)
                        return "Enter an amount greater than 0";
                      if (num > balanceDue)
                        return `Cannot exceed balance due (${formatINR(
                          balanceDue
                        )})`;
                      return true;
                    },
                  }}
                />
              </div>

              <CustomSelect
                label="Payment mode"
                name="paymentMode"
                control={control}
                errors={errors}
                placeholder="Select payment mode"
                options={PAYMENT_MODE_OPTIONS}
                rules={{ required: "Select a payment mode" }}
              />
            </div>

            <div
              className={`mt-3 rounded-lg px-3 py-2 text-xs font-medium ${
                remainingAfter > 0
                  ? "bg-amber-50 text-amber-700"
                  : "bg-emerald-50 text-emerald-700"
              }`}
            >
              {remainingAfter > 0
                ? `Event will be marked Completed with ${formatINR(
                    remainingAfter
                  )} still due.`
                : "This fully settles the balance — event will be marked Completed and fully paid."}
            </div>
          </div>
        ) : (
          <p className="text-sm text-emerald-600 font-medium">
            This event is already fully paid you can complete it directly.
          </p>
        )}
      </div>
    </CustomModal>
  );
};

export default Completeeventmodal;
