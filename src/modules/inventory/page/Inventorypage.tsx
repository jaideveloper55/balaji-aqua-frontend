import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, message, Spin } from "antd";
import {
  HiOutlineArrowDown,
  HiOutlineArrowUp,
  HiOutlineAdjustments,
  HiOutlineCube,
  HiOutlineBell,
  HiOutlineSwitchHorizontal,
  HiOutlineDownload,
  HiOutlineArchive,
} from "react-icons/hi";

import Inventoryoverview from "../components/Inventoryoverview";
import Inventoryfiltersbar from "../components/Inventoryfiltersbar";
import Productstocktable from "../components/Productstocktable";
import Lowstockalerts from "../components/Lowstockalerts";
import Stockmovementtable from "../components/Stockmovementtable";
import Stockentrymodal from "../components/Stockentrymodal";

import SectionCard from "../components/SectionCard";
import CustomTabs from "../../../components/common/CustomTabs";
import CustomPageHeader from "../../../components/common/CustomPageHeader";

import {
  INVENTORY_TABS,
  InventoryTabKey,
} from "../constants/Inventoryconstants";
import {
  InventoryFilters,
  MovementType,
  StockEntryFormValues,
  StockItem,
} from "../types/Inventory";
import {
  getInventorySummaryApi,
  getStockListApi,
  getLowStockApi,
  getMovementsApi,
  stockInApi,
  stockOutApi,
  adjustStockApi,
  StockListFilters,
  MovementFilters,
  LowStockRow,
} from "../api/inventory.api";
import InventoryExportDrawer from "../components/Inventoryexportdrawer";

const DEFAULT_FILTERS: InventoryFilters = {
  search: "",
  status: "all",
  category: "all",
  dateRange: null,
};

