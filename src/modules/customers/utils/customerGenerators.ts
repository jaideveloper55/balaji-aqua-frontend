import dayjs from "dayjs";
import { COMPANY_INFO } from "../../billing/constants/Mockdata";

export interface ExportableCustomer {
  id: string;
  customerCode: string;
  name: string;
  phone: string;
  email?: string | null;
  type: string;
  status: string;
  outstandingBalance?: number;
  createdAt?: string;
  addressLine1?: string | null;
  city?: string | null;
  state?: string | null;
}

const fmt = (n: number) =>
  new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(n ?? 0);

const fmtDate = (d?: string | Date | null) =>
  d ? dayjs(d).format("DD MMM YYYY") : "—";

const escapeCsv = (val: unknown): string => {
  const s = val === null || val === undefined ? "" : String(val);
  if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
};

const downloadBlob = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
};

const downloadCsv = (rows: (string | number)[][], filename: string) => {
  const csv = rows.map((row) => row.map(escapeCsv).join(",")).join("\n");
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  downloadBlob(blob, filename);
};

const TYPE_LABEL: Record<string, string> = {
  RESIDENTIAL: "Residential",
  COMMERCIAL: "Commercial",
  INDUSTRIAL: "Industrial",
};

// ─── Build the HTML content for the report ───────────────────────────────────
const buildReportHTML = (customers: ExportableCustomer[]): string => {
  const totalOutstanding = customers.reduce(
    (s, c) => s + (c.outstandingBalance ?? 0),
    0
  );
  const withDues = customers.filter(
    (c) => (c.outstandingBalance ?? 0) > 0
  ).length;
  const activeCount = customers.filter((c) => c.status === "ACTIVE").length;

  const rows = customers
    .map(
      (c) => `
      <tr>
        <td>
          <div class="customer-name">${c.name}</div>
          <div class="customer-code">${c.customerCode}</div>
        </td>
        <td>${c.phone ?? "—"}</td>
        <td class="email-cell">${c.email ?? "—"}</td>
        <td class="center">
          <span class="badge badge-blue">${TYPE_LABEL[c.type] ?? c.type}</span>
        </td>
        <td class="center">
          <span class="badge ${
            c.status === "ACTIVE" ? "badge-green" : "badge-red"
          }">
            ${
              c.status === "ACTIVE"
                ? "Active"
                : c.status === "INACTIVE"
                ? "Inactive"
                : c.status
            }
          </span>
        </td>
        <td class="right">
          ${
            (c.outstandingBalance ?? 0) > 0
              ? `<span class="amount-red">Rs.${fmt(
                  c.outstandingBalance ?? 0
                )}</span>`
              : `<span class="amount-green">Nil</span>`
          }
        </td>
        <td class="center date-cell">${fmtDate(c.createdAt)}</td>
      </tr>`
    )
    .join("");

  return `
    <h1 class="report-title">Customer Report</h1>
    <p class="meta">As of ${dayjs().format("DD MMM YYYY")}</p>
    <p class="sub-meta">${customers.length} customer${
    customers.length === 1 ? "" : "s"
  }</p>

    <div class="kpi-row" style="margin-top:20px;">
      <div class="kpi-card">
        <div class="kpi-label">Total Customers</div>
        <div class="kpi-value blue">${customers.length}</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-label">Active</div>
        <div class="kpi-value green">${activeCount}</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-label">With Dues</div>
        <div class="kpi-value red">${withDues}</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-label">Total Outstanding</div>
        <div class="kpi-value red">Rs.${fmt(totalOutstanding)}</div>
      </div>
    </div>

    <table>
      <thead>
        <tr>
          <th>Customer</th>
          <th>Phone</th>
          <th>Email</th>
          <th class="center">Type</th>
          <th class="center">Status</th>
          <th class="right">Outstanding</th>
          <th class="center">Joined</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
  `;
};

