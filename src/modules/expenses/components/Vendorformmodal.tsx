import { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  HiOutlineUserAdd,
  HiOutlinePencilAlt,
  HiOutlineUserGroup,
} from "react-icons/hi";

import { EXPENSE_CATEGORIES } from "../constants/Expenses.constants";
import CustomModal from "../../../components/common/CustomModal";
import CustomInput from "../../../components/common/CustomInput";
import CustomSelect from "../../../components/common/CustomSelect";

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  initialData?: any;
}

const VendorFormModal = ({ open, onClose, onSubmit, initialData }: Props) => {
  const isEdit = !!initialData;

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<any>({
    defaultValues: initialData || {
      name: "",
      category: "",
      phone: "",
      email: "",
      gstin: "",
      bankAccount: "",
      ifsc: "",
      upiId: "",
    },
  });

  useEffect(() => {
    if (open) {
      reset(
        initialData || {
          name: "",
          category: "",
          phone: "",
          email: "",
          gstin: "",
          bankAccount: "",
          ifsc: "",
          upiId: "",
        }
      );
    }
  }, [open, initialData, reset]);

  const handleFormSubmit = (data: any) => {
    onSubmit({
      ...data,
      id: initialData?.id || `V-${String(Date.now()).slice(-3)}`,
      totalPaidYTD: initialData?.totalPaidYTD || 0,
      outstanding: initialData?.outstanding || 0,
      transactionCount: initialData?.transactionCount || 0,
      isActive: true,
    });
    onClose();
  };

  return (
    <CustomModal
      open={open}
      onClose={onClose}
      title={isEdit ? "Edit Vendor" : "Add New Vendor"}
      subtitle={
        isEdit
          ? "Update vendor information"
          : "Add a supplier to your vendor list"
      }
      icon={
        isEdit ? (
          <HiOutlinePencilAlt size={22} />
        ) : (
          <HiOutlineUserAdd size={22} />
        )
      }
      iconTone={isEdit ? "amber" : "red"}
      size="3xl"
      footer={
        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit(handleFormSubmit)}
            className="px-5 py-2 rounded-lg bg-rose-600 text-white text-sm font-semibold shadow-md hover:bg-rose-700 hover:shadow-lg transition-all"
          >
            {isEdit ? "Save Changes" : "Add Vendor"}
          </button>
        </div>
      }
    >
      <div className="space-y-5">
        {/* Section banner */}
        <div className="rounded-xl bg-rose-50/60 border border-rose-100 p-4 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-white">
            <HiOutlineUserGroup className="w-5 h-5 text-rose-600" />
          </div>
          <div>
            <div className="text-sm font-semibold text-slate-900">
              Vendor Details
            </div>
            <div className="text-xs text-slate-600">
              Suppliers, service providers, and regular payees
            </div>
          </div>
        </div>

        {/* Basic Info */}
        <div>
          <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
            Basic Information
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <CustomInput
                name="name"
                control={control}
                label="Vendor Name"
                placeholder="e.g. TN Electricity Board"
                isrequired
                errors={errors}
                rules={{
                  required: "Vendor name is required",
                  minLength: { value: 2, message: "Too short" },
                }}
              />
            </div>

            <CustomSelect
              name="category"
              control={control}
              label="Category"
              placeholder="Select expense category"
              isrequired
              errors={errors}
              rules={{ required: "Category is required" }}
              options={EXPENSE_CATEGORIES.map((c) => ({
                value: c.value,
                label: `${c.icon}  ${c.label}`,
              }))}
            />

            <CustomInput
              name="phone"
              control={control}
              label="Phone Number"
              placeholder="10-digit mobile number"
              errors={errors}
              rules={{
                pattern: {
                  value: /^[0-9]{4,12}$/,
                  message: "Enter valid phone number",
                },
              }}
            />

            <div className="md:col-span-2">
              <CustomInput
                name="email"
                control={control}
                type="email"
                iconType="mail"
                label="Email (Optional)"
                placeholder="vendor@example.com"
                errors={errors}
              />
            </div>
          </div>
        </div>

        {/* Tax Info */}
        <div className="pt-4 border-t border-dashed border-slate-200">
          <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
            Tax & Compliance
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <CustomInput
                name="gstin"
                control={control}
                label="GSTIN (Optional)"
                placeholder="e.g. 33AAACT2727Q1ZW"
                errors={errors}
                rules={{
                  pattern: {
                    value:
                      /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[0-9]{1}[Z]{1}[A-Z0-9]{1}$/,
                    message: "Invalid GSTIN format",
                  },
                }}
              />
            </div>
          </div>
        </div>

        {/* Bank Details */}
        <div className="pt-4 border-t border-dashed border-slate-200">
          <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
            Payment Details (Optional)
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CustomInput
              name="bankAccount"
              control={control}
              label="Bank Account Number"
              placeholder="Account number"
              errors={errors}
            />

            <CustomInput
              name="ifsc"
              control={control}
              label="IFSC Code"
              placeholder="e.g. HDFC0001234"
              errors={errors}
            />

            <div className="md:col-span-2">
              <CustomInput
                name="upiId"
                control={control}
                label="UPI ID"
                placeholder="e.g. vendor@upi"
                errors={errors}
              />
            </div>
          </div>
        </div>
      </div>
    </CustomModal>
  );
};

export default VendorFormModal;
