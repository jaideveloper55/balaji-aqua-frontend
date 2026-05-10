import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  HiOutlineUserAdd,
  HiOutlinePencilAlt,
  HiOutlineUser,
  HiOutlineBriefcase,
  HiOutlineCash,
  HiOutlineDocumentText,
  HiOutlinePhone,
} from "react-icons/hi";

import {
  DEPARTMENTS,
  ROLES,
  EMPLOYMENT_TYPES,
  EMPLOYEE_STATUS,
  SHIFT_TYPES,
  SALARY_TYPES,
} from "../constants/Employees.constants";
import type { Employee } from "../types/Employees";
import CustomModal from "../../../components/common/CustomModal";
import CustomInput from "../../../components/common/CustomInput";
import CustomSelect from "../../../components/common/CustomSelect";

interface Props {
  open: boolean;
  onClose: () => void;
  employee: Employee | null;
}

type Section = "personal" | "employment" | "salary" | "documents";

const SECTIONS: { key: Section; label: string; icon: React.ReactNode }[] = [
  { key: "personal", label: "Personal", icon: <HiOutlineUser /> },
  { key: "employment", label: "Employment", icon: <HiOutlineBriefcase /> },
  { key: "salary", label: "Salary & Bank", icon: <HiOutlineCash /> },
  { key: "documents", label: "Documents", icon: <HiOutlineDocumentText /> },
];

