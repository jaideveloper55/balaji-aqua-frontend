import React, { useState, useEffect, useMemo } from "react";
import { InputNumber, message } from "antd";
import { useForm } from "react-hook-form";
import dayjs, { Dayjs } from "dayjs";
import {
  HiOutlineCash,
  HiOutlineCreditCard,
  HiOutlineExclamationCircle,
  HiOutlineCheckCircle,
  HiOutlineCheck,
  HiOutlineCalendar,
} from "react-icons/hi";
import { HiMiniQrCode, HiBuildingLibrary } from "react-icons/hi2";
import { Customer } from "../../types/billing";
import { formatCurrency } from "../../utils/Helpers";
import CustomModal from "../../../../components/common/CustomModal";
import CustomDateRange from "../../../../components/common/CustomDateRange";

export interface PaymentSplit {
  mode: "CASH" | "UPI" | "BANK_TRANSFER";
  amount: number;
  referenceId?: string;
}

interface Props {
  open: boolean;
  isProcessing: boolean;
  selectedCustomer: Customer | null;
  paymentMode: string;
  amountReceived: number;
  changeAmount: number;
  grandTotal: number;
  onPaymentModeChange: (mode: string) => void;
  onAmountReceivedChange: (val: number) => void;
  // splits is optional so the parent stays backward-compatible until wired
  onConfirm: (
    reference?: string,
    dueDate?: string,
    splits?: PaymentSplit[]
  ) => void;
  onClose: () => void;
}

const BUSINESS_UPI_ID = "balajiaqua@hdfc";
const BUSINESS_NAME = "Balaji Aqua Water Plant";

type FormShape = { dueDate: Dayjs | null };

const DUE_PRESETS = [
  { label: "7 Days", build: () => dayjs().add(7, "day") },
  { label: "15 Days", build: () => dayjs().add(15, "day") },
  { label: "30 Days", build: () => dayjs().add(30, "day") },
  { label: "End of Month", build: () => dayjs().endOf("month") },
];

// The three real-money split rows (credit is never a row — it's the leftover)
const SPLIT_ROWS: {
  mode: PaymentSplit["mode"];
  label: string;
  icon: React.ReactNode;
  needsRef: boolean;
}[] = [
  {
    mode: "CASH",
    label: "Cash",
    icon: <HiOutlineCash className="w-4 h-4 text-emerald-600" />,
    needsRef: false,
  },
  {
    mode: "UPI",
    label: "UPI",
    icon: <HiMiniQrCode className="w-4 h-4 text-blue-600" />,
    needsRef: true,
  },
  {
    mode: "BANK_TRANSFER",
    label: "Bank",
    icon: <HiBuildingLibrary className="w-4 h-4 text-purple-600" />,
    needsRef: true,
  },
];

