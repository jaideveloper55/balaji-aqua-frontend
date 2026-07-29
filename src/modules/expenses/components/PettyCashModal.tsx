import { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  HiOutlineArrowDown,
  HiOutlineArrowUp,
  HiOutlineCash,
  HiOutlineExclamationCircle,
} from "react-icons/hi";
import CustomModal from "../../../components/common/CustomModal";
import CustomInput from "../../../components/common/CustomInput";
import type { AddCashPayload, SpendCashPayload } from "../api/Expenses.api";

interface PettyCashFormValues {
  amount: string;
  description: string;
  handledByName: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  type: "in" | "out";
  onSubmit: (data: AddCashPayload | SpendCashPayload) => void;
  currentBalance: number;
  isSubmitting?: boolean;
}

const PettyCashModal = ({
  open,
  onClose,
  type,
  onSubmit,
  currentBalance,
  isSubmitting = false,
}: Props) => {
  const isOut = type === "out";

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<PettyCashFormValues>({
    defaultValues: {
      amount: "",
      description: "",
      handledByName: "",
    },
  });

  useEffect(() => {
    if (!open) return;
    reset({ amount: "", description: "", handledByName: "" });
  }, [open, reset]);

  const amount = watch("amount");

  const exceedsBalance =
    isOut && Number(amount) > currentBalance && Number(amount) > 0;

  const handleFormSubmit = (values: PettyCashFormValues) => {
    const payload: AddCashPayload | SpendCashPayload = {
      amount: Number(values.amount),
      description: values.description,
      handledByName: values.handledByName || undefined,
    };
    onSubmit(payload);
  };

  const footer = (
    <div className="flex items-center justify-between gap-3">
      <div className="text-xs text-slate-500">
        Current balance:{" "}
        <span className="font-bold text-slate-900">
          ₹{currentBalance.toLocaleString("en-IN")}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onClose}
          disabled={isSubmitting}
          className="px-4 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSubmit(handleFormSubmit)}
          disabled={exceedsBalance || isSubmitting}
          className={`px-5 py-2 rounded-lg text-white text-sm font-semibold shadow-md transition-all flex items-center gap-2 ${
            exceedsBalance || isSubmitting
              ? "bg-slate-300 cursor-not-allowed"
              : isOut
              ? "bg-red-600 hover:bg-red-700 hover:shadow-lg"
              : "bg-emerald-600 hover:bg-emerald-700 hover:shadow-lg"
          }`}
        >
          {isSubmitting ? (
            <>
              <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              Saving...
            </>
          ) : isOut ? (
            "Record Expense"
          ) : (
            "Add Cash"
          )}
        </button>
      </div>
    </div>
  );

  return (
    <CustomModal
      open={open}
      onClose={onClose}
      title={isOut ? "Spend Cash" : "Add Cash to Box"}
      subtitle={
        isOut
          ? "Record a cash expense from petty cash"
          : "Top-up your petty cash box"
      }
      icon={
        isOut ? (
          <HiOutlineArrowUp size={22} />
        ) : (
          <HiOutlineArrowDown size={22} />
        )
      }
      iconTone={isOut ? "red" : "green"}
      size="lg"
      footer={footer}
    >
      <div className="space-y-4">
        <div
          className={`rounded-xl border p-4 flex items-center gap-3 ${
            isOut
              ? "bg-red-50/60 border-red-100"
              : "bg-emerald-50/60 border-emerald-100"
          }`}
        >
          <div
            className={`p-2 rounded-lg ${
              isOut ? "bg-red-100" : "bg-emerald-100"
            }`}
          >
            <HiOutlineCash
              className={`w-5 h-5 ${
                isOut ? "text-red-600" : "text-emerald-600"
              }`}
            />
          </div>
          <div>
            <div className="text-sm font-semibold text-slate-900">
              {isOut ? "Cash Going Out of Box" : "Cash Coming Into Box"}
            </div>
            <div className="text-xs text-slate-600 mt-0.5">
              {isOut
                ? "This will be deducted from petty cash"
                : "Bank withdrawal, top-up, or refund"}
            </div>
          </div>
        </div>

        <CustomInput
          name="amount"
          control={control}
          label="Amount (₹)"
          placeholder="e.g. 500"
          isrequired
          numbersOnly
          errors={errors}
          rules={{
            required: "Amount is required",
            validate: (v: string) =>
              Number(v) > 0 || "Amount must be greater than 0",
          }}
        />

        {exceedsBalance && (
          <div className="rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-xs text-red-700 font-medium flex items-center gap-2">
            <HiOutlineExclamationCircle size={14} className="shrink-0" />
            Amount exceeds current balance of ₹
            {currentBalance.toLocaleString("en-IN")}
          </div>
        )}

        <CustomInput
          name="description"
          control={control}
          label={isOut ? "Reason / Description" : "Source / Description"}
          placeholder={
            isOut
              ? "e.g. Tea & snacks for loaders"
              : "e.g. Top-up from main account"
          }
          isrequired
          errors={errors}
          rules={{
            required: "Description is required",
            minLength: { value: 3, message: "Too short" },
          }}
        />

        <CustomInput
          name="handledByName"
          control={control}
          label="Handled By"
          placeholder="e.g. Devaa Balaji"
          errors={errors}
          rules={{
            minLength: { value: 2, message: "Name too short" },
          }}
        />

        {!isOut && (
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Quick amounts
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {[1000, 2000, 5000, 10000].map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setValue("amount", String(amt))}
                  className="px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold hover:bg-emerald-100 transition-colors"
                >
                  ₹{amt.toLocaleString("en-IN")}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </CustomModal>
  );
};

export default PettyCashModal;
