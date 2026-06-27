import dayjs from "dayjs";
import { COMPANY_INFO } from "../../billing/constants/Mockdata";

export interface ExportableProduct {
  id: string;
  name: string;
  sku: string;
  categoryName?: string;
  categoryColor?: string;
  unit: string;
  basePrice: number;
  costPrice?: number;
  gstRate?: number;
  stock: number;
  minStock?: number;
  status: string;
  hsn?: string;
  createdAt?: string;
}

const fmt = (n: number) =>
  new Intl.NumberFormat("en-IN", { maximumFractionDigits: 2 }).format(n ?? 0);

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

const statusBadge = (status: string) => {
  const s = status?.toUpperCase();
  if (s === "ACTIVE")
    return `<span style="background:#d1fae5;color:#059669;display:inline-block;font-size:10px;font-weight:700;padding:2px 8px;border-radius:20px;">Active</span>`;
  if (s === "OUT_OF_STOCK" || s === "OUTOFSTOCK")
    return `<span style="background:#fee2e2;color:#dc2626;display:inline-block;font-size:10px;font-weight:700;padding:2px 8px;border-radius:20px;">Out of Stock</span>`;
  if (s === "LOW_STOCK" || s === "LOWSTOCK")
    return `<span style="background:#fef3c7;color:#b45309;display:inline-block;font-size:10px;font-weight:700;padding:2px 8px;border-radius:20px;">Low Stock</span>`;
  return `<span style="background:#f1f5f9;color:#64748b;display:inline-block;font-size:10px;font-weight:700;padding:2px 8px;border-radius:20px;">${status}</span>`;
};

