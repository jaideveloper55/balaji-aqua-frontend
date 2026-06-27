import { Invoice, PaymentEntry, Customer } from "../types/billing";
import { COMPANY_INFO } from "../constants/Mockdata";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const parseInvoiceDate = (dateStr: string): Date => {
  const [day, month, year] = dateStr.split(" ");
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return new Date(parseInt(year), months.indexOf(month), parseInt(day));
};

export const filterByDateRange = <T extends { date: string }>(
  items: T[],
  from: Date | null,
  to: Date | null
): T[] => {
  if (!from && !to) return items;
  return items.filter((item) => {
    const d = parseInvoiceDate(item.date);
    if (from && d < from) return false;
    if (to && d > to) return false;
    return true;
  });
};

interface ExportOptions {
  fromDate?: Date | null;
  toDate?: Date | null;
}

const formatDateLabel = (
  from: Date | null | undefined,
  to: Date | null | undefined
) => {
  if (!from && !to) return "All time";
  const fmt = (d: Date) =>
    d.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  if (from && to) return `${fmt(from)} — ${fmt(to)}`;
  if (from) return `From ${fmt(from)}`;
  if (to) return `Until ${fmt(to)}`;
  return "All time";
};

/* ════════════════════════════════════════════════════════════════════════════
   PDF SHARED — header / footer / styling
   ════════════════════════════════════════════════════════════════════════════ */

const addPdfHeader = (doc: jsPDF, title: string, subtitle: string) => {
  doc.setFillColor(16, 185, 129);
  doc.rect(0, 0, 210, 4, "F");

  doc.setFontSize(20);
  doc.setTextColor(17, 24, 39);
  doc.setFont("helvetica", "bold");
  doc.text(COMPANY_INFO.name, 14, 18);

  doc.setFontSize(8);
  doc.setTextColor(107, 114, 128);
  doc.setFont("helvetica", "normal");
  doc.text(COMPANY_INFO.tagline, 14, 23);
  doc.text(COMPANY_INFO.address, 14, 27);
  doc.text(`GSTIN: ${COMPANY_INFO}  ·  ${COMPANY_INFO.phone}`, 14, 31);

  doc.setFontSize(14);
  doc.setTextColor(17, 24, 39);
  doc.setFont("helvetica", "bold");
  doc.text(title.toUpperCase(), 196, 18, { align: "right" });

  doc.setFontSize(8);
  doc.setTextColor(107, 114, 128);
  doc.setFont("helvetica", "normal");
  doc.text(subtitle, 196, 23, { align: "right" });
  doc.text(`Generated: ${new Date().toLocaleString("en-IN")}`, 196, 27, {
    align: "right",
  });

  doc.setDrawColor(229, 231, 235);
  doc.line(14, 36, 196, 36);
};

const addPdfFooter = (doc: jsPDF) => {
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(7);
    doc.setTextColor(156, 163, 175);
    doc.text(
      `${COMPANY_INFO.name} — Confidential`,
      14,
      doc.internal.pageSize.height - 8
    );
    doc.text(
      `Page ${i} of ${pageCount}`,
      196,
      doc.internal.pageSize.height - 8,
      { align: "right" }
    );
  }
};

/* ════════════════════════════════════════════════════════════════════════════
   INVOICES PDF
   ════════════════════════════════════════════════════════════════════════════ */

