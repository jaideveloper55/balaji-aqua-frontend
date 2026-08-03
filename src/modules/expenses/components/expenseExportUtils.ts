import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import dayjs from "dayjs";
import {
  getExpensesApi,
  getCategoriesApi,
  getVendorsApi,
  getPettyCashTransactionsApi,
} from "../api/Expenses.api";

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────
const inr = (n: number) =>
  new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0,
  }).format(Number(n ?? 0));

const fmtDate = (d: string | Date) => dayjs(d).format("DD MMM YYYY");

// ─────────────────────────────────────────────────────────────────────────────
// EXPORT PARAMS
// ─────────────────────────────────────────────────────────────────────────────
export type ReportType =
  | "expense_summary"
  | "category_report"
  | "vendor_report"
  | "petty_cash";

export type ExportFormat = "pdf" | "excel";

interface ExportParams {
  reportType: ReportType;
  format: ExportFormat;
  fromDate: string; // "YYYY-MM-DD"
  toDate: string;
  companyName: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// FETCH DATA — pulls from your existing API endpoints
// ─────────────────────────────────────────────────────────────────────────────
async function fetchReportData(params: ExportParams) {
  const { reportType, fromDate, toDate } = params;

  switch (reportType) {
    case "expense_summary": {
      // Get ALL expenses in date range (limit: 10000 to fetch everything)
      const res = await getExpensesApi({
        dateFrom: fromDate,
        dateTo: toDate,
        page: 1,
        limit: 10000,
        sortBy: "date",
        sortOrder: "desc",
      });
      return res.data.data ?? [];
    }

    case "category_report": {
      const res = await getCategoriesApi({});
      return res.data ?? [];
    }

    case "vendor_report": {
      const res = await getVendorsApi({});
      return res.data ?? [];
    }

    case "petty_cash": {
      const res = await getPettyCashTransactionsApi({});
      return res.data ?? [];
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// PDF EXPORT
// ─────────────────────────────────────────────────────────────────────────────
function exportPDF(data: any[], params: ExportParams) {
  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });

  // ── Header ──────────────────────────────────────────────────────────────
  doc.setFontSize(18);
  doc.setTextColor(15, 23, 42);
  doc.setFont("helvetica", "bold");
  doc.text(params.companyName, 14, 15);

  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139);
  doc.setFont("helvetica", "normal");
  doc.text("ERP Dashboard — Expense Report", 14, 21);

  // Report title
  const reportLabels: Record<ReportType, string> = {
    expense_summary: "Expense Summary Report",
    category_report: "Category Report",
    vendor_report: "Vendor Report",
    petty_cash: "Petty Cash Log",
  };
  doc.setFontSize(14);
  doc.setTextColor(225, 29, 72);
  doc.setFont("helvetica", "bold");
  doc.text(reportLabels[params.reportType], 14, 32);

  // Date range
  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139);
  doc.setFont("helvetica", "normal");
  doc.text(`${fmtDate(params.fromDate)} — ${fmtDate(params.toDate)}`, 14, 38);
  doc.text(
    `Generated: ${dayjs().format("DD MMM YYYY, HH:mm")}`,
    doc.internal.pageSize.width - 14,
    38,
    { align: "right" }
  );

  // ── Table columns/rows based on report type ─────────────────────────────
  let head: string[][] = [];
  let body: any[][] = [];
  let footTotal = 0;

  switch (params.reportType) {
    case "expense_summary":
      head = [
        [
          "Date",
          "Expense No",
          "Vendor",
          "Description",
          "Category",
          "Payment",
          "Status",
          "GST",
          "Amount",
        ],
      ];
      body = data.map((e) => {
        footTotal += Number(e.amount ?? 0);
        return [
          fmtDate(e.date),
          e.expenseNo,
          e.vendorName,
          e.description,
          e.categoryName,
          e.paymentMode,
          e.status,
          `₹${inr(Number(e.gstAmount ?? 0))}`,
          `₹${inr(Number(e.amount ?? 0))}`,
        ];
      });
      break;

    case "category_report":
      head = [
        ["Category", "Budget", "Spent", "Remaining", "% Used", "Transactions"],
      ];
      body = data.map((c: any) => {
        footTotal += Number(c.spentThisMonth ?? 0);
        return [
          c.name,
          `₹${inr(Number(c.monthlyBudget ?? 0))}`,
          `₹${inr(Number(c.spentThisMonth ?? 0))}`,
          `₹${inr(Number(c.budgetRemaining ?? 0))}`,
          `${c.percentUsed ?? 0}%`,
          c.transactions ?? 0,
        ];
      });
      break;

    case "vendor_report":
      head = [
        [
          "Vendor",
          "Category",
          "Phone",
          "GSTIN",
          "Paid YTD",
          "Outstanding",
          "Transactions",
        ],
      ];
      body = data.map((v: any) => {
        footTotal += Number(v.totalPaidYTD ?? 0);
        return [
          v.name,
          v.category,
          v.phone,
          v.gstin ?? "—",
          `₹${inr(Number(v.totalPaidYTD ?? 0))}`,
          `₹${inr(Number(v.openingOutstanding ?? 0))}`,
          v.transactions ?? 0,
        ];
      });
      break;

    case "petty_cash":
      head = [
        [
          "Date",
          "Txn No",
          "Direction",
          "Description",
          "Handled By",
          "Amount",
          "Balance After",
        ],
      ];
      body = data.map((t: any) => {
        const sign = t.direction === "IN" ? "+" : "−";
        footTotal +=
          t.direction === "IN" ? Number(t.amount) : -Number(t.amount);
        return [
          dayjs(t.txnDate).format("DD MMM, HH:mm"),
          t.txnNo,
          t.direction,
          t.description,
          t.handledByName ?? "—",
          `${sign} ₹${inr(Number(t.amount))}`,
          `₹${inr(Number(t.balanceAfter))}`,
        ];
      });
      break;
  }

