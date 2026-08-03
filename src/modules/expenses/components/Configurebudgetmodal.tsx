import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { HiOutlineCog, HiOutlineFolder } from "react-icons/hi";
import CustomModal from "../../../components/common/CustomModal";
import CustomInput from "../../../components/common/CustomInput";
import CustomSelect from "../../../components/common/CustomSelect";
import CustomTextArea from "../../../components/common/Customtextarea";

export interface BudgetFormValues {
  name: string;
  monthlyBudget: string;
  alertThreshold: string;
  rolloverRule: string;
  notes: string;
}

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
  percentUsed?: number;
}

interface Props {
  open: boolean;
  category: ApiCategory | null;
  isCustom?: boolean;
  onClose: () => void;
  onSubmit: (values: BudgetFormValues) => void;
  isSubmitting?: boolean;
}

const ALERT_OPTIONS = [
  { value: "80", label: "Alert at 80% used" },
  { value: "90", label: "Alert at 90% used" },
  { value: "100", label: "Alert only when over budget" },
  { value: "off", label: "No alerts" },
];

const Configurebudgetmodal: React.FC<Props> = ({
  open,
  category,
  isCustom = false,
  onClose,
  onSubmit,
  isSubmitting = false,
}) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BudgetFormValues>({
    defaultValues: {
      name: "",
      monthlyBudget: "",
      alertThreshold: "90",
      rolloverRule: "NONE",
      notes: "",
    },
  });

  useEffect(() => {
    if (!open) return;
    reset({
      name: category?.name ?? "",
      monthlyBudget: category?.monthlyBudget
        ? String(category.monthlyBudget)
        : "",
      alertThreshold: "90",
      rolloverRule: "NONE",
      notes: "",
    });
  }, [open, category, reset]);

  const title = isCustom ? "Add Custom Category" : "Configure Budget";
  const subtitle = isCustom
    ? "Create your own expense bucket"
    : category
    ? `Set monthly budget for ${category.name}`
    : "Set monthly budget";

  const footer = (
    <div className="flex gap-2">
      <button
        type="button"
        onClick={onClose}
        disabled={isSubmitting}
        className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-[13px] font-medium hover:bg-gray-50 disabled:opacity-50"
      >
        Cancel
      </button>
      <button
        type="button"
        onClick={handleSubmit(onSubmit)}
        disabled={isSubmitting}
        className="flex-[2] py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-[13px] font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
      >
        {isSubmitting ? (
          <>
            <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            Saving...
          </>
        ) : isCustom ? (
          "Create Category"
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
      title={title}
      subtitle={subtitle}
      icon={<HiOutlineCog className="w-5 h-5" />}
      iconTone="red"
      size="lg"
      footer={footer}
    >
      <div className="space-y-4">
        {!isCustom && category && (
          <div
            className="flex items-center gap-3 p-3 rounded-xl border border-slate-100"
            style={{ background: category.bg ?? "#f8fafc" }}
          >
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center text-lg"
              style={{ color: category.color ?? "#64748b", background: "#fff" }}
            >
              {category.icon ?? <HiOutlineFolder className="w-5 h-5" />}
            </div>
            <div>
              <p className="text-[14px] font-semibold text-slate-800">
                {category.name}
              </p>
              <p className="text-[12px] text-slate-500">
                Currently ₹
                {(category.spentThisMonth ?? 0).toLocaleString("en-IN")} spent ·{" "}
                {category.transactions ?? 0} transaction
                {(category.transactions ?? 0) === 1 ? "" : "s"}
              </p>
            </div>
          </div>
        )}

        {isCustom && (
          <CustomInput
            name="name"
            control={control}
            label="Category Name"
            placeholder="e.g. Insurance"
            errors={errors}
            isrequired
            rules={{ required: "Category name is required" }}
          />
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Monthly budget */}
          <CustomInput
            name="monthlyBudget"
            control={control}
            label="Monthly Budget (₹)"
            placeholder="0"
            errors={errors}
            isrequired
            numbersOnly
            rules={{
              required: "Monthly budget is required",
              validate: (v: string) =>
                Number(v) >= 0 || "Budget cannot be negative",
            }}
          />
          <CustomSelect
            name="alertThreshold"
            control={control}
            errors={errors}
            label="Alert Threshold"
            placeholder="Select threshold"
            options={ALERT_OPTIONS}
          />
        </div>

        {/* Notes */}
        <CustomTextArea
          name="notes"
          control={control}
          label="Notes (optional)"
          placeholder="Any notes about this budget..."
          errors={errors}
          rows={2}
          maxLength={200}
          showCount
        />
      </div>
    </CustomModal>
  );
};

export default Configurebudgetmodal;
