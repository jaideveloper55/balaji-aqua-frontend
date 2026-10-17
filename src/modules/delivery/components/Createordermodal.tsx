import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { Button, DatePicker, Modal } from "antd";
import dayjs from "dayjs";
import { HiOutlineClipboardList, HiOutlineExclamation } from "react-icons/hi";
import CustomModal from "../../../components/common/CustomModal";
import CustomSelect from "../../../components/common/CustomSelect";
import {
  SLOT_OPTIONS,
  addDays,
  formatINR,
  slotValueOf,
  splitSlot,
  todayIST,
} from "../constants/Orderconstants";
import { DUMMY_BOYS, productsFor } from "../constants/Orderdummy";
import type {
  Order,
  OrderFormValues,
  OrderPayload,
  PickerCustomer,
} from "../types/Orders";
import Customerpicker from "../components/Customerpicker";
import Productpicker, { qtyKey, toQty } from "../components/Productpicker";
import CustomTextArea from "../../../components/common/Customtextarea";

const DAY = "YYYY-MM-DD";

interface Props {
  open: boolean;
  /** Give an order to EDIT it; leave out to create a new one. */
  order?: Order | null;
  onClose: () => void;
  /** Called with the finished form when the person presses Save. */
  onSave: (payload: OrderPayload) => void;
}

// Small section title used on both sides of the form.
const Section = ({ title, hint }: { title: string; hint?: string }) => (
  <div className="mb-2.5">
    <h3 className="text-sm font-bold text-slate-800">{title}</h3>
    {hint && <p className="text-xs text-slate-500">{hint}</p>}
  </div>
);

const NO_PRODUCTS = "Add at least one product – tap + next to a product.";