const CSS = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
    color: #1e293b;
    background: #fff;
    font-size: 13px;
  }
  .page-wrapper {
    max-width: 960px;
    margin: 0 auto;
    padding: 40px 40px;
  }
  .header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    border-bottom: 2px solid #e2e8f0;
    padding-bottom: 20px;
    margin-bottom: 28px;
  }
  .company-name { font-size: 22px; font-weight: 800; color: #2563eb; margin-bottom: 3px; }
  .company-sub { font-size: 12px; color: #64748b; }
  .generated { font-size: 11px; color: #94a3b8; text-align: right; }
  h1.report-title { font-size: 26px; font-weight: 800; margin-bottom: 3px; }
  .meta { font-size: 13px; color: #2563eb; font-weight: 600; }
  .sub-meta { font-size: 12px; color: #64748b; margin-top: 2px; margin-bottom: 0; }
  table { width: 100%; border-collapse: collapse; margin-top: 20px; }
  thead tr { background: #2563eb; }
  th {
    color: #fff;
    text-align: left;
    font-size: 10px;
    font-weight: 700;
    padding: 10px 12px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    white-space: nowrap;
  }
  th.center, td.center { text-align: center; }
  th.right, td.right { text-align: right; }
  td { padding: 9px 12px; border-bottom: 1px solid #f1f5f9; vertical-align: middle; }
  tbody tr:nth-child(even) { background: #f8fafc; }
  .customer-name { font-weight: 700; font-size: 13px; }
  .customer-code { font-size: 10px; color: #94a3b8; font-family: monospace; margin-top: 1px; }
  .email-cell { font-size: 11px; color: #64748b; }
  .date-cell { font-size: 11px; color: #64748b; white-space: nowrap; }
  .badge {
    display: inline-block;
    font-size: 10px;
    font-weight: 700;
    padding: 2px 8px;
    border-radius: 20px;
    white-space: nowrap;
  }
  .badge-green { background: #d1fae5; color: #059669; }
  .badge-red { background: #fee2e2; color: #dc2626; }
  .badge-blue { background: #dbeafe; color: #1d4ed8; }
  .amount-red { color: #dc2626; font-weight: 700; }
  .amount-green { color: #059669; font-weight: 700; }
  .kpi-row {
    display: flex;
    gap: 12px;
    margin-top: 28px;
    page-break-inside: avoid;
  }
  .kpi-card {
    flex: 1;
    padding: 16px 18px;
    border: 1px solid #e2e8f0;
    border-radius: 10px;
    background: #fff;
    text-align: center;
    page-break-inside: avoid;
  }
  .kpi-label {
    font-size: 9px;
    color: #64748b;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    font-weight: 700;
    margin-bottom: 8px;
  }
  .kpi-value { font-size: 26px; font-weight: 800; color: #0f172a; line-height: 1; }
  .kpi-value.red { color: #dc2626; }
  .kpi-value.green { color: #059669; }
  .kpi-value.blue { color: #2563eb; }
`;

// ─────────────────────────────────────────────────────────────────────────
// PDF — download directly using html2pdf.js (loaded from CDN at runtime)
// ─────────────────────────────────────────────────────────────────────────

export const generateCustomerListPDF = async (
  customers: ExportableCustomer[]
) => {
  const bodyHtml = buildReportHTML(customers);
  const filename = `customers_${dayjs().format("YYYYMMDD_HHmmss")}.pdf`;

  // Build a full HTML string to render into a temp div
  const fullHtml = `
    <div class="page-wrapper">
      <style>${CSS}</style>
      <div class="header">
        <div>
          <div class="company-name">${COMPANY_INFO.name}</div>
          <div class="company-sub">${
            COMPANY_INFO.tagline ?? "Water Plant ERP"
          }</div>
        </div>
        <div class="generated">Generated: ${dayjs().format(
          "DD MMM YYYY, hh:mm a"
        )}</div>
      </div>
      ${bodyHtml}
    </div>
  `;

  // Try html2pdf (loaded via CDN or installed as npm package)
  // If not available, fall back to print dialog
  try {
    // Dynamically load html2pdf.js from CDN if not already loaded
    if (!(window as any).html2pdf) {
      await new Promise<void>((resolve, reject) => {
        const script = document.createElement("script");
        script.src =
          "https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js";
        script.onload = () => resolve();
        script.onerror = () => reject(new Error("Failed to load html2pdf"));
        document.head.appendChild(script);
      });
    }

    // Create a hidden container, render the HTML, convert to PDF
    const container = document.createElement("div");
    container.innerHTML = fullHtml;
    container.style.position = "absolute";
    container.style.left = "-9999px";
    container.style.top = "0";
    document.body.appendChild(container);

    await (window as any)
      .html2pdf()
      .set({
        margin: [10, 10, 10, 10],
        filename,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, logging: false },
        jsPDF: { unit: "mm", format: "a4", orientation: "landscape" },
      })
      .from(container.firstElementChild as HTMLElement)
      .save();

    document.body.removeChild(container);
  } catch (err) {
    // Fallback: open in new tab with print dialog
    console.warn("html2pdf not available, falling back to print dialog", err);
    const win = window.open("", "_blank");
    if (!win) return;
    win.document.write(`<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Customer Report</title>
  <style>${CSS} @media print { body { padding: 16px; } @page { margin: 1cm; } }</style>
</head>
<body>
  <div class="header">
    <div>
      <div class="company-name">${COMPANY_INFO.name}</div>
      <div class="company-sub">${
        COMPANY_INFO.tagline ?? "Water Plant ERP"
      }</div>
    </div>
    <div class="generated">Generated: ${dayjs().format(
      "DD MMM YYYY, hh:mm a"
    )}</div>
  </div>
  ${bodyHtml}
  <script>window.onload = function() { window.focus(); window.print(); };<\/script>
</body>
</html>`);
    win.document.close();
  }
};

// ─────────────────────────────────────────────────────────────────────────
// CSV
// ─────────────────────────────────────────────────────────────────────────

export const generateCustomerListCSV = (customers: ExportableCustomer[]) => {
  const header = [
    "Customer Code",
    "Name",
    "Phone",
    "Email",
    "Type",
    "Status",
    "Outstanding (Rs.)",
    "Address",
    "City",
    "State",
    "Joined",
  ];
  const rows = customers.map((c) => [
    c.customerCode,
    c.name,
    c.phone ?? "",
    c.email ?? "",
    TYPE_LABEL[c.type] ?? c.type,
    c.status,
    c.outstandingBalance ?? 0,
    c.addressLine1 ?? "",
    c.city ?? "",
    c.state ?? "",
    fmtDate(c.createdAt),
  ]);
  downloadCsv(
    [header, ...rows],
    `customers_${dayjs().format("YYYYMMDD_HHmmss")}.csv`
  );
};
