import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import dayjs, { Dayjs } from "dayjs";
import { HiOutlineReceiptTax } from "react-icons/hi";
import { DatePicker } from "antd";
import CustomModal from "../../../components/common/CustomModal";
import CustomInput from "../../../components/common/CustomInput";
import CustomSelect from "../../../components/common/CustomSelect";
import CustomTextArea from "../../../components/common/Customtextarea";
import type { CreateExpensePayload } from "../api/Expenses.api";
import { Expense } from "../types/Expenses";

interface ExpenseFormValues {
  vendorName: string;
  description: string;
  categoryName: string;
  amount: string;
  gstAmount: string;
  paymentMode: string;
  status: string;
  date: Dayjs | null;
  notes: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (payload: CreateExpensePayload) => void;
  initialData?: Expense | null;
  categories?: { id: string; name: string }[];
  vendors?: { id: string; name: string; category?: string }[];
  isSubmitting?: boolean;
}

const PAYMENT_OPTIONS = [
  { value: "CASH", label: "Cash" },
  { value: "UPI", label: "UPI" },
  { value: "BANK_TRANSFER", label: "Bank Transfer" },
  { value: "CARD", label: "Card" },
  { value: "CHEQUE", label: "Cheque" },
];

const STATUS_OPTIONS = [
  { value: "PAID", label: "Paid" },
  { value: "APPROVED", label: "Approved" },
  { value: "PENDING", label: "Pending" },
  { value: "REJECTED", label: "Rejected" },
];

const Expenseformmodal: React.FC<Props> = ({
  open,
  onClose,
  onSubmit,
  initialData = null,
  categories = [],
  vendors = [],
  isSubmitting = false,
}) => {
  const isEdit = !!initialData;

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ExpenseFormValues>({
    defaultValues: {
      vendorName: "",
      description: "",
      categoryName: "",
      amount: "",
      gstAmount: "",
      paymentMode: "CASH",
      status: "PAID",
      date: dayjs(),
      notes: "",
    },
  });

  useEffect(() => {
    if (!open) return;

    reset({
      vendorName: initialData?.vendorName ?? "",
      description: initialData?.description ?? "",
      categoryName: initialData?.categoryName ?? "",
      amount: initialData?.amount ? String(initialData.amount) : "",
      gstAmount: initialData?.gstAmount ? String(initialData.gstAmount) : "",
      paymentMode: initialData?.paymentMode ?? "CASH",
      status: initialData?.status ?? "PAID",
      date: initialData?.date ? dayjs(initialData.date) : dayjs(),
      notes: "",
    });
  }, [open, initialData, reset]);

  const handleFormSubmit = (values: ExpenseFormValues) => {
    const matchedCategory = categories.find(
      (c) => c.name === values.categoryName
    );
    const matchedVendor = vendors.find((v) => v.name === values.vendorName);
    const payload: CreateExpensePayload = {
      vendorName: values.vendorName,
      vendorId: matchedVendor?.id ?? undefined,
      description: values.description,
      categoryName: values.categoryName,
      categoryId: matchedCategory?.id ?? undefined,
      amount: Number(values.amount),
      gstAmount: values.gstAmount ? Number(values.gstAmount) : 0,
      paymentMode: values.paymentMode as CreateExpensePayload["paymentMode"],
      status: values.status as CreateExpensePayload["status"],
      date: values.date
        ? values.date.format("YYYY-MM-DD")
        : dayjs().format("YYYY-MM-DD"),
      notes: values.notes || undefined,
    };

    onSubmit(payload);
  };

  const categoryOptions = categories.map((c) => ({
    value: c.name,
    label: c.name,
  }));

  const vendorOptions = vendors.map((v) => ({
    value: v.name,
    label: v.name,
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
          "Update Expense"
        ) : (
          "Add Expense"
        )}
      </button>
    </div>
  );

  return (
    <CustomModal
      open={open}
      onClose={onClose}
      title={isEdit ? "Edit Expense" : "Add Expense"}
      subtitle={
        isEdit ? "Update expense details" : "Record a new business expense"
      }
      icon={<HiOutlineReceiptTax className="w-5 h-5" />}
      iconTone="red"
      size="lg"
      footer={footer}
    >
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CustomSelect
            name="vendorName"
            control={control}
            errors={errors}
            label="Vendor / Payee"
            placeholder="e.g. TN Electricity Board"
            options={vendorOptions.length > 0 ? vendorOptions : []}
            showSearch
            isrequired
            rules={{ required: "Vendor is required" }}
          />
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
        </div>

        <CustomInput
          name="description"
          control={control}
          label="Description"
          placeholder="e.g. Monthly electricity bill — April"
          errors={errors}
          isrequired
          rules={{ required: "Description is required" }}
        />

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
                Number(v) > 0 || "Amount must be greater than 0",
            }}
          />
          <CustomInput
            name="gstAmount"
            control={control}
            label="GST Amount (₹)"
            placeholder="0 (optional)"
            errors={errors}
            numbersOnly
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <CustomSelect
            name="paymentMode"
            control={control}
            errors={errors}
            label="Payment Mode"
            placeholder="Select mode"
            options={PAYMENT_OPTIONS}
            isrequired
            rules={{ required: "Payment mode is required" }}
          />
          <CustomSelect
            name="status"
            control={control}
            errors={errors}
            label="Status"
            placeholder="Select status"
            options={STATUS_OPTIONS}
          />
          <div className="flex flex-col gap-1 w-full">
            <label className="flex justify-start py-1 text-sm text-slate-700">
              Date <span className="text-red-500 ml-1">*</span>
            </label>
            <Controller
              name="date"
              control={control}
              rules={{ required: "Date is required" }}
              render={({ field }) => (
                <DatePicker
                  {...field}
                  format="YYYY-MM-DD"
                  className="w-full"
                  status={errors.date ? "error" : undefined}
                  placeholder="Select date"
                />
              )}
            />
            {errors.date && (
              <p className="text-red-500 text-sm">
                {errors.date.message as string}
              </p>
            )}
          </div>
        </div>

        <CustomTextArea
          name="notes"
          control={control}
          label="Notes (optional)"
          placeholder="Any additional notes..."
          errors={errors}
          rows={2}
          maxLength={200}
          showCount
        />
      </div>
    </CustomModal>
  );
};

export default Expenseformmodal;
