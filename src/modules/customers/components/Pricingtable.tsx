import React, { useState, useEffect, useCallback } from "react";
import {
  Table,
  Button,
  Modal,
  message,
  Popconfirm,
  Tooltip,
  Divider,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  HiOutlineTag,
  HiOutlinePlus,
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlineX,
} from "react-icons/hi";
import dayjs, { Dayjs } from "dayjs";
import { useForm } from "react-hook-form";
import { customerApi } from "../services/Customer.api";
import type {
  CustomerPricing,
  CustomerPricingFormValues,
  Product,
} from "../types/Customer";
import CustomInput from "../../../components/common/CustomInput";
import CustomSelect from "../../../components/common/CustomSelect";
import CustomDateRange from "../../../components/common/CustomDateRange";

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

const PricingTable: React.FC<PricingTableProps> = ({ customerId }) => {
  const [data, setData] = useState<CustomerPricing[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<PricingFormValues>({
    defaultValues: DEFAULT_FORM_VALUES,
  });

  const productId = watch("productId");
  const customerPrice = watch("customerPrice");

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [pricing, prods] = await Promise.all([
        customerApi.getCustomerPricing(customerId),
        customerApi.getProducts(),
      ]);
      setData(pricing);
      setProducts(prods);
    } finally {
      setLoading(false);
    }
  }, [customerId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

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

  const onSubmit = async (values: PricingFormValues) => {
    const [from, to] = values.effectiveRange;
    if (!from) {
      message.warning("Please select a start date");
      return;
    }
    const price = parseFloat(values.customerPrice);
    if (isNaN(price) || price <= 0) {
      message.warning("Enter a valid price");
      return;
    }

    setSaving(true);
    try {
      const payload: CustomerPricingFormValues = {
        productId: values.productId,
        customerPrice: price,
        effectiveFrom: from.format("YYYY-MM-DD"),
        effectiveTo: to?.format("YYYY-MM-DD"),
      };
      if (editingId) {
        await customerApi.updateCustomerPricing(editingId, payload);
        message.success("Pricing updated");
      } else {
        await customerApi.createCustomerPricing(customerId, payload);
        message.success("Pricing added");
      }
      closeModal();
      fetchData();
    } catch {
      message.error("Failed to save pricing");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await customerApi.deleteCustomerPricing(id);
      message.success("Pricing removed");
      fetchData();
    } catch {
      message.error("Failed to delete");
    }
  };

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

  const columns: ColumnsType<CustomerPricing> = [
    {
      title: "Product",
      key: "product",
      width: 220,
      render: (_, r) => (
        <div className="flex flex-col gap-0.5">
          <span className="text-[13px] font-semibold text-slate-800">
            {r.productName}
          </span>
          <span className="text-[10px] font-mono text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded w-fit">
            {r.sku}
          </span>
        </div>
      ),
    },
    {
      title: "Unit",
      dataIndex: "unit",
      key: "unit",
      align: "center",
      width: 80,
      render: (u: string) => (
        <span className="text-[11px] text-slate-500 capitalize">per {u}</span>
      ),
    },
    {
      title: "Base Price",
      dataIndex: "basePrice",
      key: "basePrice",
      width: 110,
      align: "center",
      render: (v: number) => (
        <span className="text-[13px] text-slate-400 tabular-nums line-through font-mono">
          ₹{v}
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
        const savingAmt = r.basePrice - v;
        return (
          <Tooltip
            title={
              savingAmt > 0
                ? `${Math.round((savingAmt / r.basePrice) * 100)}% discount`
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
            onConfirm={() => handleDelete(r.id)}
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

  return (
    <div className="flex flex-col gap-4">
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
              {data.filter((d) => d.isActive).length} active price rules
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
        loading={loading}
        pagination={false}
        size="middle"
        scroll={{ x: 800 }}
        rowClassName={(r) => (r.isActive ? "" : "opacity-50")}
      />

      <Modal
        open={modalOpen}
        onCancel={closeModal}
        footer={null}
        width={500}
        centered
        destroyOnClose
        closeIcon={<HiOutlineX className="w-5 h-5 text-slate-400" />}
        title={null}
      >
        <div
          className={`flex items-center gap-3.5 mb-5 pl-4 border-l-[3px] ${
            editingId ? "border-l-amber-500" : "border-l-blue-500"
          }`}
        >
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              editingId ? "bg-amber-50" : "bg-blue-50"
            }`}
          >
            {editingId ? (
              <HiOutlinePencil size={20} className="text-amber-600" />
            ) : (
              <HiOutlineTag size={20} className="text-blue-600" />
            )}
          </div>
          <div>
            <h3 className="text-[15px] font-bold text-slate-800">
              {editingId ? "Edit Customer Price" : "Add Customer Price"}
            </h3>
            <p className="text-[11px] text-slate-400">
              Set special pricing for this customer
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-4">
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
        </div>

        <div className="flex items-center justify-between mt-5 pt-4 border-t border-slate-100">
          <p className="text-[10px] text-slate-400">
            Price applies to this customer only
          </p>
          <div className="flex items-center gap-2">
            <Button onClick={closeModal} className="!rounded-lg">
              Cancel
            </Button>
            <Button
              type="primary"
              onClick={handleSubmit(onSubmit)}
              loading={saving}
              className="!bg-blue-600 hover:!bg-blue-700 !rounded-lg !font-semibold !shadow-sm !shadow-blue-200"
            >
              {editingId ? "Update" : "Add Price"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default PricingTable;
