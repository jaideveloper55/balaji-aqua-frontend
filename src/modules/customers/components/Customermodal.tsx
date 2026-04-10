import React, { useState, useCallback } from "react";
import { Modal, Input, Select, Button, Steps, message } from "antd";
import { Controller, useForm } from "react-hook-form";
import {
  HiOutlineUser,
  HiOutlinePhone,
  HiOutlineMail,
  HiOutlineLocationMarker,
  HiOutlineTruck,
  HiOutlineCheckCircle,
  HiOutlineArrowRight,
  HiOutlineArrowLeft,
} from "react-icons/hi";
import { customerApi } from "../services/Customer.api";
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
  <div className="flex flex-col gap-1">
    <label
      className={`text-[12px] font-semibold ${
        error ? "text-red-500" : "text-slate-600"
      }`}
    >
      {label}
      {required && <span className="text-red-400 ml-0.5">*</span>}
    </label>
    {children}
    {error && (
      <p className="text-[11px] text-red-500 font-medium mt-0.5">{error}</p>
    )}
  </div>
);

const STEPS = [
  { title: "Basic Info", icon: <HiOutlineUser size={14} /> },
  { title: "Delivery", icon: <HiOutlineTruck size={14} /> },
  { title: "Address", icon: <HiOutlineLocationMarker size={14} /> },
];

interface CustomerModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: (id: string) => void;
}

