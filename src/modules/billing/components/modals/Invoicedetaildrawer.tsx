import React from "react";
import { Drawer, Tag, Divider, message } from "antd";
import {
  HiOutlineDocumentText,
  HiOutlinePrinter,
  HiOutlineClipboardCopy,
  HiOutlineCash,
} from "react-icons/hi";
import {
  formatCurrency,
  getCustomerTypeColor,
  getStatusConfig,
  getInitials,
} from "../../utils/Helpers";
import { Invoice } from "../../types/billing";

interface Props {
  open: boolean;
  invoice: Invoice | null;
  onClose: () => void;
  onPrint: (invoice: Invoice) => void;
  onRecordPayment: (invoice: Invoice) => void;
}

const InvoiceDetailDrawer: React.FC<Props> = ({
  open,
  invoice,
  onClose,
  onPrint,
  onRecordPayment,
}) => (
  <Drawer
    open={open}
    onClose={onClose}
    title={
      <div className="flex items-center gap-2">
        <HiOutlineDocumentText className="w-5 h-5 text-emerald-600" />
        <span>Invoice Details</span>
      </div>
    }
    width={520}
    extra={
      <div className="flex gap-2">
        <button
          onClick={() => invoice && onPrint(invoice)}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-200 text-[12px] font-medium text-gray-600 hover:bg-gray-50"
        >
          <HiOutlinePrinter className="w-3.5 h-3.5" /> Print
        </button>
        <button
          onClick={() => {
            if (invoice) {
              navigator.clipboard.writeText(
                `${invoice.invoiceNo} - ${formatCurrency(invoice.grandTotal)}`
              );
              message.success("Copied!");
            }
          }}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-200 text-[12px] font-medium text-gray-600 hover:bg-gray-50"
        >
          <HiOutlineClipboardCopy className="w-3.5 h-3.5" /> Copy
        </button>
      </div>
    }
  >
    {invoice && (
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-mono text-base font-bold text-gray-900">
              {invoice.invoiceNo}
            </div>
            <div className="text-[12px] text-gray-400 mt-0.5">
              {invoice.date} · {invoice.time}
            </div>
          </div>
          <Tag
            color={getStatusConfig(invoice.status).color}
            className="text-[12px] px-3 py-0.5"
          >
            {invoice.status}
          </Tag>
        </div>

        <div className="bg-gray-50 rounded-xl p-3 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-xs">
            {getInitials(invoice.customerName)}
          </div>
          <div className="flex-1">
            <div className="font-semibold text-[13px] text-gray-800">
              {invoice.customerName}
            </div>
            <div className="flex items-center gap-2 text-[11px] text-gray-400">
              <span>{invoice.customerId}</span>
              <Tag
                color={getCustomerTypeColor(invoice.customerType)}
                className="text-[10px]"
              >
                {invoice.customerType}
              </Tag>
              {invoice.customerPhone && <span>· {invoice.customerPhone}</span>}
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-[12px] font-semibold text-gray-500 uppercase tracking-wide mb-2">
            Items
          </h4>
          <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 text-[11px] text-gray-500">
                  <th className="text-left px-3 py-2 font-medium">Product</th>
                  <th className="text-center px-3 py-2 font-medium">Qty</th>
                  <th className="text-right px-3 py-2 font-medium">Price</th>
                  <th className="text-right px-3 py-2 font-medium">Total</th>
                </tr>
              </thead>
              <tbody>
                {invoice.items.map((item, idx) => (
                  <tr key={idx} className="border-t border-gray-50">
                    <td className="px-3 py-2.5 text-[13px] font-medium text-gray-800">
                      {item.product}
                    </td>
                    <td className="px-3 py-2.5 text-[13px] text-gray-600 text-center">
                      {item.qty}
                    </td>
                    <td className="px-3 py-2.5 text-[13px] text-gray-600 text-right">
                      {formatCurrency(item.price)}
                    </td>
                    <td className="px-3 py-2.5 text-[13px] font-semibold text-gray-900 text-right">
                      {formatCurrency(item.total)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-gray-50 rounded-xl p-4 space-y-2">
          <div className="flex justify-between text-[13px]">
            <span className="text-gray-500">Subtotal</span>
            <span className="text-gray-700 font-medium">
              {formatCurrency(invoice.subtotal)}
            </span>
          </div>
          {invoice.gst > 0 && (
            <div className="flex justify-between text-[13px]">
              <span className="text-gray-500">GST (18%)</span>
              <span className="text-gray-700 font-medium">
                +{formatCurrency(invoice.gst)}
              </span>
            </div>
          )}
          {invoice.discount > 0 && (
            <div className="flex justify-between text-[13px]">
              <span className="text-gray-500">Discount</span>
              <span className="text-emerald-600 font-medium">
                -{formatCurrency(invoice.discount)}
              </span>
            </div>
          )}
          <Divider className="!my-2" />
          <div className="flex justify-between">
            <span className="text-[14px] font-bold text-gray-900">
              Grand Total
            </span>
            <span className="text-[16px] font-bold text-gray-900">
              {formatCurrency(invoice.grandTotal)}
            </span>
          </div>
          <div className="flex justify-between text-[13px]">
            <span className="text-emerald-600 font-medium">Paid</span>
            <span className="text-emerald-600 font-bold">
              {formatCurrency(invoice.paidAmount)}
            </span>
          </div>
          {invoice.balanceAmount > 0 && (
            <div className="flex justify-between text-[13px]">
              <span className="text-red-500 font-medium">Balance Due</span>
              <span className="text-red-600 font-bold">
                {formatCurrency(invoice.balanceAmount)}
              </span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "Payment Mode", value: invoice.paymentMode },
            { label: "Delivery Mode", value: invoice.deliveryMode },

            { label: "Notes", value: invoice.notes || "—" },
          ].map((item, idx) => (
            <div key={idx} className="bg-gray-50 rounded-lg p-3">
              <div className="text-[10px] text-gray-400 uppercase tracking-wide">
                {item.label}
              </div>
              <div className="text-[13px] font-medium text-gray-800 mt-0.5">
                {item.value}
              </div>
            </div>
          ))}
        </div>

        {invoice.balanceAmount > 0 && (
          <button
            onClick={() => onRecordPayment(invoice)}
            className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-[13px] flex items-center justify-center gap-2"
          >
            <HiOutlineCash className="w-4 h-4" /> Record Payment for Balance
          </button>
        )}
      </div>
    )}
  </Drawer>
);

export default InvoiceDetailDrawer;
