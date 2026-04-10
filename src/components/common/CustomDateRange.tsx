"use client";
import React from "react";
import { DatePicker, Tooltip } from "antd";
import { Dayjs } from "dayjs";
import {
  Controller,
  Control,
  FieldErrors,
  get,
  RegisterOptions,
} from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";

const { RangePicker } = DatePicker;

interface CustomDateRangeProps {
  label?: string;
  name: string;
  control: Control<any>;
  errors: FieldErrors;
  placeholder?: [string, string];
  isrequired?: boolean;
  rules?: RegisterOptions;
  disabled?: boolean;
  size?: "large" | "middle" | "small";
  onChange?: (dates: [Dayjs | null, Dayjs | null]) => void;
}

const CustomDateRange: React.FC<CustomDateRangeProps> = ({
  label,
  name,
  control,
  errors,
  placeholder,
  isrequired,
  rules,
  disabled = false,
  size = "middle",
  onChange,
}) => {
  const errorMessage = get(errors, name)?.message;

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field: { onChange: fieldChange, value } }) => (
        <div className="w-full">
          {/* Label */}
          {label && (
            <label className="flex justify-start py-1 items-center text-sm font-medium text-gray-700">
              {label}
              {isrequired && <span className="text-red-500 ml-1">*</span>}
            </label>
          )}

          {/* Date Range Picker with Tooltip */}
          <Tooltip
            placement="bottom"
            color="#fd8484"
            title={errorMessage || null}
          >
            <RangePicker
              size={size}
              style={{ width: "100%" }}
              disabled={disabled}
              placeholder={placeholder || ["Start Date", "End Date"]}
              value={value}
              format="YYYY-MM-DD"
              status={errorMessage ? "error" : undefined}
              onChange={(dates) => {
                fieldChange(dates);
                onChange?.(dates as [Dayjs | null, Dayjs | null]);
              }}
            />
          </Tooltip>

          {/* Error Message */}
          <ErrorMessage
            errors={errors}
            name={name}
            render={({ message }) => (
              <p className="text-red-500 text-sm mt-1">{message}</p>
            )}
          />
        </div>
      )}
    />
  );
};

export default CustomDateRange;
