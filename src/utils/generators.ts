import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import { fmt, fmtDate } from "./helpers";
import type { LedgerEntry } from "../modules/customers/types/Customer";
import { ENTRY_MAP } from "../modules/customers/constants/ledgerConstants";

const COMPANY = {
  name: "Balaji Aqua Water Plant",
  tagline: "Pure Water, Delivered Daily",
  addressLine1: "No. 12, MTH Road, Padi",
  addressLine2: "Chennai, Tamil Nadu – 600050",
  phone: "+91 98765 43210",
  email: "billing@balajiaqua.in",
  gstin: "33AABCB1234A1Z5",
  pan: "AABCB1234A",
  bank: {
    name: "HDFC Bank",
    accountName: "Balaji Aqua Water Plant",
    accountNumber: "50100123456789",
    ifsc: "HDFC0001234",
    branch: "Padi Branch",
  },
  upi: "balajiaqua@hdfcbank",
  terms: [
    "Payment due within 7 days of invoice date.",
    "Interest @ 18% p.a. on overdue amounts.",
    "Goods once sold will not be taken back.",
    "Subject to Chennai jurisdiction only.",
  ],
};

// ── Color tokens (RGB tuples) ───────────────────────────────────────────
const PRIMARY: [number, number, number] = [37, 99, 235]; // blue-600
const DARK: [number, number, number] = [15, 23, 42]; // slate-900
const MID: [number, number, number] = [71, 85, 105]; // slate-600
const MUTED: [number, number, number] = [100, 116, 139]; // slate-500
const FAINT: [number, number, number] = [148, 163, 184]; // slate-400
const BORDER: [number, number, number] = [226, 232, 240]; // slate-200
const LIGHT_BG: [number, number, number] = [248, 250, 252]; // slate-50
const WHITE: [number, number, number] = [255, 255, 255];

const GREEN: [number, number, number] = [16, 185, 129];
const AMBER: [number, number, number] = [245, 158, 11];
const RED: [number, number, number] = [239, 68, 68];

// ── Invoice shape ───────────────────────────────────────────────────────
interface InvoiceShape {
  id: string;
  invoiceNumber: string;
  status: string;
  customer?: { id: string; name: string; phone: string } | null;
  walkInName?: string | null;
  walkInPhone?: string | null;
  invoiceDate: string | Date;
  dueDate?: string | Date | null;
  subtotal: number;
  cgst: number;
  sgst: number;
  igst: number;
  totalAmount: number;
  paidAmount: number;
  balanceDue: number;
  gstEnabled: boolean;
  gstRate: number;
  notes?: string | null;
  items?: Array<{
    id: string;
    productName: string;
    sku: string;
    unit: string;
    quantity: number;
    unitPrice: number;
    discount: number;
    taxAmount: number;
    lineTotal: number;
    hsn?: string | null;
  }>;
}

interface InvoicePDFOptions {
  print?: boolean;
}

// ── Helpers ─────────────────────────────────────────────────────────────
const getBaseAmount = (entry: LedgerEntry): number => {
  const taxes = entry.cgst + entry.sgst + entry.igst;
  if (entry.debitAmount > 0) return entry.debitAmount - taxes;
  if (entry.creditAmount > 0) return entry.creditAmount - taxes;
  return 0;
};

// Status → badge colour + label
const getStatusBadge = (
  status: string
): { color: [number, number, number]; label: string } => {
  const s = (status ?? "").toUpperCase();
  if (s === "PAID") return { color: GREEN, label: "PAID" };
  if (s === "PARTIAL") return { color: AMBER, label: "PARTIAL" };
  if (s === "CANCELLED") return { color: RED, label: "CANCELLED" };
  if (s === "OVERDUE") return { color: RED, label: "OVERDUE" };
  return { color: PRIMARY, label: s || "CONFIRMED" };
};

