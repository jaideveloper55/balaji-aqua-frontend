import { Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  HiOutlineUser,
  HiOutlineCalendar,
  HiOutlineLocationMarker,
  HiOutlineUsers,
  HiOutlinePhone,
  HiOutlineExclamationCircle,
} from "react-icons/hi";
import dayjs from "dayjs";
import { EventOrder } from "../types/Events";
import EventTypeBadge from "./Eventtypebadge";
import EventStatusBadge from "./Eventstatusbadge";
import EventActionsMenu from "./Eventactionsmenu";
import { formatCurrency } from "../../billing/utils/Helpers";

interface Props {
  data: EventOrder[];
  isLoading?: boolean;
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number, limit: number) => void;
  onView: (e: EventOrder) => void;
  onEdit: (e: EventOrder) => void;
  onCancel: (e: EventOrder) => void;
  onComplete: (e: EventOrder) => void;
  onDelete: (e: EventOrder) => void;
  onPrint: (e: EventOrder) => void;
}

const EventTable = ({
  data,
  isLoading,
  page,
  pageSize,
  total,
  onPageChange,
  onView,
  onEdit,
  onCancel,
  onComplete,
  onDelete,
  onPrint,
}: Props) => {
  const initials = (name: string) =>
    name
      .split(" ")
      .map((w) => w[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();

  const columns: ColumnsType<EventOrder> = [
    {
      title: "Event",
      key: "event",
      width: 260,
      render: (_, event) => (
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm shrink-0">
            {initials(event.eventName)}
          </div>
          <div className="min-w-0">
            <div className="font-semibold text-slate-800 truncate">
              {event.eventName}
            </div>
            <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
              <span className="flex items-center gap-1">
                <HiOutlineUsers className="w-3 h-3" />
                {event.expectedGuests} guests
              </span>
              <span>·</span>
              <span className="font-mono">{event.eventNumber}</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Type",
      key: "type",
      width: 130,
      render: (_, event) => <EventTypeBadge type={event.eventType} />,
    },
    {
      title: "Customer",
      key: "customer",
      width: 200,
      render: (_, event) => (
        <div>
          <div className="text-[13px] font-medium text-slate-800 flex items-center gap-1.5">
            <HiOutlineUser className="w-3.5 h-3.5 text-slate-400" />
            {event.customerName}
          </div>
          <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
            <HiOutlinePhone className="w-3 h-3" />
            {event.customerPhone}
          </div>
        </div>
      ),
    },
    {
      title: "Date & Venue",
      key: "date",
      width: 220,
      render: (_, event) => (
        <div>
          <div className="text-[13px] text-slate-800 flex items-center gap-1.5 font-medium">
            <HiOutlineCalendar className="w-3.5 h-3.5 text-slate-400" />
            {dayjs(event.eventDate).format("DD MMM YYYY")}
            <span className="text-[11px] text-slate-500 font-normal">
              · {event.deliveryTime}
            </span>
          </div>
          <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5 truncate">
            <HiOutlineLocationMarker className="w-3 h-3" />
            {event.venueName}, {event.venueCity}
          </div>
        </div>
      ),
    },
    {
      title: "Status",
      key: "status",
      width: 130,
      render: (_, event) => (
        <div className="flex flex-col gap-1">
          <EventStatusBadge status={event.status} />
        </div>
      ),
    },
    {
      title: "Amount",
      key: "amount",
      width: 140,
      align: "right",
      render: (_, event) => (
        <div>
          <div className="text-[13px] font-bold text-slate-800">
            {formatCurrency(event.totalAmount ?? 0)}
          </div>
          {(event.balanceDue ?? 0) > 0 && (
            <div className="text-[10px] text-red-600 mt-0.5 flex items-center justify-end gap-0.5">
              <HiOutlineExclamationCircle className="w-3 h-3" />
              {formatCurrency(event.balanceDue ?? 0)} due
            </div>
          )}
        </div>
      ),
    },
    {
      title: "",
      key: "actions",
      width: 50,
      align: "right",
      render: (_: unknown, event: EventOrder) => (
        <div onClick={(e) => e.stopPropagation()}>
          <EventActionsMenu
            event={event}
            onView={onView}
            onEdit={onEdit}
            onCancel={onCancel}
            onComplete={onComplete}
            onDelete={onDelete}
            onPrint={onPrint}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
      <Table<EventOrder>
        rowKey="id"
        columns={columns}
        dataSource={data}
        loading={isLoading}
        onRow={(record) => ({
          onClick: () => onView(record),
          className: "cursor-pointer",
        })}
        pagination={{
          current: page,
          pageSize,
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
