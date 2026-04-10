import React from "react";
import { Modal } from "antd";
import { HiOutlineClipboardList, HiOutlineX } from "react-icons/hi";
import { RiRouteLine } from "react-icons/ri";
import { ModalHeader } from "../Deliveryshared";
import { MOCK_ROUTES, MOCK_DELIVERIES } from "../../data/delivery";

interface BulkAssignModalProps {
  open: boolean;
  onClose: () => void;
}

const BulkAssignModal: React.FC<BulkAssignModalProps> = ({ open, onClose }) => (
  <Modal
    open={open}
    onCancel={onClose}
    footer={null}
    title={null}
    width={500}
    centered
    destroyOnClose
    closeIcon={<HiOutlineX className="w-5 h-5 text-slate-400" />}
  >
    <ModalHeader
      icon={<HiOutlineClipboardList className="w-5 h-5 text-violet-600" />}
      iconBg="bg-violet-100"
      title="Bulk Assign Deliveries"
      subtitle="Assign all pending deliveries by route"
      accentBorder="border-l-violet-500"
    />

    <div className="space-y-2.5">
      {MOCK_ROUTES.map((route) => {
        const pending = MOCK_DELIVERIES.filter(
          (d) => d.route === route.name && d.status === "pending"
        ).length;
        return (
          <div
            key={route.id}
            className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-200 hover:border-indigo-200 hover:bg-indigo-50/20 transition-all duration-200"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-100 flex items-center justify-center">
                <RiRouteLine className="w-4 h-4 text-indigo-600" />
              </div>
              <div>
                <span className="text-[13px] font-semibold text-slate-800">
                  {route.name}
                </span>
                <p className="text-[11px] text-slate-400">
                  {route.driver} · {pending} pending
                </p>
              </div>
            </div>
            <button
              disabled={pending === 0}
              className={`px-3.5 py-1.5 text-[12px] font-semibold rounded-xl transition-colors ${
                pending > 0
                  ? "bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm shadow-indigo-200"
                  : "bg-slate-100 text-slate-300 cursor-not-allowed"
              }`}
            >
              {pending > 0 ? "Assign All" : "No Pending"}
            </button>
          </div>
        );
      })}
    </div>
    <div className="flex justify-end mt-5">
      <button
        onClick={onClose}
        className="px-4 py-2 text-[13px] font-medium text-slate-500 hover:bg-slate-50 rounded-xl transition-colors"
      >
        Close
      </button>
    </div>
  </Modal>
);

export default BulkAssignModal;
