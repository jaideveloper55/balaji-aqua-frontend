import { HiOutlinePrinter, HiOutlineDocumentText } from "react-icons/hi";
import CustomModal from "../../../components/common/CustomModal";
import { formatINR, formatDate } from "../constants/Events.constants";
import type { EventOrder } from "../types/Events";
import { COMPANY_INFO } from "../../billing/constants/Mockdata";

interface Company {
  name: string;
  tagline?: string;
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
  company?: Company;
}

const DEFAULT_COMPANY: Company = {
  name: COMPANY_INFO.name,
  tagline: COMPANY_INFO.tagline,
  address: COMPANY_INFO.address,
  phone: COMPANY_INFO.phone,
  email: COMPANY_INFO.email,
};

const STATUS_LABELS: Record<string, string> = {
  DRAFT: "Draft",
  CONFIRMED: "Confirmed",
  IN_PROGRESS: "In Progress",
  DELIVERED: "Delivered",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
};
const EVENT_TYPE_LABELS: Record<string, string> = {
  WEDDING: "Wedding",
  ENGAGEMENT: "Engagement",
  BIRTHDAY: "Birthday",
  CORPORATE: "Corporate",
  RELIGIOUS: "Religious",
  HOUSE_WARMING: "House Warming",
  OTHER: "Other",
};

