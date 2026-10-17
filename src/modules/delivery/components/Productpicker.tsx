// src/modules/delivery/components/Productpicker.tsx
//
// Step 2: WHAT is going out? The product list IS the order sheet - every product has a  [-] 10 [+]
// stepper, so adding a product is one tap, not "open a dropdown, pick, type a number, add line".
// Rows with a quantity light up blue so the office can see the order forming at a glance.
//
// Prices are the customer's own rate (special rate struck through against the normal price).
import type { Control, FieldErrors } from "react-hook-form";
import { Skeleton } from "antd";
import { HiMinus, HiOutlineCube, HiPlus } from "react-icons/hi";
import CustomInput from "../../../components/common/CustomInput";
import { formatINR } from "../constants/Orderconstants";
import type { OrderFormValues, OrderProductOption } from "../types/Orders";

/** A product row. `unavailable` = it is on the order being edited but was switched off since. */
export type PickerProduct = OrderProductOption & { unavailable?: boolean };

/** Form key for a product's quantity. The "q_" prefix stops react-hook-form treating a numeric id as an array index. */
export const qtyKey = (productId: string) => `q_${productId}`;

/** Whatever was typed -> a whole number between 0 and 9999. */
export const toQty = (raw?: string): number => {
  const n = Math.floor(Number(raw));
  return Number.isFinite(n) && n > 0 ? Math.min(n, 9999) : 0;
};

interface Props {
  control: Control<OrderFormValues>;
  errors: FieldErrors<OrderFormValues>;
  products: PickerProduct[];
  qty: Record<string, string> | undefined;
  search: string;
  loading?: boolean;
  onStep: (productId: string, next: number) => void;
}

const Productpicker = ({
  control,
  errors,
  products,
  qty,
  search,
  loading,
  onStep,
}: Props) => {
  const q = search.trim().toLowerCase();
  const shown = q
    ? products.filter((p) => p.name.toLowerCase().includes(q))
    : products;

  return (
    <div className="space-y-3">
      <CustomInput
        name="productSearch"
        control={control}
        errors={errors}
        iconType="search"
        size="large"
        placeholder="Search products..."
      />

      <div className="max-h-[340px] space-y-2 overflow-y-auto pr-1">
        {loading && products.length === 0 ? (
          [0, 1, 2, 3].map((i) => (
            <Skeleton.Input key={i} active block style={{ height: 64 }} />
          ))
        ) : shown.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-200 px-4 py-8 text-center text-sm text-slate-500">
            {q
              ? `No product matches “${search}”.`
              : "No active products. Add products first."}
          </div>
        ) : (
          shown.map((p) => {
            const n = toQty(qty?.[qtyKey(p.id)]);
            const short = !p.unavailable && n > p.stock; // more than we have – warn, don't block
            return (
              <div
                key={p.id}
                className={`flex items-center gap-3 rounded-xl border px-3 py-2.5 transition-colors ${
                  p.unavailable
                    ? "border-red-200 bg-red-50/50"
                    : n > 0
                    ? "border-blue-300 bg-blue-50/60"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                    n > 0 ? "bg-blue-600 text-white" : "bg-sky-50 text-sky-600"
                  }`}
                >
                  <HiOutlineCube className="h-5 w-5" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-semibold text-slate-900">
                    {p.name}
                  </div>
                  {p.unavailable ? (
                    <div className="text-xs font-medium text-red-600">
                      No longer sold – set to 0 to remove it from this order
                    </div>
                  ) : (
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs">
                      <span className="font-semibold text-slate-700">
                        {formatINR(p.unitPrice)}/{p.unit}
                      </span>
                      {p.isSpecialRate && (
                        <>
                          <span className="text-slate-400 line-through">
                            {formatINR(p.basePrice)}
                          </span>
                          <span className="rounded bg-emerald-50 px-1.5 py-px font-semibold text-emerald-700">
                            Special rate
                          </span>
                        </>
                      )}
                      <span
                        className={
                          p.stock <= 0
                            ? "font-medium text-red-500"
                            : short
                            ? "font-semibold text-amber-600"
                            : "text-slate-400"
                        }
                      >
                        {p.stock <= 0
                          ? "Out of stock"
                          : short
                          ? `Only ${p.stock} in stock`
                          : `${p.stock} in stock`}
                      </span>
                    </div>
                  )}
                </div>

                {/* Stepper: [-] typed number [+] - the number box is your CustomInput (digits only) */}
                <div className="flex shrink-0 items-center gap-1.5">
                  <button
                    type="button"
                    aria-label={`One less ${p.name}`}
                    disabled={n === 0}
                    onClick={() => onStep(p.id, n - 1)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition-colors hover:border-blue-300 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <HiMinus className="h-4 w-4" />
                  </button>
                  <CustomInput
                    name={`qty.${qtyKey(p.id)}` as `qty.${string}`}
                    control={control}
                    className="w-16 [&_input]:text-center [&_input]:font-semibold"
                    placeholder="0"
                    numbersOnly
                  />
                  <button
                    type="button"
                    aria-label={`One more ${p.name}`}
                    disabled={p.unavailable}
                    onClick={() => onStep(p.id, n + 1)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <HiPlus className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Productpicker;
