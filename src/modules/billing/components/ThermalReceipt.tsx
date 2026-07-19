import React from "react";
import { Invoice } from "../types/billing";
import { formatCurrency } from "../utils/Helpers";
import { COMPANY_INFO } from "../constants/Mockdata";

interface Props {
  invoice: Invoice;
}

const ThermalReceipt: React.FC<Props> = ({ invoice }) => {
  // Sum of all item quantities — shown as "Total Qty" like your physical bill
  const totalQty = invoice.items.reduce((sum, item) => sum + item.qty, 0);

  return (
    <div
      id="thermal-receipt"
      style={{
        width: "80mm",
        padding: "4mm 3mm",
        margin: "0 auto",
        background: "#fff",
        color: "#000",
        fontFamily: "'Courier New', monospace",
        fontSize: "12px",
        fontWeight: 600,
        lineHeight: 1.45,
      }}
    >
      {/* ── SHOP HEADER (centered, like the printed bill) ── */}
      <div style={{ textAlign: "center", fontWeight: 700, fontSize: "15px" }}>
        {COMPANY_INFO.name}
      </div>
      <div style={{ textAlign: "center", fontSize: "11px" }}>
        {COMPANY_INFO.address}
      </div>
      <div style={{ textAlign: "center", fontSize: "11px" }}>
        Phone : {COMPANY_INFO.phone}
      </div>

      {/* A dashed line = the perforated divider look on thermal paper */}
      <div style={{ borderTop: "1px dashed #000", margin: "6px 0" }} />

      {/* ── BILL META ── */}
      <Row label="Bill No:" value={invoice.invoiceNo} />
      <Row label="Customer:" value={invoice.customerName} />
      <Row label={`Date: ${invoice.date}`} value={invoice.time} />

      <div style={{ borderTop: "1px dashed #000", margin: "6px 0" }} />

      {/* ── ITEM TABLE HEADER ── */}
      <div style={{ display: "flex", fontWeight: 700, fontSize: "11px" }}>
        <span style={{ flex: 2 }}>Item</span>
        <span style={{ flex: 1, textAlign: "right" }}>Qty</span>
        <span style={{ flex: 1.2, textAlign: "right" }}>Rate</span>
        <span style={{ flex: 1.4, textAlign: "right" }}>Amt</span>
      </div>
      <div style={{ borderTop: "1px solid #000", margin: "3px 0" }} />

      {/* ── ITEMS (loops your cart items) ── */}
      {invoice.items.map((item, idx) => (
        <div
          key={idx}
          style={{ display: "flex", fontSize: "11px", marginBottom: "3px" }}
        >
          <span style={{ flex: 2 }}>{item.product}</span>
          <span style={{ flex: 1, textAlign: "right" }}>{item.qty}</span>
          <span style={{ flex: 1.2, textAlign: "right" }}>
            {item.price.toFixed(2)}
          </span>
          <span style={{ flex: 1.4, textAlign: "right" }}>
            {item.total.toFixed(2)}
          </span>
        </div>
      ))}

      <div style={{ borderTop: "1px dashed #000", margin: "6px 0" }} />

      {/* ── TOTALS ── */}
      <Row
        label={`Total Qty: ${totalQty}`}
        value={`Sub: ${invoice.subtotal.toFixed(2)}`}
      />

      {/* GST line ONLY if GST was applied (your 18% toggle was on) */}
      {invoice.gst > 0 && (
        <Row label="GST 18%" value={invoice.gst.toFixed(2)} />
      )}

      {/* Discount line ONLY if there was one */}
      {invoice.discount > 0 && (
        <Row label="Discount" value={`-${invoice.discount.toFixed(2)}`} />
      )}

      <div style={{ borderTop: "1px solid #000", margin: "5px 0" }} />

      {/* Bill amount — the big bold number, like your physical receipt */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontWeight: 700,
          fontSize: "15px",
        }}
      >
        <span>BILL AMOUNT:</span>
        <span>{formatCurrency(invoice.grandTotal)}</span>
      </div>

      <div style={{ borderTop: "1px solid #000", margin: "5px 0" }} />

      {/* ── PAYMENT (Tendered / Balance, exactly like Image 1) ── */}
      <Row label="Tendered:" value={invoice.paidAmount.toFixed(2)} />
      <Row label="Balance:" value={invoice.balanceAmount.toFixed(2)} />

      <div style={{ borderTop: "1px dashed #000", margin: "6px 0" }} />
      <div style={{ textAlign: "center", fontSize: "12px" }}>
        -: Thank You Visit Again :-
      </div>
    </div>
  );
};

// Tiny helper so each "label ........ value" line stays consistent.
// WHY a sub-component: avoids repeating the same flex/justify code 8 times.
const Row: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      fontSize: "11px",
    }}
  >
    <span>{label}</span>
    <span>{value}</span>
  </div>
);

export default ThermalReceipt;
