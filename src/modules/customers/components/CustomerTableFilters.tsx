import { useForm } from "react-hook-form";
import CustomSelect from "../../../components/common/CustomSelect";
import SearchInput from "../../../components/common/SearchInput";
import { STATUS_OPTIONS, TYPE_OPTIONS } from "../constants/customerConstants";
import type { CustomerStatus, CustomerType } from "../types/Customer";

interface FilterFormValues {
  statusFilter?: CustomerStatus;
  typeFilter?: CustomerType;
}

interface Props {
  search: string;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: CustomerStatus | undefined) => void;
  onTypeChange: (value: CustomerType | undefined) => void;
}

const CustomerTableFilters = ({
  search,
  onSearchChange,
  onStatusChange,
  onTypeChange,
}: Props) => {
  const {
    control: filterControl,
    formState: { errors: filterErrors },
  } = useForm<FilterFormValues>({
    defaultValues: { statusFilter: undefined, typeFilter: undefined },
  });

  return (
    <div className="flex flex-wrap items-end gap-3">
      <SearchInput
        value={search}
        onChange={onSearchChange}
        placeholder="Search name, phone, ID..."
      />

      <div className="w-32">
        <CustomSelect
          name="statusFilter"
          control={filterControl}
          errors={filterErrors}
          placeholder="Status"
          size="middle"
          options={STATUS_OPTIONS}
          onChange={(v) => onStatusChange((v as CustomerStatus) || undefined)}
        />
      </div>

      <div className="w-36">
        <CustomSelect
          name="typeFilter"
          control={filterControl}
          errors={filterErrors}
          placeholder="Type"
          size="middle"
          options={TYPE_OPTIONS}
          onChange={(v) => onTypeChange((v as CustomerType) || undefined)}
        />
      </div>
    </div>
  );
};

export default CustomerTableFilters;
