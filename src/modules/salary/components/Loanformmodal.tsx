import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { HiOutlineCreditCard, HiOutlineCalculator } from "react-icons/hi";
import CustomModal from "../../../components/common/CustomModal";
import CustomSelect from "../../../components/common/CustomSelect";
import CustomInput from "../../../components/common/CustomInput";

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

const LoanFormModal = ({ open, onClose, onSubmit }: Props) => {
  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<any>({
    defaultValues: {
      employeeId: "",
      type: "loan",
      amount: "",
      months: "10",
      reason: "",
      startDate: new Date().toISOString().split("T")[0],
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        employeeId: "",
        type: "loan",
        amount: "",
        months: "10",
        reason: "",
        startDate: new Date().toISOString().split("T")[0],
      });
    }
  }, [open, reset]);

  const amount = Number(watch("amount")) || 0;
  const months = Number(watch("months")) || 1;
  const type = watch("type");
  const emi = months > 0 ? Math.ceil(amount / months) : 0;

  const handleFormSubmit = (data: any) => {
    onSubmit({
      ...data,
      id: `L-${String(Date.now()).slice(-3)}`,
      loanAmount: Number(data.amount),
      amountPaid: 0,
      emi: emi,
      monthsTotal: Number(data.months),
      monthsPaid: 0,
      status: "active",
    });
    onClose();
  };

  return (
    <CustomModal
      open={open}
      onClose={onClose}
      title="Issue Loan / Advance"
      subtitle="Provide financial assistance to employee"
      icon={<HiOutlineCreditCard size={22} />}
      iconTone="green"
      size="2xl"
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
            className="px-5 py-2 rounded-lg bg-emerald-600 text-white text-sm font-semibold shadow-md hover:bg-emerald-700 transition-all"
          >
            Issue {type === "loan" ? "Loan" : "Advance"}
          </button>
        </div>
      }
    >
      <div className="space-y-4">
        {/* Banner */}
        <div className="rounded-xl bg-emerald-50/60 border border-emerald-100 p-4 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-white">
            <HiOutlineCreditCard className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <div className="text-sm font-semibold text-slate-900">
              Auto-deducted from monthly salary
            </div>
            <div className="text-xs text-slate-600 mt-0.5">
              EMI will appear in salary deductions automatically
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CustomSelect
            name="employeeId"
            control={control}
            label="Employee"
            placeholder="Select employee"
            isrequired
            errors={errors}
            rules={{ required: "Employee is required" }}
            options={[
              { value: "EMP-001", label: "Suresh Murugan (EMP-001)" },
              { value: "EMP-002", label: "Karthik Raja (EMP-002)" },
              { value: "EMP-003", label: "Vijay Prakash (EMP-003)" },
              { value: "EMP-004", label: "Arun Selvam (EMP-004)" },
              { value: "EMP-005", label: "Rajesh Kumar (EMP-005)" },
              { value: "EMP-006", label: "Divya Bharathi (EMP-006)" },
              { value: "EMP-007", label: "Anand S. (EMP-007)" },
            ]}
          />

          <CustomSelect
            name="type"
            control={control}
            label="Type"
            placeholder="Loan or Advance?"
            isrequired
            errors={errors}
            rules={{ required: "Type is required" }}
            options={[
              { value: "loan", label: "💳 Loan (long-term)" },
              { value: "advance", label: "⚡ Advance (short-term)" },
            ]}
          />

          <CustomInput
            name="amount"
            control={control}
            label="Amount (₹)"
            placeholder="e.g. 15000"
            isrequired
            errors={errors}
            rules={{
              required: "Amount is required",
              min: { value: 100, message: "Minimum ₹100" },
              pattern: { value: /^\d+$/, message: "Enter valid number" },
            }}
          />

          <CustomSelect
            name="months"
            control={control}
            label="Repayment Period"
            placeholder="How many months?"
            isrequired
            errors={errors}
            rules={{ required: "Period is required" }}
            options={[
              { value: "1", label: "1 month" },
              { value: "2", label: "2 months" },
              { value: "3", label: "3 months" },
              { value: "5", label: "5 months" },
              { value: "10", label: "10 months" },
              { value: "12", label: "12 months" },
              { value: "24", label: "24 months" },
            ]}
          />

          <CustomInput
            name="startDate"
            control={control}
            label="Start Date"
            placeholder="YYYY-MM-DD"
            isrequired
            errors={errors}
            rules={{ required: "Start date is required" }}
          />

          <div className="md:col-span-2">
            <CustomInput
              name="reason"
              control={control}
              label="Reason"
              placeholder="e.g. Family medical emergency"
              isrequired
              errors={errors}
              rules={{
                required: "Reason is required",
                minLength: { value: 5, message: "Too short" },
              }}
            />
          </div>
        </div>

        {/* EMI calculator preview */}
        {amount > 0 && months > 0 && (
          <div className="rounded-xl bg-blue-50 border border-blue-200 p-4">
            <div className="flex items-center gap-2 mb-3">
              <HiOutlineCalculator className="w-5 h-5 text-blue-600" />
              <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">
                Repayment Schedule
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-white rounded-lg p-2 text-center">
                <div className="text-[10px] text-slate-500 font-semibold uppercase">
                  Total
                </div>
                <div className="text-base font-bold text-slate-900 mt-0.5">
                  ₹{amount.toLocaleString("en-IN")}
                </div>
              </div>
              <div className="bg-white rounded-lg p-2 text-center">
                <div className="text-[10px] text-slate-500 font-semibold uppercase">
                  Period
                </div>
                <div className="text-base font-bold text-slate-900 mt-0.5">
                  {months} mo
                </div>
              </div>
              <div className="bg-emerald-100 rounded-lg p-2 text-center">
                <div className="text-[10px] text-emerald-700 font-semibold uppercase">
                  EMI
                </div>
                <div className="text-base font-bold text-emerald-800 mt-0.5">
                  ₹{emi.toLocaleString("en-IN")}
                </div>
              </div>
            </div>
            <div className="text-xs text-blue-700 mt-3 text-center">
              ₹{emi.toLocaleString("en-IN")} will be deducted monthly for{" "}
              {months} months
            </div>
          </div>
        )}
      </div>
    </CustomModal>
  );
};

export default LoanFormModal;
