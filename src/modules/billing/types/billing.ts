export interface CustomerPricing {
  productId: string;
  productName: string;
  unit: string;
  basePrice: number;
  customerPrice: number;
  effectiveDate: string;
}

export interface Customer {
  id: string;
  name: string;
  customerId: string;
  phone: string;
  email: string;
  type: "Residential" | "Commercial" | "Industrial" | "Walk-in";
  status: "Active" | "Inactive" | "Pending";
  outstanding: number;
  address: string;
  pricing: CustomerPricing[];
  depositJars: number;
  depositCans: number;
  lastPaymentDate?: string;
  overdueDays?: number;
  isWalkIn?: boolean;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  basePrice: number;
  stock: number;
  unit: string;
  status: string;
  categoryId: string;
  category?: {
    id: string;
    name: string;
    color?: string;
    bg?: string;
  };
  categoryName?: string;
  gstRate?: number;
  costPrice?: number;
  customerPricing?: Record<string, number>;
}

export interface CartItem {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  unit: string;
  quantity: number;
  basePrice: number;
  unitPrice: number;
  isCustomPrice: boolean;
  total: number;
}

export interface InvoiceItem {
  product: string;
  qty: number;
  price: number;
  total: number;
  sku?: string;
}

export interface Invoice {
  id: string;
  customerDbId?: string | null;
  invoiceNo: string;
  customerId: string;
  customerName: string;
  customerType: string;
  customerPhone?: string;
  customerAddress?: string;
  items: InvoiceItem[];
  subtotal: number;
  gst: number;
  dueDate: string | null;
  dueDateRaw?: string | null;
  overdueDays: number;
  discount: number;
  grandTotal: number;
  paidAmount: number;
  balanceAmount: number;
  status: "Paid" | "Pending" | "Partial" | "Overdue" | "Cancelled";
  paymentMode: string;
  deliveryMode: string;
  date: string;
  time: string;
  notes: string;
}

export interface PaymentEntry {
  id: string;
  paymentNo: string;
  invoiceNo: string;
  customerId: string;
  customerName: string;
  amount: number;
  mode: string;
  date: string;
  time: string;
  reference: string;
  notes: string;
}

export type TabKey =
  | "pos"
  | "invoices"
  | "payments"
  | "outstanding"
  | "collection";

export interface TabDef {
  key: TabKey;
  label: string;
  icon: React.ReactNode;
  badge?: number;
}

export type CustomerMode = "existing" | "walkin" | "new";

export interface QuickAddData {
  name: string;
  phone: string;
  email: string;
  address: string;
  type: Customer["type"];
}
