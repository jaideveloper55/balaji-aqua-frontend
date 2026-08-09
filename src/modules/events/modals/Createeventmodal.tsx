import { useEffect, useMemo, useState } from "react";
import {
  InputNumber,
  TimePicker,
  Switch,
  Select,
  DatePicker,
  Tooltip,
  Spin,
} from "antd";
import dayjs, { Dayjs } from "dayjs";
import { useForm, Controller } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import {
  HiOutlinePlus,
  HiOutlineTrash,
  HiOutlineCalendar,
  HiOutlineUser,
  HiOutlineLocationMarker,
  HiOutlineShoppingCart,
  HiOutlineCash,
  HiOutlineSparkles,
  HiOutlineArrowRight,
  HiOutlineArrowLeft,
  HiOutlineCheck,
  HiOutlineExclamationCircle,
  HiOutlineArchive,
  HiOutlinePencilAlt,
} from "react-icons/hi";

import CustomModal from "../../../components/common/CustomModal";
import CustomInput from "../../../components/common/CustomInput";
import CustomSelect from "../../../components/common/CustomSelect";
import { EVENT_TYPE_OPTIONS, formatINR } from "../constants/Events.constants";
import type { CreateEventOrderPayload } from "../types/Events";
import { getCustomersApi } from "../../customers/api/customers.api";
import type { EventOrder } from "../types/Events";
import { getProductsApi } from "../../products/api/Products.api";

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (form: CreateEventOrderPayload) => void;
  isSubmitting?: boolean;
  initialData?: EventOrder | null;
}

interface Line {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
}

// Internal form type — what react-hook-form manages
// (NOT the same as CreateEventOrderPayload — we assemble that in submit())
interface FormValues {
  eventName: string;
  eventType: string;
  expectedGuests: number;
  customerId?: string | null;
  customerName: string;
  customerPhone: string;
  venueName: string;
  venueCity: string;
  venueAddress: string;
  venuePincode?: string;
  onSiteContactName?: string;
  onSiteContactPhone?: string;
  notes?: string;
}

type StepKey = "event" | "customer" | "venue" | "items" | "money";

interface StepDef {
  key: StepKey;
  label: string;
  shortLabel: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

const STEPS: StepDef[] = [
  {
    key: "event",
    label: "Event Details",
    shortLabel: "Event",
    icon: HiOutlineCalendar,
    description: "When and what kind of event",
  },
  {
    key: "customer",
    label: "Customer",
    shortLabel: "Customer",
    icon: HiOutlineUser,
    description: "Who is booking the event",
  },
  {
    key: "venue",
    label: "Venue & Contact",
    shortLabel: "Venue",
    icon: HiOutlineLocationMarker,
    description: "Where to deliver and on-site contact",
  },
  {
    key: "items",
    label: "Order Items",
    shortLabel: "Items",
    icon: HiOutlineShoppingCart,
    description: "Products to deliver to the event",
  },
  {
    key: "money",
    label: "Pricing & Payment",
    shortLabel: "Payment",
    icon: HiOutlineCash,
    description: "Final amount and advance",
  },
];

const CreateEventModal = ({
  open,
  onClose,
  onSubmit,
  isSubmitting = false,
  initialData = null,
}: Props) => {
  // isEditMode: true when editing an existing event, false for new creation
  const isEditMode = !!initialData;
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
    watch,
    trigger,
  } = useForm<FormValues>({
    mode: "onChange",
    defaultValues: {
      eventType: "WEDDING",
      expectedGuests: 100,
    },
  });

  const [currentStep, setCurrentStep] = useState<StepKey>("event");
  const [lines, setLines] = useState<Line[]>([]);
  const [eventDate, setEventDate] = useState<Dayjs | null>(null);
  const [deliveryTime, setDeliveryTime] = useState<Dayjs | null>(null);
  const [pickupTime, setPickupTime] = useState<Dayjs | null>(null);
  const [discount, setDiscount] = useState(0);
  const [advancePaid, setAdvancePaid] = useState(0);
  const [securityDeposit, setSecurityDeposit] = useState(0);
  const [gstEnabled, setGstEnabled] = useState(true);

