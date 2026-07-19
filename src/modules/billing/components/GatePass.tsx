import React from "react";
import { Invoice } from "../types/billing";
import { COMPANY_INFO } from "../constants/Mockdata";

interface Props {
  invoice: Invoice;
}

const GatePass: React.FC<Props> = ({ invoice }) => {
  const totalQty = invoice.items.reduce((sum, item) => sum + item.qty, 0);

  return (
    <div
      id="gate-pass"
      style={{
        width: "80mm",
        padding: "4mm 3mm",
        margin: "0 auto",
        background: "#fff",
        color: "#000",
        fontFamily: "'Courier New', monospace",
        fontSize: "12px",
        fontWeight: 600, // darker thermal print
        lineHeight: 1.45,
      }}
    >
      {/* ── SHOP HEADER (same as the bill) ── */}
      <div style={{ textAlign: "center", fontWeight: 700, fontSize: "15px" }}>
        {COMPANY_INFO.name}
      </div>
      <div style={{ textAlign: "center", fontSize: "11px" }}>
        {COMPANY_INFO.address}
      </div>
      <div style={{ textAlign: "center", fontSize: "11px" }}>
        Phone : {COMPANY_INFO.phone}
      </div>

      <div
        style={{
          textAlign: "center",
          fontWeight: 700,
          fontSize: "16px",
          margin: "8px 0 4px",
          letterSpacing: "1px",
        }}
      >
        GATE PASS
      </div>

      <div style={{ borderTop: "1px dashed #000", margin: "6px 0" }} />

      {/* ── BILL META (no time-of-money stuff, just identity) ── */}
      <Row label="Bill No:" value={invoice.invoiceNo} />
      <Row label="Customer:" value={invoice.customerName} />
      <Row label={`Bill Date: ${invoice.date}`} value={invoice.time} />

      <div style={{ borderTop: "1px dashed #000", margin: "6px 0" }} />

      {/* ── ITEM TABLE: only Item Name + Qty. NO Rate, NO Amount. ── */}
      <div style={{ display: "flex", fontWeight: 700, fontSize: "12px" }}>
        <span style={{ flex: 2 }}>Item Name</span>
        <span style={{ flex: 1, textAlign: "right" }}>Qty</span>
      </div>
      <div style={{ borderTop: "1px solid #000", margin: "3px 0" }} />

      {invoice.items.map((item, idx) => (
        <div
          key={idx}
          style={{ display: "flex", fontSize: "12px", marginBottom: "3px" }}
        >
          <span style={{ flex: 2 }}>{item.product}</span>
          <span style={{ flex: 1, textAlign: "right" }}>{item.qty}</span>
        </div>
      ))}

      <div style={{ borderTop: "1px dashed #000", margin: "6px 0" }} />

      {/* ── TOTAL QTY (the only "total" a gate pass has) ── */}
      <div style={{ fontWeight: 700 }}>Total Qty: {totalQty}</div>

      <div style={{ borderTop: "1px dashed #000", margin: "6px 0" }} />
      <div style={{ textAlign: "center", fontSize: "12px" }}>
        -: Goods Verified at Gate :-
      </div>
    </div>
  );
};

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

export default GatePass;
