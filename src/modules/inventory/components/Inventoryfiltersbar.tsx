import { useForm } from "react-hook-form";
import { HiOutlineRefresh, HiOutlineFilter } from "react-icons/hi";
import SearchInput from "../../../components/common/SearchInput";
import CustomSelect from "../../../components/common/CustomSelect";
import CustomDateRange from "../../../components/common/CustomDateRange";
import { STATUS_FILTER_OPTIONS } from "../constants/Inventoryconstants";
import { InventoryFilters } from "../types/Inventory";

interface InventoryfiltersbarProps {
  filters: InventoryFilters;
  categories: string[];
  onChange: (next: Partial<InventoryFilters>) => void;
  onReset: () => void;
  showDateRange?: boolean;
  resultCount?: number;
}

const Inventoryfiltersbar = ({
  filters,
  categories,
  onChange,
  onReset,
  showDateRange = false,
  resultCount,
}: InventoryfiltersbarProps) => {
  const {
    control,
    reset,
    formState: { errors },
  } = useForm({
    values: {
      status: filters.status,
      category: filters.category,
      dateRange: filters.dateRange,
    },
  });

  const activeCount =
    (filters.search ? 1 : 0) +
    (filters.status !== "all" ? 1 : 0) +
    (filters.category !== "all" ? 1 : 0) +
    (filters.dateRange ? 1 : 0);

  const handleReset = () => {
    reset({ status: "all", category: "all", dateRange: null });
    onReset();
  };

  return (
    <div className="flex flex-wrap items-end gap-3">
      <SearchInput
        value={filters.search}
        onChange={(v) => onChange({ search: v })}
        placeholder="Search product, SKU…"
      />

      <div className="w-40">
        <CustomSelect
          name="status"
          control={control}
          errors={errors}
          placeholder="All Status"
          options={STATUS_FILTER_OPTIONS}
          onChange={(v) => onChange({ status: (v as any) ?? "all" })}
        />
      </div>

      <div className="w-44">
        <CustomSelect
          name="category"
          control={control}
          errors={errors}
          placeholder="All Categories"
          options={[
            { value: "all", label: "All Categories" },
            ...categories.map((c) => ({ value: c, label: c })),
          ]}
          onChange={(v) => onChange({ category: v ?? "all" })}
        />
      </div>

      {showDateRange && (
        <div className="w-64">
          <CustomDateRange
            name="dateRange"
            control={control}
            errors={errors}
            onChange={(dates) => onChange({ dateRange: dates })}
          />
        </div>
      )}

      {/* Reset appears only when something is actually filtered */}
      {activeCount > 0 && (
        <button
          type="button"
          onClick={handleReset}
          className="flex items-center gap-1.5 px-3 py-[7px] rounded-xl text-[12px] font-semibold
            text-slate-600 border border-slate-200 hover:border-red-200 hover:text-red-600
            hover:bg-red-50 transition-colors"
        >
          <HiOutlineRefresh size={14} />
          Reset ({activeCount})
        </button>
      )}

      {typeof resultCount === "number" && (
        <span className="ml-auto flex items-center gap-1.5 text-[12px] text-slate-400 font-medium">
          <HiOutlineFilter size={13} />
          {resultCount} item{resultCount === 1 ? "" : "s"}
        </span>
      )}
    </div>
  );
};

export default Inventoryfiltersbar;