  const stepIndex = STEPS.findIndex((s) => s.key === currentStep);
  const isLastStep = stepIndex === STEPS.length - 1;
  const isFirstStep = stepIndex === 0;

  const { data: productsData, isLoading: loadingProducts } = useQuery({
    queryKey: ["products-dropdown"],
    queryFn: () => getProductsApi({ status: "ACTIVE" }).then((res) => res.data),
    staleTime: 1000 * 60 * 10,
    enabled: open,
  });

  const products = productsData?.data ?? [];

  const { data: customersData, isLoading: loadingCustomers } = useQuery({
    queryKey: ["customers-dropdown"],
    queryFn: () =>
      getCustomersApi({ status: "ACTIVE" }).then((res) => res.data),
    staleTime: 1000 * 60 * 5,
    enabled: open,
  });

  const customers = customersData?.data ?? [];

  useEffect(() => {
    if (open && initialData) {
      reset({
        eventName: initialData.eventName,
        eventType: initialData.eventType,
        expectedGuests: initialData.expectedGuests,
        customerId: initialData.customerId ?? null,
        customerName: initialData.customerName,
        customerPhone: initialData.customerPhone,
        venueName: initialData.venueName,
        venueCity: initialData.venueCity,
        venueAddress: initialData.venueAddress,
        venuePincode: initialData.venuePincode ?? undefined,
        onSiteContactName: initialData.onSiteContactName ?? undefined,
        onSiteContactPhone: initialData.onSiteContactPhone ?? undefined,
        notes: initialData.notes ?? undefined,
      });
      // Populate local date/time state
      if (initialData.eventDate) setEventDate(dayjs(initialData.eventDate));
      if (initialData.deliveryTime)
        setDeliveryTime(dayjs(`2000-01-01T${initialData.deliveryTime}`));
      if (initialData.pickupTime)
        setPickupTime(dayjs(`2000-01-01T${initialData.pickupTime}`));
      // Populate pricing state
      setDiscount(initialData.discount ?? 0);
      setGstEnabled(initialData.gstEnabled ?? true);
    }
  }, [open, initialData, reset]);

  // Reset on close
  useEffect(() => {
    if (!open) {
      reset();
      setLines([]);
      setEventDate(null);
      setDeliveryTime(null);
      setPickupTime(null);
      setDiscount(0);
      setAdvancePaid(0);
      setSecurityDeposit(0);
      setCurrentStep("event");
    }
  }, [open, reset]);

  // ─── Watch form for dirty state ─────────────────────────────────────────
  const watched = watch();
  const isDirty =
    Object.values(watched).some(
      (v) => v && (typeof v !== "object" ? String(v).length > 0 : true)
    ) ||
    lines.length > 0 ||
    !!eventDate ||
    discount > 0 ||
    advancePaid > 0;

  // ─── Discard confirmation ───────────────────────────────────────────────
  const handleBeforeClose = async () => {
    if (!isDirty) return true;
    return window.confirm(
      "You have unsaved changes. Discard this event order?"
    );
  };

  const totals = useMemo(() => {
    const subtotal = lines.reduce((s, l) => s + l.quantity * l.unitPrice, 0);
    const taxable = Math.max(0, subtotal - discount);
    const gstAmount = gstEnabled ? taxable * 0.18 : 0;
    const totalAmount = taxable + gstAmount;
    const balanceDue = Math.max(0, totalAmount - advancePaid);
    return { subtotal, gstAmount, totalAmount, balanceDue, taxable };
  }, [lines, discount, gstEnabled, advancePaid]);

  // ─── Step validation ────────────────────────────────────────────────────
  const validateStep = async (step: StepKey): Promise<string | null> => {
    if (step === "event") {
      const ok = await trigger(["eventName", "eventType", "expectedGuests"]);
      if (!ok) return "Please fill in all event details";
      if (!eventDate) return "Please pick an event date";
      if (!deliveryTime) return "Please set a delivery time";
      return null;
    }
    if (step === "customer") {
      const ok = await trigger(["customerName", "customerPhone"]);
      return ok ? null : "Please enter customer name and phone";
    }
    if (step === "venue") {
      const ok = await trigger(["venueName", "venueCity", "venueAddress"]);
      return ok ? null : "Please complete venue information";
    }
    if (step === "items") {
      if (lines.length === 0) return "Add at least one item";
      const incomplete = lines.some(
        (l) => !l.productId || l.quantity <= 0 || l.unitPrice < 0
      );
      if (incomplete) return "Each item needs a product and quantity";
      return null;
    }
    return null;
  };

