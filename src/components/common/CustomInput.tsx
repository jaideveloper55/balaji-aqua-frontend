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
  label: string;
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
  size = "large",
  isrequired = false,
  rules,
}: CustomInputProps<T>) => {
  const errorMessage = errors?.[name]?.message as string | undefined;
  const hasError = !!errorMessage;

  const prefixIcon = iconType ? ICON_MAP[iconType] : undefined;

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <label
        htmlFor={name}
        className={`text-xs font-semibold ${
          hasError ? "text-red-500" : "text-slate-600"
        }`}
      >
        {label}
        {isrequired && <span className="text-red-500 ml-0.5">*</span>}
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
