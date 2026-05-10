import { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  HiOutlineArrowDown,
  HiOutlineArrowUp,
  HiOutlineCash,
} from "react-icons/hi";
import CustomModal from "../../../components/common/CustomModal";
import CustomInput from "../../../components/common/CustomInput";
import CustomSelect from "../../../components/common/CustomSelect";

interface Props {
  open: boolean;
  onClose: () => void;
  type: "in" | "out";
  onSubmit: (data: any) => void;
  currentBalance: number;
}

const PettyCashModal = ({
  open,
  onClose,
  type,
  onSubmit,
  currentBalance,
}: Props) => {
  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<any>({
    defaultValues: {
      amount: "",
      reason: "",
      handledBy: "",
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        amount: "",
        reason: "",
        handledBy: "",
      });
    }
  }, [open, reset]);

  const amount = watch("amount");
  const isOut = type === "out";

  // Validate spend doesn't exceed balance
  const exceedsBalance = isOut && amount && Number(amount) > currentBalance;

  const handleFormSubmit = (data: any) => {
    onSubmit({
      ...data,
      type,
      amount: Number(data.amount),
      time: new Date().toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
    });
    onClose();
  };

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
      footer={
        <div className="flex items-center justify-between gap-3">
          <div className="text-xs text-slate-500">
            Current balance:{" "}
            <span className="font-bold text-slate-900">
              ₹{currentBalance.toLocaleString("en-IN")}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit(handleFormSubmit)}
              disabled={exceedsBalance}
              className={`px-5 py-2 rounded-lg text-white text-sm font-semibold shadow-md transition-all ${
                exceedsBalance
                  ? "bg-slate-300 cursor-not-allowed"
                  : isOut
                  ? "bg-red-600 hover:bg-red-700 hover:shadow-lg"
                  : "bg-emerald-600 hover:bg-emerald-700 hover:shadow-lg"
              }`}
            >
              {isOut ? "Record Expense" : "Add Cash"}
            </button>
          </div>
        </div>
      }
    >
      <div className="space-y-4">
        {/* Banner */}
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

        {/* Amount */}
        <CustomInput
          name="amount"
          control={control}
          label="Amount (₹)"
          placeholder="e.g. 500"
          isrequired
          errors={errors}
          rules={{
            required: "Amount is required",
            min: { value: 1, message: "Amount must be greater than 0" },
            pattern: {
              value: /^\d+$/,
              message: "Enter a valid number",
            },
          }}
        />

        {exceedsBalance && (
          <div className="rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-xs text-red-700 font-medium flex items-center gap-2">
            ⚠ Amount exceeds current balance of ₹
            {currentBalance.toLocaleString("en-IN")}
          </div>
        )}

        {/* Reason */}
        <CustomInput
          name="reason"
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

        {/* Handled By */}
        <CustomSelect
          name="handledBy"
          control={control}
          label="Handled By"
          placeholder="Who managed this transaction?"
          isrequired
          errors={errors}
          rules={{ required: "Select who handled this" }}
          options={[
            { value: "Devaa Balaji", label: "Devaa Balaji" },
            { value: "Suresh M.", label: "Suresh M." },
            { value: "Karthik R.", label: "Karthik R." },
            { value: "Divya B.", label: "Divya B." },
            { value: "Rajesh K.", label: "Rajesh K." },
          ]}
        />

        {/* Quick amount chips for "Add Cash" */}
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
                  onClick={() => {
                    reset({ amount: amt.toString() });
                  }}
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
