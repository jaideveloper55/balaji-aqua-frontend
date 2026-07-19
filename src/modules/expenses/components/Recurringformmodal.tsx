import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { DatePicker } from "antd";
import dayjs from "dayjs";
import { HiOutlineRefresh} from "react-icons/hi";
import CustomModal from "../../../components/common/CustomModal";
import CustomInput from "../../../components/common/CustomInput";
import CustomSelect from "../../../components/common/CustomSelect";
import type { RecurringExpense } from "../types/Expenses";

export interface RecurringFormValues {
  name: string;
  vendor: string;
  category: string;
  frequency: string;
  amount: string;
  nextDue: any;
}

interface Props {
  open: boolean;
  editItem?: RecurringExpense | null;
  onClose: () => void;
  onSubmit: (values: RecurringFormValues) => void;
  loading?: boolean;
}

const FREQUENCY_OPTIONS = [
  { value: "WEEKLY", label: "Weekly" },
  { value: "MONTHLY", label: "Monthly" },
  { value: "QUARTERLY", label: "Quarterly" },
  { value: "YEARLY", label: "Yearly" },
];

const CATEGORY_OPTIONS = [
  { value: "Utilities", label: "Utilities" },
  { value: "Vehicle & Fuel", label: "Vehicle & Fuel" },
  { value: "Plant Operations", label: "Plant Operations" },
  { value: "Packaging", label: "Packaging" },
  { value: "Rent & Lease", label: "Rent & Lease" },
  { value: "Repairs", label: "Repairs" },
  { value: "Office", label: "Office" },
  { value: "Compliance", label: "Compliance" },
  { value: "Marketing", label: "Marketing" },
];

const Recurringformmodal: React.FC<Props> = ({
  open,
  editItem,
  onClose,
  onSubmit,
  loading = false,
}) => {
  const isEdit = !!editItem;
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RecurringFormValues>({
    defaultValues: {
      name: "",
      vendor: "",
      category: "",
      frequency: "MONTHLY",
      amount: "",
      nextDue: dayjs().add(1, "month"),
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        name: editItem?.name ?? "",
        vendor: editItem?.vendor ?? "",
        category: editItem?.category ?? "",
        frequency: editItem?.frequency ?? "MONTHLY",
        amount: editItem?.amount ? String(editItem.amount) : "",
        nextDue: editItem?.nextDue
          ? dayjs(editItem.nextDue)
          : dayjs().add(1, "month"),
      });
    }
  }, [open, editItem, reset]);

  const footer = (
    <div className="flex gap-2">
      <button
        type="button"
        onClick={onClose}
        disabled={loading}
        className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-[13px] font-medium hover:bg-gray-50 disabled:opacity-50"
      >
        Cancel
      </button>
      <button
        type="button"
        onClick={handleSubmit(onSubmit)}
        disabled={loading}
        className="flex-[2] py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-[13px] font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
      >
        {loading ? (
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
            name="vendor"
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
            name="category"
            control={control}
            errors={errors}
            label="Category"
            placeholder="Select category"
            options={CATEGORY_OPTIONS}
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
