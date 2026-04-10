import React from "react";
import { Checkbox, Tooltip } from "antd";
import { Controller, Control, FieldErrors } from "react-hook-form";
import { get } from "react-hook-form";

interface CustomCheckboxProps {
  name: string;
  label?: string | React.ReactNode;
  control: Control<any>;
  errors: FieldErrors;
  disabled?: boolean;
  className?: string;
}

const CustomCheckbox: React.FC<CustomCheckboxProps> = ({
  name,
  label,
  control,
  errors,
  disabled,
  className,
}) => {
  const errorMessage = get(errors, name)?.message;
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value } }) => (
        <Tooltip title={errorMessage || ""} color="#fd8484">
          <Checkbox
            checked={!!value}
            onChange={(e) => onChange(e.target.checked)}
            disabled={disabled}
            className={className}
          >
            {label}
          </Checkbox>
        </Tooltip>
      )}
    />
  );
};

export default CustomCheckbox;
