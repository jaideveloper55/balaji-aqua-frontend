import { useForm } from "react-hook-form";
import { HiOutlineKey } from "react-icons/hi";
import CustomInput from "../../../components/common/CustomInput";
import { useChangePassword } from "../hooks/useChangePassword";

interface FormValues {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const ChangePasswordForm = () => {
  const changePassword = useChangePassword();

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isDirty },
  } = useForm<FormValues>({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    mode: "onSubmit",
  });

  const newPassword = watch("newPassword");

  const onSubmit = (data: FormValues) => {
    changePassword.mutate(
      {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      },
      {
        onSuccess: () =>
          reset({
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
          }),
      }
    );
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/70 p-6 shadow-sm">
      <div className="mb-5">
        <h2 className="text-base font-bold text-slate-900">Change Password</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Use a strong password — minimum 8 characters with mixed case
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-md">
        <CustomInput
          name="currentPassword"
          control={control}
          label="Current Password"
          type="password"
          placeholder="Enter current password"
          errors={errors}
          iconType="lock"
          isrequired
          rules={{ required: "Current password is required" }}
        />

        <CustomInput
          name="newPassword"
          control={control}
          label="New Password"
          type="password"
          placeholder="Enter new password"
          errors={errors}
          iconType="lock"
          isrequired
          rules={{
            required: "New password is required",
            minLength: { value: 8, message: "At least 8 characters" },
            pattern: {
              value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
              message: "Must include uppercase, lowercase, and a number",
            },
          }}
        />

        <CustomInput
          name="confirmPassword"
          control={control}
          label="Confirm New Password"
          type="password"
          placeholder="Re-enter new password"
          errors={errors}
          iconType="lock"
          isrequired
          rules={{
            required: "Please confirm your password",
            validate: (value: string) =>
              value === newPassword || "Passwords do not match",
          }}
        />

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={() => reset()}
            disabled={!isDirty || changePassword.isPending}
            className="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!isDirty || changePassword.isPending}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all
              ${
                !isDirty || changePassword.isPending
                  ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg"
              }`}
          >
            {changePassword.isPending ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Updating...
              </>
            ) : (
              <>
                <HiOutlineKey size={16} />
                Update Password
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChangePasswordForm;
