import { Input } from "antd";
import {
  Controller,
  Control,
  FieldErrors,
  FieldValues,
  Path,
} from "react-hook-form";

interface OtpInputProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  length?: number;
  errors?: FieldErrors<T>;
  label?: string;
  disabled?: boolean;
}

const OtpInput = <T extends FieldValues>({
  name,
  control,
  length = 6,
  errors,
  label = "Enter OTP",
  disabled = false,
}: OtpInputProps<T>) => {
  const errorMessage = errors?.[name]?.message as string | undefined;
  const hasError = !!errorMessage;

  return (
    <div className="flex flex-col gap-2">
      <label
        className={`text-xs font-semibold ${
          hasError ? "text-red-500" : "text-slate-600"
        }`}
      >
        {label}
      </label>

      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Input.OTP
            value={field.value || ""}
            onChange={(val) => field.onChange(val)}
            length={length}
            disabled={disabled}
            status={hasError ? "error" : ""}
            size="large"
          />
        )}
      />

      {hasError && (
        <p className="text-xs text-red-500 font-medium text-center">
          {errorMessage}
        </p>
      )}
    </div>
  );
};

export default OtpInput;