const CSS = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
    color: #1e293b; background: #fff; font-size: 13px; }
  .page-wrapper { max-width: 1040px; margin: 0 auto; padding: 36px 40px; }
  .header { display:flex; justify-content:space-between; align-items:flex-start;
    border-bottom: 2px solid #e2e8f0; padding-bottom: 18px; margin-bottom: 24px; }
  .company-name { font-size:22px; font-weight:800; color:#2563eb; margin-bottom:3px; }
  .company-sub  { font-size:12px; color:#64748b; }
  .generated    { font-size:11px; color:#94a3b8; text-align:right; }
  h1.report-title { font-size:26px; font-weight:800; margin-bottom:3px; }
  .meta     { font-size:13px; color:#2563eb; font-weight:600; }
  .sub-meta { font-size:12px; color:#64748b; margin-top:2px; }
  .kpi-row { display:flex; gap:12px; margin:20px 0 24px; page-break-inside:avoid; }
  .kpi-card { flex:1; padding:14px 16px; border:1px solid #e2e8f0; border-radius:10px;
    background:#fff; text-align:center; page-break-inside:avoid; }
  .kpi-label { font-size:9px; color:#64748b; text-transform:uppercase;
    letter-spacing:.08em; font-weight:700; margin-bottom:6px; }
  .kpi-value { font-size:22px; font-weight:800; color:#0f172a; line-height:1; }
  .kpi-value.blue   { color:#2563eb; }
  .kpi-value.green  { color:#059669; }
  .kpi-value.red    { color:#dc2626; }
  .kpi-value.amber  { color:#b45309; }
  table { width:100%; border-collapse:collapse; }
  thead tr { background:#2563eb; }
  th { color:#fff; text-align:left; font-size:10px; font-weight:700;
    padding:9px 12px; text-transform:uppercase; letter-spacing:.05em; white-space:nowrap; }
  th.right, td.right { text-align:right; }
  th.center, td.center { text-align:center; }
  td { padding:8px 12px; border-bottom:1px solid #f1f5f9; vertical-align:middle; white-space:nowrap; }
  tbody tr:nth-child(even) { background:#f8fafc; }
  .prod-name { font-weight:700; font-size:13px; }
  .prod-sku  { font-family:monospace; font-size:10px; color:#94a3b8; margin-top:1px; }
  .cat-dot   { display:inline-block; width:8px; height:8px; border-radius:50%; margin-right:5px; }
  .stock-ok  { color:#059669; font-weight:700; }
  .stock-low { color:#b45309; font-weight:700; }
  .stock-out { color:#dc2626; font-weight:700; }
`;

// ─── Products PDF ─────────────────────────────────────────────────────────────

export const generateProductsPDF = async (products: ExportableProduct[]) => {
  const filename = `products_${dayjs().format("YYYYMMDD_HHmmss")}.pdf`;

  const total = products.length;
  const active = products.filter(
    (p) => p.status?.toUpperCase() === "ACTIVE"
  ).length;
  const outOfStock = products.filter((p) => p.stock === 0).length;
  const lowStock = products.filter(
    (p) => p.stock > 0 && p.minStock && p.stock <= p.minStock
  ).length;
  const totalValue = products.reduce((s, p) => s + p.basePrice * p.stock, 0);

  const rows = products
    .map((p) => {
      const stockClass =
        p.stock === 0
          ? "stock-out"
          : p.minStock && p.stock <= p.minStock
          ? "stock-low"
          : "stock-ok";
      return `<tr>
      <td>
        <div class="prod-name">${p.name}</div>
        <div class="prod-sku">${p.sku}</div>
      </td>
      <td class="center">
        ${
          p.categoryColor
            ? `<span><span class="cat-dot" style="background:${
                p.categoryColor
              }"></span>${p.categoryName ?? "—"}</span>`
            : p.categoryName ?? "—"
        }
      </td>
      <td class="right">₹${fmt(
        p.basePrice
      )}<br/><span style="font-size:10px;color:#94a3b8;">cost ₹${fmt(
        p.costPrice ?? 0
      )}</span></td>
      <td class="right"><span class="${stockClass}">${fmt(
        p.stock
      )}</span> <span style="font-size:10px;color:#94a3b8;">${
        p.unit
      }</span></td>
      <td class="center">${p.gstRate ?? 0}%</td>
      <td class="center">${statusBadge(p.status)}</td>
      <td class="center" style="font-size:11px;color:#64748b;">${
        p.createdAt ? dayjs(p.createdAt).format("DD MMM YYYY") : "—"
      }</td>
    </tr>`;
    })
    .join("");

  const bodyHtml = `
    <h1 class="report-title">Product Report</h1>
    <p class="meta">${total} products</p>
    <p class="sub-meta">As of ${dayjs().format("DD MMM YYYY")}</p>

    <div class="kpi-row">
      <div class="kpi-card"><div class="kpi-label">Total Products</div><div class="kpi-value blue">${total}</div></div>
      <div class="kpi-card"><div class="kpi-label">Active</div><div class="kpi-value green">${active}</div></div>
      <div class="kpi-card"><div class="kpi-label">Out of Stock</div><div class="kpi-value red">${outOfStock}</div></div>
      <div class="kpi-card"><div class="kpi-label">Low Stock</div><div class="kpi-value amber">${lowStock}</div></div>
      <div class="kpi-card"><div class="kpi-label">Inventory Value</div><div class="kpi-value blue" style="font-size:16px;">₹${fmt(
        totalValue
      )}</div></div>
    </div>

    <table>
      <thead>
        <tr>
          <th>Product</th>
          <th class="center">Category</th>
          <th class="right">Price</th>
          <th class="right">Stock</th>
          <th class="center">GST</th>
          <th class="center">Status</th>
          <th class="center">Added</th>
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
      <title>Product Report</title>
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

// ─── Products CSV ─────────────────────────────────────────────────────────────

export const generateProductsCSV = (products: ExportableProduct[]) => {
  const header = [
    "SKU",
    "Name",
    "Category",
    "Unit",
    "Selling Price (₹)",
    "Cost Price (₹)",
    "GST %",
    "Stock",
    "Min Stock",
    "Status",
    "HSN",
    "Added",
  ];
  const rows = products.map((p) => [
    p.sku,
    p.name,
    p.categoryName ?? "",
    p.unit,
    p.basePrice,
    p.costPrice ?? 0,
    p.gstRate ?? 0,
    p.stock,
    p.minStock ?? 0,
    p.status,
    p.hsn ?? "",
    p.createdAt ? dayjs(p.createdAt).format("DD MMM YYYY") : "",
  ]);
  downloadCsv(
    [header, ...rows],
    `products_${dayjs().format("YYYYMMDD_HHmmss")}.csv`
  );
};