export const exportInvoicesToPDF = (
  invoices: Invoice[],
  options: ExportOptions = {}
) => {
  const filtered = filterByDateRange(
    invoices,
    options.fromDate ?? null,
    options.toDate ?? null
  );
  const doc = new jsPDF();

  addPdfHeader(
    doc,
    "Invoice Report",
    formatDateLabel(options.fromDate, options.toDate)
  );

  const totalBilled = filtered.reduce((s, i) => s + i.grandTotal, 0);
  const totalPaid = filtered.reduce((s, i) => s + i.paidAmount, 0);
  const totalDue = filtered.reduce((s, i) => s + i.balanceAmount, 0);

  doc.setFillColor(249, 250, 251);
  doc.rect(14, 42, 182, 18, "F");
  doc.setFontSize(8);
  doc.setTextColor(107, 114, 128);
  doc.text("INVOICES", 20, 49);
  doc.text("BILLED", 65, 49);
  doc.text("COLLECTED", 110, 49);
  doc.text("OUTSTANDING", 160, 49);

  doc.setFontSize(11);
  doc.setTextColor(17, 24, 39);
  doc.setFont("helvetica", "bold");
  doc.text(String(filtered.length), 20, 56);
  doc.text(`Rs. ${totalBilled.toLocaleString("en-IN")}`, 65, 56);
  doc.setTextColor(16, 185, 129);
  doc.text(`Rs. ${totalPaid.toLocaleString("en-IN")}`, 110, 56);
  doc.setTextColor(239, 68, 68);
  doc.text(`Rs. ${totalDue.toLocaleString("en-IN")}`, 160, 56);

  autoTable(doc, {
    startY: 66,
    head: [
      [
        "Invoice #",
        "Date",
        "Customer",
        "Type",
        "Total",
        "Paid",
        "Balance",
        "Status",
      ],
    ],
    body: filtered.map((i) => [
      i.invoiceNo,
      i.date,
      i.customerName,
      i.customerType,
      `Rs. ${i.grandTotal.toLocaleString("en-IN")}`,
      `Rs. ${i.paidAmount.toLocaleString("en-IN")}`,
      i.balanceAmount > 0
        ? `Rs. ${i.balanceAmount.toLocaleString("en-IN")}`
        : "—",
      i.status,
    ]),
    headStyles: {
      fillColor: [17, 24, 39],
      textColor: 255,
      fontSize: 8,
      fontStyle: "bold",
    },
    bodyStyles: { fontSize: 8, textColor: [55, 65, 81] },
    alternateRowStyles: { fillColor: [249, 250, 251] },
    columnStyles: {
      0: { cellWidth: 28, fontStyle: "bold" },
      4: { halign: "right" },
      5: { halign: "right" },
      6: { halign: "right" },
      7: { halign: "center" },
    },
    margin: { left: 14, right: 14 },
  });

  addPdfFooter(doc);

  const filename = `Invoices_${formatDateLabel(
    options.fromDate,
    options.toDate
  ).replace(/[^a-z0-9]/gi, "_")}.pdf`;
  doc.save(filename);
};

/* ════════════════════════════════════════════════════════════════════════════
   PAYMENTS PDF
   ════════════════════════════════════════════════════════════════════════════ */

export const exportPaymentsToPDF = (
  payments: PaymentEntry[],
  options: ExportOptions = {}
) => {
  const filtered = filterByDateRange(
    payments,
    options.fromDate ?? null,
    options.toDate ?? null
  );
  const doc = new jsPDF();

  addPdfHeader(
    doc,
    "Payment Report",
    formatDateLabel(options.fromDate, options.toDate)
  );

  const total = filtered.reduce((s, p) => s + p.amount, 0);
  const cash = filtered
    .filter((p) => p.mode === "Cash")
    .reduce((s, p) => s + p.amount, 0);
  const upi = filtered
    .filter((p) => p.mode === "UPI")
    .reduce((s, p) => s + p.amount, 0);
  const bank = filtered
    .filter((p) => p.mode === "Bank Transfer")
    .reduce((s, p) => s + p.amount, 0);

  doc.setFillColor(249, 250, 251);
  doc.rect(14, 42, 182, 18, "F");
  doc.setFontSize(8);
  doc.setTextColor(107, 114, 128);
  doc.text("TOTAL", 20, 49);
  doc.text("CASH", 65, 49);
  doc.text("UPI", 110, 49);
  doc.text("BANK", 160, 49);

  doc.setFontSize(11);
  doc.setTextColor(17, 24, 39);
  doc.setFont("helvetica", "bold");
  doc.text(`Rs. ${total.toLocaleString("en-IN")}`, 20, 56);
  doc.text(`Rs. ${cash.toLocaleString("en-IN")}`, 65, 56);
  doc.text(`Rs. ${upi.toLocaleString("en-IN")}`, 110, 56);
  doc.text(`Rs. ${bank.toLocaleString("en-IN")}`, 160, 56);

  autoTable(doc, {
    startY: 66,
    head: [
      [
        "Payment #",
        "Date",
        "Time",
        "Customer",
        "Invoice",
        "Mode",
        "Reference",
        "Amount",
      ],
    ],
    body: filtered.map((p) => [
      p.paymentNo,
      p.date,
      p.time,
      p.customerName,
      p.invoiceNo,
      p.mode,
      p.reference || "—",
      `Rs. ${p.amount.toLocaleString("en-IN")}`,
    ]),
    headStyles: {
      fillColor: [17, 24, 39],
      textColor: 255,
      fontSize: 8,
      fontStyle: "bold",
    },
    bodyStyles: { fontSize: 8, textColor: [55, 65, 81] },
    alternateRowStyles: { fillColor: [249, 250, 251] },
    columnStyles: {
      0: { cellWidth: 28, fontStyle: "bold" },
      7: { halign: "right", textColor: [16, 185, 129], fontStyle: "bold" },
    },
    margin: { left: 14, right: 14 },
  });

  addPdfFooter(doc);
  doc.save(
    `Payments_${formatDateLabel(options.fromDate, options.toDate).replace(
      /[^a-z0-9]/gi,
      "_"
    )}.pdf`
  );
};

