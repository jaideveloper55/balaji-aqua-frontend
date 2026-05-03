import { Drawer, Table } from "antd";
import {
  HiOutlineCalendar,
  HiOutlineClock,
  HiOutlineLocationMarker,
  HiOutlineUser,
  HiOutlinePhone,
  HiOutlineUsers,
  HiOutlineDocumentText,
  HiOutlineCash,
} from "react-icons/hi";
import EventStatusBadge from "../components/Eventstatusbadge";
import EventTypeBadge from "../components/Eventtypebadge";
import {
  formatINR,
  formatDate,
  PAYMENT_STATUS_META,
} from "../constants/Events.constants";
import type { EventOrder } from "../types/Events";

interface Props {
  event: EventOrder | null;
  open: boolean;
  onClose: () => void;
  onEdit: (e: EventOrder) => void;
  onCancel: (e: EventOrder) => void;
  onMarkComplete: (e: EventOrder) => void;
}

const InfoRow = ({
  icon: Icon,
  label,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  children: React.ReactNode;
}) => (
  <div className="flex items-start gap-3">
    <div className="w-9 h-9 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
      <Icon className="w-4 h-4" />
    </div>
    <div className="min-w-0 flex-1">
      <div className="text-[11px] font-semibold text-slate-500 tracking-wider uppercase">
        {label}
      </div>
      <div className="text-sm text-slate-800 mt-0.5">{children}</div>
    </div>
  </div>
);

