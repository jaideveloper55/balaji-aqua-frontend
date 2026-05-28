import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { HiUserPlus } from "react-icons/hi2";
import { HiOutlineCheckCircle, HiOutlineLocationMarker } from "react-icons/hi";

import { customersApi } from "../../../customers/api/customers.api";
import {
  errorNotification,
  successNotification,
} from "../../../../components/common/Notification";
import CustomInput from "../../../../components/common/CustomInput";
import CustomModal from "../../../../components/common/CustomModal";
import CustomSelect from "../../../../components/common/CustomSelect";

// ─── Types ──────────────────────────────────────────────────────────────────

export type CustomerType = "RESIDENTIAL" | "COMMERCIAL" | "INDUSTRIAL";
export type DeliveryFrequency = "DAILY" | "WEEKLY" | "MONTHLY" | "ON_DEMAND";
export type PaymentMode = "CASH" | "UPI" | "BANK_TRANSFER" | "CREDIT";

export interface CustomerFormValues {
  name: string;
  phone: string;
  email?: string;
  type: CustomerType;
  outstandingBalance: number;
  deliveryFrequency: DeliveryFrequency;
  paymentMode: PaymentMode;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  landmark?: string;
  notes?: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  /** Called after a successful create — receives the new customer from the API. */
  onCreated: (customer: any) => void;
}

// ─── Defaults ───────────────────────────────────────────────────────────────

const DEFAULT_VALUES: CustomerFormValues = {
  name: "",
  phone: "",
  email: "",
  type: "RESIDENTIAL",
  outstandingBalance: 0,
  deliveryFrequency: "ON_DEMAND",
  paymentMode: "CASH",
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "Tamil Nadu",
  pincode: "",
  landmark: "",
  notes: "",
};

// ─── Component ──────────────────────────────────────────────────────────────

