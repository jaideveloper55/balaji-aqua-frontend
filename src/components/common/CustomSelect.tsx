import {
  Controller,
  Control,
  FieldValues,
  RegisterOptions,
  FieldErrors,
  get,
} from "react-hook-form";
import { Select, Tooltip } from "antd";
import { ReactNode } from "react";
import { ErrorMessage } from "@hookform/error-message";

interface CustomSelectProps {
  label?: string;
  defaultValue?: string | number | null;
  name: keyof FieldValues;
  errors: FieldErrors<FieldValues>;
  placeholder: string;
  isrequired?: boolean;
  rules?: RegisterOptions<FieldValues>;
  control: Control<any>;
  disabled?: boolean;
  showSearch?: boolean;
  onChange?: (value: string) => void;
  onSelect?: (value: string, Option: any) => void;
  mode?: "multiple" | "tags";
  size?: "large" | "middle" | "small";
  isLoading?: boolean;
  options?: {
    value: string | number;
    label: string | ReactNode;
    formType?: string;
    disabled?: boolean;
  }[];
  suffixIcon?: ReactNode;
  value?: string | number | null;
}

const CustomSelect = (props: CustomSelectProps) => {
  const {
    label,
    placeholder,
    isrequired,
    name,
    rules,
    mode,
    errors,
    control,
    options,
    disabled,
    defaultValue,
    value,
    isLoading,
    suffixIcon,
    size,
    showSearch,
    onSelect,
  } = props;

  const errorMessage = get(errors, name)?.message;

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field: { onChange, value: fieldValue } }) => {
        const normalizedValue =
          value !== undefined
            ? value
            : fieldValue === "" || fieldValue === null
            ? undefined
            : fieldValue;

        return (
          <div className="relative flex flex-col gap-1 w-full">
            {label && (
              <label
                htmlFor={label}
                className="flex justify-start py-1 text-sm text-text-primary"
              >
                {label}
                {isrequired && <span className="text-red-500 ml-1">*</span>}
              </label>
            )}
            <Tooltip
              placement="bottom"
              color="#fd8484"
              title={errorMessage || null}
            >
              <Select
                id={name}
                showSearch={showSearch}
                placeholder={placeholder}
                size={size}
                loading={isLoading}
                onChange={(selectedValue) => {
                  onChange(selectedValue);
                  if (onSelect) {
                    onSelect(
                      selectedValue,
                      options?.find((opt) => opt.value === selectedValue)
                    );
                  }
                  if (props.onChange) props.onChange(selectedValue);
                }}
                status={errors[name] ? "error" : undefined}
                options={options}
                defaultValue={defaultValue}
                className="w-full"
                value={normalizedValue}
                mode={mode}
                allowClear
                disabled={disabled}
                suffixIcon={suffixIcon}
                getPopupContainer={(trigger) =>
                  trigger.parentElement || document.body
                }
              />

              <ErrorMessage
                errors={errors}
                name={name}
                render={({ message }) => (
                  <p className="text-red-500 text-sm">{message}</p>
                )}
              />
            </Tooltip>
          </div>
        );
      }}
    />
  );
};

export default CustomSelect;
