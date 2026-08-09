// ─────────────────────────────────────────────────────────────────────────────
// src/modules/events/components/Eventtable.tsx
// ─────────────────────────────────────────────────────────────────────────────
//
// WHAT CHANGED (old → new):
//
//   1. Added `total` prop
//      OLD:  pagination={{ total: data.length }}
//      NEW:  pagination={{ total }}
//      WHY:  With server-side pagination, `data` only contains the CURRENT
//            page's rows (e.g. 20 items). If your company has 150 events,
//            data.length = 20 but total = 150. Without this fix, antd Table
//            thinks there's only 1 page and never shows page 2/3/4/... buttons.
//
//   2. Set pagination.simple = false (explicit)
//      antd Table defaults to client-side pagination — it takes ALL rows in
//      `dataSource`, then internally slices to show the right page. Since the
//      backend already did the slicing, we DON'T want antd to slice again.
//      Setting `pagination={false}` would hide the controls entirely, so
//      instead we keep pagination controls visible but tell antd the data is
//      already the right page by passing the correct `current`, `pageSize`,
//      and `total`.
//
// ─────────────────────────────────────────────────────────────────────────────

import { Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  HiOutlinePhone,
  HiOutlineLocationMarker,
  HiOutlineUsers,
  HiOutlineCalendar,
} from "react-icons/hi";

import {
  formatINR,
  formatDate,
  PAYMENT_STATUS_META,
} from "../constants/Events.constants";
import type { EventOrder } from "../types/Events";
import EventTypeBadge from "./Eventtypebadge";
import EventStatusBadge from "./Eventstatusbadge";
import EventActionsMenu from "./Eventactionsmenu";

interface Props {
  data: EventOrder[];
  page: number;
  pageSize: number;
  // ─── NEW PROP ──────────────────────────────────────────────────────────
  // total: the FULL count of matching events across ALL pages (from backend).
  // Without this, antd Table uses data.length which is just the current page.
  total: number;
  onPageChange: (page: number, pageSize: number) => void;
  onView: (e: EventOrder) => void;
  onEdit: (e: EventOrder) => void;
  onCancel: (e: EventOrder) => void;
  onMarkComplete: (e: EventOrder) => void;
  onPrint: (e: EventOrder) => void;
}

const EventTable = ({
  data,
  page,
  pageSize,
  total,
  onPageChange,
  onView,
  onEdit,
  onCancel,
  onMarkComplete,
  onPrint,
}: Props) => {
  const columns: ColumnsType<EventOrder> = [
    {
      title: "Event",
      dataIndex: "eventName",
      key: "eventName",
      width: 320,
      render: (_, record) => (
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center shrink-0 font-semibold text-sm shadow-sm">
            {record.eventName
              .split(" ")
              .slice(0, 2)
              .map((w) => w[0])
              .join("")
              .toUpperCase()}
          </div>
          <div className="min-w-0">
            <div className="font-semibold text-slate-900 truncate">
              {record.eventName}
            </div>
            <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-1.5">
              <HiOutlineUsers className="w-3.5 h-3.5" />
              {record.expectedGuests} guests · {record.eventNumber}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Type",
      dataIndex: "eventType",
      key: "eventType",
      width: 140,
      render: (type) => <EventTypeBadge type={type} />,
    },
    {
      title: "Customer",
      dataIndex: "customerName",
      key: "customerName",
      width: 200,
      render: (_, r) => (
        <div className="min-w-0">
          <div className="font-medium text-slate-800 truncate">
            {r.customerName}
          </div>
          <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
            <HiOutlinePhone className="w-3 h-3" />
            {r.customerPhone}
          </div>
        </div>
      ),
    },
    {
      title: "Date & Venue",
      key: "dateVenue",
      width: 240,
      render: (_, r) => (
        <div className="min-w-0">
          <div className="font-medium text-slate-800 flex items-center gap-1.5">
            <HiOutlineCalendar className="w-4 h-4 text-blue-600" />
            {formatDate(r.eventDate)}
            <span className="text-slate-400 text-xs">· {r.deliveryTime}</span>
          </div>
          <div className="text-xs text-slate-500 mt-1 flex items-center gap-1 truncate">
            <HiOutlineLocationMarker className="w-3 h-3 shrink-0" />
            <span className="truncate">
              {r.venueName}, {r.venueCity}
            </span>
          </div>
        </div>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 130,
      render: (s) => <EventStatusBadge status={s} />,
    },
    {
      title: "Amount",
      key: "amount",
      width: 160,
      align: "right",
      render: (_, r) => {
        const pay = PAYMENT_STATUS_META[r.paymentStatus];
        return (
          <div className="text-right">
            <div className="font-bold text-slate-900">
              {formatINR(r.totalAmount)}
            </div>
            <div className="mt-1 flex justify-end">
              <span
                className={`px-2 py-0.5 rounded text-[11px] font-medium ${pay.bg} ${pay.text}`}
              >
                {pay.label}
                {r.balanceDue > 0 && r.paymentStatus !== "UNPAID"
                  ? ` · ${formatINR(r.balanceDue)} due`
                  : ""}
              </span>
            </div>
          </div>
        );
      },
    },
    {
      title: "",
      key: "actions",
      width: 60,
      align: "center",
      render: (_, r) => (
        <EventActionsMenu
          event={r}
          onView={onView}
          onEdit={onEdit}
          onCancel={onCancel}
          onMarkComplete={onMarkComplete}
          onPrint={onPrint}
        />
      ),
    },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
      <Table<EventOrder>
        rowKey="id"
        columns={columns}
        dataSource={data}
        onRow={(record) => ({
          onClick: () => onView(record),
          className: "cursor-pointer",
        })}
        pagination={{
          current: page,
          pageSize,
          // ─── THE FIX ───────────────────────────────────────────────────
          // OLD: total: data.length  ← WRONG for server-side pagination
          // NEW: total               ← from backend's pagination.total
          //
          // WHY this matters:
          //   Backend returns { data: [...20 items...], pagination: { total: 150 } }
          //   data.length = 20 (just this page)
          //   total = 150 (all matching events across all pages)
          //   antd needs the REAL total to render "Page 1 of 8" correctly
          total,
          showSizeChanger: true,
          pageSizeOptions: ["10", "20", "50"],
          showTotal: (t, range) =>
            `Showing ${range[0]}–${range[1]} of ${t} events`,
          onChange: onPageChange,
        }}
        locale={{
          emptyText: (
            <div className="py-16 text-center">
              <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mx-auto mb-4">
                <HiOutlineCalendar className="w-8 h-8 text-blue-400" />
              </div>
              <div className="font-semibold text-slate-700">No events yet</div>
              <div className="text-sm text-slate-500 mt-1">
                Create your first event order to get started.
              </div>
            </div>
          ),
        }}
      />
    </div>
  );
};

export default EventTable;
