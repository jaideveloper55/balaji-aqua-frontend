"use client";

import React, { useState, useRef, useMemo } from "react";
import { message } from "antd";
import { HiOutlineExclamation } from "react-icons/hi";
import {
  HiBanknotes,
  HiClipboardDocumentList,
  HiCreditCard,
  HiMiniChartBarSquare,
} from "react-icons/hi2";

// Types
import {
  Customer,
  Invoice,
  PaymentEntry,
  TabKey,
  TabDef,
  CustomerMode,
  QuickAddData,
} from "../types/billing";

// Constants
import {
  INITIAL_CUSTOMERS,
  INITIAL_INVOICES,
  INITIAL_PAYMENTS,
  MOCK_PRODUCTS,
} from "../constants/Mockdata";

// Utils
import {
  generateInvoiceNo,
  generatePaymentNo,
  generateCustomerId,
  formatCurrency,
  getTodayString,
  getCurrentTimeString,
} from "../utils/Helpers";

// Hooks
import { useCart } from "../../billing/components/hooks/Usecart";
import { useCartTotals } from "../../billing/components/hooks/Usecarttotals";
import { useKeyboardShortcuts } from "../../billing/components/hooks/Usekeyboardshortcuts";

// Components
import PageHeader from "../components/PageHeader";
import PrintableInvoice from "../components/PrintableInvoice";

// Tabs
import POSTab from "../components/tabs/Postab";
import InvoicesTab from "../components/tabs/Invoices";
import PaymentsTab from "../components/tabs/Payments";
import OutstandingTab from "../components/tabs/Outstanding";
import CollectionTab from "../components/tabs/Collection";

// Modals & Drawers
import CustomerPickerModal from "../components/modals/Customerpickermodal";
import QuickAddCustomerModal from "../components/modals/Quickaddcustomermodal";
import PaymentModal from "../components/modals/Paymentmodal";
import InvoiceDetailDrawer from "../components/drawers/Invoicedetaildrawer";
import AddPaymentDrawer from "../components/drawers/Addpaymentdrawer";
import ExportDrawer from "../components/drawers/Exportdrawer";

type ExportType = "invoices" | "payments" | "outstanding" | "summary";

