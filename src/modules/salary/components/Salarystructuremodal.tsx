import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { HiOutlinePencilAlt, HiOutlineCalculator } from "react-icons/hi";

import CustomModal from "../../../components/common/CustomModal";
import CustomInput from "../../../components/common/CustomInput";
import CustomSelect from "../../../components/common/CustomSelect";

interface StructureRow {
  id: string;
  employeeId: string;
  name: string;
  designation: string;
  salaryType: "monthly" | "daily";
  baseSalary: number;
  hra: number;
  conveyance: number;
  food: number;
  pf: number;
  ctc: number;
  netInHand: number;
}

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: StructureRow) => void;
  employee: StructureRow | null;
}

const SalaryStructureModal = ({ open, onClose, onSubmit, employee }: Props) => {
  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<any>({
    defaultValues: {
      salaryType: "monthly",
      baseSalary: "",
      hra: "",
      conveyance: "",
      food: "",
      pf: "",
    },
  });

  useEffect(() => {
    if (open && employee) {
      reset({
        salaryType: employee.salaryType,
        baseSalary: String(employee.baseSalary || 0),
        hra: String(employee.hra || 0),
        conveyance: String(employee.conveyance || 0),
        food: String(employee.food || 0),
        pf: String(employee.pf || 0),
      });
    }
  }, [open, employee, reset]);

  const salaryType = watch("salaryType");
  const baseSalary = Number(watch("baseSalary")) || 0;
  const hra = Number(watch("hra")) || 0;
  const conveyance = Number(watch("conveyance")) || 0;
  const food = Number(watch("food")) || 0;
  const pf = Number(watch("pf")) || 0;

  const ctc = baseSalary + hra + conveyance + food;
  const netInHand = ctc - pf;
  const isDaily = salaryType === "daily";

  const handleFormSubmit = (data: any) => {
    if (!employee) return;
    onSubmit({
      ...employee,
      salaryType: data.salaryType,
      baseSalary: Number(data.baseSalary),
      hra: Number(data.hra) || 0,
      conveyance: Number(data.conveyance) || 0,
      food: Number(data.food) || 0,
      pf: Number(data.pf) || 0,
      ctc,
      netInHand,
    });
    onClose();
  };

  if (!employee) return null;

  return (
    <CustomModal
      open={open}
      onClose={onClose}
      title="Edit Salary Structure"
      subtitle={`${employee.name} · ${employee.employeeId}`}
      icon={<HiOutlinePencilAlt size={22} />}
      iconTone="amber"
      size="3xl"
      footer={
        <div className="flex items-center justify-between gap-3">
          <div className="text-xs text-slate-500">
            Net In Hand:{" "}
            <span className="font-bold text-emerald-700 text-base">
              ₹{netInHand.toLocaleString("en-IN")}
              {isDaily && (
                <span className="text-xs text-slate-400 ml-1">/day</span>
              )}
            </span>
          </div>
          <div className="flex items-center gap-2">
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
              className="px-5 py-2 rounded-lg bg-emerald-600 text-white text-sm font-semibold shadow-md hover:bg-emerald-700 active:scale-95 transition-all"
            >
              Save Changes
            </button>
          </div>
        </div>
      }
    >
      <div className="space-y-5">
        {/* Banner */}
        <div className="rounded-xl bg-amber-50/60 border border-amber-100 p-4 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-white">
            <HiOutlineCalculator className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <div className="text-sm font-semibold text-slate-900">
              Update salary components
            </div>
            <div className="text-xs text-slate-600 mt-0.5">
              Changes will apply from next payroll cycle
            </div>
          </div>
        </div>

        {/* Salary Type */}
        <CustomSelect
          name="salaryType"
          control={control}
          label="Salary Type"
          placeholder="Monthly or Daily?"
          isrequired
          errors={errors}
          rules={{ required: "Salary type is required" }}
          options={[
            { value: "monthly", label: "📅 Monthly Salary" },
            { value: "daily", label: "⏰ Daily Wage" },
          ]}
        />

        {/* Earnings */}
        <div>
          <div className="text-xs font-bold text-emerald-700 uppercase tracking-wider mb-3">
            Earnings {isDaily && "(per day)"}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CustomInput
              name="baseSalary"
              control={control}
              label={`Base Salary (₹${isDaily ? "/day" : ""})`}
              placeholder={isDaily ? "e.g. 600" : "e.g. 18000"}
              isrequired
              errors={errors}
              rules={{
                required: "Base salary is required",
                min: { value: 1, message: "Must be greater than 0" },
                pattern: { value: /^\d+$/, message: "Enter valid number" },
              }}
            />
            <CustomInput
              name="hra"
              control={control}
              label="HRA (₹)"
              placeholder="e.g. 2000"
              errors={errors}
              rules={{
                pattern: { value: /^\d*$/, message: "Enter valid number" },
              }}
            />
            <CustomInput
              name="conveyance"
              control={control}
              label="Conveyance (₹)"
              placeholder="e.g. 1000"
              errors={errors}
              rules={{
                pattern: { value: /^\d*$/, message: "Enter valid number" },
              }}
            />
            <CustomInput
              name="food"
              control={control}
              label="Food Allowance (₹)"
              placeholder="e.g. 0"
              errors={errors}
              rules={{
                pattern: { value: /^\d*$/, message: "Enter valid number" },
              }}
            />
          </div>
        </div>

        {/* Deductions */}
        <div className="pt-4 border-t border-dashed border-slate-200">
          <div className="text-xs font-bold text-red-700 uppercase tracking-wider mb-3">
            Default Deductions
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CustomInput
              name="pf"
              control={control}
              label="PF Amount (₹)"
              placeholder="e.g. 2160"
              errors={errors}
              rules={{
                pattern: { value: /^\d*$/, message: "Enter valid number" },
              }}
            />
          </div>
          <div className="text-[11px] text-slate-500 mt-2">
            💡 Standard PF is 12% of base salary. Daily wage workers usually
            don't have PF deduction.
          </div>
        </div>

        {/* Live calc */}
        <div className="rounded-xl bg-emerald-50/60 border border-emerald-200 p-4">
          <div className="text-xs font-bold text-emerald-700 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <HiOutlineCalculator className="w-3.5 h-3.5" />
            Live Calculation {isDaily && "(per day)"}
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-white rounded-lg p-3 text-center">
              <div className="text-[10px] text-slate-500 font-semibold uppercase">
                Gross CTC
              </div>
              <div className="text-base font-bold text-slate-900 mt-0.5">
                ₹{ctc.toLocaleString("en-IN")}
              </div>
            </div>
            <div className="bg-white rounded-lg p-3 text-center">
              <div className="text-[10px] text-red-600 font-semibold uppercase">
                Deductions
              </div>
              <div className="text-base font-bold text-red-700 mt-0.5">
                −₹{pf.toLocaleString("en-IN")}
              </div>
            </div>
            <div className="bg-emerald-100 rounded-lg p-3 text-center">
              <div className="text-[10px] text-emerald-700 font-semibold uppercase">
                Net In Hand
              </div>
              <div className="text-base font-bold text-emerald-800 mt-0.5">
                ₹{netInHand.toLocaleString("en-IN")}
              </div>
            </div>
          </div>
          {!isDaily && baseSalary > 0 && (
            <div className="text-[11px] text-emerald-700 mt-3 text-center">
              Annual CTC: ₹{(ctc * 12).toLocaleString("en-IN")} per year
            </div>
          )}
        </div>
      </div>
    </CustomModal>
  );
};

export default SalaryStructureModal;
