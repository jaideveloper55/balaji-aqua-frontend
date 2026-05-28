import React, { RefObject } from "react";
import { Spin, Switch } from "antd";
import { CartItem, Customer, CustomerMode, Invoice } from "../../types/billing";
import type { POSProduct } from "../../api/billing.api";
import CustomerBar from "../pos/Customerbar";
import ProductGrid from "../pos/Productgrid";
import CartPanel from "../pos/Cartpanel";

interface Props {
  selectedCustomer: Customer | null;
  customerMode: CustomerMode;
  walkInName: string;
  walkInPhone: string;
  onCustomerModeChange: (m: CustomerMode) => void;
  onWalkInNameChange: (v: string) => void;
  onWalkInPhoneChange: (v: string) => void;
  onSetWalkIn: () => void;
  onClearCustomer: () => void;
  onOpenPicker: () => void;
  onOpenQuickAdd: () => void;

  products: POSProduct[];
  isLoadingProducts: boolean;
  productSearch: string;
  onProductSearchChange: (v: string) => void;
  onAddToCart: (p: POSProduct) => void;
  productSearchRef: RefObject<HTMLInputElement | null>;
  getEffectivePrice: (p: POSProduct) => { price: number; isCustom: boolean };

  cart: CartItem[];
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
  onIncludeGSTChange: (v: boolean) => void;
}

const POSTab: React.FC<Props> = (p) => {
  return (
    <div className="flex h-[calc(100vh-130px)]">
      <div className="w-1/2 flex flex-col py-5 overflow-hidden border-r border-gray-100">
        <CustomerBar
          selectedCustomer={p.selectedCustomer}
          customerMode={p.customerMode}
          walkInName={p.walkInName}
          walkInPhone={p.walkInPhone}
          onCustomerModeChange={p.onCustomerModeChange}
          onWalkInNameChange={p.onWalkInNameChange}
          onWalkInPhoneChange={p.onWalkInPhoneChange}
          onSetWalkIn={p.onSetWalkIn}
          onClearCustomer={p.onClearCustomer}
          onOpenPicker={p.onOpenPicker}
          onOpenQuickAdd={p.onOpenQuickAdd}
        />

        {/* Product area with loading overlay */}
        <div className="flex-1 relative overflow-hidden">
          {p.isLoadingProducts && (
            <div
              className="absolute inset-0 z-10 flex flex-col items-center
              justify-center bg-white/70 backdrop-blur-[1px]"
            >
              <Spin size="large" />
              <p className="text-[12px] text-slate-400 mt-3 font-medium">
                Loading products...
              </p>
            </div>
          )}
          <ProductGrid
            products={p.products}
            productSearch={p.productSearch}
            onSearchChange={p.onProductSearchChange}
            onAddToCart={p.onAddToCart}
            cart={p.cart}
            searchRef={p.productSearchRef}
            getEffectivePrice={p.getEffectivePrice}
          />
        </div>

        <div className="bg-white border-t border-gray-100 px-5 py-2.5 flex items-center justify-end">
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-gray-500">GST 18%</span>
            <Switch
              size="small"
              checked={p.includeGST}
              onChange={p.onIncludeGSTChange}
            />
          </div>
        </div>
      </div>

      <CartPanel
        cart={p.cart}
        selectedCustomer={p.selectedCustomer}
        notes={p.notes}
        discount={p.discount}
        includeGST={p.includeGST}
        subtotal={p.subtotal}
        gstAmount={p.gstAmount}
        grandTotal={p.grandTotal}
        totalItems={p.totalItems}
        showInvoiceSuccess={p.showInvoiceSuccess}
        generatedInvoice={p.generatedInvoice}
        onUpdateQty={p.onUpdateQty}
        onSetQty={p.onSetQty}
        onRemove={p.onRemove}
        onClearCart={p.onClearCart}
        onNotesChange={p.onNotesChange}
        onDiscountChange={p.onDiscountChange}
        onPay={p.onPay}
        onPrint={p.onPrint}
        onShare={p.onShare}
        onNewSale={p.onNewSale}
      />
    </div>
  );
};

export default POSTab;
