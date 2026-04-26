import React from "react";
import { Tag } from "antd";
import { HiOutlinePhone } from "react-icons/hi";
import { Invoice } from "../types/billing";
import { formatCurrency, getStatusConfig } from "../utils/Helpers";
import { COMPANY_INFO } from "../constants/Mockdata";

interface Props {
  invoice: Invoice;
}

const PrintableInvoice: React.FC<Props> = ({ invoice }) => (
  <div
    className="printable-invoice bg-white p-8 max-w-[800px] mx-auto"
    id="printable-invoice"
  >
    {/* Header */}
    <div className="flex justify-between items-start pb-6 border-b-2 border-emerald-600">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <div className="w-12 h-12 rounded-xl bg-emerald-600 flex items-center justify-center text-white text-2xl font-bold">
            💧
          </div>
          <div>
            <h1 className="text-2xl font-black text-gray-900">
              {COMPANY_INFO.name}
            </h1>
            <p className="text-xs text-gray-500">{COMPANY_INFO.tagline}</p>
          </div>
        </div>
        <div className="text-[11px] text-gray-500 leading-relaxed mt-2">
          {COMPANY_INFO.address}
          <br />
          Phone: {COMPANY_INFO.phone} · Email: {COMPANY_INFO.email}
          <br />
          GSTIN: {COMPANY_INFO.gstin} · FSSAI: {COMPANY_INFO.fssai}
        </div>
      </div>
      <div className="text-right">
        <div className="inline-block px-4 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-2">
          Tax Invoice
        </div>
        <div className="font-mono text-base font-bold text-gray-900">
          {invoice.invoiceNo}
        </div>
        <div className="text-xs text-gray-500 mt-1">
          {invoice.date} · {invoice.time}
        </div>
        <Tag
          color={getStatusConfig(invoice.status).color}
          className="mt-2 text-[10px]"
        >
          {invoice.status.toUpperCase()}
        </Tag>
      </div>
    </div>

    {/* Bill To */}
    <div className="grid grid-cols-2 gap-6 my-6">
      <div>
        <div className="text-[10px] text-gray-400 uppercase tracking-wider font-bold mb-2">
          Bill To
        </div>
        <div className="font-bold text-gray-900 text-base">
          {invoice.customerName}
        </div>
        <div className="text-xs text-gray-500 mt-0.5 font-mono">
          {invoice.customerId}
        </div>
        {invoice.customerPhone && (
          <div className="text-xs text-gray-600 mt-1.5 flex items-center gap-1">
            <HiOutlinePhone className="w-3 h-3" /> {invoice.customerPhone}
          </div>
        )}
        {invoice.customerAddress && (
          <div className="text-xs text-gray-600 mt-1 leading-relaxed">
            {invoice.customerAddress}
          </div>
        )}
      </div>
      <div className="text-right">
        <div className="text-[10px] text-gray-400 uppercase tracking-wider font-bold mb-2">
          Details
        </div>
        <div className="text-xs space-y-1">
          <div className="flex justify-between">
            <span className="text-gray-500">Customer Type</span>
            <span className="font-medium text-gray-800">
              {invoice.customerType}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Payment Mode</span>
            <span className="font-medium text-gray-800">
              {invoice.paymentMode}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Delivery</span>
            <span className="font-medium text-gray-800">
              {invoice.deliveryMode}
            </span>
          </div>
        </div>
      </div>
    </div>

    {/* Items */}
    <table className="w-full mb-6">
      <thead>
        <tr className="bg-gray-900 text-white text-[11px] uppercase tracking-wider">
          <th className="text-left px-3 py-2.5 font-semibold">#</th>
          <th className="text-left px-3 py-2.5 font-semibold">Product</th>
          <th className="text-left px-3 py-2.5 font-semibold">SKU</th>
          <th className="text-center px-3 py-2.5 font-semibold">Qty</th>
          <th className="text-right px-3 py-2.5 font-semibold">Rate</th>
          <th className="text-right px-3 py-2.5 font-semibold">Total</th>
        </tr>
      </thead>
      <tbody>
        {invoice.items.map((item, idx) => (
          <tr key={idx} className="border-b border-gray-100">
            <td className="px-3 py-3 text-xs text-gray-500">{idx + 1}</td>
            <td className="px-3 py-3 text-[13px] font-semibold text-gray-900">
              {item.product}
            </td>
            <td className="px-3 py-3 text-[11px] font-mono text-gray-500">
              {item.sku || "—"}
            </td>
            <td className="px-3 py-3 text-[13px] text-gray-700 text-center">
              {item.qty}
            </td>
            <td className="px-3 py-3 text-[13px] text-gray-700 text-right">
              {formatCurrency(item.price)}
            </td>
            <td className="px-3 py-3 text-[13px] font-bold text-gray-900 text-right">
              {formatCurrency(item.total)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>

    {/* Totals */}
    <div className="flex justify-end mb-6">
      <div className="w-72 space-y-2">
        <div className="flex justify-between text-[13px]">
          <span className="text-gray-500">Subtotal</span>
          <span className="font-medium text-gray-800">
            {formatCurrency(invoice.subtotal)}
          </span>
        </div>
        {invoice.gst > 0 && (
          <div className="flex justify-between text-[13px]">
            <span className="text-gray-500">GST (18%)</span>
            <span className="font-medium text-gray-800">
              +{formatCurrency(invoice.gst)}
            </span>
          </div>
        )}
        {invoice.discount > 0 && (
          <div className="flex justify-between text-[13px]">
            <span className="text-gray-500">Discount</span>
            <span className="font-medium text-emerald-600">
              -{formatCurrency(invoice.discount)}
            </span>
          </div>
        )}
        <div className="border-t-2 border-gray-900 pt-2 flex justify-between">
          <span className="text-base font-black text-gray-900">
            GRAND TOTAL
          </span>
          <span className="text-xl font-black text-emerald-700">
            {formatCurrency(invoice.grandTotal)}
          </span>
        </div>
        <div className="flex justify-between text-[13px] pt-1">
          <span className="text-emerald-600 font-medium">Paid</span>
          <span className="text-emerald-600 font-bold">
            {formatCurrency(invoice.paidAmount)}
          </span>
        </div>
        {invoice.balanceAmount > 0 && (
          <div className="flex justify-between text-[13px] bg-red-50 rounded px-2 py-1">
            <span className="text-red-600 font-bold">Balance Due</span>
            <span className="text-red-600 font-black">
              {formatCurrency(invoice.balanceAmount)}
            </span>
          </div>
        )}
      </div>
    </div>

    {invoice.notes && (
      <div className="bg-amber-50 border-l-4 border-amber-400 px-3 py-2 mb-6">
        <div className="text-[10px] text-amber-700 font-bold uppercase tracking-wider">
          Notes
        </div>
        <div className="text-xs text-amber-900 mt-0.5">{invoice.notes}</div>
      </div>
    )}

    {/* Footer */}
    <div className="border-t border-gray-200 pt-4 mt-6 grid grid-cols-2 gap-6 text-[10px] text-gray-500">
      <div>
        <div className="font-bold text-gray-700 uppercase tracking-wider mb-1">
          Terms
        </div>
        <ul className="space-y-0.5 leading-relaxed">
          <li>· Goods once sold are non-refundable</li>
          <li>· Empty cans/jars to be returned within 7 days</li>
          <li>· Payment due within 15 days for credit sales</li>
        </ul>
      </div>
      <div className="text-right">
        <div className="font-bold text-gray-700 uppercase tracking-wider mb-8">
          For {COMPANY_INFO.name}
        </div>
        <div className="border-t border-gray-300 pt-1 inline-block min-w-[140px]">
          <div className="text-[10px]">Authorised Signatory</div>
        </div>
      </div>
    </div>

    <div className="text-center mt-6 pt-4 border-t border-dashed border-gray-200">
      <div className="text-[10px] text-gray-400">
        Thank you for your business! 💧
      </div>
      <div className="text-[9px] text-gray-300 mt-0.5">
        This is a computer-generated invoice and does not require a physical
        signature.
      </div>
    </div>
  </div>
);

export default PrintableInvoice;