// Indian number → words (handles up to 9,99,99,999)
const numberToWords = (num: number): string => {
  if (num === 0) return "Zero Rupees Only";
  const a = [
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
  const b = [
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
    if (n < 20) return a[n];
    return b[Math.floor(n / 10)] + (n % 10 ? " " + a[n % 10] : "");
  };
  const threeDigit = (n: number): string => {
    const h = Math.floor(n / 100);
    const r = n % 100;
    return (
      (h ? a[h] + " Hundred" + (r ? " " : "") : "") + (r ? twoDigit(r) : "")
    );
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

// ═══════════════════════════════════════════════════════════════════════
// INVOICE PDF
// ═══════════════════════════════════════════════════════════════════════
export const generateInvoicePDF = (
  entry: LedgerEntry,
  invoice: InvoiceShape | null,
  showGST: boolean,
  options: InvoicePDFOptions = {}
): void => {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pageW = doc.internal.pageSize.width;
  const pageH = doc.internal.pageSize.height;
  const margin = 14;
  const contentW = pageW - margin * 2;
  let y = 0;

  // Resolve customer + meta
  const customerName =
    invoice?.customer?.name ?? invoice?.walkInName ?? "Walk-in Customer";
  const customerPhone = invoice?.customer?.phone ?? invoice?.walkInPhone ?? "—";
  const status = invoice?.status ?? "CONFIRMED";
  const badge = getStatusBadge(status);
  const dueDateStr = invoice?.dueDate
    ? fmtDate(
        typeof invoice.dueDate === "string"
          ? invoice.dueDate
          : invoice.dueDate.toISOString()
      )
    : "On receipt";
  const invoiceNum = entry.referenceNo || invoice?.invoiceNumber || "—";

  // ─────────────────────────────────────────────────────────────────────
  // HEADER — brand block + invoice meta
  // ─────────────────────────────────────────────────────────────────────
  // Left brand
  doc.setFillColor(...PRIMARY);
  doc.rect(0, 0, pageW, 4, "F"); // accent stripe

  y = 16;
  doc.setFontSize(20);
  doc.setTextColor(...DARK);
  doc.setFont("helvetica", "bold");
  doc.text(COMPANY.name, margin, y);
  y += 5;
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...MUTED);
  doc.text(COMPANY.tagline, margin, y);
  y += 6;
  doc.setFontSize(7.5);
  doc.setTextColor(...MID);
  doc.text(COMPANY.addressLine1, margin, y);
  y += 3.5;
  doc.text(COMPANY.addressLine2, margin, y);
  y += 3.5;
  doc.text(`${COMPANY.phone}  •  ${COMPANY.email}`, margin, y);
  y += 4;
  // GSTIN + PAN on one line, but use measured width so they don't overlap
  // or leave a huge gap regardless of GSTIN length
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...DARK);
  const gstinLabel = `GSTIN: ${COMPANY.gstin}`;
  doc.text(gstinLabel, margin, y);
  const gstinW = doc.getTextWidth(gstinLabel);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...MID);
  doc.text(`  •  PAN: ${COMPANY.pan}`, margin + gstinW + 1, y);

  // Right meta — "TAX INVOICE" label + number + dates
  const rightX = pageW - margin;
  let yR = 16;
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...PRIMARY);
  doc.text("TAX INVOICE", rightX, yR, { align: "right" });
  yR += 8;

  doc.setFontSize(11);
  doc.setTextColor(...DARK);
  doc.text(invoiceNum, rightX, yR, { align: "right" });
  yR += 6;

  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...MUTED);
  // Labels start far enough left that right-aligned values can't collide.
  // Date values can be up to ~22mm wide at 8pt bold; give labels 30mm clear
  // space by parking them at rightX - 50.
  const metaLabelX = rightX - 50;

  doc.text("Issue Date", metaLabelX, yR);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...DARK);
  doc.text(fmtDate(entry.entryDate), rightX, yR, { align: "right" });
  yR += 5;

  doc.setFont("helvetica", "normal");
  doc.setTextColor(...MUTED);
  doc.text("Due Date", metaLabelX, yR);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...DARK);
  doc.text(dueDateStr, rightX, yR, { align: "right" });
  yR += 7;

  // Status pill
  const pillText = badge.label;
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  const pillW = doc.getTextWidth(pillText) + 8;
  doc.setFillColor(...badge.color);
  doc.roundedRect(rightX - pillW, yR - 4.2, pillW, 6, 1.2, 1.2, "F");
  doc.setTextColor(...WHITE);
  doc.text(pillText, rightX - 4, yR, { align: "right" });

  y = Math.max(y, yR) + 6;

  // Divider
  doc.setDrawColor(...BORDER);
  doc.setLineWidth(0.3);
  doc.line(margin, y, pageW - margin, y);
  y += 6;

  // ─────────────────────────────────────────────────────────────────────
  // BILL TO  +  PAYMENT SUMMARY
  // ─────────────────────────────────────────────────────────────────────
  const colW = (contentW - 6) / 2;
  const billY = y;

  // BILL TO box
  doc.setFontSize(7);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...FAINT);
  doc.text("BILL TO", margin, y);
  y += 5;
  doc.setFontSize(11);
  doc.setTextColor(...DARK);
  doc.setFont("helvetica", "bold");
  doc.text(customerName, margin, y);
  y += 5;
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...MID);
  doc.text(`Phone: ${customerPhone}`, margin, y);
  y += 4;
  if (invoice?.customer?.id) {
    doc.text(`Customer ID: ${invoice.customer.id.slice(0, 12)}…`, margin, y);
    y += 4;
  }

  // PAYMENT SUMMARY box (right side)
  let yP = billY;
  const pX = margin + colW + 6;
  doc.setFontSize(7);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...FAINT);
  doc.text("PAYMENT SUMMARY", pX, yP);
  yP += 5;

  doc.setFillColor(...LIGHT_BG);
  doc.roundedRect(pX, yP, colW, 24, 1.5, 1.5, "F");
  doc.setDrawColor(...BORDER);
  doc.setLineWidth(0.2);
  doc.roundedRect(pX, yP, colW, 24, 1.5, 1.5, "S");

  doc.setFontSize(7.5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...MUTED);
  doc.text("Total", pX + 4, yP + 6);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...DARK);
  doc.text(
    "Rs. " + fmt(invoice?.totalAmount ?? entry.debitAmount),
    pX + colW - 4,
    yP + 6,
    { align: "right" }
  );

  doc.setFont("helvetica", "normal");
  doc.setTextColor(...MUTED);
  doc.text("Paid", pX + 4, yP + 12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...GREEN);
  doc.text("Rs. " + fmt(invoice?.paidAmount ?? 0), pX + colW - 4, yP + 12, {
    align: "right",
  });

  doc.setFont("helvetica", "normal");
  doc.setTextColor(...MUTED);
  doc.text("Balance Due", pX + 4, yP + 19);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...RED);
  doc.text(
    "Rs. " + fmt(invoice?.balanceDue ?? entry.debitAmount),
    pX + colW - 4,
    yP + 19,
    { align: "right" }
  );
  yP += 28;

  y = Math.max(y + 2, yP);

  // ─────────────────────────────────────────────────────────────────────
  // LINE ITEMS TABLE
  // ─────────────────────────────────────────────────────────────────────
  const items = invoice?.items ?? [];

  doc.setFontSize(7);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...FAINT);
  doc.text("LINE ITEMS", margin, y);
  y += 3;

  if (items.length > 0) {
    const heads = showGST
      ? [["#", "Item", "HSN", "Qty", "Rate", "Tax", "Amount"]]
      : [["#", "Item", "HSN", "Qty", "Rate", "Amount"]];

    const rows = items.map((it, i) => {
      const baseLine = it.unitPrice * it.quantity - it.discount;
      const lineAmount = showGST ? baseLine + it.taxAmount : baseLine;
      const r = [
        String(i + 1),
        it.productName + (it.sku ? `\n${it.sku}` : ""),
        it.hsn || "—",
        `${it.quantity} ${it.unit}`,
        "Rs. " + fmt(it.unitPrice),
      ];
      if (showGST) r.push("Rs. " + fmt(it.taxAmount));
      r.push("Rs. " + fmt(lineAmount));
      return r;
    });

    autoTable(doc, {
      startY: y,
      head: heads,
      body: rows,
      margin: { left: margin, right: margin },
      theme: "plain",
      headStyles: {
        fillColor: DARK,
        textColor: WHITE,
        fontStyle: "bold",
        fontSize: 7.5,
        cellPadding: 3.5,
      },
      bodyStyles: {
        fontSize: 8,
        textColor: DARK,
        cellPadding: 3.5,
        lineColor: BORDER,
        lineWidth: 0.1,
      },
      alternateRowStyles: { fillColor: [252, 253, 254] },
      columnStyles: {
        0: { cellWidth: 8, halign: "center" },
        1: { cellWidth: "auto" },
        2: { cellWidth: 18, halign: "center" },
        3: { cellWidth: 18, halign: "center" },
        4: { cellWidth: 22, halign: "right" },
        ...(showGST
          ? {
              5: { cellWidth: 20, halign: "right" },
              6: { cellWidth: 26, halign: "right" },
            }
          : {
              5: { cellWidth: 26, halign: "right" },
            }),
      },
    });

    y = (doc as any).lastAutoTable.finalY + 4;

    // ── Totals box (right-aligned) ──
    const tW = 80;
    const tX = pageW - margin - tW;

    const subtotal =
      invoice?.subtotal ??
      items.reduce((s, i) => s + (i.unitPrice * i.quantity - i.discount), 0);
    const totalCGST = invoice?.cgst ?? 0;
    const totalSGST = invoice?.sgst ?? 0;
    const totalIGST = invoice?.igst ?? 0;
    const grandTotal =
      invoice?.totalAmount ?? subtotal + totalCGST + totalSGST + totalIGST;

    const drawTotalRow = (label: string, value: string, bold = false) => {
      doc.setFontSize(8.5);
      doc.setFont("helvetica", bold ? "bold" : "normal");
      doc.setTextColor(...(bold ? DARK : MUTED));
      doc.text(label, tX + 4, y + 5);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(...DARK);
      doc.text(value, tX + tW - 4, y + 5, { align: "right" });
      y += 7;
    };

    drawTotalRow("Subtotal", "Rs. " + fmt(subtotal));

    if (showGST) {
      if (totalCGST > 0) drawTotalRow("CGST", "Rs. " + fmt(totalCGST));
      if (totalSGST > 0) drawTotalRow("SGST", "Rs. " + fmt(totalSGST));
      if (totalIGST > 0) drawTotalRow("IGST", "Rs. " + fmt(totalIGST));
    }

    // Grand total — emphasized bar
    doc.setFillColor(...PRIMARY);
    doc.roundedRect(tX, y, tW, 11, 1.5, 1.5, "F");
    doc.setFontSize(9.5);
    doc.setTextColor(...WHITE);
    doc.setFont("helvetica", "bold");
    doc.text(showGST ? "GRAND TOTAL" : "TOTAL", tX + 4, y + 7.2);
    doc.setFontSize(11);
    doc.text("Rs. " + fmt(grandTotal), tX + tW - 4, y + 7.5, {
      align: "right",
    });
    y += 14;

    // ── Amount in words ──
    doc.setFontSize(7.5);
    doc.setFont("helvetica", "italic");
    doc.setTextColor(...MID);
    doc.text("Amount in words:", margin, y);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...DARK);
    const wordsLine = numberToWords(grandTotal);
    doc.text(wordsLine, margin + 24, y);
    y += 8;
  } else {
    doc.setFontSize(9);
    doc.setFont("helvetica", "italic");
    doc.setTextColor(...MUTED);
    doc.text("No line items on this invoice.", margin, y + 8);
    y += 16;
  }

  // ─────────────────────────────────────────────────────────────────────
  // PAYMENT DETAILS + TERMS
  // ─────────────────────────────────────────────────────────────────────
  // Stop if we're getting too close to footer
  const remainingSpace = pageH - 30 - y;
  if (remainingSpace < 50) {
    doc.addPage();
    y = margin;
  }

  const halfW = (contentW - 6) / 2;
  const sectionY = y;

  // PAYMENT DETAILS (left)
  doc.setFontSize(7);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...FAINT);
  doc.text("PAYMENT DETAILS", margin, y);
  y += 4;
  doc.setFillColor(...LIGHT_BG);
  doc.roundedRect(margin, y, halfW, 36, 1.5, 1.5, "F");
  doc.setDrawColor(...BORDER);
  doc.setLineWidth(0.2);
  doc.roundedRect(margin, y, halfW, 36, 1.5, 1.5, "S");
  y += 5;

  const drawBank = (label: string, value: string) => {
    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...MUTED);
    doc.text(label, margin + 4, y);
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...DARK);
    doc.text(value, margin + 30, y);
    y += 5;
  };

  drawBank("Bank", COMPANY.bank.name);
  drawBank("A/c Name", COMPANY.bank.accountName);
  drawBank("A/c No.", COMPANY.bank.accountNumber);
  drawBank("IFSC", COMPANY.bank.ifsc);
  drawBank("UPI", COMPANY.upi);

  // TERMS (right)
  let yT = sectionY;
  const tX = margin + halfW + 6;
  doc.setFontSize(7);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...FAINT);
  doc.text("TERMS & CONDITIONS", tX, yT);
  yT += 4;
  doc.setFillColor(...LIGHT_BG);
  doc.roundedRect(tX, yT, halfW, 36, 1.5, 1.5, "F");
  doc.setDrawColor(...BORDER);
  doc.setLineWidth(0.2);
  doc.roundedRect(tX, yT, halfW, 36, 1.5, 1.5, "S");
  yT += 5;

  doc.setFontSize(7.2);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...MID);
  COMPANY.terms.forEach((term, i) => {
    const lines = doc.splitTextToSize(`${i + 1}. ${term}`, halfW - 8);
    doc.text(lines, tX + 4, yT);
    yT += lines.length * 3.5 + 1;
  });

  y = Math.max(y, yT) + 6;

  // ─────────────────────────────────────────────────────────────────────
  // SIGNATURE
  // ─────────────────────────────────────────────────────────────────────
  const sigY = pageH - 30;
  doc.setDrawColor(...FAINT);
  doc.setLineWidth(0.3);
  doc.line(pageW - margin - 50, sigY, pageW - margin, sigY);
  doc.setFontSize(7.5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...MID);
  doc.text(`For ${COMPANY.name}`, pageW - margin, sigY - 2, { align: "right" });
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...DARK);
  doc.text("Authorized Signatory", pageW - margin, sigY + 4, {
    align: "right",
  });

  // Notes on left
  if (invoice?.notes) {
    doc.setFontSize(7);
    doc.setFont("helvetica", "italic");
    doc.setTextColor(...MUTED);
    const wrapped = doc.splitTextToSize(`Note: ${invoice.notes}`, 90);
    doc.text(wrapped, margin, sigY - 2);
  }

  // ─────────────────────────────────────────────────────────────────────
  // FOOTER
  // ─────────────────────────────────────────────────────────────────────
  const fY = pageH - 10;
  doc.setDrawColor(...BORDER);
  doc.setLineWidth(0.2);
  doc.line(margin, fY - 4, pageW - margin, fY - 4);

  doc.setFontSize(6.5);
  doc.setTextColor(...FAINT);
  doc.setFont("helvetica", "normal");
  doc.text(
    "This is a computer-generated invoice and does not require a physical signature.",
    margin,
    fY
  );
  doc.text(
    `Generated: ${new Date().toLocaleDateString(
      "en-IN"
    )} ${new Date().toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    })}`,
    pageW - margin,
    fY,
    { align: "right" }
  );

  // ── Output ──
  const filename = `${invoiceNum}_${new Date().toISOString().slice(0, 10)}.pdf`;

  if (options.print) {
    doc.autoPrint();
    const blobUrl = doc.output("bloburl");
    window.open(blobUrl, "_blank");
  } else {
    doc.save(filename);
  }
};

