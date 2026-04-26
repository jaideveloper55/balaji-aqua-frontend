// modules/billing/utils/helpers.ts

export const formatCurrency = (amount: number) =>
  `₹${amount.toLocaleString("en-IN")}`;

export const getCustomerTypeColor = (type: string) => {
  const map: Record<string, string> = {
    Residential: "blue",
    Commercial: "purple",
    Industrial: "orange",
    "Walk-in": "cyan",
  };
  return map[type] || "default";
};

export const getStatusConfig = (status: string) => {
  const map: Record<string, { color: string }> = {
    Paid: { color: "green" },
    Pending: { color: "orange" },
    Partial: { color: "blue" },
    Overdue: { color: "red" },
    Active: { color: "green" },
    Inactive: { color: "default" },
  };
  return map[status] || { color: "default" };
};

export const generateInvoiceNo = () => {
  const now = new Date();
  const date = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(
    2,
    "0"
  )}${String(now.getDate()).padStart(2, "0")}`;
  const seq = String(Math.floor(Math.random() * 999) + 1).padStart(3, "0");
  return `INV-${date}-${seq}`;
};

export const generatePaymentNo = () => {
  const now = new Date();
  const date = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(
    2,
    "0"
  )}${String(now.getDate()).padStart(2, "0")}`;
  const seq = String(Math.floor(Math.random() * 999) + 1).padStart(3, "0");
  return `PAY-${date}-${seq}`;
};

export const generateCustomerId = (existingCount: number) =>
  `CUS-${String(existingCount + 1).padStart(3, "0")}`;

export const getInitials = (name: string) =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2);

export const getTodayString = () =>
  new Date().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

export const getCurrentTimeString = () =>
  new Date().toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
