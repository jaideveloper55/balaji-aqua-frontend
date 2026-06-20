import dayjs from "dayjs";
import { COMPANY_INFO } from "../../billing/constants/Mockdata";

export interface ExportableOutstandingCustomer {
  id: string;
  customerCode: string;
  name: string;
  phone: string;
  type: string;
  outstandingBalance: number;
  overdueDays: number;
  riskLevel?: string;
  lastPaid?: string | null;
}

const fmt = (n: number) =>
  new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(n ?? 0);

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

const riskBadge = (days: number, risk?: string) => {
  const r =
    risk?.toUpperCase() ??
    (days > 15 ? "HIGH" : days > 0 ? "MEDIUM" : "RECENT");
  if (r === "HIGH") return `<span class="badge badge-red">HIGH</span>`;
  if (r === "MEDIUM") return `<span class="badge badge-amber">MEDIUM</span>`;
  return `<span class="badge badge-green">RECENT</span>`;
};

const CSS = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
    color: #1e293b;
    background: #fff;
    font-size: 13px;
  }
  .page-wrapper { max-width: 960px; margin: 0 auto; padding: 40px; }
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
  .meta { font-size: 13px; color: #dc2626; font-weight: 600; }
  .sub-meta { font-size: 12px; color: #64748b; margin-top: 2px; }
  table { width: 100%; border-collapse: collapse; margin-top: 20px; }
  thead tr { background: #2563eb; }
  th {
    color: #fff; text-align: left; font-size: 10px; font-weight: 700;
    padding: 10px 12px; text-transform: uppercase; letter-spacing: 0.05em;
    white-space: nowrap;
  }
  th.center, td.center { text-align: center; }
  th.right, td.right { text-align: right; }
  td { padding: 9px 12px; border-bottom: 1px solid #f1f5f9; vertical-align: middle; white-space: nowrap; }
  tbody tr:nth-child(even) { background: #f8fafc; }
  .customer-name { font-weight: 700; font-size: 13px; }
  .customer-code { font-size: 10px; color: #94a3b8; font-family: monospace; margin-top: 1px; }
  .badge {
    display: inline-block; font-size: 10px; font-weight: 700;
    padding: 2px 8px; border-radius: 20px; white-space: nowrap;
  }
  .badge-green { background: #d1fae5; color: #059669; }
  .badge-amber { background: #fef3c7; color: #b45309; }
  .badge-red { background: #fee2e2; color: #dc2626; }
  .badge-blue { background: #dbeafe; color: #1d4ed8; }
  .amount-red { color: #dc2626; font-weight: 700; }
  .amount-green { color: #059669; font-weight: 700; }
  .kpi-row { display: flex; gap: 12px; margin-bottom: 24px; page-break-inside: avoid; }
  .kpi-card {
    flex: 1; padding: 16px 18px; border: 1px solid #e2e8f0;
    border-radius: 10px; background: #fff; text-align: center;
    page-break-inside: avoid;
  }
  .kpi-label {
    font-size: 9px; color: #64748b; text-transform: uppercase;
    letter-spacing: 0.08em; font-weight: 700; margin-bottom: 8px;
  }
  .kpi-value { font-size: 26px; font-weight: 800; color: #0f172a; line-height: 1; }
  .kpi-value.red { color: #dc2626; }
  .kpi-value.amber { color: #b45309; }
  .kpi-value.blue { color: #2563eb; }
`;

// ─── Outstanding PDF ──────────────────────────────────────────────────────────

export const generateOutstandingPDF = async (
  customers: ExportableOutstandingCustomer[]
) => {
  const filename = `outstanding_${dayjs().format("YYYYMMDD_HHmmss")}.pdf`;

  const totalOutstanding = customers.reduce(
    (s, c) => s + (c.outstandingBalance ?? 0),
    0
  );
  const highRisk = customers.filter(
    (c) => (c.overdueDays ?? 0) > 15 || c.riskLevel === "HIGH"
  ).length;
  const avgDays = customers.length
    ? Math.round(
        customers.reduce((s, c) => s + (c.overdueDays ?? 0), 0) /
          customers.length
      )
    : 0;

  const rows = customers
    .map(
      (c) => `
      <tr>
        <td>
          <div class="customer-name">${c.name}</div>
          <div class="customer-code">${c.customerCode}</div>
        </td>
        <td>${c.phone ?? "—"}</td>
        <td class="center">
          <span class="badge badge-blue">${TYPE_LABEL[c.type] ?? c.type}</span>
        </td>
        <td class="right">
          <span class="amount-red">Rs.${fmt(c.outstandingBalance)}</span>
        </td>
        <td class="center">${c.overdueDays ?? 0}d</td>
        <td class="center">${riskBadge(c.overdueDays ?? 0, c.riskLevel)}</td>
        <td class="center" style="color:#64748b;font-size:11px;">
          ${c.lastPaid ? dayjs(c.lastPaid).format("DD MMM YYYY") : "—"}
        </td>
      </tr>`
    )
    .join("");

  const bodyHtml = `
    <h1 class="report-title">Outstanding Report</h1>
    <p class="meta">As of ${dayjs().format("DD MMM YYYY")}</p>
    <p class="sub-meta">${customers.length} customer${
    customers.length === 1 ? "" : "s"
  } with pending dues</p>

    <div class="kpi-row" style="margin-top:20px;">
      <div class="kpi-card">
        <div class="kpi-label">Total Due</div>
        <div class="kpi-value red" style="font-size:20px;">Rs.${fmt(
          totalOutstanding
        )}</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-label">Customers</div>
        <div class="kpi-value blue">${customers.length}</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-label">High Risk</div>
        <div class="kpi-value red">${highRisk}</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-label">Avg Overdue</div>
        <div class="kpi-value amber">${avgDays}d</div>
      </div>
    </div>

    <table>
      <thead>
        <tr>
          <th>Customer</th>
          <th>Phone</th>
          <th class="center">Type</th>
          <th class="right">Outstanding</th>
          <th class="center">Days</th>
          <th class="center">Risk</th>
          <th class="center">Last Paid</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
  `;

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

  try {
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
    console.warn("html2pdf fallback to print", err);
    const win = window.open("", "_blank");
    if (!win) return;
    win.document
      .write(`<!DOCTYPE html><html><head><meta charset="utf-8"/><title>Outstanding Report</title>
      <style>${CSS} @media print{body{padding:16px}@page{margin:1cm}}</style></head>
      <body><div class="page-wrapper">
        <div class="header">
          <div><div class="company-name">${COMPANY_INFO.name}</div>
          <div class="company-sub">${
            COMPANY_INFO.tagline ?? "Water Plant ERP"
          }</div></div>
          <div class="generated">Generated: ${dayjs().format(
            "DD MMM YYYY, hh:mm a"
          )}</div>
        </div>${bodyHtml}</div>
      <script>window.onload=function(){window.focus();window.print();}<\/script></body></html>`);
    win.document.close();
  }
};

// ─── Outstanding CSV ──────────────────────────────────────────────────────────

export const generateOutstandingCSV = (
  customers: ExportableOutstandingCustomer[]
) => {
  const header = [
    "Customer Code",
    "Name",
    "Phone",
    "Type",
    "Outstanding (Rs.)",
    "Days Overdue",
    "Risk",
    "Last Paid",
  ];
  const rows = customers.map((c) => [
    c.customerCode,
    c.name,
    c.phone ?? "",
    TYPE_LABEL[c.type] ?? c.type,
    c.outstandingBalance ?? 0,
    c.overdueDays ?? 0,
    c.riskLevel ??
      (c.overdueDays > 15 ? "HIGH" : c.overdueDays > 0 ? "MEDIUM" : "RECENT"),
    c.lastPaid ? dayjs(c.lastPaid).format("DD MMM YYYY") : "",
  ]);
  downloadCsv(
    [header, ...rows],
    `outstanding_${dayjs().format("YYYYMMDD_HHmmss")}.csv`
  );
};
