// src/modules/uam/components/Createusermodal.tsx
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { HiOutlineUserAdd } from "react-icons/hi";
import CustomModal from "../../../components/common/CustomModal";
import CustomInput from "../../../components/common/CustomInput";
import CustomSelect from "../../../components/common/CustomSelect";
import { successNotification } from "../../../components/common/Notification";
import { DUMMY_COMPANIES } from "../constants/DummyUsers";
import type { CreateUserPayload, UamUser, UserRole } from "../types/Uam";

interface Props {
  open: boolean;
  onClose: () => void;
  onCreated: (payload: CreateUserPayload) => void;
  // Passed in so email/phone can be checked for duplicates against real
  // current data, not a stale copy — same reasoning as the backend's
  // phone-conflict check in customers.service.ts.
  existingUsers: UamUser[];
}

const ROLE_OPTIONS = [
  { value: "SUPER_ADMIN", label: "Super Admin — full platform access" },
  { value: "ADMIN", label: "Admin — owns their company" },
  { value: "STAFF", label: "Staff — limited office access" },
  { value: "DELIVERY_BOY", label: "Delivery Boy — assigned deliveries only" },
];

const COMPANY_OPTIONS = DUMMY_COMPANIES.map((c) => ({
  value: c.id,
  label: c.name,
}));

interface FormValues {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  role: UserRole;
  companyId?: string;
}

const DEFAULT_VALUES: FormValues = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  password: "",
  role: "STAFF",
  companyId: undefined,
};

const CreateUserModal = ({
  open,
  onClose,
  onCreated,
  existingUsers,
}: Props) => {
  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<FormValues>({ defaultValues: DEFAULT_VALUES });
  const [isSaving, setIsSaving] = useState(false);

  const selectedRole = watch("role");
  const isSuperAdmin = selectedRole === "SUPER_ADMIN";

  // Fresh, empty form every time this modal opens — otherwise a second
  // "Add User" click right after creating someone would silently reopen
  // with that previous person's leftover values still sitting in it.
  useEffect(() => {
    if (open) reset(DEFAULT_VALUES);
  }, [open, reset]);

  const submit = (values: FormValues) => {
    setIsSaving(true);
    // TEMP: simulated network delay, same pattern as ChangeRoleModal —
    // swap this setTimeout wrapper for a real API call once the backend
    // /admin/users POST endpoint exists. Keep the code inside it as-is.
    setTimeout(() => {
      const payload: CreateUserPayload = {
        ...values,
        // SUPER_ADMIN is platform-wide — never send a companyId for it,
        // even if one was left over in the form state from a prior role.
        companyId: isSuperAdmin ? undefined : values.companyId,
      };
      onCreated(payload);
      successNotification(
        "User Created",
        `${values.firstName} ${values.lastName} has been added as ${values.role
          .replace("_", " ")
          .toLowerCase()}.`
      );
      setIsSaving(false);
      onClose();
    }, 500);
  };

  const footer = (
    <div className="flex justify-end gap-2">
      <button
        onClick={onClose}
        disabled={isSaving}
        className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium text-sm transition disabled:opacity-50"
      >
        Cancel
      </button>
      <button
        onClick={handleSubmit(submit)}
        disabled={isSaving}
        className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition shadow-sm shadow-blue-500/25 disabled:opacity-50"
      >
        {isSaving ? "Creating..." : "Create User"}
      </button>
    </div>
  );

  return (
    <CustomModal
      open={open}
      onClose={onClose}
      title="Add User"
      subtitle="Create a new account and assign their access level"
      icon={<HiOutlineUserAdd size={22} />}
      iconTone="blue"
      size="lg"
      footer={footer}
      closeOnOverlayClick={!isSaving}
      closeOnEsc={!isSaving}
      showCloseButton={!isSaving}
    >
      <div className="flex flex-col gap-5">
        <div>
          <p className="text-[11px] font-bold tracking-wider text-slate-400 uppercase mb-2">
            Personal Details
          </p>
          <div className="grid grid-cols-2 gap-3">
            <CustomInput
              name="firstName"
              control={control}
              label="First Name"
              placeholder="First name"
              isrequired
              errors={errors}
              rules={{ required: "First name is required" }}
            />
            <CustomInput
              name="lastName"
              control={control}
              label="Last Name"
              placeholder="Last name"
              isrequired
              errors={errors}
              rules={{ required: "Last name is required" }}
            />
            <CustomInput
              name="email"
              control={control}
              label="Email"
              type="email"
              iconType="mail"
              placeholder="name@company.com"
              isrequired
              errors={errors}
              rules={{
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Enter a valid email address",
                },
                validate: (v: string) =>
                  !existingUsers.some(
                    (u) => u.email.toLowerCase() === v.toLowerCase()
                  ) || "A user with this email already exists",
              }}
            />
            <CustomInput
              name="phone"
              control={control}
              label="Phone"
              placeholder="9876543210"
              numbersOnly
              isrequired
              errors={errors}
              rules={{
                required: "Phone is required",
                pattern: {
                  value: /^[6-9]\d{9}$/,
                  message: "Enter a valid 10-digit Indian phone",
                },
                validate: (v: string) =>
                  !existingUsers.some((u) => u.phone === v) ||
                  "A user with this phone already exists",
              }}
            />
          </div>
        </div>

        <div className="border-t border-slate-100 pt-4">
          <p className="text-[11px] font-bold tracking-wider text-slate-400 uppercase mb-2">
            Account Access
          </p>
          <div className="flex flex-col gap-3">
            <CustomInput
              name="password"
              control={control}
              label="Initial Password"
              type="password"
              iconType="lock"
              placeholder="At least 6 characters"
              isrequired
              errors={errors}
              rules={{
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              }}
            />
            <p className="text-[11px] text-slate-400 -mt-1.5">
              They can change this after their first login.
            </p>

            <CustomSelect
              label="Role"
              name="role"
              control={control}
              errors={errors}
              placeholder="Select a role"
              options={ROLE_OPTIONS}
              isrequired
              rules={{ required: "Select a role" }}
            />

            {/* Hidden entirely (not just disabled) for SUPER_ADMIN — there's
                no meaningful "which company" answer for a platform-wide role,
                so showing an empty/disabled dropdown would just be confusing
                rather than informative. */}
            {!isSuperAdmin && (
              <CustomSelect
                label="Company"
                name="companyId"
                control={control}
                errors={errors}
                placeholder="Select a company"
                options={COMPANY_OPTIONS}
                isrequired
                rules={{
                  validate: (v: string) => !!v || "Select a company",
                }}
              />
            )}

            {isSuperAdmin && (
              <div className="rounded-lg bg-blue-50 border border-blue-100 px-3 py-2 text-xs text-blue-700">
                Super Admin can see and manage every company on the platform —
                grant this carefully.
              </div>
            )}
          </div>
        </div>
      </div>
    </CustomModal>
  );
};

export default CreateUserModal;
