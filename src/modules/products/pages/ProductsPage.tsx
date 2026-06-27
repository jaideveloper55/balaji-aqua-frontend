import React, {
  useState,
  useMemo,
  useCallback,
  useRef,
  useEffect,
} from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import {
  HiOutlineBell,
  HiOutlineCube,
  HiOutlineDownload,
  HiOutlinePlus,
  HiOutlineSparkles,
  HiOutlineTag,
} from "react-icons/hi";
import { Button } from "antd";
import type { ExportableProduct } from "../utils/Productgenerators";
import type {
  ProductFilterFormValues,
  Product,
  ProductStatus,
} from "../types/Product";
import { PRODUCT_STAT_CONFIG } from "../constants/productConstants";
import ProductModal, { ProductModalMode } from "../components/ProductModal";
import AlertBanner from "../components/alerts/AlertBanner";
import CustomTabs from "../../../components/common/CustomTabs";
import CategoryManager, {
  CategoryManagerHandle,
} from "../components/Categorymanager";
import DeleteConfirmModal from "../components/Deleteconfirmmodal";
import CustomStatCard from "../../../components/common/CustomStatCard";
import CustomPageHeader from "../../../components/common/CustomPageHeader";
import {
  errorNotification,
  successNotification,
} from "../../../components/common/Notification";
import {
  getProductsApi,
  getProductStatsApi,
  getProductAlertsApi,
  deleteProductApi,
  deleteProductsApi,
  updateProductApi,
} from "../api/Products.api";
import ProductExportDrawer from "../components/Productexportdrawer";
import ProductTable from "../components/ProductTable";

const FILTER_DEFAULTS: ProductFilterFormValues = {
  categoryFilter: "all",
  statusFilter: "all",
  dateRange: null,
};

type TabKey = "products" | "categories";

const TABS = [
  { key: "products", label: "Products", icon: <HiOutlineCube size={14} /> },
  { key: "categories", label: "Categories", icon: <HiOutlineTag size={14} /> },
];

const PAGE_SIZE = 10;

