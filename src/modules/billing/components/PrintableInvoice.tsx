import React from "react";
import { Invoice } from "../types/billing";
import { formatCurrency } from "../utils/Helpers";
import { COMPANY_INFO } from "../constants/Mockdata";

interface Props {
  invoice: Invoice;
}

// Convert a number to Indian-format words (e.g. 1234 → "One Thousand Two Hundred Thirty Four Rupees Only")
const numberToWords = (num: number): string => {
  if (num === 0) return "Zero Rupees Only";

  const ones = [
    "",
    "One",
    "Two",
    "Three",
    "Four",
    "Five",
    "Six",
    "Seven",
    "Eight",
    "Nine",
    "Ten",
    "Eleven",
    "Twelve",
    "Thirteen",
    "Fourteen",
    "Fifteen",
    "Sixteen",
    "Seventeen",
    "Eighteen",
    "Nineteen",
  ];
  const tens = [
    "",
    "",
    "Twenty",
    "Thirty",
    "Forty",
    "Fifty",
    "Sixty",
    "Seventy",
    "Eighty",
    "Ninety",
  ];

  const twoDigit = (n: number): string => {
    if (n < 20) return ones[n];
    return (
      tens[Math.floor(n / 10)] + (n % 10 ? " " + ones[n % 10] : "")
    ).trim();
  };

  const threeDigit = (n: number): string => {
    const h = Math.floor(n / 100);
    const r = n % 100;
    return (
      (h ? ones[h] + " Hundred" : "") +
      (h && r ? " " : "") +
      (r ? twoDigit(r) : "")
    ).trim();
  };

  const rupees = Math.floor(num);
  const paise = Math.round((num - rupees) * 100);

  let words = "";
  const crore = Math.floor(rupees / 10000000);
  const lakh = Math.floor((rupees % 10000000) / 100000);
  const thousand = Math.floor((rupees % 100000) / 1000);
  const rest = rupees % 1000;

  if (crore) words += twoDigit(crore) + " Crore ";
  if (lakh) words += twoDigit(lakh) + " Lakh ";
  if (thousand) words += twoDigit(thousand) + " Thousand ";
  if (rest) words += threeDigit(rest);

  words = words.trim() + " Rupees";
  if (paise) words += " and " + twoDigit(paise) + " Paise";
  return words + " Only";
};

