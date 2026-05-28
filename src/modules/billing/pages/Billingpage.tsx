import { useState, useRef, useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { HiOutlineExclamation } from "react-icons/hi";
import {
  HiBanknotes,
  HiClipboardDocumentList,
  HiCreditCard,
  HiMiniChartBarSquare,
} from "react-icons/hi2";

import {
  Customer,
  Invoice,
  PaymentEntry,
  TabKey,
  TabDef,
  CustomerMode,
} from "../types/billing";

import {
  formatCurrency,
  getTodayString,
  getCurrentTimeString,
} from "../utils/Helpers";

import { useCart } from "../../billing/components/hooks/Usecart";
import { useKeyboardShortcuts } from "../../billing/components/hooks/Usekeyboardshortcuts";
import PageHeader from "../components/PageHeader";
import PrintableInvoice from "../components/PrintableInvoice";
import POSTab from "../components/tabs/Postab";
import InvoicesTab from "../components/tabs/Invoices";
import PaymentsTab, { DateRange } from "../components/tabs/Payments";
import OutstandingTab from "../components/tabs/Outstanding";
import CollectionTab from "../components/tabs/Collection";
import CustomerPickerModal from "../components/modals/Customerpickermodal";
import QuickAddCustomerModal from "../components/modals/Quickaddcustomermodal";
import PaymentModal from "../components/modals/Paymentmodal";
import InvoiceDetailDrawer from "../components/drawers/Invoicedetaildrawer";
import AddPaymentDrawer from "../components/drawers/Addpaymentdrawer";
import ExportDrawer from "../components/drawers/Exportdrawer";
import {
  errorNotification,
  successNotification,
} from "../../../components/common/Notification";
import {
  POSProduct,
  billingApi,
  PaymentFilters,
  InvoiceFilters,
  OutstandingFilters,
} from "../api/billing.api";

type ExportType = "invoices" | "payments" | "outstanding" | "summary";

const PAYMENT_MODE_MAP: Record<
  string,
  "CASH" | "UPI" | "BANK_TRANSFER" | "CREDIT"
> = {
  cash: "CASH",
  upi: "UPI",
  bank: "BANK_TRANSFER",
  card: "CASH",
  credit: "CREDIT",
};

const PAYMENT_MODE_LABEL: Record<string, string> = {
  CASH: "Cash",
  UPI: "UPI",
  BANK_TRANSFER: "Bank Transfer",
  CREDIT: "Credit",
};

const PAYMENTS_TAB_MODE_TO_API: Record<
  string,
  PaymentFilters["paymentMode"] | undefined
> = {
  all: undefined,
  Cash: "CASH",
  UPI: "UPI",
  "Bank Transfer": "BANK_TRANSFER",
};

const RISK_MAP: Record<string, "HIGH" | "MEDIUM" | "RECENT" | undefined> = {
  all: undefined,
  high: "HIGH",
  medium: "MEDIUM",
  low: "RECENT",
};

const BillingPage = () => {
  const queryClient = useQueryClient();
  const today = getTodayString();

  const [, setCustomers] = useState<Customer[]>([]);
  const [activeTab, setActiveTab] = useState<TabKey>("pos");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );
  const [lastDueDate, setLastDueDate] = useState<string | null>(null);
  const [customerMode, setCustomerMode] = useState<CustomerMode>("existing");
  const [walkInName, setWalkInName] = useState("");
  const [walkInPhone, setWalkInPhone] = useState("");
  const [productSearch, setProductSearch] = useState("");
  const [paymentMode, setPaymentMode] = useState("cash");
  const [amountReceived, setAmountReceived] = useState(0);
  const [notes, setNotes] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showCustomerPicker, setShowCustomerPicker] = useState(false);
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showInvoiceDetail, setShowInvoiceDetail] = useState(false);
  const [showAddPayment, setShowAddPayment] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [exportDefaultType, setExportDefaultType] =
    useState<ExportType>("invoices");

  const [generatedInvoice, setGeneratedInvoice] = useState<Invoice | null>(
    null
  );
  const [showInvoiceSuccess, setShowInvoiceSuccess] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  // ── Invoices tab filters ────────────────────────────────────────────────
  const [invoiceStatusFilter, setInvoiceStatusFilter] = useState("all");
  const [invoiceSearch, setInvoiceSearch] = useState("");
  const [invoiceDateRange, setInvoiceDateRange] = useState<DateRange>(null);

  // ── Payments tab filters ────────────────────────────────────────────────
  const [paymentsSearch, setPaymentsSearch] = useState("");
  const [paymentsModeFilter, setPaymentsModeFilter] = useState<string>("all");
  const [paymentsDateRange, setPaymentsDateRange] = useState<DateRange>(null);

  // ── Outstanding tab filters ─────────────────────────────────────────────
  const [outstandingFilter, setOutstandingFilter] = useState("all");
  const [outstandingSearch, setOutstandingSearch] = useState("");
  const [outstandingSortBy, setOutstandingSortBy] = useState<
    "risk" | "amount" | "days" | "lastPaid"
  >("risk");
  const OUTSTANDING_PAGE_SIZE = 10;
  const [outstandingPage, setOutstandingPage] = useState(1);

  // ── Collection (daily summary) tab filters ──────────────────────────────
  const [collectionDateRange, setCollectionDateRange] =
    useState<DateRange>(null);
  const COLLECTION_PAGE_SIZE = 10;
  const [collectionPage, setCollectionPage] = useState(1);

  // ── Add Payment drawer state ────────────────────────────────────────────
  const [paymentCustomer, setPaymentCustomer] = useState("");
  const [paymentInvoice, setPaymentInvoice] = useState("");
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [paymentReference, setPaymentReference] = useState("");
  const [paymentNotes, setPaymentNotes] = useState("");

  const productSearchRef = useRef<HTMLInputElement>(null);

  const {
    cart,
    serverCart,
    addToCart,
    updateQuantity,
    setQuantity,
    removeFromCart,
    clearCart,
    getEffectivePrice,
  } = useCart();

  const subtotal = serverCart?.subtotal ?? 0;
  const gstAmount = (serverCart?.cgst ?? 0) + (serverCart?.sgst ?? 0);
  const grandTotal = serverCart?.totalAmount ?? 0;
  const totalItems = serverCart?.itemCount ?? 0;
  const includeGST = serverCart?.gstEnabled ?? false;
  const discount = serverCart?.discount ?? 0;
  const changeAmount = Math.max(0, amountReceived - grandTotal);

  const STATUS_FILTER_MAP: Record<string, string | undefined> = {
    all: undefined,
    paid: "PAID",
    pending: "CONFIRMED",
    partial: "PARTIAL",
    overdue: "OVERDUE",
    cancelled: "CANCELLED",
  };

  const updateCartSettingsMutation = useMutation({
    mutationFn: billingApi.updateCartSettings,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["billing-cart"] }),
  });

  const { data: posProducts, isLoading: isLoadingProducts } = useQuery({
    queryKey: ["billing-pos-products", { search: productSearch }],
    queryFn: () => billingApi.getPOSProducts(productSearch || undefined),
    staleTime: 1000 * 60 * 2,
  });
  const filteredProducts: POSProduct[] = posProducts ?? [];

  // ── Invoices query ──────────────────────────────────────────────────────
  const invoiceApiFilters: InvoiceFilters = useMemo(() => {
    const f: InvoiceFilters = {
      limit: 50,
      status: STATUS_FILTER_MAP[invoiceStatusFilter],
      search: invoiceSearch || undefined,
    };
    if (invoiceDateRange?.[0])
      f.dateFrom = invoiceDateRange[0].format("YYYY-MM-DD");
    if (invoiceDateRange?.[1])
      f.dateTo = invoiceDateRange[1].format("YYYY-MM-DD");
    return f;
  }, [invoiceStatusFilter, invoiceSearch, invoiceDateRange]);

  const { data: invoicesData } = useQuery({
    queryKey: ["billing-invoices", invoiceApiFilters],
    queryFn: () => billingApi.listInvoices(invoiceApiFilters),
    enabled: activeTab === "invoices",
    staleTime: 1000 * 30,
  });

  const paymentApiFilters: PaymentFilters = useMemo(() => {
    const onCollection = activeTab === "collection";
    const range = onCollection ? collectionDateRange : paymentsDateRange;

    const f: PaymentFilters = {
      page: onCollection ? collectionPage : 1,
      limit: onCollection ? COLLECTION_PAGE_SIZE : 100,
    };
    if (range?.[0]) f.dateFrom = range[0].format("YYYY-MM-DD");
    if (range?.[1]) f.dateTo = range[1].format("YYYY-MM-DD");

    if (activeTab === "payments") {
      const apiMode = PAYMENTS_TAB_MODE_TO_API[paymentsModeFilter];
      if (apiMode) f.paymentMode = apiMode;
    }
    return f;
  }, [
    activeTab,
    collectionDateRange,
    collectionPage,
    paymentsDateRange,
    paymentsModeFilter,
  ]);

  const { data: paymentsData } = useQuery({
    queryKey: ["billing-payments", paymentApiFilters],
    queryFn: () => billingApi.listPayments(paymentApiFilters),
    enabled: activeTab === "payments" || activeTab === "collection",
    staleTime: 1000 * 30,
  });

  const outstandingApiFilters: OutstandingFilters = useMemo(
    () => ({
      risk: RISK_MAP[outstandingFilter],
      search: outstandingSearch || undefined,
      sortBy: outstandingSortBy,
      page: outstandingPage,
      limit: OUTSTANDING_PAGE_SIZE,
    }),
    [outstandingFilter, outstandingSearch, outstandingSortBy, outstandingPage]
  );

  const { data: outstandingData } = useQuery({
    queryKey: ["billing-outstanding", outstandingApiFilters],
    queryFn: () => billingApi.getOutstanding(outstandingApiFilters),
    enabled: activeTab === "outstanding",
    staleTime: 1000 * 60,
  });

  const dailySummaryFilters = useMemo(() => {
    const f: { dateFrom?: string; dateTo?: string } = {};
    if (collectionDateRange?.[0])
      f.dateFrom = collectionDateRange[0].format("YYYY-MM-DD");
    if (collectionDateRange?.[1])
      f.dateTo = collectionDateRange[1].format("YYYY-MM-DD");
    return f;
  }, [collectionDateRange]);

  const { data: dailySummary } = useQuery({
    queryKey: ["billing-daily-summary", dailySummaryFilters],
    queryFn: () => billingApi.getDailySummary(dailySummaryFilters),
    enabled: activeTab === "collection",
    staleTime: 1000 * 60 * 5,
  });

  const { data: invoiceDetailData } = useQuery({
    queryKey: ["billing-invoice", selectedInvoice?.id],
    queryFn: () => billingApi.getInvoice(selectedInvoice!.id),
    enabled: showInvoiceDetail && !!selectedInvoice?.id,
    staleTime: 1000 * 10,
  });

  const typeMap: Record<string, string> = {
    RESIDENTIAL: "Residential",
    COMMERCIAL: "Commercial",
    INDUSTRIAL: "Industrial",
  };

  const mapStatus = (inv: any): Invoice["status"] => {
    if (inv.status === "PAID") return "Paid";
    if (inv.status === "CANCELLED") return "Cancelled" as any;
    if (inv.status === "PARTIAL") {
      if (inv.dueDate && new Date(inv.dueDate) < new Date()) return "Overdue";
      return "Partial";
    }
    if (
      inv.dueDate &&
      new Date(inv.dueDate) < new Date() &&
      (inv.balanceDue ?? 0) > 0
    ) {
      return "Overdue";
    }
    return "Pending";
  };

  const mapInvoice = (inv: any): Invoice => {
    const dueDateObj = inv.dueDate ? new Date(inv.dueDate) : null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const balanceDue = inv.balanceDue ?? 0;
    const overdueDays =
      dueDateObj && dueDateObj < today && balanceDue > 0
        ? Math.floor(
            (today.getTime() - dueDateObj.getTime()) / (1000 * 60 * 60 * 24)
          )
        : 0;

    return {
      id: inv.id,
      customerDbId: inv.customer?.id ?? null,
      invoiceNo: inv.invoiceNumber,
      customerId: inv.customer?.customerCode ?? "WALK-IN",
      customerName: inv.customer?.name ?? inv.walkInName ?? "Walk-in",
      customerType: typeMap[inv.customer?.type] ?? "Walk-in",
      customerPhone: inv.customer?.phone ?? inv.walkInPhone ?? "",
      customerAddress: inv.customer?.address ?? "",
      items: (inv.items ?? []).map((item: any) => ({
        product: item.productName,
        qty: item.quantity,
        price: item.unitPrice,
        total: item.lineTotal,
        sku: item.sku,
      })),
      subtotal: inv.subtotal,
      gst: (inv.cgst ?? 0) + (inv.sgst ?? 0),
      discount: inv.discount ?? 0,
      grandTotal: inv.totalAmount,
      paidAmount: inv.paidAmount ?? 0,
      balanceAmount: balanceDue,
      status: mapStatus(inv),
      paymentMode: inv.payments?.[0]?.paymentMode
        ? PAYMENT_MODE_LABEL[inv.payments[0].paymentMode] ??
          inv.payments[0].paymentMode
        : "—",
      deliveryMode: "Counter",
      date: new Date(inv.invoiceDate ?? inv.createdAt).toLocaleDateString(
        "en-IN"
      ),
      time: new Date(inv.invoiceDate ?? inv.createdAt).toLocaleTimeString(
        "en-IN",
        { hour: "2-digit", minute: "2-digit" }
      ),
      notes: inv.notes ?? "",
      dueDate: dueDateObj ? dueDateObj.toLocaleDateString("en-IN") : null,
      dueDateRaw: inv.dueDate ?? null,
      overdueDays,
    };
  };

  const invoices: Invoice[] = useMemo(
    () => (invoicesData?.data ?? []).map(mapInvoice),
    [invoicesData]
  );

  const detailedInvoice: Invoice | null = useMemo(() => {
    if (!invoiceDetailData) return selectedInvoice;
    return mapInvoice(invoiceDetailData);
  }, [invoiceDetailData, selectedInvoice]);

  const payments: PaymentEntry[] = useMemo(
    () =>
      (paymentsData?.data ?? []).map((p: any) => ({
        id: p.id,
        paymentNo: p.paymentNumber,
        invoiceNo: p.invoice?.invoiceNumber ?? "—",
        customerId: p.customer?.customerCode ?? "",
        customerName: p.customer?.name ?? "",
        amount: p.amount,
        mode: PAYMENT_MODE_LABEL[p.paymentMode] ?? p.paymentMode,
        date: new Date(p.paymentDate ?? p.createdAt).toLocaleDateString(
          "en-IN"
        ),
        time: new Date(p.paymentDate ?? p.createdAt).toLocaleTimeString(
          "en-IN",
          { hour: "2-digit", minute: "2-digit" }
        ),
        reference: p.referenceId ?? "",
        notes: p.notes ?? "",
      })),
    [paymentsData]
  );

  const filteredPayments: PaymentEntry[] = useMemo(() => {
    if (!paymentsSearch.trim()) return payments;
    const q = paymentsSearch.trim().toLowerCase();
    return payments.filter(
      (p) =>
        p.paymentNo?.toLowerCase().includes(q) ||
        p.customerName?.toLowerCase().includes(q) ||
        p.invoiceNo?.toLowerCase().includes(q)
    );
  }, [payments, paymentsSearch]);

  const paymentsKpis = useMemo(() => {
    const cash = filteredPayments
      .filter((p) => p.mode === "Cash")
      .reduce((s, p) => s + (p.amount || 0), 0);
    const upi = filteredPayments
      .filter((p) => p.mode === "UPI")
      .reduce((s, p) => s + (p.amount || 0), 0);
    const bank = filteredPayments
      .filter((p) => p.mode === "Bank Transfer")
      .reduce((s, p) => s + (p.amount || 0), 0);
    return {
      cash,
      upi,
      bank,
      total: cash + upi + bank,
      count: filteredPayments.length,
    };
  }, [filteredPayments]);

  const todaySummaryData = paymentsData?.todaySummary ?? {};
  const todayTotal = todaySummaryData?.total ?? 0;

  const customersWithDues: Customer[] = useMemo(
    () =>
      (outstandingData?.data ?? []).map((c: any) => ({
        id: c.id,
        customerId: c.customerCode ?? c.id,
        name: c.name,
        phone: c.phone ?? "",
        email: c.email ?? "",
        type: (typeMap[c.type] ?? "Residential") as Customer["type"],
        status: "Active" as const,
        outstanding: c.outstandingBalance ?? 0,
        overdueDays: c.overdueDays ?? 0,
        lastPaymentDate: c.lastPaid
          ? new Date(c.lastPaid).toLocaleDateString("en-IN")
          : "—",
        address: "",
        pricing: [],
        depositJars: 0,
        depositCans: 0,
      })),
    [outstandingData]
  );

  const totalOutstanding = outstandingData?.summary?.totalOutstanding ?? 0;
  const highRiskCount = outstandingData?.summary?.highRiskCount ?? 0;

  const invoiceStats = useMemo(() => {
    const backendStats = (invoicesData as any)?.stats;
    if (backendStats) {
      return {
        total:
          backendStats.totalAll ?? invoicesData?.meta?.total ?? invoices.length,
        paid: backendStats.paid ?? 0,
        pending: backendStats.pending ?? 0,
        partial: backendStats.partial ?? 0,
        overdue: backendStats.overdue ?? 0,
        totalAmount: backendStats.totalBilled ?? 0,
        collected: backendStats.totalCollected ?? 0,
        pendingAmount: backendStats.totalPending ?? 0,
      };
    }
    return {
      total: invoicesData?.meta?.total ?? invoices.length,
      paid: invoices.filter((i) => i.status === "Paid").length,
      pending: invoices.filter((i) => i.status === "Pending").length,
      partial: invoices.filter((i) => i.status === "Partial").length,
      overdue: invoices.filter((i) => i.status === "Overdue").length,
      totalAmount: invoices.reduce((s, i) => s + i.grandTotal, 0),
      collected: invoices.reduce((s, i) => s + i.paidAmount, 0),
      pendingAmount: invoices.reduce((s, i) => s + i.balanceAmount, 0),
    };
  }, [invoices, invoicesData]);

  const collectionPayments = useMemo(
    () => filteredPayments,
    [filteredPayments]
  );

  const createPaymentMutation = useMutation({
    mutationFn: billingApi.createPayment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["billing-payments"] });
      queryClient.invalidateQueries({ queryKey: ["billing-outstanding"] });
      queryClient.invalidateQueries({ queryKey: ["billing-invoices"] });
      queryClient.invalidateQueries({ queryKey: ["billing-invoice"] });
      queryClient.invalidateQueries({ queryKey: ["billing-daily-summary"] });
    },
    onError: (err: any) => {
      errorNotification(
        "Payment Failed",
        err?.message ?? "Could not record payment"
      );
    },
  });

  const cancelInvoiceMutation = useMutation({
    mutationFn: billingApi.cancelInvoice,
    onSuccess: () => {
      successNotification("Invoice Cancelled", "Stock restored");
      queryClient.invalidateQueries({ queryKey: ["billing-invoices"] });
      queryClient.invalidateQueries({ queryKey: ["billing-outstanding"] });
      queryClient.invalidateQueries({ queryKey: ["billing-pos-products"] });
      setShowInvoiceDetail(false);
    },
    onError: (err: any) =>
      errorNotification(
        "Cancel Failed",
        err?.message ?? "Could not cancel invoice"
      ),
  });

  const checkoutMutation = useMutation({
    mutationFn: billingApi.checkout,
    onSuccess: (response) => {
      setIsProcessing(false);

      const respPaid =
        response.invoice.paidAmount ??
        (paymentMode !== "credit" ? response.invoice.totalAmount : 0);
      const respBalance =
        response.invoice.balanceDue ??
        (paymentMode === "credit" ? response.invoice.totalAmount : 0);

      const mapStatusLocal = (): Invoice["status"] => {
        const s = response.invoice.status;
        if (s === "PAID") return "Paid";
        if (s === "PARTIAL") return "Partial";
        if (s === "CANCELLED") return "Cancelled" as Invoice["status"];
        return "Pending";
      };

      const dueDateRaw = lastDueDate;

      const newInvoice: Invoice = {
        id: response.invoice.id,
        customerDbId: selectedCustomer?.isWalkIn
          ? null
          : selectedCustomer?.id ?? null,
        invoiceNo: response.invoice.invoiceNumber,
        customerId: selectedCustomer!.customerId,
        customerName: selectedCustomer!.name,
        customerType: selectedCustomer!.type,
        customerPhone: selectedCustomer!.phone,
        customerAddress: selectedCustomer!.address,
        items: cart.map((c) => ({
          product: c.productName,
          qty: c.quantity,
          price: c.unitPrice,
          total: c.total,
          sku: c.sku,
        })),
        subtotal,
        gst: gstAmount,
        discount,
        grandTotal: response.invoice.totalAmount,
        paidAmount: respPaid,
        balanceAmount: respBalance,
        status: mapStatusLocal(),
        paymentMode:
          paymentMode === "cash"
            ? "Cash"
            : paymentMode === "upi"
            ? "UPI"
            : paymentMode === "bank"
            ? "Bank Transfer"
            : paymentMode === "card"
            ? "Card"
            : "Credit",
        deliveryMode: "Counter",
        date: today,
        time: getCurrentTimeString(),
        notes,
        dueDate: dueDateRaw
          ? new Date(dueDateRaw).toLocaleDateString("en-IN")
          : null,
        dueDateRaw,
        overdueDays: 0,
      };

      setGeneratedInvoice(newInvoice);
      setShowPaymentModal(false);
      setShowInvoiceSuccess(true);

      if (response.invoice.status === "PARTIAL") {
        successNotification(
          "Partial Payment Recorded",
          `${response.invoice.invoiceNumber} • Paid ${formatCurrency(
            respPaid
          )} • Balance ${formatCurrency(respBalance)}`
        );
      } else {
        successNotification("Invoice Created", response.invoice.invoiceNumber);
      }

      setSelectedCustomer(null);
      setCustomerMode("existing");
      setWalkInName("");
      setWalkInPhone("");
      setAmountReceived(0);

      queryClient.invalidateQueries({ queryKey: ["billing-pos-products"] });
      queryClient.invalidateQueries({ queryKey: ["billing-invoices"] });
      queryClient.invalidateQueries({ queryKey: ["billing-daily-summary"] });
      queryClient.invalidateQueries({ queryKey: ["billing-cart"] });
      queryClient.invalidateQueries({ queryKey: ["billing-outstanding"] });
      queryClient.invalidateQueries({ queryKey: ["billing-payments"] });
    },
    onError: (err: any) => {
      setIsProcessing(false);
      errorNotification(
        "Checkout Failed",
        err?.message ?? "Could not create invoice"
      );
    },
  });

  useKeyboardShortcuts({
    isActive: activeTab === "pos",
    canPay: cart.length > 0,
    onCustomerPicker: () => setShowCustomerPicker(true),
    onProductSearch: () => productSearchRef.current?.focus(),
    onPay: () => handleProcessPayment(),
    onEscape: () => {
      setShowCustomerPicker(false);
      setShowQuickAdd(false);
      setShowPaymentModal(false);
    },
  });

  const tabs: TabDef[] = [
    {
      key: "pos",
      label: "Quick Billing",
      icon: <HiBanknotes className="w-4 h-4" />,
    },
    {
      key: "invoices",
      label: "Invoices",
      icon: <HiClipboardDocumentList className="w-4 h-4" />,
      badge:
        (invoicesData as any)?.stats?.totalAll ?? invoicesData?.meta?.total,
    },
    {
      key: "payments",
      label: "Payments",
      icon: <HiCreditCard className="w-4 h-4" />,
    },
    {
      key: "outstanding",
      label: "Outstanding",
      icon: <HiOutlineExclamation className="w-4 h-4" />,
      badge: outstandingData?.data?.length,
    },
    {
      key: "collection",
      label: "Daily Summary",
      icon: <HiMiniChartBarSquare className="w-4 h-4" />,
    },
  ];

  const openExport = (type: ExportType) => {
    setExportDefaultType(type);
    setShowExport(true);
  };

  const handleSelectCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setCustomerMode("existing");
    setShowCustomerPicker(false);
    updateCartSettingsMutation.mutate({
      customerId: customer.id,
      invoiceType: "SALE",
      walkInName: undefined,
      walkInPhone: undefined,
    });
    setCustomers((prev) =>
      prev.find((c) => c.id === customer.id) ? prev : [customer, ...prev]
    );
    successNotification("Customer Selected", customer.name);
  };

  const handleClearCustomer = () => {
    setSelectedCustomer(null);
    setCustomerMode("existing");
    updateCartSettingsMutation.mutate({
      invoiceType: "SALE",
      walkInName: undefined,
      walkInPhone: undefined,
    });
  };

  const handleSetWalkIn = () => {
    if (!walkInName.trim()) {
      errorNotification("Name Required", "Enter customer name");
      return;
    }
    const walkIn: Customer = {
      id: `walkin-${Date.now()}`,
      customerId: "WALK-IN",
      name: walkInName.trim(),
      phone: walkInPhone.trim() || "—",
      email: "",
      type: "Walk-in",
      status: "Active",
      outstanding: 0,
      address: "",
      pricing: [],
      depositJars: 0,
      depositCans: 0,
      isWalkIn: true,
    };
    setSelectedCustomer(walkIn);
    setCustomerMode("walkin");
    updateCartSettingsMutation.mutate({
      customerId: undefined,
      invoiceType: "WALK_IN",
      walkInName: walkInName.trim(),
      walkInPhone: walkInPhone.trim() || undefined,
    });
    successNotification("Walk-in Set", walkInName.trim());
  };

  const handleProcessPayment = () => {
    if (!selectedCustomer) {
      errorNotification("No Customer", "Select a customer first (F2)");
      return;
    }
    if (selectedCustomer.isWalkIn && !serverCart?.walkInName) {
      errorNotification(
        "Walk-in Not Set",
        "Click 'Set Walk-in' before proceeding"
      );
      return;
    }
    if (cart.length === 0) {
      errorNotification("Cart Empty", "Add products before proceeding");
      return;
    }
    setAmountReceived(grandTotal);
    setShowPaymentModal(true);
  };

  const handleConfirmPayment = (reference?: string, dueDate?: string) => {
    setIsProcessing(true);
    const isPartial = amountReceived > 0 && amountReceived < grandTotal;

    const finalDueDate =
      paymentMode === "credit" || isPartial
        ? dueDate ??
          new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        : null;

    setLastDueDate(finalDueDate);

    checkoutMutation.mutate({
      paymentMode: paymentMode.toUpperCase(),
      referenceId: reference || undefined,
      amountPaid: isPartial ? amountReceived : undefined,
      dueDate: finalDueDate ?? undefined,
    });
  };

  const handlePrint = (invoice?: Invoice) => {
    if (invoice) setGeneratedInvoice(invoice);
    setTimeout(() => window.print(), 200);
  };

  const handleShare = async () => {
    if (!generatedInvoice) return;
    const text = `Invoice ${generatedInvoice.invoiceNo}\n${
      generatedInvoice.customerName
    }\nAmount: ${formatCurrency(generatedInvoice.grandTotal)}\nDate: ${
      generatedInvoice.date
    }`;
    try {
      await navigator.clipboard.writeText(text);
      successNotification("Copied", "Invoice details copied");
    } catch {
      errorNotification("Share Failed", "Could not copy to clipboard");
    }
  };

  const handleNewSale = () => {
    queryClient.invalidateQueries({ queryKey: ["billing-cart"] });
    setSelectedCustomer(null);
    setNotes("");
    setAmountReceived(0);
    setWalkInName("");
    setWalkInPhone("");
    setCustomerMode("existing");
    setShowInvoiceSuccess(false);
    setGeneratedInvoice(null);
    setLastDueDate(null);
  };

  const handleViewInvoice = (inv: Invoice) => {
    setSelectedInvoice(inv);
    setShowInvoiceDetail(true);
  };

  const handleRecordPaymentFromInvoice = (invoice: Invoice) => {
    setShowInvoiceDetail(false);
    setShowAddPayment(true);
    setPaymentCustomer(invoice.customerDbId ?? "");
    setPaymentInvoice(invoice.invoiceNo);
    setPaymentAmount(invoice.balanceAmount);
  };

  const handleRecordPaymentFromOutstanding = (customer: Customer) => {
    setShowAddPayment(true);
    setPaymentCustomer(customer.id);
    setPaymentAmount(customer.outstanding);
  };

  const handleViewInvoicesFromOutstanding = (customer: Customer) => {
    setActiveTab("invoices");
    setInvoiceSearch(customer.name);
  };

  const handleCancelInvoice = (invoice: Invoice) => {
    if (invoice.status === "Paid") {
      errorNotification("Cannot Cancel", "Paid invoices cannot be cancelled");
      return;
    }
    cancelInvoiceMutation.mutate(invoice.id);
  };

  const handleSubmitPayment = () => {
    if (!paymentCustomer || paymentAmount <= 0) {
      errorNotification("Missing Fields", "Select customer and enter amount");
      return;
    }

    const inv = invoices.find((i) => i.invoiceNo === paymentInvoice);

    createPaymentMutation.mutate(
      {
        customerId: paymentCustomer,
        invoiceId: inv?.id || undefined,
        amount: paymentAmount,
        paymentMode: PAYMENT_MODE_MAP[paymentMethod] ?? "CASH",
        referenceId: paymentReference || undefined,
        notes: paymentNotes || undefined,
      },
      {
        onSuccess: () => {
          successNotification(
            "Payment Recorded",
            formatCurrency(paymentAmount)
          );
          setShowAddPayment(false);
          setPaymentCustomer("");
          setPaymentInvoice("");
          setPaymentAmount(0);
          setPaymentReference("");
          setPaymentNotes("");
        },
      }
    );
  };

  const handleCustomerCreated = (created: any) => {
    const mapped: Customer = {
      id: created.id,
      customerId: created.customerCode ?? created.id,
      name: created.name,
      phone: created.phone,
      email: created.email ?? "",
      type:
        created.type === "RESIDENTIAL"
          ? "Residential"
          : created.type === "COMMERCIAL"
          ? "Commercial"
          : created.type === "INDUSTRIAL"
          ? "Industrial"
          : "Residential",
      status: "Active",
      outstanding: created.outstandingBalance ?? 0,
      address: [created.addressLine1, created.addressLine2, created.city]
        .filter(Boolean)
        .join(", "),
      pricing: [],
      depositJars: 0,
      depositCans: 0,
    };

    setCustomers((prev) => [mapped, ...prev]);
    setSelectedCustomer(mapped);
    setCustomerMode("existing");

    updateCartSettingsMutation.mutate({
      customerId: mapped.id,
      invoiceType: "SALE",
    });
  };

  return (
    <div className="min-h-screen">
      {/* Print-only invoice receipt */}
      {generatedInvoice && (
        <div className="hidden print:block">
          <PrintableInvoice invoice={generatedInvoice} />
        </div>
      )}

      {/* Everything below hides during print */}
      <div className="print:hidden">
        <PageHeader
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          today={today}
          todayTotal={todayTotal}
        />

        {activeTab === "pos" && (
          <POSTab
            selectedCustomer={selectedCustomer}
            products={filteredProducts}
            isLoadingProducts={isLoadingProducts}
            productSearch={productSearch}
            customerMode={customerMode}
            walkInName={walkInName}
            walkInPhone={walkInPhone}
            onCustomerModeChange={setCustomerMode}
            onWalkInNameChange={setWalkInName}
            onWalkInPhoneChange={setWalkInPhone}
            onSetWalkIn={handleSetWalkIn}
            onClearCustomer={handleClearCustomer}
            onOpenPicker={() => setShowCustomerPicker(true)}
            onOpenQuickAdd={() => setShowQuickAdd(true)}
            onProductSearchChange={setProductSearch}
            onAddToCart={addToCart}
            productSearchRef={productSearchRef}
            getEffectivePrice={getEffectivePrice}
            cart={cart}
            notes={notes}
            discount={discount}
            includeGST={includeGST}
            subtotal={subtotal}
            gstAmount={gstAmount}
            grandTotal={grandTotal}
            totalItems={totalItems}
            showInvoiceSuccess={showInvoiceSuccess}
            generatedInvoice={generatedInvoice}
            onUpdateQty={updateQuantity}
            onSetQty={setQuantity}
            onRemove={removeFromCart}
            onClearCart={clearCart}
            onNotesChange={setNotes}
            onDiscountChange={(amount) =>
              updateCartSettingsMutation.mutate({ discount: amount })
            }
            onPay={handleProcessPayment}
            onPrint={() => handlePrint()}
            onShare={handleShare}
            onNewSale={handleNewSale}
            onIncludeGSTChange={(enabled) =>
              updateCartSettingsMutation.mutate({ gstEnabled: enabled })
            }
          />
        )}

        {activeTab === "invoices" && (
          <InvoicesTab
            onExport={() => openExport("invoices")}
            invoices={invoices}
            stats={invoiceStats}
            search={invoiceSearch}
            statusFilter={invoiceStatusFilter}
            dateRange={invoiceDateRange}
            onSearchChange={setInvoiceSearch}
            onStatusFilterChange={setInvoiceStatusFilter}
            onDateRangeChange={setInvoiceDateRange}
            onView={handleViewInvoice}
            onPrint={(inv) => handlePrint(inv)}
          />
        )}

        {activeTab === "payments" && (
          <PaymentsTab
            payments={filteredPayments}
            totalCash={paymentsKpis.cash}
            totalUPI={paymentsKpis.upi}
            totalBank={paymentsKpis.bank}
            totalAmount={paymentsKpis.total}
            paymentsCount={paymentsKpis.count}
            search={paymentsSearch}
            modeFilter={paymentsModeFilter}
            dateRange={paymentsDateRange}
            onSearchChange={setPaymentsSearch}
            onModeFilterChange={setPaymentsModeFilter}
            onDateRangeChange={setPaymentsDateRange}
            onAddPayment={() => setShowAddPayment(true)}
            onExport={() => openExport("payments")}
          />
        )}

        {activeTab === "outstanding" && (
          <OutstandingTab
            onExport={() => openExport("outstanding")}
            customers={customersWithDues}
            totalOutstanding={totalOutstanding}
            highRiskCount={highRiskCount}
            customersWithDuesCount={
              outstandingData?.summary?.customersWithDues ?? 0
            }
            avgOverdueDays={outstandingData?.summary?.avgOverdueDays ?? 0}
            totalCount={outstandingData?.meta?.total ?? 0}
            page={outstandingPage}
            pageSize={OUTSTANDING_PAGE_SIZE}
            onPageChange={setOutstandingPage}
            filter={outstandingFilter}
            search={outstandingSearch}
            sortBy={outstandingSortBy}
            onFilterChange={setOutstandingFilter}
            onSearchChange={setOutstandingSearch}
            onSortChange={setOutstandingSortBy}
            onRecordPayment={handleRecordPaymentFromOutstanding}
            onViewInvoices={handleViewInvoicesFromOutstanding}
          />
        )}

        {activeTab === "collection" && (
          <CollectionTab
            onExport={() => openExport("summary")}
            dateRange={collectionDateRange}
            onDateRangeChange={setCollectionDateRange}
            selectedPayments={collectionPayments}
            selectedCash={dailySummary?.payments?.CASH ?? 0}
            selectedUPI={dailySummary?.payments?.UPI ?? 0}
            selectedBank={dailySummary?.payments?.BANK_TRANSFER ?? 0}
            selectedTotal={dailySummary?.payments?.total ?? 0}
            totalOutstanding={totalOutstanding}
            invoiceCount={dailySummary?.invoices?.count ?? 0}
            invoicedTotal={dailySummary?.invoices?.totalBilled ?? 0}
            creditSales={dailySummary?.creditSales ?? 0}
            paymentsTotal={paymentsData?.meta?.total ?? 0}
            page={collectionPage}
            pageSize={COLLECTION_PAGE_SIZE}
            onPageChange={setCollectionPage}
          />
        )}

        <CustomerPickerModal
          open={showCustomerPicker}
          onSelect={handleSelectCustomer}
          onClose={() => setShowCustomerPicker(false)}
          onOpenQuickAdd={() => setShowQuickAdd(true)}
        />
        <QuickAddCustomerModal
          open={showQuickAdd}
          onClose={() => setShowQuickAdd(false)}
          onCreated={handleCustomerCreated}
        />
        <PaymentModal
          open={showPaymentModal}
          isProcessing={isProcessing}
          selectedCustomer={selectedCustomer}
          paymentMode={paymentMode}
          amountReceived={amountReceived}
          changeAmount={changeAmount}
          grandTotal={grandTotal}
          onPaymentModeChange={setPaymentMode}
          onAmountReceivedChange={setAmountReceived}
          onConfirm={handleConfirmPayment}
          onClose={() => setShowPaymentModal(false)}
        />
        <InvoiceDetailDrawer
          open={showInvoiceDetail}
          invoice={detailedInvoice}
          onClose={() => setShowInvoiceDetail(false)}
          onPrint={(inv) => handlePrint(inv)}
          onRecordPayment={handleRecordPaymentFromInvoice}
          onCancel={handleCancelInvoice}
        />
        <AddPaymentDrawer
          open={showAddPayment}
          paymentCustomer={paymentCustomer}
          paymentInvoice={paymentInvoice}
          paymentAmount={paymentAmount}
          paymentMethod={paymentMethod}
          paymentReference={paymentReference}
          paymentNotes={paymentNotes}
          onCustomerChange={setPaymentCustomer}
          onInvoiceChange={setPaymentInvoice}
          onAmountChange={setPaymentAmount}
          onMethodChange={setPaymentMethod}
          onReferenceChange={setPaymentReference}
          onNotesChange={setPaymentNotes}
          onSubmit={handleSubmitPayment}
          onClose={() => {
            setShowAddPayment(false);
            setPaymentCustomer("");
            setPaymentInvoice("");
            setPaymentAmount(0);
          }}
        />
        <ExportDrawer
          open={showExport}
          onClose={() => setShowExport(false)}
          defaultReportType={exportDefaultType}
        />
      </div>
    </div>
  );
};

export default BillingPage;
