import { Drawer, Table, Spin } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useQuery } from "@tanstack/react-query";
import {
  HiOutlineCalendar,
  HiOutlineClock,
  HiOutlineLocationMarker,
  HiOutlineUser,
  HiOutlinePhone,
  HiOutlineUsers,
  HiOutlineDocumentText,
  HiOutlineCash,
  HiOutlineExclamationCircle,
} from "react-icons/hi";

import EventStatusBadge from "../components/Eventstatusbadge";
import EventTypeBadge from "../components/Eventtypebadge";
import {
  formatINR,
  formatDate,
  PAYMENT_STATUS_META,
} from "../constants/Events.constants";
import type {
  EventOrder,
  EventOrderItem,
  EventOrderPayment,
  EventPaymentStatus,
} from "../types/Events";
import { getEventOrderApi } from "../api/Events.api";

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
  const { data: fullEvent, isLoading: loadingDetail } = useQuery({
    queryKey: ["event-detail", event?.id],
    queryFn: () => getEventOrderApi(event!.id).then((res) => res.data),
    enabled: open && !!event?.id,
    staleTime: 0,
  });

  const e = fullEvent ?? event;

  if (!e) return null;

  const pay = PAYMENT_STATUS_META[e.paymentStatus as EventPaymentStatus];
  const isLocked = e.status === "CANCELLED" || e.status === "COMPLETED";

  const totalGst = (e.cgst ?? 0) + (e.sgst ?? 0);

  return (
    <Drawer
      open={open}
      onClose={onClose}
      width={720}
      closable={false}
      styles={{ body: { padding: 0 }, header: { display: "none" } }}
    >
      <div className="bg-blue-500 text-white p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-2">
              <EventTypeBadge type={e.eventType} />
              <EventStatusBadge status={e.status} />
            </div>
            <h2 className="text-2xl font-bold tracking-tight truncate">
              {e.eventName}
            </h2>
            <div className="text-blue-100 text-sm mt-1 font-mono">
              {e.eventNumber}
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

        {/* Money summary tiles */}
        <div className="mt-5 grid grid-cols-3 gap-3">
          <div className="bg-white/15 backdrop-blur rounded-xl px-3 py-2">
            <div className="text-[10px] font-semibold tracking-wider text-blue-100">
              TOTAL
            </div>
            <div className="text-lg font-bold">{formatINR(e.totalAmount)}</div>
          </div>
          <div className="bg-white/15 backdrop-blur rounded-xl px-3 py-2">
            <div className="text-[10px] font-semibold tracking-wider text-blue-100">
              ADVANCE
            </div>
            <div className="text-lg font-bold">{formatINR(e.advancePaid)}</div>
          </div>
          <div className="bg-white/15 backdrop-blur rounded-xl px-3 py-2">
            <div className="text-[10px] font-semibold tracking-wider text-blue-100">
              BALANCE DUE
            </div>
            <div className="text-lg font-bold">{formatINR(e.balanceDue)}</div>
          </div>
        </div>
      </div>

      {/* ─── Body ────────────────────────────────────────────────────────── */}
      <Spin spinning={loadingDetail} tip="Loading details...">
        <div className="p-6 space-y-6">
          {/* Cancellation note — shown when cancelled */}
          {e.status === "CANCELLED" && e.cancellationReason && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
              <HiOutlineExclamationCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <div className="text-sm text-red-800">
                <div className="font-semibold mb-0.5">Cancellation reason</div>
                <div className="text-xs">
                  {e.cancellationReason.replace(/_/g, " ")}
                  {e.cancellationNote && ` — ${e.cancellationNote}`}
                </div>
              </div>
            </div>
          )}

          {/* Schedule + Venue */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InfoRow icon={HiOutlineCalendar} label="Event Date">
              <div className="font-medium">{formatDate(e.eventDate)}</div>
            </InfoRow>
            <InfoRow icon={HiOutlineClock} label="Delivery / Pickup">
              <div className="font-medium">
                {e.deliveryTime}
                {e.pickupTime && (
                  <span className="text-slate-500"> – {e.pickupTime}</span>
                )}
              </div>
            </InfoRow>
            <InfoRow icon={HiOutlineLocationMarker} label="Venue">
              <div className="font-medium">{e.venueName}</div>
              <div className="text-xs text-slate-500 mt-0.5">
                {e.venueAddress}, {e.venueCity}
                {e.venuePincode && ` - ${e.venuePincode}`}
              </div>
            </InfoRow>
            <InfoRow icon={HiOutlineUsers} label="Expected Guests">
              <div className="font-medium">{e.expectedGuests} people</div>
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
                  {e.customerName}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <HiOutlinePhone className="text-slate-400" />
                <span className="text-sm text-slate-700">
                  {e.customerPhone}
                </span>
              </div>

              {e.onSiteContactName && (
                <div className="flex items-center gap-2">
                  <HiOutlineUser className="text-slate-400" />
                  <span className="text-sm text-slate-700">
                    On-site: {e.onSiteContactName}
                  </span>
                </div>
              )}
              {e.onSiteContactPhone && (
                <div className="flex items-center gap-2">
                  <HiOutlinePhone className="text-slate-400" />
                  <span className="text-sm text-slate-700">
                    {e.onSiteContactPhone}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Order Items */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <HiOutlineDocumentText className="text-slate-500" />
              <h3 className="font-semibold text-slate-800">Order Items</h3>
              <span className="text-xs text-slate-500">
                ({e.items?.length ?? 0})
              </span>
            </div>

            <Table<EventOrderItem>
              size="small"
              pagination={false}
              rowKey="id"
              dataSource={e.items ?? []}
              columns={
                [
                  {
                    title: "Product",
                    dataIndex: "productName",
                    render: (v: string, r: EventOrderItem) => (
                      <div>
                        <div className="font-medium text-slate-800">{v}</div>

                        {(r.sku || r.unit) && (
                          <div className="text-xs text-slate-500">
                            {[r.sku, r.unit].filter(Boolean).join(" · ")}
                          </div>
                        )}
                      </div>
                    ),
                  },
                  {
                    title: "Qty",
                    dataIndex: "quantity",
                    align: "center" as const,
                    width: 70,
                  },
                  {
                    title: "Price",
                    dataIndex: "unitPrice",
                    align: "right" as const,
                    width: 100,
                    render: (v: number) => formatINR(v),
                  },
                  {
                    title: "Total",
                    dataIndex: "lineTotal",
                    align: "right" as const,
                    width: 110,

                    render: (v: number, r: EventOrderItem) => (
                      <span className="font-semibold">
                        {formatINR(v ?? r.quantity * r.unitPrice)}
                      </span>
                    ),
                  },
                ] satisfies ColumnsType<EventOrderItem>
              }
            />
          </div>

          {/* Payment Breakdown */}
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
                  {formatINR(e.subtotal)}
                </span>
              </div>
              {e.discount > 0 && (
                <div className="flex justify-between text-slate-600">
                  <span>Discount</span>
                  <span className="font-medium text-red-600">
                    − {formatINR(e.discount)}
                  </span>
                </div>
              )}
              {/* ─── FIXED: cgst + sgst instead of the non-existent gstAmount ─ */}
              {e.gstEnabled && totalGst > 0 && (
                <div className="flex justify-between text-slate-600">
                  <span>
                    GST (CGST {formatINR(e.cgst)} + SGST {formatINR(e.sgst)})
                  </span>
                  <span className="font-medium text-slate-800">
                    {formatINR(totalGst)}
                  </span>
                </div>
              )}
              <div className="h-px bg-slate-200 my-2" />
              <div className="flex justify-between font-bold text-slate-900">
                <span>Total</span>
                <span>{formatINR(e.totalAmount)}</span>
              </div>
              <div className="flex justify-between text-emerald-700">
                <span>Advance Paid</span>
                <span className="font-medium">
                  − {formatINR(e.advancePaid)}
                </span>
              </div>
              {e.securityDeposit > 0 && (
                <div className="flex justify-between text-slate-600">
                  <span>Security Deposit (refundable)</span>
                  <span className="font-medium">
                    {formatINR(e.securityDeposit)}
                  </span>
                </div>
              )}
              <div className="h-px bg-slate-200 my-2" />
              <div className="flex justify-between font-bold">
                <span className="text-slate-700">Balance Due</span>
                <span
                  className={
                    e.balanceDue > 0 ? "text-red-600" : "text-emerald-600"
                  }
                >
                  {formatINR(e.balanceDue)}
                </span>
              </div>
            </div>
          </div>

          {/* Payment History (only if full detail loaded and payments exist) */}
          {fullEvent?.payments && fullEvent.payments.length > 0 && (
            <div>
              <div className="text-[11px] font-semibold tracking-wider text-slate-500 uppercase mb-3">
                Payment History
              </div>
              <div className="space-y-2">
                {fullEvent.payments.map((p: EventOrderPayment) => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between px-3 py-2 bg-slate-50 rounded-lg text-sm"
                  >
                    <div>
                      <span className="font-medium text-slate-800">
                        {p.paymentNumber}
                      </span>
                      <span className="text-slate-500 text-xs ml-2">
                        {p.paymentMode}
                      </span>
                      {p.notes && (
                        <span className="text-slate-400 text-xs ml-2 italic">
                          {p.notes}
                        </span>
                      )}
                    </div>
                    <span className="font-semibold text-emerald-700">
                      {formatINR(p.amount)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          {e.notes && (
            <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
              <div className="text-[11px] font-semibold tracking-wider text-amber-700 uppercase mb-1">
                Notes
              </div>
              <p className="text-sm text-amber-900 whitespace-pre-line">
                {e.notes}
              </p>
            </div>
          )}
        </div>
      </Spin>

      {/* ─── Footer Actions ───────────────────────────────────────────────── */}
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
              onClick={() => onCancel(e)}
              className="px-4 py-2 rounded-lg text-red-600 hover:bg-red-50 font-medium text-sm transition"
            >
              Cancel Event
            </button>
            <button
              onClick={() => onEdit(e)}
              className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 font-medium text-sm transition"
            >
              Edit
            </button>
            <button
              onClick={() => onMarkComplete(e)}
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
