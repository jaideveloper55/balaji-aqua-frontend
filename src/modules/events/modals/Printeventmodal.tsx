import { useRef } from "react";

import {
  HiOutlinePrinter,
  HiOutlineDocumentText,
  HiOutlineCalendar,
  HiOutlineLocationMarker,
  HiOutlinePhone,
  HiOutlineUser,
  HiOutlineClock,
} from "react-icons/hi";

import CustomModal from "../../../components/common/CustomModal";
import {
  formatINR,
  formatDate,
  EVENT_TYPE_META,
  EVENT_STATUS_META,
} from "../constants/Events.constants";
import type { EventOrder } from "../types/Events";

interface Company {
  name: string;
  address: string;
  phone: string;
  email?: string;
  gstNumber?: string;
  logoUrl?: string;
}

interface Props {
  event: EventOrder | null;
  open: boolean;
  onClose: () => void;
  /** Optional company info for the letterhead */
  company?: Company;
}

const DEFAULT_COMPANY: Company = {
  name: "Balaji Aqua Water Plant",
  address: "12, Industrial Estate, Chennai, Tamil Nadu - 600001",
  phone: "+91 98765 43210",
  email: "info@balajiaqua.com",
  gstNumber: "33AABCB1234C1Z5",
};

const PrintEventModal = ({ event, open, onClose, company }: Props) => {
  const printRef = useRef<HTMLDivElement>(null);
  const co = company ?? DEFAULT_COMPANY;

  if (!event) return null;

  const typeMeta = EVENT_TYPE_META[event.eventType];
  const statusMeta = EVENT_STATUS_META[event.status];

  // ─── Print handler — opens a clean print window with only the invoice ──
  const handlePrint = () => {
    if (!printRef.current) return;

    const printContent = printRef.current.innerHTML;
    const printWindow = window.open("", "_blank", "width=900,height=700");
    if (!printWindow) {
      alert("Please allow pop-ups to print this order");
      return;
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${event.eventNumber} - ${event.eventName}</title>
          <meta charset="utf-8" />
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
            @page { size: A4; margin: 12mm; }
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; color: #0f172a; }
            * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
            .no-print { display: none !important; }
          </style>
        </head>
        <body>${printContent}</body>
      </html>
    `);
    printWindow.document.close();

    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.focus();
        printWindow.print();
        printWindow.close();
      }, 400);
    };
  };

  const footer = (
    <div className="flex justify-between items-center gap-3">
      <div className="text-xs text-slate-500 hidden sm:block">
        Preview before printing — header buttons won't appear in the print
      </div>
      <div className="flex gap-2 ml-auto">
        <button
          onClick={onClose}
          className="px-4 py-2.5 rounded-lg text-slate-700 hover:bg-slate-100 font-medium text-sm transition"
        >
          Close
        </button>
        <button
          onClick={handlePrint}
          className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm transition shadow-sm flex items-center gap-2"
        >
          <HiOutlinePrinter className="w-4 h-4" /> Print Order
        </button>
      </div>
    </div>
  );

  return (
    <CustomModal
      open={open}
      onClose={onClose}
      title="Print Preview"
      subtitle={`${event.eventNumber} · ${event.eventName}`}
      icon={<HiOutlineDocumentText className="w-6 h-6" />}
      iconTone="slate"
      size="4xl"
      footer={footer}
      bodyClassName="!p-0 !bg-slate-100"
    >
      <div className="p-6 bg-slate-100">
        <div
          ref={printRef}
          className="bg-white shadow-lg mx-auto max-w-3xl"
          style={{ minHeight: "11in" }}
        >
          <PrintableInvoice
            event={event}
            company={co}
            typeMeta={typeMeta}
            statusMeta={statusMeta}
          />
        </div>
      </div>
    </CustomModal>
  );
};

// ─── Printable Invoice ────────────────────────────────────────────────────
const PrintableInvoice = ({
  event,
  company,
  typeMeta,
  statusMeta,
}: {
  event: EventOrder;
  company: Company;
  typeMeta: (typeof EVENT_TYPE_META)[keyof typeof EVENT_TYPE_META];
  statusMeta: (typeof EVENT_STATUS_META)[keyof typeof EVENT_STATUS_META];
}) => {
  // ─── Status badge color logic ────────────────────────────────────────
  // event.status: DRAFT | CONFIRMED | IN_PROGRESS | DELIVERED | COMPLETED | CANCELLED
  // (paymentStatus PAID/PARTIAL/UNPAID is shown as a separate badge below)
  const statusColors =
    event.status === "COMPLETED" || event.status === "DELIVERED"
      ? { bg: "#d1fae5", color: "#065f46" } // green
      : event.status === "CANCELLED"
      ? { bg: "#fee2e2", color: "#991b1b" } // red
      : event.status === "DRAFT"
      ? { bg: "#f1f5f9", color: "#475569" } // slate
      : { bg: "#dbeafe", color: "#1e40af" }; // blue (CONFIRMED, IN_PROGRESS)

  const paymentColors =
    event.paymentStatus === "PAID"
      ? { bg: "#d1fae5", color: "#065f46" }
      : event.paymentStatus === "PARTIAL"
      ? { bg: "#fef3c7", color: "#92400e" }
      : { bg: "#fee2e2", color: "#991b1b" };

  return (
    <div className="px-10 py-8 text-slate-900">
      {/* ─── Letterhead ──────────────────────────────────────────────── */}
      <div className="flex items-start justify-between pb-6 border-b-2 border-slate-900">
        <div className="flex items-start gap-3">
          <div
            className="w-14 h-14 rounded-xl flex items-center justify-center text-white font-bold text-2xl shrink-0"
            style={{ background: "linear-gradient(135deg, #2563eb, #06b6d4)" }}
          >
            💧
          </div>
          <div>
            <div className="text-xl font-bold tracking-tight">
              {company.name}
            </div>
            <div className="text-xs text-slate-600 mt-1 leading-relaxed">
              {company.address}
              <br />
              {company.phone}
              {company.email && ` · ${company.email}`}
            </div>
            {company.gstNumber && (
              <div className="text-xs text-slate-500 mt-1">
                <span className="font-semibold">GSTIN:</span>{" "}
                {company.gstNumber}
              </div>
            )}
          </div>
        </div>

        <div className="text-right">
          <div className="text-2xl font-bold tracking-tight">EVENT ORDER</div>
          <div className="text-xs font-mono text-slate-600 mt-1">
            {event.eventNumber}
          </div>
          <div className="mt-2 flex justify-end gap-1">
            <span
              className="inline-block px-2.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider"
              style={{
                backgroundColor: statusColors.bg,
                color: statusColors.color,
              }}
            >
              {statusMeta.label}
            </span>
            <span
              className="inline-block px-2.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider"
              style={{
                backgroundColor: paymentColors.bg,
                color: paymentColors.color,
              }}
            >
              {event.paymentStatus}
            </span>
          </div>
        </div>
      </div>

      {/* ─── Event Banner ─────────────────────────────────────────────── */}
      <div className="mt-6 grid grid-cols-2 gap-6">
        <div>
          <div className="text-[10px] font-semibold tracking-wider text-slate-500 uppercase">
            Event
          </div>
          <div className="text-lg font-bold mt-1">{event.eventName}</div>
          <div className="text-xs text-slate-600 mt-1">
            {typeMeta.emoji} {typeMeta.label} · {event.expectedGuests} guests
          </div>
        </div>
        <div className="text-right">
          <div className="text-[10px] font-semibold tracking-wider text-slate-500 uppercase">
            Issue Date
          </div>
          <div className="font-semibold mt-1">
            {formatDate(event.createdAt)}
          </div>
        </div>
      </div>

      {/* ─── Customer + Venue blocks ──────────────────────────────────── */}
      <div className="mt-6 grid grid-cols-2 gap-4">
        <InfoBlock
          title="Customer"
          rows={[
            { icon: HiOutlineUser, label: event.customerName, bold: true },
            { icon: HiOutlinePhone, label: event.customerPhone },
          ]}
        />
        <InfoBlock
          title="Event Schedule"
          rows={[
            {
              icon: HiOutlineCalendar,
              label: formatDate(event.eventDate),
              bold: true,
            },
            {
              icon: HiOutlineClock,
              label: `${event.deliveryTime}${
                event.pickupTime ? ` – ${event.pickupTime}` : ""
              }`,
            },
          ]}
        />
        <InfoBlock
          title="Delivery Venue"
          rows={[
            {
              icon: HiOutlineLocationMarker,
              label: event.venueName,
              bold: true,
            },
            {
              label: `${event.venueAddress}, ${event.venueCity}${
                event.venuePincode ? ` - ${event.venuePincode}` : ""
              }`,
            },
          ]}
        />
        {(event.contactPersonName || event.contactPersonPhone) && (
          <InfoBlock
            title="On-site Contact"
            rows={[
              {
                icon: HiOutlineUser,
                label: event.contactPersonName ?? "—",
                bold: true,
              },
              { icon: HiOutlinePhone, label: event.contactPersonPhone ?? "—" },
            ]}
          />
        )}
      </div>

      {/* ─── Items Table ─────────────────────────────────────────────── */}
      <div className="mt-7">
        <div className="text-[10px] font-semibold tracking-wider text-slate-500 uppercase mb-2">
          Order Items
        </div>
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-slate-900 text-white">
              <th className="text-left px-3 py-2 text-xs font-semibold w-10">
                #
              </th>
              <th className="text-left px-3 py-2 text-xs font-semibold">
                Product
              </th>
              <th className="text-center px-3 py-2 text-xs font-semibold w-16">
                Qty
              </th>
              <th className="text-right px-3 py-2 text-xs font-semibold w-24">
                Price
              </th>
              <th className="text-right px-3 py-2 text-xs font-semibold w-28">
                Total
              </th>
            </tr>
          </thead>
          <tbody>
            {event.items.map((it, idx) => (
              <tr key={it.id} className="border-b border-slate-200">
                <td className="px-3 py-2.5 text-slate-500 text-xs">
                  {idx + 1}
                </td>
                <td className="px-3 py-2.5">
                  <div className="font-medium">{it.productName}</div>
                  {it.sku && (
                    <div className="text-[10px] text-slate-500">
                      SKU: {it.sku} · {it.unit}
                    </div>
                  )}
                </td>
                <td className="px-3 py-2.5 text-center">{it.quantity}</td>
                <td className="px-3 py-2.5 text-right">
                  {formatINR(it.unitPrice)}
                </td>
                <td className="px-3 py-2.5 text-right font-semibold">
                  {formatINR(it.lineTotal)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ─── Totals + Notes ──────────────────────────────────────────── */}
      <div className="mt-5 grid grid-cols-5 gap-6">
        <div className="col-span-3">
          {event.notes && (
            <div className="border border-slate-200 rounded p-3">
              <div className="text-[10px] font-semibold tracking-wider text-slate-500 uppercase mb-1">
                Notes
              </div>
              <p className="text-xs text-slate-700 whitespace-pre-line">
                {event.notes}
              </p>
            </div>
          )}

          <div className="mt-4 text-[10px] text-slate-500 leading-relaxed">
            <div className="font-semibold text-slate-700 mb-1">
              Terms & Conditions
            </div>
            <ul className="list-disc pl-4 space-y-0.5">
              <li>
                Goods once delivered will not be taken back unless faulty.
              </li>
              <li>
                Security deposit refunded after equipment return in good
                condition.
              </li>
              <li>Balance due must be settled on or before event date.</li>
              <li>Cancellation within 48 hours forfeits 50% advance.</li>
            </ul>
          </div>
        </div>

        <div className="col-span-2">
          <div className="bg-slate-50 rounded p-4 space-y-2 text-sm">
            <Row label="Subtotal" value={formatINR(event.subtotal)} />
            {event.discount > 0 && (
              <Row
                label="Discount"
                value={`− ${formatINR(event.discount)}`}
                negative
              />
            )}
            {event.gstEnabled && (
              <Row label="GST (18%)" value={formatINR(event.gstAmount)} />
            )}
            <div className="h-px bg-slate-300 my-1" />
            <Row label="Total" value={formatINR(event.totalAmount)} bold />
            {event.advancePaid > 0 && (
              <Row
                label="Advance Paid"
                value={`− ${formatINR(event.advancePaid)}`}
                negative
              />
            )}
            <div className="h-px bg-slate-300 my-1" />
            <Row
              label="Balance Due"
              value={formatINR(event.balanceDue)}
              bold
              large
              highlight={event.balanceDue > 0}
            />
            {event.securityDeposit > 0 && (
              <div className="pt-2 mt-2 border-t border-slate-200">
                <Row
                  label="Security Deposit"
                  value={formatINR(event.securityDeposit)}
                  small
                />
                <div className="text-[9px] text-slate-500 mt-0.5">
                  (Refundable on equipment return)
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ─── Signatures ──────────────────────────────────────────────── */}
      <div className="mt-12 grid grid-cols-2 gap-12">
        <div>
          <div className="border-t border-slate-400 pt-2 text-xs text-slate-600 text-center">
            Customer Signature
          </div>
        </div>
        <div>
          <div className="border-t border-slate-400 pt-2 text-xs text-slate-600 text-center">
            For {company.name}
          </div>
        </div>
      </div>

      {/* ─── Footer ──────────────────────────────────────────────────── */}
      <div className="mt-8 pt-4 border-t border-slate-200 text-center text-[10px] text-slate-500">
        Thank you for choosing {company.name} · Generated on{" "}
        {formatDate(new Date().toISOString())}
      </div>
    </div>
  );
};

// ─── Helpers ──────────────────────────────────────────────────────────────
const InfoBlock = ({
  title,
  rows,
}: {
  title: string;
  rows: Array<{
    icon?: React.ComponentType<{ className?: string }>;
    label: string;
    bold?: boolean;
  }>;
}) => (
  <div className="border border-slate-200 rounded p-3">
    <div className="text-[10px] font-semibold tracking-wider text-slate-500 uppercase mb-1.5">
      {title}
    </div>
    {rows.map((r, i) => (
      <div
        key={i}
        className={`flex items-start gap-1.5 text-xs ${
          r.bold ? "font-semibold text-slate-900" : "text-slate-600"
        } ${i > 0 ? "mt-0.5" : ""}`}
      >
        {r.icon && (
          <r.icon className="w-3.5 h-3.5 mt-0.5 shrink-0 text-slate-400" />
        )}
        <span>{r.label}</span>
      </div>
    ))}
  </div>
);

const Row = ({
  label,
  value,
  bold,
  large,
  negative,
  highlight,
  small,
}: {
  label: string;
  value: string;
  bold?: boolean;
  large?: boolean;
  negative?: boolean;
  highlight?: boolean;
  small?: boolean;
}) => (
  <div
    className={`flex justify-between items-baseline ${
      large ? "text-base" : small ? "text-xs" : "text-sm"
    }`}
  >
    <span className="text-slate-600">{label}</span>
    <span
      className={`${bold ? "font-bold" : "font-medium"} ${
        highlight
          ? "text-red-600"
          : negative
          ? "text-slate-700"
          : "text-slate-900"
      }`}
    >
      {value}
    </span>
  </div>
);

export default PrintEventModal;
