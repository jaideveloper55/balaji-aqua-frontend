import dayjs from "dayjs";
import { COMPANY_INFO } from "../../billing/constants/Mockdata";

export interface SummaryData {
  cash: number;
  upi: number;
  bank: number;
  totalCollected: number;
  invoiceCount: number;
  totalBilled: number;
  creditSales: number;
  pending: number;
  dateFrom?: string;
  dateTo?: string;
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

const CSS = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
    color: #1e293b; background: #fff; font-size: 13px;
  }
  .page-wrapper { max-width: 860px; margin: 0 auto; padding: 40px; }
  .header {
    display: flex; justify-content: space-between; align-items: flex-start;
    border-bottom: 2px solid #e2e8f0; padding-bottom: 20px; margin-bottom: 28px;
  }
  .company-name { font-size: 22px; font-weight: 800; color: #2563eb; margin-bottom: 3px; }
  .company-sub { font-size: 12px; color: #64748b; }
  .generated { font-size: 11px; color: #94a3b8; text-align: right; }
  h1.report-title { font-size: 26px; font-weight: 800; margin-bottom: 3px; }
  .meta { font-size: 13px; color: #2563eb; font-weight: 600; }
  .sub-meta { font-size: 12px; color: #64748b; margin-top: 2px; }

  /* KPI cards */
  .kpi-row { display: flex; gap: 12px; margin: 24px 0; page-break-inside: avoid; }
  .kpi-card {
    flex: 1; padding: 16px 18px; border: 1px solid #e2e8f0;
    border-radius: 10px; background: #fff; text-align: center;
    page-break-inside: avoid;
  }
  .kpi-label {
    font-size: 9px; color: #64748b; text-transform: uppercase;
    letter-spacing: 0.08em; font-weight: 700; margin-bottom: 8px;
  }
  .kpi-value { font-size: 24px; font-weight: 800; color: #0f172a; line-height: 1; }
  .kpi-value.green { color: #059669; }
  .kpi-value.blue { color: #2563eb; }
  .kpi-value.red { color: #dc2626; }
  .kpi-value.amber { color: #b45309; }

  /* Section header */
  .section-title {
    font-size: 13px; font-weight: 700; color: #374151;
    text-transform: uppercase; letter-spacing: 0.05em;
    margin: 28px 0 12px; border-left: 3px solid #2563eb; padding-left: 10px;
  }

  /* Breakdown table */
  table { width: 100%; border-collapse: collapse; }
  thead tr { background: #2563eb; }
  th {
    color: #fff; text-align: left; font-size: 10px; font-weight: 700;
    padding: 10px 14px; text-transform: uppercase; letter-spacing: 0.05em;
  }
  th.right, td.right { text-align: right; }
  td { padding: 10px 14px; border-bottom: 1px solid #f1f5f9; font-size: 13px; }
  tbody tr:nth-child(even) { background: #f8fafc; }
  .amount-green { color: #059669; font-weight: 700; }
  .amount-blue  { color: #2563eb; font-weight: 700; }
  .amount-amber { color: #b45309; font-weight: 700; }
  .amount-gray  { color: #6b7280; }

  /* Mode bar */
  .mode-row { display: flex; gap: 10px; margin: 20px 0; page-break-inside: avoid; }
  .mode-card {
    flex: 1; padding: 14px 16px; border-radius: 10px;
    background: #f8fafc; border: 1px solid #e2e8f0; text-align: center;
  }
  .mode-label { font-size: 10px; color: #64748b; font-weight: 700; text-transform: uppercase; margin-bottom: 6px; }
  .mode-value { font-size: 18px; font-weight: 800; }
  .mode-pct { font-size: 10px; color: #94a3b8; margin-top: 2px; }
`;

// ─── Collection Summary PDF ───────────────────────────────────────────────────

export const generateSummaryPDF = async (data: SummaryData) => {
  const filename = `summary_${dayjs().format("YYYYMMDD_HHmmss")}.pdf`;

  const periodLabel =
    data.dateFrom && data.dateTo
      ? `${dayjs(data.dateFrom).format("DD MMM YYYY")} – ${dayjs(
          data.dateTo
        ).format("DD MMM YYYY")}`
      : dayjs().format("DD MMM YYYY");

  const total = data.totalCollected;
  const cashPct = total > 0 ? Math.round((data.cash / total) * 100) : 0;
  const upiPct = total > 0 ? Math.round((data.upi / total) * 100) : 0;
  const bankPct = total > 0 ? Math.round((data.bank / total) * 100) : 0;

  const bodyHtml = `
    <h1 class="report-title">Collection Summary</h1>
    <p class="meta">Period overview</p>
    <p class="sub-meta">Period: ${periodLabel}</p>

    <!-- KPI cards at top -->
    <div class="kpi-row" style="margin-top:20px;">
      <div class="kpi-card">
        <div class="kpi-label">Total Collected</div>
        <div class="kpi-value green">Rs.${fmt(data.totalCollected)}</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-label">Invoices</div>
        <div class="kpi-value blue">${data.invoiceCount}</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-label">Total Billed</div>
        <div class="kpi-value blue">Rs.${fmt(data.totalBilled)}</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-label">Pending</div>
        <div class="kpi-value ${data.pending > 0 ? "red" : "green"}">Rs.${fmt(
    data.pending
  )}</div>
      </div>
    </div>

    <!-- Payment mode breakdown -->
    <div class="section-title">Collection by Payment Mode</div>
    <div class="mode-row">
      <div class="mode-card">
        <div class="mode-label">Cash</div>
        <div class="mode-value" style="color:#059669;">Rs.${fmt(
          data.cash
        )}</div>
        <div class="mode-pct">${cashPct}% of total</div>
      </div>
      <div class="mode-card">
        <div class="mode-label">UPI</div>
        <div class="mode-value" style="color:#2563eb;">Rs.${fmt(data.upi)}</div>
        <div class="mode-pct">${upiPct}% of total</div>
      </div>
      <div class="mode-card">
        <div class="mode-label">Bank Transfer</div>
        <div class="mode-value" style="color:#7c3aed;">Rs.${fmt(
          data.bank
        )}</div>
        <div class="mode-pct">${bankPct}% of total</div>
      </div>
    </div>

    <!-- Detailed breakdown table -->
    <div class="section-title">Summary Breakdown</div>
    <table>
      <thead>
        <tr>
          <th>Metric</th>
          <th class="right">Value</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Invoices Generated</td>
          <td class="right"><span class="amount-blue">${
            data.invoiceCount
          }</span></td>
        </tr>
        <tr>
          <td>Total Billed</td>
          <td class="right"><span class="amount-blue">Rs.${fmt(
            data.totalBilled
          )}</span></td>
        </tr>
        <tr>
          <td>Total Collected</td>
          <td class="right"><span class="amount-green">Rs.${fmt(
            data.totalCollected
          )}</span></td>
        </tr>
        <tr>
          <td>Cash</td>
          <td class="right"><span class="amount-green">Rs.${fmt(
            data.cash
          )}</span></td>
        </tr>
        <tr>
          <td>UPI</td>
          <td class="right"><span class="amount-green">Rs.${fmt(
            data.upi
          )}</span></td>
        </tr>
        <tr>
          <td>Bank Transfer</td>
          <td class="right"><span class="amount-green">Rs.${fmt(
            data.bank
          )}</span></td>
        </tr>
        <tr>
          <td>Credit Sales</td>
          <td class="right"><span class="amount-amber">Rs.${fmt(
            data.creditSales
          )}</span></td>
        </tr>
        <tr>
          <td>Pending in Range</td>
          <td class="right"><span class="${
            data.pending > 0 ? "amount-red" : "amount-gray"
          }">Rs.${fmt(data.pending)}</span></td>
        </tr>
      </tbody>
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
        margin: [12, 12, 12, 12],
        filename,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, logging: false },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      })
      .from(container.firstElementChild as HTMLElement)
      .save();

    document.body.removeChild(container);
  } catch (err) {
    console.warn("html2pdf fallback", err);
    const win = window.open("", "_blank");
    if (!win) return;
    win.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8"/>
      <title>Collection Summary</title>
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

// ─── Collection Summary CSV ───────────────────────────────────────────────────

export const generateSummaryCSV = (data: SummaryData) => {
  const periodLabel =
    data.dateFrom && data.dateTo
      ? `${dayjs(data.dateFrom).format("DD MMM YYYY")} to ${dayjs(
          data.dateTo
        ).format("DD MMM YYYY")}`
      : dayjs().format("DD MMM YYYY");

  const rows: (string | number)[][] = [
    ["Collection Summary Report"],
    ["Period", periodLabel],
    ["Generated", dayjs().format("DD MMM YYYY, hh:mm a")],
    [],
    ["Metric", "Value (Rs.)"],
    ["Invoices Generated", data.invoiceCount],
    ["Total Billed", data.totalBilled],
    ["Total Collected", data.totalCollected],
    ["Cash", data.cash],
    ["UPI", data.upi],
    ["Bank Transfer", data.bank],
    ["Credit Sales", data.creditSales],
    ["Pending in Range", data.pending],
  ];
  downloadCsv(rows, `summary_${dayjs().format("YYYYMMDD_HHmmss")}.csv`);
};
