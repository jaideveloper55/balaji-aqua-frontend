import { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  HiOutlineCheckCircle,
  HiOutlineExclamation,
  HiOutlineRefresh,
} from "react-icons/hi";
import CustomModal from "../../../components/common/CustomModal";
import CustomInput from "../../../components/common/CustomInput";

interface Props {
  open: boolean;
  onClose: () => void;
  systemBalance: number;
  onSubmit: (data: any) => void;
}

const ReconcileModal = ({ open, onClose, systemBalance, onSubmit }: Props) => {
  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<any>({
    defaultValues: {
      physicalCash: "",
      notes: "",
    },
  });

  useEffect(() => {
    if (open) {
      reset({ physicalCash: "", notes: "" });
    }
  }, [open, reset]);

  const physicalCash = watch("physicalCash");
  const physicalNum = Number(physicalCash) || 0;
  const difference = physicalNum - systemBalance;
  const hasDiff = physicalCash && difference !== 0;
  const matches = physicalCash && difference === 0;

  const handleFormSubmit = (data: any) => {
    onSubmit({
      physicalCash: Number(data.physicalCash),
      systemBalance,
      difference,
      notes: data.notes,
      reconciledAt: new Date().toISOString(),
    });
    onClose();
  };

  return (
    <CustomModal
      open={open}
      onClose={onClose}
      title="Reconcile Petty Cash"
      subtitle="Match physical cash with system records"
      icon={<HiOutlineRefresh size={22} />}
      iconTone="green"
      size="lg"
      footer={
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit(handleFormSubmit)}
            className="px-5 py-2 rounded-lg bg-emerald-600 text-white text-sm font-semibold shadow-md hover:bg-emerald-700 hover:shadow-lg transition-all"
          >
            Confirm Reconciliation
          </button>
        </div>
      }
    >
      <div className="space-y-4">
        {/* System balance display */}
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
            <div className="text-4xl">💰</div>
          </div>
        </div>

        {/* Physical count input */}
        <CustomInput
          name="physicalCash"
          control={control}
          label="Physical Cash Count (₹)"
          placeholder="Count the actual cash in box"
          isrequired
          errors={errors}
          rules={{
            required: "Cash count is required",
            min: { value: 0, message: "Cannot be negative" },
            pattern: {
              value: /^\d+$/,
              message: "Enter a valid number",
            },
          }}
        />

        {/* Difference indicator */}
        {physicalCash && (
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
                <HiOutlineCheckCircle className="w-6 h-6 text-emerald-600" />
              ) : (
                <HiOutlineExclamation
                  className={`w-6 h-6 ${
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
                    ? "✓ Cash Matches Perfectly"
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

        {/* Notes */}
        {hasDiff && (
          <CustomInput
            name="notes"
            control={control}
            label="Notes (Required for mismatch)"
            placeholder="Explain the difference..."
            isrequired={!!hasDiff}
            errors={errors}
            rules={hasDiff ? { required: "Note required for mismatch" } : {}}
          />
        )}

        {!hasDiff && (
          <CustomInput
            name="notes"
            control={control}
            label="Notes (Optional)"
            placeholder="Any observations..."
            errors={errors}
          />
        )}
      </div>
    </CustomModal>
  );
};

export default ReconcileModal;