  const stepErrors: Record<StepKey, boolean> = useMemo(() => {
    return {
      event:
        !!errors.eventName ||
        !!errors.eventType ||
        !!errors.expectedGuests ||
        (currentStep !== "event" && (!eventDate || !deliveryTime)),
      customer: !!errors.customerName || !!errors.customerPhone,
      venue: !!errors.venueName || !!errors.venueCity || !!errors.venueAddress,
      items: currentStep !== "items" && lines.length === 0,
      money: false,
    };
  }, [errors, eventDate, deliveryTime, lines.length, currentStep]);

  const goNext = async () => {
    const err = await validateStep(currentStep);
    if (err) return;
    if (isLastStep) return;
    setCurrentStep(STEPS[stepIndex + 1].key);
  };

  const goBack = () => {
    if (isFirstStep) return;
    setCurrentStep(STEPS[stepIndex - 1].key);
  };

  const goToStep = async (target: StepKey) => {
    const targetIdx = STEPS.findIndex((s) => s.key === target);
    if (targetIdx <= stepIndex) {
      setCurrentStep(target);
      return;
    }
    for (let i = stepIndex; i < targetIdx; i++) {
      const err = await validateStep(STEPS[i].key);
      if (err) {
        setCurrentStep(STEPS[i].key);
        return;
      }
    }
    setCurrentStep(target);
  };

  // ─── Line items ─────────────────────────────────────────────────────────
  const addLine = () =>
    setLines((prev) => [
      ...prev,
      { productId: "", productName: "", quantity: 1, unitPrice: 0 },
    ]);

  const updateLine = (idx: number, patch: Partial<Line>) =>
    setLines((prev) =>
      prev.map((l, i) => (i === idx ? { ...l, ...patch } : l))
    );

  const removeLine = (idx: number) =>
    setLines((prev) => prev.filter((_, i) => i !== idx));

  // ─── Submit ─────────────────────────────────────────────────────────────
  // Assembles the CreateEventOrderPayload from form state + local state
  const submit = async (form: FormValues) => {
    // Final guard — validate all steps before sending
    for (const step of STEPS.slice(0, -1)) {
      const err = await validateStep(step.key);
      if (err) {
        setCurrentStep(step.key);
        return;
      }
    }

    // Build the payload matching CreateEventOrderPayload exactly
    const payload: CreateEventOrderPayload = {
      // Step 1: Event
      eventName: form.eventName,
      eventType: form.eventType as CreateEventOrderPayload["eventType"],
      expectedGuests: form.expectedGuests,
      // ─── FIXED: .format("YYYY-MM-DD") instead of .toISOString() ────
      // WHY: .toISOString() converts to UTC first, which can shift the date
      // back by one day for Indian timezone (UTC+5:30). For example:
      //   User picks "15 Aug 2026" in Chennai (UTC+5:30)
      //   .toISOString() → "2026-08-14T18:30:00.000Z" ← August 14th!
      //   .format("YYYY-MM-DD") → "2026-08-15" ← correct
      eventDate: eventDate!.format("YYYY-MM-DD"),
      deliveryTime: deliveryTime!.format("HH:mm"),
      pickupTime: pickupTime?.format("HH:mm"),

      // Step 2: Customer
      customerId: form.customerId ?? undefined,
      customerName: form.customerName,
      customerPhone: form.customerPhone,

      // Step 3: Venue
      // ─── FIXED: field names to match backend DTO ───────────────────
      // OLD: contactPersonName / contactPersonPhone
      // NEW: onSiteContactName / onSiteContactPhone
      venueName: form.venueName,
      venueAddress: form.venueAddress,
      venueCity: form.venueCity,
      venuePincode: form.venuePincode,
      onSiteContactName: form.onSiteContactName,
      onSiteContactPhone: form.onSiteContactPhone,

      // Step 4: Items
      items: lines.map((l) => ({
        productId: l.productId,
        quantity: l.quantity,
        unitPrice: l.unitPrice,
      })),

      // Step 5: Payment
      discount,
      gstEnabled,
      advancePaid: advancePaid > 0 ? advancePaid : undefined,
      advancePaymentMode: advancePaid > 0 ? "CASH" : undefined,
      securityDeposit: securityDeposit > 0 ? securityDeposit : undefined,
      notes: form.notes,
    };

    onSubmit(payload);
    // NOTE: We do NOT call onClose() here — the parent (EventsPage) closes
    // the modal in the mutation's onSuccess callback. This way, if the API
    // call fails, the modal stays open so the user doesn't lose their data.
  };

