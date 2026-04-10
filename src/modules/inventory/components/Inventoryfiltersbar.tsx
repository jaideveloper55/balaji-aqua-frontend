import React, { useState } from "react";
import { Input, Select, DatePicker, Button, Badge } from "antd";
import {
  HiOutlineSearch,
  HiOutlineFilter,
  HiOutlineRefresh,
} from "react-icons/hi";
import {
  STOCK_STATUS_OPTIONS,
  CATEGORY_OPTIONS,
  WAREHOUSE_OPTIONS,
} from "../constants/Inventoryconstants";

const { RangePicker } = DatePicker;

interface InventoryFiltersBarProps {
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onWarehouseChange: (value: string) => void;
  onDateRangeChange: (dates: any) => void;
  onReset: () => void;
}

const InventoryFiltersBar: React.FC<InventoryFiltersBarProps> = ({
  onSearchChange,
  onStatusChange,
  onCategoryChange,
  onWarehouseChange,
  onDateRangeChange,
  onReset,
}) => {
  const [activeFilters, setActiveFilters] = useState(0);
  const [searchFocused, setSearchFocused] = useState(false);

  const handleStatusChange = (val: string) => {
    onStatusChange(val);
    recountFilters({ status: val });
  };

  const handleCategoryChange = (val: string) => {
    onCategoryChange(val);
    recountFilters({ category: val });
  };

  const handleWarehouseChange = (val: string) => {
    onWarehouseChange(val);
    recountFilters({ warehouse: val });
  };

  const handleDateChange = (dates: any) => {
    onDateRangeChange(dates);
    recountFilters({ dates });
  };

  const recountFilters = (override: Record<string, any> = {}) => {
    let count = 0;
    if (override.status && override.status !== "all") count++;
    if (override.category) count++;
    if (override.warehouse) count++;
    if (override.dates) count++;
    setActiveFilters(count);
  };

  const handleReset = () => {
    setActiveFilters(0);
    onReset();
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Search - wider on focus */}
      <div
        className={`transition-all duration-300 ease-out ${
          searchFocused ? "w-72" : "w-56"
        }`}
      >
        <Input
          placeholder="Search product, SKU, or batch..."
          prefix={
            <HiOutlineSearch
              size={15}
              className={`transition-colors duration-200 ${
                searchFocused ? "text-blue-500" : "text-slate-300"
              }`}
            />
          }
          size="middle"
          className="!rounded-lg !border-slate-200 focus-within:!border-blue-400 focus-within:!shadow-sm focus-within:!shadow-blue-100"
          allowClear
          onChange={(e) => onSearchChange(e.target.value)}
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
        />
      </div>

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

        <Select
          placeholder="All Status"
          size="middle"
          className="!w-[130px] !rounded-lg"
          options={STOCK_STATUS_OPTIONS}
          defaultValue="all"
          onChange={handleStatusChange}
          popupClassName="!rounded-lg"
        />
        <Select
          placeholder="All Categories"
          size="middle"
          className="!w-[155px] !rounded-lg"
          options={CATEGORY_OPTIONS}
          defaultValue=""
          onChange={handleCategoryChange}
          allowClear
          popupClassName="!rounded-lg"
        />
        <Select
          placeholder="All Locations"
          size="middle"
          className="!w-[155px] !rounded-lg"
          options={WAREHOUSE_OPTIONS}
          defaultValue=""
          onChange={handleWarehouseChange}
          allowClear
          popupClassName="!rounded-lg"
        />
      </div>

      {/* Divider */}
      <div className="w-px h-7 bg-slate-200/80 mx-0.5 hidden sm:block" />

      {/* Date range */}
      <RangePicker
        size="middle"
        placeholder={["From", "To"]}
        className="!rounded-lg"
        onChange={handleDateChange}
      />

      {/* Reset with active filter count */}
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

export default InventoryFiltersBar;
