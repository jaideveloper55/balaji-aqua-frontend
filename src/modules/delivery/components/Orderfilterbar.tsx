import { useEffect } from "react";
import { useForm } from "react-hook-form";
import dayjs, { Dayjs } from "dayjs";
import { HiOutlineX } from "react-icons/hi";
import CustomInput from "../../../components/common/CustomInput";
import CustomSelect from "../../../components/common/CustomSelect";
import CustomDateRange from "../../../components/common/CustomDateRange";
import { addDays, dayLabel, todayIST } from "../constants/Orderconstants";
import type { DeliveryBoy, OrderFilters } from "../types/Orders";

const DAY = "YYYY-MM-DD";

interface FilterForm {
  search: string;
  assignee: string;
  range: [Dayjs, Dayjs] | null;
}

interface Props {
  filters: OrderFilters;
  boys: DeliveryBoy[];
  boysLoading?: boolean;
  onChange: (patch: Partial<OrderFilters>) => void;
  onClear: () => void;
}

// filters (page state) -> form values
const toForm = (f: OrderFilters): FilterForm => ({
  search: f.search ?? "",
  assignee: f.unassigned ? "UNASSIGNED" : f.assignedToId ?? "",
  range: f.dateFrom && f.dateTo ? [dayjs(f.dateFrom), dayjs(f.dateTo)] : null,
});

const Orderfilterbar = ({
  filters,
  boys,
  boysLoading,
  onChange,
  onClear,
}: Props) => {
  const {
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FilterForm>({ defaultValues: toForm(filters) });

  // Page -> form: when a stat card or a quick chip changes the filters, show it in the inputs.
  useEffect(() => {
    const next = toForm(filters);
    setValue("search", next.search);
    setValue("assignee", next.assignee);
    setValue("range", next.range);
  }, [
    filters.search,
    filters.assignedToId,
    filters.unassigned,
    filters.dateFrom,
    filters.dateTo,
    setValue,
  ]); // eslint-disable-line react-hooks/exhaustive-deps

  // Form -> page: only for real user edits. `type` is set by user input and is missing for setValue().
  useEffect(() => {
    const sub = watch((v, { name, type }) => {
      if (!type) return;
      if (name === "search") onChange({ search: v.search ?? "" });
      if (name === "assignee") {
        const a = v.assignee;
        onChange({
          unassigned: a === "UNASSIGNED" ? true : undefined,
          assignedToId: a && a !== "UNASSIGNED" ? a : undefined,
        });
      }
      if (name === "range") {
        const r = v.range as [Dayjs, Dayjs] | null | undefined; // watch() types dates as a deep-partial, so say what it really is
        onChange(
          r && r[0] && r[1]
            ? { dateFrom: r[0].format(DAY), dateTo: r[1].format(DAY) }
            : { dateFrom: undefined, dateTo: undefined }
        );
      }
    });
    return () => sub.unsubscribe();
  }, [watch, onChange]);

  // ── quick date shortcuts ──────────────────────────────────────────────────────────────────────
  const today = todayIST();
  const tomorrow = addDays(today, 1);
  const yesterday = addDays(today, -1);
  const { dateFrom, dateTo } = filters;
  const quick = [
    {
      key: "today",
      label: "Today",
      active: dateFrom === today && dateTo === today,
      apply: () => onChange({ dateFrom: today, dateTo: today }),
    },
    {
      key: "tomorrow",
      label: "Tomorrow",
      active: dateFrom === tomorrow && dateTo === tomorrow,
      apply: () => onChange({ dateFrom: tomorrow, dateTo: tomorrow }),
    },
    {
      key: "overdue",
      label: "Overdue",
      active: !dateFrom && dateTo === yesterday,
      // "before today, and still pending" - so the tab is set too
      apply: () =>
        onChange({ dateFrom: undefined, dateTo: yesterday, status: "PENDING" }),
    },
    {
      key: "all",
      label: "All dates",
      active: !dateFrom && !dateTo,
      apply: () => onChange({ dateFrom: undefined, dateTo: undefined }),
    },
  ];

  const hasFilters = !!(
    filters.search ||
    filters.assignedToId ||
    filters.unassigned ||
    filters.dateFrom ||
    filters.dateTo ||
    filters.status
  );

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-12">
        <div className="md:col-span-5">
          <CustomInput
            name="search"
            control={control}
            errors={errors}
            iconType="search"
            size="large"
            placeholder="Search order no. or customer name..."
          />
        </div>

        <div className="md:col-span-3">
          <CustomSelect
            name="assignee"
            control={control}
            errors={errors}
            size="large"
            placeholder="All delivery boys"
            isLoading={boysLoading}
            options={[
              { value: "UNASSIGNED", label: "Not assigned yet" },
              ...boys.map((b) => ({ value: b.id, label: b.name })),
            ]}
          />
        </div>

        <div className="md:col-span-4">
          <CustomDateRange
            name="range"
            control={control}
            errors={errors}
            size="large"
            placeholder={["Delivery from", "Delivery to"]}
          />
        </div>
      </div>

      {/* Quick shortcuts + clear */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="mr-1 text-xs font-semibold uppercase tracking-wider text-slate-400">
          Delivery day
        </span>
        {quick.map((q) => (
          <button
            key={q.key}
            type="button"
            onClick={q.apply}
            className={`rounded-full border px-3.5 py-1 text-xs font-semibold transition-colors
              ${
                q.active
                  ? "border-blue-600 bg-blue-600 text-white"
                  : "border-slate-200 bg-white text-slate-600 hover:border-blue-300 hover:text-blue-700"
              }`}
          >
            {q.label}
          </button>
        ))}

        {/* Overdue has no "from" date, which the date range box can't show - so say it in words. */}
        {!dateFrom && dateTo && dateTo !== yesterday && (
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
            Up to {dayLabel(dateTo)}
          </span>
        )}

        {hasFilters && (
          <button
            type="button"
            onClick={onClear}
            className="ml-auto flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-red-600"
          >
            <HiOutlineX className="h-3.5 w-3.5" />
            Clear filters
          </button>
        )}
      </div>
    </div>
  );
};

export default Orderfilterbar;
