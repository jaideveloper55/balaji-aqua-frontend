import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { HiOutlineUserAdd } from "react-icons/hi";
import CustomModal from "../../../components/common/CustomModal";
import CustomInput from "../../../components/common/CustomInput";
import CustomSelect from "../../../components/common/CustomSelect";
import { getCompaniesApi } from "../api/uam.api";
import type {
  CreateUserPayload,
  UamCompany,
  UamUser,
  UserRole,
} from "../types/Uam";

type AssignableRole = Exclude<UserRole, "SUPER_ADMIN">;

interface Props {
  open: boolean;
  onClose: () => void;
  onCreated: (payload: CreateUserPayload) => void;
  existingUsers: UamUser[];
  isSubmitting: boolean;
}

const ROLE_OPTIONS: { value: AssignableRole; label: string }[] = [
  { value: "ADMIN", label: "Admin — owns their company" },
  { value: "STAFF", label: "Staff — limited office access" },
  { value: "DELIVERY_BOY", label: "Delivery Boy — assigned deliveries only" },
];

interface FormValues {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  role: AssignableRole;
  // Real multi-select now — the backend (UsersService.create) already
  // supports one user belonging to several companies. This used to be a
  // single string wrapped into a 1-item array right before sending; now
  // the array itself IS what the form collects, no wrapping needed.
  companyIds: string[];
}

const DEFAULT_VALUES: FormValues = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  password: "",
  role: "STAFF",
  companyIds: [],
};

const CreateUserModal = ({
  open,
  onClose,
  onCreated,
  existingUsers,
  isSubmitting,
}: Props) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({ defaultValues: DEFAULT_VALUES });

  useEffect(() => {
    if (open) reset(DEFAULT_VALUES);
  }, [open, reset]);

  const { data: companies, isLoading: isLoadingCompanies } = useQuery({
    queryKey: ["companies"],
    queryFn: () => getCompaniesApi().then((res) => res.data as UamCompany[]),
    enabled: open,
    staleTime: 1000 * 60 * 5,
  });

  const companyOptions = (companies ?? []).map((c) => ({
    value: c.id,
    label: c.name,
  }));

  const submit = (values: FormValues) => {
    onCreated({
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      phone: values.phone,
      password: values.password,
      role: values.role,
      companyIds: values.companyIds,
    });
  };

  const footer = (
    <div className="flex justify-end gap-2">
      <button
        onClick={onClose}
        disabled={isSubmitting}
        className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium text-sm transition disabled:opacity-50"
      >
        Cancel
      </button>
      <button
        onClick={handleSubmit(submit)}
        disabled={isSubmitting}
        className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition shadow-sm shadow-blue-500/25 disabled:opacity-50"
      >
        {isSubmitting ? "Creating..." : "Create User"}
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
      closeOnOverlayClick={!isSubmitting}
      closeOnEsc={!isSubmitting}
      showCloseButton={!isSubmitting}
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

            <CustomSelect
              label="Company"
              name="companyIds"
              control={control}
              errors={errors}
              mode="multiple"
              showSearch
              placeholder={
                isLoadingCompanies
                  ? "Loading companies..."
                  : "Select one or more companies"
              }
              options={companyOptions}
              isrequired
              rules={{
                validate: (v: string[]) =>
                  (Array.isArray(v) && v.length > 0) ||
                  "Select at least one company",
              }}
            />
          </div>
        </div>
      </div>
    </CustomModal>
  );
};

export default CreateUserModal;
