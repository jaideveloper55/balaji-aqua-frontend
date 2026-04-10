import React from "react";
import { Modal, Button, DatePicker, Input, InputNumber, Divider } from "antd";
import { Controller, useForm } from "react-hook-form";
import {
  HiOutlineArrowCircleDown,
  HiOutlineArrowCircleUp,
  HiOutlineAdjustments,
} from "react-icons/hi";
import CustomSelect from "../../../components/common/CustomSelect";
import type { StockEntryFormValues, EntryMode } from "../types/Inventory";
import {
  PRODUCT_OPTIONS,
  SOURCE_IN_OPTIONS,
  SOURCE_OUT_OPTIONS,
  ADJUST_REASON_OPTIONS,
  SUPPLIER_OPTIONS,
} from "../constants/Inventoryconstants";

const MODE_CONFIG: Record<
  EntryMode,
  {
    icon: React.ReactNode;
    title: string;
    subtitle: string;
    iconBg: string;
    accentBorder: string;
    btnClass: string;
    btnLabel: string;
  }
> = {
  in: {
    icon: <HiOutlineArrowCircleDown size={22} className="text-emerald-500" />,
    title: "Stock In",
    subtitle: "Record inward inventory — purchase, production, or return",
    iconBg: "bg-emerald-50",
    accentBorder: "border-l-emerald-500",
    btnClass:
      "!bg-emerald-600 hover:!bg-emerald-700 !shadow-sm !shadow-emerald-200",
    btnLabel: "Add Stock",
  },
  out: {
    icon: <HiOutlineArrowCircleUp size={22} className="text-red-500" />,
    title: "Stock Out",
    subtitle: "Record outward inventory — delivery, damage, or internal use",
    iconBg: "bg-red-50",
    accentBorder: "border-l-red-500",
    btnClass: "!bg-red-600 hover:!bg-red-700 !shadow-sm !shadow-red-200",
    btnLabel: "Remove Stock",
  },
  adjust: {
    icon: <HiOutlineAdjustments size={22} className="text-violet-500" />,
    title: "Stock Adjustment",
    subtitle: "Correct stock levels — audit, damage write-off, or miscount",
    iconBg: "bg-violet-50",
    accentBorder: "border-l-violet-500",
    btnClass:
      "!bg-violet-600 hover:!bg-violet-700 !shadow-sm !shadow-violet-200",
    btnLabel: "Adjust Stock",
  },
};

interface StockEntryModalProps {
  open: boolean;
  onClose: () => void;
  mode: EntryMode;
  onSubmit: (data: StockEntryFormValues) => void;
  loading?: boolean;
}

const FieldLabel: React.FC<{
  children: React.ReactNode;
  required?: boolean;
}> = ({ children, required }) => (
  <label className="text-[12px] font-semibold text-slate-600 mb-1.5 block">
    {children}
    {required && <span className="text-red-500 ml-0.5">*</span>}
  </label>
);

const FieldError: React.FC<{ message?: string }> = ({ message }) =>
  message ? (
    <p className="text-[11px] text-red-500 font-medium mt-1">{message}</p>
  ) : null;

