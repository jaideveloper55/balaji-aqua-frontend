import React from "react";
import { Control, FieldErrors } from "react-hook-form";
import { HiOutlineTag, HiOutlineFilter } from "react-icons/hi";
import SearchInput from "../../../components/common/SearchInput";
import CustomSelect from "../../../components/common/CustomSelect";
import CustomDateRange from "../../../components/common/CustomDateRange";
import {
  CATEGORY_OPTIONS,
  STATUS_OPTIONS,
} from "../constants/productConstants";
import type { ProductFilterFormValues } from "../types/Product";

interface ProductFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  control: Control<ProductFilterFormValues>;
  errors: FieldErrors<ProductFilterFormValues>;
}

const ProductFilters: React.FC<ProductFiltersProps> = ({
  search,
  onSearchChange,
  control,
  errors,
}) => (
  <div className="flex items-center gap-2.5 flex-wrap px-5 py-3 border-b border-slate-50">
    <SearchInput
      value={search}
      onChange={onSearchChange}
      placeholder="Search name, SKU, or ID..."
    />

    <div className="w-40 flex-shrink-0">
      <CustomSelect
        name="categoryFilter"
        control={control}
        errors={errors}
        placeholder="All Categories"
        options={CATEGORY_OPTIONS}
        size="middle"
        showSearch={false}
        suffixIcon={<HiOutlineTag className="text-slate-400" />}
      />
    </div>

    <div className="w-36 flex-shrink-0">
      <CustomSelect
        name="statusFilter"
        control={control}
        errors={errors}
        placeholder="All Status"
        options={STATUS_OPTIONS}
        size="middle"
        showSearch={false}
        suffixIcon={<HiOutlineFilter className="text-slate-400" />}
      />
    </div>

    <div className="w-56 flex-shrink-0">
      <CustomDateRange
        name="dateRange"
        control={control}
        errors={errors}
        placeholder={["From", "To"]}
        size="middle"
      />
    </div>
  </div>
);

export default ProductFilters;