const PaymentModal: React.FC<Props> = ({
  open,
  isProcessing,
  selectedCustomer,
  paymentMode,
  amountReceived,
  changeAmount,
  grandTotal,
  onPaymentModeChange,
  onAmountReceivedChange,
  onConfirm,
  onClose,
}) => {
  const [upiReference, setUpiReference] = useState("");
  const [upiVerified, setUpiVerified] = useState(false);

  // ── Split mode state ──
  const [isSplit, setIsSplit] = useState(false);
  const [splitAmounts, setSplitAmounts] = useState<
    Record<PaymentSplit["mode"], number>
  >({
    CASH: 0,
    UPI: 0,
    BANK_TRANSFER: 0,
  });
  const [splitRefs, setSplitRefs] = useState<
    Record<PaymentSplit["mode"], string>
  >({
    CASH: "",
    UPI: "",
    BANK_TRANSFER: "",
  });

  const {
    control,
    watch,
    setValue,
    formState: { errors },
    reset,
  } = useForm<FormShape>({
    defaultValues: { dueDate: dayjs().add(30, "day") },
    mode: "onChange",
  });

  const dueDate = watch("dueDate");

  // ── Split calculations ──
  const splitEntered = useMemo(
    () => splitAmounts.CASH + splitAmounts.UPI + splitAmounts.BANK_TRANSFER,
    [splitAmounts]
  );
  const splitCredit = Math.max(0, grandTotal - splitEntered);
  const splitOverpaid = splitEntered > grandTotal;

  // ── Single-mode partial / credit detection (unchanged) ──
  const isPartial =
    !isSplit &&
    paymentMode !== "credit" &&
    amountReceived > 0 &&
    amountReceived < grandTotal;

  // Due date needed when: single credit, single partial, or split leaves a credit remainder
  const showDueDateSection =
    (!isSplit && (paymentMode === "credit" || isPartial)) ||
    (isSplit && splitCredit > 0);

  // Reset everything when modal closes
  useEffect(() => {
    if (!open) {
      setUpiReference("");
      setUpiVerified(false);
      setIsSplit(false);
      setSplitAmounts({ CASH: 0, UPI: 0, BANK_TRANSFER: 0 });
      setSplitRefs({ CASH: "", UPI: "", BANK_TRANSFER: "" });
      reset({ dueDate: dayjs().add(30, "day") });
    }
  }, [open, reset]);

  useEffect(() => {
    setUpiReference("");
    setUpiVerified(false);
  }, [paymentMode]);

  // UPI link + QR (single-mode fast path)
  const upiLink = `upi://pay?pa=${encodeURIComponent(
    BUSINESS_UPI_ID
  )}&pn=${encodeURIComponent(
    BUSINESS_NAME
  )}&am=${grandTotal}&cu=INR&tn=${encodeURIComponent(
    `Invoice payment - ${selectedCustomer?.name || "Customer"}`
  )}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(
    upiLink
  )}`;

  const paymentMethods = [
    { key: "cash", label: "Cash", icon: <HiOutlineCash className="w-5 h-5" /> },
    { key: "upi", label: "UPI", icon: <HiMiniQrCode className="w-5 h-5" /> },
    {
      key: "card",
      label: "Card",
      icon: <HiOutlineCreditCard className="w-5 h-5" />,
    },
    {
      key: "bank",
      label: "Bank",
      icon: <HiBuildingLibrary className="w-5 h-5" />,
    },
    {
      key: "credit",
      label: "Credit",
      icon: <HiOutlineExclamationCircle className="w-5 h-5" />,
    },
  ];

  const validateDueDate = (): boolean => {
    if (!dueDate) {
      message.warning("Please select a due date");
      return false;
    }
    if (dueDate.isBefore(dayjs().startOf("day"))) {
      message.warning("Due date cannot be in the past");
      return false;
    }
    return true;
  };

  const handleConfirmSplit = () => {
    if (splitEntered <= 0 && splitCredit <= 0) {
      message.warning("Enter at least one payment amount");
      return;
    }
    if (splitOverpaid) {
      message.warning("Entered amount is more than the bill total");
      return;
    }
    // require a reference for any non-cash split that has an amount
    for (const row of SPLIT_ROWS) {
      if (
        row.needsRef &&
        splitAmounts[row.mode] > 0 &&
        !splitRefs[row.mode].trim()
      ) {
        message.warning(`Enter a reference for the ${row.label} payment`);
        return;
      }
    }
    if (splitCredit > 0 && !validateDueDate()) return;

    const splits: PaymentSplit[] = SPLIT_ROWS.filter(
      (r) => splitAmounts[r.mode] > 0
    ).map((r) => ({
      mode: r.mode,
      amount: splitAmounts[r.mode],
      referenceId: r.needsRef
        ? splitRefs[r.mode].trim() || undefined
        : undefined,
    }));

    onConfirm(
      undefined,
      splitCredit > 0 ? dueDate?.toISOString() : undefined,
      splits
    );
  };

  const handleConfirmSingle = () => {
    if (paymentMode === "upi" && !upiVerified) {
      message.warning("Please verify the UPI payment reference first");
      return;
    }
    if (showDueDateSection && !validateDueDate()) return;

    onConfirm(
      paymentMode === "upi" ? upiReference : undefined,
      showDueDateSection ? dueDate?.toISOString() : undefined
    );
  };

  const handleConfirm = () => {
    if (isSplit) handleConfirmSplit();
    else handleConfirmSingle();
  };

  const handleVerifyUPI = () => {
    if (!upiReference.trim()) {
      message.warning("Please enter the UPI transaction reference");
      return;
    }
    if (upiReference.trim().length < 6) {
      message.warning("Transaction reference looks too short");
      return;
    }
    setUpiVerified(true);
    message.success("UPI payment verified");
  };

  const copyUpiId = async () => {
    try {
      await navigator.clipboard.writeText(BUSINESS_UPI_ID);
      message.success("UPI ID copied!");
    } catch {
      message.info(`UPI ID: ${BUSINESS_UPI_ID}`);
    }
  };

  const applyPreset = (build: () => Dayjs) => {
    setValue("dueDate", build(), { shouldValidate: true });
  };
  const isPresetActive = (build: () => Dayjs): boolean =>
    dueDate ? dueDate.isSame(build(), "day") : false;

  const dueDaysFromNow = dueDate
    ? dueDate.diff(dayjs().startOf("day"), "day")
    : 0;

  // ── Confirm button label ──
  const confirmLabel = (() => {
    if (isSplit) {
      if (splitEntered > 0 && splitCredit > 0)
        return `Pay ${formatCurrency(splitEntered)} now · ${formatCurrency(
          splitCredit
        )} on credit`;
      if (splitEntered > 0) return `Confirm ${formatCurrency(splitEntered)}`;
      return `Credit Sale ${formatCurrency(grandTotal)}`;
    }
    if (isPartial) return `Pay ₹${amountReceived} (Partial)`;
    if (paymentMode === "credit")
      return `Confirm Credit Sale ${formatCurrency(grandTotal)}`;
    return `Confirm ${formatCurrency(grandTotal)}`;
  })();

  const confirmDisabled =
    isProcessing ||
    (!isSplit && paymentMode === "upi" && !upiVerified) ||
    (isSplit && splitOverpaid);

  // ── Footer ──
  const modalFooter = (
    <div className="flex gap-2">
      <button
        onClick={onClose}
        disabled={isProcessing}
        className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-[13px] font-medium hover:bg-gray-50 disabled:opacity-50"
      >
        Cancel
      </button>
      <button
        onClick={handleConfirm}
        disabled={confirmDisabled}
        className={`flex-[2] py-2.5 rounded-xl font-semibold text-[13px] flex items-center justify-center gap-2 transition-all
          ${
            confirmDisabled
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-200 active:scale-[0.98]"
          }`}
      >
        {isProcessing ? (
          <>
            <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <HiOutlineCheckCircle className="w-4 h-4" />
            {confirmLabel}
          </>
        )}
      </button>
    </div>
  );

  return (
    <CustomModal
      open={open}
      onClose={onClose}
      title="Process Payment"
      subtitle={
        selectedCustomer?.name ? `Bill for ${selectedCustomer.name}` : undefined
      }
      icon={<HiOutlineCash className="w-5 h-5" />}
      iconTone="green"
      size="lg"
      footer={modalFooter}
    >
      <div className="space-y-4">
        {/* Customer & Total */}
        <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl p-4 border border-emerald-100">
          <div className="text-[11px] text-emerald-600 font-medium uppercase tracking-wide mb-1">
            Bill For
          </div>
          <div className="text-[15px] font-bold text-gray-900 mb-2">
            {selectedCustomer?.name || "—"}
          </div>
          <div className="flex justify-between items-end">
            <span className="text-[12px] text-gray-500">Amount Due</span>
            <span className="text-2xl font-bold text-emerald-600">
              {formatCurrency(grandTotal)}
            </span>
          </div>
        </div>

        {/* Single / Split toggle */}
        <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1">
          <button
            onClick={() => setIsSplit(false)}
            className={`flex-1 py-2 rounded-lg text-[12px] font-semibold transition-all ${
              !isSplit ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"
            }`}
          >
            Single Payment
          </button>
          <button
            onClick={() => setIsSplit(true)}
            className={`flex-1 py-2 rounded-lg text-[12px] font-semibold transition-all ${
              isSplit ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"
            }`}
          >
            Split Payment
          </button>
        </div>

        {/* ════════════ SPLIT MODE ════════════ */}
        {isSplit ? (
          <div className="space-y-3">
            <div className="text-[11px] text-gray-500">
              Enter how much was paid in each mode. Anything left over becomes
              credit.
            </div>

            {SPLIT_ROWS.map((row) => (
              <div
                key={row.mode}
                className="bg-white border border-gray-100 rounded-xl p-3 space-y-2"
              >
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-gray-50 flex items-center justify-center">
                    {row.icon}
                  </div>
                  <span className="text-[13px] font-medium text-gray-700 flex-1">
                    {row.label}
                  </span>
                  <InputNumber
                    size="middle"
                    min={0}
                    value={splitAmounts[row.mode]}
                    onChange={(v) =>
                      setSplitAmounts((prev) => ({
                        ...prev,
                        [row.mode]: v || 0,
                      }))
                    }
                    prefix="₹"
                    className="w-32"
                  />
                </div>
                {row.needsRef && splitAmounts[row.mode] > 0 && (
                  <input
                    type="text"
                    value={splitRefs[row.mode]}
                    onChange={(e) =>
                      setSplitRefs((prev) => ({
                        ...prev,
                        [row.mode]: e.target.value,
                      }))
                    }
                    placeholder={`${row.label} reference / transaction ID`}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 text-[12px] font-mono placeholder:text-gray-300 focus:outline-none focus:border-blue-400 bg-white"
                  />
                )}
              </div>
            ))}

            {/* Totals */}
            <div className="bg-gray-50 rounded-xl p-3 space-y-1.5 text-[13px]">
              <div className="flex justify-between text-gray-600">
                <span>Entered</span>
                <span className="font-semibold text-gray-900">
                  {formatCurrency(splitEntered)}
                </span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Bill total</span>
                <span className="font-semibold text-gray-900">
                  {formatCurrency(grandTotal)}
                </span>
              </div>
              <div className="h-px bg-gray-200 my-1" />
              {splitOverpaid ? (
                <div className="flex justify-between text-red-600 font-semibold">
                  <span>Over by</span>
                  <span>{formatCurrency(splitEntered - grandTotal)}</span>
                </div>
              ) : splitCredit > 0 ? (
                <div className="flex justify-between text-amber-700 font-semibold">
                  <span>On credit (pay later)</span>
                  <span>{formatCurrency(splitCredit)}</span>
                </div>
              ) : (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Fully paid</span>
                  <span>{formatCurrency(grandTotal)}</span>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* ════════════ SINGLE MODE (unchanged) ════════════ */
          <>
            {/* Payment Mode Selector */}
            <div>
              <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2 block">
                Payment Method
              </label>
              <div className="grid grid-cols-5 gap-1.5">
                {paymentMethods.map((m) => {
                  const isActive = paymentMode === m.key;
                  return (
                    <button
                      key={m.key}
                      onClick={() => onPaymentModeChange(m.key)}
                      className={`p-2.5 rounded-xl border-2 flex flex-col items-center gap-1 transition-all
                        ${
                          isActive
                            ? "border-emerald-300 bg-emerald-50 text-emerald-700 ring-2 ring-emerald-100"
                            : "border-gray-100 hover:border-gray-200 text-gray-500"
                        }`}
                    >
                      {m.icon}
                      <span className="text-[10px] font-medium">{m.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* CASH */}
            {paymentMode === "cash" && (
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
                  Amount Received
                </label>
                <InputNumber
                  size="large"
                  value={amountReceived}
                  onChange={(v) => onAmountReceivedChange(v || 0)}
                  prefix="₹"
                  className="w-full"
                  autoFocus
                />
                {changeAmount > 0 && (
                  <div className="flex justify-between bg-amber-50 rounded-lg px-3 py-2 border border-amber-100">
                    <span className="text-[12px] text-amber-700 font-medium">
                      Change to return
                    </span>
                    <span className="text-[14px] font-bold text-amber-700">
                      {formatCurrency(changeAmount)}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* UPI */}
            {paymentMode === "upi" && (
              <div className="space-y-3">
                {!upiVerified ? (
                  <>
                    <div className="bg-white rounded-xl border-2 border-blue-100 p-4">
                      <div className="text-center mb-3">
                        <div className="text-[11px] font-semibold text-blue-600 uppercase tracking-wide mb-1">
                          Step 1 — Customer Scans
                        </div>
                        <div className="text-[12px] text-gray-500">
                          Show this QR or open their UPI app
                        </div>
                      </div>
                      <div className="flex justify-center mb-3">
                        <div className="bg-white p-2 rounded-lg border border-gray-200">
                          <img
                            src={qrCodeUrl}
                            alt="UPI QR Code"
                            className="w-48 h-48"
                          />
                        </div>
                      </div>
                      <div className="bg-gray-50 rounded-lg px-3 py-2 flex items-center justify-between">
                        <div>
                          <div className="text-[10px] text-gray-500 uppercase tracking-wide">
                            UPI ID
                          </div>
                          <div className="text-[13px] font-mono font-semibold text-gray-800">
                            {BUSINESS_UPI_ID}
                          </div>
                        </div>
                        <button
                          onClick={copyUpiId}
                          className="text-[11px] font-medium text-blue-600 hover:text-blue-700 px-2 py-1 rounded hover:bg-blue-50"
                        >
                          Copy
                        </button>
                      </div>
                      <div className="text-center text-[11px] text-gray-400 mt-2">
                        Works with GPay, PhonePe, Paytm, BHIM & all UPI apps
                      </div>
                    </div>

                    <div className="bg-blue-50/40 border border-blue-100 rounded-xl p-3.5">
                      <div className="text-[11px] font-semibold text-blue-600 uppercase tracking-wide mb-1">
                        Step 2 — Enter Reference
                      </div>
                      <div className="text-[12px] text-gray-600 mb-2.5">
                        After customer pays, enter the UPI Transaction ID from
                        your SMS or UPI app
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={upiReference}
                          onChange={(e) => setUpiReference(e.target.value)}
                          placeholder="e.g. 425912345678 or UPI Ref ID"
                          className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-[13px] font-mono placeholder:text-gray-300 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 bg-white"
                        />
                        <button
                          onClick={handleVerifyUPI}
                          className="px-4 py-2 rounded-lg bg-blue-600 text-white text-[12px] font-semibold hover:bg-blue-700 flex items-center gap-1"
                        >
                          <HiOutlineCheck className="w-4 h-4" />
                          Verify
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center">
                        <HiOutlineCheckCircle className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <div className="text-[14px] font-bold text-emerald-800">
                          Payment Verified
                        </div>
                        <div className="text-[11px] text-emerald-700">
                          Reference:{" "}
                          <span className="font-mono">{upiReference}</span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setUpiVerified(false);
                        setUpiReference("");
                      }}
                      className="text-[11px] text-emerald-700 underline hover:text-emerald-800"
                    >
                      Change reference
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* CARD */}
            {paymentMode === "card" && (
              <div className="bg-purple-50/40 border border-purple-100 rounded-xl p-4 text-center">
                <HiOutlineCreditCard className="w-10 h-10 text-purple-400 mx-auto mb-2" />
                <div className="text-[13px] font-semibold text-gray-800 mb-1">
                  Use POS Machine
                </div>
                <div className="text-[11px] text-gray-500">
                  Swipe customer's card on your card machine, then click Confirm
                  below
                </div>
              </div>
            )}

            {/* BANK */}
            {paymentMode === "bank" && (
              <div className="bg-indigo-50/40 border border-indigo-100 rounded-xl p-4">
                <div className="text-[11px] font-semibold text-indigo-600 uppercase tracking-wide mb-2">
                  Bank Transfer Reference
                </div>
                <input
                  type="text"
                  value={upiReference}
                  onChange={(e) => setUpiReference(e.target.value)}
                  placeholder="NEFT/IMPS/RTGS reference number"
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-[13px] font-mono placeholder:text-gray-300 focus:outline-none focus:border-indigo-400 bg-white"
                />
              </div>
            )}

            {/* CREDIT */}
            {paymentMode === "credit" && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <div className="flex items-start gap-2">
                  <HiOutlineExclamationCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-[13px] font-semibold text-amber-800 mb-1">
                      Credit Sale (Pay Later)
                    </div>
                    <div className="text-[11px] text-amber-700">
                      This invoice will be added to{" "}
                      <strong>{selectedCustomer?.name}'s</strong> outstanding
                      balance. No payment collected now.
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* ─── DUE DATE (single credit/partial OR split credit) ─── */}
        {showDueDateSection && (
          <div className="bg-blue-50/40 border border-blue-100 rounded-xl p-3.5 space-y-2.5">
            <div className="flex items-center gap-2">
              <HiOutlineCalendar className="w-4 h-4 text-blue-600" />
              <label className="text-[11px] font-bold text-blue-600 uppercase tracking-wider">
                Payment Due By
              </label>
            </div>
            <div className="flex gap-1.5 flex-wrap">
              {DUE_PRESETS.map((preset) => {
                const active = isPresetActive(preset.build);
                return (
                  <button
                    key={preset.label}
                    onClick={() => applyPreset(preset.build)}
                    className={`px-3 py-1.5 rounded-lg text-[11px] font-medium border transition-all
                      ${
                        active
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-white text-gray-600 border-gray-200 hover:border-blue-300"
                      }`}
                  >
                    {preset.label}
                  </button>
                );
              })}
            </div>
            <CustomDateRange
              name="dueDate"
              control={control}
              errors={errors}
              size="large"
              isrequired
              rules={{ required: "Due date is required" }}
            />
            {dueDate && (
              <div className="text-[11px] text-gray-500">
                {dueDaysFromNow === 0
                  ? "Due today"
                  : `Due in ${dueDaysFromNow} day${
                      dueDaysFromNow === 1 ? "" : "s"
                    } · ${dueDate.format("dddd, DD MMM YYYY")}`}
              </div>
            )}
          </div>
        )}
      </div>
    </CustomModal>
  );
};

export default PaymentModal;
