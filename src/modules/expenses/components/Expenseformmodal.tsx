import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import dayjs, { Dayjs } from "dayjs";
import { HiOutlineReceiptTax } from "react-icons/hi";
import CustomModal from "../../../components/common/CustomModal";
import CustomInput from "../../../components/common/CustomInput";
import CustomSelect from "../../../components/common/CustomSelect";
import { Controller } from "react-hook-form";
import { DatePicker } from "antd";
import type { Expense } from "./Allexpensespanel";
import CustomTextArea from "../../../components/common/Customtextarea";

export interface ExpenseFormValues {
  vendor: string;
  description: string;
  category: string;
  amount: string;
  gstAmount: string;
  paymentMode: string;
  status: string;
  date: Dayjs | null;
  notes: string;
}

interface Props {
  open: boolean;
  editExpense?: Expense | null;
  onClose: () => void;
  onSubmit: (values: ExpenseFormValues) => void;
  loading?: boolean;
}

const CATEGORY_OPTIONS = [
  { value: "Utilities", label: "Utilities" },
  { value: "Vehicle & Fuel", label: "Vehicle & Fuel" },
  { value: "Plant Operations", label: "Plant Operations" },
  { value: "Packaging", label: "Packaging" },
  { value: "Repairs", label: "Repairs" },
  { value: "Rent & Lease", label: "Rent & Lease" },
  { value: "Office", label: "Office" },
  { value: "Compliance", label: "Compliance" },
  { value: "Marketing", label: "Marketing" },
  { value: "Loan", label: "Loan" },
];

const PAYMENT_OPTIONS = [
  { value: "CASH", label: "Cash" },
  { value: "UPI", label: "UPI" },
  { value: "BANK", label: "Bank Transfer" },
  { value: "CARD", label: "Card" },
];

const STATUS_OPTIONS = [
  { value: "PAID", label: "Paid" },
  { value: "APPROVED", label: "Approved" },
  { value: "PENDING", label: "Pending" },
  { value: "REJECTED", label: "Rejected" },
];

const Expenseformmodal: React.FC<Props> = ({
  open,
  editExpense,
  onClose,
  onSubmit,
  loading = false,
}) => {
  const isEdit = !!editExpense;

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ExpenseFormValues>({
    defaultValues: {
      vendor: "",
      description: "",
      category: "",
      amount: "",
      gstAmount: "",
      paymentMode: "CASH",
      status: "PAID",
      date: dayjs(),
      notes: "",
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        vendor: editExpense?.vendor ?? "",
        description: editExpense?.description ?? "",
        category: editExpense?.category ?? "",
        amount: editExpense?.amount ? String(editExpense.amount) : "",
        gstAmount: editExpense?.gstAmount ? String(editExpense.gstAmount) : "",
        paymentMode: editExpense?.paymentMode ?? "CASH",
        status: editExpense?.status ?? "PAID",
        date: editExpense?.date ? dayjs(editExpense.date) : dayjs(),
        notes: "",
      });
    }
  }, [open, editExpense, reset]);

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
          <CustomInput
            name="vendor"
            control={control}
            label="Vendor / Payee"
            placeholder="e.g. TN Electricity Board"
            errors={errors}
            isrequired
            rules={{ required: "Vendor is required" }}
          />
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
