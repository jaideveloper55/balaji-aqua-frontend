import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import { fmt, fmtDate } from "./helpers";
import type {
  EntryDetails,
  LedgerEntry,
} from "../modules/customers/types/Customer";
import { ENTRY_MAP } from "../modules/customers/constants/ledgerConstants";

// ── Color tokens ──────────────────────────────────────────────
const PRIMARY: [number, number, number] = [37, 99, 235];
const DARK: [number, number, number] = [15, 23, 42];
const MUTED: [number, number, number] = [100, 116, 139];
const LIGHT: [number, number, number] = [241, 245, 249];
const WHITE: [number, number, number] = [255, 255, 255];

// ═══════════════════════════════════════════════════════════════
// INVOICE PDF
// ═══════════════════════════════════════════════════════════════

export const generateInvoicePDF = (
  entry: LedgerEntry,
  details: EntryDetails | undefined,
  showGST: boolean
): void => {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pageW = doc.internal.pageSize.width;
  const margin = 16;
  const contentW = pageW - margin * 2;
  let y = margin;

  // Header bar
  doc.setFillColor(...PRIMARY);
  doc.rect(0, 0, pageW, 38, "F");
  doc.setFontSize(18);
  doc.setTextColor(...WHITE);
  doc.setFont("helvetica", "bold");
  doc.text("Balaji Aqua Water Plant", margin, 16);
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(200, 220, 255);
  doc.text("ERP Dashboard - Account Ledger", margin, 23);
  doc.setFontSize(14);
  doc.setTextColor(...WHITE);
  doc.setFont("helvetica", "bold");
  doc.text(entry.referenceNo || "-", pageW - margin, 16, { align: "right" });
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(200, 220, 255);
  doc.text(
    ENTRY_MAP[entry.type]?.label.toUpperCase() ?? "",
    pageW - margin,
    23,
    { align: "right" }
  );
  doc.text("Date: " + fmtDate(entry.date), pageW - margin, 30, {
    align: "right",
  });
  doc.text(showGST ? "WITH GST" : "EXCL. GST", pageW - margin, 35, {
    align: "right",
  });
  y = 48;

  // Info boxes
  if (details) {
    const boxW = (contentW - 6) / 2;
    const boxH = 18;
    const drawBox = (
      x: number,
      yP: number,
      lbl: string,
      val: string,
      mono: boolean
    ) => {
      doc.setFillColor(...LIGHT);
      doc.roundedRect(x, yP, boxW, boxH, 2, 2, "F");
      doc.setFontSize(7);
      doc.setTextColor(...MUTED);
      doc.setFont("helvetica", "normal");
      doc.text(lbl.toUpperCase(), x + 5, yP + 6);
      doc.setFontSize(10);
      doc.setTextColor(...DARK);
      doc.setFont(mono ? "courier" : "helvetica", "bold");
      doc.text(val || "-", x + 5, yP + 13);
    };
    drawBox(margin, y, "Customer", details.customer, false);
    drawBox(margin + boxW + 6, y, "GST No.", details.gst, true);
    y += boxH + 4;
    drawBox(
      margin,
      y,
      "Due Date",
      details.dueDate === "-" ? "N/A" : fmtDate(details.dueDate),
      false
    );
    drawBox(margin + boxW + 6, y, "Reference", entry.referenceNo, true);
    y += boxH + 8;
  }

  // Description
  doc.setFillColor(239, 246, 255);
  doc.roundedRect(margin, y, contentW, 14, 2, 2, "F");
  doc.setFontSize(7);
  doc.setTextColor(96, 165, 250);
  doc.text("DESCRIPTION", margin + 5, y + 5);
  doc.setFontSize(9);
  doc.setTextColor(...DARK);
  doc.setFont("helvetica", "bold");
  doc.text(entry.description || "-", margin + 5, y + 11);
  y += 20;

  // Line items table
  if (details) {
    const items = details.items;
    const subtotal = items.reduce((s, i) => s + i.amount, 0);
    const totalCGST = items.reduce(
      (s, i) => s + (i.amount * (i.gstRate / 2)) / 100,
      0
    );
    const totalSGST = totalCGST;

    doc.setFontSize(8);
    doc.setTextColor(...MUTED);
    doc.setFont("helvetica", "bold");
    doc.text("LINE ITEMS (" + items.length + ")", margin, y + 4);
    y += 8;

    const heads = showGST
      ? [["#", "Item", "HSN", "Qty", "Rate", "GST%", "Amount"]]
      : [["#", "Item", "HSN", "Qty", "Rate", "Amount"]];

    const rows = items.map((it, i) => {
      const g = showGST ? (it.amount * it.gstRate) / 100 : 0;
      const r = [
        String(i + 1),
        it.name,
        it.hsn,
        it.qty + " " + it.unit,
        "Rs." + fmt(it.rate),
      ];
      if (showGST) r.push(it.gstRate + "%");
      r.push("Rs." + fmt(it.amount + g));
      return r;
    });

    autoTable(doc, {
      startY: y,
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
        fontSize: 7.5,
        textColor: DARK,
        cellPadding: 3.5,
        lineColor: [226, 232, 240],
        lineWidth: 0.15,
      },
      alternateRowStyles: { fillColor: [249, 250, 251] },
    });

    y = (doc as any).lastAutoTable.finalY + 6;
    const tX = pageW - margin - 85;
    const tW = 85;

    // Subtotal
    doc.setFillColor(...LIGHT);
    doc.rect(tX, y, tW, 9, "F");
    doc.setFontSize(8);
    doc.setTextColor(...MUTED);
    doc.text("Subtotal", tX + 4, y + 6);
    doc.setTextColor(...DARK);
    doc.setFont("courier", "bold");
    doc.text("Rs." + fmt(subtotal), tX + tW - 4, y + 6, { align: "right" });
    y += 10;

    // GST rows
    if (showGST) {
      doc.setFontSize(7.5);
      doc.setTextColor(...MUTED);
      doc.setFont("helvetica", "normal");
      doc.text("CGST", tX + 4, y + 5.5);
      doc.setTextColor(...DARK);
      doc.setFont("courier", "normal");
      doc.text("Rs." + fmt(Math.round(totalCGST)), tX + tW - 4, y + 5.5, {
        align: "right",
      });
      y += 9;
      doc.setTextColor(...MUTED);
      doc.text("SGST", tX + 4, y + 5.5);
      doc.setTextColor(...DARK);
      doc.text("Rs." + fmt(Math.round(totalSGST)), tX + tW - 4, y + 5.5, {
        align: "right",
      });
      y += 9;
    }

    // Grand total
    const gt = showGST ? subtotal + totalCGST + totalSGST : subtotal;
    doc.setFillColor(...PRIMARY);
    doc.roundedRect(tX, y, tW, 12, 1.5, 1.5, "F");
    doc.setFontSize(9);
    doc.setTextColor(...WHITE);
    doc.setFont("helvetica", "bold");
    doc.text(showGST ? "GRAND TOTAL" : "TOTAL (excl GST)", tX + 4, y + 8);
    doc.setFontSize(10);
    doc.setFont("courier", "bold");
    doc.text("Rs." + fmt(Math.round(gt)), tX + tW - 4, y + 8, {
      align: "right",
    });
  }

  // Footer
  const fY = doc.internal.pageSize.height - 12;
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.3);
  doc.line(margin, fY - 4, pageW - margin, fY - 4);
  doc.setFontSize(6.5);
  doc.setTextColor(180, 180, 180);
  doc.setFont("helvetica", "normal");
  doc.text(
    "Balaji Aqua Water Plant - ERP Dashboard | Computer Generated",
    margin,
    fY
  );
  doc.text(
    "Generated: " + new Date().toLocaleDateString("en-IN"),
    pageW - margin,
    fY,
    { align: "right" }
  );

  doc.save((entry.referenceNo || "Document") + "_" + entry.date + ".pdf");
};

