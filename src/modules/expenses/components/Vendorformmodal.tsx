import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { HiOutlineUserGroup } from "react-icons/hi";
import CustomModal from "../../../components/common/CustomModal";
import CustomInput from "../../../components/common/CustomInput";
import CustomSelect from "../../../components/common/CustomSelect";
import type { Vendor } from "../types/Expenses";
import CustomTextArea from "../../../components/common/Customtextarea";

export interface VendorFormValues {
  name: string;
  category: string;
  phone: string;
  email: string;
  gstin: string;
  openingOutstanding: string;
  notes: string;
}

interface Props {
  open: boolean;
  editVendor?: Vendor | null;
  onClose: () => void;
  onSubmit: (values: VendorFormValues) => void;
  loading?: boolean;
}

const CATEGORY_OPTIONS = [
  { value: "Utilities", label: "Utilities" },
  { value: "Vehicle & Fuel", label: "Vehicle & Fuel" },
  { value: "Plant Operations", label: "Plant Operations" },
  { value: "Packaging", label: "Packaging" },
  { value: "Rent & Lease", label: "Rent & Lease" },
  { value: "Repairs", label: "Repairs" },
  { value: "Office", label: "Office" },
  { value: "Compliance", label: "Compliance" },
  { value: "Marketing", label: "Marketing" },
];

const Vendorformmodal: React.FC<Props> = ({
  open,
  editVendor,
  onClose,
  onSubmit,
  loading = false,
}) => {
  const isEdit = !!editVendor;

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<VendorFormValues>({
    defaultValues: {
      name: "",
      category: "",
      phone: "",
      email: "",
      gstin: "",
      openingOutstanding: "",
      notes: "",
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        name: editVendor?.name ?? "",
        category: editVendor?.category ?? "",
        phone: editVendor?.phone ?? "",
        email: editVendor?.email ?? "",
        gstin: editVendor?.gstin ?? "",
        openingOutstanding: editVendor?.outstanding
          ? String(editVendor.outstanding)
          : "",
        notes: "",
      });
    }
  }, [open, editVendor, reset]);

  const footer = (
    <div className="flex gap-2">
      <button
        type="button"
        onClick={onClose}
        disabled={loading}
        className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-[13px] font-medium hover:bg-gray-50 disabled:opacity-50"
      >
        Cancel
      </button>
      <button
        type="button"
        onClick={handleSubmit(onSubmit)}
        disabled={loading}
        className="flex-[2] py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-[13px] font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
      >
        {loading ? (
          <>
            <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            Saving...
          </>
        ) : isEdit ? (
          "Update Vendor"
        ) : (
          "Add Vendor"
        )}
      </button>
    </div>
  );

  return (
    <CustomModal
      open={open}
      onClose={onClose}
      title={isEdit ? "Edit Vendor" : "Add Vendor"}
      subtitle={
        isEdit ? "Update supplier details" : "Add a new supplier / vendor"
      }
      icon={<HiOutlineUserGroup className="w-5 h-5" />}
      iconTone="red"
      size="lg"
      footer={footer}
    >
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CustomInput
            name="name"
            control={control}
            label="Vendor Name"
            placeholder="e.g. TN Electricity Board"
            errors={errors}
            isrequired
            rules={{ required: "Vendor name is required" }}
          />
          <CustomSelect
            name="category"
            control={control}
            errors={errors}
            label="Category"
            placeholder="Select category"
            options={CATEGORY_OPTIONS}
            isrequired
            showSearch
            rules={{ required: "Category is required" }}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CustomInput
            name="phone"
            control={control}
            label="Phone"
            placeholder="e.g. 9876543210"
            errors={errors}
            isrequired
            numbersOnly
            rules={{
              required: "Phone is required",
              minLength: { value: 4, message: "Enter a valid phone number" },
            }}
          />
          <CustomInput
            name="email"
            control={control}
            label="Email (optional)"
            placeholder="e.g. vendor@example.com"
            errors={errors}
            rules={{
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Enter a valid email",
              },
            }}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CustomInput
            name="gstin"
            control={control}
            label="GSTIN (optional)"
            placeholder="e.g. 33AAACT2727Q1ZW"
            errors={errors}
          />
          <CustomInput
            name="openingOutstanding"
            control={control}
            label="Opening Outstanding (₹)"
            placeholder="0 (optional)"
            errors={errors}
            numbersOnly
          />
        </div>

        <CustomTextArea
          name="notes"
          control={control}
          label="Notes (optional)"
          placeholder="Any notes about this vendor..."
          errors={errors}
          rows={2}
          maxLength={200}
          showCount
        />
      </div>
    </CustomModal>
  );
};

export default Vendorformmodal;
