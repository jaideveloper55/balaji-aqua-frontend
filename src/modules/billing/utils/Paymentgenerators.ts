import dayjs from "dayjs";
import { COMPANY_INFO } from "../../billing/constants/Mockdata";

export interface ExportablePayment {
  paymentNo: string;
  date: string;
  time?: string;
  customerName: string;
  invoiceNo?: string;
  amount: number;
  mode: string;
  reference?: string;
  notes?: string;
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
  const csv = rows.map((r) => r.map(escapeCsv).join(",")).join("\n");
  downloadBlob(
    new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" }),
    filename
  );
};

const MODE_COLOR: Record<string, string> = {
  CASH: "#059669",
  Cash: "#059669",
  UPI: "#2563eb",
  BANK_TRANSFER: "#7c3aed",
  "Bank Transfer": "#7c3aed",
  CREDIT: "#b45309",
  Credit: "#b45309",
};

const modeBadge = (mode: string) => {
  const color = MODE_COLOR[mode] ?? "#64748b";
  const bg = color + "18"; // ~10% opacity hex
  return `<span style="display:inline-block;font-size:10px;font-weight:700;
    padding:2px 8px;border-radius:20px;white-space:nowrap;
    background:${bg};color:${color};">${mode}</span>`;
};

const CSS = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
    color: #1e293b; background: #fff; font-size: 13px; }
  .page-wrapper { max-width: 1000px; margin: 0 auto; padding: 36px 40px; }
  .header { display:flex; justify-content:space-between; align-items:flex-start;
    border-bottom: 2px solid #e2e8f0; padding-bottom: 18px; margin-bottom: 24px; }
  .company-name { font-size:22px; font-weight:800; color:#2563eb; margin-bottom:3px; }
  .company-sub  { font-size:12px; color:#64748b; }
  .generated    { font-size:11px; color:#94a3b8; text-align:right; }
  h1.report-title { font-size:26px; font-weight:800; margin-bottom:3px; }
  .meta    { font-size:13px; color:#2563eb; font-weight:600; }
  .sub-meta{ font-size:12px; color:#64748b; margin-top:2px; }

  .kpi-row { display:flex; gap:12px; margin:20px 0 24px; page-break-inside:avoid; }
  .kpi-card { flex:1; padding:14px 16px; border:1px solid #e2e8f0; border-radius:10px;
    background:#fff; text-align:center; page-break-inside:avoid; }
  .kpi-label { font-size:9px; color:#64748b; text-transform:uppercase;
    letter-spacing:.08em; font-weight:700; margin-bottom:6px; }
  .kpi-value { font-size:22px; font-weight:800; color:#0f172a; line-height:1; }
  .kpi-value.green { color:#059669; }
  .kpi-value.blue  { color:#2563eb; }

  table { width:100%; border-collapse:collapse; }
  thead tr { background:#2563eb; }
  th { color:#fff; text-align:left; font-size:10px; font-weight:700;
    padding:9px 12px; text-transform:uppercase; letter-spacing:.05em; white-space:nowrap; }
  th.right, td.right { text-align:right; }
  th.center, td.center { text-align:center; }
  td { padding:8px 12px; border-bottom:1px solid #f1f5f9; vertical-align:middle; white-space:nowrap; }
  tbody tr:nth-child(even) { background:#f8fafc; }
  .pay-no   { font-family:monospace; font-size:11px; font-weight:700; color:#374151; }
  .pay-date { font-size:11px; color:#64748b; }
  .cust     { font-weight:600; font-size:13px; }
  .inv-no   { font-family:monospace; font-size:11px; color:#64748b; }
  .amount   { font-weight:700; color:#059669; }
  .ref      { font-family:monospace; font-size:10px; color:#94a3b8; }
`;

export const generatePaymentsPDF = async (
  payments: ExportablePayment[],
  periodLabel?: string
) => {
  const filename = `payments_${dayjs().format("YYYYMMDD_HHmmss")}.pdf`;

  const total = payments.reduce((s, p) => s + (p.amount ?? 0), 0);
  const cash = payments
    .filter((p) => ["CASH", "Cash"].includes(p.mode))
    .reduce((s, p) => s + p.amount, 0);
  const upi = payments
    .filter((p) => p.mode === "UPI")
    .reduce((s, p) => s + p.amount, 0);
  const bank = payments
    .filter((p) => ["BANK_TRANSFER", "Bank Transfer"].includes(p.mode))
    .reduce((s, p) => s + p.amount, 0);

  const rows = payments
    .map(
      (p) => `
    <tr>
      <td><div class="pay-no">${p.paymentNo ?? "—"}</div></td>
      <td><div class="pay-date">${p.date}${
        p.time
          ? `<br/><span style="font-size:10px;color:#94a3b8">${p.time}</span>`
          : ""
      }</div></td>
      <td><div class="cust">${p.customerName ?? "—"}</div></td>
      <td><div class="inv-no">${
        p.invoiceNo && p.invoiceNo !== "—" ? p.invoiceNo : "—"
      }</div></td>
      <td class="right"><span class="amount">Rs.${fmt(p.amount)}</span></td>
      <td class="center">${modeBadge(p.mode)}</td>
      <td class="center"><span class="ref">${p.reference || "—"}</span></td>
    </tr>`
    )
    .join("");

  const period = periodLabel ?? dayjs().format("DD MMM YYYY");

  const bodyHtml = `
    <h1 class="report-title">Payment Report</h1>
    <p class="meta">${payments.length} payment${
    payments.length === 1 ? "" : "s"
  }</p>
    <p class="sub-meta">Period: ${period}</p>

    <div class="kpi-row">
      <div class="kpi-card">
        <div class="kpi-label">Total Collected</div>
        <div class="kpi-value green">Rs.${fmt(total)}</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-label">Payments</div>
        <div class="kpi-value blue">${payments.length}</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-label">Cash</div>
        <div class="kpi-value">Rs.${fmt(cash)}</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-label">UPI</div>
        <div class="kpi-value blue">Rs.${fmt(upi)}</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-label">Bank Transfer</div>
        <div class="kpi-value" style="color:#7c3aed">Rs.${fmt(bank)}</div>
      </div>
    </div>

    <table>
      <thead>
        <tr>
          <th>Payment No</th>
          <th>Date</th>
          <th>Customer</th>
          <th>Invoice</th>
          <th class="right">Amount</th>
          <th class="center">Mode</th>
          <th class="center">Reference</th>
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
    </div>`;

  try {
    if (!(window as any).html2pdf) {
      await new Promise<void>((resolve, reject) => {
        const s = document.createElement("script");
        s.src =
          "https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js";
        s.onload = () => resolve();
        s.onerror = () => reject(new Error("Failed to load html2pdf"));
        document.head.appendChild(s);
      });
    }
    const container = document.createElement("div");
    container.innerHTML = fullHtml;
    container.style.cssText = "position:absolute;left:-9999px;top:0;";
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
    console.warn("html2pdf fallback", err);
    const win = window.open("", "_blank");
    if (!win) return;
    win.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8"/>
      <title>Payment Report</title>
      <style>${CSS} @media print{body{padding:16px}@page{margin:1cm size:landscape}}</style></head>
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

export const generatePaymentsCSV = (payments: ExportablePayment[]) => {
  const header = [
    "Payment No",
    "Date",
    "Time",
    "Customer",
    "Invoice No",
    "Amount (Rs.)",
    "Mode",
    "Reference",
    "Notes",
  ];
  const rows = payments.map((p) => [
    p.paymentNo ?? "",
    p.date,
    p.time ?? "",
    p.customerName,
    p.invoiceNo ?? "",
    p.amount,
    p.mode,
    p.reference ?? "",
    p.notes ?? "",
  ]);
  downloadCsv(
    [header, ...rows],
    `payments_${dayjs().format("YYYYMMDD_HHmmss")}.csv`
  );
};
