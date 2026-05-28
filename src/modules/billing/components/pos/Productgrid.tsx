import React, { RefObject } from "react";
import {
  HiOutlineSearch,
  HiOutlinePlus,
  HiOutlineTag,
  HiOutlineCube,
} from "react-icons/hi";
import { HiOutlineBeaker, HiOutlineArchiveBox } from "react-icons/hi2";

import { formatCurrency } from "../../utils/Helpers";
import { CartItem } from "../../types/billing";
import type { POSProduct } from "../../api/billing.api";

interface Props {
  products: POSProduct[];
  productSearch: string;
  onSearchChange: (v: string) => void;
  onAddToCart: (product: POSProduct) => void;
  cart: CartItem[];
  searchRef: RefObject<HTMLInputElement | null>;
  getEffectivePrice: (p: POSProduct) => { price: number; isCustom: boolean };
}

function getCategoryIcon(categoryName: string = "") {
  const name = categoryName.toLowerCase();
  if (name.includes("can") || name.includes("jar"))
    return <HiOutlineArchiveBox className="w-5 h-5 text-blue-500" />;
  if (name.includes("bottle") || name.includes("water"))
    return <HiOutlineBeaker className="w-5 h-5 text-cyan-500" />;
  return <HiOutlineCube className="w-5 h-5 text-slate-400" />;
}

function getCategoryBg(categoryName: string = "") {
  const name = categoryName.toLowerCase();
  if (name.includes("can") || name.includes("jar")) return "bg-blue-50";
  if (name.includes("bottle") || name.includes("water")) return "bg-cyan-50";
  return "bg-slate-50";
}

function getStockStyle(stock: number) {
  if (stock > 50) return "bg-emerald-50 text-emerald-600";
  if (stock > 20) return "bg-amber-50 text-amber-600";
  return "bg-red-50 text-red-600";
}

const ProductGrid: React.FC<Props> = ({
  products,
  productSearch,
  onSearchChange,
  onAddToCart,
  cart,
  searchRef,
  getEffectivePrice,
}) => {
  return (
    <>
      {/* Search bar */}
      <div className="bg-white px-5 py-3 border-b border-gray-100">
        <div className="relative">
          <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
          <input
            ref={searchRef}
            type="text"
            placeholder="Search products by name or SKU... (F3)"
            value={productSearch}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-16 py-2 rounded-xl border border-gray-200
              text-[13px] placeholder:text-gray-300 focus:outline-none
              focus:border-green-400 focus:ring-2 focus:ring-green-50"
          />
          <span
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px]
            bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded font-mono"
          >
            F3
          </span>
        </div>
      </div>

      {/* Product grid */}
      <div className="flex-1 overflow-y-auto py-4 px-5">
        <div className="grid grid-cols-2 xl:grid-cols-3 gap-2.5">
          {products.map((product) => {
            const { price, isCustom } = getEffectivePrice(product);
            const cartItem = cart.find((c) => c.productId === product.id);
            const categoryName = product.category?.name ?? "";
            // Visual stock hint — subtract what's already in cart
            const displayStock = product.stock - (cartItem?.quantity ?? 0);

            return (
              <div
                key={product.id}
                onClick={() => onAddToCart(product)}
                className={`group relative bg-white rounded-xl border-2 p-3.5
                  cursor-pointer transition-all duration-150
                  ${
                    cartItem
                      ? "border-emerald-300 bg-emerald-50/30 shadow-sm"
                      : "border-gray-100 hover:border-emerald-200 hover:shadow-md"
                  }`}
              >
                {/* Stock badge */}
                <div className="absolute top-2 right-2">
                  <span
                    className={`text-[10px] font-medium px-1.5 py-0.5 rounded-md
                    ${getStockStyle(displayStock)}`}
                  >
                    {displayStock} left
                  </span>
                </div>

                {/* Cart quantity badge */}
                {cartItem && (
                  <div
                    className="absolute -top-2 -left-2 w-6 h-6 rounded-full
                    bg-emerald-500 text-white text-[10px] font-bold
                    flex items-center justify-center shadow"
                  >
                    {cartItem.quantity}
                  </div>
                )}

                <div className="flex items-start gap-2.5">
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center
                    shrink-0 ${getCategoryBg(categoryName)}`}
                  >
                    {getCategoryIcon(categoryName)}
                  </div>
                  <div className="min-w-0 flex-1 pr-8">
                    <div className="font-semibold text-[13px] text-gray-800 truncate leading-tight">
                      {product.name}
                    </div>
                    <div className="text-[11px] text-gray-400 mt-0.5">
                      {product.sku}
                    </div>
                  </div>
                </div>

                <div className="mt-2.5 flex items-end justify-between">
                  <div>
                    <div className="text-base font-bold text-gray-900">
                      {formatCurrency(price)}
                    </div>
                    {isCustom && (
                      <div className="flex items-center gap-1 mt-0.5">
                        <HiOutlineTag className="w-2.5 h-2.5 text-emerald-500" />
                        <span className="text-[10px] text-gray-400 line-through">
                          {formatCurrency(product.basePrice)}
                        </span>
                        <span className="text-[10px] text-emerald-600 font-medium">
                          save {formatCurrency(product.basePrice - price)}
                        </span>
                      </div>
                    )}
                  </div>
                  <div
                    className="w-7 h-7 rounded-lg bg-emerald-500 text-white
                    flex items-center justify-center
                    opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                  >
                    <HiOutlinePlus className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {products.length === 0 && (
          <div className="flex flex-col items-center justify-center h-64 text-gray-300">
            <HiOutlineSearch className="w-12 h-12 mb-2 opacity-30" />
            <p className="text-[13px]">
              {productSearch
                ? `No products match "${productSearch}"`
                : "No products available"}
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default ProductGrid;
