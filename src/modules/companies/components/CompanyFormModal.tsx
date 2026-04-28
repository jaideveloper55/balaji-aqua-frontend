import { useEffect } from "react";
import { Button } from "antd";
import { useForm } from "react-hook-form";
import { HiOutlineOfficeBuilding } from "react-icons/hi";
import CustomModal from "../../../components/common/CustomModal";
import CustomInput from "../../../components/common/CustomInput";
import CustomSelect from "../../../components/common/CustomSelect";
import { Company, CreateCompanyDto } from "../types/company";
import {
  COMPANY_TYPES,
  INDIAN_STATES,
  VALIDATION_PATTERNS,
} from "../constants";

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateCompanyDto) => void;
  initialData?: Company | null;
}

const emptyDefaults: CreateCompanyDto = {
  name: "",
  type: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  gstNumber: "",
};

const CompanyFormModal = ({ open, onClose, onSubmit, initialData }: Props) => {
  const isEdit = !!initialData;

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
    reset,
    setValue,
  } = useForm<CreateCompanyDto>({
    defaultValues: emptyDefaults,
    mode: "onBlur",
  });

  useEffect(() => {
    if (open) {
      reset(
        initialData
          ? {
              name: initialData.name,
              type: initialData.type,
              email: initialData.email,
              phone: initialData.phone,
              address: initialData.address,
              city: initialData.city,
              state: initialData.state,
              gstNumber: initialData.gstNumber,
            }
          : emptyDefaults
      );
    }
  }, [open, initialData, reset]);

  // Discard-changes guard
  const guardClose = () => {
    if (!isDirty) return true;
    return window.confirm("You have unsaved changes. Close without saving?");
  };

  return (
    <CustomModal
      open={open}
      onClose={onClose}
      beforeClose={guardClose}
      title={isEdit ? "Edit Company" : "Add Company"}
      subtitle={
        isEdit
          ? "Update the company details below"
          : "Fill the details to onboard a new company"
      }
      icon={<HiOutlineOfficeBuilding size={22} />}
      iconTone="blue"
      size="2xl"
      closeOnOverlayClick={false}
      footer={
        <div className="flex items-center justify-between gap-4">
          <span className="text-xs text-slate-500">
            <span className="text-red-500">*</span> Required fields
          </span>
          <div className="flex gap-2">
            <Button
              size="large"
              onClick={() => {
                if (guardClose()) onClose();
              }}
            >
              Cancel
            </Button>
            <Button
              type="primary"
              size="large"
              loading={isSubmitting}
              onClick={handleSubmit(onSubmit)}
            >
              {isEdit ? "Save Changes" : "Create Company"}
            </Button>
          </div>
        </div>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CustomInput
            name="name"
            control={control}
            errors={errors}
            label="Company Name"
            placeholder="e.g. Krishna Water Plant"
            isrequired
            rules={{
              required: "Company name is required",
              minLength: { value: 2, message: "At least 2 characters" },
              maxLength: { value: 100, message: "Under 100 characters" },
            }}
          />
          <CustomSelect
            name="type"
            control={control}
            errors={errors}
            label="Company Type"
            placeholder="Select company type"
            options={COMPANY_TYPES}
            size="large"
            isrequired
            rules={{ required: "Company type is required" }}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CustomInput
            name="email"
            control={control}
            errors={errors}
            label="Work Email"
            type="email"
            placeholder="info@krishnawater.com"
            iconType="mail"
            isrequired
            rules={{
              required: "Email is required",
              pattern: {
                value: VALIDATION_PATTERNS.EMAIL,
                message: "Enter a valid email address",
              },
            }}
          />
          <CustomInput
            name="phone"
            control={control}
            errors={errors}
            label="Phone Number"
            placeholder="+91 98765 43210"
            isrequired
            rules={{
              required: "Phone number is required",
              pattern: {
                value: VALIDATION_PATTERNS.PHONE,
                message: "Enter a valid 10-digit Indian number",
              },
            }}
          />
        </div>

        <CustomInput
          name="address"
          control={control}
          errors={errors}
          label="Street Address"
          placeholder="12 Gandhi Street, RS Puram"
          isrequired
          rules={{
            required: "Address is required",
            minLength: { value: 5, message: "Address looks too short" },
          }}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CustomInput
            name="city"
            control={control}
            errors={errors}
            label="City"
            placeholder="Coimbatore"
            isrequired
            rules={{ required: "City is required" }}
          />
          <CustomSelect
            name="state"
            control={control}
            errors={errors}
            label="State"
            placeholder="Select state"
            options={INDIAN_STATES}
            size="large"
            showSearch
            isrequired
            rules={{ required: "State is required" }}
          />
        </div>

        <div>
          <CustomInput
            name="gstNumber"
            control={control}
            errors={errors}
            label="GST Number"
            placeholder="33AABCU9603R1ZX"
            isrequired
            rules={{
              required: "GST number is required",
              pattern: {
                value: VALIDATION_PATTERNS.GST,
                message: "Enter a valid 15-character GSTIN",
              },
              onChange: (e: any) =>
                setValue("gstNumber", e.target.value.toUpperCase(), {
                  shouldValidate: true,
                }),
            }}
          />
          <p className="mt-1.5 text-xs text-slate-500">
            15 characters · auto-uppercased · format: 22AAAAA0000A1Z5
          </p>
        </div>
      </form>
    </CustomModal>
  );
};

export default CompanyFormModal;
