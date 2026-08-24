import React from "react";
import { HiOutlineTrash, HiOutlineExclamationCircle } from "react-icons/hi";
import CustomModal from "../../../components/common/CustomModal";
import { formatCurrency } from "../../billing/utils/Helpers";
import { EventOrder } from "../types/Events";

interface Props {
  open: boolean;
  event: EventOrder | null;
  isDeleting?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

const Deleteeventordermodal: React.FC<Props> = ({
  open,
  event,
  isDeleting,
  onConfirm,
  onClose,
}) => {
  if (!event) return null;

  return (
    <CustomModal
      open={open}
      onClose={onClose}
      title="Delete Event Order"
      subtitle={`${event.eventNumber} — this cannot be undone`}
      icon={<HiOutlineTrash className="w-5 h-5" />}
      iconTone="red"
      size="md"
      closeOnOverlayClick={!isDeleting}
      closeOnEsc={!isDeleting}
      showCloseButton={!isDeleting}
      footer={
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2 text-[13px] font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="px-4 py-2 text-[13px] font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <HiOutlineTrash className="w-4 h-4" />
            {isDeleting ? "Deleting..." : "Delete Permanently"}
          </button>
        </div>
      }
    >
      <div className="space-y-4">
        <div className="flex items-start gap-3 bg-red-50 border border-red-100 rounded-xl p-4">
          <HiOutlineExclamationCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <p className="text-[13px] text-red-700">
            Permanently delete event <strong>{event.eventNumber}</strong> for{" "}
            <strong>{event.customerName}</strong>? This action cannot be undone.
          </p>
        </div>

        <div className="space-y-2">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
            This will
          </p>
          <ul className="space-y-2 text-[13px] text-gray-700">
            <li className="flex justify-between items-center border-b border-gray-100 pb-2">
              <span>Event type</span>
              <span className="font-semibold text-gray-900">
                {event.eventType}
              </span>
            </li>
            <li className="flex justify-between items-center border-b border-gray-100 pb-2">
              <span>Refund all payments</span>
              <span className="font-semibold text-emerald-600">
                {formatCurrency(event.advancePaid ?? 0)}
              </span>
            </li>
            <li className="flex justify-between items-center">
              <span>Remove pending balance</span>
              <span className="font-semibold text-amber-600">
                {formatCurrency(event.balanceDue ?? 0)}
              </span>
            </li>
          </ul>
        </div>
      </div>
    </CustomModal>
  );
};

export default Deleteeventordermodal;
