import React from "react";
import { Modal, Steps } from "antd";
import { HiOutlineX } from "react-icons/hi";
import type { Delivery } from "../../types/delivery";

interface DeliveryTimelineModalProps {
  open: boolean;
  onClose: () => void;
  delivery: Delivery | null;
}

const getCurrentStep = (status: Delivery["status"]) => {
  if (status === "delivered" || status === "failed") return 3;
  if (status === "out") return 1;
  return 0;
};

const DeliveryTimelineModal: React.FC<DeliveryTimelineModalProps> = ({
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
        <div className="mb-5">
          <h3 className="text-[16px] font-bold text-slate-800">
            Delivery Timeline
          </h3>
          <p className="text-[12px] text-slate-400">
            {delivery.id} · {delivery.customer}
          </p>
        </div>
        <Steps
          direction="vertical"
          size="small"
          current={getCurrentStep(delivery.status)}
          status={delivery.status === "failed" ? "error" : "process"}
          items={[
            {
              title: (
                <span className="text-[13px] font-semibold">Order Created</span>
              ),
              description: (
                <span className="text-[11px] text-slate-400">
                  Scheduled for {delivery.scheduledTime}
                </span>
              ),
            },
            {
              title: (
                <span className="text-[13px] font-semibold">
                  Out for Delivery
                </span>
              ),
              description: (
                <span className="text-[11px] text-slate-400">
                  Driver: {delivery.driver}
                </span>
              ),
            },
            {
              title: (
                <span className="text-[13px] font-semibold">
                  Reached Location
                </span>
              ),
              description: (
                <span className="text-[11px] text-slate-400">
                  {delivery.address}
                </span>
              ),
            },
            {
              title: (
                <span className="text-[13px] font-semibold">
                  {delivery.status === "failed" ? "Failed" : "Delivered"}
                </span>
              ),
              description: delivery.deliveredTime ? (
                <span className="text-[11px] text-emerald-500 font-medium">
                  {delivery.deliveredTime}
                </span>
              ) : (
                <span className="text-[11px] text-slate-400">Awaiting</span>
              ),
            },
          ]}
        />
        <div className="flex justify-end mt-4 pt-3 border-t border-slate-100">
          <button
            onClick={onClose}
            className="px-4 py-2 text-[13px] font-medium text-slate-500 hover:bg-slate-50 rounded-xl transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default DeliveryTimelineModal;