  // ─── Step content ───────────────────────────────────────────────────────
  const renderStepContent = () => {
    switch (currentStep) {
      case "event":
        return (
          <div className="space-y-5">
            <StepHeader
              title="Event Details"
              description="Tell us about the event you're catering"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <CustomInput
                name="eventName"
                control={control}
                label="Event Name"
                size="large"
                placeholder="e.g. Ramesh & Priya Wedding Reception"
                isrequired
                errors={errors}
                rules={{ required: "Event name is required" }}
                className="md:col-span-2"
              />
              <CustomSelect
                name="eventType"
                control={control}
                label="Event Type"
                size="large"
                placeholder="Select type"
                isrequired
                errors={errors}
                options={EVENT_TYPE_OPTIONS}
                rules={{ required: "Event type is required" }}
              />
              <Field
                label="Expected Guests"
                required
                hint="Helps us recommend quantities"
              >
                <Controller
                  control={control}
                  name="expectedGuests"
                  rules={{ required: true, min: 1 }}
                  render={({ field }) => (
                    <InputNumber
                      {...field}
                      size="large"
                      className="w-full"
                      min={1}
                      placeholder="100"
                    />
                  )}
                />
              </Field>

              <Field label="Event Date" required>
                <DatePicker
                  size="large"
                  className="w-full"
                  value={eventDate}
                  onChange={setEventDate}
                  placeholder="Select date"
                  format="DD MMM YYYY"
                  disabledDate={(d) => d && d < dayjs().startOf("day")}
                />
              </Field>

              <div className="grid grid-cols-2 gap-3">
                <Field label="Delivery Time" required>
                  <TimePicker
                    size="large"
                    className="w-full"
                    format="HH:mm"
                    value={deliveryTime}
                    onChange={setDeliveryTime}
                    placeholder="08:00"
                  />
                </Field>
                <Field label="Pickup Time" hint="Optional">
                  <TimePicker
                    size="large"
                    className="w-full"
                    format="HH:mm"
                    value={pickupTime}
                    onChange={setPickupTime}
                    placeholder="22:00"
                  />
                </Field>
              </div>
            </div>
          </div>
        );

      case "customer":
        return (
          <div className="space-y-5">
            <StepHeader
              title="Customer Information"
              description="Pick an existing customer or enter new details"
            />

            <div className="border border-blue-100 rounded-xl p-4">
              <Field
                label="Find Existing Customer"
                hint="Selecting one auto-fills name and phone below"
              >
                <Spin spinning={loadingCustomers} size="small">
                  <Select
                    size="large"
                    className="w-full"
                    showSearch
                    allowClear
                    placeholder="Search by name or phone..."
                    optionFilterProp="label"
                    // ─── CHANGED: real customers from API ─────────────
                    options={(customers as any[]).map((c: any) => ({
                      value: c.id,
                      label: `${c.name} · ${c.phone}`,
                    }))}
                    onChange={(id) => {
                      const c = (customers as any[]).find(
                        (x: any) => x.id === id
                      );
                      setValue("customerId", id ?? null);
                      if (c) {
                        setValue("customerName", c.name, {
                          shouldValidate: true,
                        });
                        setValue("customerPhone", c.phone, {
                          shouldValidate: true,
                        });
                      }
                    }}
                  />
                </Spin>
              </Field>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <CustomInput
                name="customerName"
                control={control}
                label="Customer Name"
                placeholder="Full name"
                isrequired
                errors={errors}
                rules={{ required: "Customer name is required" }}
              />
              <CustomInput
                name="customerPhone"
                control={control}
                label="Phone"
                placeholder="9876543210"
                isrequired
                errors={errors}
                rules={{
                  required: "Phone is required",
                  pattern: {
                    value: /^[6-9]\d{9}$/,
                    message: "Enter a valid 10-digit Indian phone",
                  },
                }}
              />
            </div>
          </div>
        );

      case "venue":
        return (
          <div className="space-y-5">
            <StepHeader
              title="Venue & On-site Contact"
              description="Where to deliver and who to coordinate with"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <CustomInput
                name="venueName"
                control={control}
                label="Venue Name"
                placeholder="e.g. Sundar Mahal"
                isrequired
                errors={errors}
                rules={{ required: "Venue name is required" }}
              />
              <CustomInput
                name="venueCity"
                control={control}
                label="City"
                placeholder="Chennai"
                isrequired
                errors={errors}
                rules={{ required: "City is required" }}
              />
              <CustomInput
                name="venueAddress"
                control={control}
                label="Full Address"
                placeholder="Street, area, landmark"
                isrequired
                errors={errors}
                rules={{ required: "Address is required" }}
                className="md:col-span-2"
              />
              <CustomInput
                name="venuePincode"
                control={control}
                label="Pincode"
                placeholder="600001"
                errors={errors}
              />
              <div className="hidden md:block" />
              {/* ─── FIXED: field names match backend DTO ──────────────── */}
              <CustomInput
                name="onSiteContactName"
                control={control}
                label="On-site Contact Person"
                placeholder="Name"
                errors={errors}
              />
              <CustomInput
                name="onSiteContactPhone"
                control={control}
                label="On-site Contact Phone"
                placeholder="9876543210"
                errors={errors}
              />
            </div>
          </div>
        );

      case "items":
        return (
          <div className="space-y-5">
            <StepHeader
              title="Order Items"
              description="Add the products being delivered to this event"
            />

            {/* Header row (only when items exist) */}
            {lines.length > 0 && (
              <div className="hidden md:grid grid-cols-12 gap-2 px-3 text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
                <div className="col-span-5">Product</div>
                <div className="col-span-2 text-center">Quantity</div>
                <div className="col-span-2">Unit Price</div>
                <div className="col-span-2 text-right">Total</div>
                <div className="col-span-1" />
              </div>
            )}

            <div className="space-y-2">
              {lines.length === 0 ? (
                <div className="text-center py-12 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                  <div className="w-14 h-14 rounded-full bg-blue-100 mx-auto flex items-center justify-center">
                    <HiOutlineArchive className="w-7 h-7 text-blue-500" />
                  </div>
                  <div className="text-sm font-semibold text-slate-700 mt-3">
                    No items added yet
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    Add products you'll deliver to the venue
                  </div>
                  <button
                    type="button"
                    onClick={addLine}
                    className="mt-4 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium inline-flex items-center gap-2 transition shadow-sm"
                  >
                    <HiOutlinePlus /> Add First Item
                  </button>
                </div>
              ) : (
                <>
                  {lines.map((line, idx) => (
                    <div
                      key={idx}
                      className="grid grid-cols-12 gap-2 items-center p-3 bg-white border border-slate-200 rounded-xl hover:border-blue-300 transition"
                    >
                      <div className="col-span-12 md:col-span-5">
                        <Spin spinning={loadingProducts} size="small">
                          <Select
                            size="large"
                            className="w-full"
                            placeholder="Select product"
                            showSearch
                            optionFilterProp="label"
                            value={line.productId || undefined}
                            // ─── CHANGED: real products from API ──────
                            onChange={(id) => {
                              const p = (products as any[]).find(
                                (x: any) => x.id === id
                              );
                              if (p) {
                                updateLine(idx, {
                                  productId: id,
                                  productName: p.name,
                                  unitPrice: p.basePrice,
                                });
                              }
                            }}
                            options={(products as any[]).map((p: any) => ({
                              value: p.id,
                              label: `${p.name} (${p.sku})`,
                            }))}
                          />
                        </Spin>
                      </div>
                      <div className="col-span-4 md:col-span-2">
                        <InputNumber
                          size="large"
                          className="w-full"
                          min={1}
                          value={line.quantity}
                          onChange={(v) =>
                            updateLine(idx, { quantity: Number(v) || 1 })
                          }
                          placeholder="Qty"
                        />
                      </div>
                      <div className="col-span-4 md:col-span-2">
                        <InputNumber
                          size="large"
                          className="w-full"
                          min={0}
                          value={line.unitPrice}
                          onChange={(v) =>
                            updateLine(idx, { unitPrice: Number(v) || 0 })
                          }
                          prefix="₹"
                        />
                      </div>
                      <div className="col-span-3 md:col-span-2 text-right font-semibold text-slate-800">
                        {formatINR(line.quantity * line.unitPrice)}
                      </div>
                      <div className="col-span-1 flex justify-center">
                        <Tooltip title="Remove item">
                          <button
                            type="button"
                            onClick={() => removeLine(idx)}
                            className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition"
                          >
                            <HiOutlineTrash className="w-4 h-4" />
                          </button>
                        </Tooltip>
                      </div>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={addLine}
                    className="w-full py-2.5 rounded-xl border-2 border-dashed border-slate-300 text-slate-600 hover:border-blue-400 hover:bg-blue-50 hover:text-blue-600 transition flex items-center justify-center gap-2 text-sm font-medium"
                  >
                    <HiOutlinePlus /> Add Another Item
                  </button>
                </>
              )}
            </div>

            {/* Subtotal preview */}
            {lines.length > 0 && (
              <div className="flex items-center justify-between bg-slate-50 rounded-xl px-4 py-3">
                <div className="text-sm text-slate-600">
                  {lines.length} item{lines.length > 1 ? "s" : ""}
                </div>
                <div className="text-base font-bold text-slate-900">
                  Subtotal: {formatINR(totals.subtotal)}
                </div>
              </div>
            )}
          </div>
        );

      case "money":
        return (
          <div className="space-y-5">
            <StepHeader
              title="Pricing & Payment"
              description="Apply discounts, GST, and record advance payment"
            />

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
              {/* Inputs (3 cols) */}
              <div className="lg:col-span-3 space-y-4">
                <Field
                  label="Discount (₹)"
                  hint="Flat amount, applied before GST"
                >
                  <InputNumber
                    size="large"
                    className="w-full"
                    min={0}
                    max={totals.subtotal}
                    value={discount}
                    onChange={(v) => setDiscount(Number(v) || 0)}
                    prefix="₹"
                  />
                </Field>

                <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <div>
                    <div className="font-medium text-slate-800">
                      Apply GST (18%)
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      CGST 9% + SGST 9% on items after discount
                    </div>
                  </div>
                  <Switch checked={gstEnabled} onChange={setGstEnabled} />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Field label="Advance Paid" hint="Already received">
                    <InputNumber
                      size="large"
                      className="w-full"
                      min={0}
                      max={totals.totalAmount}
                      value={advancePaid}
                      onChange={(v) => setAdvancePaid(Number(v) || 0)}
                      prefix="₹"
                    />
                  </Field>
                  <Field label="Security Deposit" hint="Refundable">
                    <InputNumber
                      size="large"
                      className="w-full"
                      min={0}
                      value={securityDeposit}
                      onChange={(v) => setSecurityDeposit(Number(v) || 0)}
                      prefix="₹"
                    />
                  </Field>
                </div>

                <CustomInput
                  name="notes"
                  control={control}
                  label="Notes"
                  placeholder="Special instructions for delivery team..."
                  errors={errors}
                />
              </div>

              {/* Summary (2 cols) */}
              <div className="lg:col-span-2">
                <SummaryCard
                  subtotal={totals.subtotal}
                  discount={discount}
                  gstEnabled={gstEnabled}
                  gstAmount={totals.gstAmount}
                  totalAmount={totals.totalAmount}
                  advancePaid={advancePaid}
                  balanceDue={totals.balanceDue}
                  securityDeposit={securityDeposit}
                />
              </div>
            </div>
          </div>
        );
    }
  };

  // ─── Footer ─────────────────────────────────────────────────────────────
  const footer = (
    <div className="flex items-center justify-between gap-3">
      {/* Left side: live total preview */}
      <div className="hidden sm:flex items-baseline gap-2 text-sm">
        <span className="text-slate-500">Order total:</span>
        <span className="text-lg font-bold text-slate-900">
          {formatINR(totals.totalAmount)}
        </span>
        {totals.balanceDue > 0 && advancePaid > 0 && (
          <span className="text-xs text-amber-600 font-medium">
            ({formatINR(totals.balanceDue)} due)
          </span>
        )}
      </div>

      {/* Right side: nav buttons */}
      <div className="flex gap-2 ml-auto">
        {!isFirstStep && (
          <button
            type="button"
            onClick={goBack}
            className="px-4 py-2.5 rounded-lg text-slate-700 hover:bg-slate-100 font-medium text-sm transition flex items-center gap-2"
          >
            <HiOutlineArrowLeft /> Back
          </button>
        )}
        {!isLastStep ? (
          <button
            type="button"
            onClick={goNext}
            className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm transition shadow-sm flex items-center gap-2"
          >
            Continue <HiOutlineArrowRight />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit(submit)}
            // ─── FIXED: uses isSubmitting prop from parent ──────────────
            disabled={isSubmitting || lines.length === 0}
            className="px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-medium text-sm transition shadow-sm flex items-center gap-2"
          >
            {isSubmitting ? (
              "Creating..."
            ) : (
              <>
                <HiOutlineCheck className="w-4 h-4" />
                {isEditMode ? "Save Changes" : "Create Event Order"}
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );

  return (
    <CustomModal
      open={open}
      onClose={onClose}
      title={isEditMode ? "Edit Event Order" : "Create Event Order"}
      subtitle={
        isEditMode
          ? "Update event details"
          : "Schedule a new event with delivery details"
      }
      icon={
        isEditMode ? (
          <HiOutlinePencilAlt className="w-6 h-6" />
        ) : (
          <HiOutlineSparkles className="w-6 h-6" />
        )
      }
      iconTone="blue"
      size="5xl"
      beforeClose={handleBeforeClose}
      footer={footer}
      bodyClassName="!p-0"
    >
      {/* Step Indicator */}
      <StepIndicator
        steps={STEPS}
        current={currentStep}
        errors={stepErrors}
        onStepClick={goToStep}
      />

      {/* Step Body */}
      <div className="px-6 py-6 min-h-[420px]">{renderStepContent()}</div>
    </CustomModal>
  );
};

// ─── Step Indicator ───────────────────────────────────────────────────────
const StepIndicator = ({
  steps,
  current,
  errors,
  onStepClick,
}: {
  steps: StepDef[];
  current: StepKey;
  errors: Record<StepKey, boolean>;
  onStepClick: (s: StepKey) => void;
}) => {
  const currentIdx = steps.findIndex((s) => s.key === current);

  return (
    <div className="px-6 pt-5 pb-4 bg-white border-b border-slate-100 sticky top-0 z-10">
      <div className="flex items-center">
        {steps.map((step, idx) => {
          const isActive = idx === currentIdx;
          const isComplete = idx < currentIdx;
          const hasError = errors[step.key];
          const Icon = step.icon;

          return (
            <div
              key={step.key}
              className="flex items-center flex-1 last:flex-none"
            >
              <button
                type="button"
                onClick={() => onStepClick(step.key)}
                className="flex flex-col items-center gap-1.5 group cursor-pointer"
              >
                <div
                  className={`relative w-10 h-10 rounded-full flex items-center justify-center transition-all
                    ${
                      hasError
                        ? "bg-red-100 text-red-600 ring-2 ring-red-200"
                        : isActive
                        ? "bg-blue-600 text-white ring-4 ring-blue-100 shadow-md"
                        : isComplete
                        ? "bg-emerald-500 text-white"
                        : "bg-slate-100 text-slate-400 group-hover:bg-slate-200"
                    }`}
                >
                  {hasError ? (
                    <HiOutlineExclamationCircle className="w-5 h-5" />
                  ) : isComplete ? (
                    <HiOutlineCheck className="w-5 h-5" />
                  ) : (
                    <Icon className="w-5 h-5" />
                  )}
                </div>
                <div className="flex flex-col items-center">
                  <span
                    className={`text-xs font-semibold transition-colors ${
                      isActive
                        ? "text-blue-600"
                        : isComplete
                        ? "text-slate-700"
                        : hasError
                        ? "text-red-600"
                        : "text-slate-400"
                    }`}
                  >
                    {step.shortLabel}
                  </span>
                  <span className="text-[10px] text-slate-400 hidden md:block">
                    Step {idx + 1}
                  </span>
                </div>
              </button>

              {idx < steps.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-2 transition-colors -mt-6 ${
                    idx < currentIdx ? "bg-emerald-500" : "bg-slate-200"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ─── Step Header ──────────────────────────────────────────────────────────
const StepHeader = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => (
  <div>
    <h3 className="text-lg font-bold text-slate-900">{title}</h3>
    <p className="text-sm text-slate-500 mt-0.5">{description}</p>
  </div>
);

// ─── Field wrapper (label + hint) ─────────────────────────────────────────
const Field = ({
  label,
  required,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}) => (
  <div className="flex flex-col gap-1.5">
    <label className="flex items-center gap-1 text-sm text-slate-700">
      {label}
      {required && <span className="text-red-500">*</span>}
      {hint && (
        <span className="ml-auto text-xs text-slate-400 font-normal">
          {hint}
        </span>
      )}
    </label>
    {children}
  </div>
);

// ─── Summary Card ─────────────────────────────────────────────────────────
const SummaryCard = ({
  subtotal,
  discount,
  gstEnabled,
  gstAmount,
  totalAmount,
  advancePaid,
  balanceDue,
  securityDeposit,
}: {
  subtotal: number;
  discount: number;
  gstEnabled: boolean;
  gstAmount: number;
  totalAmount: number;
  advancePaid: number;
  balanceDue: number;
  securityDeposit: number;
}) => (
  <div className="bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl p-5 text-white sticky top-4">
    <div className="text-[10px] font-semibold tracking-wider text-blue-100 uppercase mb-3">
      Order Summary
    </div>
    <div className="space-y-2 text-sm">
      <Row label="Subtotal" value={formatINR(subtotal)} />
      {discount > 0 && (
        <Row label="Discount" value={`− ${formatINR(discount)}`} negative />
      )}
      {gstEnabled && <Row label="GST (18%)" value={formatINR(gstAmount)} />}
      <div className="h-px bg-white/20 my-2" />
      <Row label="Total" value={formatINR(totalAmount)} bold large />
      {advancePaid > 0 && (
        <Row
          label="Advance Paid"
          value={`− ${formatINR(advancePaid)}`}
          negative
        />
      )}
      <div className="h-px bg-white/20 my-2" />
      <Row label="Balance Due" value={formatINR(balanceDue)} bold highlight />
      {securityDeposit > 0 && (
        <div className="mt-3 pt-3 border-t border-white/20">
          <Row
            label="Security Deposit"
            value={formatINR(securityDeposit)}
            small
          />
          <p className="text-[10px] text-blue-100 mt-1">
            Refundable on equipment return
          </p>
        </div>
      )}
    </div>
  </div>
);

const Row = ({
  label,
  value,
  bold,
  large,
  negative,
  highlight,
  small,
}: {
  label: string;
  value: string;
  bold?: boolean;
  large?: boolean;
  negative?: boolean;
  highlight?: boolean;
  small?: boolean;
}) => (
  <div
    className={`flex justify-between items-baseline ${
      large ? "text-base" : small ? "text-xs" : "text-sm"
    }`}
  >
    <span className={highlight ? "text-amber-100" : "text-blue-100"}>
      {label}
    </span>
    <span
      className={`${bold ? "font-bold" : "font-medium"} ${
        highlight ? "text-amber-200" : negative ? "text-rose-200" : "text-white"
      }`}
    >
      {value}
    </span>
  </div>
);

export default CreateEventModal;
