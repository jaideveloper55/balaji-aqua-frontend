import { ReactNode, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { Modal } from "antd";
import {
  HiOutlineArrowDown,
  HiOutlineArrowUp,
  HiOutlineAdjustments,
} from "react-icons/hi";
import CustomModal from "../../../components/common/CustomModal";
import CustomSelect from "../../../components/common/CustomSelect";
import CustomInput from "../../../components/common/CustomInput";
import CustomTabs from "../../../components/common/CustomTabs";
import {
  MovementType,
  StockEntryFormValues,
  StockItem,
  getAvailable,
} from "../types/Inventory";
import {
  MOVEMENT_TYPE_MODAL_CONFIG,
  SOURCE_OPTIONS,
} from "../constants/Inventoryconstants";

interface StockentrymodalProps {
  open: boolean;
  mode: MovementType;
  onModeChange: (mode: MovementType) => void;
  items: StockItem[];
  initialProduct?: StockItem | null;
  onClose: () => void;
  onSubmit: (values: StockEntryFormValues & { mode: MovementType }) => void;
  submitting?: boolean;
}

const MODE_META: Record<
  MovementType,
  {
    icon: ReactNode;
    tone: "green" | "red" | "purple";
    verb: string;
    hint: string;
  }
> = {
  stock_in: {
    icon: <HiOutlineArrowDown size={22} />,
    tone: "green",
    verb: "Add",
    hint: "Receive stock from production, purchase or returns",
  },
  stock_out: {
    icon: <HiOutlineArrowUp size={22} />,
    tone: "red",
    verb: "Issue",
    hint: "Issue stock for delivery, internal use or write-off",
  },
  adjustment: {
    icon: <HiOutlineAdjustments size={22} />,
    tone: "purple",
    verb: "Set",
    hint: "Correct stock after a physical count — enter the counted quantity",
  },
};

const Stockentrymodal = ({
  open,
  mode,
  onModeChange,
  items,
  initialProduct,
  onClose,
  onSubmit,
  submitting,
}: StockentrymodalProps) => {
  const {
    control,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors, isDirty },
  } = useForm<StockEntryFormValues>({
    defaultValues: {
      productId: "",
      qty: "",
      source: "",
      refId: "",
      remarks: "",
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        productId: initialProduct?.id ?? "",
        qty: "",
        source: "",
        refId: "",
        remarks: "",
      });
    }
  }, [open, initialProduct, reset]);

  useEffect(() => {
    setValue("source", "");
  }, [mode, setValue]);

  const meta = MODE_META[mode];
  const cfg = MOVEMENT_TYPE_MODAL_CONFIG[mode];

  const productId = watch("productId");
  const qtyRaw = watch("qty");
  const qty = Number(qtyRaw) || 0;
  const product = useMemo(
    () => items.find((i) => i.id === productId) ?? null,
    [items, productId]
  );

  const newBalance = !product
    ? null
    : mode === "stock_in"
    ? product.current + qty
    : mode === "stock_out"
    ? product.current - qty
    : qty;

  const overdraw =
    mode === "stock_out" && product !== null && qty > getAvailable(product);

  const beforeClose = () =>
    !isDirty
      ? true
      : new Promise<boolean>((resolve) => {
          Modal.confirm({
            title: "Discard this entry?",
            content: "Your unsaved stock entry will be lost.",
            okText: "Discard",
            okButtonProps: { danger: true },
            cancelText: "Keep editing",
            onOk: () => resolve(true),
            onCancel: () => resolve(false),
          });
        });

  const submit = handleSubmit((values) =>
    onSubmit({ ...values, qty: Number(values.qty), mode })
  );

  return (
    <CustomModal
      open={open}
      onClose={onClose}
      beforeClose={beforeClose}
      title={`${cfg.label}`}
      subtitle={meta.hint}
      icon={meta.icon}
      iconTone={meta.tone}
      size="xl"
      footer={
        <div className="flex items-center justify-between gap-3">
          {/* Confirmation summary lives IN the footer — user sees exactly
              what will happen right next to the button that does it */}
          <div className="text-[12px] text-slate-500 min-h-[18px]">
            {product && qty > 0 && !overdraw && (
              <>
                {product.name}:{" "}
                <b className="tabular-nums">{product.current}</b>
                <span className="mx-1.5 text-slate-300">→</span>
                <b className="tabular-nums" style={{ color: cfg.color }}>
                  {newBalance}
                </b>{" "}
                {product.unit}
              </>
            )}
            {overdraw && (
              <span className="text-red-500 font-semibold">
                Only {getAvailable(product!)} available ({product!.reserved}{" "}
                reserved)
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-[13px] font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={submit}
              disabled={submitting || overdraw}
              className="px-5 py-2 rounded-xl text-[13px] font-bold text-white transition-all
                disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 active:scale-[0.98]"
              style={{ background: cfg.color }}
            >
              {submitting ? "Saving…" : `${meta.verb} Stock`}
            </button>
          </div>
        </div>
      }
    >
      <div className="flex flex-col gap-5">
        <CustomTabs
          items={[
            {
              key: "stock_in",
              label: "Stock In",
              icon: <HiOutlineArrowDown size={14} />,
            },
            {
              key: "stock_out",
              label: "Stock Out",
              icon: <HiOutlineArrowUp size={14} />,
            },
            {
              key: "adjustment",
              label: "Adjust",
              icon: <HiOutlineAdjustments size={14} />,
            },
          ]}
          activeKey={mode}
          onChange={(k) => onModeChange(k as MovementType)}
          accentColor={cfg.color}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <CustomSelect
              label="Product"
              name="productId"
              control={control}
              errors={errors}
              isrequired
              showSearch
              placeholder="Select product…"
              rules={{ required: "Product is required" }}
              options={items.map((i) => ({
                value: i.id,
                label: `${i.name}  ·  ${i.sku}`,
              }))}
            />
            {/* Context strip: show stock the moment a product is chosen */}
            {product && (
              <div className="mt-2 flex items-center gap-4 px-3 py-2 rounded-xl bg-slate-50 border border-slate-100 text-[12px]">
                <span className="text-slate-500">
                  Current{" "}
                  <b className="text-slate-800 tabular-nums">
                    {product.current}
                  </b>
                </span>
                <span className="text-slate-500">
                  Reserved{" "}
                  <b className="text-slate-800 tabular-nums">
                    {product.reserved}
                  </b>
                </span>
                <span className="text-slate-500">
                  Available{" "}
                  <b className="text-emerald-600 tabular-nums">
                    {getAvailable(product)}
                  </b>
                </span>
                <span className="ml-auto text-slate-400">
                  Reorder at {product.reorderLevel} {product.unit}
                </span>
              </div>
            )}
          </div>

          <CustomInput
            label={mode === "adjustment" ? "Counted Quantity" : "Quantity"}
            name="qty"
            control={control}
            errors={errors}
            isrequired
            placeholder={mode === "adjustment" ? "Physical count" : "0"}
            rules={{
              required: "Quantity is required",
              validate: (v: string | number) => {
                const n = Number(v);
                if (!Number.isFinite(n)) return "Enter a number";
                if (mode !== "adjustment" && n <= 0)
                  return "Must be greater than 0";
                if (n < 0) return "Cannot be negative";
                if (!Number.isInteger(n)) return "Whole units only";
                return true;
              },
            }}
          />

          <CustomSelect
            label={mode === "stock_in" ? "Source" : "Reason"}
            name="source"
            control={control}
            errors={errors}
            isrequired
            placeholder="Select…"
            rules={{ required: "Required for the audit trail" }}
            options={SOURCE_OPTIONS[mode]}
          />

          <CustomInput
            label="Reference ID"
            name="refId"
            control={control}
            errors={errors}
            placeholder="e.g. PROD-20260326-A (optional)"
          />

          <CustomInput
            label="Remarks"
            name="remarks"
            control={control}
            errors={errors}
            placeholder="e.g. Morning batch (optional)"
          />
        </div>
      </div>
    </CustomModal>
  );
};

export default Stockentrymodal;