/* ════════════════════════════════════════════════════════════════════════════
   OUTSTANDING PDF
   ════════════════════════════════════════════════════════════════════════════ */

export const exportOutstandingToPDF = (customers: Customer[]) => {
  const doc = new jsPDF();
  const filtered = customers.filter((c) => c.outstanding > 0);

  addPdfHeader(
    doc,
    "Outstanding Report",
    `As on ${new Date().toLocaleDateString("en-IN")}`
  );

  const total = filtered.reduce((s, c) => s + c.outstanding, 0);
  const highRisk = filtered.filter((c) => (c.overdueDays || 0) > 15).length;

  doc.setFillColor(254, 242, 242);
  doc.rect(14, 42, 182, 18, "F");
  doc.setFontSize(8);
  doc.setTextColor(107, 114, 128);
  doc.text("TOTAL OUTSTANDING", 20, 49);
  doc.text("CUSTOMERS WITH DUES", 90, 49);
  doc.text("HIGH RISK (>15 days)", 160, 49);

  doc.setFontSize(11);
  doc.setTextColor(239, 68, 68);
  doc.setFont("helvetica", "bold");
  doc.text(`Rs. ${total.toLocaleString("en-IN")}`, 20, 56);
  doc.setTextColor(17, 24, 39);
  doc.text(String(filtered.length), 90, 56);
  doc.setTextColor(239, 68, 68);
  doc.text(String(highRisk), 160, 56);

  autoTable(doc, {
    startY: 66,
    head: [
      [
        "Customer ID",
        "Name",
        "Type",
        "Phone",
        "Last Paid",
        "Days Overdue",
        "Outstanding",
      ],
    ],
    body: filtered.map((c) => [
      c.customerId,
      c.name,
      c.type,
      c.phone,
      c.lastPaymentDate || "—",
      String(c.overdueDays || 0),
      `Rs. ${c.outstanding.toLocaleString("en-IN")}`,
    ]),
    headStyles: {
      fillColor: [17, 24, 39],
      textColor: 255,
      fontSize: 8,
      fontStyle: "bold",
    },
    bodyStyles: { fontSize: 8, textColor: [55, 65, 81] },
    alternateRowStyles: { fillColor: [249, 250, 251] },
    columnStyles: {
      0: { cellWidth: 24, fontStyle: "bold" },
      5: { halign: "center" },
      6: { halign: "right", textColor: [239, 68, 68], fontStyle: "bold" },
    },
    margin: { left: 14, right: 14 },
  });

  addPdfFooter(doc);
  doc.save(`Outstanding_${new Date().toISOString().split("T")[0]}.pdf`);
};

/* ════════════════════════════════════════════════════════════════════════════
   DAILY SUMMARY PDF
   ════════════════════════════════════════════════════════════════════════════ */

