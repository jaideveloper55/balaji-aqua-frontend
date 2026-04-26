import React from "react";
import { Table, Badge, InputNumber, Divider } from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  HiOutlineShoppingCart,
  HiOutlineTrash,
  HiOutlinePlus,
  HiOutlineMinus,
  HiOutlineTag,
  HiOutlineExclamationCircle,
  HiOutlineCash,
  HiOutlinePrinter,
  HiOutlineCheckCircle,
  HiOutlineShare,
} from "react-icons/hi";

import { formatCurrency } from "../../utils/Helpers";
import { CartItem, Customer, Invoice } from "../../types/billing";

interface Props {
  cart: CartItem[];
  selectedCustomer: Customer | null;
  notes: string;
  discount: number;
  includeGST: boolean;
  subtotal: number;
  gstAmount: number;
  grandTotal: number;
  totalItems: number;
  showInvoiceSuccess: boolean;
  generatedInvoice: Invoice | null;
  onUpdateQty: (id: string, delta: number) => void;
  onSetQty: (id: string, qty: number) => void;
  onRemove: (id: string) => void;
  onClearCart: () => void;
  onNotesChange: (v: string) => void;
  onDiscountChange: (v: number) => void;
  onPay: () => void;
  onPrint: () => void;
  onShare: () => void;
  onNewSale: () => void;
}

