import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import ExcelJS from "exceljs";
import type { DashboardSummary } from "../types/Dashboard";
import { downloadBlob } from "../utils/downloadBlob";

const DEFAULT_ORG_NAME = "Sri Balaji Aqua Water";
const DEFAULT_ORG_TAGLINE = "Pure Water · Pure Trust";

interface ReportBranding {
  name?: string;
  tagline?: string;
}

const inr = (n: number): string =>
  `Rs.${new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(
    n ?? 0
  )}`;

function fileStamp(): string {
  return new Date()
    .toISOString()
    .replace(/[-:]/g, "")
    .replace("T", "_")
    .slice(0, 15);
}

function finalYOf(doc: jsPDF): number {
  return (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable
    .finalY;
}

export function exportDashboardPdf(
  data: DashboardSummary,
  from: string,
  to: string,
  branding: ReportBranding = {}
): void {
  const orgName = branding.name ?? DEFAULT_ORG_NAME;
  const orgTagline = branding.tagline ?? DEFAULT_ORG_TAGLINE;

  const doc = new jsPDF();
  let y = 20;

  // ---- Branding header ----
  doc.setFontSize(18);
  doc.setTextColor(37, 99, 235);
  doc.text(orgName, 14, y);
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(orgTagline, 14, y + 6);
  doc.text(`Generated: ${new Date().toLocaleString("en-IN")}`, 196, y, {
    align: "right",
  });
  y += 16;
  doc.setDrawColor(230);
  doc.line(14, y, 196, y);
  y += 10;

  // ---- Title ----
  doc.setFontSize(16);
  doc.setTextColor(15, 23, 42); // slate-900
  doc.text("Dashboard Metrics", 14, y);
  y += 10;

  // ---- FLOW section: Collection & Billing, scoped to the chosen period ----
  doc.setFontSize(11);
  doc.setTextColor(37, 99, 235);
  doc.text(`COLLECTION & BILLING  —  Period: ${from} to ${to}`, 14, y);
  y += 4;
  autoTable(doc, {
    startY: y,
    theme: "plain",
    styles: { fontSize: 10 },
    body: [
      ["Total Collected", inr(data.kpis.todayCollection)],
      ["Invoices Generated", String(data.kpis.todayInvoices)],
      ["Total Billed", inr(data.kpis.totalBilled)],
    ],
  });
  y = finalYOf(doc) + 8;

  if (data.paymentMode.length > 0) {
    autoTable(doc, {
      startY: y,
      head: [["Payment Mode", "Amount"]],
      body: data.paymentMode.map((m) => [m.name, inr(m.value)]),
      theme: "striped",
      headStyles: { fillColor: [37, 99, 235] },
      styles: { fontSize: 10 },
    });
    y = finalYOf(doc) + 10;
  }

  // ---- SNAPSHOT section: current status, NOT scoped to the period above ----
  doc.setFontSize(11);
  doc.setTextColor(220, 38, 38);
  doc.text("CURRENT STATUS  —  as of export time, not the period above", 14, y);
  y += 4;
  autoTable(doc, {
    startY: y,
    theme: "plain",
    styles: { fontSize: 10 },
    body: [
      ["Total Outstanding", inr(data.kpis.totalOutstanding)],
      ["Customers with Dues", String(data.kpis.customersWithDues)],
      ["Total Customers", String(data.kpis.totalCustomers)],
      ["Low Stock Items", String(data.kpis.lowStockCount)],
      ["Out of Stock Items", String(data.kpis.outOfStockCount)],
    ],
  });
  y = finalYOf(doc) + 10;

  if (data.dueCustomers.length > 0) {
    doc.setFontSize(11);
    doc.setTextColor(15, 23, 42);
    doc.text("Customers with Dues", 14, y);
    y += 4;
    autoTable(doc, {
      startY: y,
      head: [["Customer", "Code", "Overdue", "Amount"]],
      body: data.dueCustomers.map((c) => [
        c.name,
        c.customerCode,
        c.overdueDays > 0 ? `${c.overdueDays}d` : "—",
        inr(c.outstandingBalance),
      ]),
      theme: "striped",
      headStyles: { fillColor: [220, 38, 38] },
      styles: { fontSize: 10 },
    });
    y = finalYOf(doc) + 10;
  }

  if (data.stockRows.length > 0) {
    doc.setFontSize(11);
    doc.setTextColor(15, 23, 42);
    doc.text("Stock Levels", 14, y);
    y += 4;
    autoTable(doc, {
      startY: y,
      head: [["Product", "SKU", "Stock", "Min", "Unit"]],
      body: data.stockRows.map((s) => [
        s.name,
        s.sku,
        String(s.stock),
        String(s.minStock),
        s.unit,
      ]),
      theme: "striped",
      headStyles: { fillColor: [124, 58, 237] },
      styles: { fontSize: 10 },
    });
  }

  doc.save(`dashboard_${fileStamp()}.pdf`);
}

/**
 * Builds and downloads a CSV of the same metrics, for anyone who'd rather
 * paste this into their own spreadsheet than open a PDF.
 */
export function exportDashboardCsv(
  data: DashboardSummary,
  from: string,
  to: string,
  branding: ReportBranding = {}
): void {
  const orgName = branding.name ?? DEFAULT_ORG_NAME;

  const lines: string[] = [];
  // Every cell gets quoted and internal quotes escaped — the standard,
  // safe way to build a CSV by hand so a comma inside a product name
  // doesn't silently split into the wrong column.
  const push = (...cells: (string | number)[]): void => {
    lines.push(
      cells.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")
    );
  };

  push(orgName);
  push("Dashboard Metrics");
  push("Generated", new Date().toLocaleString("en-IN"));
  push("");

  push("COLLECTION & BILLING", `Period: ${from} to ${to}`);
  push("Total Collected", data.kpis.todayCollection);
  push("Invoices Generated", data.kpis.todayInvoices);
  push("Total Billed", data.kpis.totalBilled);
  push("");

  push("PAYMENT MODE BREAKDOWN");
  data.paymentMode.forEach((m) => push(m.name, m.value));
  push("");

  push("CURRENT STATUS", "as of export time, not the period above");
  push("Total Outstanding", data.kpis.totalOutstanding);
  push("Customers with Dues", data.kpis.customersWithDues);
  push("Total Customers", data.kpis.totalCustomers);
  push("Low Stock Items", data.kpis.lowStockCount);
  push("Out of Stock Items", data.kpis.outOfStockCount);
  push("");

  push("CUSTOMERS WITH DUES");
  push("Customer", "Code", "Overdue Days", "Amount");
  data.dueCustomers.forEach((c) =>
    push(c.name, c.customerCode, c.overdueDays, c.outstandingBalance)
  );
  push("");

  push("STOCK LEVELS");
  push("Product", "SKU", "Stock", "Min Stock", "Unit");
  data.stockRows.forEach((s) =>
    push(s.name, s.sku, s.stock, s.minStock, s.unit)
  );

  const blob = new Blob([lines.join("\n")], {
    type: "text/csv;charset=utf-8;",
  });
  downloadBlob(blob, `dashboard_${fileStamp()}.csv`);
}

const BLUE = "FF2563EB";
const RED = "FFDC2626";
const PURPLE = "FF7C3AED";
const WHITE = "FFFFFFFF";
const MUTED = "FF64748B";

export async function exportDashboardXlsx(
  data: DashboardSummary,
  from: string,
  to: string,
  branding: ReportBranding = {}
): Promise<void> {
  const orgName = branding.name ?? DEFAULT_ORG_NAME;
  const orgTagline = branding.tagline ?? DEFAULT_ORG_TAGLINE;

  const workbook = new ExcelJS.Workbook();
  workbook.creator = orgName;
  workbook.created = new Date();

  const sheet = workbook.addWorksheet("Dashboard Metrics");
  // Fixed column widths set ONCE, up front — this is the single biggest
  // reason a raw CSV looks cramped and this won't: every table, however
  // many columns it actually uses, lines up against the same five widths.
  sheet.columns = [
    { width: 26 }, // A: label / customer / product name
    { width: 16 }, // B: value / code / sku
    { width: 16 }, // C: overdue days / stock
    { width: 16 }, // D: amount / min stock
    { width: 12 }, // E: unit
  ];

  let row = 1;

  // ---- Branding header ----
  sheet.getCell(row, 1).value = orgName;
  sheet.getCell(row, 1).font = { bold: true, size: 16, color: { argb: BLUE } };
  row++;
  sheet.getCell(row, 1).value = orgTagline;
  sheet.getCell(row, 1).font = {
    italic: true,
    size: 10,
    color: { argb: MUTED },
  };
  row += 2;

  sheet.getCell(row, 1).value = "Dashboard Metrics";
  sheet.getCell(row, 1).font = { bold: true, size: 14 };
  row++;
  sheet.getCell(row, 1).value = `Generated: ${new Date().toLocaleString(
    "en-IN"
  )}`;
  sheet.getCell(row, 1).font = {
    italic: true,
    size: 9,
    color: { argb: MUTED },
  };
  row += 2;

  // A full-width coloured band, used for every section title — this single
  // helper is what makes "COLLECTION & BILLING" actually LOOK like a section
  // header instead of just another row of text, the way it does in the CSV.
  const sectionBand = (text: string, argbColor: string): void => {
    sheet.mergeCells(row, 1, row, 5);
    const cell = sheet.getCell(row, 1);
    cell.value = text;
    cell.font = { bold: true, size: 11, color: { argb: WHITE } };
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: argbColor },
    };
    cell.alignment = { vertical: "middle" };
    sheet.getRow(row).height = 20;
    row++;
  };

  // A plain "Label ........ Value" row for single KPIs — right-aligns
  // numbers so a column of amounts reads cleanly, top to bottom.
  const kpiRow = (
    label: string,
    value: number | string,
    currency = false
  ): void => {
    sheet.getCell(row, 1).value = label;
    sheet.getCell(row, 1).font = { bold: true };
    const cell = sheet.getCell(row, 2);
    cell.value = value;
    if (typeof value === "number") {
      cell.alignment = { horizontal: "right" };
      if (currency) cell.numFmt = '"₹"#,##0'; // real number, formatted as currency
    }
    row++;
  };

  // A coloured header row for a proper multi-column table (dues, stock,
  // payment mode) — same colour as that section's band, so the eye connects
  // the table back to the section it belongs to.
  const tableHeader = (headers: string[], argbColor: string): void => {
    headers.forEach((h, i) => {
      const cell = sheet.getCell(row, i + 1);
      cell.value = h;
      cell.font = { bold: true, color: { argb: WHITE } };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: argbColor },
      };
    });
    row++;
  };

  // ---- FLOW: Collection & Billing, scoped to the chosen period ----
  sectionBand(`COLLECTION & BILLING  —  Period: ${from} to ${to}`, BLUE);
  kpiRow("Total Collected", data.kpis.todayCollection, true);
  kpiRow("Invoices Generated", data.kpis.todayInvoices);
  kpiRow("Total Billed", data.kpis.totalBilled, true);
  row++;

  if (data.paymentMode.length > 0) {
    tableHeader(["Payment Mode", "Amount"], BLUE);
    data.paymentMode.forEach((m) => {
      sheet.getCell(row, 1).value = m.name;
      const amt = sheet.getCell(row, 2);
      amt.value = m.value;
      amt.numFmt = '"₹"#,##0';
      row++;
    });
    row++;
  }

  // ---- SNAPSHOT: current status, NOT scoped to the period above ----
  sectionBand(
    "CURRENT STATUS  —  as of export time, not the period above",
    RED
  );
  kpiRow("Total Outstanding", data.kpis.totalOutstanding, true);
  kpiRow("Customers with Dues", data.kpis.customersWithDues);
  kpiRow("Total Customers", data.kpis.totalCustomers);
  kpiRow("Low Stock Items", data.kpis.lowStockCount);
  kpiRow("Out of Stock Items", data.kpis.outOfStockCount);
  row++;

  if (data.dueCustomers.length > 0) {
    sheet.getCell(row, 1).value = "Customers with Dues";
    sheet.getCell(row, 1).font = { bold: true, size: 12 };
    row++;
    tableHeader(["Customer", "Code", "Overdue Days", "Amount"], RED);
    data.dueCustomers.forEach((c) => {
      sheet.getCell(row, 1).value = c.name;
      sheet.getCell(row, 2).value = c.customerCode;
      const overdueCell = sheet.getCell(row, 3);
      overdueCell.value = c.overdueDays;

      if (c.overdueDays > 15) {
        overdueCell.font = { bold: true, color: { argb: RED } };
      }
      const amt = sheet.getCell(row, 4);
      amt.value = c.outstandingBalance;
      amt.numFmt = '"₹"#,##0';
      row++;
    });
    row++;
  }

  if (data.stockRows.length > 0) {
    sheet.getCell(row, 1).value = "Stock Levels";
    sheet.getCell(row, 1).font = { bold: true, size: 12 };
    row++;
    tableHeader(["Product", "SKU", "Stock", "Min Stock", "Unit"], PURPLE);
    data.stockRows.forEach((s) => {
      sheet.getCell(row, 1).value = s.name;
      sheet.getCell(row, 2).value = s.sku;
      sheet.getCell(row, 3).value = s.stock;
      sheet.getCell(row, 4).value = s.minStock;
      sheet.getCell(row, 5).value = s.unit;
      row++;
    });
  }

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  downloadBlob(blob, `dashboard_${fileStamp()}.xlsx`);
}