const StockEntryModal: React.FC<StockEntryModalProps> = ({
  open,
  onClose,
  mode,
  onSubmit,
  loading = false,
}) => {
  const config = MODE_CONFIG[mode];
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<StockEntryFormValues>({
    defaultValues: {
      productId: "",
      quantity: "",
      source: "",
      supplier: "",
      reason: "",
      referenceId: "",
      date: null,
      notes: "",
      oldQty: "",
      newQty: "",
    },
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleFormSubmit = (data: StockEntryFormValues) => {
    onSubmit(data);
    reset();
  };

  const sourceOptions =
    mode === "in"
      ? SOURCE_IN_OPTIONS
      : mode === "out"
      ? SOURCE_OUT_OPTIONS
      : ADJUST_REASON_OPTIONS;

  return (
    <Modal
      open={open}
      onCancel={handleClose}
      footer={null}
      width={580}
      centered
      destroyOnClose
      className="!rounded-2xl"
    >
      {/* Header with accent border */}
      <div
        className={`flex items-center gap-3.5 mb-5`}
      >
        <div
          className={`p-2.5 rounded-xl ${config.iconBg} transition-transform duration-300 hover:scale-105`}
        >
          {config.icon}
        </div>
        <div>
          <h3 className="text-[15px] font-bold text-slate-800">
            {config.title}
          </h3>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            {config.subtitle}
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit(handleFormSubmit)}
        className="flex flex-col gap-5"
      >
        {/* Section: Product Details */}
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">
            Product Details
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3">
            <CustomSelect
              name="productId"
              control={control}
              errors={errors}
              label="Product"
              placeholder="Search & select product..."
              options={PRODUCT_OPTIONS}
              isrequired
              size="large"
              showSearch
              rules={{ required: "Product is required" }}
            />
            <CustomSelect
              name="source"
              control={control}
              errors={errors}
              label={mode === "adjust" ? "Reason" : "Source"}
              placeholder={
                mode === "adjust" ? "Select reason..." : "Select source..."
              }
              options={sourceOptions}
              isrequired
              size="large"
              rules={{ required: "Required" }}
            />
          </div>
        </div>

        <Divider className="!my-0 !border-slate-100" />

        {/* Section: Quantity & Date */}
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">
            {mode === "adjust" ? "Quantity Correction" : "Quantity & Timing"}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3">
            {mode === "adjust" ? (
              <>
                <div>
                  <FieldLabel required>Old Qty (System)</FieldLabel>
                  <Controller
                    name="oldQty"
                    control={control}
                    rules={{ required: "Required" }}
                    render={({ field }) => (
                      <InputNumber
                        {...field}
                        size="large"
                        className="!w-full !rounded-lg"
                        placeholder="Current stock in system"
                        min={0}
                        status={errors.oldQty ? "error" : ""}
                      />
                    )}
                  />
                  <FieldError message={errors.oldQty?.message as string} />
                </div>
                <div>
                  <FieldLabel required>New Qty (Actual)</FieldLabel>
                  <Controller
                    name="newQty"
                    control={control}
                    rules={{ required: "Required" }}
                    render={({ field }) => (
                      <InputNumber
                        {...field}
                        size="large"
                        className="!w-full !rounded-lg"
                        placeholder="Actual count after check"
                        min={0}
                        status={errors.newQty ? "error" : ""}
                      />
                    )}
                  />
                  <FieldError message={errors.newQty?.message as string} />
                </div>
              </>
            ) : (
              <>
                <div>
                  <FieldLabel required>Quantity</FieldLabel>
                  <Controller
                    name="quantity"
                    control={control}
                    rules={{ required: "Quantity is required" }}
                    render={({ field }) => (
                      <InputNumber
                        {...field}
                        size="large"
                        className="!w-full !rounded-lg"
                        placeholder="Enter quantity"
                        min={1}
                        status={errors.quantity ? "error" : ""}
                      />
                    )}
                  />
                  <FieldError message={errors.quantity?.message as string} />
                </div>
                <div>
                  <FieldLabel required>Date</FieldLabel>
                  <Controller
                    name="date"
                    control={control}
                    rules={{ required: "Date is required" }}
                    render={({ field }) => (
                      <DatePicker
                        {...field}
                        size="large"
                        className="w-full !rounded-lg"
                        placeholder="Select date"
                        status={errors.date ? "error" : ""}
                      />
                    )}
                  />
                  <FieldError message={errors.date?.message as string} />
                </div>
              </>
            )}
          </div>
        </div>

        <Divider className="!my-0 !border-slate-100" />

        {/* Section: Additional Info */}
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">
            Additional Information
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3">
            {mode === "in" && (
              <CustomSelect
                name="supplier"
                control={control}
                errors={errors}
                label="Supplier / Batch"
                placeholder="Select supplier"
                options={SUPPLIER_OPTIONS}
                size="large"
                showSearch
              />
            )}
            {mode === "out" && (
              <div>
                <FieldLabel>Linked Delivery ID</FieldLabel>
                <Controller
                  name="referenceId"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      size="large"
                      className="!rounded-lg"
                      placeholder="e.g. DEL-0326-01"
                    />
                  )}
                />
              </div>
            )}
            {mode === "adjust" && (
              <div>
                <FieldLabel>Date</FieldLabel>
                <Controller
                  name="date"
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      {...field}
                      size="large"
                      className="w-full !rounded-lg"
                      placeholder="Select date"
                    />
                  )}
                />
              </div>
            )}
            <div>
              <FieldLabel>Reference ID</FieldLabel>
              <Controller
                name="referenceId"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    size="large"
                    className="!rounded-lg"
                    placeholder="e.g. PO-0326-01"
                  />
                )}
              />
            </div>
          </div>

          {/* Notes - full width */}
          <div className="mt-3">
            <FieldLabel>Notes</FieldLabel>
            <Controller
              name="notes"
              control={control}
              render={({ field }) => (
                <Input.TextArea
                  {...field}
                  placeholder="Any remarks or notes about this entry..."
                  rows={2}
                  size="middle"
                  showCount
                  maxLength={200}
                  className="!rounded-lg"
                />
              )}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <p className="text-[10px] text-slate-400">
            All stock entries are logged in the movement history
          </p>
          <div className="flex items-center gap-3">
            <Button size="middle" onClick={handleClose} className="!rounded-lg">
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              size="middle"
              loading={loading}
              className={`!rounded-lg !font-semibold ${config.btnClass}`}
            >
              {config.btnLabel}
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default StockEntryModal;
