import { Input } from "antd";
import {
  Controller,
  Control,
  FieldErrors,
  FieldValues,
  Path,
} from "react-hook-form";

interface CustomTextAreaProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label?: string;
  placeholder?: string;
  errors?: FieldErrors;
  disabled?: boolean;
  className?: string;
  isrequired?: boolean;
  rules?: any;
  rows?: number;
  maxLength?: number;
  showCount?: boolean;
}

const CustomTextArea = <T extends FieldValues>({
  name,
  control,
  label,
  placeholder,
  errors,
  disabled = false,
  className = "",
  isrequired = false,
  rules,
  rows = 3,
  maxLength = 500,
  showCount = false,
}: CustomTextAreaProps<T>) => {
  const errorMessage = errors?.[name]?.message as string | undefined;
  const hasError = !!errorMessage;

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label
          htmlFor={name}
          className="flex justify-start py-1 text-sm text-text-primary"
        >
          {label}
          {isrequired && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <Controller
        name={name}
        control={control}
        rules={rules}
        render={({ field }) => (
          <Input.TextArea
            {...field}
            id={name}
            placeholder={placeholder}
            disabled={disabled}
            rows={rows}
            maxLength={maxLength}
            showCount={showCount}
            status={hasError ? "error" : ""}
            className="!rounded-lg"
          />
        )}
      />

      {hasError && (
        <p className="text-xs text-red-500 font-medium">{errorMessage}</p>
      )}
    </div>
  );
};

export default CustomTextArea;
