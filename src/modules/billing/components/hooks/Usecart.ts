import { useState, useCallback } from "react";
import { CartItem, Customer, Product } from "../../types/billing";

export const useCart = (selectedCustomer: Customer | null) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  const getEffectivePrice = useCallback(
    (product: Product): { price: number; isCustom: boolean } => {
      if (!selectedCustomer)
        return { price: product.basePrice, isCustom: false };
      const cp = selectedCustomer.pricing.find(
        (p) => p.productId === product.id
      );
      return cp
        ? { price: cp.customerPrice, isCustom: true }
        : { price: product.basePrice, isCustom: false };
    },
    [selectedCustomer]
  );

  const addToCart = (product: Product) => {
    const existing = cart.find((item) => item.productId === product.id);
    const { price, isCustom } = getEffectivePrice(product);
    if (existing) {
      setCart(
        cart.map((item) =>
          item.productId === product.id
            ? {
                ...item,
                quantity: item.quantity + 1,
                total: (item.quantity + 1) * item.unitPrice,
              }
            : item
        )
      );
    } else {
      setCart([
        ...cart,
        {
          productId: product.id,
          productName: product.name,
          sku: product.sku,
          unit: product.unit,
          quantity: 1,
          basePrice: product.basePrice,
          unitPrice: price,
          isCustomPrice: isCustom,
          total: price,
        },
      ]);
    }
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart(
      cart
        .map((item) => {
          if (item.productId !== productId) return item;
          const newQty = item.quantity + delta;
          if (newQty <= 0) return null;
          return { ...item, quantity: newQty, total: newQty * item.unitPrice };
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const setQuantity = (productId: string, qty: number) => {
    if (qty <= 0) return;
    setCart(
      cart.map((item) =>
        item.productId === productId
          ? { ...item, quantity: qty, total: qty * item.unitPrice }
          : item
      )
    );
  };

  const removeFromCart = (productId: string) =>
    setCart(cart.filter((item) => item.productId !== productId));

  const clearCart = () => setCart([]);

  const repriceForCustomer = (customer: Customer | null) => {
    if (!customer) {
      setCart(
        cart.map((item) => ({
          ...item,
          unitPrice: item.basePrice,
          isCustomPrice: false,
          total: item.quantity * item.basePrice,
        }))
      );
      return;
    }
    setCart(
      cart.map((item) => {
        const cp = customer.pricing.find((p) => p.productId === item.productId);
        const newPrice = cp ? cp.customerPrice : item.basePrice;
        return {
          ...item,
          unitPrice: newPrice,
          isCustomPrice: !!cp,
          total: item.quantity * newPrice,
        };
      })
    );
  };

  return {
    cart,
    setCart,
    addToCart,
    updateQuantity,
    setQuantity,
    removeFromCart,
    clearCart,
    repriceForCustomer,
    getEffectivePrice,
  };
};
