import React, { useState } from "react";
import { Table, Button, Popconfirm, Tooltip, Divider } from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  HiOutlineTag,
  HiOutlinePlus,
  HiOutlinePencil,
  HiOutlineTrash,
} from "react-icons/hi";
import dayjs, { Dayjs } from "dayjs";
import { useForm } from "react-hook-form";
import {
  useCustomerPricing,
  useCreatePricing,
  useUpdatePricing,
  useDeletePricing,
} from "../hooks/useCustomerPricing";

import { errorNotification } from "../../../components/common/Notification";
import type {
  CustomerPricing,
  CustomerPricingFormValues,
} from "../types/Customer";
import CustomInput from "../../../components/common/CustomInput";
import CustomSelect from "../../../components/common/CustomSelect";
import CustomDateRange from "../../../components/common/CustomDateRange";
import CustomModal from "../../../components/common/CustomModal";
import { useProducts } from "../hooks/useProducts";

interface PricingTableProps {
  customerId: string;
}

interface PricingFormValues {
  productId: string;
  customerPrice: string;
  effectiveRange: [Dayjs | null, Dayjs | null];
}

const DEFAULT_FORM_VALUES: PricingFormValues = {
  productId: "",
  customerPrice: "",
  effectiveRange: [dayjs(), null],
};

const FORM_ID = "customer-pricing-form";

