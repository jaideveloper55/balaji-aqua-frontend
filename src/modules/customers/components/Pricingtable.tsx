import React, { useState, useEffect, useCallback } from "react";
import {
  Table,
  Tag,
  Button,
  Modal,
  Input,
  Select,
  DatePicker,
  message,
  Popconfirm,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  HiOutlineTag,
  HiOutlinePlus,
  HiOutlinePencil,
  HiOutlineTrash,
} from "react-icons/hi";
import dayjs from "dayjs";
import { customerApi } from "../services/Customer.api";
import type {
  CustomerPricing,
  CustomerPricingFormValues,
  Product,
} from "../types/Customer";

interface PricingTableProps {
  customerId: string;
}

const PricingTable: React.FC<PricingTableProps> = ({ customerId }) => {
  const [data, setData] = useState<CustomerPricing[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form state
  const [productId, setProductId] = useState<string>("");
  const [customerPrice, setCustomerPrice] = useState<string>("");
  const [effectiveFrom, setEffectiveFrom] = useState<dayjs.Dayjs | null>(
    dayjs(),
  );
  const [effectiveTo, setEffectiveTo] = useState<dayjs.Dayjs | null>(null);

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

  const resetForm = () => {
    setProductId("");
    setCustomerPrice("");
    setEffectiveFrom(dayjs());
    setEffectiveTo(null);
    setEditingId(null);
  };

  const openAdd = () => {
    resetForm();
    setModalOpen(true);
  };

  const openEdit = (record: CustomerPricing) => {
    setEditingId(record.id);
    setProductId(record.productId);
    setCustomerPrice(String(record.customerPrice));
    setEffectiveFrom(dayjs(record.effectiveFrom));
    setEffectiveTo(record.effectiveTo ? dayjs(record.effectiveTo) : null);
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!productId || !customerPrice || !effectiveFrom) {
      message.warning("Please fill all required fields");
      return;
    }

    const price = parseFloat(customerPrice);
    if (isNaN(price) || price <= 0) {
      message.warning("Enter a valid price");
      return;
    }

    setSaving(true);
    try {
      const values: CustomerPricingFormValues = {
        productId,
        customerPrice: price,
        effectiveFrom: effectiveFrom.format("YYYY-MM-DD"),
        effectiveTo: effectiveTo?.format("YYYY-MM-DD"),
      };

      if (editingId) {
        await customerApi.updateCustomerPricing(editingId, values);
        message.success("Pricing updated");
      } else {
        await customerApi.createCustomerPricing(customerId, values);
        message.success("Pricing added");
      }

      setModalOpen(false);
      resetForm();
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

  // Selected product info for the modal
  const selectedProduct = products.find((p) => p.id === productId);
  const priceNum = parseFloat(customerPrice);
  const discount =
    selectedProduct && !isNaN(priceNum)
      ? selectedProduct.basePrice - priceNum
      : 0;

  // Products not yet assigned (for add mode)
  const assignedProductIds = data
    .filter((d) => d.isActive)
    .map((d) => d.productId);
  const availableProducts = editingId
    ? products
    : products.filter((p) => !assignedProductIds.includes(p.id));

  const columns: ColumnsType<CustomerPricing> = [
    {
      title: "Product",
      key: "product",
      width: 220,
      render: (_, r) => (
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-semibold text-slate-800">
            {r.productName}
          </span>
          <span className="text-xs font-mono text-slate-400">{r.sku}</span>
        </div>
      ),
    },
    {
      title: "Unit",
      dataIndex: "unit",
      key: "unit",
      width: 80,
      render: (u: string) => (
        <span className="text-xs text-slate-500 capitalize">per {u}</span>
      ),
    },
    {
      title: "Base Price",
      dataIndex: "basePrice",
      key: "basePrice",
      width: 110,
      align: "right",
      render: (v: number) => (
        <span className="text-sm text-slate-500 tabular-nums line-through">
          ₹{v}
        </span>
      ),
    },
    {
      title: "Customer Price",
      dataIndex: "customerPrice",
      key: "customerPrice",
      width: 130,
      align: "right",
      render: (v: number, r) => {
        const saving = r.basePrice - v;
        return (
          <div className="flex flex-col items-end gap-0.5">
            <span className="text-sm font-bold text-green-600 tabular-nums">
              ₹{v}
            </span>
            {saving > 0 && (
              <span className="text-[10px] font-medium text-green-500">
                -₹{saving} off
              </span>
            )}
          </div>
        );
      },
    },
    {
      title: "Effective",
      key: "effective",
      width: 160,
      render: (_, r) => (
        <span className="text-xs text-slate-500">
          {new Date(r.effectiveFrom).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
          {r.effectiveTo &&
            ` → ${new Date(r.effectiveTo).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}`}
        </span>
      ),
    },
    {
      title: "Status",
      dataIndex: "isActive",
      key: "status",
      width: 80,
      align: "center",
      render: (v: boolean) => (
        <Tag color={v ? "green" : "default"}>{v ? "Active" : "Expired"}</Tag>
      ),
    },
    {
      title: "",
      key: "actions",
      width: 90,
      align: "center",
      render: (_, r) => (
        <div className="flex items-center justify-center gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              openEdit(r);
            }}
            className="p-1.5 rounded-lg hover:bg-blue-50 text-slate-400 hover:text-blue-500 transition-colors"
          >
            <HiOutlinePencil size={14} />
          </button>
          <Popconfirm
            title="Remove this pricing?"
            onConfirm={() => handleDelete(r.id)}
            okText="Yes"
            cancelText="No"
          >
            <button
              onClick={(e) => e.stopPropagation()}
              className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors"
            >
              <HiOutlineTrash size={14} />
            </button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <HiOutlineTag size={16} className="text-blue-500" />
          <h3 className="text-sm font-bold text-slate-800">Customer Pricing</h3>
          <span className="text-xs text-slate-400 ml-1">
            ({data.filter((d) => d.isActive).length} active)
          </span>
        </div>
        <Button
          type="primary"
          icon={<HiOutlinePlus size={14} />}
          onClick={openAdd}
        >
          Add Price
        </Button>
      </div>

      {/* Table */}
      <Table<CustomerPricing>
        columns={columns}
        dataSource={data}
        rowKey="id"
        loading={loading}
        pagination={false}
        size="middle"
        scroll={{ x: 800 }}
        rowClassName={(r) => (r.isActive ? "" : "opacity-50")}
      />

      {/* Add / Edit Modal */}
      <Modal
        title={editingId ? "Edit Customer Price" : "Add Customer Price"}
        open={modalOpen}
        onCancel={() => {
          setModalOpen(false);
          resetForm();
        }}
        onOk={handleSave}
        confirmLoading={saving}
        okText={editingId ? "Update" : "Add"}
        width={480}
        destroyOnClose
      >
        <div className="flex flex-col gap-4 py-2">
          {/* Product Select */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-600">
              Product <span className="text-red-400">*</span>
            </label>
            <Select
              value={productId || undefined}
              onChange={setProductId}
              placeholder="Select a product"
              size="large"
              className="w-full"
              disabled={!!editingId}
              options={availableProducts.map((p) => ({
                value: p.id,
                label: (
                  <div className="flex items-center justify-between w-full">
                    <span>
                      {p.name}{" "}
                      <span className="text-slate-400 text-xs">({p.sku})</span>
                    </span>
                    <span className="text-xs text-slate-500 tabular-nums">
                      ₹{p.basePrice}/{p.unit}
                    </span>
                  </div>
                ),
              }))}
            />
          </div>

          {/* Customer Price */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-600">
              Customer Price (₹) <span className="text-red-400">*</span>
            </label>
            <Input
              value={customerPrice}
              onChange={(e) => setCustomerPrice(e.target.value)}
              placeholder="Enter price"
              size="large"
              type="number"
              min={0}
              prefix={<span className="text-slate-400">₹</span>}
            />
            {selectedProduct && !isNaN(priceNum) && priceNum > 0 && (
              <div className="flex items-center gap-2 text-xs mt-1">
                <span className="text-slate-400">
                  Base: ₹{selectedProduct.basePrice}
                </span>
                <span className="text-slate-300">→</span>
                {discount > 0 ? (
                  <span className="text-green-600 font-semibold">
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

          {/* Date Range */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-600">
                Effective From <span className="text-red-400">*</span>
              </label>
              <DatePicker
                value={effectiveFrom}
                onChange={setEffectiveFrom}
                size="large"
                className="w-full"
                format="DD MMM YYYY"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-600">
                Effective To
              </label>
              <DatePicker
                value={effectiveTo}
                onChange={setEffectiveTo}
                size="large"
                className="w-full"
                format="DD MMM YYYY"
                placeholder="No end date"
              />
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default PricingTable;
