import React from "react";
import { Modal } from "antd";
import { HiOutlineX } from "react-icons/hi";
import { RiUserLocationLine } from "react-icons/ri";
import { DriverAvatar, ModalHeader } from "../Deliveryshared";
import { MOCK_DRIVERS } from "../../data/delivery";
import type { Delivery } from "../../types/delivery";

interface AssignDriverModalProps {
  open: boolean;
  onClose: () => void;
  delivery: Delivery | null;
}

const AssignDriverModal: React.FC<AssignDriverModalProps> = ({
  open,
  onClose,
  delivery,
}) => {
  if (!delivery) return null;

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      title={null}
      width={440}
      centered
      destroyOnClose
      closeIcon={<HiOutlineX className="w-5 h-5 text-slate-400" />}
    >
      <div>
        <ModalHeader
          icon={<RiUserLocationLine className="w-5 h-5 text-emerald-600" />}
          iconBg="bg-emerald-100"
          title="Assign Driver"
          subtitle={`${delivery.id} · ${delivery.customer}`}
          accentBorder="border-l-emerald-500"
        />

        <div className="space-y-2">
          {MOCK_DRIVERS.filter((d) => d.status === "active").map((driver) => (
            <button
              key={driver.id}
              onClick={() => {
                console.log(`Assign ${driver.name} to ${delivery.id}`);
                onClose();
              }}
              className="w-full flex items-center justify-between p-3.5 rounded-2xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/30 transition-all duration-200 text-left"
            >
              <div className="flex items-center gap-3">
                <DriverAvatar name={driver.name} size="md" />
                <div>
                  <div className="text-[13px] font-semibold text-slate-800">
                    {driver.name}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {driver.currentRoute} · {driver.pending} pending
                  </div>
                </div>
              </div>
              <span className="text-[12px] font-medium text-indigo-600">
                Select
              </span>
            </button>
          ))}
        </div>
        <div className="flex justify-end mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-[13px] font-medium text-slate-500 hover:bg-slate-50 rounded-xl transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default AssignDriverModal;
