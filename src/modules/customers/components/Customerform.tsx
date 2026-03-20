import React from "react";
import { Input, Select, Button } from "antd";
import { Controller, useForm } from "react-hook-form";
import {
  HiOutlineUser,
  HiOutlinePhone,
  HiOutlineMail,
  HiOutlineLocationMarker,
  HiOutlineTruck,
  HiOutlineAnnotation,
} from "react-icons/hi";
import type {
  CustomerFormValues,
  CustomerType,
  DeliveryFrequency,
  PaymentMode,
} from "../types/Customer";

const TYPE_OPTS: { value: CustomerType; label: string }[] = [
  { value: "residential", label: "Residential" },
  { value: "commercial", label: "Commercial" },
  { value: "industrial", label: "Industrial" },
];
const FREQ_OPTS: { value: DeliveryFrequency; label: string }[] = [
  { value: "daily", label: "Daily" },
  { value: "alternate", label: "Alternate Days" },
  { value: "weekly", label: "Weekly" },
  { value: "on_demand", label: "On Demand" },
];
const PAY_OPTS: { value: PaymentMode; label: string }[] = [
  { value: "cash", label: "Cash" },
  { value: "upi", label: "UPI" },
  { value: "bank_transfer", label: "Bank Transfer" },
  { value: "credit", label: "Credit" },
];

const Field: React.FC<{
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}> = ({ label, error, required, children }) => (
  <div className="flex flex-col gap-1.5">
    <label
      className={`text-xs font-semibold ${error ? "text-red-500" : "text-slate-600"}`}
    >
      {label}
      {required && <span className="text-red-400 ml-0.5">*</span>}
    </label>
    {children}
    {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
  </div>
);

interface CustomerFormProps {
  defaultValues?: Partial<CustomerFormValues>;
  onSubmit: (data: CustomerFormValues) => void;
  onCancel?: () => void;
  loading?: boolean;
  isEdit?: boolean;
}

const CustomerForm: React.FC<CustomerFormProps> = ({
  defaultValues,
  onSubmit,
  onCancel,
  loading = false,
  isEdit = false,
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CustomerFormValues>({
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      type: "residential",
      deliveryFrequency: "daily",
      paymentMode: "cash",
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "Tamil Nadu",
      pincode: "",
      landmark: "",
      notes: "",
      ...defaultValues,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      <div>
        <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
          <HiOutlineUser size={16} className="text-blue-500" />
          Basic Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Customer Name" error={errors.name?.message} required>
            <Controller
              name="name"
              control={control}
              rules={{ required: "Name is required" }}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Enter full name"
                  size="large"
                  status={errors.name ? "error" : ""}
                />
              )}
            />
          </Field>
          <Field label="Phone Number" error={errors.phone?.message} required>
            <Controller
              name="phone"
              control={control}
              rules={{
                required: "Phone is required",
                pattern: {
                  value: /^[+]?[\d\s-]{10,15}$/,
                  message: "Invalid phone",
                },
              }}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="+91 98765 43210"
                  size="large"
                  prefix={
                    <HiOutlinePhone size={14} className="text-slate-400" />
                  }
                  status={errors.phone ? "error" : ""}
                />
              )}
            />
          </Field>
          <Field label="Email" error={errors.email?.message}>
            <Controller
              name="email"
              control={control}
              rules={{
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Invalid email",
                },
              }}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="email@example.com"
                  size="large"
                  prefix={
                    <HiOutlineMail size={14} className="text-slate-400" />
                  }
                  status={errors.email ? "error" : ""}
                />
              )}
            />
          </Field>
          <Field label="Customer Type" error={errors.type?.message} required>
            <Controller
              name="type"
              control={control}
              rules={{ required: "Required" }}
              render={({ field }) => (
                <Select
                  {...field}
                  options={TYPE_OPTS}
                  size="large"
                  className="w-full"
                />
              )}
            />
          </Field>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
          <HiOutlineTruck size={16} className="text-blue-500" />
          Delivery & Payment
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field
            label="Delivery Frequency"
            error={errors.deliveryFrequency?.message}
            required
          >
            <Controller
              name="deliveryFrequency"
              control={control}
              rules={{ required: "Required" }}
              render={({ field }) => (
                <Select
                  {...field}
                  options={FREQ_OPTS}
                  size="large"
                  className="w-full"
                />
              )}
            />
          </Field>
          <Field
            label="Payment Mode"
            error={errors.paymentMode?.message}
            required
          >
            <Controller
              name="paymentMode"
              control={control}
              rules={{ required: "Required" }}
              render={({ field }) => (
                <Select
                  {...field}
                  options={PAY_OPTS}
                  size="large"
                  className="w-full"
                />
              )}
            />
          </Field>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
          <HiOutlineLocationMarker size={16} className="text-blue-500" />
          Address
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <Field
              label="Address Line 1"
              error={errors.addressLine1?.message}
              required
            >
              <Controller
                name="addressLine1"
                control={control}
                rules={{ required: "Address is required" }}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="Street, building, door no."
                    size="large"
                    status={errors.addressLine1 ? "error" : ""}
                  />
                )}
              />
            </Field>
          </div>
          <div className="md:col-span-2">
            <Field label="Address Line 2">
              <Controller
                name="addressLine2"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="Area, locality (optional)"
                    size="large"
                  />
                )}
              />
            </Field>
          </div>
          <Field label="City" error={errors.city?.message} required>
            <Controller
              name="city"
              control={control}
              rules={{ required: "City is required" }}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Chennai"
                  size="large"
                  status={errors.city ? "error" : ""}
                />
              )}
            />
          </Field>
          <Field label="State" error={errors.state?.message} required>
            <Controller
              name="state"
              control={control}
              rules={{ required: "State is required" }}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Tamil Nadu"
                  size="large"
                  status={errors.state ? "error" : ""}
                />
              )}
            />
          </Field>
          <Field label="Pincode" error={errors.pincode?.message} required>
            <Controller
              name="pincode"
              control={control}
              rules={{
                required: "Pincode is required",
                pattern: { value: /^\d{6}$/, message: "Must be 6 digits" },
              }}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="600001"
                  size="large"
                  maxLength={6}
                  status={errors.pincode ? "error" : ""}
                />
              )}
            />
          </Field>
          <Field label="Landmark">
            <Controller
              name="landmark"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Near..." size="large" />
              )}
            />
          </Field>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
          <HiOutlineAnnotation size={16} className="text-blue-500" />
          Notes
        </h3>
        <Controller
          name="notes"
          control={control}
          render={({ field }) => (
            <Input.TextArea
              {...field}
              placeholder="Any special instructions..."
              rows={3}
              size="large"
            />
          )}
        />
      </div>

      <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100">
        {onCancel && (
          <Button size="large" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="primary" htmlType="submit" size="large" loading={loading}>
          {isEdit ? "Update Customer" : "Create Customer"}
        </Button>
      </div>
    </form>
  );
};

export default CustomerForm;
