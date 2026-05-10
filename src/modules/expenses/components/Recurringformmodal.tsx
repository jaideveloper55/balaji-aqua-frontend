import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { HiOutlineRefresh, HiOutlinePencilAlt } from "react-icons/hi";
import { EXPENSE_CATEGORIES } from "../constants/Expenses.constants";
import CustomModal from "../../../components/common/CustomModal";
import CustomInput from "../../../components/common/CustomInput";
import CustomSelect from "../../../components/common/CustomSelect";

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  initialData?: any;
}

const RecurringFormModal = ({
  open,
  onClose,
  onSubmit,
  initialData,
}: Props) => {
  const isEdit = !!initialData;

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<any>({
    defaultValues: initialData || {
      title: "",
      vendor: "",
      category: "",
      amount: "",
      frequency: "monthly",
      nextDueDate: "",
      reminderDays: "3",
    },
  });

  useEffect(() => {
    if (open) {
      reset(
        initialData || {
          title: "",
          vendor: "",
          category: "",
          amount: "",
          frequency: "monthly",
          nextDueDate: "",
          reminderDays: "3",
        }
      );
    }
  }, [open, initialData, reset]);

  const handleFormSubmit = (data: any) => {
    onSubmit({
      ...data,
      id: initialData?.id || `R-${String(Date.now()).slice(-3)}`,
      amount: Number(data.amount),
      reminderDays: Number(data.reminderDays),
      isActive: initialData?.isActive ?? true,
    });
    onClose();
  };

  return (
    <CustomModal
      open={open}
      onClose={onClose}
      title={isEdit ? "Edit Recurring Expense" : "Add Recurring Expense"}
      subtitle={
        isEdit
          ? "Update your recurring schedule"
          : "Set up automatic expense reminders"
      }
      icon={
        isEdit ? (
          <HiOutlinePencilAlt size={22} />
        ) : (
          <HiOutlineRefresh size={22} />
        )
      }
      iconTone={isEdit ? "amber" : "red"}
      size="3xl"
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
            {isEdit ? "Save Changes" : "Create Schedule"}
          </button>
        </div>
      }
    >
      <div className="space-y-4">
        {/* Banner */}
        <div className="rounded-xl bg-rose-50/60 border border-rose-100 p-4 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-white">
            <HiOutlineRefresh className="w-5 h-5 text-rose-600" />
          </div>
          <div>
            <div className="text-sm font-semibold text-slate-900">
              Recurring Expense Setup
            </div>
            <div className="text-xs text-slate-600">
              Auto-generates expense entries on the due date
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <CustomInput
              name="title"
              control={control}
              label="Schedule Title"
              placeholder="e.g. Plant Rent, Electricity Bill"
              isrequired
              errors={errors}
              rules={{ required: "Title is required" }}
            />
          </div>

          <CustomInput
            name="vendor"
            control={control}
            label="Vendor / Payee"
            placeholder="e.g. Sundaram Property"
            isrequired
            errors={errors}
            rules={{ required: "Vendor is required" }}
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
            name="amount"
            control={control}
            label="Amount (₹)"
            placeholder="e.g. 12000"
            isrequired
            errors={errors}
            rules={{
              required: "Amount is required",
              min: { value: 1, message: "Must be greater than 0" },
              pattern: { value: /^\d+$/, message: "Enter valid number" },
            }}
          />

          <CustomSelect
            name="frequency"
            control={control}
            label="Frequency"
            placeholder="How often?"
            isrequired
            errors={errors}
            rules={{ required: "Frequency required" }}
            options={[
              { value: "weekly", label: "Weekly" },
              { value: "monthly", label: "Monthly" },
              { value: "quarterly", label: "Quarterly (3 months)" },
              { value: "yearly", label: "Yearly" },
            ]}
          />

          <CustomInput
            name="nextDueDate"
            control={control}
            label="Next Due Date"
            placeholder="YYYY-MM-DD"
            isrequired
            errors={errors}
            rules={{ required: "Due date is required" }}
          />

          <CustomSelect
            name="reminderDays"
            control={control}
            label="Reminder (Days Before)"
            placeholder="When to notify?"
            errors={errors}
            options={[
              { value: "1", label: "1 day before" },
              { value: "3", label: "3 days before" },
              { value: "5", label: "5 days before" },
              { value: "7", label: "1 week before" },
              { value: "14", label: "2 weeks before" },
            ]}
          />
        </div>
      </div>
    </CustomModal>
  );
};

export default RecurringFormModal;
