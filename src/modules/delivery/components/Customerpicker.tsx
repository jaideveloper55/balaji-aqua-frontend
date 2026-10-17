// src/modules/delivery/components/Customerpicker.tsx
//
// Step 1 of a new order: WHO is it for?
//   - nobody chosen  -> a search box (your CustomInput) with the matching customers underneath
//   - someone chosen -> a compact card with their phone, area and dues, plus a "Change" link
// For now the list is filtered from dummy customers right here. With the API this one block
// (the `results` line) becomes a search request - the layout doesn't change.
import type { Control, FieldErrors } from "react-hook-form";
import { useWatch } from "react-hook-form";
import {
  HiOutlineLocationMarker,
  HiOutlinePhone,
  HiOutlineSwitchHorizontal,
} from "react-icons/hi";
import CustomInput from "../../../components/common/CustomInput";
import { formatINR, initials } from "../constants/Orderconstants";
import { DUMMY_CUSTOMERS } from "../constants/Orderdummy";
import type { OrderFormValues, PickerCustomer } from "../types/Orders";

interface Props {
  control: Control<OrderFormValues>;
  errors: FieldErrors<OrderFormValues>;
  customer: PickerCustomer | null;
  /** Editing an order: the customer can't change (cancel and re-create instead). */
  locked?: boolean;
  error?: string;
  onSelect: (c: PickerCustomer) => void;
  onClear: () => void;
}

const Avatar = ({ name }: { name: string }) => (
  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-sm font-bold text-white">
    {initials(name)}
  </div>
);

const Customerpicker = ({
  control,
  errors,
  customer,
  locked,
  error,
  onSelect,
  onClear,
}: Props) => {
  // What the person has typed so far (name, phone or area).
  const typed = useWatch({ control, name: "customerSearch" }) ?? "";
  const search = typed.trim();
  const q = search.toLowerCase();
  const digits = search.replace(/\s/g, ""); // "98765 43203" still finds 9876543203

  const results = DUMMY_CUSTOMERS.filter(
    (c) =>
      !q ||
      c.name.toLowerCase().includes(q) ||
      c.phone.includes(digits) ||
      (c.area ?? "").toLowerCase().includes(q)
  );

  // ── Chosen: show the card ─────────────────────────────────────────────────────────────────────
  if (customer) {
    const due = customer.outstandingBalance ?? 0;
    const jars = customer.jarsHeld ?? 0;
    return (
      <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-3.5">
        <div className="flex items-center gap-3">
          <Avatar name={customer.name} />
          <div className="min-w-0 flex-1">
            <div className="truncate font-semibold text-slate-900">
              {customer.name}
            </div>
            <div className="mt-0.5 flex flex-wrap items-center gap-x-3 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <HiOutlinePhone className="h-3.5 w-3.5" />
                {customer.phone}
              </span>
              {customer.area && (
                <span className="flex items-center gap-1">
                  <HiOutlineLocationMarker className="h-3.5 w-3.5" />
                  {customer.area}
                </span>
              )}
            </div>
          </div>
          {!locked && (
            <button
              type="button"
              onClick={onClear}
              className="flex shrink-0 items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-100"
            >
              <HiOutlineSwitchHorizontal className="h-4 w-4" />
              Change
            </button>
          )}
        </div>

        {(due > 0 || jars > 0) && (
          <div className="mt-3 flex flex-wrap gap-2">
            {due > 0 && (
              <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-800">
                {formatINR(due)} outstanding
              </span>
            )}
            {jars > 0 && (
              <span className="rounded-full bg-sky-100 px-2.5 py-1 text-xs font-semibold text-sky-800">
                {jars} jars with customer
              </span>
            )}
          </div>
        )}
        {locked && (
          <p className="mt-3 text-xs text-slate-500">
            The customer can’t be changed on an existing order. Cancel it and
            create a new one instead.
          </p>
        )}
      </div>
    );
  }

  // ── Not chosen yet: search + results ──────────────────────────────────────────────────────────
  return (
    <div>
      <CustomInput
        name="customerSearch"
        control={control}
        errors={errors}
        iconType="search"
        size="large"
        autoFocus
        placeholder="Search customer by name, phone or ID..."
      />

      <div
        className={`mt-2 max-h-60 overflow-y-auto rounded-xl border bg-white p-1.5 ${
          error ? "border-red-300" : "border-slate-200"
        }`}
      >
        {results.length === 0 ? (
          <div className="px-3 py-6 text-center">
            <div className="text-sm font-semibold text-slate-700">
              No customer found
            </div>
            <div className="mt-0.5 text-xs text-slate-500">
              {search
                ? `Nothing matches “${search}”. Check the spelling or number.`
                : "No active customers yet."}
            </div>
          </div>
        ) : (
          results.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => onSelect(c)}
              className="flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left transition-colors hover:bg-blue-50"
            >
              <Avatar name={c.name} />
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-semibold text-slate-900">
                  {c.name}
                </div>
                <div className="truncate text-xs text-slate-500">
                  {c.phone}
                  {c.area ? ` · ${c.area}` : ""}
                </div>
              </div>
              {(c.outstandingBalance ?? 0) > 0 && (
                <span className="shrink-0 rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-700">
                  {formatINR(c.outstandingBalance ?? 0)} due
                </span>
              )}
            </button>
          ))
        )}
      </div>

      {error && (
        <p className="mt-1.5 text-xs font-medium text-red-500">{error}</p>
      )}
    </div>
  );
};

export default Customerpicker;
