import React from "react";
import { Input, Button, Divider } from "antd";
import { Controller, useForm } from "react-hook-form";
import {
  HiOutlineUser,
  HiOutlineLocationMarker,
  HiOutlineTruck,
  HiOutlineAnnotation,
} from "react-icons/hi";
import CustomInput from "../../../components/common/CustomInput";
import CustomSelect from "../../../components/common/CustomSelect";
import SectionLabel from "./SectionLabel";
import type { CustomerFormValues } from "../types/Customer";
import {
  CUSTOMER_TYPE_OPTIONS,
  DELIVERY_FREQUENCY_OPTIONS,
  PAYMENT_MODE_OPTIONS,
  STATE_OPTIONS,
  CUSTOMER_FORM_DEFAULTS,
} from "../constants/customerConstants";

interface CustomerFormProps {
  defaultValues?: Partial<CustomerFormValues>;
  onSubmit: (data: CustomerFormValues) => void;
  onCancel?: () => void;
  loading?: boolean;
  isEdit?: boolean;
}

const REQUIRED = (field: string) => ({ required: `${field} is required` });

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
    defaultValues: { ...CUSTOMER_FORM_DEFAULTS, ...defaultValues },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      <section>
        <SectionLabel
          icon={HiOutlineUser}
          title="Basic Information"
          subtitle="Customer name, contact, and classification"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3">
          <CustomInput
            name="name"
            control={control}
            label="Customer Name"
            placeholder="Enter full name"
            errors={errors}
            isrequired
            rules={REQUIRED("Name")}
          />
          <CustomInput
            name="phone"
            control={control}
            label="Phone Number"
            placeholder="+91 98765 43210"
            errors={errors}
            isrequired
            rules={{
              required: "Phone is required",
              pattern: {
                value: /^[+\d\s-]{10,15}$/,
                message: "Enter a valid phone number",
              },
            }}
          />
          <CustomInput
            name="email"
            control={control}
            label="Email"
            type="email"
            placeholder="email@example.com"
            errors={errors}
            rules={{
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Enter a valid email",
              },
            }}
          />
          <CustomSelect
            name="type"
            control={control}
            errors={errors}
            label="Customer Type"
            placeholder="Select type"
            options={CUSTOMER_TYPE_OPTIONS}
            isrequired
            size="large"
            rules={REQUIRED("Type")}
          />
        </div>
      </section>

      <Divider className="!my-0 !border-slate-100" />

      {/* ── Delivery & Payment ── */}
      <section>
        <SectionLabel
          icon={HiOutlineTruck}
          title="Delivery & Payment"
          subtitle="Schedule and payment preferences"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3">
          <CustomSelect
            name="deliveryFrequency"
            control={control}
            errors={errors}
            label="Delivery Frequency"
            placeholder="Select frequency"
            options={DELIVERY_FREQUENCY_OPTIONS}
            isrequired
            size="large"
            rules={REQUIRED("Delivery frequency")}
          />
          <CustomSelect
            name="paymentMode"
            control={control}
            errors={errors}
            label="Payment Mode"
            placeholder="Select payment mode"
            options={PAYMENT_MODE_OPTIONS}
            isrequired
            size="large"
            rules={REQUIRED("Payment mode")}
          />
        </div>
      </section>

      <Divider className="!my-0 !border-slate-100" />

      {/* ── Address ── */}
      <section>
        <SectionLabel
          icon={HiOutlineLocationMarker}
          title="Address"
          subtitle="Delivery address and landmarks"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3">
          <div className="md:col-span-2">
            <CustomInput
              name="addressLine1"
              control={control}
              label="Address Line 1"
              placeholder="Street, building, door no."
              errors={errors}
              isrequired
              rules={REQUIRED("Address")}
            />
          </div>
          <div className="md:col-span-2">
            <CustomInput
              name="addressLine2"
              control={control}
              label="Address Line 2"
              placeholder="Area, locality (optional)"
              errors={errors}
            />
          </div>
          <CustomInput
            name="city"
            control={control}
            label="City"
            placeholder="Chennai"
            errors={errors}
            isrequired
            rules={REQUIRED("City")}
          />
          <CustomSelect
            name="state"
            control={control}
            errors={errors}
            label="State"
            placeholder="Select state"
            options={STATE_OPTIONS}
            isrequired
            size="large"
            showSearch
            rules={REQUIRED("State")}
          />
          <CustomInput
            name="pincode"
            control={control}
            label="Pincode"
            placeholder="600001"
            errors={errors}
            isrequired
            rules={{
              required: "Pincode is required",
              pattern: {
                value: /^\d{6}$/,
                message: "Enter a valid 6-digit pincode",
              },
            }}
          />
          <CustomInput
            name="landmark"
            control={control}
            label="Landmark"
            placeholder="Near..."
            errors={errors}
          />
        </div>
      </section>

      <Divider className="!my-0 !border-slate-100" />

      {/* ── Notes ── */}
      <section>
        <SectionLabel icon={HiOutlineAnnotation} title="Notes" />
        <Controller
          name="notes"
          control={control}
          render={({ field }) => (
            <Input.TextArea
              {...field}
              placeholder="Special delivery instructions, gate codes, preferred timing..."
              rows={2}
              size="middle"
              showCount
              maxLength={500}
              className="!rounded-lg"
            />
          )}
        />
      </section>

      {/* ── Footer ── */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
        <p className="text-[10px] text-slate-400">
          {isEdit
            ? "Changes will update immediately"
            : "Customer will be added to your network"}
        </p>
        <div className="flex items-center gap-3">
          {onCancel && (
            <Button size="middle" onClick={onCancel} className="!rounded-lg">
              Cancel
            </Button>
          )}
          <Button
            type="primary"
            htmlType="submit"
            size="middle"
            loading={loading}
            className="!bg-blue-600 hover:!bg-blue-700 !rounded-lg !font-semibold !shadow-sm !shadow-blue-200"
          >
            {isEdit ? "Update Customer" : "Create Customer"}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default CustomerForm;
