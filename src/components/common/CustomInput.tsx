import { Input } from "antd";
import {
  Controller,
  Control,
  FieldErrors,
  FieldValues,
  Path,
} from "react-hook-form";
import {
  HiOutlineMail,
  HiOutlineLockClosed,
  HiOutlineEye,
  HiOutlineEyeOff,
} from "react-icons/hi";

type InputType = "text" | "email" | "password";
type InputSize = "small" | "middle" | "large";

interface CustomInputProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label?: string;
  type?: InputType;
  placeholder?: string;
  errors?: FieldErrors;
  iconType?: "mail" | "lock";
  disabled?: boolean;
  autoFocus?: boolean;
  className?: string;
  size?: InputSize;
  isrequired?: boolean;
  rules?: any;
  numbersOnly?: boolean;
}

const ICON_MAP = {
  mail: <HiOutlineMail size={16} />,
  lock: <HiOutlineLockClosed size={16} />,
};

const CustomInput = <T extends FieldValues>({
  name,
  control,
  label,
  type = "text",
  placeholder,
  errors,
  iconType,
  disabled = false,
  autoFocus = false,
  className = "",
  size = "middle",
  isrequired = false,
  rules,
  numbersOnly = false,
}: CustomInputProps<T>) => {
  const errorMessage = errors?.[name]?.message as string | undefined;
  const hasError = !!errorMessage;

  const prefixIcon = iconType ? ICON_MAP[iconType] : undefined;

  // Block non-numeric key presses at the keyboard level
  const handleKeyDown = numbersOnly
    ? (e: React.KeyboardEvent<HTMLInputElement>) => {
        // Allow: digits, decimal point, backspace, delete, arrows, tab, enter
        const allowed = [
          "Backspace",
          "Delete",
          "ArrowLeft",
          "ArrowRight",
          "ArrowUp",
          "ArrowDown",
          "Tab",
          "Enter",
          "Home",
          "End",
        ];
        if (allowed.includes(e.key)) return;
        // Allow Ctrl/Cmd shortcuts (copy, paste, select all)
        if (e.ctrlKey || e.metaKey) return;
        // Allow digits 0-9
        if (/^\d$/.test(e.key)) return;
        // Allow one decimal point
        if (e.key === "." && !e.currentTarget.value.includes(".")) return;
        // Block everything else
        e.preventDefault();
      }
    : undefined;

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <label
        htmlFor={label}
        className="flex justify-start py-1 text-sm text-text-primary"
      >
        {label}
        {isrequired && <span className="text-red-500 ml-1">*</span>}
      </label>

      <Controller
        name={name}
        control={control}
        rules={rules}
        render={({ field }) =>
          type === "password" ? (
            <Input.Password
              {...field}
              id={name}
              size={size}
              placeholder={placeholder}
              disabled={disabled}
              autoFocus={autoFocus}
              status={hasError ? "error" : ""}
              prefix={prefixIcon}
              iconRender={(visible) =>
                visible ? (
                  <HiOutlineEyeOff size={16} />
                ) : (
                  <HiOutlineEye size={16} />
                )
              }
            />
          ) : (
            <Input
              {...field}
              id={name}
              type={type}
              size={size}
              placeholder={placeholder}
              disabled={disabled}
              autoFocus={autoFocus}
              status={hasError ? "error" : ""}
              prefix={prefixIcon}
              autoComplete={type === "email" ? "email" : "off"}
              onKeyDown={handleKeyDown}
              onChange={(e) => {
                // If numbersOnly, strip any non-numeric characters that
                // sneak through (e.g. via paste)
                if (numbersOnly) {
                  const cleaned = e.target.value.replace(/[^\d.]/g, "");
                  // Prevent multiple decimal points
                  const parts = cleaned.split(".");
                  const sanitised =
                    parts.length > 2
                      ? `${parts[0]}.${parts.slice(1).join("")}`
                      : cleaned;
                  field.onChange(sanitised);
                } else {
                  field.onChange(e);
                }
              }}
            />
          )
        }
      />

      {hasError && (
        <p className="text-xs text-red-500 font-medium">{errorMessage}</p>
      )}
    </div>
  );
};

export default CustomInput;
