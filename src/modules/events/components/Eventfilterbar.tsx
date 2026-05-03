import { Input, Select, DatePicker } from "antd";
import { HiOutlineSearch } from "react-icons/hi";
import dayjs, { Dayjs } from "dayjs";
import {
  EVENT_STATUS_OPTIONS,
  EVENT_TYPE_OPTIONS,
} from "../constants/Events.constants";
import type { EventFilters } from "../types/Events";

const { RangePicker } = DatePicker;

interface Props {
  filters: EventFilters;
  onChange: (next: EventFilters) => void;
}

const EventFilterBar = ({ filters, onChange }: Props) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 grid grid-cols-1 md:grid-cols-12 gap-3">
      <div className="md:col-span-4">
        <Input
          size="large"
          allowClear
          prefix={<HiOutlineSearch className="text-slate-400" />}
          placeholder="Search event #, name, customer, venue..."
          value={filters.search ?? ""}
          onChange={(e) =>
            onChange({ ...filters, search: e.target.value, page: 1 })
          }
        />
      </div>

      <div className="md:col-span-3">
        <Select
          size="large"
          className="w-full"
          placeholder="Event Type"
          value={filters.eventType ?? "ALL"}
          onChange={(v) => onChange({ ...filters, eventType: v, page: 1 })}
          options={[
            { value: "ALL", label: "All Types" },
            ...EVENT_TYPE_OPTIONS.map((o) => ({
              value: o.value,
              label: o.label,
            })),
          ]}
        />
      </div>

      <div className="md:col-span-2">
        <Select
          size="large"
          className="w-full"
          placeholder="Status"
          value={filters.status ?? "ALL"}
          onChange={(v) => onChange({ ...filters, status: v, page: 1 })}
          options={[
            { value: "ALL", label: "All Status" },
            ...EVENT_STATUS_OPTIONS,
          ]}
        />
      </div>

      <div className="md:col-span-3">
        <RangePicker
          size="large"
          className="w-full"
          placeholder={["Event from", "Event to"]}
          value={
            filters.dateRange
              ? [dayjs(filters.dateRange[0]), dayjs(filters.dateRange[1])]
              : null
          }
          onChange={(dates) => {
            const next = dates
              ? ([
                  (dates[0] as Dayjs).toISOString(),
                  (dates[1] as Dayjs).toISOString(),
                ] as [string, string])
              : null;
            onChange({ ...filters, dateRange: next, page: 1 });
          }}
        />
      </div>
    </div>
  );
};

export default EventFilterBar;
