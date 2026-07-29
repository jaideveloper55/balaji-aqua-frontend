import { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  HiOutlineCog,
  HiOutlineCash,
  HiOutlineExclamationCircle,
  HiOutlineFolder,
} from "react-icons/hi";
import CustomModal from "../../../components/common/CustomModal";
import CustomInput from "../../../components/common/CustomInput";

interface ApiCategory {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  bg?: string;
  color?: string;
  monthlyBudget?: number;
  spentThisMonth?: number;
  transactions?: number;
}

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: { id: string; budget: number }) => void;
  category: ApiCategory | null;
  isSubmitting?: boolean;
}

interface BudgetFormValues {
  budget: string;
}

const BudgetModal = ({
  open,
  onClose,
  onSubmit,
  category,
  isSubmitting = false,
}: Props) => {
  const currentBudget = category?.monthlyBudget ?? 0;
  const currentSpent = category?.spentThisMonth ?? 0;

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<BudgetFormValues>({
    defaultValues: { budget: "" },
  });

  useEffect(() => {
    if (!open) return;
    reset({
      budget: currentBudget > 0 ? String(currentBudget) : "",
    });
  }, [open, currentBudget, reset]);

  const newBudget = Number(watch("budget")) || 0;
  const wouldBeOver = currentSpent > newBudget && newBudget > 0;
  const remaining = Math.abs(newBudget - currentSpent);

  const handleFormSubmit = (data: BudgetFormValues) => {
    if (!category) return;

    onSubmit({
      id: category.id,
      budget: Number(data.budget),
    });
  };

  if (!category) return null;

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
        className="px-5 py-2 rounded-lg bg-rose-600 text-white text-sm font-semibold shadow-md hover:bg-rose-700 transition-all disabled:opacity-50 flex items-center gap-2"
      >
        {isSubmitting ? (
          <>
            <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            Saving...
          </>
        ) : (
          "Save Budget"
        )}
      </button>
    </div>
  );

  return (
    <CustomModal
      open={open}
      onClose={onClose}
      title="Set Monthly Budget"
      subtitle={`Configure spending limit for ${category.name}`}
      icon={<HiOutlineCog size={22} />}
      iconTone="red"
      size="lg"
      footer={footer}
    >
      <div className="space-y-4">
        <div
          className="rounded-xl border p-4"
          style={{ background: category.bg ?? "#f8fafc" }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-xl border flex items-center justify-center text-2xl"
              style={{ background: "#fff", color: category.color ?? "#64748b" }}
            >
              {category.icon ?? <HiOutlineFolder className="w-5 h-5" />}
            </div>
            <div>
              <div
                className="font-bold"
                style={{ color: category.color ?? "#334155" }}
              >
                {category.name}
              </div>
              {category.description && (
                <div className="text-xs text-slate-500 mt-0.5">
                  {category.description}
                </div>
              )}
              <div className="text-xs text-slate-600 mt-0.5">
                Currently spent:{" "}
                <span className="font-semibold">
                  ₹{currentSpent.toLocaleString("en-IN")}
                </span>{" "}
                this month
                {category.transactions != null && (
                  <span className="ml-2 text-slate-400">
                    · {category.transactions} transaction
                    {category.transactions === 1 ? "" : "s"}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        <CustomInput
          name="budget"
          control={control}
          label="Monthly Budget (₹)"
          placeholder="e.g. 25000"
          isrequired
          numbersOnly
          errors={errors}
          rules={{
            required: "Budget is required",
            validate: (v: string) =>
              Number(v) >= 0 || "Budget cannot be negative",
          }}
        />

        {newBudget > 0 && (
          <div
            className={`rounded-xl border p-4 ${
              wouldBeOver
                ? "bg-red-50 border-red-200"
                : "bg-emerald-50 border-emerald-200"
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              <HiOutlineCash
                className={`w-4 h-4 ${
                  wouldBeOver ? "text-red-600" : "text-emerald-600"
                }`}
              />
              <span
                className={`text-xs font-semibold uppercase tracking-wider ${
                  wouldBeOver ? "text-red-700" : "text-emerald-700"
                }`}
              >
                Budget Preview
              </span>
            </div>
            <div className="space-y-1 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Budget</span>
                <span className="font-bold text-slate-900">
                  ₹{newBudget.toLocaleString("en-IN")}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Spent so far</span>
                <span className="font-bold text-slate-900">
                  ₹{currentSpent.toLocaleString("en-IN")}
                </span>
              </div>
              <div className="flex items-center justify-between pt-2 mt-2 border-t border-slate-200">
                <span
                  className={`font-bold ${
                    wouldBeOver ? "text-red-700" : "text-emerald-700"
                  }`}
                >
                  {wouldBeOver ? "Already over by" : "Remaining"}
                </span>
                <span
                  className={`font-bold ${
                    wouldBeOver ? "text-red-700" : "text-emerald-700"
                  }`}
                >
                  ₹{remaining.toLocaleString("en-IN")}
                </span>
              </div>
            </div>
            {wouldBeOver && (
              <div className="mt-3 text-xs text-red-700 font-medium">
                <HiOutlineExclamationCircle size={14} className="shrink-0" />
                Current spending already exceeds this budget
              </div>
            )}
          </div>
        )}
      </div>
    </CustomModal>
  );
};

export default BudgetModal;