const EmployeeFormModal = ({ open, onClose, employee }: Props) => {
  const isEdit = !!employee;
  const [section, setSection] = useState<Section>("personal");

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<any>({
    defaultValues: employee || {
      employmentType: "full_time",
      status: "active",
      salaryType: "monthly",
      shift: "general",
    },
  });

  useEffect(() => {
    if (open) {
      reset(
        employee || {
          employmentType: "full_time",
          status: "active",
          salaryType: "monthly",
          shift: "general",
        }
      );
      setSection("personal");
    }
  }, [open, employee, reset]);

  const onSubmit = (data: any) => {
    // In real app: POST/PUT to API
    console.log("Save employee:", data);
    onClose();
  };

  return (
    <CustomModal
      open={open}
      onClose={onClose}
      title={isEdit ? "Edit Employee" : "Add New Employee"}
      subtitle={
        isEdit
          ? `Updating ${employee?.fullName} • ${employee?.employeeId}`
          : "Fill in the details to onboard a new team member"
      }
      icon={
        isEdit ? (
          <HiOutlinePencilAlt size={22} />
        ) : (
          <HiOutlineUserAdd size={22} />
        )
      }
      iconTone={isEdit ? "amber" : "blue"}
      size="4xl"
      footer={
        <div className="flex items-center justify-between">
          <div className="text-xs text-slate-500">
            {section === "documents"
              ? "Last step — review and save"
              : `Step ${SECTIONS.findIndex((s) => s.key === section) + 1} of ${
                  SECTIONS.length
                }`}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit(onSubmit)}
              className="px-5 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold shadow-md hover:shadow-lg transition-all"
            >
              {isEdit ? "Save Changes" : "Create Employee"}
            </button>
          </div>
        </div>
      }
    >
      {/* Section Navigation */}
      <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl mb-6 overflow-x-auto">
        {SECTIONS.map((s, i) => {
          const isActive = section === s.key;
          return (
            <button
              key={s.key}
              type="button"
              onClick={() => setSection(s.key)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                isActive
                  ? "bg-white text-blue-700 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <span
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "bg-slate-200 text-slate-600"
                }`}
              >
                {i + 1}
              </span>
              {s.icon}
              {s.label}
            </button>
          );
        })}
      </div>

      {/* PERSONAL SECTION */}
      {section === "personal" && (
        <div className="space-y-5">
          <div className="bg-blue-50/60 border border-blue-100 rounded-xl p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-white">
              <HiOutlineUser className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-900">
                Personal Information
              </div>
              <div className="text-xs text-slate-600">
                Basic details about the employee
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CustomInput
              name="fullName"
              control={control}
              label="Full Name"
              placeholder="e.g. Suresh Murugan"
              isrequired
              errors={errors}
              rules={{ required: "Full name is required" }}
            />
            <CustomInput
              name="fatherName"
              control={control}
              label="Father / Spouse Name"
              placeholder="e.g. Murugan"
              errors={errors}
            />
            <CustomInput
              name="dob"
              control={control}
              type="text"
              label="Date of Birth"
              placeholder="YYYY-MM-DD"
              errors={errors}
            />
            <CustomSelect
              name="gender"
              control={control}
              label="Gender"
              placeholder="Select gender"
              errors={errors}
              options={[
                { value: "male", label: "Male" },
                { value: "female", label: "Female" },
                { value: "other", label: "Other" },
              ]}
            />
            <CustomInput
              name="phone"
              control={control}
              label="Phone Number"
              placeholder="10-digit mobile number"
              isrequired
              errors={errors}
              rules={{
                required: "Phone is required",
                pattern: {
                  value: /^[6-9]\d{9}$/,
                  message: "Enter a valid 10-digit number",
                },
              }}
            />
            <CustomInput
              name="email"
              control={control}
              type="email"
              iconType="mail"
              label="Email"
              placeholder="employee@example.com"
              errors={errors}
            />
            <CustomInput
              name="bloodGroup"
              control={control}
              label="Blood Group"
              placeholder="e.g. O+"
              errors={errors}
            />
            <CustomSelect
              name="maritalStatus"
              control={control}
              label="Marital Status"
              placeholder="Select"
              errors={errors}
              options={[
                { value: "single", label: "Single" },
                { value: "married", label: "Married" },
              ]}
            />
            <div className="md:col-span-2">
              <CustomInput
                name="currentAddress"
                control={control}
                label="Current Address"
                placeholder="Door no, street, city, pincode"
                errors={errors}
              />
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="mt-6 pt-6 border-t border-dashed border-slate-200">
            <div className="flex items-center gap-2 mb-4">
              <HiOutlinePhone className="w-4 h-4 text-rose-500" />
              <h4 className="text-sm font-bold text-slate-900">
                Emergency Contact
              </h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <CustomInput
                name="emergencyContactName"
                control={control}
                label="Contact Name"
                placeholder="e.g. Wife / Father"
                errors={errors}
              />
              <CustomInput
                name="emergencyContactRelation"
                control={control}
                label="Relation"
                placeholder="e.g. Spouse"
                errors={errors}
              />
              <CustomInput
                name="emergencyContactPhone"
                control={control}
                label="Phone Number"
                placeholder="10-digit number"
                errors={errors}
              />
            </div>
          </div>
        </div>
      )}

      {/* EMPLOYMENT SECTION */}
      {section === "employment" && (
        <div className="space-y-5">
          <div className="bg-purple-50/60 border border-purple-100 rounded-xl p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-white">
              <HiOutlineBriefcase className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-900">
                Employment Details
              </div>
              <div className="text-xs text-slate-600">
                Role, department, and work schedule
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CustomInput
              name="designation"
              control={control}
              label="Designation"
              placeholder="e.g. Senior Driver"
              isrequired
              errors={errors}
              rules={{ required: "Designation is required" }}
            />
            <CustomSelect
              name="department"
              control={control}
              label="Department"
              placeholder="Select department"
              isrequired
              errors={errors}
              rules={{ required: "Department is required" }}
              options={DEPARTMENTS.map((d) => ({
                value: d.value,
                label: d.label,
              }))}
            />
            <CustomSelect
              name="role"
              control={control}
              label="Role"
              placeholder="Select role"
              errors={errors}
              options={ROLES.map((r) => ({
                value: r.value,
                label: r.label,
              }))}
            />
            <CustomSelect
              name="employmentType"
              control={control}
              label="Employment Type"
              placeholder="Select type"
              isrequired
              errors={errors}
              options={EMPLOYMENT_TYPES.map((t) => ({
                value: t.value,
                label: t.label,
              }))}
            />
            <CustomInput
              name="joinedDate"
              control={control}
              label="Date of Joining"
              placeholder="YYYY-MM-DD"
              isrequired
              errors={errors}
              rules={{ required: "Joining date is required" }}
            />
            <CustomSelect
              name="shift"
              control={control}
              label="Shift"
              placeholder="Select shift"
              errors={errors}
              options={SHIFT_TYPES.map((s) => ({
                value: s.value,
                label: s.label,
              }))}
            />
            <CustomSelect
              name="workLocation"
              control={control}
              label="Work Location"
              placeholder="Select location"
              errors={errors}
              options={[
                { value: "plant", label: "Plant" },
                { value: "field", label: "Field" },
                { value: "office", label: "Office" },
              ]}
            />
            <CustomSelect
              name="status"
              control={control}
              label="Status"
              placeholder="Select status"
              errors={errors}
              options={EMPLOYEE_STATUS.map((s) => ({
                value: s.value,
                label: s.label,
              }))}
            />
          </div>
        </div>
      )}

      {/* SALARY SECTION */}
      {section === "salary" && (
        <div className="space-y-5">
          <div className="bg-emerald-50/60 border border-emerald-100 rounded-xl p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-white">
              <HiOutlineCash className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-900">
                Salary & Bank Details
              </div>
              <div className="text-xs text-slate-600">
                Compensation and payment information
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CustomSelect
              name="salaryType"
              control={control}
              label="Salary Type"
              placeholder="Monthly / Daily / Per Delivery"
              isrequired
              errors={errors}
              options={SALARY_TYPES.map((t) => ({
                value: t.value,
                label: t.label,
              }))}
            />
            <CustomInput
              name="baseSalary"
              control={control}
              label="Base Salary (₹)"
              placeholder="e.g. 18000"
              isrequired
              errors={errors}
              rules={{ required: "Base salary is required" }}
            />
            <CustomInput
              name="hra"
              control={control}
              label="HRA (₹)"
              placeholder="e.g. 2000"
              errors={errors}
            />
            <CustomInput
              name="conveyance"
              control={control}
              label="Conveyance (₹)"
              placeholder="e.g. 1000"
              errors={errors}
            />
            <CustomInput
              name="bankAccount"
              control={control}
              label="Bank Account Number"
              placeholder="Account number"
              errors={errors}
            />
            <CustomInput
              name="ifsc"
              control={control}
              label="IFSC Code"
              placeholder="e.g. HDFC0001234"
              errors={errors}
            />
            <CustomInput
              name="upiId"
              control={control}
              label="UPI ID"
              placeholder="e.g. name@upi"
              errors={errors}
            />
          </div>
        </div>
      )}

      {/* DOCUMENTS SECTION */}
      {section === "documents" && (
        <div className="space-y-5">
          <div className="bg-amber-50/60 border border-amber-100 rounded-xl p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-white">
              <HiOutlineDocumentText className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-900">
                Documents & Verification
              </div>
              <div className="text-xs text-slate-600">
                ID proofs and verification status
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CustomInput
              name="aadhaar"
              control={control}
              label="Aadhaar Number"
              placeholder="12-digit Aadhaar"
              errors={errors}
            />
            <CustomInput
              name="pan"
              control={control}
              label="PAN Number"
              placeholder="ABCDE1234F"
              errors={errors}
            />
            <CustomInput
              name="drivingLicense"
              control={control}
              label="Driving License Number"
              placeholder="License number (for drivers)"
              errors={errors}
            />
            <CustomInput
              name="drivingLicenseExpiry"
              control={control}
              label="License Expiry Date"
              placeholder="YYYY-MM-DD"
              errors={errors}
            />
          </div>

          {/* Upload zones */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
            {["Photo", "Aadhaar", "PAN", "License"].map((doc) => (
              <button
                key={doc}
                type="button"
                className="border-2 border-dashed border-slate-200 rounded-xl p-4 text-center hover:border-blue-400 hover:bg-blue-50/40 transition-all group"
              >
                <div className="text-2xl mb-2">📎</div>
                <div className="text-xs font-semibold text-slate-700 group-hover:text-blue-700">
                  Upload {doc}
                </div>
                <div className="text-[10px] text-slate-400 mt-1">
                  PDF / JPG / PNG
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </CustomModal>
  );
};

export default EmployeeFormModal;
