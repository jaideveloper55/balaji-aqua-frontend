import { Input, Select, DatePicker } from "antd";
import { HiOutlineSearch } from "react-icons/hi";
import dayjs, { Dayjs } from "dayjs";
import { EVENT_TYPE_OPTIONS } from "../constants/Events.constants";
import type { EventFilters } from "../types/Events";

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

const EventFilterBar = ({ filters, onChange }: Props) => {
  const rangeValue: [Dayjs, Dayjs] | null =
    filters.dateFrom && filters.dateTo
      ? [dayjs(filters.dateFrom), dayjs(filters.dateTo)]
      : null;

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

      {/* ─── Status ──────────────────────────────────────────────────── */}
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

      {/* ─── Date Range ──────────────────────────────────────────────── */}
      <div className="md:col-span-3">
        <RangePicker
          size="large"
          className="w-full"
          placeholder={["Event from", "Event to"]}
          // ─── FIXED: read from dateFrom + dateTo, not dateRange ──────
          value={rangeValue}
          onChange={(dates) => {
            if (dates && dates[0] && dates[1]) {
              onChange({
                ...filters,
                // ─── FIXED: .format("YYYY-MM-DD") not .toISOString() ─
                // .toISOString() shifts date by -5:30 for Indian timezone.
                // "15 Aug 2026" → toISOString → "2026-08-14T18:30:00Z" ← wrong day!
                // .format("YYYY-MM-DD") → "2026-08-15" ← always correct
                dateFrom: (dates[0] as Dayjs).format("YYYY-MM-DD"),
                dateTo: (dates[1] as Dayjs).format("YYYY-MM-DD"),
                page: 1,
              });
            } else {
              // User cleared the date range — remove both filter fields
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