const Createordermodal = ({ open, order, onClose, onSave }: Props) => {
  const isEdit = !!order;
  const today = todayIST();
  const tomorrow = addDays(today, 1);

  // ── Form ──────────────────────────────────────────────────────────────────────────────────────
  // Start values: blank for a new order, the order's own values when editing.
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isDirty },
  } = useForm<OrderFormValues>({
    defaultValues: {
      customerId: order?.customerId ?? "",
      customerSearch: "",
      deliveryDate: order?.deliveryDate ?? today,
      slot: order ? slotValueOf(order) : "",
      assignedToId: order?.assignedTo?.id ?? "",
      note: order?.note ?? "",
      productSearch: "",
      qty: Object.fromEntries(
        (order?.items ?? []).map((i) => [qtyKey(i.productId), String(i.qty)])
      ),
    },
  });

  // The full customer object lives here (the form only stores the id) so we can show phone, dues...
  const [customer, setCustomer] = useState<PickerCustomer | null>(
    order
      ? {
          id: order.customer.id,
          name: order.customer.name,
          phone: order.customer.phone,
          area: order.customer.area,
        }
      : null
  );
  const [itemsError, setItemsError] = useState("");

  const customerId = watch("customerId");
  const deliveryDate = watch("deliveryDate");
  const qty = watch("qty");
  const productSearch = useWatch({ control, name: "productSearch" }) ?? "";

  // ── Products with THIS customer's rates ───────────────────────────────────────────────────────
  const products = productsFor(customerId || undefined);

  // ── Live totals ───────────────────────────────────────────────────────────────────────────────
  // NOT useMemo on purpose: react-hook-form's watch("qty") returns the SAME object after a nested
  // value changes, so a memo keyed on `qty` would never recalculate (the total would stay at ₹0).
  // A loop over at most a few dozen products is free.
  const lines = products
    .map((p) => ({ product: p, quantity: toQty(qty?.[qtyKey(p.id)]) }))
    .filter((l) => l.quantity > 0);
  const units = lines.reduce((s, l) => s + l.quantity, 0);
  const estimate = lines.reduce(
    (s, l) => s + l.quantity * l.product.unitPrice,
    0
  );

  // The "add at least one product" message goes away as soon as a product is added.
  useEffect(() => {
    if (lines.length > 0) setItemsError("");
  }, [lines.length]);

  const setQty = (productId: string, next: number) =>
    setValue(
      `qty.${qtyKey(productId)}` as `qty.${string}`,
      next > 0 ? String(Math.min(next, 9999)) : "",
      {
        shouldDirty: true,
      }
    );

  // ── Choices for the delivery boy dropdown ─────────────────────────────────────────────────────
  const boyOptions = DUMMY_BOYS.map((b) => ({
    value: b.id,
    label: b.phone ? `${b.name} · ${b.phone}` : b.name,
  }));

  // ── Save ──────────────────────────────────────────────────────────────────────────────────────
  // Runs when a field rule failed (e.g. no customer). We still say "no products" in the same go,
  // so the person fixes everything in ONE pass instead of finding errors one submit at a time.
  const onInvalid = () => {
    if (lines.length === 0) setItemsError(NO_PRODUCTS);
  };

  const onSubmit = (v: OrderFormValues) => {
    if (lines.length === 0) {
      setItemsError(NO_PRODUCTS);
      return;
    }
    onSave({
      customerId: v.customerId,
      items: lines.map((l) => ({
        productId: l.product.id,
        quantity: l.quantity,
      })),
      deliveryDate: v.deliveryDate,
      ...splitSlot(v.slot), // "10:00-12:00" -> slotFrom + slotTo (both null = any time)
      assignedToId: v.assignedToId || null,
      note: v.note.trim() || null,
    });
    onClose();
  };

  // ── Closing: ask before throwing away typed work ──────────────────────────────────────────────
  const confirmDiscard = () =>
    new Promise<boolean>((resolve) =>
      Modal.confirm({
        // Different words for a brand-new order vs. changes to an existing one.
        title: isEdit ? "Discard your changes?" : "Discard this order?",
        content: isEdit
          ? `${order!.orderNo} will stay exactly as it was saved.`
          : "Everything you entered will be lost.",
        okText: isEdit ? "Discard changes" : "Discard",
        okButtonProps: { danger: true },
        cancelText: "Keep editing",
        onOk: () => resolve(true),
        onCancel: () => resolve(false),
      })
    );
  const beforeClose = () => (isDirty ? confirmDiscard() : true);

  const dateIsCustom =
    !!deliveryDate && deliveryDate !== today && deliveryDate !== tomorrow;

  // ── Render ────────────────────────────────────────────────────────────────────────────────────
  return (
    <CustomModal
      open={open}
      onClose={onClose}
      beforeClose={beforeClose}
      size="5xl"
      title={isEdit ? `Edit ${order!.orderNo}` : "New Delivery Order"}
      subtitle={
        isEdit
          ? `${order!.customer.name} · only pending orders can be edited`
          : "Choose a customer, add products and pick who delivers"
      }
      icon={<HiOutlineClipboardList className="h-5 w-5" />}
      iconTone="blue"
      footer={
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="text-sm">
            {lines.length > 0 ? (
              <span className="text-slate-600">
                <b className="text-slate-900">{lines.length}</b>{" "}
                {lines.length === 1 ? "product" : "products"} ·{" "}
                <b className="text-slate-900">{units}</b>{" "}
                {units === 1 ? "unit" : "units"} · Est.{" "}
                <b className="text-slate-900">{formatINR(estimate)}</b>
              </span>
            ) : (
              <span className="text-slate-400">No products added yet</span>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              size="large"
              className="!rounded-xl"
              onClick={async () => (await beforeClose()) && onClose()}
            >
              Cancel
            </Button>
            {/* form="order-form" lets a button in the footer submit the form in the body */}
            <Button
              size="large"
              type="primary"
              className="!rounded-xl"
              htmlType="submit"
              form="order-form"
            >
              {isEdit ? "Save Changes" : "Create Order"}
            </Button>
          </div>
        </div>
      }
    >
      <form
        id="order-form"
        onSubmit={handleSubmit(onSubmit, onInvalid)}
        // Enter inside a search box must NOT submit the whole order.
        onKeyDown={(e) => {
          if (
            e.key === "Enter" &&
            (e.target as HTMLElement).tagName === "INPUT"
          )
            e.preventDefault();
        }}
        className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]"
      >
        {/* ───────────────── LEFT: who, when, who delivers ───────────────── */}
        <div className="space-y-5">
          <div>
            <Section title="Customer" />
            <Customerpicker
              control={control}
              errors={errors}
              customer={customer}
              locked={isEdit}
              error={errors.customerId?.message}
              onSelect={(c) => {
                setCustomer(c);
                setValue("customerId", c.id, {
                  shouldDirty: true,
                  shouldValidate: true,
                });
                setValue("customerSearch", "");
              }}
              onClear={() => {
                setCustomer(null);
                setValue("customerId", "", { shouldDirty: true });
              }}
            />
            {/* Registered so "customerId" is validated like every other field. */}
            <input
              type="hidden"
              {...control.register("customerId", {
                required: "Please choose a customer",
              })}
            />
          </div>

          <div>
            <Section title="Delivery day" />
            <div className="flex flex-wrap items-center gap-2">
              {[
                { label: "Today", value: today },
                { label: "Tomorrow", value: tomorrow },
              ].map((d) => (
                <button
                  key={d.value}
                  type="button"
                  onClick={() =>
                    setValue("deliveryDate", d.value, { shouldDirty: true })
                  }
                  className={`rounded-xl border px-4 py-2 text-sm font-semibold transition-colors ${
                    deliveryDate === d.value
                      ? "border-blue-600 bg-blue-600 text-white"
                      : "border-slate-200 bg-white text-slate-700 hover:border-blue-300"
                  }`}
                >
                  {d.label}
                </button>
              ))}
              <DatePicker
                size="large"
                allowClear={false}
                placeholder="Pick a date"
                format="D MMM YYYY"
                value={dateIsCustom ? dayjs(deliveryDate) : null}
                // Past days are blocked (the API will refuse them too).
                disabledDate={(d) => d.isBefore(dayjs(today), "day")}
                onChange={(d) =>
                  d &&
                  setValue("deliveryDate", d.format(DAY), { shouldDirty: true })
                }
                className={`!rounded-xl max-sm:!w-full ${
                  dateIsCustom ? "!border-blue-600" : ""
                }`} // full width on a phone
              />
            </div>
            {deliveryDate < today && (
              <p className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-red-600">
                <HiOutlineExclamation className="h-4 w-4" />
                This order is overdue. Pick a new day to reschedule it, or save
                to keep the old day.
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <Section title="Time slot" />
              <CustomSelect
                name="slot"
                control={control}
                errors={errors}
                size="large"
                placeholder="Any time"
                options={SLOT_OPTIONS}
              />
            </div>
            <div>
              <Section title="Delivery boy" />
              <CustomSelect
                name="assignedToId"
                control={control}
                errors={errors}
                size="large"
                placeholder="Assign later"
                options={boyOptions}
              />
            </div>
          </div>

          <CustomTextArea
            name="note"
            control={control}
            errors={errors}
            label="Note for the delivery boy (optional)"
            placeholder="e.g. Ring the bell twice, deliver to the 2nd floor"
            rows={3}
            maxLength={300}
            showCount
          />
        </div>

        {/* ───────────────── RIGHT: products ───────────────── */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="mb-3 flex items-start justify-between gap-3">
            <Section
              title="Products"
              hint={
                customer
                  ? `Showing ${customer.name.split(" ")[0]}’s prices`
                  : "Choose a customer to see their special rates"
              }
            />
            {lines.length > 0 && (
              <span className="shrink-0 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700">
                {lines.length} added
              </span>
            )}
          </div>

          <Productpicker
            control={control}
            errors={errors}
            products={products}
            qty={qty}
            search={productSearch}
            onStep={setQty}
          />

          {itemsError && (
            <p className="mt-3 flex items-center gap-1.5 rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-600">
              <HiOutlineExclamation className="h-4 w-4 shrink-0" />
              {itemsError}
            </p>
          )}

          <div className="mt-4 flex items-end justify-between rounded-xl bg-slate-50 px-4 py-3">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Estimated total
              </div>
              <div className="text-[11px] text-slate-400">
                The final bill is made at delivery
              </div>
            </div>
            <div className="text-2xl font-bold text-slate-900">
              {formatINR(estimate)}
            </div>
          </div>
        </div>
      </form>
    </CustomModal>
  );
};

export default Createordermodal;
