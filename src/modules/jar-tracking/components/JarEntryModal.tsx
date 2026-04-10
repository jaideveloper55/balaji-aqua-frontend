import React from "react";
import { Modal, Button, Input, Divider } from "antd";
import { Controller, useForm } from "react-hook-form";
import {
  HiOutlinePlusCircle,
  HiOutlineRefresh,
  HiOutlineExclamation,
} from "react-icons/hi";
import CustomInput from "../../../components/common/CustomInput";
import CustomSelect from "../../../components/common/CustomSelect";
import type { JarEntryFormValues, EntryType } from "../types/JarTracking";
import {
  ENTRY_TYPE_OPTIONS,
  CUSTOMER_OPTIONS,
  DRIVER_OPTIONS,
  ROUTE_OPTIONS,
} from "../constants/jarConstants";
import CustomDateRange from "../../../components/common/CustomDateRange";

const MODE_CONFIG: Record<
  EntryType,
  {
    icon: React.ReactNode;
    title: string;
    subtitle: string;
    iconBg: string;
    accentBorder: string;
    btnClass: string;
  }
> = {
  issue: {
    icon: <HiOutlinePlusCircle size={22} className="text-blue-500" />,
    title: "Issue Cans",
    subtitle: "Record cans issued to a customer via delivery",
    iconBg: "bg-blue-50",
    accentBorder: "border-l-blue-500",
    btnClass: "!bg-blue-600 hover:!bg-blue-700 !shadow-sm !shadow-blue-200",
  },
  return: {
    icon: <HiOutlineRefresh size={22} className="text-emerald-500" />,
    title: "Return Cans",
    subtitle: "Record cans returned by customer — update balance",
    iconBg: "bg-emerald-50",
    accentBorder: "border-l-emerald-500",
    btnClass:
      "!bg-emerald-600 hover:!bg-emerald-700 !shadow-sm !shadow-emerald-200",
  },
  damaged: {
    icon: <HiOutlineExclamation size={22} className="text-red-500" />,
    title: "Mark Damaged",
    subtitle: "Record damaged or broken cans for write-off",
    iconBg: "bg-red-50",
    accentBorder: "border-l-red-500",
    btnClass: "!bg-red-600 hover:!bg-red-700 !shadow-sm !shadow-red-200",
  },
};

interface JarEntryModalProps {
  open: boolean;
  onClose: () => void;
  entryType?: EntryType;
  onSubmit: (data: JarEntryFormValues) => void;
  loading?: boolean;
}

const JarEntryModal: React.FC<JarEntryModalProps> = ({
  open,
  onClose,
  entryType = "issue",
  onSubmit,
  loading = false,
}) => {
  const config = MODE_CONFIG[entryType];
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<JarEntryFormValues>({
    defaultValues: {
      customerId: "",
      quantity: "",
      type: entryType,
      date: null,
      driver: "",
      route: "",
      notes: "",
    },
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleFormSubmit = (data: JarEntryFormValues) => {
    onSubmit(data);
    reset();
  };

  return (
    <Modal
      open={open}
      onCancel={handleClose}
      footer={null}
      width={560}
      centered
      destroyOnClose
      className="!rounded-2xl"
    >
      {/* Header with accent border */}
      <div
        className={`flex items-center gap-3.5 mb-5 pl-4 border-l-[3px] ${config.accentBorder}`}
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
        {/* Section: Customer & Type */}
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">
            Customer & Type
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3">
            <CustomSelect
              name="customerId"
              control={control}
              errors={errors}
              label="Customer"
              placeholder="Search & select customer..."
              options={CUSTOMER_OPTIONS}
              isrequired
              size="large"
              showSearch
              rules={{ required: "Customer is required" }}
            />
            <CustomSelect
              name="type"
              control={control}
              errors={errors}
              label="Entry Type"
              placeholder="Select type"
              options={ENTRY_TYPE_OPTIONS}
              isrequired
              size="large"
              rules={{ required: "Type is required" }}
            />
          </div>
        </div>

        <Divider className="!my-0 !border-slate-100" />

        {/* Section: Quantity & Date */}
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">
            Quantity & Timing
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3">
            <CustomInput
              name="quantity"
              control={control}
              label="Quantity"
              placeholder="Number of cans"
              errors={errors}
              size="large"
              isrequired
              rules={{ required: "Quantity is required" }}
            />
            <CustomDateRange
              name="date"
              control={control}
              errors={errors}
              label="Date"
              size="large"
              isrequired
              rules={{ required: "Date is required" }}
            />
          </div>
        </div>

        <Divider className="!my-0 !border-slate-100" />

        {/* Section: Assignment */}
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">
            Assignment
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3">
            <CustomSelect
              name="driver"
              control={control}
              errors={errors}
              label="Driver"
              placeholder="Select driver"
              options={DRIVER_OPTIONS.filter((d) => d.value !== "")}
              size="large"
              showSearch
            />
            <CustomSelect
              name="route"
              control={control}
              errors={errors}
              label="Route"
              placeholder="Select route"
              options={ROUTE_OPTIONS.filter((r) => r.value !== "")}
              size="large"
            />
          </div>
        </div>

        <Divider className="!my-0 !border-slate-100" />

        {/* Notes */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[12px] font-semibold text-slate-600">
            Notes
          </label>
          <Controller
            name="notes"
            control={control}
            render={({ field }) => (
              <Input.TextArea
                {...field}
                placeholder="Any remarks about this entry..."
                rows={2}
                size="middle"
                showCount
                maxLength={200}
                className="!rounded-lg"
              />
            )}
          />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <p className="text-[10px] text-slate-400">
            All entries are logged in the transaction history
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
              {config.title}
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default JarEntryModal;
