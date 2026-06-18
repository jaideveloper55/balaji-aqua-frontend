import dayjs from "dayjs";
import { COMPANY_INFO } from "../../billing/constants/Mockdata";
import { LowStockRow } from "../api/inventory.api";
import { StockItem, StockMovement } from "../types/Inventory";

const fmt = (n: number) =>
  new Intl.NumberFormat("en-IN", { maximumFractionDigits: 2 }).format(n ?? 0);

const fmtDate = (d?: string | Date | null) =>
  d ? dayjs(d).format("DD MMM YYYY") : "—";

const escapeCsv = (val: unknown): string => {
  const s = val === null || val === undefined ? "" : String(val);
  if (/[",\n]/.test(s)) {
    return `"${s.replace(/"/g, '""')}"`;
  }
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

const openPrintableReport = (title: string, bodyHtml: string) => {
  const win = window.open("", "_blank");
  if (!win) return;

  win.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>${title}</title>
        <style>
          * { box-sizing: border-box; }
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; color: #1e293b; padding: 40px; margin: 0; }
          .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 1px solid #e2e8f0; padding-bottom: 16px; margin-bottom: 24px; }
          .company-name { font-size: 22px; font-weight: 800; color: #2563eb; margin: 0; }
          .company-sub { font-size: 13px; color: #64748b; margin: 2px 0 0; }
          .generated { font-size: 12px; color: #94a3b8; text-align: right; }
          h1.report-title { font-size: 26px; font-weight: 800; margin: 0 0 4px; }
          .meta { font-size: 13px; color: #64748b; margin: 0 0 4px; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          thead tr { background: #2563eb; }
          th { color: #fff; text-align: left; font-size: 12px; font-weight: 700; padding: 10px 14px; text-transform: uppercase; letter-spacing: 0.02em; }
          td { font-size: 13px; padding: 9px 14px; border-bottom: 1px solid #f1f5f9; }
          th.center, td.center { text-align: center; }
          tbody tr:nth-child(even) { background: #f8fafc; }
          .kpi-row { display: flex; gap: 16px; margin-top: 28px; flex-wrap: wrap; }
          .kpi-card { flex: 1; min-width: 140px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 14px 16px; }
          .kpi-label { font-size: 11px; color: #64748b; text-transform: uppercase; letter-spacing: 0.04em; font-weight: 700; }
          .kpi-value { font-size: 22px; font-weight: 800; margin-top: 4px; }
          .badge { font-size: 11px; font-weight: 700; padding: 2px 8px; border-radius: 6px; }
          .badge-green { background: #d1fae5; color: #059669; }
          .badge-amber { background: #fef3c7; color: #b45309; }
          .badge-red { background: #fee2e2; color: #dc2626; }
          @media print { body { padding: 16px; } }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <p class="company-name">${COMPANY_INFO.name}</p>
            <p class="company-sub">${COMPANY_INFO.tagline ?? ""}</p>
          </div>
          <div class="generated">Generated: ${dayjs().format(
            "DD MMM YYYY, h:mm a"
          )}</div>
        </div>
        ${bodyHtml}
        <script>
          window.onload = function() { window.focus(); window.print(); };
        </script>
      </body>
    </html>
  `);
  win.document.close();
};

// ─── Stock List ─────────────────────────────────────────────────────────

const stockStatusBadge = (status: string) => {
  if (status === "OUT_OF_STOCK")
    return `<span class="badge badge-red">Out of Stock</span>`;
  if (status === "LOW_STOCK")
    return `<span class="badge badge-amber">Low Stock</span>`;
  return `<span class="badge badge-green">In Stock</span>`;
};

export const generateStockListPDF = (items: StockItem[]) => {
  const rows = items
    .map(
      (i) => `
        <tr>
          <td><strong>${
            i.name
          }</strong><br/><span style="color:#94a3b8;font-size:11px;">${
        i.sku ?? ""
      }</span></td>
          <td>${i.category ?? "—"}</td>
          <td class="center">${fmt(i.current ?? 0)}</td>
          <td class="center">${fmt(i.reserved ?? 0)}</td>
          <td class="center">${fmt(i.available ?? 0)}</td>
          <td class="center">${i.unit ?? "—"}</td>
          <td class="center">${fmt(i.reorderLevel ?? 0)}</td>
          <td class="center">${stockStatusBadge(i.status)}</td>
        </tr>`
    )
    .join("");

  const body = `
    <h1 class="report-title">Stock List Report</h1>
    <p class="meta">${items.length} product${items.length === 1 ? "" : "s"}</p>
    <table>
      <thead>
        <tr><th>Product</th><th>Category</th><th class="center">Current</th><th class="center">Reserved</th><th class="center">Available</th><th class="center">Unit</th><th class="center">Reorder Lvl</th><th class="center">Status</th></tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
  `;

  openPrintableReport("Stock List Report", body);
};

export const generateStockListCSV = (items: StockItem[]) => {
  const header = [
    "Product",
    "SKU",
    "Category",
    "Current",
    "Reserved",
    "Available",
    "Unit",
    "Reorder Level",
    "Status",
  ];
  const rows = items.map((i) => [
    i.name,
    i.sku ?? "",
    i.category ?? "",
    i.current ?? 0,
    i.reserved ?? 0,
    i.available ?? 0,
    i.unit ?? "",
    i.reorderLevel ?? 0,
    i.status ?? "",
  ]);
  downloadCsv(
    [header, ...rows],
    `stock_list_${dayjs().format("YYYYMMDD_HHmmss")}.csv`
  );
};

// ─── Low Stock Alerts ───────────────────────────────────────────────────

export const generateLowStockPDF = (items: LowStockRow[]) => {
  const criticalCount = items.filter((i) => i.critical).length;

  const rows = items
    .map(
      (i) => `
        <tr>
          <td><strong>${
            i.name
          }</strong><br/><span style="color:#94a3b8;font-size:11px;">${
        i.sku ?? ""
      }</span></td>
          <td>${i.category ?? "—"}</td>
          <td class="center">${fmt(i.current ?? 0)}</td>
          <td class="center">${fmt(i.reorderLevel ?? 0)}</td>
          <td class="center">${fmt(i.deficit ?? 0)}</td>
          <td class="center">${
            i.critical
              ? `<span class="badge badge-red">Critical</span>`
              : `<span class="badge badge-amber">Low</span>`
          }</td>
        </tr>`
    )
    .join("");

  const body = `
    <h1 class="report-title">Low Stock Alerts</h1>
    <p class="meta">${items.length} item${
    items.length === 1 ? "" : "s"
  } need attention</p>
    <table>
      <thead><tr><th>Product</th><th>Category</th><th class="center">Current</th><th class="center">Reorder Lvl</th><th class="center">Deficit</th><th class="center">Severity</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
    <div class="kpi-row">
      <div class="kpi-card"><div class="kpi-label">Total Alerts</div><div class="kpi-value">${
        items.length
      }</div></div>
      <div class="kpi-card"><div class="kpi-label">Critical</div><div class="kpi-value" style="color:#dc2626;">${criticalCount}</div></div>
    </div>
  `;

  openPrintableReport("Low Stock Alerts", body);
};

export const generateLowStockCSV = (items: LowStockRow[]) => {
  const header = [
    "Product",
    "SKU",
    "Category",
    "Current",
    "Reorder Level",
    "Deficit",
    "Critical",
  ];
  const rows = items.map((i) => [
    i.name,
    i.sku ?? "",
    i.category ?? "",
    i.current ?? 0,
    i.reorderLevel ?? 0,
    i.deficit ?? 0,
    i.critical ? "Yes" : "No",
  ]);
  downloadCsv(
    [header, ...rows],
    `low_stock_alerts_${dayjs().format("YYYYMMDD_HHmmss")}.csv`
  );
};

// ─── Movement History ───────────────────────────────────────────────────

const movementTypeBadge = (type: string) => {
  if (type === "STOCK_IN")
    return `<span class="badge badge-green">Stock In</span>`;
  if (type === "STOCK_OUT")
    return `<span class="badge badge-red">Stock Out</span>`;
  return `<span class="badge badge-amber">Adjustment</span>`;
};

export const generateMovementsPDF = (
  movements: StockMovement[],
  from?: string,
  to?: string
) => {
  const period =
    from && to
      ? `Period: ${fmtDate(from)} – ${fmtDate(to)}`
      : "Period: All time";

  const rows = movements
    .map(
      (m) => `
        <tr>
          <td>${fmtDate(m.date)}</td>
          <td><strong>${
            m.product?.name ?? "—"
          }</strong><br/><span style="color:#94a3b8;font-size:11px;">${
        m.product?.sku ?? ""
      }</span></td>
          <td class="center">${movementTypeBadge(m.type)}</td>
          <td class="center">${fmt(m.quantity ?? 0)}</td>
          <td class="center">${fmt(m.balance ?? 0)}</td>
          <td>${m.source ?? "—"}</td>
          <td>${m.referenceId ?? "—"}</td>
          <td>${m.remarks ?? "—"}</td>
        </tr>`
    )
    .join("");

  const body = `
    <h1 class="report-title">Stock Movement History</h1>
    <p class="meta">${movements.length} movement${
    movements.length === 1 ? "" : "s"
  }</p>
    <p class="meta">${period}</p>
    <table>
      <thead><tr><th>Date</th><th>Product</th><th class="center">Type</th><th class="center">Qty</th><th class="center">Balance</th><th>Source</th><th>Reference</th><th>Remarks</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
  `;

  openPrintableReport("Stock Movement History", body);
};

export const generateMovementsCSV = (movements: StockMovement[]) => {
  const header = [
    "Date",
    "Product",
    "SKU",
    "Type",
    "Quantity",
    "Balance",
    "Source",
    "Reference",
    "Remarks",
  ];
  const rows = movements.map((m) => [
    fmtDate(m.date),
    m.product?.name ?? "",
    m.product?.sku ?? "",
    m.type ?? "",
    m.quantity ?? 0,
    m.balance ?? 0,
    m.source ?? "",
    m.referenceId ?? "",
    m.remarks ?? "",
  ]);
  downloadCsv(
    [header, ...rows],
    `stock_movements_${dayjs().format("YYYYMMDD_HHmmss")}.csv`
  );
};
