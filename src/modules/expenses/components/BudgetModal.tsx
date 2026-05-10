import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { HiOutlineCog, HiOutlineCash } from "react-icons/hi";
import { CATEGORY_META } from "../constants/Expenses.constants";
import CustomModal from "../../../components/common/CustomModal";
import CustomInput from "../../../components/common/CustomInput";

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  category: string | null;
  currentBudget: number;
  currentSpent: number;
}

const BudgetModal = ({
  open,
  onClose,
  onSubmit,
  category,
  currentBudget,
  currentSpent,
}: Props) => {
  const meta = category ? CATEGORY_META[category] : null;

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<any>({
    defaultValues: { budget: currentBudget.toString() },
  });

  useEffect(() => {
    if (open) {
      reset({ budget: currentBudget.toString() });
    }
  }, [open, currentBudget, reset]);

  const newBudget = Number(watch("budget")) || 0;
  const wouldBeOver = currentSpent > newBudget;

  const handleFormSubmit = (data: any) => {
    onSubmit({
      category,
      budget: Number(data.budget),
    });
    onClose();
  };

  if (!meta) return null;

  return (
    <CustomModal
      open={open}
      onClose={onClose}
      title="Set Monthly Budget"
      subtitle={`Configure spending limit for ${meta.label}`}
      icon={<HiOutlineCog size={22} />}
      iconTone="red"
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
            onClick={handleSubmit(handleFormSubmit)}
            className="px-5 py-2 rounded-lg bg-rose-600 text-white text-sm font-semibold shadow-md hover:bg-rose-700 transition-all"
          >
            Save Budget
          </button>
        </div>
      }
    >
      <div className="space-y-4">
        {/* Category banner */}
        <div className={`rounded-xl border p-4 ${meta.bg}`}>
          <div className="flex items-center gap-3">
            <div
              className={`w-12 h-12 rounded-xl ${meta.iconBg} border flex items-center justify-center text-2xl`}
            >
              {meta.icon}
            </div>
            <div>
              <div className={`font-bold ${meta.color}`}>{meta.label}</div>
              <div className="text-xs text-slate-600 mt-0.5">
                Currently spent:{" "}
                <span className="font-semibold">
                  ₹{currentSpent.toLocaleString("en-IN")}
                </span>{" "}
                this month
              </div>
            </div>
          </div>
        </div>

        {/* Budget input */}
        <CustomInput
          name="budget"
          control={control}
          label="Monthly Budget (₹)"
          placeholder="e.g. 25000"
          isrequired
          errors={errors}
          rules={{
            required: "Budget is required",
            min: { value: 0, message: "Must be 0 or greater" },
            pattern: { value: /^\d+$/, message: "Enter valid number" },
          }}
        />

        {/* Live preview */}
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
                  ₹{Math.abs(newBudget - currentSpent).toLocaleString("en-IN")}
                </span>
              </div>
            </div>
            {wouldBeOver && (
              <div className="mt-3 text-xs text-red-700 font-medium">
                ⚠ Current spending already exceeds this budget
              </div>
            )}
          </div>
        )}
      </div>
    </CustomModal>
  );
};

export default BudgetModal;
