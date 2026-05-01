import React, { useState, useCallback } from "react";
import { Button, Steps, Input } from "antd";
import { useForm, Controller } from "react-hook-form";
import {
  HiOutlineUser,
  HiOutlineTruck,
  HiOutlineCheckCircle,
  HiOutlineArrowRight,
  HiOutlineArrowLeft,
  HiOutlineLocationMarker,
  HiOutlineUserAdd,
} from "react-icons/hi";
import CustomModal from "../../../components/common/CustomModal";
import CustomInput from "../../../components/common/CustomInput";
import CustomSelect from "../../../components/common/CustomSelect";
import { useCreateCustomer } from "../hooks/useCreateCustomer";
import type {
  CustomerFormValues,
  CustomerType,
  DeliveryFrequency,
  PaymentMode,
} from "../types/Customer";

// ─── Options (UPPERCASE values matching backend Prisma enums) ──────────────

const TYPE_OPTS: { value: CustomerType; label: string }[] = [
  { value: "RESIDENTIAL", label: "Residential" },
  { value: "COMMERCIAL", label: "Commercial" },
  { value: "INDUSTRIAL", label: "Industrial" },
];

const FREQ_OPTS: { value: DeliveryFrequency; label: string }[] = [
  { value: "DAILY", label: "Daily" },
  { value: "ALTERNATE", label: "Alternate Days" },
  { value: "WEEKLY", label: "Weekly" },
  { value: "MONTHLY", label: "Monthly" },
  { value: "ON_DEMAND", label: "On Demand" },
];

const PAY_OPTS: { value: PaymentMode; label: string }[] = [
  { value: "CASH", label: "Cash" },
  { value: "UPI", label: "UPI" },
  { value: "CARD", label: "Card" },
  { value: "BANK_TRANSFER", label: "Bank Transfer" },
  { value: "CREDIT", label: "Credit" },
];

