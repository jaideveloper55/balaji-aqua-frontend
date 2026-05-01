import React from "react";
import { Button, Table, Tooltip } from "antd";
import type { Control, FieldErrors } from "react-hook-form";
import { HiOutlineCube, HiOutlineCog, HiOutlineTrash } from "react-icons/hi";
import type { Product, ProductFilterFormValues } from "../types/Product";
import ProductFilters from "./ProductFilters";
import { useProductColumns } from "./Useproductcolumns";

interface ProductsTableSectionProps {
  // Data
  products: Product[];
  totalProducts: number;
  isLoading?: boolean;

  // Pagination
  page: number;
  pageSize: number;
  onPageChange: (page: number, pageSize: number) => void;

  // Search & filter form
  search: string;
  onSearchChange: (v: string) => void;
  control: Control<ProductFilterFormValues>;
  errors: FieldErrors<ProductFilterFormValues>;

  // Selection
  selectedRowKeys: React.Key[];
  onSelectionChange: (keys: React.Key[]) => void;
  onClearSelection: () => void;
  onBulkDelete?: () => void;

  // Row interactions
  onView?: (product: Product) => void;
  onEdit: (product: Product) => void;
  onDelete?: (product: Product) => void;
  onManageCategories: () => void;
}

const ProductsTableSection: React.FC<ProductsTableSectionProps> = ({
  products,
  totalProducts,
  isLoading,
  page,
  pageSize,
  onPageChange,
  search,
  onSearchChange,
  control,
  errors,
  selectedRowKeys,
  onSelectionChange,
  onClearSelection,
  onBulkDelete,
  onView,
  onEdit,
  onDelete,
  onManageCategories,
}) => {
  const columns = useProductColumns({ onView, onEdit, onDelete });

  return (
    <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm shadow-slate-200/40 overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 bg-gradient-to-r from-slate-50/50 to-transparent">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-blue-50 ring-1 ring-blue-100 flex items-center justify-center">
            <HiOutlineCube size={15} className="text-blue-600" />
          </div>
          <div>
            <h3 className="text-[13px] font-bold text-slate-800 leading-tight">
              Product Inventory
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">
              <span className="font-semibold text-slate-700">
                {products.length}
              </span>{" "}
              of {totalProducts} products
            </p>
          </div>
        </div>

        {selectedRowKeys.length > 0 ? (
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-600 font-medium px-2 py-1 bg-blue-50 rounded-lg ring-1 ring-blue-100">
              {selectedRowKeys.length} selected
            </span>
            <Button
              size="small"
              danger
              icon={<HiOutlineTrash size={12} />}
              onClick={onBulkDelete}
              className="!rounded-lg !h-7"
            >
              Delete
            </Button>
            <Button
              size="small"
              onClick={onClearSelection}
              className="!rounded-lg !h-7"
            >
              Clear
            </Button>
          </div>
        ) : (
          <Tooltip title="Manage categories">
            <button
              onClick={onManageCategories}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200"
            >
              <HiOutlineCog size={13} />
              Manage
            </button>
          </Tooltip>
        )}
      </div>

      {/* Filters */}
      <ProductFilters
        search={search}
        onSearchChange={onSearchChange}
        control={control}
        errors={errors}
      />

      {/* Table */}
      <Table<Product>
        columns={columns}
        dataSource={products}
        rowKey="id"
        size="middle"
        tableLayout="fixed"
        loading={isLoading}
        rowSelection={{
          selectedRowKeys,
          onChange: (keys) => onSelectionChange(keys),
        }}
        pagination={{
          current: page,
          pageSize,
          total: totalProducts,
          showSizeChanger: true,
          pageSizeOptions: ["10", "20", "50"],
          onChange: (newPage, newPageSize) =>
            onPageChange(newPage, newPageSize),
          showTotal: (total, range) => (
            <span className="text-[11px] text-slate-500 font-medium">
              Showing {range[0]}–{range[1]} of {total}
            </span>
          ),
        }}
        onRow={(record) => ({
          // 👇 row-click opens VIEW (not edit) for safer default behaviour
          onClick: () => (onView ? onView(record) : onEdit(record)),
          className: "cursor-pointer group",
        })}
        className="product-table"
      />
    </div>
  );
};

export default ProductsTableSection;