// ═══════════════════════════════════════════════════════════════════════
// LEDGER PDF (unchanged)
// ═══════════════════════════════════════════════════════════════════════
export const generateLedgerPDF = (
  entries: LedgerEntry[],
  fromDate: string,
  toDate: string,
  _exportType: string,
  showGST: boolean
): void => {
  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
  const pageW = doc.internal.pageSize.width;
  const pageH = doc.internal.pageSize.height;
  const margin = 14;

  doc.setFillColor(...PRIMARY);
  doc.rect(0, 0, pageW, 30, "F");
  doc.setFontSize(16);
  doc.setTextColor(...WHITE);
  doc.setFont("helvetica", "bold");
  doc.text(
    "Account Ledger Report" + (showGST ? " (With GST)" : " (Excl. GST)"),
    margin,
    14
  );
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(200, 220, 255);
  doc.text(`${COMPANY.name} • ${COMPANY.gstin}`, margin, 21);
  doc.setTextColor(...WHITE);
  doc.text(
    fromDate && toDate
      ? fmtDate(fromDate) + " to " + fmtDate(toDate)
      : "All Dates",
    pageW - margin,
    12,
    { align: "right" }
  );
  doc.text(
    "Entries: " +
      entries.length +
      " | Generated: " +
      new Date().toLocaleDateString("en-IN"),
    pageW - margin,
    19,
    { align: "right" }
  );

  const heads = showGST
    ? [
        [
          "Date",
          "Type",
          "Description",
          "Ref",
          "Debit",
          "Credit",
          "CGST",
          "SGST",
          "Balance",
        ],
      ]
    : [
        [
          "Date",
          "Type",
          "Description",
          "Ref",
          "Debit (Base)",
          "Credit (Base)",
          "Balance",
        ],
      ];

  const rows = entries.map((r) => {
    const baseAmount = getBaseAmount(r);
    return showGST
      ? [
          fmtDate(r.entryDate),
          ENTRY_MAP[r.entryType]?.label ?? r.entryType,
          r.description ?? "-",
          r.referenceNo ?? "-",
          r.debitAmount > 0 ? "Rs." + fmt(r.debitAmount) : "-",
          r.creditAmount > 0 ? "Rs." + fmt(r.creditAmount) : "-",
          r.cgst > 0 ? "Rs." + fmt(r.cgst) : "-",
          r.sgst > 0 ? "Rs." + fmt(r.sgst) : "-",
          "Rs." + fmt(r.balance),
        ]
      : [
          fmtDate(r.entryDate),
          ENTRY_MAP[r.entryType]?.label ?? r.entryType,
          r.description ?? "-",
          r.referenceNo ?? "-",
          r.debitAmount > 0 ? "Rs." + fmt(baseAmount) : "-",
          r.creditAmount > 0 ? "Rs." + fmt(baseAmount) : "-",
          "Rs." + fmt(r.balance),
        ];
  });

  autoTable(doc, {
    startY: 38,
    head: heads,
    body: rows,
    margin: { left: margin, right: margin },
    theme: "plain",
    headStyles: {
      fillColor: PRIMARY,
      textColor: WHITE,
      fontStyle: "bold",
      fontSize: 7.5,
      cellPadding: 3.5,
    },
    bodyStyles: {
      fontSize: 7,
      textColor: [51, 65, 85],
      cellPadding: 3,
      lineColor: BORDER,
      lineWidth: 0.15,
    },
    alternateRowStyles: { fillColor: [249, 250, 251] },
  });

  const pc = doc.getNumberOfPages();
  for (let i = 1; i <= pc; i++) {
    doc.setPage(i);
    doc.setFontSize(6.5);
    doc.setTextColor(180, 180, 180);
    doc.text("Page " + i + "/" + pc + " | " + COMPANY.name, margin, pageH - 7);
  }

  doc.save("Ledger_Report_" + new Date().toISOString().slice(0, 10) + ".pdf");
};

