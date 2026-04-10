import React, { useState, useMemo, useCallback } from "react";
import { useForm } from "react-hook-form";
import { Button, Table, Tooltip, Dropdown } from "antd";
import type { ColumnsType } from "antd/es/table";
import type { MenuProps } from "antd";
import {
  HiOutlinePlus,
  HiOutlineDownload,
  HiOutlineTrash,
  HiOutlineClipboardList,
  HiOutlineBell,
  HiOutlineCube,
  HiOutlineTag,
  HiOutlineEye,
  HiOutlinePencil,
  HiOutlineDotsVertical,
} from "react-icons/hi";

import type {
  Product,
  ProductCategory,
  ProductStatus,
  ProductFilterFormValues,
  AlertRule,
  AlertNotification,
} from "../types/Product";
import {
  PAGE_SIZE,
  PRODUCT_STAT_CONFIG,
  CATEGORY_MAP,
  STATUS_MAP,
  UNIT_MAP,
} from "../constants/productConstants";
import {
  DUMMY_PRODUCTS,
  DUMMY_ALERT_RULES,
  DUMMY_NOTIFICATIONS,
} from "../data/productData";
import {
  buildProductStats,
  fmt,
  fmtDate,
  getProductAlertLevel,
} from "../utils/productHelpers";

import ProductModal from "../components/ProductModal";
import ProductFilters from "../components/ProductFilters";
import AlertRuleDrawer from "../components/AlertRuleDrawer";
import StatCard from "../components/StatCard";
import AlertDot from "../components/AlertDot";
import AlertBanner from "../components/alerts/AlertBanner";

const FILTER_DEFAULTS: ProductFilterFormValues = {
  categoryFilter: "all",
  statusFilter: "all",
  dateRange: null,
};

