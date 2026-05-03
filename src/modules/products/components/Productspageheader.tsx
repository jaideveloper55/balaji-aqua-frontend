import React from "react";
import { Button, Tooltip } from "antd";
import {
  HiOutlinePlus,
  HiOutlineDownload,
  HiOutlineBell,
  HiOutlineSparkles,
} from "react-icons/hi";

interface ProductsPageHeaderProps {
  activeTab: "products" | "categories";
  unreadAlerts: number;
  onAlertsClick: () => void;
  onExportClick?: () => void;
  onPrimaryAdd: () => void;
}

const ProductsPageHeader: React.FC<ProductsPageHeaderProps> = ({
  activeTab,
  unreadAlerts,
  onAlertsClick,
  onExportClick,
  onPrimaryAdd,
}) => {
  const isProducts = activeTab === "products";

  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      {/* Title */}
      <div className="flex items-start gap-3">
        <div className="w-11 h-11 rounded-xl bg-blue-500 flex items-center justify-center">
          <HiOutlineSparkles className="text-white" size={20} />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight leading-tight">
            Inventory Hub
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage products, categories, pricing & stock alerts
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <Tooltip title="Configure stock alerts & notifications">
          <Button
            icon={<HiOutlineBell size={15} />}
            onClick={onAlertsClick}
            className="!relative !rounded-xl !h-9 !border-slate-200 hover:!border-blue-300 hover:!text-blue-600 transition-all"
          >
            Alerts
            {unreadAlerts > 0 && (
              <span className="absolute -top-1.5 -right-1.5 min-w-5 h-5 px-1 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center ring-2 ring-white shadow-sm">
                {unreadAlerts}
              </span>
            )}
          </Button>
        </Tooltip>

        <Button
          icon={<HiOutlineDownload size={15} />}
          onClick={onExportClick}
          className="!rounded-xl !h-9 !border-slate-200 hover:!border-blue-300 hover:!text-blue-600 transition-all"
        >
          Export
        </Button>

        <Tooltip
          title={
            isProducts ? "Add a new product to inventory" : "Add a new category"
          }
        >
          <Button
            type="primary"
            icon={<HiOutlinePlus size={15} />}
            onClick={onPrimaryAdd}
            className="!bg-blue-600 hover:!bg-blue-700 !rounded-xl !h-9 !font-semibold !shadow-md !shadow-blue-500/25 !border-0"
          >
            {isProducts ? "Add Product" : "Add Category"}
          </Button>
        </Tooltip>
      </div>
    </div>
  );
};

export default ProductsPageHeader;