// ═══════════════════════════════════════════════════════════════════════
// LEDGER CSV (unchanged)
// ═══════════════════════════════════════════════════════════════════════
export const generateLedgerCSV = (
  entries: LedgerEntry[],
  showGST: boolean
): void => {
  const headers = showGST
    ? [
        "Date",
        "Type",
        "Description",
        "Reference",
        "Debit",
        "Credit",
        "CGST",
        "SGST",
        "Balance",
      ]
    : [
        "Date",
        "Type",
        "Description",
        "Reference",
        "Base Debit",
        "Base Credit",
        "Balance",
      ];

  const rows = entries.map((e) => {
    const baseAmount = getBaseAmount(e);
    return showGST
      ? [
          e.entryDate,
          ENTRY_MAP[e.entryType]?.label ?? e.entryType,
          '"' + (e.description ?? "") + '"',
          e.referenceNo ?? "",
          e.debitAmount,
          e.creditAmount,
          e.cgst,
          e.sgst,
          e.balance,
        ]
      : [
          e.entryDate,
          ENTRY_MAP[e.entryType]?.label ?? e.entryType,
          '"' + (e.description ?? "") + '"',
          e.referenceNo ?? "",
          e.debitAmount > 0 ? baseAmount : 0,
          e.creditAmount > 0 ? baseAmount : 0,
          e.balance,
        ];
  });

  const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download =
    "Ledger_Export_" + new Date().toISOString().slice(0, 10) + ".csv";
  a.click();
  URL.revokeObjectURL(url);
};
