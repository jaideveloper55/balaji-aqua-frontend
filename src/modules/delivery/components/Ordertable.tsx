import { Table, Tooltip } from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  HiOutlineClock,
  HiOutlineLocationMarker,
  HiOutlinePhone,
} from "react-icons/hi";
import dayjs from "dayjs";
import {
  dayLabel,
  formatINR,
  initials,
  isOverdue,
  todayIST,
} from "../constants/Orderconstants";
import type { DeliveryBoy, Order } from "../types/Orders";
import Assigndropdown from "./Assigndropdown";
import Orderactionsmenu from "./Orderactionsmenu";
import Orderstatusbadge from "./Orderstatusbadge";

interface Props {
  orders: Order[];
  loading: boolean;
  boys: DeliveryBoy[];
  page: number;
  pageSize: number;
  total: number;
  assigningId?: string | null;
  hasFilters: boolean;
  onPageChange: (page: number, pageSize: number) => void;
  onEdit: (order: Order) => void;
  onCancel: (order: Order) => void;
  onAssign: (order: Order, boyId: string | null) => void;
  onCreate: () => void;
  onClearFilters: () => void;
}

function dayChip(order: Order): string {
  if (isOverdue(order)) return "bg-red-50 text-red-700";
  if (order.deliveryDate === todayIST()) return "bg-blue-50 text-blue-700";
  return "bg-slate-100 text-slate-600";
}

const Ordertable = ({
  orders,
  loading,
  boys,
  page,
  pageSize,
  total,
  assigningId,
  hasFilters,
  onPageChange,
  onEdit,
  onCancel,
  onAssign,
  onCreate,
  onClearFilters,
}: Props) => {
  const columns: ColumnsType<Order> = [
    {
      title: "Order",
      key: "order",
      width: 150,
      render: (_, o) => (
        <div className="flex flex-col gap-1">
          <span className="w-fit whitespace-nowrap rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 font-mono text-xs font-semibold text-slate-700">
            {o.orderNo}
          </span>
          <span className="whitespace-nowrap text-xs text-slate-400">
            {dayjs(o.createdAt).format("D MMM, h:mm A")}
          </span>
        </div>
      ),
    },
    {
      title: "Customer",
      key: "customer",
      width: 250,
      render: (_, o) => (
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-sm font-bold text-white">
            {initials(o.customer.name)}
          </div>
          <div className="min-w-0">
            <div className="truncate font-semibold text-slate-900">
              {o.customer.name}
            </div>
            <div className="mt-0.5 flex items-center gap-3 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <HiOutlinePhone className="h-3.5 w-3.5" />
                {o.customer.phone}
              </span>
              {o.customer.area && (
                <span className="flex min-w-0 items-center gap-1">
                  <HiOutlineLocationMarker className="h-3.5 w-3.5 shrink-0" />
                  <span className="truncate">{o.customer.area}</span>
                </span>
              )}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Items",
      key: "items",
      width: 230,
      render: (_, o) => {
        const units = o.items.reduce((sum, i) => sum + i.qty, 0);
        return (
          // hover shows every line, the cell itself stays one tidy line
          <Tooltip
            placement="topLeft"
            title={
              <div className="space-y-0.5">
                {o.items.map((i) => (
                  <div key={i.productId}>
                    {i.qty} × {i.name}
                  </div>
                ))}
                {o.note && (
                  <div className="mt-1 border-t border-white/20 pt-1 italic">
                    “{o.note}”
                  </div>
                )}
              </div>
            }
          >
            <div>
              <div className="truncate text-sm font-medium text-slate-800">
                {o.itemsSummary}
              </div>
              <div className="mt-0.5 text-xs text-slate-400">
                {units} {units === 1 ? "unit" : "units"}
                {o.note ? " · has a note" : ""}
              </div>
            </div>
          </Tooltip>
        );
      },
    },
    {
      title: "Delivery",
      key: "delivery",
      width: 175,
      render: (_, o) => (
        <div className="flex flex-col items-start gap-1">
          <span
            className={`rounded-md px-2 py-0.5 text-xs font-semibold ${dayChip(
              o
            )}`}
          >
            {dayLabel(o.deliveryDate)}
          </span>
          <span className="flex items-center gap-1 whitespace-nowrap text-xs text-slate-500">
            <HiOutlineClock className="h-3.5 w-3.5" />
            {o.slot ?? "Any time"}
          </span>
        </div>
      ),
    },
    {
      title: "Delivery boy",
      key: "boy",
      width: 190,
      render: (_, o) => (
        <Assigndropdown
          order={o}
          boys={boys}
          saving={assigningId === o.id}
          onAssign={onAssign}
        />
      ),
    },
    {
      title: "Status",
      key: "status",
      align: "center",
      width: 130,
      render: (_, o) => {
        const badge = (
          <Orderstatusbadge status={o.status} overdue={isOverdue(o)} />
        );
        // a cancelled order explains itself on hover
        return o.status === "CANCELLED" && o.cancelReason ? (
          <Tooltip title={`Reason: ${o.cancelReason}`}>{badge}</Tooltip>
        ) : (
          badge
        );
      },
    },
    {
      title: "Bill",
      key: "bill",
      align: "right",
      width: 140,
      render: (_, o) =>
        o.bill ? (
          <div className="text-right">
            <div className="whitespace-nowrap font-bold text-slate-900">
              {formatINR(o.bill.amount)}
            </div>
            <div className="whitespace-nowrap font-mono text-[11px] text-slate-400">
              {o.bill.invoiceNo}
            </div>
          </div>
        ) : (
          <span className="text-slate-300">—</span>
        ),
    },
    {
      title: "",
      key: "actions",
      width: 56,
      align: "center",
      render: (_, o) => (
        <Orderactionsmenu order={o} onEdit={onEdit} onCancel={onCancel} />
      ),
    },
  ];

  return (
    <Table<Order>
      rowKey="id"
      columns={columns}
      dataSource={orders}
      loading={loading}
      scroll={{ x: 1100 }}
      rowClassName={(o) => (isOverdue(o) ? "bg-red-50/40" : "")}
      pagination={{
        current: page,
        pageSize,
        total,
        showSizeChanger: true,
        pageSizeOptions: [10, 20, 50],
        showTotal: (t, [from, to]) => `${from}–${to} of ${t} orders`,
        onChange: onPageChange,
      }}
      locale={{
        // A friendly empty state beats an empty grid: say why, and offer the next step.
        emptyText: (
          <div className="py-10">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-2xl">
              📦
            </div>
            <div className="text-base font-semibold text-slate-800">
              {hasFilters ? "No orders match these filters" : "No orders yet"}
            </div>
            <div className="mx-auto mt-1 max-w-sm text-sm text-slate-500">
              {hasFilters
                ? "Try another day or delivery boy, or clear the filters to see every order."
                : "Create the first delivery order and assign it to a delivery boy."}
            </div>
            <div className="mt-4 flex items-center justify-center gap-2">
              {hasFilters && (
                <button
                  type="button"
                  onClick={onClearFilters}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Clear filters
                </button>
              )}
              <button
                type="button"
                onClick={onCreate}
                className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
              >
                + New Order
              </button>
            </div>
          </div>
        ),
      }}
    />
  );
};

export default Ordertable;
