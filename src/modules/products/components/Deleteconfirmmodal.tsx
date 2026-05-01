import React from "react";
import { Button } from "antd";
import {
  HiOutlineExclamation,
  HiOutlineTrash,
  HiOutlineX,
} from "react-icons/hi";
import CustomModal from "../../../components/common/CustomModal";

interface DeleteItemDetail {
  label: string;
  value: string | number;
  mono?: boolean;
}

interface DeleteConfirmModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  loading?: boolean;
  itemName: string;
  itemType?: string;
  details?: DeleteItemDetail[];
  warningMessage?: string;
  confirmLabel?: string;
}

const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  open,
  onClose,
  onConfirm,
  loading = false,
  itemName,
  itemType = "item",
  details = [],
  warningMessage,
  confirmLabel,
}) => {
  const handleConfirm = async () => {
    try {
      await onConfirm();
      onClose();
    } catch {
      // toast handled by hook — keep modal open so user can retry
    }
  };

  return (
    <CustomModal
      open={open}
      onClose={loading ? () => {} : onClose}
      title={`Delete ${itemType}?`}
      subtitle="This action is permanent and cannot be undone"
      icon={<HiOutlineTrash className="w-5 h-5" />}
      iconTone="red"
      size="md"
      showCloseButton={loading}
      footer={
        <div className="flex items-center justify-between gap-3">
          <p className="text-[11px] text-slate-400 flex items-center gap-1.5">
            <HiOutlineExclamation
              size={12}
              className="text-amber-500 shrink-0"
            />
            <span>You can't undo this</span>
          </p>
          <div className="flex items-center gap-3">
            <Button
              onClick={onClose}
              disabled={loading}
              className="!rounded-lg"
            >
              Cancel
            </Button>
            <Button
              danger
              type="primary"
              onClick={handleConfirm}
              loading={loading}
              icon={!loading && <HiOutlineTrash size={14} />}
              className="!rounded-lg !font-semibold !shadow-sm !shadow-red-500/25"
            >
              {confirmLabel || `Delete ${itemType}`}
            </Button>
          </div>
        </div>
      }
    >
      <div className="flex flex-col gap-4">
        {/* Hero card — the thing being deleted */}
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-red-50/60 via-white to-orange-50/40 ring-1 ring-red-100 p-4">
          {/* Decorative left accent */}
          <div
            className="absolute left-0 top-0 bottom-0 w-1 bg-red-500"
            aria-hidden
          />

          <div className="flex items-start gap-3 pl-2">
            <div className="w-10 h-10 rounded-xl bg-red-100 ring-1 ring-red-200 flex items-center justify-center shrink-0">
              <HiOutlineX size={18} className="text-red-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-bold text-red-700 uppercase tracking-wider">
                About to delete
              </p>
              <p className="text-[15px] font-bold text-slate-800 leading-tight mt-0.5 truncate">
                {itemName}
              </p>

              {details.length > 0 && (
                <div className="flex items-center gap-1.5 flex-wrap mt-2">
                  {details.map((d, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1 text-[10px] font-medium text-slate-600 bg-white ring-1 ring-slate-200 px-1.5 py-0.5 rounded-md"
                    >
                      <span className="text-slate-400">{d.label}:</span>
                      <span
                        className={`font-bold text-slate-700 ${
                          d.mono ? "font-mono tabular-nums" : ""
                        }`}
                      >
                        {d.value}
                      </span>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Warning callout */}
        <div className="flex items-start gap-2.5 p-3 rounded-lg bg-amber-50/50 ring-1 ring-amber-100">
          <HiOutlineExclamation
            size={16}
            className="text-amber-600 shrink-0 mt-0.5"
          />
          <p className="text-[12px] text-slate-700 leading-relaxed">
            {warningMessage ||
              `This ${itemType.toLowerCase()} will be permanently removed from your records. Any related data may also be affected.`}
          </p>
        </div>
      </div>
    </CustomModal>
  );
};

export default DeleteConfirmModal;
