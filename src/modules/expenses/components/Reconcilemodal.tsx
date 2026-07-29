import { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  HiOutlineCheckCircle,
  HiOutlineExclamationCircle,
  HiOutlineRefresh,
  HiOutlineCash,
} from "react-icons/hi";
import CustomModal from "../../../components/common/CustomModal";
import CustomInput from "../../../components/common/CustomInput";

interface Props {
  open: boolean;
  onClose: () => void;
  systemBalance: number;
  onSubmit: () => void;
  isSubmitting?: boolean;
}

interface ReconcileFormValues {
  physicalCash: string;
  notes: string;
}

const ReconcileModal = ({
  open,
  onClose,
  systemBalance,
  onSubmit,
  isSubmitting = false,
}: Props) => {
  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<ReconcileFormValues>({
    defaultValues: { physicalCash: "", notes: "" },
  });

  useEffect(() => {
    if (!open) return;
    reset({ physicalCash: "", notes: "" });
  }, [open, reset]);

  const physicalCash = watch("physicalCash");
  const physicalNum = Number(physicalCash) || 0;
  const difference = physicalNum - systemBalance;
  const hasCounted = physicalCash !== "" && physicalCash !== "0";
  const matches = hasCounted && difference === 0;
  const hasDiff = hasCounted && difference !== 0;

  const handleFormSubmit = () => {
    onSubmit();
  };

  const footer = (
    <div className="flex items-center justify-end gap-2">
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
        disabled={isSubmitting}
        className="px-5 py-2 rounded-lg bg-emerald-600 text-white text-sm font-semibold shadow-md hover:bg-emerald-700 hover:shadow-lg transition-all disabled:opacity-50 flex items-center gap-2"
      >
        {isSubmitting ? (
          <>
            <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            Reconciling...
          </>
        ) : (
          "Confirm Reconciliation"
        )}
      </button>
    </div>
  );

  return (
    <CustomModal
      open={open}
      onClose={onClose}
      title="Reconcile Petty Cash"
      subtitle="Match physical cash with system records"
      icon={<HiOutlineRefresh size={22} />}
      iconTone="green"
      size="lg"
      footer={footer}
    >
      <div className="space-y-4">
        <div className="rounded-xl bg-slate-50 border border-slate-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                System Balance
              </div>
              <div className="text-2xl font-bold text-slate-900 mt-1">
                ₹{systemBalance.toLocaleString("en-IN")}
              </div>
              <div className="text-xs text-slate-500 mt-0.5">
                As per recorded transactions
              </div>
            </div>

            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100">
              <HiOutlineCash className="w-8 h-8 text-emerald-600" />
            </div>
          </div>
        </div>

        <CustomInput
          name="physicalCash"
          control={control}
          label="Physical Cash Count (₹)"
          placeholder="Count the actual cash in box"
          isrequired
          numbersOnly
          errors={errors}
          rules={{
            required: "Cash count is required",
            validate: (v: string) => Number(v) >= 0 || "Cannot be negative",
          }}
        />

        {hasCounted && (
          <div
            className={`rounded-xl border p-4 ${
              matches
                ? "bg-emerald-50 border-emerald-200"
                : difference > 0
                ? "bg-blue-50 border-blue-200"
                : "bg-red-50 border-red-200"
            }`}
          >
            <div className="flex items-center gap-3">
              {matches ? (
                <HiOutlineCheckCircle className="w-6 h-6 text-emerald-600 shrink-0" />
              ) : (
                <HiOutlineExclamationCircle
                  className={`w-6 h-6 shrink-0 ${
                    difference > 0 ? "text-blue-600" : "text-red-600"
                  }`}
                />
              )}
              <div className="flex-1">
                <div
                  className={`font-bold ${
                    matches
                      ? "text-emerald-800"
                      : difference > 0
                      ? "text-blue-800"
                      : "text-red-800"
                  }`}
                >
                  {matches
                    ? "Cash Matches Perfectly"
                    : difference > 0
                    ? `Excess of ₹${Math.abs(difference).toLocaleString(
                        "en-IN"
                      )}`
                    : `Shortage of ₹${Math.abs(difference).toLocaleString(
                        "en-IN"
                      )}`}
                </div>
                <div
                  className={`text-xs mt-0.5 ${
                    matches
                      ? "text-emerald-700"
                      : difference > 0
                      ? "text-blue-700"
                      : "text-red-700"
                  }`}
                >
                  {matches
                    ? "All transactions reconciled successfully"
                    : difference > 0
                    ? "Physical cash is more than system records — investigate"
                    : "Physical cash is less than system records — investigate"}
                </div>
              </div>
            </div>
          </div>
        )}

        <CustomInput
          name="notes"
          control={control}
          label={hasDiff ? "Notes (Required for mismatch)" : "Notes (Optional)"}
          placeholder={
            hasDiff ? "Explain the difference..." : "Any observations..."
          }
          isrequired={hasDiff}
          errors={errors}
          rules={
            hasDiff
              ? { required: "Note is required when there is a mismatch" }
              : {}
          }
        />
      </div>
    </CustomModal>
  );
};

export default ReconcileModal;