const TYPE_LABELS: Record<CustomerType, string> = {
  RESIDENTIAL: "Residential",
  COMMERCIAL: "Commercial",
  INDUSTRIAL: "Industrial",
};

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
  const [success, setSuccess] = useState(false);
  const [createdName, setCreatedName] = useState("");

  const createCustomer = useCreateCustomer();

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
      type: "RESIDENTIAL",
      deliveryFrequency: "DAILY",
      paymentMode: "CASH",
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
    (data: CustomerFormValues) => {
      const payload: CustomerFormValues = {
        ...data,
        email: data.email?.trim() || undefined,
        addressLine2: data.addressLine2?.trim() || undefined,
        landmark: data.landmark?.trim() || undefined,
        notes: data.notes?.trim() || undefined,
      };

      createCustomer.mutate(payload, {
        onSuccess: (created) => {
          setCreatedName(created.name);
          setSuccess(true);
          setTimeout(() => {
            onSuccess?.(created.id);
          }, 2000);
        },
      });
    },
    [createCustomer, onSuccess]
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

  // ─── Success screen ──────────────────────────────────────────────────────
  if (success) {
    return (
      <CustomModal
        open={open}
        onClose={handleClose}
        title="Customer Created!"
        subtitle={`${createdName} has been added successfully`}
        icon={<HiOutlineCheckCircle size={20} />}
        iconTone="green"
        size="md"
        showCloseButton={false}
      >
        <div className="flex flex-col items-center justify-center py-6 gap-3">
          <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center">
            <HiOutlineCheckCircle size={36} className="text-emerald-500" />
          </div>
          <p className="text-[11px] text-slate-400 animate-pulse">
            Redirecting to details...
          </p>
        </div>
      </CustomModal>
    );
  }

  // ─── Footer (used in main wizard) ────────────────────────────────────────
  const footer = (
    <div className="flex items-center justify-between">
      <div>
        {step > 0 && (
          <Button
            size="large"
            icon={<HiOutlineArrowLeft size={14} />}
            onClick={handleBack}
            disabled={createCustomer.isPending}
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
            loading={createCustomer.isPending}
            onClick={handleFinalSubmit}
            className="!flex !items-center !gap-1 !rounded-xl !bg-blue-600 hover:!bg-blue-700 !font-semibold !shadow-sm !shadow-blue-200"
          >
            <HiOutlineCheckCircle size={15} /> Create Customer
          </Button>
        )}
      </div>
    </div>
  );

  // ─── Wizard ──────────────────────────────────────────────────────────────
  return (
    <CustomModal
      open={open}
      onClose={handleClose}
      title="New Customer"
      subtitle={
        watchedName
          ? `Adding ${watchedName}`
          : "Fill in the details to add a new customer"
      }
      icon={<HiOutlineUserAdd size={20} />}
      iconTone="blue"
      size="2xl"
      footer={footer}
      closeOnOverlayClick={!createCustomer.isPending}
      closeOnEsc={!createCustomer.isPending}
    >
      {/* Steps indicator */}
      <div className="mb-6">
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
          {/* ─── STEP 0: Basic Info ─────────────────────────────────────── */}
          {step === 0 && (
            <div className="flex flex-col gap-4 animate-[fadeIn_0.2s_ease]">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <CustomInput
                  name="name"
                  control={control}
                  label="Customer Name"
                  placeholder="Enter full name"
                  errors={errors}
                  isrequired
                  autoFocus
                  rules={{ required: "Name is required" }}
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
                      value: /^[+]?[\d\s-]{10,15}$/,
                      message: "Invalid phone",
                    },
                  }}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <CustomInput
                  name="email"
                  control={control}
                  label="Email"
                  type="email"
                  placeholder="email@example.com"
                  iconType="mail"
                  errors={errors}
                  rules={{
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Invalid email",
                    },
                  }}
                />
                <CustomSelect
                  name="type"
                  control={control}
                  label="Customer Type"
                  placeholder="Select type"
                  errors={errors}
                  isrequired
                  size="large"
                  options={TYPE_OPTS}
                  rules={{ required: "Required" }}
                />
              </div>
            </div>
          )}

          {/* ─── STEP 1: Delivery ───────────────────────────────────────── */}
          {step === 1 && (
            <div className="flex flex-col gap-4 animate-[fadeIn_0.2s_ease]">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <CustomSelect
                  name="deliveryFrequency"
                  control={control}
                  label="Delivery Frequency"
                  placeholder="Select frequency"
                  errors={errors}
                  isrequired
                  size="large"
                  options={FREQ_OPTS}
                  rules={{ required: "Required" }}
                />
                <CustomSelect
                  name="paymentMode"
                  control={control}
                  label="Payment Mode"
                  placeholder="Select payment mode"
                  errors={errors}
                  isrequired
                  size="large"
                  options={PAY_OPTS}
                  rules={{ required: "Required" }}
                />
              </div>

              {/* Notes — Input.TextArea (no CustomInput equivalent, so inline Controller) */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-600">
                  Notes
                </label>
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
              </div>

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
                    <span className="font-semibold">
                      {TYPE_LABELS[watch("type")]}
                    </span>
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* ─── STEP 2: Address ────────────────────────────────────────── */}
          {step === 2 && (
            <div className="flex flex-col gap-4 animate-[fadeIn_0.2s_ease]">
              <CustomInput
                name="addressLine1"
                control={control}
                label="Address Line 1"
                placeholder="Street, building, door no."
                errors={errors}
                isrequired
                autoFocus
                rules={{ required: "Address is required" }}
              />
              <CustomInput
                name="addressLine2"
                control={control}
                label="Address Line 2"
                placeholder="Area, locality (optional)"
                errors={errors}
              />

              <div className="grid grid-cols-2 gap-4">
                <CustomInput
                  name="city"
                  control={control}
                  label="City"
                  placeholder="Chennai"
                  errors={errors}
                  isrequired
                  rules={{ required: "City is required" }}
                />
                <CustomInput
                  name="state"
                  control={control}
                  label="State"
                  placeholder="Tamil Nadu"
                  errors={errors}
                  isrequired
                  rules={{ required: "State is required" }}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
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
                      message: "Must be 6 digits",
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
            </div>
          )}
        </div>
      </form>
    </CustomModal>
  );
};

export default CustomerModal;