const ProductsPage: React.FC = () => {
  const [products] = useState<Product[]>(DUMMY_PRODUCTS);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const [alertRules, setAlertRules] = useState<AlertRule[]>(DUMMY_ALERT_RULES);
  const [notifications, setNotifications] =
    useState<AlertNotification[]>(DUMMY_NOTIFICATIONS);
  const [alertDrawerOpen, setAlertDrawerOpen] = useState(false);

  const {
    control,
    watch,
    formState: { errors },
  } = useForm<ProductFilterFormValues>({
    defaultValues: FILTER_DEFAULTS,
  });

  const categoryFilter = watch("categoryFilter");
  const statusFilter = watch("statusFilter");
  const dateRange = watch("dateRange");

  // ── Filtered data ──
  const filtered = useMemo(() => {
    let d = products;

    if (categoryFilter && categoryFilter !== "all") {
      d = d.filter((p) => p.category === categoryFilter);
    }
    if (statusFilter && statusFilter !== "all") {
      d = d.filter((p) => p.status === statusFilter);
    }
    if (dateRange?.[0]) {
      const from = dateRange[0].format("YYYY-MM-DD");
      d = d.filter((p) => p.createdAt >= from);
    }
    if (dateRange?.[1]) {
      const to = dateRange[1].format("YYYY-MM-DD");
      d = d.filter((p) => p.createdAt <= to);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      d = d.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.id.toLowerCase().includes(q)
      );
    }

    return d;
  }, [products, search, categoryFilter, statusFilter, dateRange]);

  const stats = useMemo(() => buildProductStats(products), [products]);
  const unreadAlerts = notifications.filter((n) => !n.isRead).length;

  // ── Handlers ──
  const handleOpenCreate = useCallback(() => {
    setEditProduct(null);
    setModalOpen(true);
  }, []);

  const handleEdit = useCallback((product: Product) => {
    setEditProduct(product);
    setModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setModalOpen(false);
    setEditProduct(null);
  }, []);

  const handleDismissNotification = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  }, []);

  const handleDismissAll = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  }, []);

  const getRowActions = useCallback(
    (record: Product): MenuProps["items"] => [
      {
        key: "view",
        icon: <HiOutlineEye size={14} />,
        label: "View Details",
      },
      {
        key: "edit",
        icon: <HiOutlinePencil size={14} />,
        label: "Edit Product",
        onClick: () => handleEdit(record),
      },
      { type: "divider" },
      {
        key: "delete",
        icon: <HiOutlineTrash size={14} />,
        label: "Delete",
        danger: true,
      },
    ],
    [handleEdit]
  );

  // ── Columns ──
  const columns: ColumnsType<Product> = useMemo(
    () => [
      {
        title: "Product",
        key: "product",
        width: 200,
        render: (_, record) => {
          const alertLevel = getProductAlertLevel(record, alertRules);
          return (
            <div className="flex items-center gap-3">
              <div className="relative">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-200 hover:scale-110"
                  style={{
                    background: CATEGORY_MAP[record.category].bg,
                    color: CATEGORY_MAP[record.category].color,
                  }}
                >
                  <HiOutlineCube size={16} />
                </div>
                {alertLevel && (
                  <div className="absolute -top-1 -right-1">
                    <AlertDot severity={alertLevel} />
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[12px] font-semibold text-slate-800 truncate leading-tight">
                  {record.name}
                </p>
                <p className="text-[10px] font-mono text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded w-fit mt-0.5">
                  {record.sku}
                </p>
              </div>
            </div>
          );
        },
      },
      {
        title: "Category",
        dataIndex: "category",
        key: "category",
        width: 120,
        align: "center",
        render: (cat: ProductCategory) => {
          const c = CATEGORY_MAP[cat];
          return (
            <span
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap"
              style={{ background: c.bg, color: c.color }}
            >
              <HiOutlineTag size={10} />
              {c.label}
            </span>
          );
        },
      },
      {
        title: "Price",
        key: "price",
        width: 110,
        align: "center",
        sorter: (a, b) => a.sellingPrice - b.sellingPrice,
        render: (_, r) => (
          <Tooltip
            title={`Margin: ₹${fmt(r.sellingPrice - (r.costPrice || 0))}`}
          >
            <div className="text-center cursor-default">
              <p className="text-[12px] font-bold text-slate-800 font-mono tabular-nums whitespace-nowrap">
                ₹{fmt(r.sellingPrice)}
              </p>
              <p className="text-[10px] text-slate-400 font-mono tabular-nums">
                cost ₹{fmt(r.costPrice || 0)}
              </p>
            </div>
          </Tooltip>
        ),
      },
      {
        title: "Stock",
        dataIndex: "stock",
        key: "stock",
        width: 100,
        align: "center",
        sorter: (a, b) => a.stock - b.stock,
        render: (stock: number, r) => {
          const isLow = stock > 0 && stock <= r.minStock;
          const isOut = stock === 0;
          const ratio =
            r.minStock > 0 ? Math.min((stock / r.minStock) * 100, 100) : 100;

          const tooltipText = isOut
            ? "Out of stock — needs immediate restocking"
            : isLow
            ? `Below minimum (${r.minStock}) — reorder needed`
            : `${stock} in stock (min: ${r.minStock})`;

          const textColor = isOut
            ? "text-red-600"
            : isLow
            ? "text-amber-600"
            : "text-slate-700";

          const barColor = isOut
            ? "bg-red-500"
            : isLow
            ? "bg-amber-400"
            : "bg-emerald-400";

          return (
            <Tooltip title={tooltipText}>
              <div className="flex flex-col items-center gap-1 cursor-default">
                <span
                  className={`text-[13px] font-bold font-mono tabular-nums ${textColor}`}
                >
                  {stock}
                  <span className="text-[9px] font-normal text-slate-400 ml-0.5">
                    {UNIT_MAP[r.unit]?.slice(0, 3).toLowerCase()}
                  </span>
                </span>
                <div className="w-10 h-[3px] bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${barColor}`}
                    style={{ width: `${isOut ? 0 : ratio}%` }}
                  />
                </div>
              </div>
            </Tooltip>
          );
        },
      },
      {
        title: "GST",
        dataIndex: "gstRate",
        key: "gst",
        width: 60,
        align: "center",
        render: (v: number) => (
          <span className="text-[11px] text-slate-400 font-mono tabular-nums">
            {v}%
          </span>
        ),
      },
      {
        title: "Status",
        dataIndex: "status",
        key: "status",
        width: 120,
        align: "center",
        filters: [
          { text: "Active", value: "active" },
          { text: "Out of Stock", value: "out_of_stock" },
          { text: "Inactive", value: "inactive" },
        ],
        onFilter: (value, record) => record.status === value,
        render: (status: ProductStatus) => {
          const s = STATUS_MAP[status];
          return (
            <span
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap"
              style={{ background: s.bg, color: s.color }}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${s.dot} ${
                  status === "out_of_stock" ? "animate-pulse" : ""
                }`}
              />
              {s.label}
            </span>
          );
        },
      },
      {
        title: "Added",
        dataIndex: "createdAt",
        key: "createdAt",
        width: 100,
        align: "center",
        sorter: (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
        render: (d: string) => (
          <span className="text-[11px] text-slate-500 font-mono tabular-nums whitespace-nowrap">
            {fmtDate(d)}
          </span>
        ),
      },
      {
        title: "",
        key: "actions",
        width: 48,
        align: "center",
        render: (_, record) => (
          <Dropdown
            menu={{ items: getRowActions(record) }}
            trigger={["click"]}
            placement="bottomRight"
          >
            <button
              className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <HiOutlineDotsVertical size={14} />
            </button>
          </Dropdown>
        ),
      },
    ],
    [alertRules, getRowActions]
  );

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold text-slate-800 tracking-tight">
            Products
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage inventory, pricing, and stock alerts
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Tooltip title="Configure stock alerts & notifications">
            <Button
              icon={<HiOutlineBell size={15} />}
              onClick={() => setAlertDrawerOpen(true)}
              className="relative !rounded-xl !h-9"
            >
              Alerts
              {unreadAlerts > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center ring-2 ring-white">
                  {unreadAlerts}
                </span>
              )}
            </Button>
          </Tooltip>
          <Button
            icon={<HiOutlineDownload size={15} />}
            className="!rounded-xl !h-9"
          >
            Export
          </Button>
          <Tooltip title="Add a new product to inventory">
            <Button
              type="primary"
              icon={<HiOutlinePlus size={15} />}
              onClick={handleOpenCreate}
              className="!bg-blue-600 hover:!bg-blue-700 !rounded-xl !h-9 !font-semibold !shadow-sm !shadow-blue-200"
            >
              Add Product
            </Button>
          </Tooltip>
        </div>
      </div>

      {/* Alert Banner */}
      <AlertBanner
        notifications={notifications}
        onDismiss={handleDismissNotification}
        onDismissAll={handleDismissAll}
      />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {PRODUCT_STAT_CONFIG.map((s) => (
          <StatCard
            key={s.key}
            icon={s.icon}
            label={s.label}
            value={stats[s.key]}
            color={s.color}
            bg={s.bg}
            tooltip={s.tooltip}
            alert={s.alertWhenPositive && stats[s.key] > 0}
          />
        ))}
      </div>

      {/* Toolbar + Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm shadow-slate-100/50 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center">
              <HiOutlineClipboardList size={15} className="text-blue-500" />
            </div>
            <div>
              <h3 className="text-[13px] font-bold text-slate-800 leading-tight">
                Product Inventory
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {filtered.length} of {products.length} products
              </p>
            </div>
          </div>
          {selectedRowKeys.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-slate-500 font-medium">
                {selectedRowKeys.length} selected
              </span>
              <Button
                size="small"
                danger
                icon={<HiOutlineTrash size={12} />}
                className="!rounded-lg"
              >
                Delete
              </Button>
              <Button
                size="small"
                onClick={() => setSelectedRowKeys([])}
                className="!rounded-lg"
              >
                Clear
              </Button>
            </div>
          )}
        </div>

        <ProductFilters
          search={search}
          onSearchChange={setSearch}
          control={control}
          errors={errors}
        />

        <Table<Product>
          columns={columns}
          dataSource={filtered}
          rowKey="id"
          size="middle"
          tableLayout="fixed"
          rowSelection={{
            selectedRowKeys,
            onChange: (keys) => setSelectedRowKeys(keys),
          }}
          pagination={{
            pageSize: PAGE_SIZE,
            showSizeChanger: true,
            pageSizeOptions: ["10", "20", "50"],
            showTotal: (total, range) => (
              <span className="text-[11px] text-slate-400">
                Showing {range[0]}–{range[1]} of {total} products
              </span>
            ),
          }}
          onRow={(record) => ({
            onClick: () => handleEdit(record),
            className: "cursor-pointer",
          })}
          className="product-table"
        />
      </div>

      {/* Modals & Drawers */}
      <ProductModal
        open={modalOpen}
        onClose={handleCloseModal}
        onSuccess={handleCloseModal}
        isEdit={!!editProduct}
        defaultValues={
          editProduct
            ? {
                name: editProduct.name,
                sku: editProduct.sku,
                category: editProduct.category,
                unit: editProduct.unit,
                basePrice: editProduct.basePrice,
                gstRate: editProduct.gstRate,
                costPrice: editProduct.costPrice,
                stock: editProduct.stock,
                minStock: editProduct.minStock,
                hsn: editProduct.hsn,
                description: editProduct.description,
              }
            : undefined
        }
      />

      <AlertRuleDrawer
        open={alertDrawerOpen}
        onClose={() => setAlertDrawerOpen(false)}
        rules={alertRules}
        onUpdateRules={setAlertRules}
      />
    </div>
  );
};

export default ProductsPage;