const PrintableInvoice: React.FC<Props> = ({ invoice }) => {
  const isPaid = invoice.status === "Paid";
  const isCancelled = invoice.status === "Cancelled";
  const hasBalance = invoice.balanceAmount > 0;

  return (
    <div
      className="printable-invoice bg-white text-gray-900"
      id="printable-invoice"
      style={{
        width: "210mm",
        minHeight: "297mm",
        padding: "16mm 14mm",
        margin: "0 auto",
        fontFamily:
          "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        fontSize: "11px",
        lineHeight: 1.5,
        color: "#111827",
      }}
    >
      {/* ── Top accent bar ─────────────────────────────────────────── */}
      <div
        style={{
          height: "4px",
          background:
            "linear-gradient(90deg, #047857 0%, #10b981 50%, #34d399 100%)",
          borderRadius: "2px",
          marginBottom: "20px",
        }}
      />

      {/* ── Header: company (left) / invoice meta (right) ──────────── */}
      <div className="flex justify-between items-start mb-8">
        <div style={{ maxWidth: "55%" }}>
          <div className="flex items-center gap-3 mb-3">
            <div
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "10px",
                background: "linear-gradient(135deg, #047857, #10b981)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontWeight: 900,
                fontSize: "20px",
                letterSpacing: "-0.5px",
              }}
            >
              {COMPANY_INFO.name.charAt(0)}
            </div>
            <div>
              <div
                style={{
                  fontSize: "20px",
                  fontWeight: 800,
                  letterSpacing: "-0.5px",
                  color: "#064e3b",
                  lineHeight: 1.1,
                }}
              >
                {COMPANY_INFO.name}
              </div>
              <div
                style={{
                  fontSize: "10px",
                  color: "#6b7280",
                  marginTop: "2px",
                  letterSpacing: "0.3px",
                }}
              >
                {COMPANY_INFO.tagline}
              </div>
            </div>
          </div>
          <div
            style={{
              fontSize: "10px",
              color: "#4b5563",
              lineHeight: 1.7,
            }}
          >
            <div>{COMPANY_INFO.address}</div>
            <div>
              <span style={{ color: "#9ca3af" }}>Phone</span>{" "}
              {COMPANY_INFO.phone}
              <span style={{ margin: "0 6px", color: "#d1d5db" }}>|</span>
              <span style={{ color: "#9ca3af" }}>Email</span>{" "}
              {COMPANY_INFO.email}
            </div>
            <div>
              <span style={{ color: "#9ca3af" }}>GSTIN</span>{" "}
              <span style={{ fontFamily: "monospace", fontWeight: 600 }}>
                {COMPANY_INFO.gstin}
              </span>
              <span style={{ margin: "0 6px", color: "#d1d5db" }}>|</span>
              <span style={{ color: "#9ca3af" }}>FSSAI</span>{" "}
              <span style={{ fontFamily: "monospace", fontWeight: 600 }}>
                {COMPANY_INFO.fssai}
              </span>
            </div>
          </div>
        </div>

        {/* Right: invoice meta box */}
        <div
          style={{
            textAlign: "right",
            minWidth: "220px",
          }}
        >
          <div
            style={{
              display: "inline-block",
              padding: "4px 10px",
              borderRadius: "4px",
              background: "#ecfdf5",
              color: "#047857",
              fontSize: "10px",
              fontWeight: 700,
              letterSpacing: "1.5px",
              textTransform: "uppercase",
              marginBottom: "10px",
            }}
          >
            Tax Invoice
          </div>
          <div
            style={{
              fontFamily: "monospace",
              fontSize: "16px",
              fontWeight: 800,
              color: "#111827",
              letterSpacing: "-0.3px",
            }}
          >
            {invoice.invoiceNo}
          </div>
          <div
            style={{
              fontSize: "11px",
              color: "#6b7280",
              marginTop: "4px",
            }}
          >
            Issued <strong>{invoice.date}</strong> · {invoice.time}
          </div>
          {invoice.dueDate && (
            <div
              style={{
                fontSize: "11px",
                color: hasBalance ? "#dc2626" : "#6b7280",
                marginTop: "2px",
                fontWeight: hasBalance ? 600 : 400,
              }}
            >
              Due by {invoice.dueDate}
            </div>
          )}
          <div
            style={{
              marginTop: "10px",
              display: "inline-block",
              padding: "5px 12px",
              borderRadius: "6px",
              fontSize: "10px",
              fontWeight: 700,
              letterSpacing: "1px",
              textTransform: "uppercase",
              ...(isPaid
                ? {
                    background: "#d1fae5",
                    color: "#065f46",
                    border: "1px solid #6ee7b7",
                  }
                : isCancelled
                ? {
                    background: "#f3f4f6",
                    color: "#6b7280",
                    border: "1px solid #d1d5db",
                  }
                : hasBalance
                ? {
                    background: "#fef3c7",
                    color: "#92400e",
                    border: "1px solid #fcd34d",
                  }
                : {
                    background: "#dbeafe",
                    color: "#1e40af",
                    border: "1px solid #93c5fd",
                  }),
            }}
          >
            {invoice.status}
          </div>
        </div>
      </div>

      {/* ── Bill To / Details two-column ──────────────────────────── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "16px",
          marginBottom: "20px",
        }}
      >
        <div
          style={{
            padding: "14px 16px",
            background: "#f9fafb",
            borderRadius: "8px",
            borderLeft: "3px solid #10b981",
          }}
        >
          <div
            style={{
              fontSize: "9px",
              fontWeight: 700,
              color: "#9ca3af",
              letterSpacing: "1.5px",
              textTransform: "uppercase",
              marginBottom: "6px",
            }}
          >
            Bill To
          </div>
          <div
            style={{
              fontSize: "14px",
              fontWeight: 700,
              color: "#111827",
              marginBottom: "2px",
            }}
          >
            {invoice.customerName}
          </div>
          <div
            style={{
              fontSize: "10px",
              fontFamily: "monospace",
              color: "#6b7280",
              marginBottom: "6px",
            }}
          >
            {invoice.customerId}
          </div>
          {invoice.customerPhone && (
            <div style={{ fontSize: "11px", color: "#374151" }}>
              <span style={{ color: "#9ca3af" }}>Phone</span>{" "}
              {invoice.customerPhone}
            </div>
          )}
          {invoice.customerAddress && (
            <div
              style={{
                fontSize: "11px",
                color: "#374151",
                marginTop: "2px",
                lineHeight: 1.5,
              }}
            >
              {invoice.customerAddress}
            </div>
          )}
        </div>

        <div
          style={{
            padding: "14px 16px",
            background: "#f9fafb",
            borderRadius: "8px",
          }}
        >
          <div
            style={{
              fontSize: "9px",
              fontWeight: 700,
              color: "#9ca3af",
              letterSpacing: "1.5px",
              textTransform: "uppercase",
              marginBottom: "8px",
            }}
          >
            Invoice Details
          </div>
          {[
            { label: "Customer Type", value: invoice.customerType },
            { label: "Payment Mode", value: invoice.paymentMode },
            { label: "Delivery", value: invoice.deliveryMode },
            { label: "Place of Supply", value: "Tamil Nadu (33)" },
          ].map((row) => (
            <div
              key={row.label}
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "11px",
                padding: "3px 0",
              }}
            >
              <span style={{ color: "#6b7280" }}>{row.label}</span>
              <span style={{ color: "#111827", fontWeight: 600 }}>
                {row.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Items table ───────────────────────────────────────────── */}
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginBottom: "20px",
          fontSize: "11px",
        }}
      >
        <thead>
          <tr
            style={{
              background: "#064e3b",
              color: "white",
            }}
          >
            <th
              style={{
                textAlign: "center",
                padding: "10px 8px",
                fontSize: "10px",
                fontWeight: 700,
                letterSpacing: "0.5px",
                textTransform: "uppercase",
                width: "32px",
              }}
            >
              #
            </th>
            <th
              style={{
                textAlign: "left",
                padding: "10px 8px",
                fontSize: "10px",
                fontWeight: 700,
                letterSpacing: "0.5px",
                textTransform: "uppercase",
              }}
            >
              Description
            </th>
            <th
              style={{
                textAlign: "left",
                padding: "10px 8px",
                fontSize: "10px",
                fontWeight: 700,
                letterSpacing: "0.5px",
                textTransform: "uppercase",
                width: "80px",
              }}
            >
              HSN/SKU
            </th>
            <th
              style={{
                textAlign: "center",
                padding: "10px 8px",
                fontSize: "10px",
                fontWeight: 700,
                letterSpacing: "0.5px",
                textTransform: "uppercase",
                width: "50px",
              }}
            >
              Qty
            </th>
            <th
              style={{
                textAlign: "right",
                padding: "10px 8px",
                fontSize: "10px",
                fontWeight: 700,
                letterSpacing: "0.5px",
                textTransform: "uppercase",
                width: "80px",
              }}
            >
              Rate
            </th>
            <th
              style={{
                textAlign: "right",
                padding: "10px 12px",
                fontSize: "10px",
                fontWeight: 700,
                letterSpacing: "0.5px",
                textTransform: "uppercase",
                width: "100px",
              }}
            >
              Amount
            </th>
          </tr>
        </thead>
        <tbody>
          {invoice.items.map((item, idx) => (
            <tr
              key={idx}
              style={{
                borderBottom: "1px solid #f3f4f6",
                background: idx % 2 === 0 ? "white" : "#fafafa",
              }}
            >
              <td
                style={{
                  padding: "10px 8px",
                  textAlign: "center",
                  color: "#9ca3af",
                  fontWeight: 600,
                }}
              >
                {idx + 1}
              </td>
              <td
                style={{
                  padding: "10px 8px",
                  fontWeight: 600,
                  color: "#111827",
                }}
              >
                {item.product}
              </td>
              <td
                style={{
                  padding: "10px 8px",
                  fontFamily: "monospace",
                  fontSize: "10px",
                  color: "#6b7280",
                }}
              >
                {item.sku || "—"}
              </td>
              <td
                style={{
                  padding: "10px 8px",
                  textAlign: "center",
                  color: "#374151",
                  fontWeight: 600,
                }}
              >
                {item.qty}
              </td>
              <td
                style={{
                  padding: "10px 8px",
                  textAlign: "right",
                  color: "#374151",
                }}
              >
                {formatCurrency(item.price)}
              </td>
              <td
                style={{
                  padding: "10px 12px",
                  textAlign: "right",
                  fontWeight: 700,
                  color: "#111827",
                }}
              >
                {formatCurrency(item.total)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ── Amount in words + Totals side by side ─────────────────── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 280px",
          gap: "16px",
          marginBottom: "24px",
        }}
      >
        {/* Amount in words */}
        <div
          style={{
            padding: "14px 16px",
            background: "#fffbeb",
            border: "1px dashed #fcd34d",
            borderRadius: "8px",
            alignSelf: "start",
          }}
        >
          <div
            style={{
              fontSize: "9px",
              fontWeight: 700,
              color: "#92400e",
              letterSpacing: "1.5px",
              textTransform: "uppercase",
              marginBottom: "4px",
            }}
          >
            Amount in Words
          </div>
          <div
            style={{
              fontSize: "12px",
              color: "#78350f",
              fontWeight: 600,
              fontStyle: "italic",
              lineHeight: 1.5,
            }}
          >
            {numberToWords(invoice.grandTotal)}
          </div>
        </div>

        {/* Totals panel */}
        <div
          style={{
            border: "1px solid #e5e7eb",
            borderRadius: "8px",
            overflow: "hidden",
          }}
        >
          <div style={{ padding: "12px 14px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "11px",
                padding: "3px 0",
              }}
            >
              <span style={{ color: "#6b7280" }}>Subtotal</span>
              <span style={{ color: "#111827", fontWeight: 600 }}>
                {formatCurrency(invoice.subtotal)}
              </span>
            </div>
            {invoice.gst > 0 && (
              <>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "11px",
                    padding: "3px 0",
                  }}
                >
                  <span style={{ color: "#6b7280" }}>CGST (9%)</span>
                  <span style={{ color: "#111827", fontWeight: 600 }}>
                    +{formatCurrency(invoice.gst / 2)}
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "11px",
                    padding: "3px 0",
                  }}
                >
                  <span style={{ color: "#6b7280" }}>SGST (9%)</span>
                  <span style={{ color: "#111827", fontWeight: 600 }}>
                    +{formatCurrency(invoice.gst / 2)}
                  </span>
                </div>
              </>
            )}
            {invoice.discount > 0 && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "11px",
                  padding: "3px 0",
                }}
              >
                <span style={{ color: "#6b7280" }}>Discount</span>
                <span style={{ color: "#059669", fontWeight: 600 }}>
                  -{formatCurrency(invoice.discount)}
                </span>
              </div>
            )}
          </div>

          {/* Grand Total - emphasised */}
          <div
            style={{
              background: "linear-gradient(135deg, #047857, #10b981)",
              color: "white",
              padding: "14px 14px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span
              style={{
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "1px",
                textTransform: "uppercase",
              }}
            >
              Grand Total
            </span>
            <span style={{ fontSize: "20px", fontWeight: 800 }}>
              {formatCurrency(invoice.grandTotal)}
            </span>
          </div>

          {/* Paid / Balance */}
          <div
            style={{
              padding: "10px 14px",
              background: "#f9fafb",
              borderTop: "1px solid #e5e7eb",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "11px",
                padding: "2px 0",
              }}
            >
              <span style={{ color: "#059669", fontWeight: 600 }}>Paid</span>
              <span style={{ color: "#059669", fontWeight: 700 }}>
                {formatCurrency(invoice.paidAmount)}
              </span>
            </div>
            {hasBalance && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "12px",
                  padding: "4px 0 2px",
                  marginTop: "4px",
                  borderTop: "1px dashed #e5e7eb",
                }}
              >
                <span style={{ color: "#dc2626", fontWeight: 700 }}>
                  Balance Due
                </span>
                <span style={{ color: "#dc2626", fontWeight: 800 }}>
                  {formatCurrency(invoice.balanceAmount)}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Bank details (only when there's a balance due) ────────── */}
      {hasBalance && !isCancelled && (
        <div
          style={{
            padding: "12px 16px",
            background: "#eff6ff",
            border: "1px solid #bfdbfe",
            borderRadius: "8px",
            marginBottom: "20px",
          }}
        >
          <div
            style={{
              fontSize: "9px",
              fontWeight: 700,
              color: "#1e40af",
              letterSpacing: "1.5px",
              textTransform: "uppercase",
              marginBottom: "6px",
            }}
          >
            Payment Instructions
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: "12px",
              fontSize: "10px",
              color: "#1e3a8a",
            }}
          >
            <div>
              <div style={{ color: "#60a5fa", fontSize: "9px" }}>Account</div>
              <div style={{ fontWeight: 600 }}>{COMPANY_INFO.name}</div>
            </div>
            <div>
              <div style={{ color: "#60a5fa", fontSize: "9px" }}>
                UPI / Bank
              </div>
              <div style={{ fontWeight: 600 }}>
                Contact us at {COMPANY_INFO.phone}
              </div>
            </div>
            <div>
              <div style={{ color: "#60a5fa", fontSize: "9px" }}>Reference</div>
              <div style={{ fontFamily: "monospace", fontWeight: 600 }}>
                {invoice.invoiceNo}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Notes ─────────────────────────────────────────────────── */}
      {invoice.notes && (
        <div
          style={{
            padding: "10px 14px",
            background: "#f9fafb",
            borderLeft: "3px solid #6b7280",
            marginBottom: "20px",
            fontSize: "11px",
            color: "#374151",
          }}
        >
          <strong style={{ color: "#111827" }}>Note: </strong>
          {invoice.notes}
        </div>
      )}

      {/* ── Footer: Terms + Signatures ────────────────────────────── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "24px",
          paddingTop: "16px",
          borderTop: "1px solid #e5e7eb",
        }}
      >
        <div>
          <div
            style={{
              fontSize: "9px",
              fontWeight: 700,
              color: "#9ca3af",
              letterSpacing: "1.5px",
              textTransform: "uppercase",
              marginBottom: "6px",
            }}
          >
            Terms & Conditions
          </div>
          <ol
            style={{
              fontSize: "10px",
              color: "#4b5563",
              paddingLeft: "16px",
              lineHeight: 1.7,
              margin: 0,
            }}
          >
            <li>Goods once sold are non-refundable.</li>
            <li>Empty cans/jars to be returned within 7 days.</li>
            <li>Payment due within 15 days for credit sales.</li>
            <li>
              Any dispute is subject to{" "}
              {COMPANY_INFO.address?.split(",").pop()?.trim() ?? "local"}{" "}
              jurisdiction.
            </li>
          </ol>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "12px",
            alignItems: "end",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                borderTop: "1px solid #9ca3af",
                paddingTop: "4px",
                marginTop: "32px",
                fontSize: "10px",
                color: "#6b7280",
              }}
            >
              Receiver's Signature
            </div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                fontSize: "10px",
                fontWeight: 700,
                color: "#111827",
                marginBottom: "32px",
              }}
            >
              For {COMPANY_INFO.name}
            </div>
            <div
              style={{
                borderTop: "1px solid #9ca3af",
                paddingTop: "4px",
                fontSize: "10px",
                color: "#6b7280",
              }}
            >
              Authorised Signatory
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom line ───────────────────────────────────────────── */}
      <div
        style={{
          marginTop: "24px",
          paddingTop: "12px",
          borderTop: "1px dashed #e5e7eb",
          textAlign: "center",
          fontSize: "9px",
          color: "#9ca3af",
        }}
      >
        Thank you for your business. This is a computer-generated invoice and
        does not require a physical signature.
        <br />
        <span style={{ color: "#d1d5db" }}>
          Generated by {COMPANY_INFO.name} ERP · {invoice.date}
        </span>
      </div>
    </div>
  );
};

export default PrintableInvoice;
