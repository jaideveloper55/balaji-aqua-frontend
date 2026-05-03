import React from "react";
import { Input, Button, Divider } from "antd";
import { Controller, useForm } from "react-hook-form";
import {
  HiOutlineCube,
  HiOutlineCurrencyRupee,
  HiOutlineClipboardList,
  HiOutlineAnnotation,
} from "react-icons/hi";
import CustomInput from "../../../components/common/CustomInput";
import CustomSelect from "../../../components/common/CustomSelect";
import type { ProductFormValues } from "../types/Product";
import { UNIT_OPTIONS, GST_OPTIONS } from "../types/Product";
import { useCategories } from "../hooks/Usecategories";
import SectionLabel from "../../../components/common/SectionLabel";

interface ProductFormProps {
  defaultValues?: Partial<ProductFormValues>;
  onSubmit: (data: ProductFormValues) => void;
  onCancel?: () => void;
  loading?: boolean;
  isEdit?: boolean;
  readOnly?: boolean;
  hideActions?: boolean;
  formId?: string;
}

const ProductForm: React.FC<ProductFormProps> = ({
  defaultValues,
  onSubmit,
  onCancel,
  loading = false,
  isEdit = false,
  readOnly = false,
  hideActions = false,
  formId = "product-form",
}) => {
  const { data: categoriesResponse, isLoading: loadingCategories } =
    useCategories();

  const rawCategories: any[] = Array.isArray(categoriesResponse)
    ? categoriesResponse
    : (categoriesResponse as any)?.data ??
      (categoriesResponse as any)?.categories ??
      [];

  // Build options for CustomSelect: { value, label }
  const categoryOptions = rawCategories.map((c) => ({
    value: c.id,
    label: (
      <span className="flex items-center gap-2">
        <span
          className="inline-block w-2.5 h-2.5 rounded-full ring-1 ring-slate-200"
          style={{ backgroundColor: c.color || "#94a3b8" }}
        />
        <span>{c.name}</span>
      </span>
    ),
  }));

  const { control, handleSubmit, formState } = useForm<ProductFormValues>({
    defaultValues: {
      name: "",
      sku: "",
      categoryId: "",
      unit: "PCS",
      basePrice: "",
      gstRate: 18,
      costPrice: "",
      stock: "",
      minStock: "",
      hsn: "",
      description: "",
      ...defaultValues,
    },
  });

  const { errors } = formState;

  return (
    <form
      id={formId}
      onSubmit={handleSubmit(onSubmit)}
      className={`flex flex-col gap-6 ${
        readOnly
          ? "[&_input]:!cursor-default [&_.ant-select]:!cursor-default"
          : ""
      }`}
    >
      {/* Product Information */}
      <section>
        <SectionLabel
          icon={HiOutlineCube}
          title="Product Information"
          subtitle="Basic product details and classification"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3">
          <CustomInput
            name="name"
            control={control as any}
            label="Product Name"
            placeholder="e.g. 20L Water Can"
            errors={errors}
            isrequired
            disabled={readOnly}
            rules={{ required: "Product name is required" }}
          />
          <CustomInput
            name="sku"
            control={control as any}
            label="SKU Code"
            placeholder="e.g. WC-20L-STD"
            errors={errors}
            isrequired
            disabled={readOnly}
            rules={{ required: "SKU is required" }}
          />
          <CustomSelect
            name="categoryId"
            control={control as any}
            errors={errors}
            label="Category"
            placeholder={
              loadingCategories ? "Loading categories..." : "Select a category"
            }
            options={categoryOptions}
            isrequired
            size="large"
            showSearch
            isLoading={loadingCategories}
            disabled={readOnly || loadingCategories}
            rules={{ required: "Category is required" }}
          />
          <CustomSelect
            name="unit"
            control={control as any}
            errors={errors}
            label="Unit of Measure"
            placeholder="Select unit"
            options={UNIT_OPTIONS}
            isrequired
            size="large"
            disabled={readOnly}
            rules={{ required: "Unit is required" }}
          />
        </div>
      </section>

      <Divider className="!my-0 !border-slate-100" />

      {/* Pricing & Tax */}
      <section>
        <SectionLabel
          icon={HiOutlineCurrencyRupee}
          title="Pricing & Tax"
          subtitle="Set selling price, cost, and GST details"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3">
          <CustomInput
            name="hsn"
            control={control as any}
            label="HSN Code"
            placeholder="e.g. 2201"
            errors={errors}
            disabled={readOnly}
          />
          <CustomSelect
            name="gstRate"
            control={control as any}
            errors={errors}
            label="GST Rate"
            placeholder="Select GST %"
            options={GST_OPTIONS}
            isrequired
            size="large"
            disabled={readOnly}
            rules={{ required: "GST rate is required" }}
          />
          <CustomInput
            name="basePrice"
            control={control as any}
            label="Selling Price (₹)"
            placeholder="0.00"
            errors={errors}
            isrequired
            disabled={readOnly}
            rules={{ required: "Selling price is required" }}
          />
          <CustomInput
            name="costPrice"
            control={control as any}
            label="Manufacturing Cost (₹)"
            placeholder="0.00"
            errors={errors}
            disabled={readOnly}
          />
        </div>
      </section>

      <Divider className="!my-0 !border-slate-100" />

      {/* Inventory */}
      <section>
        <SectionLabel
          icon={HiOutlineClipboardList}
          title="Inventory"
          subtitle="Stock levels and low-stock alert threshold"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3">
          <CustomInput
            name="stock"
            control={control as any}
            label="Current Stock"
            placeholder="0"
            errors={errors}
            isrequired
            disabled={readOnly}
            rules={{ required: "Stock is required" }}
          />
          <CustomInput
            name="minStock"
            control={control as any}
            label="Min Stock Alert Level"
            placeholder="0"
            errors={errors}
            disabled={readOnly}
          />
        </div>
      </section>

      <Divider className="!my-0 !border-slate-100" />

      {/* Description */}
      <section>
        <SectionLabel icon={HiOutlineAnnotation} title="Description" />
        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <Input.TextArea
              {...field}
              placeholder="Product description, notes, or special handling instructions..."
              rows={2}
              size="middle"
              showCount
              maxLength={300}
              disabled={readOnly}
              className="!rounded-lg"
            />
          )}
        />
      </section>

      {/* Internal actions (hidden when modal owns them or in view mode) */}
      {!hideActions && !readOnly && (
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <p className="text-[10px] text-slate-400">
            {isEdit
              ? "Changes will update immediately"
              : "Product will be added to inventory"}
          </p>
          <div className="flex items-center gap-3">
            {onCancel && (
              <Button size="middle" onClick={onCancel} className="!rounded-lg">
                Cancel
              </Button>
            )}
            <Button
              type="primary"
              htmlType="submit"
              size="middle"
              loading={loading}
              className="!bg-blue-600 hover:!bg-blue-700 !rounded-lg !font-semibold !shadow-sm !shadow-blue-500/25 !border-0"
            >
              {isEdit ? "Update Product" : "Add Product"}
            </Button>
          </div>
        </div>
      )}
    </form>
  );
};

export default ProductForm;
