import { useForm } from "react-hook-form";
import { Dayjs } from "dayjs";
import CustomSelect from "../../../components/common/CustomSelect";
import SearchInput from "../../../components/common/SearchInput";
import CustomDateRange from "../../../components/common/CustomDateRange";
import { TYPE_OPTIONS } from "../constants/customerConstants";
import type { CustomerType } from "../types/Customer";

interface FilterFormValues {
  typeFilter?: CustomerType;
  dateRange?: [Dayjs | null, Dayjs | null] | null;
}

interface Props {
  search: string;
  onSearchChange: (value: string) => void;
  onTypeChange: (value: CustomerType | undefined) => void;
  onDateRangeChange: (
    fromDate: string | undefined,
    toDate: string | undefined
  ) => void;
}

const CustomerTableFilters = ({
  search,
  onSearchChange,
  onTypeChange,
  onDateRangeChange,
}: Props) => {
  const {
    control: filterControl,
    formState: { errors: filterErrors },
  } = useForm<FilterFormValues>({
    defaultValues: { typeFilter: undefined, dateRange: null },
  });

  return (
    <div className="flex flex-wrap items-end gap-3">
      {/* Search */}
      <SearchInput
        value={search}
        onChange={onSearchChange}
        placeholder="Search name, phone, ID..."
      />

      {/* Type filter */}
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

      {/* Date range filter — joined date */}
      <div className="w-72">
        <CustomDateRange
          name="dateRange"
          control={filterControl}
          errors={filterErrors}
          placeholder={["Joined from", "Joined to"]}
          size="middle"
          onChange={(dates) => {
            const [from, to] = dates ?? [null, null];
            onDateRangeChange(
              from ? from.format("YYYY-MM-DD") : undefined,
              to ? to.format("YYYY-MM-DD") : undefined
            );
          }}
        />
      </div>
    </div>
  );
};

export default CustomerTableFilters;