const QuickAddCustomerModal: React.FC<Props> = ({
  open,
  onClose,
  onCreated,
}) => {
  const queryClient = useQueryClient();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<CustomerFormValues>({
    defaultValues: DEFAULT_VALUES,
    mode: "onBlur",
  });

  // Reset whenever the modal opens (fresh form each time)
  useEffect(() => {
    if (open) reset(DEFAULT_VALUES);
  }, [open, reset]);

  const createMutation = useMutation({
    mutationFn: (data: CustomerFormValues) => customersApi.create(data as any),
    onSuccess: (customer) => {
      successNotification(
        "Customer Added",
        `${(customer as any)?.name ?? "Customer"} created successfully`
      );
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      queryClient.invalidateQueries({
        queryKey: ["billing-payment-customers"],
      });
      onCreated(customer);
      onClose();
    },
    onError: (err: any) => {
      const msg =
        err?.response?.data?.message ??
        err?.message ??
        "Could not create customer";
      errorNotification("Create Failed", Array.isArray(msg) ? msg[0] : msg);
    },
  });

  const onSubmit = (data: CustomerFormValues) => {
    createMutation.mutate(data);
  };

  // Block close mid-edit
  const beforeClose = async () => {
    if (createMutation.isPending) return false;
    if (isDirty) {
      return window.confirm(
        "Discard this customer? Your changes will be lost."
      );
    }
    return true;
  };

  return (
    <CustomModal
      open={open}
      onClose={onClose}
      beforeClose={beforeClose}
      title="Quick Add Customer"
      subtitle="Save customer details for future billing"
      icon={<HiUserPlus className="w-5 h-5" />}
      iconTone="green"
      size="2xl"
      footer={
        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            disabled={createMutation.isPending}
            className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600
              text-[13px] font-medium hover:bg-slate-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit(onSubmit)}
            disabled={createMutation.isPending}
            className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700
              text-white text-[13px] font-semibold flex items-center gap-2
              shadow-lg shadow-emerald-200 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {createMutation.isPending ? (
              <>
                <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <HiOutlineCheckCircle className="w-4 h-4" />
                Create & Select
              </>
            )}
          </button>
        </div>
      }
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-5"
        autoComplete="off"
      >
        {/* ── Section: Identity ─────────────────────────────────────────── */}
        <div>
          <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-3">
            Customer Identity
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <CustomInput
              name="name"
              control={control}
              label="Customer Name"
              placeholder="Full name"
              isrequired
              autoFocus
              errors={errors}
              rules={{
                required: "Name is required",
                minLength: { value: 2, message: "Min 2 characters" },
              }}
            />
            <CustomInput
              name="phone"
              control={control}
              label="Phone Number"
              placeholder="+91 ..."
              type="text"
              isrequired
              errors={errors}
              rules={{
                required: "Phone is required",
                pattern: {
                  value: /^[+\d\s-]{10,}$/,
                  message: "Invalid phone number",
                },
              }}
            />
            <CustomInput
              name="email"
              control={control}
              isrequired
              label="Email"
              placeholder="email@example.com"
              type="email"
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
              errors={errors}
              label="Customer Type"
              placeholder="Select type"
              isrequired
              rules={{ required: "Type is required" }}
              options={[
                { value: "RESIDENTIAL", label: "🏠 Residential" },
                { value: "COMMERCIAL", label: "🏢 Commercial" },
                { value: "INDUSTRIAL", label: "🏭 Industrial" },
              ]}
            />
          </div>
        </div>

        {/* ── Section: Billing preferences ──────────────────────────────── */}
        <div>
          <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-3">
            Billing Preferences
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <CustomSelect
              name="deliveryFrequency"
              control={control}
              errors={errors}
              label="Delivery Frequency"
              placeholder="How often"
              isrequired
              rules={{ required: "Required" }}
              options={[
                { value: "DAILY", label: "Daily" },
                { value: "WEEKLY", label: "Weekly" },
                { value: "MONTHLY", label: "Monthly" },
                { value: "ON_DEMAND", label: "On demand" },
              ]}
            />
            <CustomSelect
              name="paymentMode"
              control={control}
              errors={errors}
              label="Default Payment"
              placeholder="Mode"
              isrequired
              rules={{ required: "Required" }}
              options={[
                { value: "CASH", label: "Cash" },
                { value: "UPI", label: "UPI" },
                { value: "BANK_TRANSFER", label: "Bank Transfer" },
                { value: "CREDIT", label: "Credit" },
              ]}
            />
            <CustomInput
              name="outstandingBalance"
              control={control}
              label="Opening Balance (₹)"
              placeholder="0"
              type="text"
              errors={errors}
              rules={{
                validate: (v: any) =>
                  v === "" ||
                  v === undefined ||
                  (!isNaN(Number(v)) && Number(v) >= 0) ||
                  "Must be a positive number",
              }}
            />
          </div>
        </div>

        {/* ── Section: Address ──────────────────────────────────────────── */}
        <div>
          <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <HiOutlineLocationMarker className="w-3.5 h-3.5" />
            Address
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="sm:col-span-2">
              <CustomInput
                name="addressLine1"
                control={control}
                label="Address Line 1"
                placeholder="Door no, street name"
                isrequired
                errors={errors}
                rules={{ required: "Address is required" }}
              />
            </div>
            <div className="sm:col-span-2">
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
              placeholder="e.g. Chennai"
              isrequired
              errors={errors}
              rules={{ required: "City is required" }}
            />
            <CustomInput
              name="state"
              control={control}
              label="State"
              placeholder="e.g. Tamil Nadu"
              isrequired
              errors={errors}
              rules={{ required: "State is required" }}
            />
            <CustomInput
              name="pincode"
              control={control}
              label="Pincode"
              placeholder="6 digits"
              isrequired
              errors={errors}
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
              placeholder="Near... (optional)"
              errors={errors}
            />
          </div>
        </div>

        {/* ── Section: Notes ────────────────────────────────────────────── */}
        <div>
          <CustomInput
            name="notes"
            control={control}
            label="Notes"
            placeholder="Any internal notes about this customer (optional)"
            errors={errors}
          />
        </div>

        {/* Hidden submit so Enter key works inside inputs */}
        <button type="submit" className="hidden" />
      </form>
    </CustomModal>
  );
};

export default QuickAddCustomerModal;
