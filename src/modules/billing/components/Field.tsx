// modules/billing/components/Field.tsx

import React from "react";
import { Input } from "antd";

interface FieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
  icon?: React.ReactNode;
  error?: string;
  autoFocus?: boolean;
  size?: "small" | "middle" | "large";
}

const Field: React.FC<FieldProps> = ({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required,
  icon,
  error,
  autoFocus,
  size = "middle",
}) => (
  <div className="flex flex-col gap-1.5">
    <label
      className={`text-xs font-semibold ${
        error ? "text-red-500" : "text-slate-600"
      }`}
    >
      {label}
      {required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
    <Input
      type={type}
      size={size}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      autoFocus={autoFocus}
      status={error ? "error" : undefined}
      prefix={icon}
    />
    {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
  </div>
);

export default Field;
