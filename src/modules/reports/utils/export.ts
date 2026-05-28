/**
 * Export utilities.
 * - CSV: native, zero deps
 * - Excel: requires `npm i xlsx` (dynamic import — won't break if missing)
 * - PDF: requires `npm i jspdf jspdf-autotable` (dynamic import — won't break if missing)
 */

import { message } from "antd";

export interface ExportColumn {
  key: string;
  label: string;
}

export interface ExportPayload {
  filename: string;
  title: string;
  columns: ExportColumn[];
  rows: Record<string, any>[];
  meta?: { label: string; value: string }[];
}

/* ---------- CSV (zero dep) ---------- */
export const exportToCSV = (payload: ExportPayload) => {
  const { filename, columns, rows } = payload;
  const header = columns.map((c) => `"${c.label}"`).join(",");
  const body = rows
    .map((r) =>
      columns
        .map((c) => {
          const v = r[c.key] ?? "";
          return typeof v === "string"
            ? `"${v.replace(/"/g, '""')}"`
            : String(v);
        })
        .join(",")
    )
    .join("\n");
  triggerDownload(
    `${header}\n${body}`,
    `${filename}.csv`,
    "text/csv;charset=utf-8;"
  );
};

/* ---------- Excel (optional dep) ---------- */
export const exportToExcel = async (payload: ExportPayload) => {
  try {
    const XLSX: any = await import(/* @vite-ignore */ "xlsx");
    const { filename, columns, rows, title, meta } = payload;

    const sheetData: any[][] = [[title]];
    if (meta?.length) {
      meta.forEach((m) => sheetData.push([m.label, m.value]));
      sheetData.push([]);
    }
    sheetData.push(columns.map((c) => c.label));
    rows.forEach((r) => sheetData.push(columns.map((c) => r[c.key] ?? "")));

    const ws = XLSX.utils.aoa_to_sheet(sheetData);
    ws["!cols"] = columns.map((c) => ({ wch: Math.max(c.label.length, 14) }));

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Report");
    XLSX.writeFile(wb, `${filename}.xlsx`);
  } catch (e) {
    message.info("Excel export needs `xlsx` package. Falling back to CSV.");
    exportToCSV(payload);
  }
};

/* ---------- PDF (optional dep) ---------- */
export const exportToPDF = async (payload: ExportPayload) => {
  try {
    const jsPDFMod: any = await import(/* @vite-ignore */ "jspdf");
    const autoTableMod: any = await import(
      /* @vite-ignore */ "jspdf-autotable"
    );
    const jsPDF = jsPDFMod.default || jsPDFMod;
    const autoTable = autoTableMod.default || autoTableMod.autoTable;

    const { filename, columns, rows, title, meta } = payload;
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.setTextColor(15, 23, 42);
    doc.text(title, 14, 18);

    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    let y = 26;
    if (meta) {
      meta.forEach((m) => {
        doc.text(`${m.label}: ${m.value}`, 14, y);
        y += 5;
      });
    }
    doc.text(`Generated: ${new Date().toLocaleString("en-IN")}`, 14, y);

    autoTable(doc, {
      head: [columns.map((c) => c.label)],
      body: rows.map((r) => columns.map((c) => String(r[c.key] ?? ""))),
      startY: y + 6,
      theme: "grid",
      headStyles: {
        fillColor: [34, 197, 94], // emerald — matches your dashboard
        textColor: 255,
        fontStyle: "bold",
      },
      styles: { fontSize: 9, cellPadding: 3 },
      alternateRowStyles: { fillColor: [248, 250, 252] },
    });

    doc.save(`${filename}.pdf`);
  } catch (e) {
    message.info(
      "PDF export needs `jspdf` & `jspdf-autotable`. Falling back to CSV."
    );
    exportToCSV(payload);
  }
};

const triggerDownload = (content: string, filename: string, mime: string) => {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const exportData = (
  format: "csv" | "excel" | "pdf",
  payload: ExportPayload
) => {
  if (format === "csv") return exportToCSV(payload);
  if (format === "excel") return exportToExcel(payload);
  if (format === "pdf") return exportToPDF(payload);
};
