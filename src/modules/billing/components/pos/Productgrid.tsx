import React, { RefObject } from "react";
import { HiOutlineSearch, HiOutlinePlus, HiOutlineTag } from "react-icons/hi";

import { formatCurrency } from "../../utils/Helpers";
import { CartItem, Product } from "../../types/billing";

interface Props {
  products: Product[];
  productSearch: string;
  onSearchChange: (v: string) => void;
  onAddToCart: (product: Product) => void;
  cart: CartItem[];
  searchRef: RefObject<HTMLInputElement | null>;
  getEffectivePrice: (p: Product) => { price: number; isCustom: boolean };
}

const categoryEmoji: Record<string, string> = {
  Cans: "🪣",
  Jars: "🫙",
  Bottles: "🍶",
};

const categoryBg: Record<string, string> = {
  Cans: "bg-blue-50",
  Jars: "bg-purple-50",
  Bottles: "bg-cyan-50",
};

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
      <div className="bg-white px-5 py-3 border-b border-gray-100">
        <div className="relative">
          <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
          <input
            ref={searchRef}
            type="text"
            placeholder="Search products by name or SKU... (F3)"
            value={productSearch}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-16 py-2 rounded-xl border border-gray-200 text-[13px] placeholder:text-gray-300 focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-50"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded font-mono">
            F3
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-4">
        <div className="grid grid-cols-2 xl:grid-cols-3 gap-2.5">
          {products.map((product) => {
            const { price, isCustom } = getEffectivePrice(product);
            const cartItem = cart.find((c) => c.productId === product.id);
            return (
              <div
                key={product.id}
                onClick={() => onAddToCart(product)}
                className={`group relative bg-white rounded-xl border-2 p-3.5 cursor-pointer transition-all duration-150
                  ${
                    cartItem
                      ? "border-emerald-300 bg-emerald-50/30 shadow-sm"
                      : "border-gray-100 hover:border-emerald-200 hover:shadow-md"
                  }`}
              >
                <div className="absolute top-2 right-2">
                  <span
                    className={`text-[10px] font-medium px-1.5 py-0.5 rounded-md
                    ${
                      product.stock > 50
                        ? "bg-emerald-50 text-emerald-600"
                        : product.stock > 20
                        ? "bg-amber-50 text-amber-600"
                        : "bg-red-50 text-red-600"
                    }`}
                  >
                    {product.stock} left
                  </span>
                </div>
                {cartItem && (
                  <div className="absolute -top-2 -left-2 w-6 h-6 rounded-full bg-emerald-500 text-white text-[10px] font-bold flex items-center justify-center shadow">
                    {cartItem.quantity}
                  </div>
                )}
                <div className="flex items-start gap-2.5">
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center text-base shrink-0 ${
                      categoryBg[product.category] || "bg-gray-50"
                    }`}
                  >
                    {categoryEmoji[product.category] || "📦"}
                  </div>
                  <div className="min-w-0">
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
                  <div className="w-7 h-7 rounded-lg bg-emerald-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
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
            <p className="text-[13px]">No products match "{productSearch}"</p>
          </div>
        )}
      </div>
    </>
  );
};

export default ProductGrid;
