import React, { useState, useCallback, useEffect } from "react";
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
  HiOutlinePencilAlt,
} from "react-icons/hi";
import CustomModal from "../../../components/common/CustomModal";
import CustomInput from "../../../components/common/CustomInput";
import CustomSelect from "../../../components/common/CustomSelect";
import { useCreateCustomer } from "../hooks/useCreateCustomer";
import { useUpdateCustomer } from "../hooks/useUpdateCustomer";
import type {
  Customer,
  CustomerFormValues,
  CustomerType,
  DeliveryFrequency,
  PaymentMode,
} from "../types/Customer";

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

const STEPS = [
  { title: "Basic Info", icon: <HiOutlineUser size={14} /> },
  { title: "Delivery", icon: <HiOutlineTruck size={14} /> },
  { title: "Address", icon: <HiOutlineLocationMarker size={14} /> },
];

interface CustomerModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: (id: string) => void;
  customer?: Customer;
}

const CustomerModal: React.FC<CustomerModalProps> = ({
  open,
  onClose,
  onSuccess,
  customer,
}) => {
  const isEditMode = !!customer;
  const [step, setStep] = useState(0);
  const [success, setSuccess] = useState(false);
  const [savedName, setSavedName] = useState("");
  const createCustomer = useCreateCustomer();
  const updateCustomer = useUpdateCustomer();
  const isSaving = createCustomer.isPending || updateCustomer.isPending;

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
      outstandingBalance: 0,
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

  useEffect(() => {
    if (customer && open) {
      const c = customer as any;
      reset({
        name: c.name ?? "",
        phone: c.phone ?? "",
        email: c.email ?? "",
        type: c.type ?? "RESIDENTIAL",
        deliveryFrequency: c.deliveryFrequency ?? "DAILY",
        paymentMode: c.paymentMode ?? "CASH",
        outstandingBalance: Number(c.outstandingBalance ?? 0),
        addressLine1: c.addressLine1 ?? "",
        addressLine2: c.addressLine2 ?? "",
        city: c.city ?? "",
        state: c.state ?? "Tamil Nadu",
        pincode: c.pincode ?? "",
        landmark: c.landmark ?? "",
        notes: c.notes ?? "",
      });
      setStep(0);
    }
  }, [customer, open, reset]);

  const STEP_FIELDS: (keyof CustomerFormValues)[][] = [
    ["name", "phone", "email", "type"],
    ["deliveryFrequency", "paymentMode", "outstandingBalance", "notes"],
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
        outstandingBalance: Number(data.outstandingBalance ?? 0),
        email: data.email?.trim() || undefined,
        addressLine2: data.addressLine2?.trim() || undefined,
        landmark: data.landmark?.trim() || undefined,
        notes: data.notes?.trim() || undefined,
      };

      if (isEditMode && customer) {
        // ─── EDIT MODE ───
        updateCustomer.mutate(
          { id: customer.id, data: payload },
          {
            onSuccess: (updated) => {
              setSavedName(updated.name);
              setSuccess(true);
              setTimeout(() => {
                onSuccess?.(updated.id);
              }, 1500);
            },
          }
        );
      } else {
        // ─── CREATE MODE ───
        createCustomer.mutate(payload, {
          onSuccess: (created) => {
            setSavedName(created.name);
            setSuccess(true);
            setTimeout(() => {
              onSuccess?.(created.id);
            }, 1500);
          },
        });
      }
    },
    [createCustomer, updateCustomer, onSuccess, isEditMode, customer]
  );

  const handleFinalSubmit = useCallback(async () => {
    const valid = await trigger(STEP_FIELDS[2]);
    if (valid) handleSubmit(onSubmit)();
  }, [trigger, handleSubmit, onSubmit]);

  const handleClose = () => {
    setStep(0);
    setSuccess(false);
    setSavedName("");
    reset();
    onClose();
  };

  if (success) {
    return (
      <CustomModal
        open={open}
        onClose={handleClose}
        title={isEditMode ? "Customer Updated!" : "Customer Created!"}
        subtitle={`${savedName} has been ${
          isEditMode ? "updated" : "added"
        } successfully`}
        icon={<HiOutlineCheckCircle size={20} />}
        iconTone="green"
        size="md"
        showCloseButton={false}
      >
        <div className="flex flex-col items-center justify-center py-8 gap-4">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-emerald-200 animate-ping opacity-75" />
            <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-200">
              <HiOutlineCheckCircle size={40} className="text-white" />
            </div>
          </div>
          <p className="text-[11px] text-slate-400 animate-pulse">
            {isEditMode ? "Closing..." : "Redirecting to details..."}
          </p>
        </div>
      </CustomModal>
    );
  }

  const footer = (
    <div className="flex items-center justify-between">
      <div>
        {step > 0 && (
          <Button
            size="large"
            icon={<HiOutlineArrowLeft size={14} />}
            onClick={handleBack}
            disabled={isSaving}
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
            loading={isSaving}
            onClick={handleFinalSubmit}
            className="!flex !items-center !gap-1 !rounded-xl !bg-emerald-600 hover:!bg-emerald-700 !font-semibold !shadow-sm !shadow-emerald-200"
          >
            <HiOutlineCheckCircle size={15} />
            {isEditMode ? "Save Changes" : "Create Customer"}
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
      title={isEditMode ? "Edit Customer" : "New Customer"}
      subtitle={
        isEditMode
          ? `Updating ${customer?.name}`
          : watchedName
          ? `Adding ${watchedName}`
          : "Fill in the details to add a new customer"
      }
      icon={
        isEditMode ? (
          <HiOutlinePencilAlt size={20} />
        ) : (
          <HiOutlineUserAdd size={20} />
        )
      }
      iconTone="blue"
      size="2xl"
      footer={footer}
      closeOnOverlayClick={!isSaving}
      closeOnEsc={!isSaving}
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
        <div className="">
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
              <div className="grid grid-cols-1 items-center sm:grid-cols-2 gap-4">
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

              {/* Opening Balance — outstanding amount at onboarding */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-600">
                  Opening Balance{" "}
                  <span className="text-slate-400 font-normal">
                    (outstanding at onboarding)
                  </span>
                </label>
                <Controller
                  name="outstandingBalance"
                  control={control}
                  rules={{
                    min: { value: 0, message: "Cannot be negative" },
                  }}
                  render={({ field, fieldState }) => (
                    <>
                      <Input
                        {...field}
                        type="number"
                        min={0}
                        step="0.01"
                        prefix="₹"
                        placeholder="0.00"
                        size="large"
                        className="!rounded-lg"
                        status={fieldState.error ? "error" : ""}
                        onChange={(e) => {
                          const v = e.target.value;
                          field.onChange(v === "" ? 0 : Number(v));
                        }}
                      />
                      {fieldState.error && (
                        <span className="text-[11px] text-red-500">
                          {fieldState.error.message}
                        </span>
                      )}
                      <span className="text-[10px] text-slate-400">
                        Leave 0 if customer has no pending dues
                      </span>
                    </>
                  )}
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
