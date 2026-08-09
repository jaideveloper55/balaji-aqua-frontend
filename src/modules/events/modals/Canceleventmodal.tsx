import { useEffect, useState } from "react";
import { Input } from "antd";
import {
  HiOutlineExclamation,
  HiOutlineCalendar,
  HiOutlineLocationMarker,
  HiOutlineCash,
  HiOutlineCheck,
} from "react-icons/hi";

import CustomModal from "../../../components/common/CustomModal";
import { formatINR, formatDate } from "../constants/Events.constants";
import type { EventOrder, EventCancellationReason } from "../types/Events";

interface Props {
  event: EventOrder | null;
  open: boolean;
  onClose: () => void;
  onConfirm: (
    id: string,
    reason: EventCancellationReason,
    note?: string
  ) => void;
  isSubmitting?: boolean;
}

const REASON_OPTIONS: { label: string; value: EventCancellationReason }[] = [
  { label: "Customer postponed event", value: "CUSTOMER_POSTPONED" },
  { label: "Customer cancelled booking", value: "CUSTOMER_CANCELLED" },
  { label: "Date changed — rebooking separately", value: "DATE_CHANGED" },
  { label: "Payment not received", value: "PAYMENT_NOT_RECEIVED" },
  { label: "Stock unavailable", value: "STOCK_UNAVAILABLE" },
  { label: "Other", value: "OTHER" },
];

const CancelEventModal = ({
  event,
  open,
  onClose,
  onConfirm,
  isSubmitting = false,
}: Props) => {
  // Holds the ENUM VALUE, not the label
  const [selectedReason, setSelectedReason] = useState<
    EventCancellationReason | ""
  >("");
  // Free-text context (required for OTHER, optional for all others)
  const [noteText, setNoteText] = useState("");

  useEffect(() => {
    if (!open) {
      setSelectedReason("");
      setNoteText("");
    }
  }, [open]);

  if (!event) return null;

  const isOther = selectedReason === "OTHER";
  const canSubmit =
    !!selectedReason &&
    (!isOther || noteText.trim().length > 0) &&
    !isSubmitting;

  const handleConfirm = () => {
    if (!canSubmit || !selectedReason) return;
    onConfirm(
      event.id,
      selectedReason,
      noteText.trim() || undefined // don't send empty string
    );
    // No onClose() here — parent closes in cancelMutation.onSuccess
  };

  const footer = (
    <div className="flex gap-2">
      <button
        onClick={onClose}
        disabled={isSubmitting}
        className="flex-1 py-2.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 disabled:opacity-60 font-medium text-sm transition"
      >
        Keep Event
      </button>
      <button
        onClick={handleConfirm}
        disabled={!canSubmit}
        className="flex-1 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-medium text-sm transition shadow-sm flex items-center justify-center gap-2"
      >
        {isSubmitting ? (
          "Cancelling..."
        ) : (
          <>
            <HiOutlineCheck className="w-4 h-4" /> Confirm Cancellation
          </>
        )}
      </button>
    </div>
  );

  return (
    <CustomModal
      open={open}
      onClose={onClose}
      title="Cancel this event?"
      subtitle="This action will release reserved stock and notify the team"
      icon={<HiOutlineExclamation className="w-6 h-6" />}
      iconTone="red"
      size="md"
      footer={footer}
      bodyClassName="!p-0"
    >
      <div className="space-y-5">
        {/* Event Context Card */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
          <div className="text-[10px] font-semibold tracking-wider text-slate-500 uppercase mb-2">
            You are cancelling
          </div>
          <div className="font-semibold text-slate-900 truncate">
            {event.eventName}
          </div>
          <div className="text-xs text-slate-500 font-mono mt-0.5">
            {event.eventNumber}
          </div>
          <div className="mt-3 space-y-1.5 text-sm text-slate-700">
            <div className="flex items-center gap-2">
              <HiOutlineCalendar className="w-4 h-4 text-slate-400 shrink-0" />
              <span>
                {formatDate(event.eventDate)} · {event.deliveryTime}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <HiOutlineLocationMarker className="w-4 h-4 text-slate-400 shrink-0" />
              <span className="truncate">
                {event.venueName}, {event.venueCity}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <HiOutlineCash className="w-4 h-4 text-slate-400 shrink-0" />
              <span>
                Total{" "}
                <strong className="text-slate-900">
                  {formatINR(event.totalAmount)}
                </strong>
              </span>
            </div>
          </div>
        </div>

        {/* Advance Paid Warning */}
        {event.advancePaid > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
              <HiOutlineExclamation className="w-4 h-4 text-amber-700" />
            </div>
            <div className="text-sm text-amber-900">
              <div className="font-semibold">
                {formatINR(event.advancePaid)} advance was collected
              </div>
              <div className="text-xs text-amber-800 mt-0.5">
                You'll need to process a refund or credit note separately after
                cancelling.
              </div>
            </div>
          </div>
        )}

        {/* Reason Picker */}
        <div>
          <label className="text-sm font-medium text-slate-800 block mb-2">
            Reason for cancellation <span className="text-red-500">*</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {REASON_OPTIONS.map(({ label, value }) => {
              const active = selectedReason === value;
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => {
                    setSelectedReason(value);
                    if (value !== "OTHER") setNoteText("");
                  }}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition ${
                    active
                      ? "bg-red-600 border-red-600 text-white shadow-sm"
                      : "bg-white border-slate-300 text-slate-700 hover:border-red-400 hover:text-red-600"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>

          {/* Note textarea — required for OTHER, optional for others */}
          {selectedReason && (
            <div className="mt-3">
              <Input.TextArea
                rows={isOther ? 3 : 2}
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder={
                  isOther
                    ? "Describe the reason..."
                    : "Add more context (optional)"
                }
                maxLength={300}
                showCount
                autoFocus={isOther}
              />
              {isOther && noteText.trim().length === 0 && (
                <p className="text-xs text-red-500 mt-1">
                  Please describe the reason
                </p>
              )}
            </div>
          )}
        </div>

        {/* Final Summary — shows human label, not enum */}
        {selectedReason && (
          <div className="bg-red-50 border border-red-100 rounded-lg px-3 py-2 text-xs text-red-700">
            <strong>Reason:</strong>{" "}
            <span className="italic">
              {REASON_OPTIONS.find((r) => r.value === selectedReason)?.label}
            </span>
            {noteText.trim() && (
              <>
                {" "}
                · <span className="italic">"{noteText.trim()}"</span>
              </>
            )}
          </div>
        )}
      </div>
    </CustomModal>
  );
};

export default CancelEventModal;