const CustomerModal: React.FC<CustomerModalProps> = ({
  open,
  onClose,
  onSuccess,
}) => {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [createdName, setCreatedName] = useState("");

  const {
    control,
    handleSubmit,
    trigger,
    reset,
    watch,
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
    },
    mode: "onChange",
  });

  const watchedName = watch("name");
  const STEP_FIELDS: (keyof CustomerFormValues)[][] = [
    ["name", "phone", "email", "type"],
    ["deliveryFrequency", "paymentMode", "notes"],
    ["addressLine1", "addressLine2", "city", "state", "pincode", "landmark"],
  ];

  const handleNext = useCallback(async () => {
    const valid = await trigger(STEP_FIELDS[step]);
    if (valid) setStep((s) => Math.min(s + 1, 2));
  }, [step, trigger]);
  const handleBack = () => setStep((s) => Math.max(s - 1, 0));

  const onSubmit = useCallback(
    async (data: CustomerFormValues) => {
      setLoading(true);
      try {
        const created = await customerApi.createCustomer(data);
        setCreatedName(created.name);
        setSuccess(true);
        setTimeout(() => {
          onSuccess?.(created.id);
        }, 2000);
      } catch {
        message.error("Failed to create customer. Please try again.");
      } finally {
        setLoading(false);
      }
    },
    [onSuccess]
  );

  const handleFinalSubmit = useCallback(async () => {
    const valid = await trigger(STEP_FIELDS[2]);
    if (valid) handleSubmit(onSubmit)();
  }, [trigger, handleSubmit, onSubmit]);

  const handleClose = () => {
    setStep(0);
    setSuccess(false);
    setCreatedName("");
    reset();
    onClose();
  };

  if (success) {
    return (
      <Modal
        open={open}
        onCancel={handleClose}
        footer={null}
        width={480}
        centered
        closable={false}
      >
        <div className="flex flex-col items-center justify-center py-10 gap-4">
          <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center">
            <HiOutlineCheckCircle size={36} className="text-emerald-500" />
          </div>
          <div className="text-center">
            <h3 className="text-[16px] font-bold text-slate-800">
              Customer Created!
            </h3>
            <p className="text-[13px] text-slate-500 mt-1">
              <span className="font-semibold text-slate-700">
                {createdName}
              </span>{" "}
              has been added successfully.
            </p>
          </div>
          <p className="text-[11px] text-slate-400 animate-pulse">
            Redirecting to details...
          </p>
        </div>
      </Modal>
    );
  }

  return (
    <Modal
      open={open}
      onCancel={handleClose}
      footer={null}
      width={600}
      centered
      destroyOnClose
      title={null}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-1 pl-4 border-l-[3px] border-l-blue-500">
        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
          <HiOutlineUser size={20} className="text-blue-500" />
        </div>
        <div>
          <h2 className="text-[15px] font-bold text-slate-800 leading-tight">
            New Customer
          </h2>
          <p className="text-[11px] text-slate-400 mt-0.5">
            {watchedName ? (
              <>
                Adding{" "}
                <span className="font-semibold text-slate-600">
                  {watchedName}
                </span>
              </>
            ) : (
              "Fill in the details to add a new customer"
            )}
          </p>
        </div>
      </div>

      <div className="my-5">
        <Steps
          current={step}
          size="small"
          items={STEPS.map((s) => ({
            title: <span className="text-[11px] font-semibold">{s.title}</span>,
            icon: <span className="text-sm">{s.icon}</span>,
          }))}
        />
      </div>

      <form onSubmit={(e) => e.preventDefault()}>
        <div className="min-h-[280px]">
          {step === 0 && (
            <div className="flex flex-col gap-4 animate-[fadeIn_0.2s_ease]">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field
                  label="Customer Name"
                  error={errors.name?.message}
                  required
                >
                  <Controller
                    name="name"
                    control={control}
                    rules={{ required: "Name is required" }}
                    render={({ field }) => (
                      <Input
                        {...field}
                        placeholder="Enter full name"
                        size="large"
                        prefix={
                          <HiOutlineUser size={14} className="text-slate-400" />
                        }
                        status={errors.name ? "error" : ""}
                        autoFocus
                        className="!rounded-lg"
                      />
                    )}
                  />
                </Field>
                <Field
                  label="Phone Number"
                  error={errors.phone?.message}
                  required
                >
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
                          <HiOutlinePhone
                            size={14}
                            className="text-slate-400"
                          />
                        }
                        status={errors.phone ? "error" : ""}
                        className="!rounded-lg"
                      />
                    )}
                  />
                </Field>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                        className="!rounded-lg"
                      />
                    )}
                  />
                </Field>
                <Field
                  label="Customer Type"
                  error={errors.type?.message}
                  required
                >
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
          )}

          {step === 1 && (
            <div className="flex flex-col gap-4 animate-[fadeIn_0.2s_ease]">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
              <Field label="Notes">
                <Controller
                  name="notes"
                  control={control}
                  render={({ field }) => (
                    <Input.TextArea
                      {...field}
                      placeholder="Any special delivery instructions..."
                      rows={4}
                      size="large"
                      showCount
                      maxLength={300}
                      className="!rounded-lg"
                    />
                  )}
                />
              </Field>
              <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4 mt-1">
                <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-2">
                  Summary so far
                </p>
                <div className="flex flex-wrap gap-x-6 gap-y-1 text-[12px] text-slate-600">
                  <span>
                    <span className="text-slate-400">Name:</span>{" "}
                    <span className="font-semibold">{watchedName || "—"}</span>
                  </span>
                  <span>
                    <span className="text-slate-400">Phone:</span>{" "}
                    <span className="font-semibold">
                      {watch("phone") || "—"}
                    </span>
                  </span>
                  <span>
                    <span className="text-slate-400">Type:</span>{" "}
                    <span className="font-semibold capitalize">
                      {watch("type")}
                    </span>
                  </span>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="flex flex-col gap-4 animate-[fadeIn_0.2s_ease]">
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
                      prefix={
                        <HiOutlineLocationMarker
                          size={14}
                          className="text-slate-400"
                        />
                      }
                      status={errors.addressLine1 ? "error" : ""}
                      autoFocus
                      className="!rounded-lg"
                    />
                  )}
                />
              </Field>
              <Field label="Address Line 2">
                <Controller
                  name="addressLine2"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder="Area, locality (optional)"
                      size="large"
                      className="!rounded-lg"
                    />
                  )}
                />
              </Field>
              <div className="grid grid-cols-2 gap-4">
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
                        className="!rounded-lg"
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
                        className="!rounded-lg"
                      />
                    )}
                  />
                </Field>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Pincode" error={errors.pincode?.message} required>
                  <Controller
                    name="pincode"
                    control={control}
                    rules={{
                      required: "Pincode is required",
                      pattern: {
                        value: /^\d{6}$/,
                        message: "Must be 6 digits",
                      },
                    }}
                    render={({ field }) => (
                      <Input
                        {...field}
                        placeholder="600001"
                        size="large"
                        maxLength={6}
                        status={errors.pincode ? "error" : ""}
                        className="!rounded-lg"
                      />
                    )}
                  />
                </Field>
                <Field label="Landmark">
                  <Controller
                    name="landmark"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        placeholder="Near..."
                        size="large"
                        className="!rounded-lg"
                      />
                    )}
                  />
                </Field>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-100">
          <div>
            {step > 0 && (
              <Button
                size="large"
                icon={<HiOutlineArrowLeft size={14} />}
                onClick={handleBack}
                className="!rounded-xl"
              >
                Back
              </Button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-400 mr-2">
              Step {step + 1} of 3
            </span>
            {step < 2 ? (
              <Button
                type="primary"
                size="large"
                onClick={handleNext}
                className="!flex !items-center !gap-1 !rounded-xl !bg-blue-600 hover:!bg-blue-700 !font-semibold"
              >
                Next <HiOutlineArrowRight size={14} />
              </Button>
            ) : (
              <Button
                type="primary"
                size="large"
                loading={loading}
                onClick={handleFinalSubmit}
                className="!flex !items-center !gap-1 !rounded-xl !bg-blue-600 hover:!bg-blue-700 !font-semibold !shadow-sm !shadow-blue-200"
              >
                <HiOutlineCheckCircle size={15} /> Create Customer
              </Button>
            )}
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default CustomerModal;