const ProductsPage = () => {
  const queryClient = useQueryClient();

  const [search] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZE);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<ProductModalMode>("create");
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [activeTab, setActiveTab] = useState<TabKey>("products");
  const [dismissedAlerts, setDismissedAlerts] = useState<string[]>([]);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);
  const categoryManagerRef = useRef<CategoryManagerHandle>(null);

  const { watch } = useForm<ProductFilterFormValues>({
    defaultValues: FILTER_DEFAULTS,
  });

  const categoryFilter = watch("categoryFilter");
  const statusFilter = watch("statusFilter");
  const dateRange = watch("dateRange");

  const queryParams = useMemo(
    () => ({
      search: search.trim() || undefined,
      categoryId:
        categoryFilter && categoryFilter !== "all" ? categoryFilter : undefined,
      status:
        statusFilter && statusFilter !== "all"
          ? (statusFilter as ProductStatus)
          : undefined,
      dateFrom: dateRange?.[0]?.format("YYYY-MM-DD"),
      dateTo: dateRange?.[1]?.format("YYYY-MM-DD"),
      page,
      pageSize,
      sortBy: "createdAt" as const,
      sortOrder: "desc" as const,
    }),
    [search, categoryFilter, statusFilter, dateRange, page, pageSize]
  );

  const { data: productsData, isLoading: isLoadingProducts } = useQuery({
    queryKey: ["getProducts", queryParams],
    queryFn: () => getProductsApi(queryParams).then((res) => res.data),
    staleTime: 1000 * 30,
  });

  const { data: statsData } = useQuery({
    queryKey: ["getProductStats"],
    queryFn: () => getProductStatsApi().then((res) => res.data),
    staleTime: 1000 * 60,
  });

  const { data: alertsData } = useQuery({
    queryKey: ["getProductAlerts"],
    queryFn: () => getProductAlertsApi().then((res) => res.data),
    staleTime: 1000 * 60,
  });

  const deleteMutation = useMutation({
    mutationKey: ["deleteProduct"],
    mutationFn: (id: string) => deleteProductApi(id).then((res) => res.data),
    onSuccess: () => {
      successNotification("Deleted", "Product removed");
      queryClient.invalidateQueries({ queryKey: ["getProducts"] });
      queryClient.invalidateQueries({ queryKey: ["getProductStats"] });
      queryClient.invalidateQueries({ queryKey: ["getProductAlerts"] });
      setDeleteTarget(null);
    },
    onError: (err: any) =>
      errorNotification(
        "Delete Failed",
        err?.message ?? "Could not delete product"
      ),
  });

  const toggleSellableMutation = useMutation({
    mutationFn: ({ id, isSellable }: { id: string; isSellable: boolean }) =>
      updateProductApi(id, { isSellable }).then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getProducts"] });
      queryClient.invalidateQueries({ queryKey: ["billing-pos-products"] });
      queryClient.invalidateQueries({ queryKey: ["inventory-stock"] });
      successNotification("Updated", "Sellable status changed");
    },
    onError: () => errorNotification("Error", "Could not update product"),
  });

  const bulkDeleteMutation = useMutation({
    mutationKey: ["deleteProducts"],
    mutationFn: (ids: string[]) =>
      deleteProductsApi(ids).then((res) => res.data),
    onSuccess: () => {
      successNotification(
        "Deleted",
        `${selectedRowKeys.length} products removed`
      );
      queryClient.invalidateQueries({ queryKey: ["getProducts"] });
      queryClient.invalidateQueries({ queryKey: ["getProductStats"] });
      setSelectedRowKeys([]);
      setBulkDeleteOpen(false);
    },
    onError: (err: any) =>
      errorNotification(
        "Bulk Delete Failed",
        err?.message ?? "Could not delete products"
      ),
  });

  const products: Product[] = productsData?.data ?? [];
  const totalProducts: number = productsData?.meta?.total ?? 0;
  const stats = statsData ?? {
    total: 0,
    active: 0,
    outOfStock: 0,
    lowStock: 0,
  };
  const alerts: any[] = Array.isArray(alertsData)
    ? alertsData
    : alertsData?.data ?? [];
  const visibleAlerts = alerts.filter(
    (a) => !dismissedAlerts.includes(a.productId)
  );

  const handleView = useCallback((product: Product) => {
    setActiveProduct(product);
    setModalMode("view");
    setModalOpen(true);
  }, []);

  const handleEdit = useCallback((product: Product) => {
    setActiveProduct(product);
    setModalMode("edit");
    setModalOpen(true);
  }, []);

  const handleOpenCreateProduct = useCallback(() => {
    setActiveProduct(null);
    setModalMode("create");
    setModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setModalOpen(false);
    setActiveProduct(null);
    setModalMode("create");
  }, []);

  const handleSwitchToEdit = useCallback(() => setModalMode("edit"), []);

  const handleDelete = useCallback((product: Product) => {
    setDeleteTarget(product);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (!deleteTarget) return;
    await deleteMutation.mutateAsync(deleteTarget.id);
  }, [deleteTarget, deleteMutation]);

  const handleCloseDelete = useCallback(() => setDeleteTarget(null), []);

  const handleConfirmBulkDelete = useCallback(async () => {
    await bulkDeleteMutation.mutateAsync(selectedRowKeys as string[]);
  }, [selectedRowKeys, bulkDeleteMutation]);

  const handleOpenCreateCategory = useCallback(() => {
    if (activeTab !== "categories") setActiveTab("categories");
    requestAnimationFrame(() => {
      categoryManagerRef.current?.openCreate();
    });
  }, [activeTab]);

  const handlePrimaryAdd = useCallback(() => {
    if (activeTab === "products") handleOpenCreateProduct();
    else handleOpenCreateCategory();
  }, [activeTab, handleOpenCreateProduct, handleOpenCreateCategory]);

  const handleDismissAlert = useCallback((productId: string) => {
    setDismissedAlerts((prev) => [...prev, productId]);
  }, []);

  const handleDismissAll = useCallback(() => {
    setDismissedAlerts(alerts.map((a) => a.productId));
  }, [alerts]);

  const handleAlertClick = useCallback(
    (productId: string) => {
      const product = products.find((p) => p.id === productId);
      if (product) handleView(product);
    },
    [products, handleView]
  );

  const handlePageChange = useCallback(
    (newPage: number, newPageSize: number) => {
      setPage(newPage);
      setPageSize(newPageSize);
    },
    []
  );

  useEffect(() => {
    setPage(1);
  }, [search, categoryFilter, statusFilter, dateRange]);

  const [exportOpen, setExportOpen] = useState(false);

  const toExportable = useCallback(
    (): ExportableProduct[] =>
      products.map((p) => ({
        id: p.id,
        name: p.name,
        sku: p.sku,
        categoryName:
          (p as any).category?.name ?? (p as any).categoryName ?? "",
        categoryColor:
          (p as any).category?.color ?? (p as any).categoryColor ?? "",
        unit: p.unit,
        basePrice: p.basePrice,
        costPrice: p.costPrice,
        gstRate: p.gstRate,
        stock: p.stock,
        minStock: p.minStock,
        status: p.status,
        hsn: (p as any).hsn ?? "",
        createdAt: (p as any).createdAt,
      })),
    [products]
  );

  return (
    <div className="flex flex-col gap-6">
      <CustomPageHeader
        icon={<HiOutlineSparkles className="text-white" size={20} />}
        title="Product Management"
        subtitle="Manage products, categories, pricing & stock alerts"
        iconBg="bg-blue-500"
        actions={
          <>
            <Button
              icon={<HiOutlineBell size={15} />}
              className="!rounded-xl !h-9"
            >
              Alerts{visibleAlerts.length ? ` (${visibleAlerts.length})` : ""}
            </Button>
            <Button
              icon={<HiOutlineDownload size={15} />}
              onClick={() => setExportOpen(true)}
              className="!rounded-xl !h-9"
            >
              Export
            </Button>
            <Button
              type="primary"
              icon={<HiOutlinePlus size={15} />}
              onClick={handlePrimaryAdd}
              className="!bg-blue-600 hover:!bg-blue-700 !rounded-xl !h-9 !font-semibold"
            >
              {activeTab === "products" ? "Add Product" : "Add Category"}
            </Button>
          </>
        }
      />

      <AlertBanner
        alerts={visibleAlerts}
        onDismiss={handleDismissAlert}
        onDismissAll={handleDismissAll}
        onAlertClick={handleAlertClick}
      />

      {activeTab === "products" && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {PRODUCT_STAT_CONFIG.map((s) => {
            const valueMap: Record<string, number> = {
              total: stats.total,
              active: stats.active,
              outOfStock: stats.outOfStock,
              lowStock: stats.lowStock,
            };
            const value = valueMap[s.key] ?? 0;
            return (
              <CustomStatCard
                key={s.key}
                icon={s.icon}
                label={s.label}
                value={isLoadingProducts ? "—" : value}
                color={s.color}
                bg={s.bg}
                tooltip={s.tooltip}
                alert={s.alertWhenPositive && value > 0}
              />
            );
          })}
        </div>
      )}

      <div className="max-w-md">
        <CustomTabs
          items={TABS}
          activeKey={activeTab}
          onChange={(k) => setActiveTab(k as TabKey)}
          accentColor="#2563eb"
        />
      </div>

      {activeTab === "products" ? (
        <ProductTable
          products={products}
          totalProducts={totalProducts}
          isLoading={isLoadingProducts}
          page={page}
          pageSize={pageSize}
          selectedRowKeys={selectedRowKeys}
          onSelectionChange={setSelectedRowKeys}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onToggleSellable={(product, val) =>
            toggleSellableMutation.mutate({ id: product.id, isSellable: val })
          }
          onPageChange={handlePageChange}
        />
      ) : (
        <CategoryManager ref={categoryManagerRef} />
      )}

      <ProductModal
        open={modalOpen}
        onClose={handleCloseModal}
        onSuccess={handleCloseModal}
        mode={modalMode}
        editId={activeProduct?.id}
        onSwitchToEdit={handleSwitchToEdit}
        defaultValues={
          activeProduct
            ? {
                name: activeProduct.name,
                sku: activeProduct.sku,
                categoryId: activeProduct.categoryId,
                unit: activeProduct.unit,
                basePrice: String(activeProduct.basePrice),
                gstRate: activeProduct.gstRate,
                costPrice: String(activeProduct.costPrice),
                stock: String(activeProduct.stock),
                minStock: String(activeProduct.minStock),
                hsn: activeProduct.hsn || "",
                description: activeProduct.description || "",
              }
            : undefined
        }
      />

      <DeleteConfirmModal
        open={!!deleteTarget}
        onClose={handleCloseDelete}
        onConfirm={handleConfirmDelete}
        loading={deleteMutation.isPending}
        itemType="Product"
        itemName={deleteTarget?.name || ""}
        details={
          deleteTarget
            ? [
                { label: "SKU", value: deleteTarget.sku, mono: true },
                {
                  label: "Stock",
                  value: `${
                    deleteTarget.stock
                  } ${deleteTarget.unit.toLowerCase()}`,
                },
                {
                  label: "Price",
                  value: `₹${deleteTarget.basePrice}`,
                  mono: true,
                },
              ]
            : []
        }
        warningMessage="This product will be permanently removed from your inventory. Any sales records, orders, or analytics referencing it may be affected."
      />

      <DeleteConfirmModal
        open={bulkDeleteOpen}
        onClose={() => setBulkDeleteOpen(false)}
        onConfirm={handleConfirmBulkDelete}
        loading={bulkDeleteMutation.isPending}
        itemType="Products"
        itemName={`${selectedRowKeys.length} selected products`}
        confirmLabel={`Delete ${selectedRowKeys.length} Products`}
        warningMessage={`All ${selectedRowKeys.length} selected products will be permanently removed from your inventory. This affects related sales records and analytics.`}
      />
      <ProductExportDrawer
        open={exportOpen}
        onClose={() => setExportOpen(false)}
        products={toExportable()}
        productCount={totalProducts}
      />
    </div>
  );
};

export default ProductsPage;
