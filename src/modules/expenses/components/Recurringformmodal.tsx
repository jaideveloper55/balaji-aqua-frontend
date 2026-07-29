import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { DatePicker } from "antd";
import dayjs, { Dayjs } from "dayjs";
import { HiOutlineRefresh } from "react-icons/hi";
import CustomModal from "../../../components/common/CustomModal";
import CustomInput from "../../../components/common/CustomInput";
import CustomSelect from "../../../components/common/CustomSelect";
import type { CreateRecurringPayload } from "../api/Expenses.api";

interface RecurringFormValues {
  name: string;
  vendorName: string;
  categoryName: string;
  frequency: string;
  amount: string;
  nextDue: Dayjs | null;
}

interface ApiRecurring {
  id: string;
  name: string;
  vendorName: string;
  categoryName: string;
  categoryId?: string;
  vendorId?: string;
  frequency: string;
  amount: number;
  nextDue: string;
  isPaused?: boolean;
  reminderDays?: number;
}

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (payload: CreateRecurringPayload) => void;
  initialData?: ApiRecurring | null;
  categories?: { id: string; name: string }[];
  isSubmitting?: boolean;
}

const FREQUENCY_OPTIONS = [
  { value: "WEEKLY", label: "Weekly" },
  { value: "MONTHLY", label: "Monthly" },
  { value: "QUARTERLY", label: "Quarterly" },
  { value: "YEARLY", label: "Yearly" },
];

const Recurringformmodal: React.FC<Props> = ({
  open,
  onClose,
  onSubmit,
  initialData = null,
  categories = [],
  isSubmitting = false,
}) => {
  const isEdit = !!initialData;

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RecurringFormValues>({
    defaultValues: {
      name: "",
      vendorName: "",
      categoryName: "",
      frequency: "MONTHLY",
      amount: "",
      nextDue: dayjs().add(1, "month"),
    },
  });

  useEffect(() => {
    if (!open) return;
    reset({
      name: initialData?.name ?? "",
      vendorName: initialData?.vendorName ?? "",
      categoryName: initialData?.categoryName ?? "",
      frequency: initialData?.frequency ?? "MONTHLY",
      amount: initialData?.amount ? String(initialData.amount) : "",
      nextDue: initialData?.nextDue
        ? dayjs(initialData.nextDue)
        : dayjs().add(1, "month"),
    });
  }, [open, initialData, reset]);

  const handleFormSubmit = (values: RecurringFormValues) => {
    const matchedCategory = categories.find(
      (c) => c.name === values.categoryName
    );

    const payload: CreateRecurringPayload = {
      name: values.name,
      vendorName: values.vendorName,
      categoryName: values.categoryName,
      categoryId: matchedCategory?.id ?? undefined,
      frequency: values.frequency as CreateRecurringPayload["frequency"],
      amount: Number(values.amount),
      nextDue: values.nextDue
        ? values.nextDue.format("YYYY-MM-DD")
        : dayjs().add(1, "month").format("YYYY-MM-DD"),
    };

    onSubmit(payload);
  };

  const categoryOptions = categories.map((c) => ({
    value: c.name,
    label: c.name,
  }));

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
        onClick={handleSubmit(handleFormSubmit)}
        disabled={isSubmitting}
        className="flex-[2] py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-[13px] font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
      >
        {isSubmitting ? (
          <>
            <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            Saving...
          </>
        ) : isEdit ? (
          "Update Schedule"
        ) : (
          "Add Recurring"
        )}
      </button>
    </div>
  );

  return (
    <CustomModal
      open={open}
      onClose={onClose}
      title={isEdit ? "Edit Recurring" : "Add Recurring Expense"}
      subtitle="Auto-generates an expense entry on each due date"
      icon={<HiOutlineRefresh className="w-5 h-5" />}
      iconTone="red"
      size="lg"
      footer={footer}
    >
      <div className="space-y-4">
        {/* Row 1: Name + Vendor */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CustomInput
            name="name"
            control={control}
            label="Expense Name"
            placeholder="e.g. Internet & WiFi"
            errors={errors}
            isrequired
            rules={{ required: "Name is required" }}
          />
          <CustomInput
            name="vendorName"
            control={control}
            label="Vendor / Payee"
            placeholder="e.g. Airtel Business"
            errors={errors}
            isrequired
            rules={{ required: "Vendor is required" }}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CustomSelect
            name="categoryName"
            control={control}
            errors={errors}
            label="Category"
            placeholder="Select category"
            options={categoryOptions}
            isrequired
            showSearch
            rules={{ required: "Category is required" }}
          />
          <CustomSelect
            name="frequency"
            control={control}
            errors={errors}
            label="Frequency"
            placeholder="Select frequency"
            options={FREQUENCY_OPTIONS}
            isrequired
            rules={{ required: "Frequency is required" }}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CustomInput
            name="amount"
            control={control}
            label="Amount (₹)"
            placeholder="0"
            errors={errors}
            isrequired
            numbersOnly
            rules={{
              required: "Amount is required",
              validate: (v: string) =>
                Number(v) > 0 || "Must be greater than 0",
            }}
          />
          <div className="flex flex-col gap-1 w-full">
            <label className="flex justify-start py-1 text-sm text-slate-700">
              Next Due Date <span className="text-red-500 ml-1">*</span>
            </label>
            <Controller
              name="nextDue"
              control={control}
              rules={{ required: "Due date is required" }}
              render={({ field }) => (
                <DatePicker
                  {...field}
                  format="YYYY-MM-DD"
                  className="w-full"
                  status={errors.nextDue ? "error" : undefined}
                  placeholder="Select date"
                />
              )}
            />
            {errors.nextDue && (
              <p className="text-red-500 text-sm">
                {errors.nextDue.message as string}
              </p>
            )}
          </div>
        </div>
      </div>
    </CustomModal>
  );
};

export default Recurringformmodal;