const BillingPage: React.FC = () => {
  // ── Persistent State ──
  const [customers, setCustomers] = useState<Customer[]>(INITIAL_CUSTOMERS);
  const [invoices, setInvoices] = useState<Invoice[]>(INITIAL_INVOICES);
  const [payments, setPayments] = useState<PaymentEntry[]>(INITIAL_PAYMENTS);

  // ── Tabs ──
  const [activeTab, setActiveTab] = useState<TabKey>("pos");

  // ── POS State ──
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );
  const [customerMode, setCustomerMode] = useState<CustomerMode>("existing");
  const [walkInName, setWalkInName] = useState("");
  const [walkInPhone, setWalkInPhone] = useState("");
  const [productSearch, setProductSearch] = useState("");
  const [customerSearch, setCustomerSearch] = useState("");
  const [paymentMode, setPaymentMode] = useState("cash");
  const [includeGST, setIncludeGST] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [amountReceived, setAmountReceived] = useState(0);
  const [notes, setNotes] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // ── Modals/Drawers ──
  const [showCustomerPicker, setShowCustomerPicker] = useState(false);
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showInvoiceDetail, setShowInvoiceDetail] = useState(false);
  const [showAddPayment, setShowAddPayment] = useState(false);

  // ── Export ──
  const [showExport, setShowExport] = useState(false);
  const [exportDefaultType, setExportDefaultType] =
    useState<ExportType>("invoices");

  // ── Quick Add ──
  const [quickAddData, setQuickAddData] = useState<QuickAddData>({
    name: "",
    phone: "",
    email: "",
    address: "",
    type: "Residential",
  });
  const [quickAddErrors, setQuickAddErrors] = useState<Record<string, string>>(
    {}
  );

  // ── Invoice Display ──
  const [generatedInvoice, setGeneratedInvoice] = useState<Invoice | null>(
    null
  );
  const [showInvoiceSuccess, setShowInvoiceSuccess] = useState(false);

  // ── Invoices Tab ──
  const [invoiceStatusFilter, setInvoiceStatusFilter] = useState("all");
  const [invoiceSearch, setInvoiceSearch] = useState("");
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  // ── Payments Tab ──
  const [paymentCustomer, setPaymentCustomer] = useState("");
  const [paymentInvoice, setPaymentInvoice] = useState("");
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [paymentReference, setPaymentReference] = useState("");
  const [paymentNotes, setPaymentNotes] = useState("");

  // ── Outstanding Tab ──
  const [outstandingFilter, setOutstandingFilter] = useState("all");

  // ── Refs ──
  const productSearchRef = useRef<HTMLInputElement>(null);

  // ── Cart hook ──
  const {
    cart,
    addToCart,
    updateQuantity,
    setQuantity,
    removeFromCart,
    clearCart,
    repriceForCustomer,
    getEffectivePrice,
  } = useCart(selectedCustomer);

  // ── Totals ──
  const { subtotal, gstAmount, grandTotal, totalItems, changeAmount } =
    useCartTotals({ cart, includeGST, discount, amountReceived });

  // ── Today values ──
  const today = getTodayString();
  const todayPayments = payments.filter(
    (p) => p.date === today || p.date === "25 Apr 2026"
  );
  const todayCash = todayPayments
    .filter((p) => p.mode === "Cash")
    .reduce((s, p) => s + p.amount, 0);
  const todayUPI = todayPayments
    .filter((p) => p.mode === "UPI")
    .reduce((s, p) => s + p.amount, 0);
  const todayBank = todayPayments
    .filter((p) => p.mode === "Bank Transfer")
    .reduce((s, p) => s + p.amount, 0);
  const todayTotal = todayPayments.reduce((s, p) => s + p.amount, 0);
  const todayInvoices = invoices.filter(
    (i) => i.date === today || i.date === "25 Apr 2026"
  );

  // ── Keyboard shortcuts ──
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

  // ── Tabs ──
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
      badge: invoices.filter((i) => i.status !== "Paid").length,
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
      badge: customers.filter((c) => c.outstanding > 0).length,
    },
    {
      key: "collection",
      label: "Daily Summary",
      icon: <HiMiniChartBarSquare className="w-4 h-4" />,
    },
  ];

  // ── Filtered lists ──
  const filteredCustomers = customers.filter(
    (c) =>
      c.status !== "Inactive" &&
      (c.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
        c.customerId.toLowerCase().includes(customerSearch.toLowerCase()) ||
        c.phone.includes(customerSearch))
  );

  const filteredProducts = MOCK_PRODUCTS.filter(
    (p) =>
      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.sku.toLowerCase().includes(productSearch.toLowerCase())
  );

  const filteredInvoices = useMemo(
    () =>
      invoices.filter((inv) => {
        const matchStatus =
          invoiceStatusFilter === "all" ||
          inv.status.toLowerCase() === invoiceStatusFilter;
        const matchSearch =
          inv.invoiceNo.toLowerCase().includes(invoiceSearch.toLowerCase()) ||
          inv.customerName.toLowerCase().includes(invoiceSearch.toLowerCase());
        return matchStatus && matchSearch;
      }),
    [invoiceStatusFilter, invoiceSearch, invoices]
  );

  const invoiceStats = useMemo(
    () => ({
      total: invoices.length,
      paid: invoices.filter((i) => i.status === "Paid").length,
      pending: invoices.filter((i) => i.status === "Pending").length,
      partial: invoices.filter((i) => i.status === "Partial").length,
      overdue: invoices.filter((i) => i.status === "Overdue").length,
      totalAmount: invoices.reduce((s, i) => s + i.grandTotal, 0),
      collected: invoices.reduce((s, i) => s + i.paidAmount, 0),
      pendingAmount: invoices.reduce((s, i) => s + i.balanceAmount, 0),
    }),
    [invoices]
  );

  const customersWithDues = useMemo(
    () =>
      customers
        .filter((c) => c.outstanding > 0)
        .sort((a, b) => b.outstanding - a.outstanding),
    [customers]
  );
  const totalOutstanding = customersWithDues.reduce(
    (s, c) => s + c.outstanding,
    0
  );
  const highRiskCount = customersWithDues.filter(
    (c) => (c.overdueDays || 0) > 15
  ).length;

  // ═══════════════════════════════════════════════════════════════════════════
  // HANDLERS
  // ═══════════════════════════════════════════════════════════════════════════

  const openExport = (type: ExportType) => {
    setExportDefaultType(type);
    setShowExport(true);
  };

  const handleSelectCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setCustomerMode("existing");
    setShowCustomerPicker(false);
    repriceForCustomer(customer);
    message.success(`Customer ${customer.name} selected`);
  };

  const handleClearCustomer = () => {
    setSelectedCustomer(null);
    setCustomerMode("existing");
    repriceForCustomer(null);
  };

  const handleSetWalkIn = () => {
    if (!walkInName.trim()) {
      message.warning("Enter customer name");
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
    repriceForCustomer(null);
    message.success(`Walk-in customer "${walkInName}" set`);
  };

  const validateQuickAdd = () => {
    const errs: Record<string, string> = {};
    if (!quickAddData.name.trim()) errs.name = "Name is required";
    if (!quickAddData.phone.trim()) errs.phone = "Phone is required";
    else if (!/^[+\d\s-]{10,}$/.test(quickAddData.phone))
      errs.phone = "Invalid phone";
    if (
      quickAddData.email &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(quickAddData.email)
    )
      errs.email = "Invalid email";
    setQuickAddErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleQuickAddCustomer = () => {
    if (!validateQuickAdd()) return;
    const newCustomer: Customer = {
      id: String(Date.now()),
      customerId: generateCustomerId(customers.length),
      name: quickAddData.name.trim(),
      phone: quickAddData.phone.trim(),
      email: quickAddData.email.trim(),
      type: quickAddData.type,
      status: "Active",
      outstanding: 0,
      address: quickAddData.address.trim(),
      pricing: [],
      depositJars: 0,
      depositCans: 0,
    };
    setCustomers([newCustomer, ...customers]);
    setSelectedCustomer(newCustomer);
    setCustomerMode("existing");
    setShowQuickAdd(false);
    setQuickAddData({
      name: "",
      phone: "",
      email: "",
      address: "",
      type: "Residential",
    });
    setQuickAddErrors({});
    message.success(`${newCustomer.name} added & selected`);
  };

  const handleProcessPayment = () => {
    if (!selectedCustomer) {
      message.warning("Please select a customer first (F2)");
      return;
    }
    if (cart.length === 0) {
      message.warning("Cart is empty");
      return;
    }
    setAmountReceived(grandTotal);
    setShowPaymentModal(true);
  };

  const handleConfirmPayment = (reference?: string) => {
    setIsProcessing(true);
    setTimeout(() => {
      const isCredit = paymentMode === "credit";
      const paid = isCredit ? 0 : grandTotal;
      const balance = isCredit ? grandTotal : 0;
      const invoiceNo = generateInvoiceNo();

      const newInvoice: Invoice = {
        id: `inv-${Date.now()}`,
        invoiceNo,
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
        grandTotal,
        paidAmount: paid,
        balanceAmount: balance,
        status: isCredit ? "Pending" : "Paid",
        paymentMode:
          paymentMode === "cash"
            ? "Cash"
            : paymentMode === "upi"
            ? "UPI"
            : paymentMode === "card"
            ? "Card"
            : paymentMode === "bank"
            ? "Bank Transfer"
            : "Credit",
        deliveryMode: "Counter",
        date: getTodayString(),
        time: getCurrentTimeString(),
        notes,
      };

      setInvoices([newInvoice, ...invoices]);

      if (!isCredit) {
        const newPayment: PaymentEntry = {
          id: `pay-${Date.now()}`,
          paymentNo: generatePaymentNo(),
          invoiceNo,
          customerId: selectedCustomer!.customerId,
          customerName: selectedCustomer!.name,
          amount: grandTotal,
          mode: newInvoice.paymentMode,
          date: newInvoice.date,
          time: newInvoice.time,
          reference: reference || "",
          notes: "",
        };
        setPayments([newPayment, ...payments]);
      }

      if (isCredit && !selectedCustomer!.isWalkIn) {
        setCustomers(
          customers.map((c) =>
            c.id === selectedCustomer!.id
              ? {
                  ...c,
                  outstanding: c.outstanding + grandTotal,
                  overdueDays: 0,
                }
              : c
          )
        );
      }

      setIsProcessing(false);
      setGeneratedInvoice(newInvoice);
      setShowPaymentModal(false);
      setShowInvoiceSuccess(true);
      message.success("Invoice generated successfully!");
    }, 800);
  };

  const handlePrint = (invoice?: Invoice) => {
    if (invoice) setGeneratedInvoice(invoice);
    setTimeout(() => window.print(), 200);
  };

  const handleShare = async () => {
    if (!generatedInvoice) return;
    const shareText = `Invoice ${generatedInvoice.invoiceNo}\n${
      generatedInvoice.customerName
    }\nAmount: ${formatCurrency(generatedInvoice.grandTotal)}\nDate: ${
      generatedInvoice.date
    }`;
    try {
      await navigator.clipboard.writeText(shareText);
      message.success("Invoice details copied to clipboard");
    } catch {
      message.info("Share details: " + shareText);
    }
  };

  const handleNewSale = () => {
    clearCart();
    setSelectedCustomer(null);
    setDiscount(0);
    setIncludeGST(false);
    setNotes("");
    setAmountReceived(0);
    setWalkInName("");
    setWalkInPhone("");
    setCustomerMode("existing");
    setShowInvoiceSuccess(false);
    setGeneratedInvoice(null);
  };

  const handleViewInvoice = (inv: Invoice) => {
    setSelectedInvoice(inv);
    setShowInvoiceDetail(true);
  };

  const handleRecordPaymentFromInvoice = (invoice: Invoice) => {
    setShowInvoiceDetail(false);
    setShowAddPayment(true);
    setPaymentCustomer(invoice.customerId);
    setPaymentInvoice(invoice.invoiceNo);
    setPaymentAmount(invoice.balanceAmount);
  };

  const handleRecordPaymentFromOutstanding = (customer: Customer) => {
    setShowAddPayment(true);
    setPaymentCustomer(customer.customerId);
    setPaymentAmount(customer.outstanding);
  };

  const handleViewInvoicesFromOutstanding = (customer: Customer) => {
    setActiveTab("invoices");
    setInvoiceSearch(customer.name);
  };

  const handleSubmitPayment = () => {
    const cust = customers.find((c) => c.customerId === paymentCustomer);
    if (!cust) return;
    const newPayment: PaymentEntry = {
      id: `pay-${Date.now()}`,
      paymentNo: generatePaymentNo(),
      invoiceNo: paymentInvoice || "—",
      customerId: paymentCustomer,
      customerName: cust.name,
      amount: paymentAmount,
      mode:
        paymentMethod === "cash"
          ? "Cash"
          : paymentMethod === "upi"
          ? "UPI"
          : paymentMethod === "bank"
          ? "Bank Transfer"
          : "Card",
      date: today,
      time: getCurrentTimeString(),
      reference: paymentReference,
      notes: paymentNotes,
    };
    setPayments([newPayment, ...payments]);
    setCustomers(
      customers.map((c) =>
        c.customerId === paymentCustomer
          ? {
              ...c,
              outstanding: Math.max(0, c.outstanding - paymentAmount),
              lastPaymentDate: today,
            }
          : c
      )
    );
    message.success(`Payment of ${formatCurrency(paymentAmount)} recorded!`);
    setShowAddPayment(false);
    setPaymentCustomer("");
    setPaymentInvoice("");
    setPaymentAmount(0);
    setPaymentReference("");
    setPaymentNotes("");
  };

  return (
    <div className="min-h-screen">
      {generatedInvoice && (
        <div className="hidden print:block">
          <PrintableInvoice invoice={generatedInvoice} />
        </div>
      )}

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
          products={filteredProducts}
          productSearch={productSearch}
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
          onDiscountChange={setDiscount}
          onPay={handleProcessPayment}
          onPrint={() => handlePrint()}
          onShare={handleShare}
          onNewSale={handleNewSale}
          onIncludeGSTChange={setIncludeGST}
        />
      )}

      {activeTab === "invoices" && (
        <InvoicesTab
          onExport={() => openExport("invoices")}
          invoices={filteredInvoices}
          stats={invoiceStats}
          search={invoiceSearch}
          statusFilter={invoiceStatusFilter}
          onSearchChange={setInvoiceSearch}
          onStatusFilterChange={setInvoiceStatusFilter}
          onView={handleViewInvoice}
          onPrint={(inv) => handlePrint(inv)}
        />
      )}

      {activeTab === "payments" && (
        <PaymentsTab
          onExport={() => openExport("payments")}
          payments={payments}
          todayCash={todayCash}
          todayUPI={todayUPI}
          todayBank={todayBank}
          todayTotal={todayTotal}
          todayPaymentsCount={todayPayments.length}
          onAddPayment={() => setShowAddPayment(true)}
        />
      )}

      {activeTab === "outstanding" && (
        <OutstandingTab
          onExport={() => openExport("outstanding")}
          customers={customersWithDues}
          totalOutstanding={totalOutstanding}
          highRiskCount={highRiskCount}
          filter={outstandingFilter}
          onFilterChange={setOutstandingFilter}
          onRecordPayment={handleRecordPaymentFromOutstanding}
          onViewInvoices={handleViewInvoicesFromOutstanding}
        />
      )}

      {activeTab === "collection" && (
        <CollectionTab
          onExport={() => openExport("summary")}
          today={today}
          todayPayments={todayPayments}
          todayInvoices={todayInvoices}
          todayCash={todayCash}
          todayUPI={todayUPI}
          todayBank={todayBank}
          todayTotal={todayTotal}
          totalOutstanding={0}
        />
      )}

      <CustomerPickerModal
        open={showCustomerPicker}
        customers={filteredCustomers}
        search={customerSearch}
        onSearchChange={setCustomerSearch}
        onSelect={handleSelectCustomer}
        onClose={() => setShowCustomerPicker(false)}
        onOpenQuickAdd={() => setShowQuickAdd(true)}
      />

      <QuickAddCustomerModal
        open={showQuickAdd}
        data={quickAddData}
        errors={quickAddErrors}
        onChange={setQuickAddData}
        onSubmit={handleQuickAddCustomer}
        onClose={() => {
          setShowQuickAdd(false);
          setQuickAddErrors({});
        }}
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
        invoice={selectedInvoice}
        onClose={() => setShowInvoiceDetail(false)}
        onPrint={(inv) => handlePrint(inv)}
        onRecordPayment={handleRecordPaymentFromInvoice}
      />

      <AddPaymentDrawer
        open={showAddPayment}
        customers={customers}
        invoices={invoices}
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
        invoices={invoices}
        payments={payments}
        customers={customers}
        defaultReportType={exportDefaultType}
      />
    </div>
  );
};

export default BillingPage;
