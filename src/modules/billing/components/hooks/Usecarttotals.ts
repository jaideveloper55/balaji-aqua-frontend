import { useMemo } from "react";
import { CartItem } from "../../types/billing";

interface UseCartTotalsParams {
  cart: CartItem[];
  includeGST: boolean;
  discount: number;
  amountReceived: number;
}

export const useCartTotals = ({
  cart,
  includeGST,
  discount,
  amountReceived,
}: UseCartTotalsParams) => {
  return useMemo(() => {
    const subtotal = cart.reduce((sum, item) => sum + item.total, 0);
    const gstAmount = includeGST ? Math.round(subtotal * 0.18) : 0;
    const grandTotal = subtotal + gstAmount - discount;
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const changeAmount =
      amountReceived > grandTotal ? amountReceived - grandTotal : 0;

    return {
      subtotal,
      gstAmount,
      grandTotal,
      totalItems,
      changeAmount,
    };
  }, [cart, includeGST, discount, amountReceived]);
};