export const exportDailySummaryToPDF = (
  invoices: Invoice[],
  payments: PaymentEntry[],
  date: string
) => {
  const doc = new jsPDF();
  addPdfHeader(doc, "Daily Summary", date);

  const total = payments.reduce((s, p) => s + p.amount, 0);
  const cash = payments
    .filter((p) => p.mode === "Cash")
    .reduce((s, p) => s + p.amount, 0);
  const upi = payments
    .filter((p) => p.mode === "UPI")
    .reduce((s, p) => s + p.amount, 0);
  const bank = payments
    .filter((p) => p.mode === "Bank Transfer")
    .reduce((s, p) => s + p.amount, 0);
  const billed = invoices.reduce((s, i) => s + i.grandTotal, 0);
  const credit = invoices
    .filter((i) => i.paymentMode === "Credit")
    .reduce((s, i) => s + i.grandTotal, 0);

  doc.setFontSize(10);
  doc.setTextColor(17, 24, 39);
  doc.setFont("helvetica", "bold");
  doc.text("Collection Summary", 14, 46);

  autoTable(doc, {
    startY: 50,
    body: [
      [
        "Total Collection",
        `Rs. ${total.toLocaleString("en-IN")}`,
        `${payments.length} payments`,
      ],
      [
        "Cash",
        `Rs. ${cash.toLocaleString("en-IN")}`,
        total > 0 ? `${Math.round((cash / total) * 100)}%` : "0%",
      ],
      [
        "UPI",
        `Rs. ${upi.toLocaleString("en-IN")}`,
        total > 0 ? `${Math.round((upi / total) * 100)}%` : "0%",
      ],
      [
        "Bank Transfer",
        `Rs. ${bank.toLocaleString("en-IN")}`,
        total > 0 ? `${Math.round((bank / total) * 100)}%` : "0%",
      ],
      [
        "Total Billed",
        `Rs. ${billed.toLocaleString("en-IN")}`,
        `${invoices.length} invoices`,
      ],
      [
        "Credit Sales",
        `Rs. ${credit.toLocaleString("en-IN")}`,
        "To be collected",
      ],
    ],
    bodyStyles: { fontSize: 9 },
    columnStyles: {
      0: { fontStyle: "bold", cellWidth: 60 },
      1: { halign: "right", cellWidth: 50 },
      2: { textColor: [107, 114, 128] },
    },
    margin: { left: 14, right: 14 },
  });

  // Transactions table
  const finalY =
    (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable
      .finalY + 8;
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("Transactions", 14, finalY);

  autoTable(doc, {
    startY: finalY + 4,
    head: [["Time", "Customer", "Invoice", "Mode", "Amount"]],
    body: payments.map((p) => [
      p.time,
      p.customerName,
      p.invoiceNo,
      p.mode,
      `Rs. ${p.amount.toLocaleString("en-IN")}`,
    ]),
    headStyles: { fillColor: [17, 24, 39], textColor: 255, fontSize: 8 },
    bodyStyles: { fontSize: 8 },
    alternateRowStyles: { fillColor: [249, 250, 251] },
    columnStyles: {
      4: { halign: "right", fontStyle: "bold", textColor: [16, 185, 129] },
    },
    margin: { left: 14, right: 14 },
  });

  addPdfFooter(doc);
  doc.save(`DailySummary_${date.replace(/[^a-z0-9]/gi, "_")}.pdf`);
};

/* ════════════════════════════════════════════════════════════════════════════
   EXCEL / CSV EXPORTS
   ════════════════════════════════════════════════════════════════════════════ */

const downloadCSV = (rows: string[][], filename: string) => {
  const csv = rows
    .map((row) =>
      row
        .map((cell) => {
          const v = String(cell ?? "");
          return v.includes(",") || v.includes('"') || v.includes("\n")
            ? `"${v.replace(/"/g, '""')}"`
            : v;
        })
        .join(",")
    )
    .join("\n");
  const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};

export const exportInvoicesToCSV = (
  invoices: Invoice[],
  options: ExportOptions = {}
) => {
  const filtered = filterByDateRange(
    invoices,
    options.fromDate ?? null,
    options.toDate ?? null
  );
  const rows = [
    [
      "Invoice #",
      "Date",
      "Time",
      "Customer ID",
      "Customer Name",
      "Type",
      "Phone",
      "Subtotal",
      "GST",
      "Discount",
      "Grand Total",
      "Paid",
      "Balance",
      "Status",
      "Payment Mode",
      "Notes",
    ],
    ...filtered.map((i) => [
      i.invoiceNo,
      i.date,
      i.time,
      i.customerId,
      i.customerName,
      i.customerType,
      i.customerPhone || "",
      String(i.subtotal),
      String(i.gst),
      String(i.discount),
      String(i.grandTotal),
      String(i.paidAmount),
      String(i.balanceAmount),
      i.status,
      i.paymentMode,
      i.notes,
    ]),
  ];
  downloadCSV(rows, `Invoices_${new Date().toISOString().split("T")[0]}.csv`);
};

export const exportPaymentsToCSV = (
  payments: PaymentEntry[],
  options: ExportOptions = {}
) => {
  const filtered = filterByDateRange(
    payments,
    options.fromDate ?? null,
    options.toDate ?? null
  );
  const rows = [
    [
      "Payment #",
      "Date",
      "Time",
      "Customer ID",
      "Customer Name",
      "Invoice #",
      "Amount",
      "Mode",
      "Reference",
      "Notes",
    ],
    ...filtered.map((p) => [
      p.paymentNo,
      p.date,
      p.time,
      p.customerId,
      p.customerName,
      p.invoiceNo,
      String(p.amount),
      p.mode,
      p.reference,
      p.notes,
    ]),
  ];
  downloadCSV(rows, `Payments_${new Date().toISOString().split("T")[0]}.csv`);
};

export const exportOutstandingToCSV = (customers: Customer[]) => {
  const filtered = customers.filter((c) => c.outstanding > 0);
  const rows = [
    [
      "Customer ID",
      "Name",
      "Type",
      "Phone",
      "Email",
      "Address",
      "Outstanding",
      "Days Overdue",
      "Last Payment",
    ],
    ...filtered.map((c) => [
      c.customerId,
      c.name,
      c.type,
      c.phone,
      c.email,
      c.address,
      String(c.outstanding),
      String(c.overdueDays || 0),
      c.lastPaymentDate || "",
    ]),
  ];
  downloadCSV(
    rows,
    `Outstanding_${new Date().toISOString().split("T")[0]}.csv`
  );
};
