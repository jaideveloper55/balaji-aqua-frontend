import React from "react";
import { Modal } from "antd";
import {
  HiOutlineX,
  HiOutlineClock,
  HiOutlineCheckCircle,
  HiOutlineLocationMarker,
  HiOutlinePhone,
} from "react-icons/hi";
import {
  BsPerson,
  BsTruck,
  BsClockHistory,
  BsArrowRepeat,
} from "react-icons/bs";
import { IoWaterOutline, IoCheckmarkDoneCircleOutline } from "react-icons/io5";
import { RiRouteLine } from "react-icons/ri";
import { StatusPill } from "../Deliveryshared";
import type { Delivery } from "../../types/delivery";

interface DeliveryDetailModalProps {
  open: boolean;
  onClose: () => void;
  delivery: Delivery | null;
  onMarkDelivered: (delivery: Delivery) => void;
  onReschedule: (delivery: Delivery) => void;
  onTrackTimeline: (delivery: Delivery) => void;
}

const DeliveryDetailModal: React.FC<DeliveryDetailModalProps> = ({
  open,
  onClose,
  delivery,
  onMarkDelivered,
  onReschedule,
  onTrackTimeline,
}) => {
  if (!delivery) return null;

  const rows = [
    {
      icon: <BsPerson className="w-4 h-4" />,
      label: "Customer",
      value: delivery.customer,
    },
    {
      icon: <HiOutlinePhone className="w-4 h-4" />,
      label: "Phone",
      value: delivery.phone,
    },
    {
      icon: <HiOutlineLocationMarker className="w-4 h-4" />,
      label: "Address",
      value: delivery.address,
    },
    {
      icon: <RiRouteLine className="w-4 h-4" />,
      label: "Route",
      value: delivery.route,
    },
    {
      icon: <BsTruck className="w-4 h-4" />,
      label: "Driver",
      value: delivery.driver,
    },
    {
      icon: <IoWaterOutline className="w-4 h-4" />,
      label: "Items",
      value: `${delivery.qty} × ${delivery.items}`,
    },
    {
      icon: <HiOutlineClock className="w-4 h-4" />,
      label: "Scheduled",
      value: delivery.scheduledTime,
    },
    {
      icon: <HiOutlineCheckCircle className="w-4 h-4" />,
      label: "Delivered",
      value: delivery.deliveredTime || "—",
    },
  ];

  return (
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
      <div>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-[16px] font-bold text-slate-800">
              {delivery.id}
            </h3>
            <p className="text-[12px] text-slate-400">Delivery Details</p>
          </div>
          <StatusPill status={delivery.status} />
        </div>

        <div className="space-y-0">
          {rows.map((row) => (
            <div
              key={row.label}
              className="flex items-center gap-3 py-2.5 border-b border-slate-100 last:border-0"
            >
              <span className="text-slate-400 shrink-0">{row.icon}</span>
              <span className="text-[12px] text-slate-400 w-20 shrink-0">
                {row.label}
              </span>
              <span className="text-[13px] text-slate-700 font-medium">
                {row.value}
              </span>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2 mt-5 pt-4 border-t border-slate-100">
          {delivery.status !== "delivered" && (
            <button
              onClick={() => {
                onMarkDelivered(delivery);
                onClose();
              }}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-emerald-600 text-white text-[13px] font-semibold rounded-xl hover:bg-emerald-700 transition-colors shadow-sm shadow-emerald-200"
            >
              <IoCheckmarkDoneCircleOutline className="w-4 h-4" />
              Mark Delivered
            </button>
          )}
          <button
            onClick={() => {
              onClose();
              onReschedule(delivery);
            }}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-slate-100 text-slate-600 text-[13px] font-medium rounded-xl hover:bg-slate-200 transition-colors"
          >
            <BsArrowRepeat className="w-3.5 h-3.5" />
            Reschedule
          </button>
          <button
            onClick={() => {
              onClose();
              onTrackTimeline(delivery);
            }}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-slate-100 text-slate-600 text-[13px] font-medium rounded-xl hover:bg-slate-200 transition-colors"
          >
            <BsClockHistory className="w-3.5 h-3.5" />
            Timeline
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default DeliveryDetailModal;