const PricingTable: React.FC<PricingTableProps> = ({ customerId }) => {
  // ─── Server state via TanStack Query ──────────────────────────────────
  const { data: pricingData, isLoading: pricingLoading } =
    useCustomerPricing(customerId);
  const { data: productsData } = useProducts();

  const createPricing = useCreatePricing(customerId);
  const updatePricing = useUpdatePricing(customerId);
  const deletePricing = useDeletePricing(customerId);

  // ─── Local UI state ───────────────────────────────────────────────────
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Defensive: API may return [] OR { data: [] } OR undefined while loading
  const data: CustomerPricing[] = Array.isArray(pricingData)
    ? pricingData
    : Array.isArray((pricingData as any)?.data)
    ? (pricingData as any).data
    : [];

  const products = Array.isArray(productsData) ? productsData : [];

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isDirty },
  } = useForm<PricingFormValues>({
    defaultValues: DEFAULT_FORM_VALUES,
  });

  const productId = watch("productId");
  const customerPrice = watch("customerPrice");

  // ─── Modal handlers ────────────────────────────────────────────────────
  const openAdd = () => {
    setEditingId(null);
    reset(DEFAULT_FORM_VALUES);
    setModalOpen(true);
  };

  const openEdit = (r: CustomerPricing) => {
    setEditingId(r.id);
    reset({
      productId: r.productId,
      customerPrice: String(r.customerPrice),
      effectiveRange: [
        dayjs(r.effectiveFrom),
        r.effectiveTo ? dayjs(r.effectiveTo) : null,
      ],
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingId(null);
    reset(DEFAULT_FORM_VALUES);
  };

  // Discard-changes guard for X / overlay / ESC
  const beforeClose = async () => {
    if (isSaving) return false;
    if (isDirty) return window.confirm("Discard your changes?");
    return true;
  };

  // ─── Submit ────────────────────────────────────────────────────────────
  const onSubmit = (values: PricingFormValues) => {
    const [from, to] = values.effectiveRange;
    if (!from) {
      errorNotification("Validation error", "Please select a start date");
      return;
    }
    const price = parseFloat(values.customerPrice);
    if (isNaN(price) || price <= 0) {
      errorNotification("Validation error", "Enter a valid price");
      return;
    }

    const payload: CustomerPricingFormValues = {
      productId: values.productId,
      customerPrice: price,
      effectiveFrom: from.format("YYYY-MM-DD"),
      effectiveTo: to?.format("YYYY-MM-DD"),
    };

    if (editingId) {
      updatePricing.mutate(
        { pricingId: editingId, data: payload },
        { onSuccess: closeModal }
      );
    } else {
      createPricing.mutate(payload, { onSuccess: closeModal });
    }
  };

  // ─── Computed UI helpers ───────────────────────────────────────────────
  const selectedProduct = products.find((p) => p.id === productId);
  const priceNum = parseFloat(customerPrice);
  const discount =
    selectedProduct && !isNaN(priceNum)
      ? selectedProduct.basePrice - priceNum
      : 0;

  const assignedProductIds = data
    .filter((d) => d.isActive)
    .map((d) => d.productId);

  const availableProducts = editingId
    ? products
    : products.filter((p) => !assignedProductIds.includes(p.id));

  const productOptions = availableProducts.map((p) => ({
    value: p.id,
    label: (
      <div className="flex items-center justify-between w-full">
        <span>
          {p.name} <span className="text-slate-400 text-[11px]">({p.sku})</span>
        </span>
        <span className="text-[11px] text-slate-500 tabular-nums font-mono">
          ₹{p.basePrice}/{p.unit}
        </span>
      </div>
    ),
  }));

  // ─── Columns ───────────────────────────────────────────────────────────
  const columns: ColumnsType<CustomerPricing> = [
    {
      title: "Product",
      key: "product",
      width: 220,
      render: (_, r) => (
        <div className="flex flex-col gap-0.5">
          <span className="text-[13px] font-semibold text-slate-800">
            {r.product?.name ?? "—"}
          </span>
          <span className="text-[10px] font-mono text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded w-fit">
            {r.product?.sku ?? "—"}
          </span>
        </div>
      ),
    },
    {
      title: "Unit",
      key: "unit",
      align: "center",
      width: 80,
      render: (_, r) => (
        <span className="text-[11px] text-slate-500 capitalize">
          per {r.product?.unit ?? "—"}
        </span>
      ),
    },
    {
      title: "Base Price",
      key: "basePrice",
      width: 110,
      align: "center",
      render: (_, r) => (
        <span className="text-[13px] text-slate-400 tabular-nums line-through font-mono">
          ₹{r.product?.basePrice ?? 0}
        </span>
      ),
    },
    {
      title: "Customer Price",
      dataIndex: "customerPrice",
      key: "customerPrice",
      width: 130,
      align: "center",
      render: (v: number, r) => {
        const basePrice = r.product?.basePrice ?? 0;
        const savingAmt = basePrice - v;
        return (
          <Tooltip
            title={
              savingAmt > 0
                ? `${Math.round((savingAmt / basePrice) * 100)}% discount`
                : savingAmt < 0
                ? "Premium pricing"
                : "Same as base"
            }
          >
            <div className="flex flex-col gap-0.5 cursor-default">
              <span className="text-[13px] font-bold text-emerald-600 tabular-nums font-mono">
                ₹{v}
              </span>
              {savingAmt > 0 && (
                <span className="text-[10px] font-semibold text-emerald-500 bg-emerald-50 px-1.5 py-0.5 rounded-md w-fit mx-auto">
                  -₹{savingAmt}
                </span>
              )}
              {savingAmt < 0 && (
                <span className="text-[10px] font-semibold text-orange-500 bg-orange-50 px-1.5 py-0.5 rounded-md w-fit mx-auto">
                  +₹{Math.abs(savingAmt)}
                </span>
              )}
            </div>
          </Tooltip>
        );
      },
    },
    {
      title: "Effective",
      key: "effective",
      width: 200,
      align: "center",
      render: (_, r) => (
        <span className="text-[11px] text-slate-500 tabular-nums">
          {new Date(r.effectiveFrom).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
          {r.effectiveTo &&
            ` → ${new Date(r.effectiveTo).toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}`}
        </span>
      ),
    },
    {
      title: "Status",
      dataIndex: "isActive",
      key: "status",
      width: 90,
      align: "center",
      render: (v: boolean) => (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${
            v ? "bg-emerald-50 text-emerald-700" : "bg-slate-50 text-slate-400"
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              v ? "bg-emerald-500" : "bg-slate-300"
            }`}
          />
          {v ? "Active" : "Expired"}
        </span>
      ),
    },
    {
      title: "",
      key: "actions",
      width: 90,
      align: "center",
      render: (_, r) => (
        <div className="flex items-center justify-center gap-1">
          <Tooltip title="Edit">
            <button
              onClick={(e) => {
                e.stopPropagation();
                openEdit(r);
              }}
              className="p-1.5 rounded-xl hover:bg-blue-50 text-slate-400 hover:text-blue-500 transition-colors"
            >
              <HiOutlinePencil size={14} />
            </button>
          </Tooltip>
          <Popconfirm
            title="Remove this pricing?"
            onConfirm={() => deletePricing.mutate(r.id)}
            okText="Yes"
            cancelText="No"
          >
            <Tooltip title="Remove">
              <button
                onClick={(e) => e.stopPropagation()}
                className="p-1.5 rounded-xl hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors"
              >
                <HiOutlineTrash size={14} />
              </button>
            </Tooltip>
          </Popconfirm>
        </div>
      ),
    },
  ];

  const isSaving = createPricing.isPending || updatePricing.isPending;
  const activeCount = data.filter((d) => d.isActive).length;

  return (
    <div className="flex flex-col gap-4">
      {/* Section header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center">
            <HiOutlineTag size={15} className="text-blue-500" />
          </div>
          <div>
            <h3 className="text-[13px] font-bold text-slate-800">
              Customer Pricing
            </h3>
            <p className="text-[11px] text-slate-400">
              {activeCount} active price rule{activeCount !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
        <Tooltip title="Add custom pricing for a product">
          <Button
            type="primary"
            icon={<HiOutlinePlus size={14} />}
            onClick={openAdd}
            className="!bg-blue-600 hover:!bg-blue-700 !rounded-xl !font-semibold !shadow-sm !shadow-blue-200"
          >
            Add Price
          </Button>
        </Tooltip>
      </div>

      <Table
        columns={columns}
        dataSource={data}
        rowKey="id"
        loading={pricingLoading}
        pagination={false}
        size="middle"
        scroll={{ x: 800 }}
        rowClassName={(r) => (r.isActive ? "" : "opacity-50")}
      />

      {/* ─── Add / Edit Modal — uses CustomModal ─── */}
      <CustomModal
        open={modalOpen}
        onClose={closeModal}
        beforeClose={beforeClose}
        title={editingId ? "Edit Customer Price" : "Add Customer Price"}
        subtitle="Set special pricing for this customer"
        icon={
          editingId ? (
            <HiOutlinePencil className="w-5 h-5" />
          ) : (
            <HiOutlineTag className="w-5 h-5" />
          )
        }
        iconTone={editingId ? "amber" : "blue"}
        size="lg"
        footer={
          <div className="flex items-center justify-between gap-3">
            <p className="text-[11px] text-slate-400">
              Price applies to this customer only
            </p>
            <div className="flex items-center gap-3">
              <Button
                onClick={closeModal}
                className="!rounded-lg"
                disabled={isSaving}
              >
                Cancel
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                form={FORM_ID}
                loading={isSaving}
                className="!bg-blue-600 hover:!bg-blue-700 !rounded-lg !font-semibold !shadow-sm !shadow-blue-200"
              >
                {editingId ? "Update Price" : "Add Price"}
              </Button>
            </div>
          </div>
        }
      >
        <form
          id={FORM_ID}
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          <CustomSelect
            label="Product"
            name="productId"
            control={control}
            errors={errors}
            placeholder="Select a product"
            size="large"
            isrequired
            disabled={!!editingId}
            rules={{ required: "Product is required" }}
            options={productOptions}
          />

          <div>
            <CustomInput
              label="Customer Price (₹)"
              name="customerPrice"
              control={control}
              errors={errors}
              placeholder="Enter price"
              size="large"
              isrequired
              rules={{
                required: "Price is required",
                validate: (v: string) =>
                  (parseFloat(v) > 0 && !isNaN(parseFloat(v))) ||
                  "Enter a valid price",
              }}
            />
            {selectedProduct && !isNaN(priceNum) && priceNum > 0 && (
              <div className="flex items-center gap-2 text-[11px] mt-1 px-2 py-1.5 rounded-lg bg-slate-50">
                <span className="text-slate-400">
                  Base: ₹{selectedProduct.basePrice}
                </span>
                <span className="text-slate-300">→</span>
                {discount > 0 ? (
                  <span className="text-emerald-600 font-semibold">
                    Saving ₹{discount} (
                    {Math.round((discount / selectedProduct.basePrice) * 100)}%
                    off)
                  </span>
                ) : discount < 0 ? (
                  <span className="text-orange-500 font-semibold">
                    ₹{Math.abs(discount)} above base
                  </span>
                ) : (
                  <span className="text-slate-500">Same as base</span>
                )}
              </div>
            )}
          </div>

          <Divider className="!my-0 !border-slate-100" />

          <CustomDateRange
            label="Effective Period"
            name="effectiveRange"
            control={control}
            errors={errors}
            placeholder={["Start date", "End date (optional)"]}
            isrequired
            size="large"
            rules={{
              validate: (val: [Dayjs | null, Dayjs | null]) =>
                (val && val[0] !== null) || "Start date is required",
            }}
          />
        </form>
      </CustomModal>
    </div>
  );
};

export default PricingTable;
