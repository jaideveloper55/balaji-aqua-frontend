import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { billingApi } from "../../api/billing.api";
import type { POSProduct } from "../../api/billing.api";
import type { Customer, CartItem } from "../../types/billing";
import { errorNotification } from "../../../../components/common/Notification";

interface ServerCartItem {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  unit: string;
  quantity: number;
  unitPrice: number;
  basePrice?: number;
  lineTotal: number;
  product: { stock: number; basePrice?: number };
}

interface ServerCart {
  id: string;
  customerId: string | null;
  walkInName: string | null;
  walkInPhone: string | null;
  invoiceType: string;
  gstEnabled: boolean;
  gstRate: number;
  discount: number;
  subtotal: number;
  cgst: number;
  sgst: number;
  totalAmount: number;
  itemCount: number;
  items: ServerCartItem[];
}

function mapServerItem(item: ServerCartItem): CartItem {
  // basePrice: prefer explicit field, then product.basePrice, fall back to unitPrice
  const basePrice = item.basePrice ?? item.product?.basePrice ?? item.unitPrice;
  return {
    id: item.id,
    productId: item.productId,
    productName: item.productName,
    sku: item.sku,
    unit: item.unit,
    quantity: item.quantity,
    basePrice,
    unitPrice: item.unitPrice,
    total: item.lineTotal,
    isCustomPrice: basePrice !== item.unitPrice,
  };
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
export function useCart() {
  const queryClient = useQueryClient();

  // ── Fetch cart from server ──────────────────────────────────────────────────
  const { data: serverCart } = useQuery<ServerCart>({
    queryKey: ["billing-cart"],
    queryFn: billingApi.getCart,
    staleTime: 0, // always fresh — cart changes frequently
  });

  // Map server items to local CartItem[]
  const cart: CartItem[] = (serverCart?.items ?? []).map(mapServerItem);

  // Invalidate cart cache after any mutation
  const invalidateCart = () =>
    queryClient.invalidateQueries({ queryKey: ["billing-cart"] });

  // ── Add to cart ─────────────────────────────────────────────────────────────
  const addMutation = useMutation({
    mutationFn: (product: POSProduct) =>
      billingApi.addCartItem({
        productId: product.id,
        quantity: 1,
        unitPrice: product.basePrice,
      }),
    onSuccess: invalidateCart,
    onError: (err: any) => {
      errorNotification(
        "Cannot Add",
        err?.message ?? "Insufficient stock or product unavailable"
      );
    },
  });

  // ── Update quantity ─────────────────────────────────────────────────────────
  const updateMutation = useMutation({
    mutationFn: ({ itemId, quantity }: { itemId: string; quantity: number }) =>
      billingApi.updateCartItem(itemId, { quantity }),
    onSuccess: invalidateCart,
    onError: (err: any) => {
      errorNotification(
        "Update Failed",
        err?.message ?? "Could not update quantity"
      );
    },
  });

  // ── Remove item ─────────────────────────────────────────────────────────────
  const removeMutation = useMutation({
    mutationFn: (itemId: string) => billingApi.removeCartItem(itemId),
    onSuccess: invalidateCart,
  });

  // ── Clear cart ──────────────────────────────────────────────────────────────
  const clearMutation = useMutation({
    mutationFn: billingApi.clearCart,
    onSuccess: invalidateCart,
  });

  // ── Update settings (customer, GST, discount) ───────────────────────────────
  const settingsMutation = useMutation({
    mutationFn: billingApi.updateCartSettings,
    onSuccess: invalidateCart,
  });

  // ── Public API (same shape as old hook — no changes needed in BillingPage) ──

  const addToCart = (product: POSProduct) => {
    addMutation.mutate(product);
  };

  // delta: +1 or -1 (the +/- buttons)
  const updateQuantity = (cartItemId: string, delta: number) => {
    const item = cart.find((c) => c.id === cartItemId);
    if (!item) return;
    const newQty = item.quantity + delta;
    if (newQty <= 0) {
      removeMutation.mutate(cartItemId);
    } else {
      updateMutation.mutate({ itemId: cartItemId, quantity: newQty });
    }
  };

  // Set exact quantity (typing in the qty field)
  const setQuantity = (cartItemId: string, qty: number) => {
    if (qty <= 0) {
      removeMutation.mutate(cartItemId);
    } else {
      updateMutation.mutate({ itemId: cartItemId, quantity: qty });
    }
  };

  const removeFromCart = (cartItemId: string) => {
    removeMutation.mutate(cartItemId);
  };

  const clearCart = () => {
    clearMutation.mutate();
  };

  // Reprice when customer changes — tell server to reprice via updateSettings
  const repriceForCustomer = (customer: Customer | null) => {
    settingsMutation.mutate({
      customerId: customer?.id ?? undefined,
      invoiceType: customer?.isWalkIn ? "WALK_IN" : "SALE",
      walkInName: customer?.isWalkIn ? customer.name : undefined,
      walkInPhone: customer?.isWalkIn ? customer.phone : undefined,
    });
  };

  // Get effective price for display in product grid
  // Server handles real custom pricing — this is just for the UI display
  const getEffectivePrice = (product: POSProduct) => {
    // Check if this product is in cart with a custom price
    const cartItem = cart.find((c) => c.productId === product.id);
    if (cartItem && cartItem.unitPrice !== product.basePrice) {
      return { price: cartItem.unitPrice, isCustom: true };
    }
    return { price: product.basePrice, isCustom: false };
  };

  return {
    cart,
    serverCart,
    addToCart,
    updateQuantity,
    setQuantity,
    removeFromCart,
    clearCart,
    repriceForCustomer,
    getEffectivePrice,
  };
}
