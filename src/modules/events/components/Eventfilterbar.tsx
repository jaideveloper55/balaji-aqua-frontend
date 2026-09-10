import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { DatePicker } from "antd";
import dayjs, { Dayjs } from "dayjs";
import { EVENT_TYPE_OPTIONS } from "../constants/Events.constants";
import type { EventFilters } from "../types/Events";
import CustomInput from "../../../components/common/CustomInput";
import CustomSelect from "../../../components/common/CustomSelect";

const { RangePicker } = DatePicker;

const EVENT_STATUS_OPTIONS = [
  { value: "DRAFT", label: "Draft" },
  { value: "CONFIRMED", label: "Confirmed" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "DELIVERED", label: "Delivered" },
  { value: "COMPLETED", label: "Completed" },
  { value: "CANCELLED", label: "Cancelled" },
];

interface Props {
  filters: EventFilters;
  onChange: (next: EventFilters) => void;
}

interface SearchFormValues {
  search: string;
}

const EventFilterBar = ({ filters, onChange }: Props) => {
  const { control, watch } = useForm<SearchFormValues>({
    values: { search: filters.search ?? "" },
  });
  const searchValue = watch("search");

  useEffect(() => {
    if (searchValue !== (filters.search ?? "")) {
      onChange({ ...filters, search: searchValue, page: 1 });
    }
  }, [searchValue]);

  const rangeValue: [Dayjs, Dayjs] | null =
    filters.dateFrom && filters.dateTo
      ? [dayjs(filters.dateFrom), dayjs(filters.dateTo)]
      : null;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 grid grid-cols-1 md:grid-cols-12 gap-3">
      <div className="md:col-span-4">
        <CustomInput
          name="search"
          control={control}
          errors={{}}
          iconType="search"
          placeholder="Search event #, name, customer, venue..."
        />
      </div>

      <div className="md:col-span-3">
        <CustomSelect
          name="eventType"
          control={control}
          errors={{}}
          placeholder="Event Type"
          options={[
            { value: "ALL", label: "All Types" },
            ...EVENT_TYPE_OPTIONS.map((o) => ({
              value: o.value,
              label: o.label,
            })),
          ]}
          value={filters.eventType ?? "ALL"}
          onChange={(v) =>
            onChange({
              ...filters,
              eventType: v as EventFilters["eventType"],
              page: 1,
            })
          }
        />
      </div>

      <div className="md:col-span-2">
        <CustomSelect
          name="status"
          control={control}
          errors={{}}
          placeholder="Status"
          options={[
            { value: "ALL", label: "All Status" },
            ...EVENT_STATUS_OPTIONS,
          ]}
          value={filters.status ?? "ALL"}
          onChange={(v) =>
            onChange({
              ...filters,
              status: v as EventFilters["status"],
              page: 1,
            })
          }
        />
      </div>

      <div className="md:col-span-3">
        <RangePicker
          className="w-full"
          placeholder={["Event from", "Event to"]}
          value={rangeValue}
          onChange={(dates) => {
            if (dates && dates[0] && dates[1]) {
              onChange({
                ...filters,
                dateFrom: (dates[0] as Dayjs).format("YYYY-MM-DD"),
                dateTo: (dates[1] as Dayjs).format("YYYY-MM-DD"),
                page: 1,
              });
            } else {
              onChange({
                ...filters,
                dateFrom: undefined,
                dateTo: undefined,
                page: 1,
              });
            }
          }}
        />
      </div>
    </div>
  );
};

export default EventFilterBar;