const EventDetailsDrawer = ({
  event,
  open,
  onClose,
  onEdit,
  onCancel,
  onMarkComplete,
}: Props) => {
  if (!event) return null;
  const pay = PAYMENT_STATUS_META[event.paymentStatus];
  const isLocked = event.status === "CANCELLED" || event.status === "COMPLETED";

  return (
    <Drawer
      open={open}
      onClose={onClose}
      width={720}
      closable={false}
      styles={{ body: { padding: 0 }, header: { display: "none" } }}
    >
      {/* Hero */}
      <div className="bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-500 text-white p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-2">
              <EventTypeBadge type={event.eventType} />
              <EventStatusBadge status={event.status} />
            </div>
            <h2 className="text-2xl font-bold tracking-tight truncate">
              {event.eventName}
            </h2>
            <div className="text-blue-100 text-sm mt-1 font-mono">
              {event.eventNumber}
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white text-2xl leading-none"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div className="mt-5 grid grid-cols-3 gap-3">
          <div className="bg-white/15 backdrop-blur rounded-xl px-3 py-2">
            <div className="text-[10px] font-semibold tracking-wider text-blue-100">
              TOTAL
            </div>
            <div className="text-lg font-bold">
              {formatINR(event.totalAmount)}
            </div>
          </div>
          <div className="bg-white/15 backdrop-blur rounded-xl px-3 py-2">
            <div className="text-[10px] font-semibold tracking-wider text-blue-100">
              ADVANCE
            </div>
            <div className="text-lg font-bold">
              {formatINR(event.advancePaid)}
            </div>
          </div>
          <div className="bg-white/15 backdrop-blur rounded-xl px-3 py-2">
            <div className="text-[10px] font-semibold tracking-wider text-blue-100">
              BALANCE
            </div>
            <div className="text-lg font-bold">
              {formatINR(event.balanceDue)}
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="p-6 space-y-6">
        {/* Schedule + Venue */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InfoRow icon={HiOutlineCalendar} label="Event Date">
            <div className="font-medium">{formatDate(event.eventDate)}</div>
          </InfoRow>
          <InfoRow icon={HiOutlineClock} label="Delivery / Pickup">
            <div className="font-medium">
              {event.deliveryTime}
              {event.pickupTime && (
                <span className="text-slate-500"> – {event.pickupTime}</span>
              )}
            </div>
          </InfoRow>
          <InfoRow icon={HiOutlineLocationMarker} label="Venue">
            <div className="font-medium">{event.venueName}</div>
            <div className="text-xs text-slate-500 mt-0.5">
              {event.venueAddress}, {event.venueCity}{" "}
              {event.venuePincode && `- ${event.venuePincode}`}
            </div>
          </InfoRow>
          <InfoRow icon={HiOutlineUsers} label="Expected Guests">
            <div className="font-medium">{event.expectedGuests} people</div>
          </InfoRow>
        </div>

        {/* Customer */}
        <div className="bg-slate-50 rounded-xl p-4">
          <div className="text-[11px] font-semibold tracking-wider text-slate-500 uppercase mb-3">
            Customer
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex items-center gap-2">
              <HiOutlineUser className="text-slate-400" />
              <span className="text-sm font-medium text-slate-800">
                {event.customerName}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <HiOutlinePhone className="text-slate-400" />
              <span className="text-sm text-slate-700">
                {event.customerPhone}
              </span>
            </div>
            {event.contactPersonName && (
              <div className="flex items-center gap-2">
                <HiOutlineUser className="text-slate-400" />
                <span className="text-sm text-slate-700">
                  Contact: {event.contactPersonName}
                </span>
              </div>
            )}
            {event.contactPersonPhone && (
              <div className="flex items-center gap-2">
                <HiOutlinePhone className="text-slate-400" />
                <span className="text-sm text-slate-700">
                  {event.contactPersonPhone}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Items */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <HiOutlineDocumentText className="text-slate-500" />
            <h3 className="font-semibold text-slate-800">Order Items</h3>
            <span className="text-xs text-slate-500">
              ({event.items.length})
            </span>
          </div>

          <Table
            size="small"
            pagination={false}
            rowKey="id"
            dataSource={event.items}
            columns={[
              {
                title: "Product",
                dataIndex: "productName",
                render: (v, r) => (
                  <div>
                    <div className="font-medium text-slate-800">{v}</div>
                    <div className="text-xs text-slate-500">
                      {r.sku} · {r.unit}
                    </div>
                  </div>
                ),
              },
              {
                title: "Qty",
                dataIndex: "quantity",
                align: "center",
                width: 70,
              },
              {
                title: "Price",
                dataIndex: "unitPrice",
                align: "right",
                width: 100,
                render: (v) => formatINR(v),
              },
              {
                title: "Total",
                dataIndex: "lineTotal",
                align: "right",
                width: 110,
                render: (v) => (
                  <span className="font-semibold">{formatINR(v)}</span>
                ),
              },
            ]}
          />
        </div>

        {/* Money breakdown */}
        <div className="bg-gradient-to-br from-emerald-50 to-white border border-emerald-100 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <HiOutlineCash className="text-emerald-600" />
            <h3 className="font-semibold text-slate-800">Payment Summary</h3>
            <span
              className={`ml-auto px-2 py-0.5 rounded text-xs font-medium ${pay.bg} ${pay.text}`}
            >
              {pay.label}
            </span>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal</span>
              <span className="font-medium text-slate-800">
                {formatINR(event.subtotal)}
              </span>
            </div>
            {event.discount > 0 && (
              <div className="flex justify-between text-slate-600">
                <span>Discount</span>
                <span className="font-medium text-red-600">
                  − {formatINR(event.discount)}
                </span>
              </div>
            )}
            {event.gstEnabled && (
              <div className="flex justify-between text-slate-600">
                <span>GST (18%)</span>
                <span className="font-medium text-slate-800">
                  {formatINR(event.gstAmount)}
                </span>
              </div>
            )}
            <div className="h-px bg-slate-200 my-2" />
            <div className="flex justify-between font-bold text-slate-900">
              <span>Total</span>
              <span>{formatINR(event.totalAmount)}</span>
            </div>
            <div className="flex justify-between text-emerald-700">
              <span>Advance Paid</span>
              <span className="font-medium">
                − {formatINR(event.advancePaid)}
              </span>
            </div>
            {event.securityDeposit > 0 && (
              <div className="flex justify-between text-slate-600">
                <span>Security Deposit</span>
                <span className="font-medium">
                  {formatINR(event.securityDeposit)}
                </span>
              </div>
            )}
            <div className="h-px bg-slate-200 my-2" />
            <div className="flex justify-between font-bold">
              <span className="text-slate-700">Balance Due</span>
              <span
                className={
                  event.balanceDue > 0 ? "text-red-600" : "text-emerald-600"
                }
              >
                {formatINR(event.balanceDue)}
              </span>
            </div>
          </div>
        </div>

        {/* Notes */}
        {event.notes && (
          <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
            <div className="text-[11px] font-semibold tracking-wider text-amber-700 uppercase mb-1">
              Notes
            </div>
            <p className="text-sm text-amber-900 whitespace-pre-line">
              {event.notes}
            </p>
          </div>
        )}
      </div>

      {/* Footer actions */}
      <div className="sticky bottom-0 bg-white border-t border-slate-200 px-6 py-4 flex gap-2 justify-end">
        <button
          onClick={onClose}
          className="px-4 py-2 rounded-lg text-slate-700 hover:bg-slate-100 font-medium text-sm transition"
        >
          Close
        </button>
        {!isLocked && (
          <>
            <button
              onClick={() => onCancel(event)}
              className="px-4 py-2 rounded-lg text-red-600 hover:bg-red-50 font-medium text-sm transition"
            >
              Cancel Event
            </button>
            <button
              onClick={() => onEdit(event)}
              className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 font-medium text-sm transition"
            >
              Edit
            </button>
            <button
              onClick={() => onMarkComplete(event)}
              className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm transition shadow-sm"
            >
              Mark Completed
            </button>
          </>
        )}
      </div>
    </Drawer>
  );
};

export default EventDetailsDrawer;
