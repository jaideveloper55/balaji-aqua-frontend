import React, { useEffect, useMemo } from "react";
import { Button, Divider, Input, Modal } from "antd";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  HiOutlineCube,
  HiOutlinePencil,
  HiOutlineEye,
  HiOutlineCurrencyRupee,
  HiOutlineClipboardList,
  HiOutlineAnnotation,
  HiOutlineArrowRight,
} from "react-icons/hi";
import CustomModal from "../../../components/common/CustomModal";
import CustomInput from "../../../components/common/CustomInput";
import CustomSelect from "../../../components/common/CustomSelect";
import SectionLabel from "../../../components/common/SectionLabel";

import {
  errorNotification,
  successNotification,
} from "../../../components/common/Notification";
import type {
  CreateProductPayload,
  UpdateProductPayload,
  ProductFormValues,
} from "../types/Product";
import { UNIT_OPTIONS, GST_OPTIONS } from "../types/Product";
import { getCategoriesApi } from "../api/Categories.api";
import { createProductApi, updateProductApi } from "../api/Products.api";

export type ProductModalMode = "create" | "edit" | "view";

interface ProductModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  defaultValues?: Partial<ProductFormValues>;
  mode?: ProductModalMode;
  editId?: string;
  onSwitchToEdit?: () => void;
  currentStock?: number;
  unitLabel?: string;
  sku?: string;
}

const MODE_CONFIG: Record<
  ProductModalMode,
  {
    title: string;
    subtitle: string;
    icon: React.ReactNode;
    iconTone: "blue" | "amber" | "slate";
  }
> = {
  create: {
    title: "New Product",
    subtitle: "Add a new product to your inventory",
    icon: <HiOutlineCube className="w-5 h-5" />,
    iconTone: "blue",
  },
  edit: {
    title: "Edit Product",
    subtitle: "Update product details and pricing",
    icon: <HiOutlinePencil className="w-5 h-5" />,
    iconTone: "amber",
  },
  view: {
    title: "Product Details",
    subtitle: "Read-only view of product information",
    icon: <HiOutlineEye className="w-5 h-5" />,
    iconTone: "slate",
  },
};

const EMPTY_VALUES: ProductFormValues = {
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
  isSellable: true,
} as ProductFormValues;

const numberRule = (label: string, required = false) => ({
  ...(required ? { required: `${label} is required` } : {}),
  validate: (v: unknown) => {
    if (v === "" || v === undefined || v === null) return true;
    const n = Number(v);
    if (!Number.isFinite(n)) return "Enter a valid number";
    if (n < 0) return "Cannot be negative";
    return true;
  },
});

