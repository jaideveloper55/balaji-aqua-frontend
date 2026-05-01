import { useForm } from "react-hook-form";
import { Input } from "antd";
import { Controller } from "react-hook-form";
import { HiOutlineSave } from "react-icons/hi";
import CustomInput from "../../../components/common/CustomInput";
import { useUpdateProfile } from "../hooks/useUpdateProfile";
import type { User } from "../../auth/types/Auth";
import type { UpdateProfileRequest } from "../types/Profile";

interface ProfileInfoFormProps {
  user: User & { phone?: string | null };
}

interface FormValues {
  firstName: string;
  lastName: string;
  phone: string;
}

const ProfileInfoForm = ({ user }: ProfileInfoFormProps) => {
  const updateProfile = useUpdateProfile();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<FormValues>({
    defaultValues: {
      firstName: user.firstName ?? "",
      lastName: user.lastName ?? "",
      phone: user.phone ?? "",
    },
    mode: "onSubmit",
  });

  const onSubmit = (data: FormValues) => {
    const payload: UpdateProfileRequest = {
      firstName: data.firstName.trim(),
      lastName: data.lastName.trim(),
      phone: data.phone.trim() || null,
    };
    updateProfile.mutate(payload, {
      onSuccess: () => reset(data), // resets isDirty so button greys out
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/70 p-6 shadow-sm">
      <div className="mb-5">
        <h2 className="text-base font-bold text-slate-900">Personal Info</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Update your name and contact details
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CustomInput
            name="firstName"
            control={control}
            label="First Name"
            placeholder="Enter first name"
            errors={errors}
            isrequired
            rules={{
              required: "First name is required",
              minLength: { value: 2, message: "Minimum 2 characters" },
            }}
          />

          <CustomInput
            name="lastName"
            control={control}
            label="Last Name"
            placeholder="Enter last name"
            errors={errors}
            isrequired
            rules={{
              required: "Last name is required",
              minLength: { value: 1, message: "Required" },
            }}
          />
        </div>

        {/* Email — read-only */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-600">
            Email Address
          </label>
          <Input value={user.email} disabled size="large" />
          <p className="text-[11px] text-slate-400 font-medium">
            Email cannot be changed. Contact admin if you need to update it.
          </p>
        </div>

        {/* Phone — manually because it's optional and lets digits only */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-600">
            Phone Number
          </label>
          <Controller
            name="phone"
            control={control}
            rules={{
              pattern: {
                value: /^[+]?[\d\s-]{7,20}$/,
                message: "Enter a valid phone number",
              },
            }}
            render={({ field }) => (
              <Input
                {...field}
                size="large"
                placeholder="+91 98765 43210"
                status={errors.phone ? "error" : ""}
              />
            )}
          />
          {errors.phone && (
            <p className="text-xs text-red-500 font-medium">
              {errors.phone.message}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={() =>
              reset({
                firstName: user.firstName ?? "",
                lastName: user.lastName ?? "",
                phone: user.phone ?? "",
              })
            }
            disabled={!isDirty || updateProfile.isPending}
            className="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!isDirty || updateProfile.isPending}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all
              ${
                !isDirty || updateProfile.isPending
                  ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg"
              }`}
          >
            {updateProfile.isPending ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <HiOutlineSave size={16} />
                Save Changes
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileInfoForm;
