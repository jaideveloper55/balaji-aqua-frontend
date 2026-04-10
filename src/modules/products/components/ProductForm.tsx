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
import {
  CATEGORY_FORM_OPTIONS,
  UNIT_OPTIONS,
  GST_OPTIONS,
} from "../constants/productConstants";

const SectionLabel: React.FC<{
  icon: React.ComponentType<{ size?: number; className?: string }>;
  title: string;
  subtitle?: string;
}> = ({ icon: Icon, title, subtitle }) => (
  <div className="flex items-center gap-2.5 mb-3">
    <div className="w-7 h-7 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center">
      <Icon size={14} className="text-blue-500" />
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
}

const ProductForm: React.FC<ProductFormProps> = ({
  defaultValues,
  onSubmit,
  onCancel,
  loading = false,
  isEdit = false,
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductFormValues>({
    defaultValues: {
      name: "",
      sku: "",
      category: "water_can",
      unit: "pcs",
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

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
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
            control={control}
            label="Product Name"
            placeholder="e.g. 20L Water Can"
            errors={errors}
            isrequired
            rules={{ required: "Product name is required" }}
          />
          <CustomInput
            name="sku"
            control={control}
            label="SKU Code"
            placeholder="e.g. WC-20L-STD"
            errors={errors}
            isrequired
            rules={{ required: "SKU is required" }}
          />
          <CustomSelect
            name="category"
            control={control}
            errors={errors}
            label="Category"
            placeholder="Select category"
            options={CATEGORY_FORM_OPTIONS}
            isrequired
            size="large"
            showSearch
            rules={{ required: "Category is required" }}
          />
          <CustomSelect
            name="unit"
            control={control}
            errors={errors}
            label="Unit of Measure"
            placeholder="Select unit"
            options={UNIT_OPTIONS}
            isrequired
            size="large"
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
            control={control}
            label="HSN Code"
            placeholder="e.g. 2201"
            errors={errors}
            size="large"
          />
          <CustomSelect
            name="gstRate"
            control={control}
            errors={errors}
            label="GST Rate"
            placeholder="Select GST %"
            options={GST_OPTIONS}
            isrequired
            size="large"
            rules={{ required: "GST rate is required" }}
          />
          <CustomInput
            name="basePrice"
            control={control}
            label="Selling Price (₹)"
            placeholder="0.00"
            errors={errors}
            isrequired
            rules={{ required: "Selling price is required" }}
          />
          <CustomInput
            name="costPrice"
            control={control}
            label="Manufacturing Cost (₹)"
            placeholder="0.00"
            errors={errors}
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
            control={control}
            label="Current Stock"
            placeholder="0"
            errors={errors}
            isrequired
            rules={{ required: "Stock is required" }}
          />
          <CustomInput
            name="minStock"
            control={control}
            label="Min Stock Alert Level"
            placeholder="0"
            errors={errors}
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
              className="!rounded-lg"
            />
          )}
        />
      </section>

      {/* Actions */}
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
            className="!bg-blue-600 hover:!bg-blue-700 !rounded-lg !font-semibold !shadow-sm !shadow-blue-200"
          >
            {isEdit ? "Update Product" : "Add Product"}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default ProductForm;