const CartPanel: React.FC<Props> = ({
  cart,
  selectedCustomer,
  notes,
  discount,
  includeGST,
  subtotal,
  gstAmount,
  grandTotal,
  totalItems,
  showInvoiceSuccess,
  generatedInvoice,
  onUpdateQty,
  onSetQty,
  onRemove,
  onClearCart,
  onNotesChange,
  onDiscountChange,
  onPay,
  onPrint,
  onShare,
  onNewSale,
}) => {
  const columns: ColumnsType<CartItem> = [
    {
      title: "#",
      width: 32,
      render: (_, __, i) => (
        <span className="text-[11px] text-gray-400">{i + 1}</span>
      ),
    },
    {
      title: "Product",
      dataIndex: "productName",
      render: (name: string, r) => (
        <div>
          <div className="font-medium text-[13px] text-gray-800 leading-tight">
            {name}
          </div>
          <div className="text-[11px] text-gray-400 font-mono">{r.sku}</div>
        </div>
      ),
    },
    {
      title: "Rate",
      dataIndex: "unitPrice",
      width: 80,
      render: (price: number, r) => (
        <div>
          <span className="font-semibold text-[13px] text-gray-800">
            {formatCurrency(price)}
          </span>
          {r.isCustomPrice && (
            <div className="flex items-center gap-1">
              <HiOutlineTag className="w-2.5 h-2.5 text-emerald-500" />
              <span className="text-[10px] text-gray-400 line-through">
                {formatCurrency(r.basePrice)}
              </span>
            </div>
          )}
        </div>
      ),
    },
    {
      title: "Qty",
      dataIndex: "quantity",
      width: 110,
      render: (qty: number, r) => (
        <div className="flex items-center gap-1">
          <button
            onClick={() => onUpdateQty(r.productId, -1)}
            className="w-6 h-6 rounded border border-gray-200 flex items-center justify-center hover:bg-gray-50 text-gray-500 shrink-0"
          >
            <HiOutlineMinus className="w-3 h-3" />
          </button>
          <InputNumber
            min={1}
            value={qty}
            size="small"
            className="w-12 text-center"
            controls={false}
            onChange={(val) => val && val > 0 && onSetQty(r.productId, val)}
          />
          <button
            onClick={() => onUpdateQty(r.productId, 1)}
            className="w-6 h-6 rounded border border-gray-200 flex items-center justify-center hover:bg-gray-50 text-gray-500 shrink-0"
          >
            <HiOutlinePlus className="w-3 h-3" />
          </button>
        </div>
      ),
    },
    {
      title: "Total",
      dataIndex: "total",
      width: 80,
      align: "right" as const,
      render: (total: number) => (
        <span className="font-bold text-[13px] text-gray-900">
          {formatCurrency(total)}
        </span>
      ),
    },
    {
      title: "",
      width: 36,
      render: (_, r) => (
        <button
          onClick={() => onRemove(r.productId)}
          className="w-7 h-7 rounded flex items-center justify-center text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors"
        >
          <HiOutlineTrash className="w-3.5 h-3.5" />
        </button>
      ),
    },
  ];

  return (
    <div className="flex-1  flex flex-col m-5 bg-white">
      {/* ─── Header ─── */}
      <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <HiOutlineShoppingCart className="w-5 h-5 text-gray-400" />
          <h2 className="font-semibold text-[14px] text-gray-800">Cart</h2>
          {cart.length > 0 && (
            <Badge
              count={totalItems}
              style={{ backgroundColor: "#16a34a" }}
              className="ml-1"
            />
          )}
        </div>
        {cart.length > 0 && (
          <button
            onClick={onClearCart}
            className="text-[11px] text-red-400 hover:text-red-600 font-medium"
          >
            Clear All
          </button>
        )}
      </div>

      {/* ─── Cart Items / Empty State ─── */}
      <div className="flex-1 overflow-y-auto">
        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-300 px-6 py-12">
            <div className="w-20 h-20 rounded-full bg-gray-50 flex items-center justify-center mb-3">
              <HiOutlineShoppingCart className="w-10 h-10 text-gray-300" />
            </div>
            <p className="text-[13px] font-semibold text-gray-500 mb-1">
              Cart is empty
            </p>
            <p className="text-[11px] text-center text-gray-400 max-w-[220px]">
              Select a customer and click products on the left to add them here
            </p>
          </div>
        ) : (
          <Table
            dataSource={cart}
            columns={columns}
            rowKey="productId"
            pagination={false}
            size="small"
            className="billing-cart-table"
          />
        )}
      </div>

      {/* ─── Cart Summary (only when items exist) ─── */}
      {cart.length > 0 && (
        <div className="border-t border-gray-100">
          <div className="px-4 py-2 border-b border-gray-50">
            <input
              type="text"
              placeholder="Add notes..."
              value={notes}
              onChange={(e) => onNotesChange(e.target.value)}
              className="w-full text-[12px] text-gray-700 placeholder:text-gray-300 border-none outline-none bg-transparent py-0.5"
            />
          </div>
          <div className="px-4 py-3 space-y-1.5">
            <div className="flex justify-between text-[13px] text-gray-500">
              <span>Subtotal ({totalItems} items)</span>
              <span className="font-medium text-gray-700">
                {formatCurrency(subtotal)}
              </span>
            </div>
            {includeGST && (
              <div className="flex justify-between text-[13px] text-gray-500">
                <span>GST (18%)</span>
                <span className="font-medium text-gray-700">
                  +{formatCurrency(gstAmount)}
                </span>
              </div>
            )}
            <div className="flex justify-between items-center text-[13px] text-gray-500">
              <span>Discount</span>
              <div className="flex items-center gap-1">
                <span className="text-gray-400 text-[12px]">₹</span>
                <InputNumber
                  min={0}
                  max={subtotal}
                  value={discount}
                  size="small"
                  className="w-16"
                  controls={false}
                  onChange={(val) => onDiscountChange(val || 0)}
                />
              </div>
            </div>
            <Divider className="!my-2" />
            <div className="flex justify-between items-center">
              <span className="text-[14px] font-bold text-gray-900">
                Grand Total
              </span>
              <span className="text-xl font-bold text-emerald-600">
                {formatCurrency(grandTotal)}
              </span>
            </div>
            {selectedCustomer && selectedCustomer.outstanding > 0 && (
              <div className="flex items-center gap-2 bg-amber-50 rounded-lg px-3 py-2 mt-2 border border-amber-100">
                <HiOutlineExclamationCircle className="w-4 h-4 text-amber-500 shrink-0" />
                <span className="text-[11px] text-amber-700">
                  Previous due:{" "}
                  <strong>
                    {formatCurrency(selectedCustomer.outstanding)}
                  </strong>
                </span>
              </div>
            )}
          </div>
          <div className="px-4 pb-4 pt-1">
            <button
              onClick={onPay}
              disabled={!selectedCustomer}
              className={`w-full py-3 rounded-xl font-semibold text-[13px] flex items-center justify-center gap-2 transition-all
                ${
                  selectedCustomer
                    ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-200 active:scale-[0.98]"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                }`}
            >
              <HiOutlineCash className="w-5 h-5" />
              {selectedCustomer
                ? `Pay ${formatCurrency(grandTotal)}`
                : "Select Customer to Pay"}
              {selectedCustomer && (
                <span className="ml-1 text-[10px] bg-white/20 px-1.5 py-0.5 rounded font-mono">
                  F9
                </span>
              )}
            </button>
          </div>
        </div>
      )}

      {/* ─── Invoice Success Card ─── */}
      {showInvoiceSuccess && generatedInvoice && (
        <div className="px-4 pb-4">
          <div className="bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-200 rounded-xl p-3.5">
            <div className="flex items-center gap-2 mb-1.5">
              <div className="w-7 h-7 rounded-full bg-emerald-500 flex items-center justify-center">
                <HiOutlineCheckCircle className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold text-emerald-800 text-[13px]">
                Invoice Created!
              </span>
            </div>
            <p className="text-[11px] text-emerald-700 font-mono mb-3">
              {generatedInvoice.invoiceNo}
            </p>
            <div className="grid grid-cols-3 gap-1.5">
              <button
                onClick={onPrint}
                className="flex flex-col items-center gap-0.5 py-2 rounded-lg bg-emerald-600 text-white text-[10px] font-medium hover:bg-emerald-700"
              >
                <HiOutlinePrinter className="w-4 h-4" />
                Print
              </button>
              <button
                onClick={onShare}
                className="flex flex-col items-center gap-0.5 py-2 rounded-lg bg-white border border-emerald-200 text-emerald-700 text-[10px] font-medium hover:bg-emerald-50"
              >
                <HiOutlineShare className="w-4 h-4" />
                Share
              </button>
              <button
                onClick={onNewSale}
                className="flex flex-col items-center gap-0.5 py-2 rounded-lg bg-white border border-emerald-200 text-emerald-700 text-[10px] font-medium hover:bg-emerald-50"
              >
                <HiOutlinePlus className="w-4 h-4" />
                New Sale
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPanel;
