import React from "react";
import { Button, Badge } from "antd";
import { useForm } from "react-hook-form";
import { Dayjs } from "dayjs";
import { HiOutlineFilter, HiOutlineRefresh } from "react-icons/hi";
import {
  JAR_STATUS_OPTIONS,
  ROUTE_OPTIONS,
  DRIVER_OPTIONS,
} from "../constants/jarConstants";
import SearchInput from "../../../components/common/SearchInput";
import CustomSelect from "../../../components/common/CustomSelect";
import CustomDateRange from "../../../components/common/CustomDateRange";

type DateRange = [Dayjs | null, Dayjs | null] | null;

interface JarFilterFormValues {
  status: string;
  route: string;
  driver: string;
  dateRange: DateRange;
}

const DEFAULT_VALUES: JarFilterFormValues = {
  status: "all",
  route: "",
  driver: "",
  dateRange: null,
};

interface JarFiltersBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onRouteChange: (value: string) => void;
  onDriverChange: (value: string) => void;
  onDateRangeChange: (dates: DateRange) => void;
  onReset: () => void;
}

const JarFiltersBar: React.FC<JarFiltersBarProps> = ({
  search,
  onSearchChange,
  onStatusChange,
  onRouteChange,
  onDriverChange,
  onDateRangeChange,
  onReset,
}) => {
  const {
    control,
    reset,
    watch,
    formState: { errors },
  } = useForm<JarFilterFormValues>({
    defaultValues: DEFAULT_VALUES,
  });

  const values = watch();
  const activeFilters = [
    values.status && values.status !== "all",
    !!values.route,
    !!values.driver,
    !!values.dateRange,
  ].filter(Boolean).length;

  const handleReset = () => {
    reset(DEFAULT_VALUES);
    onReset();
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Search */}
      <SearchInput
        value={search}
        onChange={onSearchChange}
        placeholder="Search customer or ID..."
      />

      {/* Divider */}
      <div className="w-px h-7 bg-slate-200/80 mx-0.5 hidden sm:block" />

      {/* Filter group */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1 mr-1">
          <HiOutlineFilter size={13} className="text-slate-400" />
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider hidden lg:inline">
            Filters
          </span>
        </div>

        <div className="w-[120px]">
          <CustomSelect
            name="status"
            control={control}
            errors={errors}
            placeholder="Status"
            size="middle"
            options={JAR_STATUS_OPTIONS}
            onChange={(v) => onStatusChange(v || "all")}
          />
        </div>

        <div className="w-[140px]">
          <CustomSelect
            name="route"
            control={control}
            errors={errors}
            placeholder="Route"
            size="middle"
            options={ROUTE_OPTIONS}
            onChange={(v) => onRouteChange(v || "")}
          />
        </div>

        <div className="w-[140px]">
          <CustomSelect
            name="driver"
            control={control}
            errors={errors}
            placeholder="Driver"
            size="middle"
            options={DRIVER_OPTIONS}
            onChange={(v) => onDriverChange(v || "")}
          />
        </div>
      </div>

      {/* Divider */}
      <div className="w-px h-7 bg-slate-200/80 mx-0.5 hidden sm:block" />

      {/* Date range */}
      <div className="min-w-[240px]">
        <CustomDateRange
          name="dateRange"
          control={control}
          errors={errors}
          placeholder={["From", "To"]}
          size="middle"
          onChange={(dates) => onDateRangeChange(dates)}
        />
      </div>

      {/* Reset */}
      <Badge count={activeFilters} size="small" offset={[-4, 2]}>
        <Button
          size="middle"
          icon={<HiOutlineRefresh size={13} />}
          onClick={handleReset}
          className="!flex !items-center !gap-1 !text-slate-500 hover:!text-blue-600 hover:!border-blue-300 !rounded-lg transition-colors duration-200"
        >
          Reset
        </Button>
      </Badge>
    </div>
  );
};

export default JarFiltersBar;