const Inventorypage = () => {
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState<InventoryTabKey>("stock");
  const [filters, setFilters] = useState<InventoryFilters>(DEFAULT_FILTERS);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<MovementType>("stock_in");
  const [modalProduct, setModalProduct] = useState<StockItem | null>(null);

  const [exportOpen, setExportOpen] = useState(false);

  const stockParams: StockListFilters = useMemo(
    () => ({
      search: filters.search || undefined,
      status: filters.status === "all" ? undefined : filters.status,
      categoryId: filters.category === "all" ? undefined : filters.category,
      limit: 100,
    }),
    [filters.search, filters.status, filters.category]
  );

  const movementParams: MovementFilters = useMemo(
    () => ({
      search: filters.search || undefined,
      categoryId: filters.category === "all" ? undefined : filters.category,
      startDate: filters.dateRange?.[0]?.format("YYYY-MM-DD"),
      endDate: filters.dateRange?.[1]?.format("YYYY-MM-DD"),
      limit: 100,
    }),
    [filters.search, filters.category, filters.dateRange]
  );

  // KPI summary — always loaded (header cards show on every tab)
  const { data: summary } = useQuery({
    queryKey: ["inventory-summary"],
    queryFn: () => getInventorySummaryApi().then((res) => res.data),
    staleTime: 1000 * 60,
  });

  // Stock list — when the Stock tab is active, or when exporting
  const { data: stockData, isLoading: stockLoading } = useQuery({
    queryKey: ["inventory-stock", stockParams],
    queryFn: () => getStockListApi(stockParams).then((res) => res.data),
    enabled: activeTab === "stock" || exportOpen,
    staleTime: 1000 * 30,
  });

  // Low-stock alerts — when the Alerts tab is active, or when exporting
  const { data: lowStockData, isLoading: lowLoading } = useQuery({
    queryKey: ["inventory-low-stock"],
    queryFn: () => getLowStockApi().then((res) => res.data),
    enabled: activeTab === "alerts" || exportOpen,
    staleTime: 1000 * 30,
  });

  // Movement history — when the Movements tab is active, or when exporting
  const { data: movementsData, isLoading: movementsLoading } = useQuery({
    queryKey: ["inventory-movements", movementParams],
    queryFn: () => getMovementsApi(movementParams).then((res) => res.data),
    enabled: activeTab === "movements" || exportOpen,
    staleTime: 1000 * 30,
  });

  /* -------------------------- mutations ---------------------------- */
  // After any stock change these caches are stale -> refetch them all.
  const invalidateAll = () => {
    queryClient.invalidateQueries({ queryKey: ["inventory-stock"] });
    queryClient.invalidateQueries({ queryKey: ["inventory-summary"] });
    queryClient.invalidateQueries({ queryKey: ["inventory-low-stock"] });
    queryClient.invalidateQueries({ queryKey: ["inventory-movements"] });
    // stock changes affect what's sellable in POS too:
    queryClient.invalidateQueries({ queryKey: ["billing-pos-products"] });
  };

  const onMutationError = (err: any) =>
    // Backend throws BadRequestException with a helpful message (e.g.
    // "Only 12 available") - surface it instead of a generic error.
    // authAxios's response interceptor already unwraps to error.response.data
    // on rejection, so the message is directly on the error.
    message.error(err?.message ?? "Could not save the stock entry");

  const stockInMutation = useMutation({
    mutationKey: ["stockIn"],
    mutationFn: (payload: Parameters<typeof stockInApi>[0]) =>
      stockInApi(payload).then((res) => res.data),
    onSuccess: () => {
      invalidateAll();
      message.success("Stock in recorded");
      setModalOpen(false);
    },
    onError: onMutationError,
  });

  const stockOutMutation = useMutation({
    mutationKey: ["stockOut"],
    mutationFn: (payload: Parameters<typeof stockOutApi>[0]) =>
      stockOutApi(payload).then((res) => res.data),
    onSuccess: () => {
      invalidateAll();
      message.success("Stock out recorded");
      setModalOpen(false);
    },
    onError: onMutationError,
  });

  const adjustMutation = useMutation({
    mutationKey: ["adjustStock"],
    mutationFn: (payload: Parameters<typeof adjustStockApi>[0]) =>
      adjustStockApi(payload).then((res) => res.data),
    onSuccess: () => {
      invalidateAll();
      message.success("Adjustment recorded");
      setModalOpen(false);
    },
    onError: onMutationError,
  });

  const saving =
    stockInMutation.isPending ||
    stockOutMutation.isPending ||
    adjustMutation.isPending;

  const stockItems: StockItem[] = stockData?.data ?? [];
  const lowStockItems: LowStockRow[] = lowStockData?.data ?? [];
  const movements = movementsData?.data ?? [];
  const alertCount = lowStockData?.meta.total ?? 0;

  const kpis = useMemo(
    () => ({
      totalStockValue: summary?.totalStockValue ?? 0,
      lowStockItems: summary?.lowStock ?? 0,
      outOfStockItems: summary?.outOfStock ?? 0,
      damagedItems: summary?.damagedItems ?? 0,
      inwardToday: summary?.inwardToday ?? 0,
      outwardToday: summary?.outwardToday ?? 0,
    }),
    [summary]
  );

  const openModal = (mode: MovementType, product: StockItem | null = null) => {
    setModalMode(mode);
    setModalProduct(product);
    setModalOpen(true);
  };

  const handleSubmit = (
    values: StockEntryFormValues & { mode: MovementType }
  ) => {
    const referenceId = values.refId?.trim() || undefined;
    const remarks = values.remarks?.trim() || undefined;
    const quantity = Number(values.qty);
    const common = { productId: values.productId, referenceId, remarks };

    if (values.mode === "stock_in") {
      stockInMutation.mutate({ ...common, quantity, source: values.source });
    } else if (values.mode === "stock_out") {
      stockOutMutation.mutate({ ...common, quantity, source: values.source });
    } else {
      adjustMutation.mutate({ ...common, countedQuantity: quantity });
    }
  };

  const handleKpiNavigate = (tab: InventoryTabKey, statusFilter?: string) => {
    setActiveTab(tab);
    if (statusFilter)
      setFilters((f) => ({
        ...f,
        status: statusFilter as InventoryFilters["status"],
      }));
  };

  return (
    <div className="flex flex-col gap-6 mx-auto">
      <CustomPageHeader
        icon={<HiOutlineArchive className="text-white" size={20} />}
        title="Inventory Management"
        subtitle="Track stock levels, movements & get low-stock alerts"
        iconBg="bg-blue-500"
        actions={
          <>
            <Button
              icon={<HiOutlineDownload size={15} />}
              onClick={() => setExportOpen(true)}
              className="!rounded-xl !h-9"
            >
              Export
            </Button>
            <Button
              icon={<HiOutlineAdjustments size={15} />}
              onClick={() => openModal("adjustment")}
              className="!rounded-xl !h-9 !text-purple-600 !border-purple-200 hover:!bg-purple-50 hover:!border-purple-300"
            >
              Adjust
            </Button>
            <Button
              icon={<HiOutlineArrowUp size={15} />}
              onClick={() => openModal("stock_out")}
              className="!rounded-xl !h-9 !text-red-600 !border-red-200 hover:!bg-red-50 hover:!border-red-300"
            >
              Stock Out
            </Button>
            <Button
              type="primary"
              icon={<HiOutlineArrowDown size={15} />}
              onClick={() => openModal("stock_in")}
              className="!bg-emerald-600 hover:!bg-emerald-700 !rounded-xl !h-9 !font-semibold !border-0 !shadow-sm !shadow-emerald-500/25"
            >
              Stock In
            </Button>
          </>
        }
      />

      {/* KPIs - fed by /inventory/summary */}
      <Inventoryoverview kpis={kpis} onNavigate={handleKpiNavigate} />

      <CustomTabs
        className="max-w-xl"
        items={INVENTORY_TABS.map((t) => ({
          key: t.key,
          label:
            t.key === "alerts" && alertCount > 0
              ? `${t.label} (${alertCount})`
              : t.label,
          icon:
            t.key === "stock" ? (
              <HiOutlineCube size={14} />
            ) : t.key === "alerts" ? (
              <HiOutlineBell size={14} />
            ) : (
              <HiOutlineSwitchHorizontal size={14} />
            ),
        }))}
        activeKey={activeTab}
        onChange={(k) => setActiveTab(k as InventoryTabKey)}
        accentColor={activeTab === "alerts" ? "#dc2626" : "#2563eb"}
      />

      {activeTab === "stock" && (
        <SectionCard
          icon={<HiOutlineCube size={19} />}
          title="Product Stock List"
          subtitle="Current inventory levels across all products"
        >
          <div className="flex flex-col gap-4">
            <Inventoryfiltersbar
              filters={filters}
              onChange={(next) => setFilters((f) => ({ ...f, ...next }))}
              onReset={() => setFilters(DEFAULT_FILTERS)}
              resultCount={stockData?.meta.total ?? stockItems.length}
              categories={[]}
            />
            <Spin spinning={stockLoading}>
              <Productstocktable
                items={stockItems}
                loading={false}
                onQuickAction={(item, mode) => openModal(mode, item)}
              />
            </Spin>
          </div>
        </SectionCard>
      )}

      {activeTab === "alerts" && (
        <SectionCard
          icon={<HiOutlineBell size={19} />}
          iconBg="#fef2f2"
          iconColor="#dc2626"
          title="Low Stock Alerts"
          subtitle={`${alertCount} item${
            alertCount === 1 ? "" : "s"
          } need attention - prevent stockouts`}
          actions={
            (lowStockData?.meta.critical ?? 0) > 0 && (
              <span className="px-2.5 py-1 rounded-lg bg-red-50 text-red-600 text-[11px] font-bold border border-red-100">
                {lowStockData?.meta.critical} Critical
              </span>
            )
          }
        >
          <Spin spinning={lowLoading}>
            <Lowstockalerts
              items={lowStockItems}
              onRestock={(item) => openModal("stock_in", item as StockItem)}
            />
          </Spin>
        </SectionCard>
      )}

      {activeTab === "movements" && (
        <SectionCard
          icon={<HiOutlineSwitchHorizontal size={19} />}
          iconBg="#f5f3ff"
          iconColor="#7c3aed"
          title="Stock Movement History"
          subtitle="Complete audit trail - every IN, OUT & adjustment"
        >
          <div className="flex flex-col gap-4">
            <Inventoryfiltersbar
              filters={filters}
              onChange={(next) => setFilters((f) => ({ ...f, ...next }))}
              onReset={() => setFilters(DEFAULT_FILTERS)}
              showDateRange
              resultCount={movementsData?.meta.total ?? movements.length}
              categories={[]}
            />
            <Spin spinning={movementsLoading}>
              <Stockmovementtable movements={movements} loading={false} />
            </Spin>
          </div>
        </SectionCard>
      )}

      <InventoryExportDrawer
        open={exportOpen}
        onClose={() => setExportOpen(false)}
        defaultReportType={
          activeTab === "alerts"
            ? "alerts"
            : activeTab === "movements"
            ? "movements"
            : "stock"
        }
        stockItems={stockItems}
        lowStockItems={lowStockItems}
        movements={movements}
      />

      <Stockentrymodal
        open={modalOpen}
        mode={modalMode}
        onModeChange={setModalMode}
        items={stockItems}
        initialProduct={modalProduct}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        submitting={saving}
      />
    </div>
  );
};

export default Inventorypage;
