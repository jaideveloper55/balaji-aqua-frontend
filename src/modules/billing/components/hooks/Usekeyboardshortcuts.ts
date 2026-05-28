import { useEffect } from "react";

interface ShortcutHandlers {
  onCustomerPicker?: () => void;
  onProductSearch?: () => void;
  onPay?: () => void;
  onEscape?: () => void;
  isActive?: boolean;
  canPay?: boolean;
}

export const useKeyboardShortcuts = ({
  onCustomerPicker,
  onProductSearch,
  onPay,
  onEscape,
  isActive = true,
  canPay = false,
}: ShortcutHandlers) => {
  useEffect(() => {
    if (!isActive) return;

    const handler = (e: KeyboardEvent) => {
      if (e.key === "F2") {
        e.preventDefault();
        onCustomerPicker?.();
      }
      if (e.key === "F3") {
        e.preventDefault();
        onProductSearch?.();
      }
      if (e.key === "F9" && canPay) {
        e.preventDefault();
        onPay?.();
      }
      if (e.key === "Escape") {
        onEscape?.();
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isActive, canPay, onCustomerPicker, onProductSearch, onPay, onEscape]);
};