const ProductModal: React.FC<ProductModalProps> = ({
  open,
  onClose,
  onSuccess,
  defaultValues,
  mode = "create",
  editId,
  onSwitchToEdit,
  currentStock,
  unitLabel,
  sku,
}) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const isView = mode === "view";
  const isCreate = mode === "create";
  const config = MODE_CONFIG[mode];

  // ─── Queries ──────────────────────────────────────────────────────────────
  const { data: categoriesResponse, isLoading: loadingCategories } = useQuery({
    queryKey: ["getCategories"],
    queryFn: () => getCategoriesApi().then((res) => res.data),
    staleTime: 1000 * 60 * 5,
  });

  // ─── Mutations ────────────────────────────────────────────────────────────
  const createMutation = useMutation({
    mutationKey: ["createProduct"],
    mutationFn: (payload: CreateProductPayload) =>
      createProductApi(payload).then((res) => res.data),
    onSuccess: () => {
      successNotification("Product Added", "New product created successfully");
      queryClient.invalidateQueries({ queryKey: ["getProducts"] });
      queryClient.invalidateQueries({ queryKey: ["getProductStats"] });
    },
    onError: (err: any) =>
      errorNotification(
        "Create Failed",
        err?.message ?? "Could not create product"
      ),
  });

  const updateMutation = useMutation({
    mutationKey: ["updateProduct"],
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateProductPayload;
    }) => updateProductApi(id, payload).then((res) => res.data),
    onSuccess: () => {
      successNotification("Product Updated", "Changes saved successfully");
      queryClient.invalidateQueries({ queryKey: ["getProducts"] });
      queryClient.invalidateQueries({ queryKey: ["getProductStats"] });
    },
    onError: (err: any) =>
      errorNotification(
        "Update Failed",
        err?.message ?? "Could not update product"
      ),
  });

  const loading = createMutation.isPending || updateMutation.isPending;

  // ─── Form ─────────────────────────────────────────────────────────────────
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<ProductFormValues>({
    defaultValues: { ...EMPTY_VALUES, ...defaultValues },
  });

  useEffect(() => {
    if (open) reset({ ...EMPTY_VALUES, ...defaultValues });
  }, [open, defaultValues, reset]);

  // ─── Categories ───────────────────────────────────────────────────────────
  const rawCategories: any[] = Array.isArray(categoriesResponse)
    ? categoriesResponse
    : (categoriesResponse as any)?.data ??
      (categoriesResponse as any)?.categories ??
      [];

  const categoryOptions = useMemo(
    () =>
      rawCategories.map((c) => ({
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
      })),
    [rawCategories]
  );

  // ─── Submit ───────────────────────────────────────────────────────────────
  const toPayload = (data: ProductFormValues): CreateProductPayload => ({
    name: data.name.trim(),
    sku: data.sku.trim().toUpperCase(),
    categoryId: data.categoryId,
    unit: data.unit,
    hsn: data.hsn || undefined,
    description: data.description || undefined,
    basePrice: Number(data.basePrice) || 0,
    costPrice: Number(data.costPrice) || 0,
    gstRate: Number(data.gstRate) || 0,
    ...(isCreate ? { stock: Number(data.stock) || 0 } : {}),
    minStock: Number(data.minStock) || 0,
  });

  const onFormSubmit = async (data: ProductFormValues) => {
    if (isView) return;
    const payload = toPayload(data);
    try {
      if (mode === "edit" && editId) {
        await updateMutation.mutateAsync({
          id: editId,
          payload: payload as UpdateProductPayload,
        });
      } else {
        await createMutation.mutateAsync(payload);
      }
      onSuccess?.();
      onClose();
    } catch {
      // error already shown by mutation onError
    }
  };

  // ─── Dirty-close guard ────────────────────────────────────────────────────
  const beforeClose = () =>
    isView || !isDirty
      ? true
      : new Promise<boolean>((resolve) => {
          Modal.confirm({
            title: "Discard changes?",
            content: "Your unsaved product details will be lost.",
            okText: "Discard",
            okButtonProps: { danger: true },
            cancelText: "Keep editing",
            onOk: () => resolve(true),
            onCancel: () => resolve(false),
          });
        });

  // ─── Footer ───────────────────────────────────────────────────────────────
  const renderFooter = () => {
    if (isView) {
      return (
        <div className="flex items-center justify-between gap-3">
          <p className="text-[11px] text-slate-400">
            Read-only view — switch to edit to make changes
          </p>
          <div className="flex items-center gap-3">
            <Button onClick={onClose} className="!rounded-lg">
              Close
            </Button>
            {onSwitchToEdit && (
              <Button
                type="primary"
                icon={<HiOutlinePencil size={14} />}
                onClick={onSwitchToEdit}
                className="!bg-amber-500 hover:!bg-amber-600 !rounded-lg !font-semibold !shadow-sm !shadow-amber-500/25 !border-0"
              >
                Edit Product
              </Button>
            )}
          </div>
        </div>
      );
    }
    return (
      <div className="flex items-center justify-between gap-3">
        <p className="text-[11px] text-slate-400">
          {mode === "edit"
            ? "Changes will update immediately"
            : "Opening stock will be recorded in Inventory"}
        </p>
        <div className="flex items-center gap-3">
          <Button onClick={onClose} disabled={loading} className="!rounded-lg">
            Cancel
          </Button>
          <Button
            type="primary"
            loading={loading}
            onClick={handleSubmit(onFormSubmit)}
            className="!bg-blue-600 hover:!bg-blue-700 !rounded-lg !font-semibold !shadow-sm !shadow-blue-500/25 !border-0"
          >
            {mode === "edit" ? "Update Product" : "Add Product"}
          </Button>
        </div>
      </div>
    );
  };

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <CustomModal
      open={open}
      onClose={onClose}
      beforeClose={beforeClose}
      title={config.title}
      subtitle={config.subtitle}
      icon={config.icon}
      iconTone={config.iconTone}
      size="2xl"
      footer={renderFooter()}
    >
      <div
        className={`flex flex-col gap-6 ${
          isView
            ? "[&_input]:!cursor-default [&_.ant-select]:!cursor-default"
            : ""
        }`}
      >
        {/* ── Product Information ── */}
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
              disabled={isView}
              rules={{ required: "Product name is required" }}
            />
            <CustomInput
              name="sku"
              control={control as any}
              label="SKU Code"
              placeholder="e.g. WC-20L-STD"
              errors={errors}
              isrequired
              disabled={isView || mode === "edit"}
              rules={{ required: "SKU is required" }}
            />
            <CustomSelect
              name="categoryId"
              control={control as any}
              errors={errors}
              label="Category"
              placeholder={
                loadingCategories
                  ? "Loading categories..."
                  : "Select a category"
              }
              options={categoryOptions}
              isrequired
              showSearch
              isLoading={loadingCategories}
              disabled={isView || loadingCategories}
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
              disabled={isView}
              rules={{ required: "Unit is required" }}
            />
          </div>
        </section>

        <Divider className="!my-0 !border-slate-100" />

        {/* ── Pricing & Tax ── */}
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
              disabled={isView}
            />
            <CustomSelect
              name="gstRate"
              control={control as any}
              errors={errors}
              label="GST Rate"
              placeholder="Select GST %"
              options={GST_OPTIONS}
              isrequired
              disabled={isView}
              rules={{ required: "GST rate is required" }}
            />
            <CustomInput
              name="basePrice"
              control={control as any}
              label="Selling Price (₹)"
              placeholder="0.00"
              errors={errors}
              isrequired
              disabled={isView}
              rules={numberRule("Selling price", true)}
            />
            <CustomInput
              name="costPrice"
              control={control as any}
              label="Manufacturing Cost (₹)"
              placeholder="0.00"
              errors={errors}
              disabled={isView}
              rules={numberRule("Manufacturing cost")}
            />
          </div>
        </section>

        <Divider className="!my-0 !border-slate-100" />

        {/* ── Inventory ── */}
        <section>
          <SectionLabel
            icon={HiOutlineClipboardList}
            title="Inventory"
            subtitle={
              isCreate
                ? "Opening stock and low-stock alert threshold"
                : "Stock is managed in Inventory — only the alert level is edited here"
            }
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3">
            {isCreate ? (
              <CustomInput
                name="stock"
                control={control as any}
                label="Opening Stock"
                placeholder="0 (optional)"
                errors={errors}
                rules={numberRule("Opening stock")}
              />
            ) : (
              <div className="flex flex-col gap-1.5">
                <span className="flex justify-start py-1 text-sm text-text-primary">
                  Current Stock
                </span>
                <div className="flex items-center justify-between px-3 py-[7px] rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-sm font-semibold text-slate-700 tabular-nums">
                    {currentStock ?? 0} {unitLabel ?? ""}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      navigate(
                        `/admin/inventory${sku ? `?product=${sku}` : ""}`
                      )
                    }
                    className="flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:underline"
                  >
                    Manage in Inventory <HiOutlineArrowRight size={11} />
                  </button>
                </div>
                <p className="text-[10px] text-slate-400">
                  Changes only via Stock In / Out / Adjust (audit trail)
                </p>
              </div>
            )}
            <CustomInput
              name="minStock"
              control={control as any}
              label="Min Stock Alert Level"
              placeholder="0"
              errors={errors}
              disabled={isView}
              rules={numberRule("Min stock level")}
            />
          </div>
          {isCreate && (
            <p className="mt-2 text-[11px] text-slate-400">
              Opening stock is recorded as an{" "}
              <span className="font-semibold">Opening Stock</span> entry in the
              inventory movement history.
            </p>
          )}
        </section>

        <Divider className="!my-0 !border-slate-100" />

        {/* ── Description ── */}
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
                disabled={isView}
                className="!rounded-lg"
              />
            )}
          />
        </section>
      </div>
    </CustomModal>
  );
};

export default ProductModal;
