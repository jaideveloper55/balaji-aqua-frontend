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
import CategorySelect from "./Categoryselect";

const SectionLabel: React.FC<{
  icon: React.ComponentType<{ size?: number; className?: string }>;
  title: string;
  subtitle?: string;
}> = ({ icon: Icon, title, subtitle }) => (
  <div className="flex items-center gap-2.5 mb-4">
    <div className="w-7 h-7 rounded-lg bg-blue-50 ring-1 ring-blue-100 flex items-center justify-center">
      <Icon size={14} className="text-blue-600" />
    </div>
    <div>
      <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
        {title}
      </span>
      {subtitle && (
        <p className="text-[10px] text-slate-400 mt-0.5">{subtitle}</p>
      )}
    </div>
  </div>
);

interface ProductFormProps {
  defaultValues?: Partial<ProductFormValues>;
  onSubmit: (data: ProductFormValues) => void;
  onCancel?: () => void;
  loading?: boolean;
  isEdit?: boolean;
  /** When true, disables all inputs (view mode). */
  readOnly?: boolean;
  /** When true, hides the form's own actions (parent owns them via footer). */
  hideActions?: boolean;
  /** Form id used so a footer button outside the form can submit it. */
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
  const { data: categories = [] } = useCategories();

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

  const categoryOptions = categories.map((c) => ({
    value: c.id,
    label: c.name,
    color: c.color,
    bg: c.bg,
  }));

  return (
    <form
      id={formId}
      onSubmit={handleSubmit(onSubmit)}
      className={`flex flex-col gap-6 ${
        readOnly ? "[&_input]:!cursor-default [&_.ant-select]:!cursor-default" : ""
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
          <CategorySelect
            name="categoryId"
            control={control as any}
            errors={errors}
            label="Category"
            placeholder="Select or create category"
            isrequired
          
            rules={{ required: "Category is required" }}
            options={categoryOptions}
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