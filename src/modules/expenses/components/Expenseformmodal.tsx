import { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  HiOutlinePlus,
  HiOutlineReceiptTax,
  HiOutlineUpload,
} from "react-icons/hi";

import {
  EXPENSE_CATEGORIES,
  PAYMENT_MODES,
} from "../constants/Expenses.constants";
import CustomModal from "../../../components/common/CustomModal";
import CustomInput from "../../../components/common/CustomInput";
import CustomSelect from "../../../components/common/CustomSelect";

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  initialData?: any;
}

const ExpenseFormModal = ({ open, onClose, onSubmit, initialData }: Props) => {
  const isEdit = !!initialData;

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<any>({
    defaultValues: initialData || {
      date: new Date().toISOString().split("T")[0],
      category: "",
      vendor: "",
      description: "",
      amount: "",
      gst: "0",
      paymentMode: "cash",
      paidBy: "",
      reference: "",
    },
  });

  useEffect(() => {
    if (open) {
      reset(
        initialData || {
          date: new Date().toISOString().split("T")[0],
          category: "",
          vendor: "",
          description: "",
          amount: "",
          gst: "0",
          paymentMode: "cash",
          paidBy: "",
          reference: "",
        }
      );
    }
  }, [open, initialData, reset]);

  const amount = watch("amount");
  const gst = watch("gst");
  const total = (Number(amount) || 0) + (Number(gst) || 0);

  const handleFormSubmit = (data: any) => {
    onSubmit({
      ...data,
      amount: Number(data.amount),
      gst: Number(data.gst) || 0,
      total: Number(data.amount) + (Number(data.gst) || 0),
      status: "draft",
      createdAt: new Date().toISOString(),
    });
    onClose();
  };

  return (
    <CustomModal
      open={open}
      onClose={onClose}
      title={isEdit ? "Edit Expense" : "Add New Expense"}
      subtitle={
        isEdit ? "Update the expense entry" : "Record a new business expense"
      }
      icon={
        isEdit ? <HiOutlineReceiptTax size={22} /> : <HiOutlinePlus size={22} />
      }
      iconTone="red"
      size="3xl"
      footer={
        <div className="flex items-center justify-between gap-3">
          <div className="text-xs text-slate-500">
            Total amount:{" "}
            <span className="font-bold text-rose-600">
              ₹{total.toLocaleString("en-IN")}
            </span>
            {Number(gst) > 0 && (
              <span className="text-slate-400">
                {" "}
                (incl. ₹{Number(gst).toLocaleString("en-IN")} GST)
              </span>
            )}
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
              className="px-5 py-2 rounded-lg bg-rose-600 text-white text-sm font-semibold shadow-md hover:bg-rose-700 hover:shadow-lg transition-all"
            >
              {isEdit ? "Save Changes" : "Add Expense"}
            </button>
          </div>
        </div>
      }
    >
      <div className="space-y-5">
        {/* Section header */}
        <div className="rounded-xl bg-rose-50/60 border border-rose-100 p-4 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-white">
            <HiOutlineReceiptTax className="w-5 h-5 text-rose-600" />
          </div>
          <div>
            <div className="text-sm font-semibold text-slate-900">
              Expense Details
            </div>
            <div className="text-xs text-slate-600">
              All fields marked * are required
            </div>
          </div>
        </div>

        {/* Form grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CustomInput
            name="date"
            control={control}
            label="Expense Date"
            type="text"
            placeholder="YYYY-MM-DD"
            isrequired
            errors={errors}
            rules={{ required: "Date is required" }}
          />

          <CustomSelect
            name="category"
            control={control}
            label="Category"
            placeholder="Select category"
            isrequired
            errors={errors}
            rules={{ required: "Category is required" }}
            options={EXPENSE_CATEGORIES.map((c) => ({
              value: c.value,
              label: `${c.icon}  ${c.label}`,
            }))}
          />

          <CustomInput
            name="vendor"
            control={control}
            label="Vendor / Payee"
            placeholder="e.g. TN Electricity Board"
            isrequired
            errors={errors}
            rules={{ required: "Vendor is required" }}
          />

          <CustomSelect
            name="paymentMode"
            control={control}
            label="Payment Mode"
            placeholder="How was it paid?"
            isrequired
            errors={errors}
            rules={{ required: "Payment mode required" }}
            options={PAYMENT_MODES.map((p) => ({
              value: p.value,
              label: `${p.icon}  ${p.label}`,
            }))}
          />

          <div className="md:col-span-2">
            <CustomInput
              name="description"
              control={control}
              label="Description"
              placeholder="Brief description of the expense..."
              isrequired
              errors={errors}
              rules={{
                required: "Description is required",
                minLength: { value: 3, message: "Too short" },
              }}
            />
          </div>

          <CustomInput
            name="amount"
            control={control}
            label="Amount (₹)"
            placeholder="e.g. 16500"
            isrequired
            errors={errors}
            rules={{
              required: "Amount is required",
              min: { value: 1, message: "Must be greater than 0" },
              pattern: { value: /^\d+$/, message: "Enter valid number" },
            }}
          />

          <CustomInput
            name="gst"
            control={control}
            label="GST Amount (₹)"
            placeholder="e.g. 2000 (optional)"
            errors={errors}
            rules={{
              pattern: { value: /^\d+$/, message: "Enter valid number" },
            }}
          />

          <CustomSelect
            name="paidBy"
            control={control}
            label="Paid By"
            placeholder="Who paid?"
            errors={errors}
            options={[
              { value: "Devaa Balaji", label: "Devaa Balaji" },
              { value: "Suresh M.", label: "Suresh M." },
              { value: "Karthik R.", label: "Karthik R." },
              { value: "Divya B.", label: "Divya B." },
              { value: "Rajesh K.", label: "Rajesh K." },
            ]}
          />

          <CustomInput
            name="reference"
            control={control}
            label="Reference / Bill Number"
            placeholder="e.g. INV-2026-042 (optional)"
            errors={errors}
          />
        </div>

        {/* Receipt upload */}
        <div className="pt-4 border-t border-dashed border-slate-200">
          <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Attach Receipt
          </div>
          <button
            type="button"
            className="w-full border-2 border-dashed border-slate-200 rounded-xl p-6 text-center hover:border-rose-300 hover:bg-rose-50/30 transition-all group"
          >
            <div className="inline-flex p-3 rounded-2xl bg-slate-100 group-hover:bg-rose-100 transition-colors">
              <HiOutlineUpload className="w-6 h-6 text-slate-400 group-hover:text-rose-600 transition-colors" />
            </div>
            <div className="text-sm font-semibold text-slate-700 group-hover:text-rose-700 mt-2">
              Click to upload receipt
            </div>
            <div className="text-xs text-slate-500 mt-1">
              PDF, JPG, or PNG · Max 5MB
            </div>
          </button>
        </div>
      </div>
    </CustomModal>
  );
};

export default ExpenseFormModal;