// ═══════════════════════════════════════════════════════════════
// LEDGER PDF
// ═══════════════════════════════════════════════════════════════

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
  doc.text("Balaji Aqua Water Plant - ERP Dashboard", margin, 21);
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

  const rows = entries.map((r) =>
    showGST
      ? [
          fmtDate(r.date),
          ENTRY_MAP[r.type]?.label ?? r.type,
          r.description,
          r.referenceNo || "-",
          r.debit > 0 ? "Rs." + fmt(r.debit) : "-",
          r.credit > 0 ? "Rs." + fmt(r.credit) : "-",
          r.cgst > 0 ? "Rs." + fmt(r.cgst) : "-",
          r.sgst > 0 ? "Rs." + fmt(r.sgst) : "-",
          "Rs." + fmt(r.balance),
        ]
      : [
          fmtDate(r.date),
          ENTRY_MAP[r.type]?.label ?? r.type,
          r.description,
          r.referenceNo || "-",
          r.debit > 0 ? "Rs." + fmt(r.baseAmount) : "-",
          r.credit > 0 ? "Rs." + fmt(r.baseAmount) : "-",
          "Rs." + fmt(r.balance),
        ]
  );

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
      lineColor: [226, 232, 240],
      lineWidth: 0.15,
    },
    alternateRowStyles: { fillColor: [249, 250, 251] },
  });

  const pc = doc.getNumberOfPages();
  for (let i = 1; i <= pc; i++) {
    doc.setPage(i);
    doc.setFontSize(6.5);
    doc.setTextColor(180, 180, 180);
    doc.text(
      "Page " + i + "/" + pc + " | Balaji Aqua Water Plant",
      margin,
      pageH - 7
    );
  }

  doc.save("Ledger_Report_" + new Date().toISOString().slice(0, 10) + ".pdf");
};

// ═══════════════════════════════════════════════════════════════
// LEDGER CSV
// ═══════════════════════════════════════════════════════════════

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

  const rows = entries.map((e) =>
    showGST
      ? [
          e.date,
          ENTRY_MAP[e.type]?.label ?? e.type,
          '"' + e.description + '"',
          e.referenceNo,
          e.debit,
          e.credit,
          e.cgst,
          e.sgst,
          e.balance,
        ]
      : [
          e.date,
          ENTRY_MAP[e.type]?.label ?? e.type,
          '"' + e.description + '"',
          e.referenceNo,
          e.debit > 0 ? e.baseAmount : 0,
          e.credit > 0 ? e.baseAmount : 0,
          e.balance,
        ]
  );

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