  // ── Draw table ──────────────────────────────────────────────────────────
  autoTable(doc, {
    head,
    body,
    startY: 44,
    theme: "striped",
    headStyles: {
      fillColor: [225, 29, 72], // rose-600
      textColor: [255, 255, 255],
      fontStyle: "bold",
      fontSize: 9,
    },
    bodyStyles: {
      fontSize: 8,
      cellPadding: 2,
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252], // slate-50
    },
    foot: [
      Array(head[0].length - 1)
        .fill("")
        .concat([`Total: ₹${inr(footTotal)}`]),
    ],
    footStyles: {
      fillColor: [15, 23, 42], // slate-900
      textColor: [255, 255, 255],
      fontStyle: "bold",
      halign: "right",
    },
    margin: { left: 14, right: 14 },
    didDrawPage: (data) => {
      // Footer on every page
      const pageCount = doc.getNumberOfPages();
      const currentPage = data.pageNumber;
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184);
      doc.text(
        `Page ${currentPage} of ${pageCount}`,
        doc.internal.pageSize.width / 2,
        doc.internal.pageSize.height - 8,
        { align: "center" }
      );
      doc.text(
        "Generated by Balaji Aqua ERP",
        14,
        doc.internal.pageSize.height - 8
      );
    },
  });

  // ── Save file ───────────────────────────────────────────────────────────
  const filename = `${params.reportType}_${dayjs(params.fromDate).format(
    "YYYYMMDD"
  )}_${dayjs(params.toDate).format("YYYYMMDD")}.pdf`;
  doc.save(filename);
}

// ─────────────────────────────────────────────────────────────────────────────
// EXCEL EXPORT
// ─────────────────────────────────────────────────────────────────────────────
function exportExcel(data: any[], params: ExportParams) {
  let rows: any[] = [];

  switch (params.reportType) {
    case "expense_summary":
      rows = data.map((e) => ({
        Date: fmtDate(e.date),
        "Expense No": e.expenseNo,
        Vendor: e.vendorName,
        Description: e.description,
        Category: e.categoryName,
        "Payment Mode": e.paymentMode,
        Status: e.status,
        "GST Amount (₹)": Number(e.gstAmount ?? 0),
        "Amount (₹)": Number(e.amount ?? 0),
      }));
      break;

    case "category_report":
      rows = data.map((c: any) => ({
        Category: c.name,
        "Monthly Budget": Number(c.monthlyBudget ?? 0),
        "Spent This Month": Number(c.spentThisMonth ?? 0),
        "Budget Remaining": Number(c.budgetRemaining ?? 0),
        "Percent Used": `${c.percentUsed ?? 0}%`,
        Transactions: c.transactions ?? 0,
      }));
      break;

    case "vendor_report":
      rows = data.map((v: any) => ({
        Vendor: v.name,
        Category: v.category,
        Phone: v.phone,
        Email: v.email ?? "",
        GSTIN: v.gstin ?? "",
        "Paid YTD": Number(v.totalPaidYTD ?? 0),
        Outstanding: Number(v.openingOutstanding ?? 0),
        Transactions: v.transactions ?? 0,
      }));
      break;

    case "petty_cash":
      rows = data.map((t: any) => ({
        Date: dayjs(t.txnDate).format("DD MMM YYYY, HH:mm"),
        "Txn No": t.txnNo,
        Direction: t.direction,
        Description: t.description,
        "Handled By": t.handledByName ?? "",
        Amount: Number(t.amount),
        "Balance After": Number(t.balanceAfter),
      }));
      break;
  }

  // Create workbook
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(rows);

  // Auto-size columns based on header length
  const headers = Object.keys(rows[0] ?? {});
  const colWidths = headers.map((h) => ({
    wch: Math.max(h.length + 2, 12),
  }));
  ws["!cols"] = colWidths;

  // Add metadata sheet (report info)
  const metaSheet = XLSX.utils.aoa_to_sheet([
    ["Report Details"],
    ["Company", params.companyName],
    ["Report", params.reportType.replace(/_/g, " ").toUpperCase()],
    ["Date Range", `${fmtDate(params.fromDate)} — ${fmtDate(params.toDate)}`],
    ["Generated", dayjs().format("DD MMM YYYY, HH:mm")],
    ["Total Rows", rows.length],
  ]);
  metaSheet["!cols"] = [{ wch: 18 }, { wch: 40 }];

  XLSX.utils.book_append_sheet(wb, metaSheet, "Info");
  XLSX.utils.book_append_sheet(wb, ws, "Data");

  // Save file
  const filename = `${params.reportType}_${dayjs(params.fromDate).format(
    "YYYYMMDD"
  )}_${dayjs(params.toDate).format("YYYYMMDD")}.xlsx`;
  XLSX.writeFile(wb, filename);
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN EXPORT FUNCTION — called by the drawer
// ─────────────────────────────────────────────────────────────────────────────
export async function exportExpenseReport(params: ExportParams) {
  const data = await fetchReportData(params);

  if (!data || data.length === 0) {
    throw new Error("No data available for the selected date range");
  }

  if (params.format === "pdf") {
    exportPDF(data, params);
  } else {
    exportExcel(data, params);
  }

  return { success: true, rowCount: data.length };
}