const PrintEventModal = ({ event, open, onClose, company }: Props) => {
  const co = company ?? DEFAULT_COMPANY;

  if (!event) return null;

  const handlePrint = () => window.print();

  const totalGst = (event.cgst ?? 0) + (event.sgst ?? 0);
  const totalQty = (event.items ?? []).reduce((s, i) => s + i.quantity, 0);
  const hasSecurityDeposit = (event.securityDeposit ?? 0) > 0;
  const hasNotes = !!event.notes?.trim();

  const receiptContent = (
    <>
      <div style={{ textAlign: "center", fontWeight: 700, fontSize: "17px" }}>
        {co.name}
      </div>
      {co.tagline && (
        <div
          style={{ textAlign: "center", fontSize: "11px", fontStyle: "italic" }}
        >
          {co.tagline}
        </div>
      )}
      <div style={{ textAlign: "center", fontSize: "12px" }}>{co.address}</div>
      <div style={{ textAlign: "center", fontSize: "12px" }}>
        Phone : {co.phone}
      </div>
      {co.gstNumber && (
        <div style={{ textAlign: "center", fontSize: "12px" }}>
          GSTIN : {co.gstNumber}
        </div>
      )}

      <div style={{ borderTop: "1px dashed #000", margin: "6px 0" }} />

      <div style={{ textAlign: "center", fontWeight: 700, fontSize: "14px" }}>
        EVENT ORDER
      </div>
      <Row label="Event No:" value={event.eventNumber} />
      <Row label="Event:" value={event.eventName} />
      <Row
        label="Type:"
        value={`${EVENT_TYPE_LABELS[event.eventType] ?? event.eventType} · ${
          event.expectedGuests
        } guests`}
      />
      <Row label="Date:" value={formatDate(event.eventDate)} />
      <Row
        label="Time:"
        value={`${event.deliveryTime}${
          event.pickupTime ? ` – ${event.pickupTime}` : ""
        }`}
      />
      <Row
        label="Status:"
        value={STATUS_LABELS[event.status] ?? event.status}
      />

      <div style={{ borderTop: "1px dashed #000", margin: "6px 0" }} />

      <Row label="Customer:" value={event.customerName} />
      <Row label="Phone:" value={event.customerPhone} />
      <div style={{ fontSize: "12px", marginTop: "2px" }}>
        Venue: {event.venueName}
      </div>
      <div style={{ fontSize: "12px" }}>
        {event.venueAddress}, {event.venueCity}
        {event.venuePincode ? ` - ${event.venuePincode}` : ""}
      </div>
      {(event.onSiteContactName || event.onSiteContactPhone) && (
        <div style={{ fontSize: "12px", marginTop: "2px" }}>
          On-site: {event.onSiteContactName ?? "—"}
          {event.onSiteContactPhone ? ` (${event.onSiteContactPhone})` : ""}
        </div>
      )}

      <div style={{ borderTop: "1px dashed #000", margin: "6px 0" }} />

      <div style={{ display: "flex", fontWeight: 700, fontSize: "12px" }}>
        <span style={{ flex: 2 }}>Item</span>
        <span style={{ flex: 1, textAlign: "right" }}>Qty</span>
        <span style={{ flex: 1.2, textAlign: "right" }}>Rate</span>
        <span style={{ flex: 1.4, textAlign: "right" }}>Amt</span>
      </div>
      <div style={{ borderTop: "1px solid #000", margin: "3px 0" }} />

      {(event.items ?? []).map((it, idx) => (
        <div
          key={it.id ?? idx}
          style={{ display: "flex", fontSize: "12px", marginBottom: "3px" }}
        >
          <span style={{ flex: 2 }}>{it.productName}</span>
          <span style={{ flex: 1, textAlign: "right" }}>{it.quantity}</span>
          <span style={{ flex: 1.2, textAlign: "right" }}>
            {it.unitPrice.toFixed(2)}
          </span>
          <span style={{ flex: 1.4, textAlign: "right" }}>
            {(it.lineTotal ?? it.quantity * it.unitPrice).toFixed(2)}
          </span>
        </div>
      ))}

      <div style={{ borderTop: "1px dashed #000", margin: "6px 0" }} />

      <Row
        label={`Total Qty: ${totalQty}`}
        value={`Sub: ${formatINR(event.subtotal)}`}
      />

      {event.discount > 0 && (
        <Row label="Discount" value={`- ${formatINR(event.discount)}`} />
      )}

      {event.gstEnabled && totalGst > 0 && (
        <Row
          label={`GST (${event.gstRate ?? 18}%)`}
          value={formatINR(totalGst)}
        />
      )}

      <div style={{ borderTop: "1px solid #000", margin: "5px 0" }} />

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontWeight: 700,
          fontSize: "16px",
        }}
      >
        <span>TOTAL:</span>
        <span>{formatINR(event.totalAmount)}</span>
      </div>

      <div style={{ borderTop: "1px solid #000", margin: "5px 0" }} />

      {event.advancePaid > 0 && (
        <Row label="Advance Paid:" value={formatINR(event.advancePaid)} />
      )}

      {event.balanceDue > 0 ? (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontWeight: 700,
            fontSize: "14px",
          }}
        >
          <span>BALANCE DUE:</span>
          <span>{formatINR(event.balanceDue)}</span>
        </div>
      ) : (
        <div style={{ textAlign: "center", fontWeight: 700, fontSize: "13px" }}>
          *** PAID IN FULL ***
        </div>
      )}

      {hasSecurityDeposit && (
        <>
          <div style={{ borderTop: "1px dashed #000", margin: "6px 0" }} />
          <Row
            label="Security Deposit:"
            value={formatINR(event.securityDeposit)}
          />
          <div style={{ fontSize: "11px" }}>
            (Refundable on equipment return)
          </div>
        </>
      )}

      {hasNotes && (
        <>
          <div style={{ borderTop: "1px dashed #000", margin: "6px 0" }} />
          <div style={{ fontSize: "12px", fontWeight: 700 }}>Notes:</div>
          <div style={{ fontSize: "12px", whiteSpace: "pre-wrap" }}>
            {event.notes}
          </div>
        </>
      )}

      <div style={{ borderTop: "1px dashed #000", margin: "6px 0" }} />
      <div style={{ textAlign: "center", fontSize: "13px" }}>
        -: Thank You Visit Again :-
      </div>
    </>
  );

  const footer = (
    <div className="flex flex-col gap-2.5">
      <p className="text-[11px] text-slate-400 text-center">
        Prints at 72mm on thermal paper — layout may look slightly denser than
        this preview
      </p>
      <div className="flex gap-2">
        <button
          onClick={onClose}
          className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200
            text-slate-600 hover:bg-slate-50 font-medium text-sm transition"
        >
          Close
        </button>
        <button
          onClick={handlePrint}
          className="flex-1 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700
            text-white font-semibold text-sm transition shadow-sm
            shadow-blue-500/25 flex items-center justify-center gap-2
            whitespace-nowrap"
        >
          <HiOutlinePrinter className="w-4 h-4" /> Print Receipt
        </button>
      </div>
    </div>
  );

  return (
    <>
      <CustomModal
        open={open}
        onClose={onClose}
        title="Print Preview"
        subtitle={`${event.eventNumber} · ${event.eventName}`}
        icon={<HiOutlineDocumentText className="w-6 h-6" />}
        iconTone="slate"
        size="md"
        footer={footer}
        bodyClassName="!p-0 !bg-slate-200"
      >
        <div className="py-8 flex justify-center bg-slate-200">
          <div
            style={{
              width: "80mm",
              padding: "4mm 3mm",
              background: "#fff",
              color: "#000",
              fontFamily: "'Courier New', monospace",
              fontSize: "13px",
              fontWeight: 600,
              lineHeight: 1.5,
              boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
            }}
          >
            {receiptContent}
          </div>
        </div>
      </CustomModal>

      <div id="print-area">
        <div id="thermal-receipt">{receiptContent}</div>
      </div>
    </>
  );
};

const Row: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      fontSize: "12px",
    }}
  >
    <span>{label}</span>
    <span>{value}</span>
  </div>
);

export default PrintEventModal;
