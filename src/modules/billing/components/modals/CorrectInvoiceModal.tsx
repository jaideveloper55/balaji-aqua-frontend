import React from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { HiOutlinePencil } from "react-icons/hi";
import CustomModal from "../../../../components/common/CustomModal";
import CustomSelect from "../../../../components/common/CustomSelect";
import CustomInput from "../../../../components/common/CustomInput";

import {
  successNotification,
  errorNotification,
} from "../../../../components/common/Notification";
import authAxios from "../../../../lib/axios";
import { Invoice } from "../../types/billing";
import { formatCurrency } from "../../utils/Helpers";
import CustomTextArea from "../../../../components/common/Customtextarea";

interface Props {
  open: boolean;
  invoice: Invoice | null;
  onClose: () => void;
}

interface FormValues {
  paymentMode: string;
  referenceId: string;
  correctionNote: string;
}

const PAYMENT_MODES = [
  { value: "CASH", label: "Cash" },
  { value: "UPI", label: "UPI" },
  { value: "CARD", label: "Card" },
  { value: "BANK_TRANSFER", label: "Bank Transfer" },
  { value: "CREDIT", label: "Credit" },
];

const CorrectInvoiceModal: React.FC<Props> = ({ open, invoice, onClose }) => {
  const queryClient = useQueryClient();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      paymentMode: "",
      referenceId: "",
      correctionNote: "",
    },
  });

  // Reset form when modal opens with a new invoice
  React.useEffect(() => {
    if (open && invoice) {
      reset({
        paymentMode: "",
        referenceId: "",
        correctionNote: "",
      });
    }
  }, [open, invoice, reset]);

  const mutation = useMutation({
    mutationFn: (data: Partial<FormValues>) =>
      authAxios
        .patch(`/billing/invoices/${invoice!.id}/correct`, {
          paymentMode: data.paymentMode || undefined,
          referenceId: data.referenceId || undefined,
          correctionNote: data.correctionNote || undefined,
        })
        .then((r) => r.data),
    onSuccess: () => {
      successNotification(
        "Corrected",
        `Invoice ${invoice?.invoiceNo} payment mode updated`
      );
      // Refresh both tabs so they stay in sync
      queryClient.invalidateQueries({ queryKey: ["billing-invoices"] });
      queryClient.invalidateQueries({ queryKey: ["billing-payments"] });
      queryClient.invalidateQueries({ queryKey: ["billing-stats"] });
      queryClient.invalidateQueries({ queryKey: ["billing-outstanding"] });
      queryClient.invalidateQueries({ queryKey: ["billing-daily-summary"] });
      queryClient.invalidateQueries({ queryKey: ["payments"] });
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      onClose();
    },
    onError: (err: any) =>
      errorNotification("Failed", err?.message ?? "Could not correct invoice"),
  });

  const onSubmit = (data: FormValues) => {
    if (!data.paymentMode && !data.referenceId && !data.correctionNote) {
      errorNotification(
        "Nothing to change",
        "Select a new payment mode or enter a reference"
      );
      return;
    }
    mutation.mutate(data);
  };

  const footer = (
    <div className="flex gap-2">
      <button
        onClick={onClose}
        disabled={mutation.isPending}
        className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-[13px] font-medium hover:bg-gray-50 disabled:opacity-50"
      >
        Cancel
      </button>
      <button
        onClick={handleSubmit(onSubmit)}
        disabled={mutation.isPending}
        className="flex-[2] py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-[13px] font-semibold disabled:opacity-50 transition-all flex items-center justify-center gap-2"
      >
        {mutation.isPending ? (
          <>
            <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            Saving...
          </>
        ) : (
          "Save Correction"
        )}
      </button>
    </div>
  );

  return (
    <CustomModal
      open={open}
      onClose={onClose}
      title="Correct Invoice"
      subtitle={invoice?.invoiceNo ?? ""}
      icon={<HiOutlinePencil className="w-5 h-5" />}
      size="md"
      footer={footer}
    >
      <div className="space-y-4">
        {/* Current info */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5">
          <div className="grid grid-cols-2 gap-3 text-[12px]">
            <div>
              <span className="text-amber-600 font-medium">Invoice:</span>
              <span className="ml-1.5 text-gray-800 font-semibold">
                {invoice?.invoiceNo}
              </span>
            </div>
            <div>
              <span className="text-amber-600 font-medium">Amount:</span>
              <span className="ml-1.5 text-gray-800 font-semibold">
                {formatCurrency(invoice?.grandTotal ?? 0)}
              </span>
            </div>
            <div>
              <span className="text-amber-600 font-medium">Current mode:</span>
              <span className="ml-1.5 text-gray-800 font-semibold">
                {invoice?.paymentMode || "—"}
              </span>
            </div>
            <div>
              <span className="text-amber-600 font-medium">Customer:</span>
              <span className="ml-1.5 text-gray-800 font-semibold">
                {invoice?.customerName}
              </span>
            </div>
          </div>
          <p className="text-[11px] text-amber-700 mt-2.5">
            Only payment metadata is changed. Amounts and stock are not
            affected.
          </p>
        </div>

        {/* New Payment Mode */}
        <CustomSelect
          name="paymentMode"
          control={control}
          errors={errors}
          label="New Payment Mode"
          placeholder="Select correct mode"
          options={PAYMENT_MODES}
          size="large"
        />

        {/* Reference ID */}
        <CustomInput
          name="referenceId"
          control={control}
          errors={errors}
          label="Reference / Transaction ID"
          placeholder="UPI ref, NEFT number, card receipt..."
          size="large"
        />

        {/* Correction Note */}
        <CustomTextArea
          name="correctionNote"
          control={control}
          errors={errors}
          label="Correction Note"
          placeholder="e.g. Customer paid via UPI but cashier selected Cash by mistake"
          rows={2}
          maxLength={200}
          showCount
        />
      </div>
    </CustomModal>
  );
};

export default CorrectInvoiceModal;
