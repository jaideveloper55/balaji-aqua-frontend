import { Control, FieldErrors, FieldValues } from "react-hook-form";
import CustomInput from "../../../components/common/CustomInput";
import CustomSelect from "../../../components/common/CustomSelect";
import { COMPANY_TYPES } from "../constants";

export interface FilterFormValues {
  search: string;
  type: string;
  status: string;
}

interface Props {
  control: Control<FilterFormValues>;
  errors: FieldErrors<FilterFormValues>;
}

const STATUS_OPTIONS = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
];

const CompanyFilters = ({ control, errors }: Props) => (
  <div className="p-5 border-b border-slate-100">
    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
      <div className="md:col-span-6">
        <CustomInput
          name="search"
          control={control as unknown as Control<FieldValues>}
          errors={errors as FieldErrors}
          placeholder="Search by name, email, phone, GST…"
        />
      </div>
      <div className="md:col-span-3">
        <CustomSelect
          name="type"
          control={control as unknown as Control<FieldValues>}
          errors={errors as FieldErrors<FieldValues>}
          placeholder="All types"
          size="large"
          options={COMPANY_TYPES}
        />
      </div>
      <div className="md:col-span-3">
        <CustomSelect
          name="status"
          control={control as unknown as Control<FieldValues>}
          errors={errors as FieldErrors<FieldValues>}
          placeholder="All statuses"
          size="large"
          options={STATUS_OPTIONS}
        />
      </div>
    </div>
  </div>
);

export default CompanyFilters;
